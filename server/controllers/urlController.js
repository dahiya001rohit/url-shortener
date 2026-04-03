import { nanoid } from "nanoid";
import Url from "../models/Url.js";
import Click from "../models/Click.js";
import redisClient from "../services/redis.js";
import { analyticsQueue } from "../services/queue.js";

export async function shortenUrl(req, res, next) {
  try {
    const { originalUrl, expiresAt, customAlias } = req.body;

    let shortCode;
    if (customAlias) {
      const trimmed = customAlias.trim();
      if (!/^[a-zA-Z0-9-]+$/.test(trimmed)) {
        return res.status(400).json({ message: "Alias must be alphanumeric and hyphens only" });
      }
      const existing = await Url.findOne({ shortCode: trimmed });
      if (existing) return res.status(409).json({ message: "Alias already taken" });
      shortCode = trimmed;
    } else {
      shortCode = nanoid(6);
    }

    const url = await Url.create({
      originalUrl,
      shortCode,
      userId: req.user.id,
      ...(expiresAt && { expiresAt: new Date(expiresAt) }),
    });

    res.status(201).json({
      _id: url._id,
      shortUrl: `${process.env.BASE_URL}/${shortCode}`,
      shortCode,
      originalUrl: url.originalUrl,
      clicks: 0,
      createdAt: url.createdAt,
      expiresAt: url.expiresAt || null,
    });
  } catch (err) {
    next(err);
  }
}

export async function redirectUrl(req, res, next) {
  try {
    const { shortCode } = req.params;

    const cached = await redisClient.get(`url:${shortCode}`);
    if (cached) {
      const { urlId, originalUrl, expiresAt } = JSON.parse(cached);
      if (expiresAt && new Date(expiresAt) < new Date())
        return res.status(410).json({ message: "This link has expired" });
      analyticsQueue.add("click", {
        urlId,
        shortCode,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        referrer: req.headers["referer"],
      });
      return res.redirect(originalUrl);
    }

    const url = await Url.findOne({ shortCode });
    if (!url) return res.status(404).json({ message: "Short URL not found" });

    if (url.expiresAt && url.expiresAt < new Date())
      return res.status(410).json({ message: "This link has expired" });

    await redisClient.set(
      `url:${shortCode}`,
      JSON.stringify({ urlId: url._id, originalUrl: url.originalUrl, expiresAt: url.expiresAt }),
      "EX",
      3600
    );

    analyticsQueue.add("click", {
      urlId: url._id,
      shortCode,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      referrer: req.headers["referer"],
    });

    res.redirect(url.originalUrl);
  } catch (err) {
    next(err);
  }
}

export async function getMyUrls(req, res, next) {
  try {
    const urls = await Url.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(urls);
  } catch (err) {
    next(err);
  }
}

export async function deleteUrl(req, res, next) {
  try {
    const url = await Url.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!url) return res.status(404).json({ message: "URL not found or unauthorized" });
    await redisClient.del(`url:${url.shortCode}`);
    res.json({ message: "URL deleted" });
  } catch (err) {
    next(err);
  }
}

export async function editUrl(req, res, next) {
  try {
    const { originalUrl, expiresAt } = req.body;
    const url = await Url.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      {
        ...(originalUrl && { originalUrl }),
        ...(expiresAt !== undefined && { expiresAt: expiresAt ? new Date(expiresAt) : null }),
      },
      { new: true }
    );
    if (!url) return res.status(404).json({ message: "URL not found or unauthorized" });
    await redisClient.del(`url:${url.shortCode}`);
    res.json(url);
  } catch (err) {
    next(err);
  }
}

export async function getStats(req, res, next) {
  try {
    const urls = await Url.find({ userId: req.user.id });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayClicks = await Click.countDocuments({
      urlId: { $in: urls.map((u) => u._id) },
      timestamp: { $gte: todayStart },
    });

    const activeLinks = urls.filter(
      (u) => !u.expiresAt || u.expiresAt > new Date()
    ).length;

    const totalReach = urls.reduce((sum, u) => sum + (u.clicks || 0), 0);

    const topLink = [...urls].sort((a, b) => (b.clicks || 0) - (a.clicks || 0))[0];

    res.json({
      todayClicks,
      activeLinks,
      totalReach,
      totalLinks: urls.length,
      topLink: topLink
        ? { shortCode: topLink.shortCode, clicks: topLink.clicks }
        : null,
    });
  } catch (err) {
    next(err);
  }
}

export async function getRecentActivity(req, res, next) {
  try {
    const urls = await Url.find({ userId: req.user.id });
    const urlIds = urls.map((u) => u._id);
    const urlMap = Object.fromEntries(urls.map((u) => [u._id.toString(), u]));

    const recentClicks = await Click.find({ urlId: { $in: urlIds } })
      .sort({ timestamp: -1 })
      .limit(10);

    const recentUrls = await Url.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(3);

    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    const events = [];

    for (const click of recentClicks) {
      const url = urlMap[click.urlId.toString()];
      if (!url) continue;
      events.push({
        type: "click_milestone",
        message: `snip.ly/${url.shortCode} received a click`,
        time: click.timestamp,
        icon: "MousePointer2",
      });
    }

    for (const url of recentUrls) {
      events.push({
        type: "new_link",
        message: `New snip created: snip.ly/${url.shortCode}`,
        time: url.createdAt,
        icon: "Link2",
      });
    }

    for (const url of urls) {
      if (
        url.expiresAt &&
        url.expiresAt > now &&
        url.expiresAt <= threeDaysFromNow
      ) {
        events.push({
          type: "expiry_warning",
          message: `snip.ly/${url.shortCode} expires soon`,
          time: now,
          icon: "AlertTriangle",
        });
      }
    }

    events.sort((a, b) => new Date(b.time) - new Date(a.time));

    res.json(events.slice(0, 8));
  } catch (err) {
    next(err);
  }
}

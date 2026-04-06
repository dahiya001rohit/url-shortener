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
  const { shortCode } = req.params;

  try {
    const cached = await redisClient.get(`url:${shortCode}`);

    if (cached) {
      const { urlId, originalUrl, expiresAt } = JSON.parse(cached);
      if (expiresAt && new Date(expiresAt) < new Date())
        return res.status(410).json({ message: "This link has expired" });

      res.redirect(originalUrl);

      analyticsQueue.add("click", {
        urlId,
        shortCode,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        referrer: req.headers["referer"] || "Direct",
      }).catch((err) => console.error("Queue error:", err));

      return;
    }

    const url = await Url.findOne({ shortCode });

    if (!url) return res.status(404).json({ message: "Short URL not found" });

    if (url.expiresAt && url.expiresAt < new Date())
      return res.status(410).json({ message: "This link has expired" });

    res.redirect(url.originalUrl);

    // Fire-and-forget: cache + analytics
    redisClient.set(
      `url:${shortCode}`,
      JSON.stringify({ urlId: url._id.toString(), originalUrl: url.originalUrl, expiresAt: url.expiresAt }),
      "EX",
      3600
    ).catch((err) => console.error("Cache set error:", err));

    analyticsQueue.add("click", {
      urlId: url._id.toString(),
      shortCode,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      referrer: req.headers["referer"] || "Direct",
    }).catch((err) => console.error("Queue error:", err));

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
    const now = new Date();
    const urlIds = urls.map((u) => u._id);

    const thisWeekStart = new Date();
    thisWeekStart.setDate(now.getDate() - 7);
    thisWeekStart.setHours(0, 0, 0, 0);

    const lastWeekStart = new Date();
    lastWeekStart.setDate(now.getDate() - 14);
    lastWeekStart.setHours(0, 0, 0, 0);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const linksThisWeek = urls.filter((u) => new Date(u.createdAt) >= thisWeekStart).length;
    const linksLastWeek = urls.filter(
      (u) => new Date(u.createdAt) >= lastWeekStart && new Date(u.createdAt) < thisWeekStart
    ).length;

    const [clicksThisWeek, clicksLastWeek, todayClicks] = await Promise.all([
      Click.countDocuments({ urlId: { $in: urlIds }, timestamp: { $gte: thisWeekStart } }),
      Click.countDocuments({ urlId: { $in: urlIds }, timestamp: { $gte: lastWeekStart, $lt: thisWeekStart } }),
      Click.countDocuments({ urlId: { $in: urlIds }, timestamp: { $gte: todayStart } }),
    ]);

    const activeLinks = urls.filter((u) => !u.expiresAt || u.expiresAt > now).length;
    const expiredLinks = urls.length - activeLinks;
    const totalReach = urls.reduce((sum, u) => sum + (u.clicks || 0), 0);
    const topLink = [...urls].sort((a, b) => (b.clicks || 0) - (a.clicks || 0))[0];

    function trendPct(current, previous) {
      if (previous === 0 && current === 0) return null;
      if (previous === 0) return { value: 100, direction: "up" };
      const pct = Math.round(((current - previous) / previous) * 100);
      return { value: Math.min(Math.abs(pct), 999), direction: pct >= 0 ? "up" : "down" };
    }

    res.json({
      totalLinks: urls.length,
      totalClicks: totalReach,
      activeLinks,
      expiredLinks,
      todayClicks,
      totalReach,
      topLink: topLink ? { shortCode: topLink.shortCode, clicks: topLink.clicks } : null,
      trends: {
        links: {
          thisWeek: linksThisWeek,
          lastWeek: linksLastWeek,
          pct: trendPct(linksThisWeek, linksLastWeek),
        },
        clicks: {
          thisWeek: clicksThisWeek,
          lastWeek: clicksLastWeek,
          pct: trendPct(clicksThisWeek, clicksLastWeek),
        },
      },
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

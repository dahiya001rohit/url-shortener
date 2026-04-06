import { nanoid } from "nanoid";
import Url from "../models/Url.js";
import Click from "../models/Click.js";
import User from "../models/User.js";
import redisClient from "../services/redis.js";
import { analyticsQueue } from "../services/queue.js";

export async function shortenUrl(req, res, next) {
  try {
    const userDoc = await User.findById(req.user.id).select("preferences");
    const prefs = userDoc?.preferences;

    // Determine short code
    let shortCode;
    if (req.body.customAlias) {
      const trimmed = req.body.customAlias.trim();
      if (!/^[a-zA-Z0-9-]+$/.test(trimmed)) {
        return res.status(400).json({ message: "Alias must be alphanumeric and hyphens only" });
      }
      const existing = await Url.findOne({ shortCode: trimmed });
      if (existing) return res.status(409).json({ message: "Alias already taken" });
      shortCode = trimmed;
    } else {
      const style = prefs?.links?.aliasStyle || "Word-Scale";
      if (style === "Short-Hash") shortCode = nanoid(4);
      else if (style === "Alpha-Numeric") shortCode = nanoid(8);
      else shortCode = nanoid(6);
    }

    // Determine expiry
    let expiresAt = req.body.expiresAt;
    if (!expiresAt && prefs?.links?.defaultExpiry && prefs.links.defaultExpiry !== "never") {
      const daysMap = { "24h": 1, "7d": 7, "30d": 30, "90d": 90 };
      const days = daysMap[prefs.links.defaultExpiry];
      if (days) {
        expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
      }
    }

    // Apply UTM params
    let originalUrl = req.body.originalUrl;
    if (prefs?.links?.utmEnabled) {
      const params = new URLSearchParams();
      if (prefs.links.utmSource)   params.set("utm_source",   prefs.links.utmSource);
      if (prefs.links.utmMedium)   params.set("utm_medium",   prefs.links.utmMedium);
      if (prefs.links.utmCampaign) params.set("utm_campaign", prefs.links.utmCampaign);
      if ([...params].length > 0) {
        const sep = originalUrl.includes("?") ? "&" : "?";
        originalUrl = `${originalUrl}${sep}${params.toString()}`;
      }
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

const APP_DOMAINS = [
  "youtube.com", "youtu.be",
  "instagram.com",
  "twitter.com", "x.com",
  "tiktok.com",
  "spotify.com",
  "facebook.com",
  "linkedin.com",
  "snapchat.com",
  "reddit.com",
  "whatsapp.com",
];

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function serveRedirectPage(res, originalUrl, status = 200) {
  const safeUrl = escapeHtml(originalUrl);
  const clientUrl = process.env.CLIENT_URL || "";
  return res.status(status).send(`<!DOCTYPE html>
<html>
<head>
  <title>Redirecting... — Snip</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="refresh" content="0;url=${safeUrl}">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Inter, -apple-system, sans-serif; background: #FAF9F8; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
    .card { background: white; border: 1px solid #BFC8C7; border-radius: 1rem; padding: 2rem; text-align: center; max-width: 360px; width: 100%; box-shadow: 0 4px 24px rgba(0,47,45,0.08); }
    .logo { font-size: 1.25rem; font-weight: 900; color: #002F2D; margin-bottom: 1.5rem; font-style: italic; }
    .spinner { width: 36px; height: 36px; border: 3px solid #E3E2E1; border-top-color: #002F2D; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1.25rem; }
    @keyframes spin { to { transform: rotate(360deg); } }
    h2 { font-size: 1rem; color: #1A1C1C; margin-bottom: 0.5rem; }
    .url { font-family: monospace; font-size: 0.75rem; color: #707978; word-break: break-all; margin-bottom: 1.25rem; background: #F4F3F2; padding: 0.5rem 0.75rem; border-radius: 0.5rem; }
    .btn { display: inline-block; background: #002F2D; color: white; padding: 0.625rem 1.25rem; border-radius: 999px; font-size: 0.8125rem; font-weight: 700; text-decoration: none; margin-bottom: 0.75rem; }
    .skip { display: block; font-size: 0.75rem; color: #707978; text-decoration: none; margin-top: 0.5rem; }
    .snip-badge { margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #E3E2E1; font-size: 0.7rem; color: #BFC8C7; font-family: monospace; }
    .snip-badge a { color: #002F2D; text-decoration: none; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">Snip.</div>
    <div class="spinner"></div>
    <h2>Taking you there...</h2>
    <div class="url">${safeUrl}</div>
    <a href="${safeUrl}" class="btn">Open Link →</a>
    <a href="${safeUrl}" class="skip">Tap here if not redirected</a>
    <div class="snip-badge">Shortened with <a href="${escapeHtml(clientUrl)}">Snip</a></div>
  </div>
  <script>
    var dest = ${JSON.stringify(originalUrl)};
    setTimeout(function() { window.location.href = dest; }, 800);
    document.addEventListener("visibilitychange", function() {
      if (document.hidden) { clearTimeout(); }
    });
  </script>
</body>
</html>`);
}

function serve404(res) {
  const clientUrl = process.env.CLIENT_URL || "";
  return res.status(404).send(`<!DOCTYPE html>
<html>
<head>
  <title>Link Not Found — Snip</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: Inter, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #FAF9F8; color: #1A1C1C; }
    .card { text-align: center; padding: 2rem; }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    p { color: #5F5E5E; font-size: 0.875rem; }
    a { display: inline-block; margin-top: 1rem; color: #002F2D; font-size: 0.875rem; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Link Not Found</h1>
    <p>This short link does not exist or has been deleted.</p>
    <a href="${escapeHtml(clientUrl)}">Go to Snip →</a>
  </div>
</body>
</html>`);
}

function serve410(res) {
  const clientUrl = process.env.CLIENT_URL || "";
  return res.status(410).send(`<!DOCTYPE html>
<html>
<head>
  <title>Link Expired — Snip</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: Inter, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #FAF9F8; }
    .card { text-align: center; padding: 2rem; }
    h1 { font-size: 1.5rem; color: #BA1A1A; }
    p { color: #5F5E5E; font-size: 0.875rem; }
    a { display: inline-block; margin-top: 1rem; color: #002F2D; font-size: 0.875rem; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Link Expired</h1>
    <p>This short link has expired and is no longer active.</p>
    <a href="${escapeHtml(clientUrl)}">Go to Snip →</a>
  </div>
</body>
</html>`);
}

export async function redirectUrl(req, res, next) {
  const { shortCode } = req.params;

  try {
    let originalUrl, urlId, expiresAt, userId;

    const cached = await redisClient.get(`url:${shortCode}`);
    if (cached) {
      ({ originalUrl, urlId, expiresAt, userId } = JSON.parse(cached));
    } else {
      const url = await Url.findOne({ shortCode });
      if (!url) return serve404(res);

      originalUrl = url.originalUrl;
      urlId = url._id.toString();
      expiresAt = url.expiresAt;
      userId = url.userId?.toString();

      redisClient.set(
        `url:${shortCode}`,
        JSON.stringify({ urlId, originalUrl, expiresAt, userId }),
        "EX",
        3600
      ).catch((err) => console.error("Cache set error:", err));
    }

    if (expiresAt && new Date(expiresAt) < new Date()) return serve410(res);

    // Fire-and-forget analytics with privacy gate
    User.findById(userId).select("preferences").then((owner) => {
      const allowTracking = owner?.preferences?.privacy?.allowAnonymousTracking !== false;
      if (allowTracking) {
        analyticsQueue.add("click", {
          urlId,
          shortCode,
          ip: req.ip,
          userAgent: req.headers["user-agent"],
          referrer: req.headers["referer"] || "Direct",
        }).catch((err) => console.error("Queue error:", err));
      }
    }).catch(() => {});

    const ua = req.headers["user-agent"] || "";
    const isMobile = /Mobile|Android|iPhone|iPad/i.test(ua);
    const isAppUrl = APP_DOMAINS.some((domain) => originalUrl.includes(domain));

    if (isMobile && isAppUrl) return serveRedirectPage(res, originalUrl);

    return res.redirect(originalUrl);

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
      if (url.expiresAt && url.expiresAt > now && url.expiresAt <= threeDaysFromNow) {
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

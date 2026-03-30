import { nanoid } from "nanoid";
import Url from "../models/Url.js";
import redisClient from "../services/redis.js";
import { analyticsQueue } from "../services/queue.js";

export async function shortenUrl(req, res) {
  const { originalUrl, expiresAt } = req.body;
  if (!originalUrl) return res.status(400).json({ message: "originalUrl is required" });

  const shortCode = nanoid(6);
  const url = await Url.create({
    originalUrl,
    shortCode,
    userId: req.user.id,
    ...(expiresAt && { expiresAt: new Date(expiresAt) }),
  });

  res.status(201).json({
    shortUrl: `${process.env.BASE_URL}/${shortCode}`,
    shortCode,
    originalUrl: url.originalUrl,
    expiresAt: url.expiresAt,
  });
}

export async function redirectUrl(req, res) {
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
}

export async function getMyUrls(req, res) {
  const urls = await Url.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(urls);
}

export async function deleteUrl(req, res) {
  const url = await Url.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!url) return res.status(404).json({ message: "URL not found or unauthorized" });
  await redisClient.del(`url:${url.shortCode}`);
  res.json({ message: "URL deleted" });
}

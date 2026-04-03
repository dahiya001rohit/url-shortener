import Click from "../models/Click.js";
import Url from "../models/Url.js";

export async function getUrlAnalytics(req, res, next) {
  try {
    const { shortCode } = req.params;

    const url = await Url.findOne({ shortCode, userId: req.user.id });
    if (!url) return res.status(404).json({ message: "URL not found or unauthorized" });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      totalClicks,
      uniqueVisitorDocs,
      clicksPerDay,
      topCountries,
      deviceBreakdown,
      browserBreakdown,
      topReferrers,
    ] = await Promise.all([
      Click.countDocuments({ shortCode }),

      Click.distinct("ip", { shortCode }),

      Click.aggregate([
        { $match: { shortCode, timestamp: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      Click.aggregate([
        { $match: { shortCode } },
        { $group: { _id: "$country", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),

      Click.aggregate([
        { $match: { shortCode } },
        { $group: { _id: "$device", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      Click.aggregate([
        { $match: { shortCode } },
        { $group: { _id: "$browser", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      Click.aggregate([
        { $match: { shortCode } },
        { $group: { _id: "$referrer", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
    ]);

    const uniqueVisitors = uniqueVisitorDocs.length;
    const avgPerDay = Math.round(totalClicks / 7);
    const clickRate = uniqueVisitors > 0
      ? ((totalClicks / uniqueVisitors) * 100).toFixed(1)
      : "0.0";

    res.json({
      totalClicks,
      uniqueVisitors,
      clickRate,
      avgPerDay,
      clicksPerDay,
      topCountries,
      deviceBreakdown,
      browserBreakdown,
      topReferrers,
      link: {
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        createdAt: url.createdAt,
        expiresAt: url.expiresAt || null,
        clicks: url.clicks,
        status: url.expiresAt && new Date(url.expiresAt) < new Date()
          ? "expired" : "active",
      },
    });
  } catch (err) {
    next(err);
  }
}

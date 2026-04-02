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
    const daysSinceCreated = Math.max(
      1,
      Math.ceil((Date.now() - new Date(url.createdAt).getTime()) / 86400000)
    );
    const avgPerDay = parseFloat((totalClicks / daysSinceCreated).toFixed(2));
    const clickRate = totalClicks > 0 ? parseFloat(((uniqueVisitors / totalClicks) * 100).toFixed(1)) : 0;

    res.json({
      link: {
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        createdAt: url.createdAt,
        expiresAt: url.expiresAt || null,
      },
      totalClicks,
      uniqueVisitors,
      avgPerDay,
      clickRate,
      clicksPerDay,
      topCountries,
      deviceBreakdown,
      browserBreakdown,
      topReferrers,
    });
  } catch (err) {
    next(err);
  }
}

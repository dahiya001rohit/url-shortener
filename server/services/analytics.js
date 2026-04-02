import { UAParser } from "ua-parser-js";
import geoip from "geoip-lite";
import Click from "../models/Click.js";
import Url from "../models/Url.js";

export async function processClick(job) {
  console.log(`job`, job.data )
  const { urlId, shortCode, ip, userAgent, referrer } = job.data;

  const parser = new UAParser(userAgent);
  const browserName = parser.getBrowser().name || "Unknown";
  const deviceType = parser.getDevice().type;
  const device = deviceType === "mobile"
    ? "mobile"
    : deviceType === "tablet"
    ? "tablet"
    : "desktop";

  const geo = geoip.lookup(ip);
  const country = geo?.country || "Unknown";

  console.log({
    urlId,
    shortCode,
    ip,
    country,
    device,
    browser: browserName,
    referrer: referrer || "Direct",
  });
  await Click.create({
      urlId,
      shortCode,
      ip,
      country,
      device,
      browser: browserName,
      referrer: referrer || "Direct",
  });

  await Url.findByIdAndUpdate(urlId, { $inc: { clicks: 1 } });
}

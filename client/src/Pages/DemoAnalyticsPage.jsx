import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AnalyticsHeader from "../components/analytics/AnalyticsHeader";
import AnalyticsStatCards from "../components/analytics/AnalyticsStatCards";
import ClickChart from "../components/analytics/ClickChart";
import DeviceChart from "../components/analytics/DeviceChart";
import CountryList from "../components/analytics/CountryList";
import ReferrerList from "../components/analytics/ReferrerList";
import BrowserChart from "../components/analytics/BrowserChart";
import InsightCard from "../components/analytics/InsightCard";
import LinkDetails from "../components/analytics/LinkDetails";

// ─── Demo banner ──────────────────────────────────────────────────────────────
function DemoBanner() {
  const navigate = useNavigate();
  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] h-10 flex items-center justify-center px-4"
      style={{ background: "#FFB95F" }}
    >
      <span className="text-xs font-mono text-[#2A1700] mr-3">
        ✦ You're viewing a live demo — Sign up free to start shortening your own links
      </span>
      <button
        onClick={() => navigate("/register")}
        className="bg-primary text-white rounded-full px-4 py-1.5 text-xs font-mono shrink-0"
      >
        Create Account →
      </button>
    </div>
  );
}

// ─── Hardcoded demo analytics ─────────────────────────────────────────────────
const DEMO_ANALYTICS = {
  totalClicks: 12482,
  uniqueVisitors: 8291,
  clickRate: "68.2",
  avgPerDay: 142,
  clicksPerDay: [
    { _id: "2026-03-25", count: 987 },
    { _id: "2026-03-26", count: 1243 },
    { _id: "2026-03-27", count: 891 },
    { _id: "2026-03-28", count: 1567 },
    { _id: "2026-03-29", count: 2103 },
    { _id: "2026-03-30", count: 1876 },
    { _id: "2026-03-31", count: 1815 },
  ],
  deviceBreakdown: [
    { _id: "mobile", count: 7239 },
    { _id: "desktop", count: 4244 },
    { _id: "tablet", count: 999 },
  ],
  topCountries: [
    { _id: "India", count: 5243 },
    { _id: "United States", count: 3494 },
    { _id: "United Kingdom", count: 1373 },
    { _id: "Germany", count: 1123 },
    { _id: "Canada", count: 1249 },
  ],
  topReferrers: [
    { _id: "Direct", count: 4823 },
    { _id: "twitter.com", count: 2841 },
    { _id: "linkedin.com", count: 1923 },
    { _id: "instagram.com", count: 1247 },
  ],
  browserBreakdown: [
    { _id: "Chrome", count: 7739 },
    { _id: "Safari", count: 2996 },
    { _id: "Firefox", count: 1123 },
    { _id: "Edge", count: 624 },
  ],
  link: {
    originalUrl: "https://archdaily.com/modernist-residence-2026",
    shortCode: "arch-daily",
    createdAt: "2026-03-25T00:00:00.000Z",
    expiresAt: null,
    status: "active",
  },
};

export default function DemoAnalyticsPage() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState("7D");
  const { link } = DEMO_ANALYTICS;

  const stats = {
    totalClicks: DEMO_ANALYTICS.totalClicks,
    uniqueVisitors: DEMO_ANALYTICS.uniqueVisitors,
    clickRate: DEMO_ANALYTICS.clickRate,
    avgPerDay: DEMO_ANALYTICS.avgPerDay,
  };

  return (
    <div className="min-h-screen bg-background">
      <DemoBanner />

      <div className="pt-10">
        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-10 xl:px-16 pt-28 pb-24">
          {/* Back to demo */}
          <button
            onClick={() => navigate("/demo")}
            className="mb-6 text-xs font-mono uppercase tracking-widest text-secondary hover:text-primary transition-colors flex items-center gap-1.5"
          >
            ← Back to Demo
          </button>

          {/* Demo notice */}
          <div className="mb-6 bg-accent/10 border border-accent/30 rounded-2xl px-5 py-3 flex items-center justify-between">
            <span className="text-xs font-mono text-accent">
              ✦ Demo mode — this analytics data is not real.
            </span>
            <button
              onClick={() => navigate("/register")}
              className="text-xs font-mono text-primary underline ml-4 shrink-0"
            >
              Sign up free to track real clicks →
            </button>
          </div>

          <AnalyticsHeader
            shortCode={link.shortCode}
            originalUrl={link.originalUrl}
            status="Active"
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />

          <AnalyticsStatCards stats={stats} />

          <ClickChart data={DEMO_ANALYTICS.clicksPerDay} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <DeviceChart data={DEMO_ANALYTICS.deviceBreakdown} />
            <CountryList data={DEMO_ANALYTICS.topCountries} />
            <ReferrerList data={DEMO_ANALYTICS.topReferrers} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <BrowserChart data={DEMO_ANALYTICS.browserBreakdown} />
            <InsightCard />
          </div>

          <LinkDetails
            shortCode={link.shortCode}
            createdAt={link.createdAt}
            expiresAt={link.expiresAt}
            totalClicks={DEMO_ANALYTICS.totalClicks}
          />
        </div>
      </div>
    </div>
  );
}

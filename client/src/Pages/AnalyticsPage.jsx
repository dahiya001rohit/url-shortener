import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import AnalyticsHeader from "../components/analytics/AnalyticsHeader";
import AnalyticsStatCards from "../components/analytics/AnalyticsStatCards";
import ClickChart from "../components/analytics/ClickChart";
import DeviceChart from "../components/analytics/DeviceChart";
import CountryList from "../components/analytics/CountryList";
import ReferrerList from "../components/analytics/ReferrerList";
import BrowserChart from "../components/analytics/BrowserChart";
import InsightCard from "../components/analytics/InsightCard";
import LinkDetails from "../components/analytics/LinkDetails";
import api from "../services/api";

export default function AnalyticsPage() {
  const { shortCode } = useParams();
  const [dateRange, setDateRange] = useState("7D");
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shortCode) return;
    setLoading(true);
    api.get(`/analytics/${shortCode}`)
      .then(({ data }) => setAnalytics(data))
      .catch((err) => console.error("Failed to fetch analytics", err))
      .finally(() => setLoading(false));
  }, [shortCode]);

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <p className="text-secondary font-mono text-xs uppercase tracking-widest">Loading…</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <p className="text-error font-mono text-xs uppercase tracking-widest">Link not found.</p>
      </div>
    );
  }

  const stats = {
    totalClicks: analytics.totalClicks,
    uniqueVisitors: analytics.uniqueVisitors,
    clickRate: analytics.clickRate,
    avgPerDay: analytics.avgPerDay,
  };

  const isExpired = analytics.link.expiresAt && new Date(analytics.link.expiresAt) < new Date();
  const linkStatus = isExpired ? "Expired" : "Active";

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-6xl mx-auto px-8 pt-28 pb-24">
        <AnalyticsHeader
          shortCode={shortCode}
          originalUrl={analytics.link.originalUrl}
          status={linkStatus}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />

        <AnalyticsStatCards stats={stats} />

        <ClickChart data={analytics.clicksPerDay} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <DeviceChart data={analytics.deviceBreakdown} />
          <CountryList data={analytics.topCountries} />
          <ReferrerList data={analytics.topReferrers} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <BrowserChart data={analytics.browserBreakdown} />
          <InsightCard />
        </div>

        <LinkDetails
          shortCode={shortCode}
          createdAt={analytics.link.createdAt}
          expiresAt={analytics.link.expiresAt}
          totalClicks={analytics.totalClicks}
        />
      </div>
    </div>
  );
}

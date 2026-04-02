import { useState } from "react";
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

// Mock data — will be replaced by real API calls
const MOCK_STATS = {
  totalClicks: 12482,
  uniqueVisitors: 8291,
  clickRate: 68.2,
  avgPerDay: 142,
};

const MOCK_LINK = {
  originalUrl: "https://www.archdaily.com/categories/architecture",
  status: "Active",
  createdAt: "2023-10-02T10:00:00Z",
  expiresAt: null,
};

export default function AnalyticsPage() {
  const { shortCode } = useParams();
  const [dateRange, setDateRange] = useState("7D");

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-6xl mx-auto px-8 pt-12 pb-24">
        <AnalyticsHeader
          shortCode={shortCode}
          originalUrl={MOCK_LINK.originalUrl}
          status={MOCK_LINK.status}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />

        <AnalyticsStatCards stats={MOCK_STATS} />

        <ClickChart />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <DeviceChart />
          <CountryList />
          <ReferrerList />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <BrowserChart />
          <InsightCard />
        </div>

        <LinkDetails
          shortCode={shortCode}
          createdAt={MOCK_LINK.createdAt}
          expiresAt={MOCK_LINK.expiresAt}
          totalClicks={MOCK_STATS.totalClicks}
        />
      </div>
    </div>
  );
}

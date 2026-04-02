import { MousePointer2, Users, TrendingUp, Calendar } from "lucide-react";
import StatCard from "../shared/layout/StatCard";

export default function AnalyticsStatCards({ stats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard icon={MousePointer2} label="Total Clicks" value={stats.totalClicks} trend="+847 vs last period" trendType="up" delay={0} />
      <StatCard icon={Users} label="Unique Visitors" value={stats.uniqueVisitors} trend="Across 42 countries" trendType="neutral" delay={50} />
      <StatCard icon={TrendingUp} label="Click Rate" value={stats.clickRate} trend="12% above platform avg" trendType="up" delay={100} />
      <StatCard icon={Calendar} label="Avg Per Day" value={stats.avgPerDay} trend="Peak at 14:00 EST" trendType="neutral" delay={150} />
    </div>
  );
}

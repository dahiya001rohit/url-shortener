import { Link2, MousePointerClick, CheckCircle2, XCircle } from "lucide-react";
import StatCard from "../shared/layout/StatCard";

export default function StatCards({ stats }) {
  const total = stats.totalLinks || 1;
  const activePercent = Math.round((stats.activeLinks / total) * 100);
  const expiredPercent = Math.round((stats.expiredLinks / total) * 100);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard icon={Link2} label="Total Links" value={stats.totalLinks} trend="+3 this week" trendType="up" delay={0} />
      <StatCard icon={MousePointerClick} label="Total Clicks" value={stats.totalClicks} trend="+2,847 this week" trendType="up" delay={50} />
      <StatCard icon={CheckCircle2} label="Active Links" value={stats.activeLinks} trend={`${activePercent}% of total`} trendType="neutral" delay={100} />
      <StatCard icon={XCircle} label="Expired Links" value={stats.expiredLinks} trend={`${expiredPercent}% of total`} trendType="down" delay={150} />
    </div>
  );
}

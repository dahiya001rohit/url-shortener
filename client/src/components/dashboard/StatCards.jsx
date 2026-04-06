import { Link2, MousePointerClick, CheckCircle2, XCircle } from "lucide-react";
import StatCard from "../shared/layout/StatCard";

function TrendBadge({ trend }) {
  if (!trend || trend.pct === null) {
    return <span className="text-xs font-mono text-outline">No data yet</span>;
  }

  const { value, direction } = trend.pct;

  if (value === 0) {
    return <span className="text-xs font-mono text-outline">Same as last week</span>;
  }

  const suffix = value === 999 ? "%+" : "%";
  const isUp = direction === "up";

  return (
    <span className={`text-xs font-mono flex items-center gap-1 ${isUp ? "text-green-600" : "text-error"}`}>
      {isUp ? "↑" : "↓"} {value}{suffix} vs last week
    </span>
  );
}

export default function StatCards({ stats = {}, trends = null }) {
  const total = stats.totalLinks || 0;
  const activePercent = total > 0 ? Math.round((stats.activeLinks / total) * 100) : 0;
  const expiredPercent = total > 0 ? Math.round((stats.expiredLinks / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        icon={Link2}
        label="Total Links"
        value={stats.totalLinks}
        trend={<TrendBadge trend={trends?.links} />}
        delay={0}
      />
      <StatCard
        icon={MousePointerClick}
        label="Total Clicks"
        value={stats.totalClicks}
        trend={<TrendBadge trend={trends?.clicks} />}
        delay={50}
      />
      <StatCard
        icon={CheckCircle2}
        label="Active Links"
        value={stats.activeLinks}
        trend={
          <span className="text-xs font-mono text-secondary">
            {activePercent}% of total links
          </span>
        }
        trendType="neutral"
        delay={100}
      />
      <StatCard
        icon={XCircle}
        label="Expired Links"
        value={stats.expiredLinks}
        trend={
          <span className={`text-xs font-mono ${stats.expiredLinks > 0 ? "text-error" : "text-secondary"}`}>
            {expiredPercent}% of total links
          </span>
        }
        trendType="down"
        delay={150}
      />
    </div>
  );
}

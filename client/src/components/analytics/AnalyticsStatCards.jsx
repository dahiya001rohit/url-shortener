import { useEffect, useState } from "react";
import { MousePointer2, Users, TrendingUp, Calendar } from "lucide-react";

function StatCard({ icon, label, value, sub, delay }) {
  const [count, setCount] = useState(0);
  const numeric = parseFloat(String(value).replace(/[^0-9.]/g, ""));
  const isFloat = String(value).includes(".");

  useEffect(() => {
    if (!numeric) return;
    const frames = 50;
    const duration = 1400;
    const increment = numeric / frames;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= numeric) {
        setCount(numeric);
        clearInterval(timer);
      } else {
        setCount(isFloat ? parseFloat(current.toFixed(1)) : Math.floor(current));
      }
    }, duration / frames);
    return () => clearInterval(timer);
  }, [numeric, isFloat]);

  const display = isFloat
    ? count.toFixed(1) + "%"
    : count.toLocaleString();

  return (
    <div
      className="bg-surface-container-lowest border border-outline-variant/50 rounded-2xl p-6 flex flex-col gap-3"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-widest text-secondary">
          {label}
        </span>
        <span className="text-secondary">{icon}</span>
      </div>
      <p className="text-3xl font-headline text-foreground">{display}</p>
      <p className="text-xs font-body text-secondary leading-relaxed">{sub}</p>
    </div>
  );
}

export default function AnalyticsStatCards({ stats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        icon={<MousePointer2 className="w-4 h-4" />}
        label="Total Clicks"
        value={stats.totalClicks}
        sub="+847 vs last period"
        delay={0}
      />
      <StatCard
        icon={<Users className="w-4 h-4" />}
        label="Unique Visitors"
        value={stats.uniqueVisitors}
        sub="Across 42 countries"
        delay={50}
      />
      <StatCard
        icon={<TrendingUp className="w-4 h-4" />}
        label="Click Rate"
        value={stats.clickRate}
        sub="12% above platform avg"
        delay={100}
      />
      <StatCard
        icon={<Calendar className="w-4 h-4" />}
        label="Avg Per Day"
        value={stats.avgPerDay}
        sub="Peak at 14:00 EST"
        delay={150}
      />
    </div>
  );
}

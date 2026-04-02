import { MousePointer2, Link2, Globe, TrendingUp } from "lucide-react";

const STATS = [
  {
    label: "Today's Clicks",
    value: "1,284",
    badge: "+12%",
    badgeColor: "text-primary bg-primary/10",
    icon: MousePointer2,
  },
  {
    label: "Active Links",
    value: "42",
    badge: "Stable",
    badgeColor: "text-secondary bg-surface-container",
    icon: Link2,
  },
  {
    label: "Total Reach",
    value: "18.4k",
    badge: "+5%",
    badgeColor: "text-primary bg-primary/10",
    icon: Globe,
  },
  {
    label: "Top Link Today",
    value: "/design-q3",
    badge: "HOT",
    badgeColor: "text-accent bg-accent/10",
    icon: TrendingUp,
    mono: true,
  },
];

export default function HomeStatCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {STATS.map(({ label, value, badge, badgeColor, icon: Icon, mono }) => (
        <div
          key={label}
          className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-5 flex flex-col gap-3"
          style={{ boxShadow: "0 2px 8px rgba(0,47,45,0.05)" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-secondary">
              {label}
            </span>
            <Icon className="w-4 h-4 text-secondary" />
          </div>
          <p className={`text-2xl font-headline text-foreground ${mono ? "font-mono text-xl" : ""}`}>
            {value}
          </p>
          <span className={`self-start text-xs font-mono px-2 py-0.5 rounded-full ${badgeColor}`}>
            {badge}
          </span>
        </div>
      ))}
    </div>
  );
}

import { Link } from "react-router-dom";
import { MousePointer2, BarChart2, AlertTriangle, Link2, TrendingUp } from "lucide-react";

const ACTIVITY_DATA = [
  {
    icon: MousePointer2,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    text: "snip.ly/design-q3 received 142 clicks",
    time: "2 min ago",
  },
  {
    icon: BarChart2,
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
    text: "Weekly summary: 3,421 total clicks across 12 links",
    time: "1 hr ago",
  },
  {
    icon: AlertTriangle,
    iconBg: "bg-error/10",
    iconColor: "text-error",
    text: "snip.ly/conf-2023 expires in 3 days",
    time: "3 hr ago",
  },
  {
    icon: Link2,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    text: "New snip created: snip.ly/arch-daily",
    time: "Yesterday",
  },
  {
    icon: TrendingUp,
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
    text: "Traffic surge detected on snip.ly/figma-kit — +240%",
    time: "2 days ago",
  },
];

export default function RecentActivity() {
  return (
    <div
      className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 h-full"
      style={{ boxShadow: "0 2px 8px rgba(0,47,45,0.05)" }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-secondary">
            Activity
          </p>
          <h3 className="text-xl font-headline text-foreground mt-0.5">
            Recent Activity
          </h3>
        </div>
        <Link
          to="/dashboard"
          className="text-xs font-mono uppercase tracking-widest text-primary hover:text-primary-container transition-colors"
        >
          View all →
        </Link>
      </div>

      <div className="space-y-4">
        {ACTIVITY_DATA.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
                <Icon className={`w-4 h-4 ${item.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-body text-foreground leading-snug">
                  {item.text}
                </p>
                <p className="text-xs font-mono text-outline mt-0.5">
                  {item.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

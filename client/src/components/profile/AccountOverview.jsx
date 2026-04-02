import { Link2, MousePointerClick, Calendar, Zap } from "lucide-react";
import Card from "../shared/ui/Card";

export default function AccountOverview({ stats }) {
  const rows = [
    { icon: Link2, label: "Links Created", value: stats.totalLinks },
    { icon: MousePointerClick, label: "Total Clicks", value: stats.totalClicks.toLocaleString() },
    { icon: Calendar, label: "Member Since", value: stats.memberSince },
    { icon: Zap, label: "Current Plan", value: stats.plan },
  ];

  return (
    <Card>
      <p className="text-xs font-mono uppercase tracking-widest text-secondary mb-1">
        Overview
      </p>
      <h3 className="text-xl font-headline italic text-foreground mb-5">
        Account Stats
      </h3>
      <div className="space-y-0">
        {rows.map(({ icon: Icon, label, value }, i) => (
          <div
            key={label}
            className={`flex items-center justify-between py-3.5 ${
              i < rows.length - 1 ? "border-b border-outline-variant/20" : ""
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Icon className="w-4 h-4 text-secondary shrink-0" />
              <span className="text-sm font-body text-secondary">{label}</span>
            </div>
            <span className="text-sm font-mono font-medium text-foreground">{value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

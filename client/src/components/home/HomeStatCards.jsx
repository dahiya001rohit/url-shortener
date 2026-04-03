import { MousePointer2, Link2, Globe, TrendingUp } from "lucide-react";
import Card from "../shared/ui/Card";
import Badge from "../shared/ui/Badge";

export default function HomeStatCards({ stats = {} }) {
  const { todayClicks = 0, activeLinks = 0, totalReach = 0, totalLinks = 0 } = stats;

  const items = [
    { label: "Today's Clicks", value: todayClicks.toLocaleString(), badge: "Today", badgeVariant: "active", icon: MousePointer2 },
    { label: "Active Links", value: activeLinks.toLocaleString(), badge: "Stable", badgeVariant: "noExpiry", icon: Link2 },
    { label: "Total Reach", value: totalReach.toLocaleString(), badge: "All time", badgeVariant: "active", icon: Globe },
    { label: "Total Links", value: totalLinks.toLocaleString(), badge: "Created", badgeVariant: "new", icon: TrendingUp },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {items.map(({ label, value, badge, badgeVariant, icon: Icon }) => (
        <Card key={label} padding="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-secondary">{label}</span>
            <Icon className="w-4 h-4 text-secondary" />
          </div>
          <p className="text-2xl font-headline text-foreground mb-3">{value}</p>
          <Badge variant={badgeVariant}>{badge}</Badge>
        </Card>
      ))}
    </div>
  );
}

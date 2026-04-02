import { MousePointer2, Link2, Globe, TrendingUp } from "lucide-react";
import Card from "../shared/ui/Card";
import Badge from "../shared/ui/Badge";

const STATS = [
  { label: "Today's Clicks", value: "1,284", badge: "+12%", badgeVariant: "active", icon: MousePointer2 },
  { label: "Active Links", value: "42", badge: "Stable", badgeVariant: "noExpiry", icon: Link2 },
  { label: "Total Reach", value: "18.4k", badge: "+5%", badgeVariant: "active", icon: Globe },
  { label: "Top Link Today", value: "/design-q3", badge: "HOT", badgeVariant: "new", icon: TrendingUp, mono: true },
];

export default function HomeStatCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {STATS.map(({ label, value, badge, badgeVariant, icon: Icon, mono }) => (
        <Card key={label} padding="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-secondary">{label}</span>
            <Icon className="w-4 h-4 text-secondary" />
          </div>
          <p className={`text-2xl font-headline text-foreground mb-3 ${mono ? "font-mono text-xl" : ""}`}>
            {value}
          </p>
          <Badge variant={badgeVariant}>{badge}</Badge>
        </Card>
      ))}
    </div>
  );
}

import { Link } from "react-router-dom";
import { MousePointer2, Link2, AlertTriangle } from "lucide-react";

const ICON_MAP = {
  MousePointer2,
  Link2,
  AlertTriangle,
};

const ICON_STYLE = {
  click_milestone: { bg: "bg-primary/10", color: "text-primary" },
  new_link:        { bg: "bg-accent/10",  color: "text-accent"  },
  expiry_warning:  { bg: "bg-error/10",   color: "text-error"   },
};

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function RecentActivity({ activity = [] }) {
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
        {activity.length === 0 ? (
          <p className="text-xs text-secondary font-mono">No recent activity yet.</p>
        ) : activity.map((item, i) => {
          const Icon = ICON_MAP[item.icon] || Link2;
          const style = ICON_STYLE[item.type] || ICON_STYLE.new_link;
          return (
            <div key={i} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${style.bg}`}>
                <Icon className={`w-4 h-4 ${style.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-body text-foreground leading-snug">
                  {item.message}
                </p>
                <p className="text-xs font-mono text-outline mt-0.5">
                  {timeAgo(item.time)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

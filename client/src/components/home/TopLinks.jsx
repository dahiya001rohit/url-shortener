import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const TOP_LINKS = [
  {
    shortCode: "design-q3",
    originalUrl: "notion.so/design-quarterly-report",
    clicks: 1284,
    change: "+18%",
    bars: [40, 65, 55, 80, 70, 90],
  },
  {
    shortCode: "arch-daily",
    originalUrl: "archdaily.com/categories/architecture",
    clicks: 847,
    change: "+24%",
    bars: [30, 50, 45, 60, 55, 70],
  },
  {
    shortCode: "figma-kit",
    originalUrl: "figma.com/community/ui-kit-v3",
    clicks: 612,
    change: "+9%",
    bars: [20, 35, 40, 30, 50, 45],
  },
];

// Mini sparkline bar chart using divs
function MiniBarChart({ bars }) {
  const max = Math.max(...bars);
  return (
    <div className="flex items-end gap-0.5 h-8">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm transition-all"
          style={{
            height: `${(h / max) * 100}%`,
            background: i === bars.length - 1 ? "#FFB95F" : "#002F2D",
            opacity: i === bars.length - 1 ? 1 : 0.3 + (i / bars.length) * 0.5,
          }}
        />
      ))}
    </div>
  );
}

export default function TopLinks() {
  const navigate = useNavigate();

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-secondary">
            Performance
          </p>
          <h3 className="text-xl font-headline text-foreground mt-0.5">
            Top Performing Links
          </h3>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-primary hover:text-primary-container transition-colors"
        >
          View all links
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {TOP_LINKS.map((link) => (
          <div
            key={link.shortCode}
            className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-5 flex flex-col gap-3"
            style={{ boxShadow: "0 2px 8px rgba(0,47,45,0.05)" }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-mono text-sm text-primary truncate">
                  snip.ly/{link.shortCode}
                </p>
                <p className="text-xs font-body text-secondary truncate mt-0.5">
                  {link.originalUrl}
                </p>
              </div>
              <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
                {link.change}
              </span>
            </div>

            <MiniBarChart bars={link.bars} />

            <div className="flex items-center justify-between">
              <span className="text-2xl font-headline text-foreground">
                {link.clicks.toLocaleString()}
              </span>
              <span className="text-xs font-mono uppercase tracking-widest text-secondary">
                clicks
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const DATE_PILLS = ["7D", "30D", "90D", "ALL"];

export default function AnalyticsHeader({
  shortCode,
  originalUrl,
  status,
  dateRange,
  onDateRangeChange,
}) {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      {/* Back button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-xs font-mono uppercase tracking-widest border-b border-transparent group-hover:border-primary transition-all">
          Back to Dashboard
        </span>
      </button>

      {/* URL row */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-headline italic text-foreground">
              snip.ly/{shortCode}
            </h1>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono uppercase tracking-wide ${
                status === "Active"
                  ? "bg-primary/10 text-primary"
                  : "bg-error/10 text-error"
              }`}
            >
              {status}
            </span>
          </div>
          <p className="text-secondary font-body text-sm">{originalUrl}</p>
        </div>

        {/* Date range pills */}
        <div className="flex items-center gap-2">
          {DATE_PILLS.map((d) => (
            <button
              key={d}
              onClick={() => onDateRangeChange(d)}
              className={`font-mono text-xs rounded-full px-4 py-1.5 transition-colors ${
                dateRange === d
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-lowest border border-outline-variant text-secondary hover:border-primary"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

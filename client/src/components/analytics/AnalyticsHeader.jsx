import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Badge from "../shared/ui/Badge";
import Button from "../shared/ui/Button";

const DATE_PILLS = ["7D", "30D", "90D", "ALL"];

export default function AnalyticsHeader({ shortCode, originalUrl, status, dateRange, onDateRangeChange }) {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <button
        onClick={() => navigate("/dashboard")}
        className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-xs font-mono uppercase tracking-widest border-b border-transparent group-hover:border-primary transition-all">
          Back to Dashboard
        </span>
      </button>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-headline italic text-foreground">
              snip.ly/{shortCode}
            </h1>
            <Badge variant={status === "Active" ? "active" : "expired"}>
              {status}
            </Badge>
          </div>
          <p className="text-secondary font-body text-sm">{originalUrl}</p>
        </div>

        <div className="flex items-center gap-2">
          {DATE_PILLS.map((d) => (
            <Button
              key={d}
              variant={dateRange === d ? "primary" : "secondary"}
              size="sm"
              onClick={() => onDateRangeChange(d)}
            >
              {d}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

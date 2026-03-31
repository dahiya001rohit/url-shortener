import { useParams, Link } from "react-router-dom";
import { ArrowLeft, BarChart2 } from "lucide-react";

export default function AnalyticsPage() {
  const { shortCode } = useParams();

  return (
    <div className="min-h-screen bg-background pt-28 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs font-mono uppercase tracking-widest border-b border-transparent group-hover:border-primary transition-all">
            Back to Dashboard
          </span>
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <BarChart2 className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-headline italic text-foreground">
            Analytics
          </h1>
        </div>
        <p className="text-secondary font-mono text-sm mb-12">
          snip.ly/{shortCode}
        </p>

        <div
          className="bg-surface-container-lowest rounded-xl p-12 flex flex-col items-center justify-center text-center"
          style={{ boxShadow: "0 2px 8px rgba(0,47,45,0.05)" }}
        >
          <div className="w-14 h-14 rounded-xl bg-surface-container flex items-center justify-center mb-4">
            <BarChart2 className="w-6 h-6 text-secondary" />
          </div>
          <h2 className="text-xl font-headline italic text-foreground mb-2">
            Coming soon.
          </h2>
          <p className="text-secondary font-body text-sm max-w-xs leading-relaxed">
            Detailed click analytics, geographic data, and referral tracking
            will be available here.
          </p>
        </div>
      </div>
    </div>
  );
}

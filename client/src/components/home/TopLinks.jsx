import { useNavigate } from "react-router-dom";

const SERVER_BASE = (process.env.REACT_APP_API_URL || "http://localhost:5010/api").replace(/\/api$/, "");
const BASE_URL = SERVER_BASE.replace(/^https?:\/\//, "");
import { ArrowRight } from "lucide-react";

export default function TopLinks({ links = [] }) {
  const navigate = useNavigate();
  const top3 = links.slice(0, 3);

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

      {top3.length === 0 ? (
        <p className="text-xs text-secondary font-mono">No links yet. Create your first snip!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {top3.map((link) => (
            <div
              key={link._id}
              onClick={() => navigate(`/analytics/${link.shortCode}`)}
              className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-5 flex flex-col gap-3 cursor-pointer hover:border-primary/30 transition-colors"
              style={{ boxShadow: "0 2px 8px rgba(0,47,45,0.05)" }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-mono text-sm text-primary truncate">
                    {BASE_URL}/{link.shortCode}
                  </p>
                  <p className="text-xs font-body text-secondary truncate mt-0.5">
                    {link.originalUrl.replace(/^https?:\/\//, "")}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-2xl font-headline text-foreground">
                  {(link.clicks || 0).toLocaleString()}
                </span>
                <span className="text-xs font-mono uppercase tracking-widest text-secondary">
                  clicks
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ReferrerList({ data = [] }) {
  const total = data.reduce((s, d) => s + d.count, 0) || 1;
  const referrers = data.map((d) => ({
    source: d._id || "Direct",
    count: d.count,
    pct: Math.round((d.count / total) * 100),
  }));

  return (
    <div
      className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6"
      style={{ boxShadow: "0 2px 8px rgba(0,47,45,0.05)" }}
    >
      <h3 className="text-xs font-mono uppercase tracking-widest text-secondary mb-1">
        Traffic Sources
      </h3>
      <p className="text-xl font-headline text-foreground mb-6">
        Top Referrers
      </p>

      <div className="space-y-4">
        {referrers.length === 0 ? (
          <p className="text-xs text-secondary font-mono">No data yet</p>
        ) : referrers.map((r) => (
          <div key={r.source} className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-body font-medium text-foreground truncate">
                {r.source}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm font-mono text-foreground">
                {r.count.toLocaleString()}
              </span>
              <span className="rounded-full px-2 py-0.5 bg-surface-container-low font-mono text-xs text-secondary">
                {r.pct}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

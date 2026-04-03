export default function BrowserChart({ data = [] }) {
  const total = data.reduce((s, d) => s + d.count, 0) || 1;
  const browsers = data.map((d) => ({
    browser: d._id || "Unknown",
    value: Math.round((d.count / total) * 100),
  }));

  return (
    <div
      className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6"
      style={{ boxShadow: "0 2px 8px rgba(0,47,45,0.05)" }}
    >
      <h3 className="text-xs font-mono uppercase tracking-widest text-secondary mb-1">
        Browsers
      </h3>
      <p className="text-xl font-headline text-foreground mb-6">
        Browser Distribution
      </p>

      <div className="space-y-3">
        {browsers.length === 0 ? (
          <p className="text-xs text-secondary font-mono">No data yet</p>
        ) : browsers.map((item) => (
          <div key={item.browser}>
            <div className="flex justify-between mb-1">
              <span className="font-mono text-xs text-secondary">
                {item.browser}
              </span>
              <span className="font-mono text-xs text-outline">
                {item.value}%
              </span>
            </div>
            <div className="h-2 bg-surface-container-low rounded-full">
              <div
                className="h-2 bg-primary rounded-full transition-all duration-700"
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

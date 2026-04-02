export default function LinkDetails({ shortCode, createdAt, expiresAt, totalClicks }) {
  const formatted = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const cols = [
    { label: "Short Code", value: `snip.ly/${shortCode}` },
    { label: "Created", value: formatted(createdAt) },
    { label: "Expires", value: expiresAt ? formatted(expiresAt) : "Never" },
    { label: "Total Clicks", value: totalClicks?.toLocaleString() ?? "—" },
  ];

  return (
    <div
      className="mt-6 bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6"
      style={{ boxShadow: "0 2px 8px rgba(0,47,45,0.04)" }}
    >
      <h3 className="text-xs font-mono uppercase tracking-widest text-secondary mb-5">
        Link Metadata
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {cols.map((c) => (
          <div key={c.label}>
            <p className="font-mono text-xs uppercase tracking-widest text-outline mb-1">
              {c.label}
            </p>
            <p className="text-sm font-body font-medium text-foreground">
              {c.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

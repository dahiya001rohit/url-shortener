const COUNTRY_NAMES = {
  IN: { name: "India", flag: "🇮🇳" },
  US: { name: "United States", flag: "🇺🇸" },
  GB: { name: "United Kingdom", flag: "🇬🇧" },
  DE: { name: "Germany", flag: "🇩🇪" },
  CA: { name: "Canada", flag: "🇨🇦" },
  AU: { name: "Australia", flag: "🇦🇺" },
  FR: { name: "France", flag: "🇫🇷" },
  JP: { name: "Japan", flag: "🇯🇵" },
  BR: { name: "Brazil", flag: "🇧🇷" },
  SG: { name: "Singapore", flag: "🇸🇬" },
  NL: { name: "Netherlands", flag: "🇳🇱" },
  PK: { name: "Pakistan", flag: "🇵🇰" },
  Unknown: { name: "Unknown", flag: "🌐" },
};

export default function CountryList({ data = [] }) {
  const total = data.reduce((s, d) => s + d.count, 0) || 1;
  const countries = data.map((d) => {
    const info = COUNTRY_NAMES[d._id] || { name: d._id || "Unknown", flag: "🌐" };
    return { ...info, count: d.count, pct: Math.round((d.count / total) * 100) };
  });

  return (
    <div
      className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6"
      style={{ boxShadow: "0 2px 8px rgba(0,47,45,0.05)" }}
    >
      <h3 className="text-xs font-mono uppercase tracking-widest text-secondary mb-1">
        Geography
      </h3>
      <p className="text-xl font-headline text-foreground mb-6">
        Top Countries
      </p>

      <div className="space-y-4">
        {countries.length === 0 ? (
          <p className="text-xs text-secondary font-mono">No data yet</p>
        ) : countries.map((c) => (
          <div key={c.name}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-base leading-none">{c.flag}</span>
                <span className="font-headline italic text-sm text-foreground">
                  {c.name}
                </span>
              </div>
              <span className="font-mono text-xs text-secondary">
                {c.count.toLocaleString()}
              </span>
            </div>
            <div className="h-1.5 bg-surface-container-low rounded-full overflow-hidden">
              <div
                className="h-1.5 bg-primary rounded-full transition-all duration-700"
                style={{ width: `${c.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

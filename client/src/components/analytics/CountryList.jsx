const countryData = [
  { flag: "🇮🇳", name: "India", count: 4281, pct: 42 },
  { flag: "🇺🇸", name: "United States", count: 3102, pct: 28 },
  { flag: "🇬🇧", name: "United Kingdom", count: 1490, pct: 11 },
  { flag: "🇩🇪", name: "Germany", count: 821, pct: 9 },
  { flag: "🇨🇦", name: "Canada", count: 821, pct: 10 },
];

export default function CountryList() {
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
        {countryData.map((c) => (
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

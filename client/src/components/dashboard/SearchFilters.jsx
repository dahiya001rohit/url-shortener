import { Search } from "lucide-react";

const FILTERS = ["All", "Active", "Expired", "No Expiry"];

export default function SearchFilters({ search, onSearch, activeFilter, onFilter }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary pointer-events-none" />
        <input
          type="text"
          placeholder="Search by short code or destination..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl pl-9 pr-4 py-2.5 text-sm font-body placeholder:text-secondary/50 focus:outline-none focus:ring-1 focus:ring-primary transition-all"
        />
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => onFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wide transition-all whitespace-nowrap ${
              activeFilter === f
                ? "bg-primary text-on-primary"
                : "bg-surface-container text-secondary hover:bg-surface-container-high"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );
}

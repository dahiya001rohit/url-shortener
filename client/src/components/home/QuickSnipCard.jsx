import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export default function QuickSnipCard({ onSnip }) {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null); // { shortCode }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!url.trim()) return;
    try {
      const data = await onSnip?.(url);
      setResult({ shortCode: data?.shortCode || "—" });
      setUrl("");
      setTimeout(() => setResult(null), 3000);
    } catch {
      // onSnip throws → show nothing special
    }
  }

  return (
    <div className="bg-primary rounded-2xl p-6 mb-8 relative overflow-hidden">
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10">
        <p className="text-xs font-mono uppercase tracking-widest text-on-primary-container mb-3">
          Quick Snip
        </p>

        {result ? (
          <div className="flex items-center gap-3 py-2">
            <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-white text-sm font-body">Copied!</p>
              <p className="font-mono text-xs text-accent">
                snip.ly/{result.shortCode}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste your long URL here..."
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm font-body text-white placeholder:text-white/40 focus:outline-none focus:border-accent transition-all"
            />
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-mono text-sm uppercase tracking-wide transition-colors shrink-0"
              style={{ background: "#FFB95F", color: "#2A1700" }}
            >
              Snip it
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

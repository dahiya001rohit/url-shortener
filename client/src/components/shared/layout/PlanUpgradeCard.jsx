import { Zap } from "lucide-react";

export default function PlanUpgradeCard({ onUpgrade }) {
  return (
    <div className="mt-4 bg-primary/5 border border-primary/10 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-3.5 h-3.5 text-accent" />
        <p className="text-xs font-mono uppercase tracking-widest text-primary">
          Go Pro
        </p>
      </div>
      <p className="text-xs font-body text-secondary leading-relaxed mb-3">
        Unlock unlimited links, custom domains, and deep analytics.
      </p>
      <button
        onClick={onUpgrade || (() => console.log("upgrade clicked"))}
        className="w-full py-2 rounded-full text-xs font-mono uppercase tracking-wide bg-primary text-on-primary hover:opacity-90 transition-colors"
      >
        Upgrade
      </button>
    </div>
  );
}

import { Link2 } from "lucide-react";

export default function EmptyState({ onNewSnip }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-14 h-14 rounded-xl bg-surface-container flex items-center justify-center mb-5">
        <Link2 className="w-6 h-6 text-secondary" />
      </div>
      <h3 className="text-2xl font-headline italic text-foreground mb-2">
        No snips yet.
      </h3>
      <p className="text-secondary font-body text-sm mb-6 max-w-xs leading-relaxed">
        Create your first shortened link to start tracking and managing your
        digital pathways.
      </p>
      {onNewSnip && (
        <button
          onClick={onNewSnip}
          className="bg-primary text-on-primary px-5 py-2.5 rounded-xl text-sm font-mono uppercase tracking-wide hover:bg-primary-container transition-colors"
        >
          Create your first snip
        </button>
      )}
    </div>
  );
}

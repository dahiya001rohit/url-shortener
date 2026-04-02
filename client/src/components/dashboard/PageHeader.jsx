import { Link2, Plus } from "lucide-react";
import Button from "../shared/ui/Button";

export default function PageHeader({ totalLinks, onNewSnip }) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-3xl font-headline italic text-foreground leading-tight">
          My Snips.
        </h1>
        <p className="text-secondary font-body text-sm mt-1.5 flex items-center gap-2">
          Manage and track all your shortened links.
          <span className="inline-flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded-full text-xs font-mono text-on-surface-variant">
            <Link2 className="w-3 h-3" />
            {totalLinks} {totalLinks === 1 ? "link" : "links"}
          </span>
        </p>
      </div>
      <Button variant="primary" size="sm" onClick={onNewSnip}>
        <Plus className="w-4 h-4" />
        New Snip
      </Button>
    </div>
  );
}

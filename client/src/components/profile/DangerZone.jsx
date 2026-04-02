import { useState } from "react";
import { Download, Trash2, AlertTriangle } from "lucide-react";
import Card from "../shared/ui/Card";
import Button from "../shared/ui/Button";

export default function DangerZone() {
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  return (
    <Card className="border-error/20">
      <div className="flex items-center gap-2 mb-1">
        <AlertTriangle className="w-3.5 h-3.5 text-error" />
        <p className="text-xs font-mono uppercase tracking-widest text-error">
          Danger Zone
        </p>
      </div>
      <h3 className="text-xl font-headline italic text-foreground mb-5">
        Account Actions
      </h3>

      <div className="space-y-3">
        <button
          onClick={() => console.log("export data")}
          className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl border border-outline-variant/50 text-sm font-body text-foreground hover:bg-surface-container transition-colors text-left"
        >
          <Download className="w-4 h-4 text-secondary shrink-0" />
          Export Data (.CSV)
        </button>

        {!deleteConfirm ? (
          <button
            onClick={() => setDeleteConfirm(true)}
            className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl border border-error/30 text-sm font-body text-error hover:bg-error/5 transition-colors text-left"
          >
            <Trash2 className="w-4 h-4 shrink-0" />
            Delete Account
          </button>
        ) : (
          <div className="border border-error/30 rounded-xl p-4 space-y-3">
            <p className="text-xs font-mono uppercase tracking-widest text-error">
              Are you sure?
            </p>
            <p className="text-xs font-mono text-outline leading-relaxed">
              This action is irreversible. All snips and analytics will be permanently removed.
            </p>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                onClick={() => console.log("delete account confirmed")}
              >
                Yes, delete everything
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="flex-1"
                onClick={() => setDeleteConfirm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

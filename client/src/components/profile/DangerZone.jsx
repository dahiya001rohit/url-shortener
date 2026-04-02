import { useState } from "react";
import { Download, Trash2, AlertTriangle } from "lucide-react";

export default function DangerZone() {
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  return (
    <div
      className="bg-surface-container-lowest border border-error/20 rounded-2xl p-6"
      style={{ boxShadow: "0 2px 8px rgba(0,47,45,0.05)" }}
    >
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
        {/* Export */}
        <button
          onClick={() => console.log("export data")}
          className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl border border-outline-variant/50 text-sm font-body text-foreground hover:bg-surface-container transition-colors text-left"
        >
          <Download className="w-4 h-4 text-secondary shrink-0" />
          Export Data (.CSV)
        </button>

        {/* Delete */}
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
              <button
                onClick={() => console.log("delete account confirmed")}
                className="flex-1 py-2 rounded-xl text-xs font-mono uppercase tracking-wide border border-error text-error hover:bg-error/10 transition-colors"
              >
                Yes, delete everything
              </button>
              <button
                onClick={() => setDeleteConfirm(false)}
                className="flex-1 py-2 rounded-xl text-xs font-mono uppercase tracking-wide bg-surface-container text-secondary hover:bg-surface-container-high transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

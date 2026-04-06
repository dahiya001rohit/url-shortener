import { useState } from "react";
import { Download, Trash2, AlertTriangle } from "lucide-react";
import Card from "../shared/ui/Card";
import Button from "../shared/ui/Button";
import api from "../../services/api";

export default function DangerZone({ onDelete }) {
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");

  async function handleExport() {
    try {
      setExporting(true);
      setExportError("");
      const response = await api.get("/user/export", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `snip-export-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setExportError("Export failed. Try again.");
    } finally {
      setExporting(false);
    }
  }

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
          onClick={handleExport}
          disabled={exporting}
          className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl border border-outline-variant/50 text-sm font-body text-foreground hover:bg-surface-container transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4 text-secondary shrink-0" />
          {exporting ? "Exporting…" : "Export Data (.CSV)"}
        </button>
        {exportError && (
          <p className="text-xs text-error font-mono">{exportError}</p>
        )}

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
                onClick={() => { setDeleteConfirm(false); onDelete?.(); }}
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

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, Check, Trash2, BarChart2 } from "lucide-react";

const BASE_URL = "snip.ly";

function getStatus(link) {
  if (!link.expiresAt) return "No Expiry";
  return new Date(link.expiresAt) > new Date() ? "Active" : "Expired";
}

const STATUS_STYLES = {
  Active: "bg-primary/10 text-primary",
  Expired: "bg-error/10 text-error",
  "No Expiry": "bg-surface-container text-secondary",
};

export default function TableRow({ link, onDelete }) {
  const [copied, setCopied] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const navigate = useNavigate();
  const status = getStatus(link);

  function handleCopy() {
    navigator.clipboard.writeText(`https://${BASE_URL}/${link.shortCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDelete() {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      setTimeout(() => setDeleteConfirm(false), 3000);
    } else {
      onDelete(link._id);
      setDeleteConfirm(false);
    }
  }

  return (
    <tr className="border-b border-outline-variant/20 hover:bg-surface-container-low/50 transition-colors group">
      {/* Short Link */}
      <td className="py-3.5 pl-4 pr-3">
        <span className="font-mono text-sm text-primary">
          {BASE_URL}/{link.shortCode}
        </span>
      </td>

      {/* Destination */}
      <td className="py-3.5 px-3 max-w-xs">
        <span
          className="text-sm text-secondary truncate block"
          title={link.originalUrl}
        >
          {link.originalUrl}
        </span>
      </td>

      {/* Clicks */}
      <td className="py-3.5 px-3">
        <span className="text-sm font-mono text-foreground">
          {link.clicks.toLocaleString()}
        </span>
      </td>

      {/* Status */}
      <td className="py-3.5 px-3">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono uppercase tracking-wide ${STATUS_STYLES[status]}`}
        >
          {status}
        </span>
      </td>

      {/* Actions */}
      <td className="py-3.5 pl-3 pr-4">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Copy */}
          <button
            onClick={handleCopy}
            title="Copy short link"
            className="p-1.5 rounded-lg hover:bg-surface-container text-secondary hover:text-primary transition-all"
          >
            {copied ? (
              <Check className="w-4 h-4 text-primary" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>

          {/* Analytics */}
          <button
            onClick={() => navigate(`/analytics/${link.shortCode}`)}
            title="View analytics"
            className="p-1.5 rounded-lg hover:bg-surface-container text-secondary hover:text-primary transition-all"
          >
            <BarChart2 className="w-4 h-4" />
          </button>

          {/* Delete */}
          <button
            onClick={handleDelete}
            title={deleteConfirm ? "Click again to confirm" : "Delete"}
            className={`p-1.5 rounded-lg transition-all ${
              deleteConfirm
                ? "bg-error/10 text-error hover:bg-error/20"
                : "hover:bg-surface-container text-secondary hover:text-error"
            }`}
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {deleteConfirm && (
            <span className="text-xs text-error font-mono ml-1 whitespace-nowrap">
              Delete?
            </span>
          )}
        </div>
      </td>
    </tr>
  );
}

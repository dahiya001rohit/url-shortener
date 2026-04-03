import { useState } from "react";
import { Link2 } from "lucide-react";
import Modal from "../shared/ui/Modal";
import Input from "../shared/ui/Input";
import Button from "../shared/ui/Button";

export default function NewSnipModal({ isOpen, onClose, onSubmit }) {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!originalUrl.startsWith("http://") && !originalUrl.startsWith("https://")) {
      setError("URL must start with http:// or https://");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await onSubmit({ originalUrl, customAlias, expiresAt });
      setOriginalUrl("");
      setCustomAlias("");
      setExpiresAt("");
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create link");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    if (loading) return;
    setError("");
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="New Snip"
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Destination URL *"
          type="text"
          value={originalUrl}
          onChange={(e) => { setOriginalUrl(e.target.value); setError(""); }}
          placeholder="https://example.com/your-long-url"
          required
          error={error}
        />

        <div>
          <label className="block text-xs font-mono uppercase tracking-widest text-secondary mb-1.5">
            Custom Alias
          </label>
          <div className="flex items-center bg-surface-container-low border border-outline-variant/40 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all">
            <span className="pl-4 pr-1 text-sm font-mono text-secondary shrink-0">snip/</span>
            <input
              type="text"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              placeholder="my-link"
              className="flex-1 bg-transparent py-3 pr-4 text-sm font-mono placeholder:text-secondary/40 outline-none"
            />
          </div>
        </div>

        <Input
          label="Expiry Date"
          type="date"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
        />

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" size="sm" className="flex-1" onClick={handleClose} type="button" disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" className="flex-1" type="submit" disabled={loading}>
            <Link2 className="w-3.5 h-3.5" />
            {loading ? "Creating…" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Link2 } from "lucide-react";

export default function NewSnipModal({ isOpen, onClose, onSubmit }) {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (
      !originalUrl.startsWith("http://") &&
      !originalUrl.startsWith("https://")
    ) {
      setError("URL must start with http:// or https://");
      return;
    }
    setError("");
    onSubmit({ originalUrl, customAlias, expiresAt });
    setOriginalUrl("");
    setCustomAlias("");
    setExpiresAt("");
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-surface-container-lowest rounded-2xl p-6 w-full max-w-md shadow-xl pointer-events-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-primary" />
                  <h2 className="text-lg font-headline italic text-foreground">
                    New Snip
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-surface-container text-secondary transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Destination URL */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-secondary mb-1.5">
                    Destination URL *
                  </label>
                  <input
                    type="text"
                    required
                    value={originalUrl}
                    onChange={(e) => {
                      setOriginalUrl(e.target.value);
                      setError("");
                    }}
                    placeholder="https://example.com/your-long-url"
                    className="w-full bg-surface-container-low border-0 focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-sm font-body placeholder:text-secondary/40 outline-none transition-all"
                  />
                  {error && (
                    <p className="mt-1.5 text-xs text-error font-mono">
                      {error}
                    </p>
                  )}
                </div>

                {/* Custom Alias */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-secondary mb-1.5">
                    Custom Alias
                  </label>
                  <div className="flex items-center bg-surface-container-low rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-primary transition-all">
                    <span className="pl-4 pr-1 text-sm font-mono text-secondary shrink-0">
                      snip.ly/
                    </span>
                    <input
                      type="text"
                      value={customAlias}
                      onChange={(e) => setCustomAlias(e.target.value)}
                      placeholder="my-link"
                      className="flex-1 bg-transparent py-3 pr-4 text-sm font-mono placeholder:text-secondary/40 outline-none"
                    />
                  </div>
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-secondary mb-1.5">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full bg-surface-container-low border-0 focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-sm font-body outline-none transition-all"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 rounded-xl text-sm font-mono uppercase tracking-wide bg-surface-container text-secondary hover:bg-surface-container-high transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl text-sm font-mono uppercase tracking-wide bg-primary text-on-primary hover:bg-primary-container transition-colors"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

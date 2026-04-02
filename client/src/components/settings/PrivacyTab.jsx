import { useState } from "react";
import { Eye, EyeOff, Copy, RefreshCw } from "lucide-react";

const PRIVACY_TOGGLES = [
  {
    id: "publicProfile",
    label: "Public Profile",
    description: "Allow others to see your profile page",
  },
  {
    id: "showClickCounts",
    label: "Show Click Counts",
    description: "Display click stats on your public links",
  },
  {
    id: "trackLocation",
    label: "Location Analytics",
    description: "Track geographic data for click analytics",
  },
  {
    id: "trackDevice",
    label: "Device Analytics",
    description: "Collect device and browser information",
  },
  {
    id: "dataSharing",
    label: "Improve Snip",
    description: "Share anonymous usage data to help improve Snip",
  },
];

const API_KEY = "snp_k8mX3vL9pQr2nYwZ4hJb7cFd";
const MASKED_KEY = "snp_••••••••••••••••";

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${
        checked ? "bg-primary" : "bg-surface-container-high"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function PrivacyTab() {
  const [privacyToggles, setPrivacyToggles] = useState(
    Object.fromEntries(
      PRIVACY_TOGGLES.map((t) => [
        t.id,
        t.id !== "publicProfile" && t.id !== "dataSharing",
      ])
    )
  );
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(API_KEY).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-4">
      {/* Privacy Toggles */}
      <div
        className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6"
        style={{ boxShadow: "0 2px 8px rgba(0,47,45,0.05)" }}
      >
        <p className="text-xs font-mono uppercase tracking-widest text-secondary mb-1">
          Privacy
        </p>
        <h3 className="text-xl font-headline italic text-foreground mb-5">
          Privacy Controls
        </h3>
        <div className="space-y-5">
          {PRIVACY_TOGGLES.map(({ id, label, description }) => (
            <div key={id} className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-body font-medium text-foreground">
                  {label}
                </p>
                <p className="text-xs font-body text-secondary mt-0.5">
                  {description}
                </p>
              </div>
              <Toggle
                checked={privacyToggles[id]}
                onChange={() => {
                  setPrivacyToggles((prev) => ({ ...prev, [id]: !prev[id] }));
                  console.log("privacy toggled:", id);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* API Key */}
      <div
        className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6"
        style={{ boxShadow: "0 2px 8px rgba(0,47,45,0.05)" }}
      >
        <p className="text-xs font-mono uppercase tracking-widest text-secondary mb-1">
          Developer
        </p>
        <h3 className="text-xl font-headline italic text-foreground mb-5">
          API Key
        </h3>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              readOnly
              value={apiKeyVisible ? API_KEY : MASKED_KEY}
              className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm font-mono text-foreground pr-10 focus:outline-none"
            />
            <button
              onClick={() => setApiKeyVisible((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors"
            >
              {apiKeyVisible ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wide border transition-colors ${
              copied
                ? "border-primary/40 text-primary bg-primary/5"
                : "border-outline-variant/40 text-secondary hover:border-primary hover:text-primary"
            }`}
          >
            <Copy className="w-3.5 h-3.5" />
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <button
          onClick={() => console.log("regenerate API key")}
          className="flex items-center gap-1.5 mt-3 text-xs font-mono uppercase tracking-widest text-secondary hover:text-primary transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          Regenerate Key
        </button>
      </div>
    </div>
  );
}

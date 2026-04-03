import { useState } from "react";
import { Eye, EyeOff, Copy, RefreshCw } from "lucide-react";
import Card from "../shared/ui/Card";
import Toggle from "../shared/ui/Toggle";
import Input from "../shared/ui/Input";

const PRIVACY_TOGGLES = [
  { id: "publicProfile", label: "Public Profile", description: "Allow others to see your profile page" },
  { id: "showClickCounts", label: "Show Click Counts", description: "Display click stats on your public links" },
  { id: "trackLocation", label: "Location Analytics", description: "Track geographic data for click analytics" },
  { id: "trackDevice", label: "Device Analytics", description: "Collect device and browser information" },
  { id: "dataSharing", label: "Improve Snip", description: "Share anonymous usage data to help improve Snip" },
];

const DEFAULT_TOGGLES = Object.fromEntries(
  PRIVACY_TOGGLES.map((t) => [t.id, t.id !== "publicProfile" && t.id !== "dataSharing"])
);

const STATIC_API_KEY = "snp_k8mX3vL9pQr2nYwZ4hJb7cFd";
const MASKED_KEY = "snp_••••••••••••••••";

function loadToggles() {
  try {
    const saved = localStorage.getItem("snip_privacy_toggles");
    return saved ? JSON.parse(saved) : DEFAULT_TOGGLES;
  } catch {
    return DEFAULT_TOGGLES;
  }
}

export default function PrivacyTab() {
  const [privacyToggles, setPrivacyToggles] = useState(loadToggles);
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [regenerated, setRegenerated] = useState(false);

  function togglePrivacy(id) {
    setPrivacyToggles((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem("snip_privacy_toggles", JSON.stringify(next));
      return next;
    });
  }

  function handleCopy() {
    navigator.clipboard.writeText(STATIC_API_KEY).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleRegenerate() {
    setRegenerated(true);
    setTimeout(() => setRegenerated(false), 2000);
  }

  return (
    <div className="space-y-4">
      <Card>
        <p className="text-xs font-mono uppercase tracking-widest text-secondary mb-1">Privacy</p>
        <h3 className="text-xl font-headline italic text-foreground mb-3">Privacy Controls</h3>
        <div>
          {PRIVACY_TOGGLES.map(({ id, label, description }) => (
            <Toggle
              key={id}
              enabled={privacyToggles[id]}
              onChange={() => togglePrivacy(id)}
              label={label}
              description={description}
            />
          ))}
        </div>
      </Card>

      <Card>
        <p className="text-xs font-mono uppercase tracking-widest text-secondary mb-1">Developer</p>
        <h3 className="text-xl font-headline italic text-foreground mb-5">API Key</h3>
        <div className="flex gap-2">
          <Input
            value={apiKeyVisible ? STATIC_API_KEY : MASKED_KEY}
            type="text"
            className="flex-1"
            rightElement={
              <button
                onClick={() => setApiKeyVisible((v) => !v)}
                className="text-secondary hover:text-primary transition-colors"
              >
                {apiKeyVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wide border transition-colors shrink-0 ${
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
          onClick={handleRegenerate}
          className="flex items-center gap-1.5 mt-3 text-xs font-mono uppercase tracking-widest text-secondary hover:text-primary transition-colors"
        >
          <RefreshCw className={`w-3 h-3 ${regenerated ? "animate-spin" : ""}`} />
          {regenerated ? "Regenerated!" : "Regenerate Key"}
        </button>
      </Card>
    </div>
  );
}

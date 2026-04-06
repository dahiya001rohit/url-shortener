import { useState } from "react";
import { Code2, Bell } from "lucide-react";
import Card from "../shared/ui/Card";
import Toggle from "../shared/ui/Toggle";

const PRIVACY_TOGGLES = [
  {
    id: "allowAnonymousTracking",
    label: "Allow Anonymous Click Tracking",
    description: "Track geographic and device data for click analytics",
  },
  {
    id: "shareAnonymizedData",
    label: "Share Anonymized Data to Improve Snip",
    description: "Help us improve by sharing anonymous usage statistics",
  },
];

function loadToggles() {
  try {
    const saved = localStorage.getItem("snip_privacy_toggles");
    return saved ? JSON.parse(saved) : { allowAnonymousTracking: true, shareAnonymizedData: true };
  } catch {
    return { allowAnonymousTracking: true, shareAnonymizedData: true };
  }
}

export default function PrivacyTab() {
  const [privacyToggles, setPrivacyToggles] = useState(loadToggles);

  function togglePrivacy(id) {
    setPrivacyToggles((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem("snip_privacy_toggles", JSON.stringify(next));
      return next;
    });
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
        <h3 className="text-xl font-headline italic text-foreground mb-5">API Access</h3>
        <p className="text-sm text-secondary mb-4">Programmatic access to your Snip data.</p>

        <div className="bg-surface-low border border-outline-variant/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Code2 size={16} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm text-foreground">API Keys</p>
              <p className="font-mono text-xs text-secondary">Under development</p>
            </div>
            <span className="bg-accent/20 text-accent border border-accent/30 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-widest shrink-0">
              Coming Soon
            </span>
          </div>

          <p className="text-sm text-secondary leading-relaxed">
            API access is currently under development. You will be able to programmatically shorten URLs,
            fetch analytics, and manage your links.
          </p>

          <div className="mt-4 pt-4 border-t border-outline-variant/20 flex items-center gap-2">
            <Bell size={12} className="text-outline" />
            <p className="font-mono text-xs text-outline">
              We will notify you when API access is available
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

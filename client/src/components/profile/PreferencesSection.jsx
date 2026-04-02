import { useState } from "react";
import Card from "../shared/ui/Card";
import Toggle from "../shared/ui/Toggle";

const EMAIL_FREQ = ["Daily", "Weekly", "Monthly", "Never"];

const NOTIFICATION_TOGGLES = [
  { id: "weeklyDigest", label: "Weekly Analytics Digest", description: "A summary of your top links every Monday" },
  { id: "newFeatures", label: "New Feature Updates", description: "Be first to know about new Snip features" },
  { id: "linkExpiry", label: "Link Expiry Alerts", description: "3-day warning before any link expires" },
  { id: "trafficSurge", label: "Traffic Surge Alerts", description: "Notify when a link gets a sudden spike" },
  { id: "securityAlerts", label: "Security Alerts", description: "New logins and suspicious activity" },
];

export default function PreferencesSection() {
  const [theme, setTheme] = useState("Light");
  const [emailFreq, setEmailFreq] = useState("Weekly");
  const [notifs, setNotifs] = useState(
    Object.fromEntries(NOTIFICATION_TOGGLES.map((t) => [t.id, t.id !== "newFeatures"]))
  );

  return (
    <div className="space-y-4">
      <Card>
        <p className="text-xs font-mono uppercase tracking-widest text-secondary mb-1">
          Appearance
        </p>
        <h3 className="text-xl font-headline italic text-foreground mb-5">
          Theme
        </h3>
        <div className="flex gap-3">
          {["Light", "Dark", "System"].map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wide transition-colors ${
                theme === t
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container text-secondary hover:bg-surface-container-high"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <p className="text-xs font-mono uppercase tracking-widest text-secondary mb-1">
          Alerts
        </p>
        <h3 className="text-xl font-headline italic text-foreground mb-3">
          Notifications
        </h3>
        <div>
          {NOTIFICATION_TOGGLES.map(({ id, label, description }) => (
            <Toggle
              key={id}
              enabled={notifs[id]}
              onChange={() => setNotifs((n) => ({ ...n, [id]: !n[id] }))}
              label={label}
              description={description}
            />
          ))}
        </div>

        <div className="mt-5 pt-5 border-t border-outline-variant/20">
          <p className="text-xs font-mono uppercase tracking-widest text-secondary mb-3">
            Email Frequency
          </p>
          <div className="flex gap-2 flex-wrap">
            {EMAIL_FREQ.map((f) => (
              <button
                key={f}
                onClick={() => setEmailFreq(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wide transition-colors ${
                  emailFreq === f
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container text-secondary hover:bg-surface-container-high"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

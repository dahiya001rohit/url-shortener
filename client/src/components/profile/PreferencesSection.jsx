import { useState } from "react";

const EMAIL_FREQ = ["Daily", "Weekly", "Monthly", "Never"];

const NOTIFICATION_TOGGLES = [
  { id: "weeklyDigest", label: "Weekly Analytics Digest", sub: "A summary of your top links every Monday" },
  { id: "newFeatures", label: "New Feature Updates", sub: "Be first to know about new Snip features" },
  { id: "linkExpiry", label: "Link Expiry Alerts", sub: "3-day warning before any link expires" },
  { id: "trafficSurge", label: "Traffic Surge Alerts", sub: "Notify when a link gets a sudden spike" },
  { id: "securityAlerts", label: "Security Alerts", sub: "New logins and suspicious activity" },
];

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

export default function PreferencesSection() {
  const [theme, setTheme] = useState("Light");
  const [emailFreq, setEmailFreq] = useState("Weekly");
  const [notifs, setNotifs] = useState(
    Object.fromEntries(NOTIFICATION_TOGGLES.map((t) => [t.id, t.id !== "newFeatures"]))
  );

  return (
    <div className="space-y-4">
      {/* Theme */}
      <div
        className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6"
        style={{ boxShadow: "0 2px 8px rgba(0,47,45,0.05)" }}
      >
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
      </div>

      {/* Notifications */}
      <div
        className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6"
        style={{ boxShadow: "0 2px 8px rgba(0,47,45,0.05)" }}
      >
        <p className="text-xs font-mono uppercase tracking-widest text-secondary mb-1">
          Alerts
        </p>
        <h3 className="text-xl font-headline italic text-foreground mb-5">
          Notifications
        </h3>
        <div className="space-y-4">
          {NOTIFICATION_TOGGLES.map(({ id, label, sub }) => (
            <div key={id} className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-body font-medium text-foreground">{label}</p>
                <p className="text-xs font-body text-secondary mt-0.5">{sub}</p>
              </div>
              <Toggle
                checked={notifs[id]}
                onChange={() => setNotifs((n) => ({ ...n, [id]: !n[id] }))}
              />
            </div>
          ))}
        </div>

        {/* Email frequency */}
        <div className="mt-6 pt-5 border-t border-outline-variant/20">
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
      </div>
    </div>
  );
}

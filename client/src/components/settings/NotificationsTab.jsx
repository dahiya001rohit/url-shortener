import { useState } from "react";

const NOTIFICATION_ITEMS = [
  {
    id: "clickMilestones",
    label: "Click Milestones",
    description: "Get notified when a link hits 100, 1K, 10K clicks",
  },
  {
    id: "weeklyDigest",
    label: "Weekly Analytics Digest",
    description: "A summary of your top links every Monday",
  },
  {
    id: "linkExpiry",
    label: "Link Expiry Alerts",
    description: "3-day warning before any link expires",
  },
  {
    id: "trafficSurge",
    label: "Traffic Surge Alerts",
    description: "Notify when a link gets a sudden spike",
  },
  {
    id: "securityAlerts",
    label: "Security Alerts",
    description: "New logins and suspicious activity",
  },
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

export default function NotificationsTab() {
  const [notifications, setNotifications] = useState(
    Object.fromEntries(
      NOTIFICATION_ITEMS.map((item) => [
        item.id,
        item.id !== "clickMilestones",
      ])
    )
  );
  const [emailFrequency, setEmailFrequency] = useState("weekly");

  return (
    <div className="space-y-4">
      {/* Notification toggles */}
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
        <div className="space-y-5">
          {NOTIFICATION_ITEMS.map(({ id, label, description }) => (
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
                checked={notifications[id]}
                onChange={() => {
                  setNotifications((prev) => ({ ...prev, [id]: !prev[id] }));
                  console.log("notification toggled:", id);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Email Frequency */}
      <div
        className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6"
        style={{ boxShadow: "0 2px 8px rgba(0,47,45,0.05)" }}
      >
        <p className="text-xs font-mono uppercase tracking-widest text-secondary mb-1">
          Email
        </p>
        <h3 className="text-xl font-headline italic text-foreground mb-5">
          Email Frequency
        </h3>
        <div className="flex gap-2">
          {["instant", "daily", "weekly"].map((freq) => (
            <button
              key={freq}
              onClick={() => {
                setEmailFrequency(freq);
                console.log("emailFrequency:", freq);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wide transition-colors ${
                emailFrequency === freq
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container text-secondary hover:bg-surface-container-high"
              }`}
            >
              {freq}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

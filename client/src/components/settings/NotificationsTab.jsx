import { useState } from "react";
import Card from "../shared/ui/Card";
import Toggle from "../shared/ui/Toggle";

const NOTIFICATION_ITEMS = [
  { id: "clickMilestones", label: "Click Milestones", description: "Get notified when a link hits 100, 1K, 10K clicks" },
  { id: "weeklyDigest", label: "Weekly Analytics Digest", description: "A summary of your top links every Monday" },
  { id: "linkExpiry", label: "Link Expiry Alerts", description: "3-day warning before any link expires" },
  { id: "trafficSurge", label: "Traffic Surge Alerts", description: "Notify when a link gets a sudden spike" },
  { id: "securityAlerts", label: "Security Alerts", description: "New logins and suspicious activity" },
];

export default function NotificationsTab() {
  const [notifications, setNotifications] = useState(
    Object.fromEntries(NOTIFICATION_ITEMS.map((item) => [item.id, item.id !== "clickMilestones"]))
  );
  const [emailFrequency, setEmailFrequency] = useState("weekly");

  return (
    <div className="space-y-4">
      <Card>
        <p className="text-xs font-mono uppercase tracking-widest text-secondary mb-1">
          Alerts
        </p>
        <h3 className="text-xl font-headline italic text-foreground mb-3">
          Notifications
        </h3>
        <div>
          {NOTIFICATION_ITEMS.map(({ id, label, description }) => (
            <Toggle
              key={id}
              enabled={notifications[id]}
              onChange={() => {
                setNotifications((prev) => ({ ...prev, [id]: !prev[id] }));
                console.log("notification toggled:", id);
              }}
              label={label}
              description={description}
            />
          ))}
        </div>
      </Card>

      <Card>
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
      </Card>
    </div>
  );
}

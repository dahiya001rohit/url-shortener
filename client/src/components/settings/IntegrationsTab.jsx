import { useState } from "react";
import Card from "../shared/ui/Card";
import Button from "../shared/ui/Button";
import Badge from "../shared/ui/Badge";

const INTEGRATIONS = [
  { id: "zapier", name: "Zapier", description: "Automate workflows with 5,000+ apps", logo: "Z", logoColor: "#FF4A00", connectUrl: "https://zapier.com/apps/snip" },
  { id: "slack", name: "Slack", description: "Get link performance alerts in Slack", logo: "#", logoColor: "#4A154B", connectUrl: "https://slack.com/oauth/v2/authorize" },
  { id: "ga4", name: "Google Analytics 4", description: "Send click events to your GA4 property", logo: "GA", logoColor: "#E37400", connectUrl: "https://analytics.google.com" },
  { id: "webhooks", name: "Webhooks", description: "1 active endpoint receiving click events", logo: "{}", logoColor: "#002f2d", connectUrl: null },
];

const DEFAULT_CONNECTED = { zapier: false, slack: false, ga4: true, webhooks: true };

function loadConnected() {
  try {
    const saved = localStorage.getItem("snip_integrations");
    return saved ? JSON.parse(saved) : DEFAULT_CONNECTED;
  } catch {
    return DEFAULT_CONNECTED;
  }
}

export default function IntegrationsTab() {
  const [connected, setConnected] = useState(loadConnected);

  function handleAction(id, connectUrl) {
    if (connected[id]) {
      // Disconnect
      setConnected((prev) => {
        const next = { ...prev, [id]: false };
        localStorage.setItem("snip_integrations", JSON.stringify(next));
        return next;
      });
    } else {
      // Connect — open OAuth/external page if available
      if (connectUrl) {
        window.open(connectUrl, "_blank", "noopener,noreferrer");
      }
      setConnected((prev) => {
        const next = { ...prev, [id]: true };
        localStorage.setItem("snip_integrations", JSON.stringify(next));
        return next;
      });
    }
  }

  return (
    <Card>
      <p className="text-xs font-mono uppercase tracking-widest text-secondary mb-1">Integrations</p>
      <h3 className="text-xl font-headline italic text-foreground mb-5">Connected Apps</h3>
      <div className="grid grid-cols-2 gap-3">
        {INTEGRATIONS.map(({ id, name, description, logo, logoColor, connectUrl }) => {
          const isConnected = connected[id];
          return (
            <div
              key={id}
              className={`rounded-2xl p-5 flex flex-col gap-3 border ${
                isConnected ? "bg-primary border-primary" : "bg-surface-container-low border-outline-variant/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-mono font-bold text-white shrink-0"
                  style={{ backgroundColor: isConnected ? "rgba(255,255,255,0.15)" : logoColor }}
                >
                  {logo}
                </div>
                <div>
                  <p className={`text-sm font-body font-medium ${isConnected ? "text-white" : "text-foreground"}`}>
                    {name}
                  </p>
                  <Badge variant={isConnected ? "active" : "noExpiry"} className={isConnected ? "text-on-primary-container" : ""}>
                    {isConnected ? "Connected" : "Not Connected"}
                  </Badge>
                </div>
              </div>
              <p className={`text-xs font-body leading-relaxed flex-1 ${isConnected ? "text-white/70" : "text-secondary"}`}>
                {description}
              </p>
              <Button
                variant="secondary"
                size="sm"
                className={`w-full ${isConnected ? "!bg-white/10 !text-white !border-white/20 hover:!bg-white/20" : ""}`}
                onClick={() => handleAction(id, connectUrl)}
              >
                {isConnected ? "Disconnect" : "Connect"}
              </Button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

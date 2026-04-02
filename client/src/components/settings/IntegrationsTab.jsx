import Card from "../shared/ui/Card";
import Button from "../shared/ui/Button";
import Badge from "../shared/ui/Badge";

const INTEGRATIONS = [
  { id: "zapier", name: "Zapier", description: "Automate workflows with 5,000+ apps", status: "disconnected", logo: "Z", logoColor: "#FF4A00" },
  { id: "slack", name: "Slack", description: "Get link performance alerts in Slack", status: "disconnected", logo: "#", logoColor: "#4A154B" },
  { id: "ga4", name: "Google Analytics 4", description: "Send click events to your GA4 property", status: "connected", logo: "GA", logoColor: "#E37400" },
  { id: "webhooks", name: "Webhooks", description: "1 active endpoint receiving click events", status: "active", logo: "{}", logoColor: "#002f2d" },
];

export default function IntegrationsTab() {
  return (
    <Card>
      <p className="text-xs font-mono uppercase tracking-widest text-secondary mb-1">Integrations</p>
      <h3 className="text-xl font-headline italic text-foreground mb-5">Connected Apps</h3>
      <div className="grid grid-cols-2 gap-3">
        {INTEGRATIONS.map(({ id, name, description, status, logo, logoColor }) => {
          const isConnected = status !== "disconnected";
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
                variant={isConnected ? "secondary" : "secondary"}
                size="sm"
                className={`w-full ${isConnected ? "!bg-white/10 !text-white !border-white/20 hover:!bg-white/20" : ""}`}
                onClick={() => console.log(`${id} action clicked`)}
              >
                {isConnected ? "Manage" : "Connect"}
              </Button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

const INTEGRATIONS = [
  {
    id: "zapier",
    name: "Zapier",
    description: "Automate workflows with 5,000+ apps",
    status: "disconnected",
    statusLabel: "Not Connected",
    logo: "Z",
    logoColor: "#FF4A00",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Get link performance alerts in Slack",
    status: "disconnected",
    statusLabel: "Not Connected",
    logo: "#",
    logoColor: "#4A154B",
  },
  {
    id: "ga4",
    name: "Google Analytics 4",
    description: "Send click events to your GA4 property",
    status: "connected",
    statusLabel: "Connected",
    logo: "GA",
    logoColor: "#E37400",
  },
  {
    id: "webhooks",
    name: "Webhooks",
    description: "1 active endpoint receiving click events",
    status: "active",
    statusLabel: "1 Active",
    logo: "{}",
    logoColor: "#002f2d",
  },
];

export default function IntegrationsTab() {
  return (
    <div className="space-y-4">
      <div
        className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6"
        style={{ boxShadow: "0 2px 8px rgba(0,47,45,0.05)" }}
      >
        <p className="text-xs font-mono uppercase tracking-widest text-secondary mb-1">
          Integrations
        </p>
        <h3 className="text-xl font-headline italic text-foreground mb-5">
          Connected Apps
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {INTEGRATIONS.map(
            ({ id, name, description, status, statusLabel, logo, logoColor }) => {
              const isConnected = status !== "disconnected";
              return (
                <div
                  key={id}
                  className={`rounded-2xl p-5 flex flex-col gap-3 border ${
                    isConnected
                      ? "bg-primary border-primary"
                      : "bg-surface-container-low border-outline-variant/40"
                  }`}
                >
                  {/* Logo + Name */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-mono font-bold text-white shrink-0"
                      style={{
                        backgroundColor: isConnected
                          ? "rgba(255,255,255,0.15)"
                          : logoColor,
                      }}
                    >
                      {logo}
                    </div>
                    <div>
                      <p
                        className={`text-sm font-body font-medium ${
                          isConnected ? "text-white" : "text-foreground"
                        }`}
                      >
                        {name}
                      </p>
                      <p
                        className={`text-xs font-mono ${
                          isConnected
                            ? "text-on-primary-container"
                            : "text-secondary"
                        }`}
                      >
                        {statusLabel}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p
                    className={`text-xs font-body leading-relaxed flex-1 ${
                      isConnected ? "text-white/70" : "text-secondary"
                    }`}
                  >
                    {description}
                  </p>

                  {/* Action Button */}
                  <button
                    onClick={() => console.log(`${id} action clicked`)}
                    className={`w-full py-2 rounded-xl text-xs font-mono uppercase tracking-wide transition-colors ${
                      isConnected
                        ? "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                        : "bg-surface-container border border-outline-variant/40 text-secondary hover:border-primary hover:text-primary"
                    }`}
                  >
                    {isConnected ? "Manage" : "Connect"}
                  </button>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}

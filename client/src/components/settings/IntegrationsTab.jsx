import { Plug, Bell } from "lucide-react";

const INTEGRATIONS = [
  { name: "Zapier",           description: "Connect Snip to 5,000+ apps",       icon: "⚡", color: "#FF4A00" },
  { name: "Slack",            description: "Get notifications in Slack",          icon: "#",  color: "#4A154B" },
  { name: "Google Analytics", description: "Sync click data with GA4",            icon: "G",  color: "#4285F4" },
  { name: "Webhooks",         description: "Send events to your endpoint",        icon: "⚙",  color: "#002F2D" },
];

export default function IntegrationsTab() {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-2xl p-8">
      {/* Coming Soon Banner */}
      <div className="flex items-start gap-4 mb-8 p-5 bg-primary/5 border border-primary/20 rounded-2xl">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
          <Plug size={18} className="text-primary" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm text-primary mb-1">Integrations — Coming Soon</p>
          <p className="text-xs text-secondary leading-relaxed">
            We are building integrations with popular tools. These will be available in a future update.
          </p>
        </div>
        <span className="bg-accent/20 text-accent border border-accent/30 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-widest shrink-0">
          In Development
        </span>
      </div>

      {/* Disabled integration cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {INTEGRATIONS.map((item) => (
          <div
            key={item.name}
            className="relative p-5 bg-surface-low border border-outline-variant/30 rounded-xl opacity-50 cursor-not-allowed select-none"
          >
            <span className="absolute top-3 right-3 bg-surface-container text-outline rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest">
              Soon
            </span>
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
                style={{ background: item.color }}
              >
                {item.icon}
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">{item.name}</p>
                <p className="text-xs text-secondary mt-0.5">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Notify footer */}
      <div className="mt-6 pt-5 border-t border-outline-variant/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell size={13} className="text-outline" />
          <p className="font-mono text-xs text-outline">Want to know when integrations launch?</p>
        </div>
        <button className="font-mono text-xs text-primary hover:underline transition">
          Notify me →
        </button>
      </div>
    </div>
  );
}

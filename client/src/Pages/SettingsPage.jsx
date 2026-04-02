import { useState } from "react";
import { Palette, Bell, Link2, Shield, Puzzle } from "lucide-react";
import AppearanceTab from "../components/settings/AppearanceTab";
import NotificationsTab from "../components/settings/NotificationsTab";
import LinksTab from "../components/settings/LinksTab";
import PrivacyTab from "../components/settings/PrivacyTab";
import IntegrationsTab from "../components/settings/IntegrationsTab";
import PageHeader from "../components/shared/layout/PageHeader";
import SidebarNav from "../components/shared/layout/SidebarNav";
import Card from "../components/shared/ui/Card";

const SETTINGS_TABS = [
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "links", label: "Links", icon: Link2 },
  { id: "privacy", label: "Privacy", icon: Shield },
  { id: "integrations", label: "Integrations", icon: Puzzle },
];

const CONFIG_ROWS = [
  { label: "Theme", value: "Light" },
  { label: "Region", value: "US/Pacific" },
  { label: "Plan", value: "Free" },
  { label: "API Access", value: "Enabled" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("appearance");

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-6xl mx-auto px-8 pt-28 pb-24">
        <PageHeader
          label="Settings"
          heading="Preferences."
          subtext="Customize your Snip experience."
        />

        <div className="grid grid-cols-12 gap-8 mt-10">
          <div className="col-span-2">
            <SidebarNav
              tabs={SETTINGS_TABS}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          <div className="col-span-7">
            {activeTab === "appearance" && <AppearanceTab />}
            {activeTab === "notifications" && <NotificationsTab />}
            {activeTab === "links" && <LinksTab />}
            {activeTab === "privacy" && <PrivacyTab />}
            {activeTab === "integrations" && <IntegrationsTab />}
          </div>

          <div className="col-span-3 space-y-4">
            <Card>
              <p className="text-xs font-mono uppercase tracking-widest text-secondary mb-1">
                Summary
              </p>
              <h3 className="text-xl font-headline italic text-foreground mb-5">
                Current Config
              </h3>
              <div>
                {CONFIG_ROWS.map(({ label, value }, i) => (
                  <div
                    key={label}
                    className={`flex items-center justify-between py-3 ${
                      i < CONFIG_ROWS.length - 1
                        ? "border-b border-outline-variant/20"
                        : ""
                    }`}
                  >
                    <span className="text-xs font-body text-secondary">{label}</span>
                    <span className="text-xs font-mono font-medium text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </Card>

            <div
              className="bg-primary rounded-2xl p-6 relative overflow-hidden"
              style={{ boxShadow: "0 2px 8px rgba(0,47,45,0.1)" }}
            >
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.05]"
                style={{
                  backgroundImage: "radial-gradient(rgba(255,255,255,1) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
              <div className="relative z-10">
                <p className="text-xs font-mono uppercase tracking-widest text-on-primary-container mb-1">
                  Support
                </p>
                <h3 className="text-xl font-headline italic text-white mb-2">
                  Need Help?
                </h3>
                <p className="text-xs font-body text-white/60 leading-relaxed mb-4">
                  Browse the docs, watch tutorials, or reach out to our team.
                </p>
                <button
                  onClick={() => console.log("open docs")}
                  className="w-full py-2 rounded-full text-xs font-mono uppercase tracking-wide bg-accent text-on-accent hover:opacity-90 transition-colors"
                >
                  View Docs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

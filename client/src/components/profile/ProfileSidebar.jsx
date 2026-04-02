import { User, Lock, CreditCard, Settings2, Zap } from "lucide-react";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Lock },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "preferences", label: "Preferences", icon: Settings2 },
];

export default function ProfileSidebar({ activeTab, onTabChange }) {
  return (
    <div className="flex flex-col gap-2">
      <nav className="space-y-0.5">
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body transition-all text-left border-l-2 ${
                isActive
                  ? "border-primary text-primary font-bold bg-primary/5"
                  : "border-transparent text-secondary hover:text-primary hover:bg-surface-container"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Upgrade nudge */}
      <div className="mt-4 bg-primary/5 border border-primary/10 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-3.5 h-3.5 text-accent" />
          <p className="text-xs font-mono uppercase tracking-widest text-primary">
            Go Pro
          </p>
        </div>
        <p className="text-xs font-body text-secondary leading-relaxed mb-3">
          Unlock unlimited links, custom domains, and deep analytics.
        </p>
        <button className="w-full py-2 rounded-full text-xs font-mono uppercase tracking-wide bg-primary text-on-primary hover:bg-primary-container transition-colors">
          Upgrade
        </button>
      </div>
    </div>
  );
}

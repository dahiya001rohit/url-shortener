import PlanUpgradeCard from "./PlanUpgradeCard";

export default function SidebarNav({
  tabs,
  activeTab,
  onTabChange,
  showUpgrade = true,
}) {
  return (
    <div className="flex flex-col">
      <nav className="space-y-0.5">
        {tabs.map(({ id, label, icon: Icon }) => {
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
              {Icon && <Icon className="w-4 h-4 shrink-0" />}
              {label}
            </button>
          );
        })}
      </nav>

      {showUpgrade && <PlanUpgradeCard />}
    </div>
  );
}

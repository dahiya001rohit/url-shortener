export default function SidebarNav({ tabs, activeTab, onTabChange }) {
  return (
    <nav className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:overflow-x-visible lg:pb-0 scrollbar-hide">
      {tabs.map(({ id, label, icon: Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-body transition-all text-left border whitespace-nowrap lg:w-full ${
              isActive
                ? "border-primary/20 text-primary font-semibold bg-primary/5"
                : "border-transparent text-secondary hover:text-primary hover:bg-surface-container"
            }`}
          >
            {Icon && <Icon className="w-4 h-4 shrink-0" />}
            <span className="hidden sm:block lg:block">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

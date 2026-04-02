import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, BarChart2, Settings, Lightbulb } from "lucide-react";

const TIPS = [
  "Custom domains can increase click-through rates by up to 34%. Head to Settings to connect your brand.",
  "Adding expiry dates to campaign links keeps your workspace clean and your reports accurate.",
  "Links with descriptive aliases get 2× more trust clicks than random short codes.",
];

export default function QuickActions({ onNewSnip }) {
  const navigate = useNavigate();
  const [tipIndex, setTipIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setTipIndex((i) => (i + 1) % TIPS.length);
        setVisible(true);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const actions = [
    { label: "Create New Snip", icon: Plus, onClick: () => onNewSnip?.() },
    { label: "View Detailed Analytics", icon: BarChart2, onClick: () => navigate("/dashboard") },
    { label: "Manage Settings", icon: Settings, onClick: () => navigate("/settings") },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Action buttons */}
      <div
        className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6"
        style={{ boxShadow: "0 2px 8px rgba(0,47,45,0.05)" }}
      >
        <p className="text-xs font-mono uppercase tracking-widest text-secondary mb-4">
          Quick Actions
        </p>
        <div className="space-y-2">
          {actions.map(({ label, icon: Icon, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-sm font-body text-foreground transition-colors text-left"
            >
              <Icon className="w-4 h-4 text-secondary shrink-0" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Did you know tip */}
      <div
        className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-5"
        style={{ boxShadow: "0 2px 8px rgba(0,47,45,0.05)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-accent shrink-0" />
          <p className="text-xs font-mono uppercase tracking-widest text-secondary">
            Did you know?
          </p>
        </div>
        <p
          className="text-sm font-body text-foreground leading-relaxed transition-opacity duration-300"
          style={{ opacity: visible ? 1 : 0 }}
        >
          {TIPS[tipIndex]}
        </p>
        {/* Dot indicators */}
        <div className="flex items-center gap-1.5 mt-4">
          {TIPS.map((_, i) => (
            <button
              key={i}
              onClick={() => { setTipIndex(i); setVisible(true); }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === tipIndex ? "w-4 bg-primary" : "w-1.5 bg-outline-variant"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

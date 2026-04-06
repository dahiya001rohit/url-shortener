import { useState, useEffect } from "react";
import Card from "../shared/ui/Card";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const ACCENT_COLORS = [
  { name: "Teal",   value: "#002F2D" },
  { name: "Amber",  value: "#FFB95F" },
  { name: "Blue",   value: "#3B82F6" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Red",    value: "#EF4444" },
  { name: "Green",  value: "#10B981" },
];

const DENSITY_OPTIONS = [
  { id: "comfortable", label: "Comfortable" },
  { id: "compact",     label: "Compact" },
  { id: "cozy",        label: "Cozy" },
];

export default function AppearanceTab() {
  const { user, applyPreferences } = useAuth();

  const [accentColor, setAccentColor] = useState(
    () => localStorage.getItem("snip-accent") || "#002F2D"
  );
  const [density, setDensity] = useState(
    () => localStorage.getItem("snip-density") || "comfortable"
  );
  const [fontSize, setFontSize] = useState(
    () => Number(localStorage.getItem("snip_fontSize")) || 14
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedAccent = localStorage.getItem("snip-accent");
    if (savedAccent) {
      document.documentElement.style.setProperty("--primary", savedAccent);
      document.documentElement.style.setProperty("--ring", savedAccent);
    }
    const savedDensity = localStorage.getItem("snip-density") || "comfortable";
    document.documentElement.setAttribute("data-density", savedDensity);
    const savedSize = Number(localStorage.getItem("snip_fontSize")) || 14;
    document.documentElement.style.fontSize = `${savedSize}px`;
  }, []);

  function handleAccentChange(color) {
    setAccentColor(color);
    localStorage.setItem("snip-accent", color);
    document.documentElement.style.setProperty("--primary", color);
    document.documentElement.style.setProperty("--ring", color);
  }

  function handleDensityChange(val) {
    setDensity(val);
    localStorage.setItem("snip-density", val);
    document.documentElement.setAttribute("data-density", val);
  }

  function handleFontSize(val) {
    const n = Number(val);
    setFontSize(n);
    localStorage.setItem("snip_fontSize", String(n));
    document.documentElement.style.fontSize = `${n}px`;
  }

  async function handleSave() {
    try {
      setSaving(true);
      const updatedPrefs = {
        ...(user?.preferences || {}),
        accentColor,
        density,
        fontSize,
      };
      await api.patch("/user/preferences", { preferences: updatedPrefs });
      applyPreferences(updatedPrefs);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <p className="text-xs font-mono uppercase tracking-widest text-secondary mb-1">Color</p>
        <h3 className="text-xl font-headline italic text-foreground mb-5">Accent Color</h3>
        <div className="flex items-center gap-3 flex-wrap">
          {ACCENT_COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => handleAccentChange(color.value)}
              title={color.name}
              className="w-8 h-8 rounded-full transition-all duration-200 hover:scale-110 focus:outline-none"
              style={{
                background: color.value,
                boxShadow: accentColor === color.value
                  ? `0 0 0 2px white, 0 0 0 4px ${color.value}`
                  : "none",
                transform: accentColor === color.value ? "scale(1.15)" : "scale(1)",
              }}
            />
          ))}
        </div>
      </Card>

      <Card>
        <p className="text-xs font-mono uppercase tracking-widest text-secondary mb-1">Layout</p>
        <h3 className="text-xl font-headline italic text-foreground mb-5">Display Density</h3>
        <div className="flex gap-2">
          {DENSITY_OPTIONS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => handleDensityChange(id)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wide transition-colors ${
                density === id
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container text-secondary hover:bg-surface-container-high"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <p className="text-xs font-mono uppercase tracking-widest text-secondary mb-1">Typography</p>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-headline italic text-foreground">Font Size</h3>
          <span className="text-sm font-mono font-medium text-primary">{fontSize}px</span>
        </div>
        <input
          type="range"
          min={12}
          max={20}
          value={fontSize}
          onChange={(e) => handleFontSize(e.target.value)}
          className="w-full accent-primary"
        />
        <div className="flex justify-between mt-2">
          <span className="text-xs font-mono text-outline">12px</span>
          <span className="text-xs font-mono text-outline">20px</span>
        </div>
      </Card>

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-primary text-on-primary rounded-full px-6 py-2.5 font-bold text-sm hover:opacity-90 transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
      >
        {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Preferences"}
      </button>
    </div>
  );
}

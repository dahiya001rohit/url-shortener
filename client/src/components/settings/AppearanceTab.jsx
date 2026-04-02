import { useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

const ACCENT_COLORS = [
  { value: "#002f2d", label: "Forest" },
  { value: "#1d4ed8", label: "Cobalt" },
  { value: "#7c3aed", label: "Violet" },
  { value: "#be123c", label: "Rose" },
  { value: "#b45309", label: "Amber" },
  { value: "#0f766e", label: "Teal" },
];

const THEME_ICONS = { light: Sun, dark: Moon, system: Monitor };

function ThemeCard({ theme, isActive, onClick }) {
  const Icon = THEME_ICONS[theme];
  const isDark = theme === "dark";
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${
        isActive
          ? "border-primary bg-primary/5 ring-1 ring-primary"
          : "border-outline-variant/40 hover:border-outline-variant bg-surface-container-low"
      }`}
    >
      {/* Mini preview mockup */}
      <div
        className={`w-full h-16 rounded-xl overflow-hidden flex flex-col border border-outline-variant/20 ${
          isDark ? "bg-gray-900" : "bg-white"
        }`}
      >
        <div
          className={`h-3 flex items-center px-2 gap-1 ${
            isDark ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          <span className="w-1 h-1 rounded-full bg-red-400" />
          <span className="w-1 h-1 rounded-full bg-yellow-400" />
          <span className="w-1 h-1 rounded-full bg-green-400" />
        </div>
        <div className="flex flex-1 gap-1 p-1">
          <div
            className={`w-6 rounded-md ${
              isDark ? "bg-gray-700" : "bg-gray-200"
            }`}
          />
          <div className="flex-1 space-y-1 pt-0.5">
            <div
              className={`h-1.5 rounded w-3/4 ${
                isDark ? "bg-gray-600" : "bg-gray-300"
              }`}
            />
            <div
              className={`h-1 rounded w-1/2 ${
                isDark ? "bg-gray-700" : "bg-gray-200"
              }`}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <Icon className="w-3 h-3 text-secondary" />
        <span className="text-xs font-mono uppercase tracking-wide text-secondary">
          {theme}
        </span>
      </div>
    </button>
  );
}

export default function AppearanceTab() {
  const [theme, setTheme] = useState("light");
  const [accentColor, setAccentColor] = useState("#002f2d");
  const [density, setDensity] = useState("comfortable");
  const [fontSize, setFontSize] = useState(14);

  return (
    <div className="space-y-4">
      {/* Theme */}
      <div
        className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6"
        style={{ boxShadow: "0 2px 8px rgba(0,47,45,0.05)" }}
      >
        <p className="text-xs font-mono uppercase tracking-widest text-secondary mb-1">
          Appearance
        </p>
        <h3 className="text-xl font-headline italic text-foreground mb-5">
          Theme Preference
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {["light", "dark", "system"].map((t) => (
            <ThemeCard
              key={t}
              theme={t}
              isActive={theme === t}
              onClick={() => {
                setTheme(t);
                console.log("theme:", t);
              }}
            />
          ))}
        </div>
      </div>

      {/* Accent Color */}
      <div
        className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6"
        style={{ boxShadow: "0 2px 8px rgba(0,47,45,0.05)" }}
      >
        <p className="text-xs font-mono uppercase tracking-widest text-secondary mb-1">
          Color
        </p>
        <h3 className="text-xl font-headline italic text-foreground mb-5">
          Accent Color
        </h3>
        <div className="flex gap-3 flex-wrap">
          {ACCENT_COLORS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => {
                setAccentColor(value);
                console.log("accent:", value);
              }}
              className={`w-8 h-8 rounded-full transition-all ${
                accentColor === value
                  ? "ring-2 ring-offset-2 ring-primary scale-110"
                  : "hover:scale-105"
              }`}
              style={{ backgroundColor: value }}
              title={label}
            />
          ))}
        </div>
      </div>

      {/* Density */}
      <div
        className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6"
        style={{ boxShadow: "0 2px 8px rgba(0,47,45,0.05)" }}
      >
        <p className="text-xs font-mono uppercase tracking-widest text-secondary mb-1">
          Layout
        </p>
        <h3 className="text-xl font-headline italic text-foreground mb-5">
          Display Density
        </h3>
        <div className="flex gap-2">
          {["comfortable", "compact", "cozy"].map((d) => (
            <button
              key={d}
              onClick={() => {
                setDensity(d);
                console.log("density:", d);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wide transition-colors ${
                density === d
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container text-secondary hover:bg-surface-container-high"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div
        className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6"
        style={{ boxShadow: "0 2px 8px rgba(0,47,45,0.05)" }}
      >
        <p className="text-xs font-mono uppercase tracking-widest text-secondary mb-1">
          Typography
        </p>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-headline italic text-foreground">
            Font Size
          </h3>
          <span className="text-sm font-mono font-medium text-primary">
            {fontSize}px
          </span>
        </div>
        <input
          type="range"
          min={12}
          max={20}
          value={fontSize}
          onChange={(e) => {
            setFontSize(Number(e.target.value));
            console.log("fontSize:", e.target.value);
          }}
          className="w-full accent-primary"
        />
        <div className="flex justify-between mt-2">
          <span className="text-xs font-mono text-outline">12px</span>
          <span className="text-xs font-mono text-outline">20px</span>
        </div>
      </div>
    </div>
  );
}

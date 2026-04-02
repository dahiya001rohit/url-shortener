import { useState } from "react";
import { Lock, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${
        checked ? "bg-primary" : "bg-surface-container-high"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function LinksTab() {
  const [defaultExpiry, setDefaultExpiry] = useState("never");
  const [aliasStyle, setAliasStyle] = useState("Word-Scale");
  const [autoTag, setAutoTag] = useState(false);
  const [utmEnabled, setUtmEnabled] = useState(false);
  const [utmSource, setUtmSource] = useState("");
  const [utmMedium, setUtmMedium] = useState("");
  const [utmCampaign, setUtmCampaign] = useState("");

  return (
    <div className="space-y-4">
      {/* Default Expiry + Alias Style */}
      <div
        className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6"
        style={{ boxShadow: "0 2px 8px rgba(0,47,45,0.05)" }}
      >
        <p className="text-xs font-mono uppercase tracking-widest text-secondary mb-1">
          Defaults
        </p>
        <h3 className="text-xl font-headline italic text-foreground mb-5">
          Link Settings
        </h3>

        {/* Default Expiry */}
        <div className="mb-5">
          <p className="text-xs font-mono uppercase tracking-widest text-secondary mb-2">
            Default Expiry
          </p>
          <div className="relative">
            <select
              value={defaultExpiry}
              onChange={(e) => {
                setDefaultExpiry(e.target.value);
                console.log("expiry:", e.target.value);
              }}
              className="w-full appearance-none bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm font-body text-foreground pr-10 focus:outline-none focus:border-primary transition-colors"
            >
              <option value="never">Never</option>
              <option value="24h">24 Hours</option>
              <option value="7d">7 Days</option>
              <option value="30d">30 Days</option>
              <option value="90d">90 Days</option>
              <option value="1y">1 Year</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary pointer-events-none" />
          </div>
        </div>

        {/* Alias Style */}
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-secondary mb-2">
            Alias Style
          </p>
          <div className="flex gap-2">
            {["Word-Scale", "Alpha-Numeric", "Short-Hash"].map((style) => (
              <button
                key={style}
                onClick={() => {
                  setAliasStyle(style);
                  console.log("aliasStyle:", style);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-mono uppercase tracking-wide transition-colors ${
                  aliasStyle === style
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container text-secondary hover:bg-surface-container-high"
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Auto Tag + UTM */}
      <div
        className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6"
        style={{ boxShadow: "0 2px 8px rgba(0,47,45,0.05)" }}
      >
        <p className="text-xs font-mono uppercase tracking-widest text-secondary mb-1">
          Tracking
        </p>
        <h3 className="text-xl font-headline italic text-foreground mb-5">
          UTM Parameters
        </h3>

        {/* Auto Tag toggle */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm font-body font-medium text-foreground">
              Auto-Tag Links
            </p>
            <p className="text-xs font-body text-secondary mt-0.5">
              Automatically append UTM parameters to new links
            </p>
          </div>
          <Toggle
            checked={autoTag}
            onChange={() => {
              setAutoTag((v) => !v);
              console.log("autoTag toggled");
            }}
          />
        </div>

        {/* UTM Enabled toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-body font-medium text-foreground">
              Custom UTM Defaults
            </p>
            <p className="text-xs font-body text-secondary mt-0.5">
              Set default UTM values for all new links
            </p>
          </div>
          <Toggle
            checked={utmEnabled}
            onChange={() => {
              setUtmEnabled((v) => !v);
              console.log("utmEnabled toggled");
            }}
          />
        </div>

        {/* UTM fields - animated expand */}
        <AnimatePresence>
          {utmEnabled && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-outline-variant/20 space-y-3">
                {[
                  {
                    label: "UTM Source",
                    value: utmSource,
                    onChange: setUtmSource,
                    placeholder: "e.g. newsletter",
                  },
                  {
                    label: "UTM Medium",
                    value: utmMedium,
                    onChange: setUtmMedium,
                    placeholder: "e.g. email",
                  },
                  {
                    label: "UTM Campaign",
                    value: utmCampaign,
                    onChange: setUtmCampaign,
                    placeholder: "e.g. spring_launch",
                  },
                ].map(({ label, value, onChange, placeholder }) => (
                  <div key={label}>
                    <label className="text-xs font-mono uppercase tracking-widest text-secondary block mb-1">
                      {label}
                    </label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      placeholder={placeholder}
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm font-body text-foreground placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Custom Domain - Pro locked */}
      <div
        className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6"
        style={{ boxShadow: "0 2px 8px rgba(0,47,45,0.05)" }}
      >
        <p className="text-xs font-mono uppercase tracking-widest text-secondary mb-1">
          Domain
        </p>
        <h3 className="text-xl font-headline italic text-foreground mb-5">
          Custom Domain
        </h3>
        <div className="relative">
          <input
            type="text"
            disabled
            value="yourname.com"
            className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm font-body text-outline pr-10 cursor-not-allowed"
          />
          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
        </div>
        <p className="text-xs font-body text-secondary mt-3">
          Custom domains require a Pro plan.{" "}
          <button
            className="font-mono uppercase tracking-wide text-xs"
            style={{ color: "#FFB95F" }}
            onClick={() => console.log("upgrade clicked")}
          >
            Upgrade to Premium →
          </button>
        </p>
      </div>
    </div>
  );
}

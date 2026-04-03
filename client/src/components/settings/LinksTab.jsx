import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "../shared/ui/Card";
import Toggle from "../shared/ui/Toggle";
import Input from "../shared/ui/Input";

function loadStr(key, def) {
  return localStorage.getItem(key) || def;
}
function loadBool(key, def) {
  const v = localStorage.getItem(key);
  return v === null ? def : v === "true";
}

export default function LinksTab() {
  const [defaultExpiry, setDefaultExpiry] = useState(() => loadStr("snip_default_expiry", "never"));
  const [aliasStyle, setAliasStyle] = useState(() => loadStr("snip_alias_style", "Word-Scale"));
  const [autoTag, setAutoTag] = useState(() => loadBool("snip_auto_tag", false));
  const [utmEnabled, setUtmEnabled] = useState(() => loadBool("snip_utm_enabled", false));
  const [utmSource, setUtmSource] = useState(() => loadStr("snip_utm_source", ""));
  const [utmMedium, setUtmMedium] = useState(() => loadStr("snip_utm_medium", ""));
  const [utmCampaign, setUtmCampaign] = useState(() => loadStr("snip_utm_campaign", ""));

  function handleExpiry(val) {
    setDefaultExpiry(val);
    localStorage.setItem("snip_default_expiry", val);
  }
  function handleAliasStyle(val) {
    setAliasStyle(val);
    localStorage.setItem("snip_alias_style", val);
  }
  function handleAutoTag() {
    setAutoTag((v) => {
      localStorage.setItem("snip_auto_tag", String(!v));
      return !v;
    });
  }
  function handleUtmEnabled() {
    setUtmEnabled((v) => {
      localStorage.setItem("snip_utm_enabled", String(!v));
      return !v;
    });
  }
  function handleUtmField(key, setter) {
    return (e) => {
      setter(e.target.value);
      localStorage.setItem(key, e.target.value);
    };
  }

  return (
    <div className="space-y-4">
      <Card>
        <p className="text-xs font-mono uppercase tracking-widest text-secondary mb-1">Defaults</p>
        <h3 className="text-xl font-headline italic text-foreground mb-5">Link Settings</h3>

        <div className="mb-5">
          <p className="text-xs font-mono uppercase tracking-widest text-secondary mb-2">Default Expiry</p>
          <div className="relative">
            <select
              value={defaultExpiry}
              onChange={(e) => handleExpiry(e.target.value)}
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

        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-secondary mb-2">Alias Style</p>
          <div className="flex gap-2">
            {["Word-Scale", "Alpha-Numeric", "Short-Hash"].map((style) => (
              <button
                key={style}
                onClick={() => handleAliasStyle(style)}
                className={`flex-1 py-2 rounded-xl text-xs font-mono uppercase tracking-wide transition-colors ${
                  aliasStyle === style ? "bg-primary text-on-primary" : "bg-surface-container text-secondary hover:bg-surface-container-high"
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <p className="text-xs font-mono uppercase tracking-widest text-secondary mb-1">Tracking</p>
        <h3 className="text-xl font-headline italic text-foreground mb-3">UTM Parameters</h3>

        <Toggle
          enabled={autoTag}
          onChange={handleAutoTag}
          label="Auto-Tag Links"
          description="Automatically append UTM parameters to new links"
        />
        <Toggle
          enabled={utmEnabled}
          onChange={handleUtmEnabled}
          label="Custom UTM Defaults"
          description="Set default UTM values for all new links"
        />

        <AnimatePresence>
          {utmEnabled && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-2 space-y-3">
                <Input
                  label="UTM Source"
                  value={utmSource}
                  onChange={handleUtmField("snip_utm_source", setUtmSource)}
                  placeholder="e.g. newsletter"
                />
                <Input
                  label="UTM Medium"
                  value={utmMedium}
                  onChange={handleUtmField("snip_utm_medium", setUtmMedium)}
                  placeholder="e.g. email"
                />
                <Input
                  label="UTM Campaign"
                  value={utmCampaign}
                  onChange={handleUtmField("snip_utm_campaign", setUtmCampaign)}
                  placeholder="e.g. spring_launch"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

    </div>
  );
}

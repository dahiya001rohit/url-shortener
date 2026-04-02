import { useState } from "react";
import { Lock, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "../shared/ui/Card";
import Toggle from "../shared/ui/Toggle";
import Input from "../shared/ui/Input";

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
      <Card>
        <p className="text-xs font-mono uppercase tracking-widest text-secondary mb-1">Defaults</p>
        <h3 className="text-xl font-headline italic text-foreground mb-5">Link Settings</h3>

        <div className="mb-5">
          <p className="text-xs font-mono uppercase tracking-widest text-secondary mb-2">Default Expiry</p>
          <div className="relative">
            <select
              value={defaultExpiry}
              onChange={(e) => { setDefaultExpiry(e.target.value); console.log("expiry:", e.target.value); }}
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
                onClick={() => { setAliasStyle(style); console.log("aliasStyle:", style); }}
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
          onChange={() => { setAutoTag((v) => !v); console.log("autoTag toggled"); }}
          label="Auto-Tag Links"
          description="Automatically append UTM parameters to new links"
        />
        <Toggle
          enabled={utmEnabled}
          onChange={() => { setUtmEnabled((v) => !v); console.log("utmEnabled toggled"); }}
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
                <Input label="UTM Source" value={utmSource} onChange={(e) => setUtmSource(e.target.value)} placeholder="e.g. newsletter" />
                <Input label="UTM Medium" value={utmMedium} onChange={(e) => setUtmMedium(e.target.value)} placeholder="e.g. email" />
                <Input label="UTM Campaign" value={utmCampaign} onChange={(e) => setUtmCampaign(e.target.value)} placeholder="e.g. spring_launch" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      <Card>
        <p className="text-xs font-mono uppercase tracking-widest text-secondary mb-1">Domain</p>
        <h3 className="text-xl font-headline italic text-foreground mb-5">Custom Domain</h3>
        <Input
          value="yourname.com"
          disabled
          rightElement={<Lock className="w-4 h-4 text-outline" />}
        />
        <p className="text-xs font-body text-secondary mt-3">
          Custom domains require a Pro plan.{" "}
          <button
            className="font-mono uppercase tracking-wide text-xs bg-accent text-on-accent px-2 py-0.5 rounded-full hover:opacity-90 transition-colors"
            onClick={() => console.log("upgrade clicked")}
          >
            Upgrade to Premium →
          </button>
        </p>
      </Card>
    </div>
  );
}

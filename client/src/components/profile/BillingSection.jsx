import { Check, X } from "lucide-react";
import Card from "../shared/ui/Card";
import Badge from "../shared/ui/Badge";

const FREE_FEATURES = [
  { label: "50 Active Links", included: true },
  { label: "Basic Analytics", included: true },
  { label: "Standard Themes", included: true },
  { label: "Custom Domains", included: false },
  { label: "Deep Analytics", included: false },
  { label: "Priority Support", included: false },
];

const PRO_FEATURES = [
  { label: "Unlimited Links", included: true },
  { label: "Deep Analytics", included: true },
  { label: "Custom Domains", included: true },
  { label: "Premium Themes", included: true },
  { label: "API Access", included: true },
  { label: "Priority Support", included: true },
];

function FeatureRow({ label, included, light }) {
  return (
    <div className="flex items-center gap-2">
      {included ? (
        <Check className={`w-3.5 h-3.5 shrink-0 ${light ? "text-on-primary-container" : "text-primary"}`} />
      ) : (
        <X className="w-3.5 h-3.5 shrink-0 text-outline/50" />
      )}
      <span className={`text-xs font-body ${included ? (light ? "text-white/80" : "text-foreground") : "text-outline/60"}`}>
        {label}
      </span>
    </div>
  );
}

export default function BillingSection() {
  return (
    <Card>
      <p className="text-xs font-mono uppercase tracking-widest text-secondary mb-1">
        Billing
      </p>
      <h3 className="text-xl font-headline italic text-foreground mb-6">
        Your Plan
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Free */}
        <div className="bg-surface-container-low border border-outline-variant/40 rounded-2xl p-5 flex flex-col">
          <Badge variant="noExpiry" className="self-start mb-2">Current</Badge>
          <h4 className="text-lg font-headline italic text-foreground">Free</h4>
          <p className="text-xs font-body text-secondary mb-4">For minimalist curators</p>
          <p className="text-3xl font-headline text-foreground mb-5">
            $0<span className="text-sm font-body text-secondary">/mo</span>
          </p>
          <div className="space-y-2 flex-1">
            {FREE_FEATURES.map((f) => (
              <FeatureRow key={f.label} {...f} />
            ))}
          </div>
          <button
            disabled
            className="mt-5 w-full py-2.5 rounded-full text-xs font-mono uppercase tracking-wide bg-surface-container text-outline cursor-default"
          >
            Current Plan
          </button>
        </div>

        {/* Pro */}
        <div className="bg-primary rounded-2xl p-5 flex flex-col relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.05]"
            style={{
              backgroundImage: "radial-gradient(rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative z-10 flex flex-col h-full">
            <Badge variant="premium" className="self-start mb-2">Recommended</Badge>
            <h4 className="text-lg font-headline italic text-white">Pro</h4>
            <p className="text-xs font-body text-white/60 mb-4">For the digital architects</p>
            <p className="text-3xl font-headline text-white mb-5">
              $12<span className="text-sm font-body text-white/60">/mo</span>
            </p>
            <div className="space-y-2 flex-1">
              {PRO_FEATURES.map((f) => (
                <FeatureRow key={f.label} {...f} light />
              ))}
            </div>
            <button
              onClick={() => console.log("upgrade to pro")}
              className="mt-5 w-full py-2.5 rounded-full text-xs font-mono uppercase tracking-wide transition-colors bg-accent text-on-accent hover:opacity-90"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

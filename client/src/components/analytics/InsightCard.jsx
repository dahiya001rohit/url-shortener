import { Sparkles } from "lucide-react";

export default function InsightCard() {
  return (
    <div
      className="bg-primary rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden"
      style={{ minHeight: "280px" }}
    >
      {/* Dot grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Glow blob */}
      <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-primary-container rounded-full blur-[80px] opacity-30" />

      <div className="relative z-10">
        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-6">
          <Sparkles className="w-5 h-5 text-accent" />
        </div>

        {/* Quote */}
        <blockquote className="text-2xl font-headline italic text-white leading-snug mb-4">
          "Every click tells a story about your audience's intent."
        </blockquote>

        <p className="text-xs font-mono uppercase tracking-widest text-on-primary-container">
          Engagement Insight · This Period
        </p>
      </div>

      {/* Bottom row */}
      <div className="relative z-10 flex items-center justify-between mt-8">
        {/* Avatar stack */}
        <div className="flex -space-x-2">
          {["#9cd0cc", "#FFB95F", "#BFC8C7"].map((bg, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full border-2 border-primary"
              style={{ background: bg }}
            />
          ))}
        </div>
        <span className="font-mono text-xs text-on-primary-container">
          +6.2k unique viewers
        </span>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";

const DOT_GRID = {
  backgroundImage: "radial-gradient(rgba(255,255,255,1) 1px, transparent 1px)",
  backgroundSize: "32px 32px",
};

const CONTENT = {
  login: {
    headline: "Every great link starts with a single snip.",
    tagline: "— THE SNIP PHILOSOPHY",
    sub: null,
  },
  register: {
    headline: '"Great curation is the bridge between noise and knowledge."',
    tagline: "— THE SNIP MANIFESTO",
    sub: "Join 50,000+ digital collectors who use Snip to organize the web's most valuable fragments.",
  },
};

export default function AuthLeftPanel({ variant = "login" }) {
  const content = CONTENT[variant] ?? CONTENT.login;

  return (
    <section className="md:w-[41.66%] bg-primary relative flex flex-col justify-between p-12 md:p-16 lg:p-20 overflow-hidden">
      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.08]" style={DOT_GRID} />
      {/* Glow blob */}
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary-container rounded-full blur-[120px] opacity-40" />

      {/* Branding */}
      <div className="relative z-10">
        <Link to="/" className="text-3xl font-headline italic tracking-tight text-white">
          Snip.
        </Link>
      </div>

      {/* Hero text */}
      <div className="relative z-10 max-w-sm my-auto flex items-start gap-4">
        <div className="mt-4 w-1.5 h-1.5 rounded-full bg-[#FFB95F] shrink-0" />
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-headline italic leading-tight text-white">
            {content.headline}
          </h1>
          {content.sub && (
            <p className="font-body text-sm text-white/60 leading-relaxed">{content.sub}</p>
          )}
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/40">
            {content.tagline}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="relative z-10 font-mono text-xs tracking-widest uppercase text-white/60">
        <span className="text-white">2M+</span> Links ·{" "}
        <span className="text-white">45k</span> Creators ·{" "}
        <span className="text-white">99.9%</span> Uptime
      </div>
    </section>
  );
}

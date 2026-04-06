import { useEffect, useRef, useState } from "react";

const SERVER_BASE = (process.env.REACT_APP_API_URL || "http://localhost:5010/api").replace(/\/api$/, "");
const BASE_URL = SERVER_BASE.replace(/^https?:\/\//, "");
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Link2, ArrowRight, Sparkles, Lock } from "lucide-react";

const PLACEHOLDERS = [
  "https://substack.com/my-newsletter-article",
  "https://youtube.com/watch?v=creators-journey",
  "https://behance.net/portfolio/creative-editorial",
  `https://${BASE_URL}/your-next-big-campaign`,
];

const MOCK_URLS = [
  { icon: "🏛", slug: `${BASE_URL}/arch-daily`, original: "archdaily.com/98...", clicks: "1.2k", iconBg: "bg-[#b7ede8]" },
  { icon: "✏️", slug: `${BASE_URL}/figma-23`, original: "figma.com/file/X9...", clicks: "843", iconBg: "bg-[#FFB95F]" },
  { icon: "🎓", slug: `${BASE_URL}/gpt-essay`, original: "openai.com/blog/...", clicks: "2.1k", iconBg: "bg-[#e2dfde]" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const slideUp = {
  hidden: { opacity: 0, y: 100 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay: 1, ease: [0.22, 1, 0.36, 1] },
  },
};

export function HeroSection() {
  const [pIdx, setPIdx] = useState(0);
  const [inputVisible, setInputVisible] = useState(true);
  const [url, setUrl] = useState("");
  const [showGate, setShowGate] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  function handleShorten() {
    if (!url) return;
    sessionStorage.setItem("pendingUrl", url);
    setShowGate(true);
    setTimeout(() => navigate("/register"), 2000);
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setInputVisible(false);
      setTimeout(() => {
        setPIdx((i) => (i + 1) % PLACEHOLDERS.length);
        setInputVisible(true);
      }, 500);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-6 overflow-hidden bg-surface editorial-grid">
      <div className="absolute inset-0 radial-spotlight pointer-events-none" />

      <div className="max-w-7xl mx-auto text-center relative z-10 flex flex-col items-center">
        {/* Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none opacity-[0.03] font-headline italic font-black text-[20rem] tracking-tighter leading-none -z-10">
          SNIP
        </div>

        {/* Badge */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="inline-flex items-center gap-2 px-4 py-1.5 mb-10 shimmer-pill border border-[#FFB95F]/30 rounded-full text-[#FFB95F] font-mono text-xs tracking-tight"
        >
          <Sparkles className="w-3 h-3" />
          Trusted by 2M+ creators
        </motion.div>

        {/* Headline */}
        <h1 className="font-headline italic font-black text-[3rem] sm:text-[5rem] lg:text-[8rem] xl:text-[11rem] leading-none text-primary tracking-tighter mb-8 flex flex-col items-center">
          <motion.span variants={fadeUp} initial="hidden" animate="visible" custom={0.2} className="block">
            Shorten.
          </motion.span>
          <motion.span variants={fadeUp} initial="hidden" animate="visible" custom={0.4} className="block">
            Share. Track.
          </motion.span>
        </h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.6}
          className="max-w-lg mx-auto text-lg text-secondary font-body leading-relaxed mb-12"
        >
          The premium link management tool for creators who value precision and editorial clarity. Curate your digital
          presence, one snip at a time.
        </motion.p>

        {/* URL Input */}
        <motion.div variants={scaleIn} initial="hidden" animate="visible" className="w-full max-w-full lg:max-w-3xl mx-auto mb-20">
          <div className="bg-white p-2 rounded-full shadow-2xl shadow-primary/5 flex items-center border border-outline-variant focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/5 transition-all duration-500">
            <div className="pl-6 flex items-center text-outline">
              <Link2 className="w-5 h-5" />
            </div>
            <input
              ref={inputRef}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleShorten()}
              className="w-full bg-transparent border-none focus:ring-0 font-mono text-lg py-4 px-4 outline-none transition-opacity duration-500"
              placeholder={PLACEHOLDERS[pIdx]}
              style={{ opacity: inputVisible ? 1 : 0 }}
              type="text"
            />
            <button
              onClick={handleShorten}
              className="bg-primary text-on-primary px-8 py-4 rounded-full font-medium hover:bg-primary-container transition-all flex items-center gap-2 btn-interact whitespace-nowrap"
            >
              Snip it
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {showGate ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 mt-3"
            >
              <span className="text-xs font-mono text-accent">✦ Create a free account to get your short link</span>
              <span className="text-xs font-mono text-outline">— redirecting you now...</span>
            </motion.div>
          ) : (
            <div className="mt-6 flex flex-wrap justify-center gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-outline/60">
              <span>No account needed</span>
              <span className="w-1 h-1 bg-outline/20 rounded-full mt-1.5" />
              <span>Free forever</span>
              <span className="w-1 h-1 bg-outline/20 rounded-full mt-1.5" />
              <span>Custom aliases</span>
            </div>
          )}
        </motion.div>

        {/* 3D Mockup */}
        <motion.div variants={slideUp} initial="hidden" animate="visible" className="relative w-full max-w-full lg:max-w-5xl">
          <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full -z-10 transform scale-75" />
          <div className="mockup-3d bg-white rounded-xl border border-outline-variant shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden">
            {/* Browser Header */}
            <div className="bg-surface-container-low px-4 py-3 border-b border-outline-variant flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-error/20" />
                <div className="w-3 h-3 rounded-full bg-amber-200" />
                <div className="w-3 h-3 rounded-full bg-emerald-200" />
              </div>
              <div className="mx-auto bg-white rounded px-4 py-1 text-[10px] text-outline font-mono flex items-center gap-2">
                <Lock className="w-3 h-3" />
                {BASE_URL}/dashboard
              </div>
            </div>
            {/* Dashboard */}
            <div className="p-8 text-left bg-white">
              <div className="flex justify-between items-end mb-10">
                <div>
                  <h4 className="text-sm font-mono text-outline uppercase tracking-widest mb-1">Overview</h4>
                  <p className="font-headline italic text-2xl text-primary">Your Snips</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-headline italic text-primary">2,840</span>
                  <span className="block text-[10px] font-mono text-emerald-600 uppercase tracking-widest">+12% this week</span>
                </div>
              </div>
              <div className="space-y-4">
                {MOCK_URLS.map((row) => (
                  <div
                    key={row.slug}
                    className="flex items-center justify-between p-4 bg-surface rounded border border-surface-container-high"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded ${row.iconBg} flex items-center justify-center text-lg`}>
                        {row.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-primary">{row.slug}</p>
                        <p className="text-xs text-outline font-mono">Original: {row.original}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-sm font-bold text-primary">{row.clicks}</p>
                        <p className="text-[10px] font-mono text-outline uppercase">Clicks</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}

export default HeroSection;

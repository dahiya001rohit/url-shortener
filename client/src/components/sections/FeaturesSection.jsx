import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, LayoutDashboard } from "lucide-react";
import Globe from "../ui/Globe";

// Snip design system colors mapped to cobe's 0–1 RGB range
// primary: #002F2D  → [0, 0.184, 0.176]
// accent:  #FFB95F  → [1, 0.725, 0.373]
// surface: #FAF9F8  → [0.98, 0.976, 0.973]
// on-primary-container: #81b4b0 → [0.506, 0.706, 0.690]
const GLOBE_MARKERS = [
  { id: "sf",       location: [37.7595,  -122.4367], label: "San Francisco" },
  { id: "nyc",      location: [40.7128,   -74.006],  label: "New York" },
  { id: "tokyo",    location: [35.6762,   139.6503], label: "Tokyo" },
  { id: "london",   location: [51.5074,    -0.1278], label: "London" },
  { id: "sydney",   location: [-33.8688,  151.2093], label: "Sydney" },
  { id: "dubai",    location: [25.2048,    55.2708], label: "Dubai" },
  { id: "paris",    location: [48.8566,     2.3522], label: "Paris" },
  { id: "saopaulo", location: [-23.5505,  -46.6333], label: "São Paulo" },
];

const GLOBE_ARCS = [
  { id: "sf-tokyo",   from: [37.7595, -122.4367], to: [35.6762,  139.6503] },
  { id: "nyc-london", from: [40.7128,  -74.006],  to: [51.5074,   -0.1278] },
  { id: "dubai-syd",  from: [25.2048,   55.2708], to: [-33.8688, 151.2093] },
];

const BAR_HEIGHTS = ["30%", "50%", "40%", "70%", "85%", "100%"];

function useScrollReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, visible];
}

export function FeaturesSection() {
  const [ref, visible] = useScrollReveal();

  return (
    <section id="features" className="bg-surface-container-low py-32 px-6 overflow-hidden">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-7xl mx-auto"
      >
        <h2 className="font-headline italic text-5xl md:text-7xl text-primary max-w-3xl mb-24 leading-[1.1]">
          Everything you need, nothing you don't.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Card 1 — Instant Short URLs (large) */}
          <div className="md:col-span-7 bg-surface-container-lowest rounded-xl p-12 overflow-hidden relative group hover:shadow-xl transition-all min-h-[500px]">
            <div className="relative z-10 max-w-sm">
              <span className="font-mono text-xs uppercase tracking-widest text-outline mb-6 block">
                Precision Tooling
              </span>
              <h4 className="font-headline italic text-4xl text-primary mb-6">Instant Short URLs</h4>
              <p className="text-on-surface-variant leading-relaxed">
                Generated in milliseconds. Our global CDN ensures your links resolve faster than any other service.
              </p>
            </div>
            <div className="mt-12 md:absolute md:bottom-[-5%] md:-right-10 w-full md:w-[80%] transition-transform duration-700 group-hover:scale-105">
              <div className="rounded-xl shadow-2xl border border-outline-variant/10 bg-white p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="h-2 w-24 bg-surface-variant rounded-full mb-1" />
                    <div className="h-2 w-16 bg-surface-container rounded-full" />
                  </div>
                </div>
                <div className="space-y-2">
                  {["snip.ly/arch-daily", "snip.ly/figma-23", "snip.ly/gpt-essay"].map((slug) => (
                    <div key={slug} className="h-10 bg-surface rounded flex items-center px-4 gap-3 border border-surface-container-high">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-xs font-mono text-primary">{slug}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 — Analytics (small) */}
          <div className="md:col-span-5 bg-primary text-on-primary rounded-xl p-10 flex flex-col justify-between hover:shadow-xl transition-all">
            <div>
              <BarChart3 className="text-[#ffddb8] w-10 h-10 mb-8" />
              <h4 className="font-headline italic text-3xl mb-4">Real-Time Analytics</h4>
              <p className="text-on-primary-container font-light">
                Detailed geographic and device data at your fingertips.
              </p>
            </div>
            <div className="mt-12 bg-white/5 p-6 rounded-lg backdrop-blur-sm border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] uppercase">Daily Clicks</span>
                <span className="text-[#FFB95F] font-mono text-xs">+24% ↑</span>
              </div>
              <div className="h-24 flex items-end gap-1">
                {BAR_HEIGHTS.map((h, i) => (
                  <div
                    key={i}
                    className={`w-full rounded-t-sm ${i === BAR_HEIGHTS.length - 1 ? "bg-[#FFB95F]" : i === BAR_HEIGHTS.length - 2 ? "bg-[#FFB95F]/60" : "bg-[#FFB95F]/20"}`}
                    style={{ height: h }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Card 3 — Link Management (small) */}
          <div className="md:col-span-5 bg-surface-container rounded-xl p-10 border border-outline-variant/10 hover:shadow-xl transition-all">
            <LayoutDashboard className="text-primary w-8 h-8 mb-6" />
            <h4 className="font-headline italic text-3xl text-primary mb-4">Link Management</h4>
            <p className="text-on-surface-variant mb-8">
              Organize links into curated collections for different campaigns.
            </p>
            <div className="space-y-4 bg-white/40 p-6 rounded-lg">
              <div className="h-10 bg-white shadow-sm rounded flex items-center px-4 gap-4">
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <div className="h-2 w-32 bg-surface-variant rounded-full" />
              </div>
              <div className="h-10 bg-white shadow-sm rounded flex items-center px-4 gap-4">
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="h-2 w-24 bg-surface-variant rounded-full" />
              </div>
            </div>
          </div>

          {/* Card 4 — Global Reach (large) */}
          <div className="md:col-span-7 bg-[#FFB95F]/10 rounded-xl p-10 relative overflow-hidden group hover:shadow-xl transition-all min-h-[400px] flex flex-col md:flex-row items-center gap-8">
            <div className="relative z-10 max-w-xs shrink-0">
              <h4 className="font-headline italic text-3xl text-primary mb-4">Global Reach</h4>
              <p className="text-on-surface-variant leading-relaxed mb-8">
                Your audience is everywhere. Our infrastructure spans 120+ edge locations.
              </p>
              <div className="flex gap-3 flex-wrap">
                {["US", "EU", "AS", "AU", "SA", "AF"].map((region) => (
                  <span key={region} className="px-3 py-1 bg-white/60 rounded-full font-mono text-xs text-primary border border-outline-variant/20">
                    {region}
                  </span>
                ))}
              </div>
            </div>
            <div className="w-full max-w-[340px] mx-auto md:mx-0 md:ml-auto">
              <Globe
                markers={GLOBE_MARKERS}
                arcs={GLOBE_ARCS}
                baseColor={[0.98, 0.976, 0.973]}
                markerColor={[0, 0.184, 0.176]}
                arcColor={[1, 0.725, 0.373]}
                glowColor={[0.506, 0.706, 0.69]}
                dark={0}
                mapBrightness={8}
                markerSize={0.03}
                speed={0.004}
                theta={0.15}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default FeaturesSection;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link2 } from "lucide-react";

const NAV_LINKS = [
  { label: "Product", href: "#" },
  { label: "Features", href: "#features" },
  { label: "Analytics", href: "#" },
  { label: "Pricing", href: "#" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-6 left-0 right-0 mx-auto z-50 w-[80%] max-w-5xl rounded-full transition-all duration-500 nav-glass-base overflow-hidden ${
        scrolled ? "nav-scrolled-state" : ""
      }`}
    >
      {/* Inner Glass Highlight */}
      <div
        className="absolute top-0 left-[10%] right-[10%] h-[1px] rounded-full pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.9) 30%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.9) 70%, transparent 100%)",
        }}
      />
      <div className="relative flex items-center justify-between px-8 py-3">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <Link2 className="text-primary w-5 h-5" />
          <span className="text-2xl font-mono font-bold text-emerald-900">Snip</span>
        </div>
        <div className="hidden md:flex items-center gap-8 font-body text-sm tracking-wide">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-emerald-800/70 hover:text-emerald-600 transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="hidden sm:block text-emerald-800/70 text-sm font-medium hover:text-emerald-600 transition-colors btn-interact"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-primary text-on-primary px-5 py-2 rounded-full text-sm font-medium btn-interact"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

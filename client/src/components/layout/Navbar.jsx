import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link2, User, LogOut, LayoutDashboard, Settings } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const NAV_LINKS = [
  { label: "Features", targetId: "features" },
  { label: "Analytics", targetId: "analytics" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <nav
      className={`fixed top-6 left-0 right-0 mx-auto z-50 w-[80%] max-w-7xl rounded-full transition-all duration-500 nav-glass-base ${
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
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(isLoggedIn ? "/home" : "/")}>
          <Link2 className="text-primary w-5 h-5" />
          <span className="text-2xl font-mono font-bold text-emerald-900">Snip</span>
        </div>

        {!isLoggedIn && (
          <div className="hidden md:flex items-center gap-8 font-body text-sm tracking-wide">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => document.getElementById(link.targetId)?.scrollIntoView({ behavior: "smooth" })}
                className="text-emerald-800/70 hover:text-emerald-600 transition-colors duration-300"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => navigate("/demo")}
              className="text-sm font-mono text-accent hover:underline"
            >
              Live Demo →
            </button>
          </div>
        )}

        {isLoggedIn ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="hidden sm:flex items-center gap-2 text-emerald-800/70 text-sm font-medium hover:text-emerald-600 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-[10px] font-bold text-on-primary">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <span className="text-sm font-mono text-primary hidden sm:block">
                  {user.name?.split(" ")[0]}
                </span>
              </button>

              {menuOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-44 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl py-1.5 z-50"
                  style={{ boxShadow: "0 8px 24px rgba(0,47,45,0.12)" }}
                >
                  <button
                    onClick={() => { navigate("/profile"); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-body text-foreground hover:bg-surface-container transition-colors"
                  >
                    <User className="w-4 h-4 text-secondary" />
                    Profile
                  </button>
                  <button
                    onClick={() => { navigate("/settings"); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-body text-foreground hover:bg-surface-container transition-colors"
                  >
                    <Settings className="w-4 h-4 text-secondary" />
                    Settings
                  </button>
                  <button
                    onClick={() => { handleLogout(); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-body text-error hover:bg-error/5 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
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
        )}
      </div>
    </nav>
  );
}

export default Navbar;

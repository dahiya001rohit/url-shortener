import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AuthShell from "../components/auth/AuthShell";
import AuthLeftPanel from "../components/auth/AuthLeftPanel";
import AuthForm from "../components/auth/AuthForm";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async ({ name, email, password, confirmPassword, terms }) => {
    if (password !== confirmPassword) return;
    if (!terms) { setApiError("You must accept the terms to continue."); return; }
    setApiError("");
    setLoading(true);
    try {
      await register(name, email, password);
      await login(email, password);
      const pendingUrl = sessionStorage.getItem("pendingUrl");
      if (pendingUrl) {
        sessionStorage.removeItem("pendingUrl");
        sessionStorage.setItem("autoSnip", pendingUrl);
      }
      navigate("/home");
    } catch (err) {
      setApiError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <AuthLeftPanel variant="register" />

      <section className="md:w-[58.34%] bg-surface flex flex-col min-h-screen p-8 md:p-16 lg:p-20 relative">
        <nav className="absolute top-8 left-8">
          <Link to="/" className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors group">
            <ArrowLeft className="w-4 h-4" />
            <span className="border-b border-transparent group-hover:border-primary transition-all uppercase tracking-widest text-xs font-mono">
              Back to Snip
            </span>
          </Link>
        </nav>

        <div className="flex-1 flex items-center justify-center">
          <AuthForm variant="register" onSubmit={handleSubmit} apiError={apiError} loading={loading} />
        </div>

        <footer className="pt-8 text-[10px] font-mono uppercase tracking-widest text-outline/40 text-center">
          © 2024 SNIP. CURATING THE WEB, ONE LINK AT A TIME.
        </footer>
      </section>
    </AuthShell>
  );
}

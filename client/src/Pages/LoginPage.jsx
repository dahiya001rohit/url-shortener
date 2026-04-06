import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AuthShell from "../components/auth/AuthShell";
import AuthLeftPanel from "../components/auth/AuthLeftPanel";
import AuthForm from "../components/auth/AuthForm";
import { useAuth } from "../context/AuthContext";

const API_BASE = (process.env.REACT_APP_API_URL || "http://localhost:5010/api").replace(/\/api$/, "");

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const googleError = searchParams.get("error");
  const [apiError, setApiError] = useState(
    googleError ? "Google sign in failed. Please try again." : ""
  );
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE}/api/auth/google`;
  };

  const handleSubmit = async ({ email, password }) => {
    setApiError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/home");
    } catch (err) {
      setApiError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <AuthLeftPanel variant="login" />

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
          <AuthForm variant="login" onSubmit={handleSubmit} apiError={apiError} loading={loading} onGoogleLogin={handleGoogleLogin} />
        </div>

        <footer className="pt-8 text-[10px] font-mono uppercase tracking-widest text-outline/40 text-center">
          © 2024 SNIP. CURATING THE WEB, ONE LINK AT A TIME.
        </footer>
      </section>
    </AuthShell>
  );
}

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginWithToken, isLoggedIn } = useAuth();
  const [ready, setReady] = useState(false);

  // Step 1: process the token once on mount
  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error || !token) {
      navigate(error ? "/login?error=google_failed" : "/login");
      return;
    }

    loginWithToken(token)
      .then(() => setReady(true))
      .catch(() => {
        localStorage.removeItem("accessToken");
        navigate("/login");
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Step 2: navigate only once React has committed the auth state
  useEffect(() => {
    if (ready && isLoggedIn) navigate("/home");
  }, [ready, isLoggedIn, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-mono text-sm text-secondary">Signing you in...</p>
      </div>
    </div>
  );
}

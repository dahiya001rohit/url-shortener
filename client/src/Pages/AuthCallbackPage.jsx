import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error || !token) {
      navigate(error ? "/login?error=google_failed" : "/login");
      return;
    }

    // Store token then hard-redirect so AuthProvider re-initializes
    // from localStorage on the fresh page load — avoids state sync races
    localStorage.setItem("accessToken", token);
    window.location.href = "/home";
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-mono text-sm text-secondary">Signing you in...</p>
      </div>
    </div>
  );
}

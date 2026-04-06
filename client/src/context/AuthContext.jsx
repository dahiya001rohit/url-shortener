import { createContext, useContext, useState, useEffect } from "react";
import api from "services/api";

const AuthContext = createContext(null);

function applyPreferences(preferences) {
  if (!preferences) return;
  if (preferences.accentColor) {
    document.documentElement.style.setProperty("--primary", preferences.accentColor);
    document.documentElement.style.setProperty("--ring", preferences.accentColor);
    localStorage.setItem("snip-accent", preferences.accentColor);
  }
  if (preferences.density) {
    document.documentElement.setAttribute("data-density", preferences.density);
    localStorage.setItem("snip-density", preferences.density);
  }
  if (preferences.fontSize) {
    document.documentElement.style.fontSize = `${preferences.fontSize}px`;
    localStorage.setItem("snip_fontSize", String(preferences.fontSize));
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (accessToken) {
      api.get("/user/profile")
        .then(({ data }) => {
          setUser(data);
          applyPreferences(data.preferences);
        })
        .catch(() => {
          localStorage.removeItem("accessToken");
          setAccessToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("accessToken", data.accessToken);
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data.user;
  };

  const register = async (name, email, password) => {
    await api.post("/auth/register", { name, email, password });
    return login(email, password);
  };

  const logout = async () => {
    try { await api.post("/auth/logout"); } catch { /* ignore */ }
    localStorage.removeItem("accessToken");
    setAccessToken(null);
    setUser(null);
  };

  const updateUser = (data) => setUser((prev) => ({ ...prev, ...data }));

  const loginWithToken = async (token) => {
    localStorage.setItem("accessToken", token);
    setAccessToken(token);
    const { data } = await api.get("/user/profile");
    setUser(data);
    applyPreferences(data.preferences);
    return data;
  };

  return (
    <AuthContext.Provider value={{
      user,
      accessToken,
      loading,
      login,
      register,
      logout,
      updateUser,
      loginWithToken,
      applyPreferences,
      isLoggedIn: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

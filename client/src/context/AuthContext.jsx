import { createContext, useContext, useState, useEffect } from "react";
import api from "services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || null
  );
  const [loading, setLoading] = useState(true);

  // On mount: if token exists try to restore profile
  useEffect(() => {
    if (accessToken) {
      api.get("/user/profile")
        .then(({ data }) => setUser(data))
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

  return (
    <AuthContext.Provider value={{
      user,
      accessToken,
      loading,
      login,
      register,
      logout,
      updateUser,
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

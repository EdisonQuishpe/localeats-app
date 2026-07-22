"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setToken, clearToken } from "../lib/api";

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("localeats-user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("localeats-user");
      }
    }
    setLoading(false);
  }, []);

  // Recibe { user, accessToken } desde el login del Gateway.
  // Compatible con el formato antiguo (solo userData).
  const login = (payload) => {
    const userData = payload?.user || payload;
    const token = payload?.accessToken || payload?.token;

    setUser(userData);
    localStorage.setItem("localeats-user", JSON.stringify(userData));
    if (token) setToken(token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("localeats-user");
    clearToken();
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return children;
}

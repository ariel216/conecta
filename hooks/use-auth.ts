"use client";
import {
  eliminarCookie,
  eliminarCookies,
  guardarCookie,
  leerCookie,
} from "@/lib/cookies";
import { useState, useEffect, useCallback } from "react";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = leerCookie("auth");
    if (savedToken) {
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  const login = useCallback((newToken: string) => {
    guardarCookie("auth", newToken, { path: "/" });
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    eliminarCookie("auth");
    setToken(null);
  }, []);

  const isAuthenticated = !!token;

  return { token, isAuthenticated, login, logout, loading };
}

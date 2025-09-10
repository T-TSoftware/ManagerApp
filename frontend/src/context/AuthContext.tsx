// context/AuthContext.tsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  login as loginRequest,
  logout as logoutRequest,
} from "../services/authService";
import {
  getToken,
  setToken as persistToken,
  clearToken,
  isExpired,
} from "../utils/token";
import api, { setUnauthorizedHandler, setAuthHeader } from "../utils/axios";

const LOGIN_PATH = "/login";

type AuthContextValue = {
  token: string | null;
  isAuthenticated: boolean;
  initializing: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: (silent?: boolean) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() => getToken());
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = useCallback(async (silent?: boolean) => {
    try {
      await logoutRequest();
    } catch {}
    setToken(null);
    clearToken();
    setAuthHeader(undefined);
    window.location.replace(LOGIN_PATH);
  }, []);

  useEffect(() => {
    if (token) {
      if (isExpired(token)) {
        clearToken();
        setToken(null);
        setAuthHeader(undefined);
      } else {
        setAuthHeader(token);
      }
    } else {
      setAuthHeader(undefined);
    }
    setInitializing(false);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => logout(true));
  }, [logout]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { token: tkn } = await loginRequest(email.trim(), password.trim());
      setToken(tkn);
      persistToken(tkn);
      setAuthHeader(tkn);
    } catch (e: any) {
      setError(e?.message || "Login failed");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      isAuthenticated: !!token,
      initializing,
      loading,
      error,
      login,
      logout,
    }),
    [token, initializing, loading, error, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
};

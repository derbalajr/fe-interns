import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";

import { logoutRequest } from "../api/auth";
import { AUTH_TOKEN_KEY } from "../constants/auth";

type AuthContextValue = {
  token: string | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

type AuthProviderProps = {
  children: ReactNode;
};

function readStoredToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();

  const [token, setTokenState] = useState<string | null>(
    readStoredToken,
  );

  const setToken = useCallback((newToken: string) => {
    localStorage.setItem(AUTH_TOKEN_KEY, newToken);
    setTokenState(newToken);
  }, []);

  const logout = useCallback(async () => {
    try {
      if (token) {
        await logoutRequest();
      }
    } catch {
      // Clear the local session even if the backend logout fails.
    } finally {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      setTokenState(null);
      queryClient.clear();
    }
  }, [queryClient, token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      setToken,
      logout,
    }),
    [logout, setToken, token],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider.",
    );
  }

  return context;
}
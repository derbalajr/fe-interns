import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";

import { ApiError } from "../lib/fetcher";
import { getProfile, logoutRequest } from "../api/auth";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "../constants/auth";
import type { User } from "../types/auth";
type AuthContextValue = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoadingUser: boolean;
  setToken: (token: string) => void;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

/**
 * Single source of truth to safely extract and type a User object
 * whether it's wrapped in a Laravel Resource `{ data: { id, ... } }` or raw `{ id, ... }`.
 */
export function unwrapUser(input: unknown): User | null {
  if (!input || typeof input !== "object") return null;

  // Laravel API Resource wrapper check: { data: { id: ... } }
  if (
    "data" in input &&
    input.data &&
    typeof input.data === "object" &&
    "id" in input.data
  ) {
    return input.data as User;
  }

  // Flat User object check: { id: ... }
  if ("id" in input) {
    return input as User;
  }

  return null;
}

function readStoredToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

function readStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? unwrapUser(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();

  const [token, setTokenState] = useState<string | null>(readStoredToken);

  // 1. INSTANT LOAD: Read initial user state synchronously from local storage
  const [user, setUserState] = useState<User | null>(() =>
    readStoredToken() ? readStoredUser() : null,
  );
  // 2. Only show loading state if a token exists BUT we have no cached user in storage
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(() => {
    return Boolean(readStoredToken()) && !readStoredUser();
  });

  const setToken = useCallback((newToken: string) => {
    localStorage.setItem(AUTH_TOKEN_KEY, newToken);
    setTokenState(newToken);
  }, []);

  // Centralized state + localStorage updater
  const setUser = useCallback((nextUser: User | null) => {
    const cleanUser = unwrapUser(nextUser);

    if (cleanUser) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(cleanUser));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }

    setUserState(cleanUser);
    setIsLoadingUser(false);
  }, []);
  const clearSession = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);

    setTokenState(null);
    setUserState(null);
    setIsLoadingUser(false);
  }, []);
  // 3. BACKGROUND REVALIDATION: Refresh user in background without blocking rendering

  useEffect(() => {
    if (!token) {
      return;
    }

    let isActive = true;

    getProfile()
      .then((response) => {
        if (isActive) {
          setUser(response);
        }
      })
      .catch((error: unknown) => {
        if (isActive && error instanceof ApiError && error.status === 401) {
          clearSession();
        }
      });

    return () => {
      isActive = false;
    };
  }, [token, clearSession]);

  const hasRole = useCallback(
    (role: string) => user?.roles?.includes(role) ?? false,
    [user],
  );

  const hasPermission = useCallback(
    (permission: string) =>
      user?.permissions?.includes(permission) ?? false,
    [user],
  );

  const logout = useCallback(async () => {
    try {
      if (token) {
        await logoutRequest();
      }
    } catch {
      // Clear the local session even if the backend request fails.
    } finally {
      clearSession();
      queryClient.clear();
    }
  }, [clearSession, queryClient, token]);
  const authenticatedUser = token ? user : null;
  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user: authenticatedUser,
      isAuthenticated: Boolean(token && authenticatedUser),
      isLoadingUser,
      setToken,
      setUser,
      logout,
      hasPermission,
      hasRole,
    }),
    [authenticatedUser, isLoadingUser, logout, setToken, setUser, token, hasPermission, hasRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}

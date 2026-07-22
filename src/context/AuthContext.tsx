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

import { getProfile, logoutRequest } from "../api/auth";
import { AUTH_TOKEN_KEY } from "../constants/auth";
import type { User } from "../types/auth";

// Constant for caching the user object locally
const AUTH_USER_KEY = "auth_user";

type AuthContextValue = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoadingUser: boolean;
  setToken: (token: string) => void;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

/**
 * Safely extracts the user object if wrapped inside a Laravel Resource { data: { id, name, ... } }
 */
function unwrapUser(data: any): User | null {
  if (!data) return null;
  if (typeof data === "object" && "data" in data && data.data?.id) {
    return data.data;
  }
  return data;
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
  const [user, setUserState] = useState<User | null>(readStoredUser);

  // 2. Only show loading state if a token exists BUT we have no cached user in storage
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(() => {
    return Boolean(readStoredToken()) && !readStoredUser();
  });

  const setToken = useCallback((newToken: string) => {
    localStorage.setItem(AUTH_TOKEN_KEY, newToken);
    setTokenState(newToken);
  }, []);

  const setUser = useCallback((nextUser: User | null | any) => {
    const cleanUser = unwrapUser(nextUser);

    if (cleanUser) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(cleanUser));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }

    setUserState(cleanUser);
    setIsLoadingUser(false);
  }, []);

  // 3. BACKGROUND REVALIDATION: Refresh user in background without blocking rendering
  useEffect(() => {
    if (!token) {
      setUser(null);
      setIsLoadingUser(false);
      return;
    }

    let isActive = true;

    getProfile()
      .then((res: any) => {
        if (!isActive) return;

        const cleanUser = unwrapUser(res);
        setUserState(cleanUser);

        if (cleanUser) {
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(cleanUser));
        }
      })
      .catch((error: any) => {
        console.error("Failed to revalidate profile:", error);
        // If token is invalid/expired (401), wipe session
        if (isActive && error?.status === 401) {
          localStorage.removeItem(AUTH_TOKEN_KEY);
          localStorage.removeItem(AUTH_USER_KEY);
          setTokenState(null);
          setUserState(null);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoadingUser(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [token, setUser]);

  const logout = useCallback(async () => {
    try {
      if (token) {
        await logoutRequest();
      }
    } catch {
      // Clear local session even if backend endpoint fails
    } finally {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
      setTokenState(null);
      setUserState(null);
      setIsLoadingUser(false);
      queryClient.clear();
    }
  }, [queryClient, token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isLoadingUser,
      setToken,
      setUser,
      logout,
    }),
    [isLoadingUser, logout, setToken, setUser, token, user],
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
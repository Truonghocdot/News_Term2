"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import {
  login as loginAPI,
  logout as logoutAPI,
  refreshToken as refreshTokenAPI,
} from "@/util/auth";

// Types
interface User {
  id: string;
  username: string;
  gmail: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (
    username: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  updateUser: (userData: User) => void;
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true, // Start with loading true
  });

  // Initialize auth state from cookies
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = Cookies.get("token");
        const userStr = Cookies.get("user");

        if (token && userStr) {
          const user = JSON.parse(userStr);
          setAuthState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setAuthState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        // Clear invalid data
        Cookies.remove("token");
        Cookies.remove("refreshToken");
        Cookies.remove("user");

        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    initializeAuth();
  }, []);

  // Auto refresh token
  useEffect(() => {
    if (!authState.isAuthenticated || !authState.token) return;

    const refreshInterval = setInterval(async () => {
      const result = await refreshTokenAPI();
      if (!result.success) {
        // Token refresh failed, logout user
        logout();
      } else if (result.token) {
        setAuthState((prev) => ({
          ...prev,
          token: result.token!,
        }));
      }
    }, 15 * 60 * 1000); // Refresh every 15 minutes

    return () => clearInterval(refreshInterval);
  }, [authState.isAuthenticated, authState.token]);

  // Login function
  const login = async (username: string, password: string) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      const result = await loginAPI(username, password);

      if (result.success && result.data) {
        setAuthState({
          user: result.data.user,
          token: result.data.token,
          isAuthenticated: true,
          isLoading: false,
        });

        return { success: true };
      } else {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return { success: false, message: result.message };
      }
    } catch (error: any) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return { success: false, message: error.message };
    }
  };

  // Logout function
  const logout = () => {
    // Call API logout
    logoutAPI();

    // Update state
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  // Refresh token function
  const refreshToken = async (): Promise<boolean> => {
    const result = await refreshTokenAPI();

    if (result.success && result.token) {
      setAuthState((prev) => ({
        ...prev,
        token: result.token!,
      }));
      return true;
    } else {
      logout();
      return false;
    }
  };

  // Update user function
  const updateUser = (userData: User) => {
    setAuthState((prev) => ({
      ...prev,
      user: userData,
    }));

    // Update cookie
    Cookies.set("user", JSON.stringify(userData));
  };

  const contextValue: AuthContextType = {
    ...authState,
    login,
    logout,
    refreshToken,
    updateUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

// Helper hooks for common use cases
export function useUser() {
  const { user } = useAuth();
  return user;
}

export function useIsAuthenticated() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}

export function useAuthLoading() {
  const { isLoading } = useAuth();
  return isLoading;
}

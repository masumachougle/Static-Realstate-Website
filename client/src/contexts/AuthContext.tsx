import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { requireSupabase } from "@/lib/supabase";
import { checkAuth, loginWithIdentifier, logout as supabaseLogout } from "@/lib/supabaseApi";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();

  const checkAuthStatus = async () => {
    try {
      const ok = await checkAuth();
      setIsAuthenticated(ok);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();

    try {
      const { data: subscription } = requireSupabase().auth.onAuthStateChange((_event, session) => {
        setIsAuthenticated(!!session);
        setIsLoading(false);
      });

      return () => {
        subscription.subscription.unsubscribe();
      };
    } catch {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      await loginWithIdentifier(username, password);
      setIsAuthenticated(true);
      return true;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabaseLogout();
      setIsAuthenticated(false);
      setLocation("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, login, logout, checkAuth: checkAuthStatus }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

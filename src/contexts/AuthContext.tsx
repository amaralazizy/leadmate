"use client";
import { createContext } from "react";
import { User } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const supabase = createClient();

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    const fetchUser = async (authUser: SupabaseUser | null) => {
      try {
        setError(null);
        if (authUser) {
          const { data: userData, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", authUser.id);
          if (error) throw error;
          setUser(userData[0] as User | null);
        } else {
          setUser(null);
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Get initial session
    const getInitialUser = async () => {
      try {
        const {
          data: { user: authUser },
          error,
        } = await supabase.auth.getUser();
        if (error) throw error;
        await fetchUser(authUser);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
        setLoading(false);
      }
    };

    getInitialUser();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setLoading(true);

      if (event === "SIGNED_OUT") {
        // Explicitly clear user on sign out
        setUser(null);
        setLoading(false);
      } else {
        await fetchUser(session?.user ?? null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

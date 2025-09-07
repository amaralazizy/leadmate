"use client";
import { createContext } from "react";
import { User } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

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
    const fetchUser = async () => {
      try {
        const { data: AuthUser, error } = await supabase.auth.getUser();
        // console.log("AuthUser", AuthUser);
        if (error) throw error;
        if (AuthUser && AuthUser.user) {
          const { data: userData, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", AuthUser.user.id);
          if (error) throw error;
          setUser(userData[0] as User | null);
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
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

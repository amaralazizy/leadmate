"use client";

import { useEffect, useState, createContext, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { User } from "@/lib/supabase/client";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Global Auth Context to prevent multiple DB calls
export const AuthContext = createContext<
  AuthState & {
    updateProfile: (updates: Partial<User>) => void;
    refreshProfile: () => Promise<void>;
  }
>({
  user: null,
  loading: true,
  error: null,
  updateProfile: () => {},
  refreshProfile: async () => {},
});

// Auth Provider - wrap your entire app with this
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  // In-memory cache only (secure)
  const profileCacheRef = useRef<{
    data: User | null;
    timestamp: number;
    userId: string | null;
  }>({
    data: null,
    timestamp: 0,
    userId: null,
  });

  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  const getCachedProfile = useCallback(
    (userId: string): User | null => {
      if (!profileCacheRef.current) return null;

      const cache = profileCacheRef.current;

      // Check if cache is valid and for the same user
      if (
        cache.data &&
        cache.userId === userId &&
        Date.now() - cache.timestamp < CACHE_DURATION
      ) {
        return cache.data;
      }

      return null;
    },
    [CACHE_DURATION]
  );

  const setCachedProfile = (profile: User) => {
    profileCacheRef.current = {
      data: profile,
      timestamp: Date.now(),
      userId: profile.id,
    };
  };

  const invalidateCache = () => {
    profileCacheRef.current = { data: null, timestamp: 0, userId: null };
  };

  const fetchUserProfile = useCallback(
    async (userId: string): Promise<User | null> => {
      // Try in-memory cache first
      const cached = getCachedProfile(userId);
      if (cached) {
        return cached;
      }

      // Fetch from database only if not cached
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error || !user) return null;

      const userProfile = user as unknown as User;
      setCachedProfile(userProfile);
      return userProfile;
    },
    [getCachedProfile]
  );

  const updateProfile = (updates: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...updates };
      setAuthState((prev) => ({ ...prev, user: updatedUser }));
      setCachedProfile(updatedUser);
    }
  };

  const refreshProfile = async () => {
    if (authState.user) {
      // Clear in-memory cache to force refresh
      profileCacheRef.current = { data: null, timestamp: 0, userId: null };
      const user = await fetchUserProfile(authState.user.id);
      setAuthState((prev) => ({ ...prev, user: user as unknown as User }));
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (!session?.user) {
          setAuthState({
            user: null,
            loading: false,
            error: null,
          });
          // Clear cache if no session
          invalidateCache();
          return;
        }

        // Use cached profile or fetch new one
        const user = await fetchUserProfile(session.user.id);

        if (!mounted) return;

        setAuthState({
          user: user as unknown as User,

          loading: false,
          error: user ? null : "Failed to load user profile",
        });
      } catch (error) {
        if (!mounted) return;

        console.error("Auth initialization error:", error);
        setAuthState({
          user: null,
          loading: false,
          error:
            error instanceof Error ? error.message : "Authentication error",
        });
      }
    };

    initializeAuth();

    // Listen for auth changes (only session changes, not profile changes)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === "SIGNED_OUT" || !session) {
        setAuthState({
          user: null,

          loading: false,
          error: null,
        });
        invalidateCache();
      } else if (event === "SIGNED_IN" && session.user) {
        const user = await fetchUserProfile(session.user.id);
        setAuthState({
          user: user as unknown as User,

          loading: false,
          error: user ? null : "Failed to load user profile",
        });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

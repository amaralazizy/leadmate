// "use client";

// import { useEffect, useState, createContext, useRef, useCallback } from "react";
// import { supabase } from "@/lib/supabase/client";
// import { User } from "@/lib/supabase/client";

// interface AuthState {
//   user: User | null;
//   loading: boolean;
//   error: string | null;
// }

// // Global Auth Context to prevent multiple DB calls
// export const AuthContext = createContext<
//   AuthState & {
//     updateProfile: (updates: Partial<User>) => void;
//     refreshProfile: () => Promise<void>;
//   }
// >({
//   user: null,
//   loading: true,
//   error: null,
//   updateProfile: () => {},
//   refreshProfile: async () => {},
// });

// // Auth Provider - wrap your entire app with this
// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [authState, setAuthState] = useState<AuthState>({
//     user: null,
//     loading: true,
//     error: null,
//   });

//   // In-memory cache only (secure)
//   const profileCacheRef = useRef<{
//     data: User | null;
//     timestamp: number;
//     userId: string | null;
//   }>({
//     data: null,
//     timestamp: 0,
//     userId: null,
//   });

//   const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

//   const getCachedProfile = useCallback(
//     (userId: string): User | null => {
//       if (!profileCacheRef.current) return null;

//       const cache = profileCacheRef.current;

//       // Check if cache is valid and for the same user
//       if (
//         cache.data &&
//         cache.userId === userId &&
//         Date.now() - cache.timestamp < CACHE_DURATION
//       ) {
//         return cache.data;
//       }

//       return null;
//     },
//     [CACHE_DURATION]
//   );

//   const setCachedProfile = (profile: User) => {
//     profileCacheRef.current = {
//       data: profile,
//       timestamp: Date.now(),
//       userId: profile.id,
//     };
//   };

//   const invalidateCache = () => {
//     profileCacheRef.current = { data: null, timestamp: 0, userId: null };
//   };

//   const fetchUserProfile = useCallback(
//     async (userId: string): Promise<User | null> => {
//       // Try in-memory cache first
//       const cached = getCachedProfile(userId);
//       if (cached) {
//         return cached;
//       }

//       // Fetch from database only if not cached
//       const { data: session, error } = await supabase.auth.getSession();
//       const user = session?.session?.user;

//       if (error || !user) return null;

//       const userProfile = user as unknown as User;
//       setCachedProfile(userProfile);
//       return userProfile;
//     },
//     [getCachedProfile]
//   );

//   const updateProfile = (updates: Partial<User>) => {
//     if (authState.user) {
//       const updatedUser = { ...authState.user, ...updates };
//       setAuthState((prev) => ({ ...prev, user: updatedUser }));
//       setCachedProfile(updatedUser);
//     }
//   };

//   const refreshProfile = async () => {
//     if (authState.user) {
//       // Clear in-memory cache to force refresh
//       profileCacheRef.current = { data: null, timestamp: 0, userId: null };
//       const user = await fetchUserProfile(authState.user.id);
//       setAuthState((prev) => ({ ...prev, user: user as unknown as User }));
//     }
//   };

//   useEffect(() => {
//     let mounted = true;

//     const initializeAuth = async () => {
//       try {
//         const {
//           data: { session },
//         } = await supabase.auth.getSession();

//         if (!mounted) return;

//         if (!session?.user) {
//           setAuthState({
//             user: null,
//             loading: false,
//             error: null,
//           });
//           // Clear cache if no session
//           invalidateCache();
//           return;
//         }

//         // Use cached profile or fetch new one
//         const user = await fetchUserProfile(session.user.id);

//         if (!mounted) return;

//         setAuthState({
//           user: user as unknown as User,

//           loading: false,
//           error: user ? null : "Failed to load user profile",
//         });
//       } catch (error) {
//         if (!mounted) return;

//         console.error("Auth initialization error:", error);
//         setAuthState({
//           user: null,
//           loading: false,
//           error:
//             error instanceof Error ? error.message : "Authentication error",
//         });
//       }
//     };

//     initializeAuth();

//     // Listen for auth changes (only session changes, not profile changes)
//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange(async (event, session) => {
//       if (!mounted) return;

//       if (event === "SIGNED_OUT" || !session) {
//         setAuthState({
//           user: null,

//           loading: false,
//           error: null,
//         });
//         invalidateCache();
//       } else if (event === "SIGNED_IN" && session.user) {
//         const user = await fetchUserProfile(session.user.id);
//         setAuthState({
//           user: user as unknown as User,

//           loading: false,
//           error: user ? null : "Failed to load user profile",
//         });
//       }
//     });

//     return () => {
//       mounted = false;
//       subscription.unsubscribe();
//     };
//   }, [fetchUserProfile]);

//   return (
//     <AuthContext.Provider
//       value={{
//         ...authState,
//         updateProfile,
//         refreshProfile,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

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
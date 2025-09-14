import { createClient } from "@/lib/supabase/server";
import { User } from "@/lib/types";

/**
 * Server-side authentication utilities for Next.js App Router
 * These functions should only be used in Server Components, API routes, or Server Actions
 */

export interface AuthResult {
  user: User | null;
  isAuthenticated: boolean;
}

/**
 * Get the current authenticated user from server-side
 * Returns null if user is not authenticated
 * This is the recommended way to check auth in Server Components
 */
export async function getCurrentUser(): Promise<AuthResult> {
  try {
    const supabase = await createClient();

    // Get the current user session
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return {
        user: null,
        isAuthenticated: false,
      };
    }

    // Get user data from the database
    const { data: userData, error: dbError } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (dbError || !userData) {
      return {
        user: null,
        isAuthenticated: false,
      };
    }

    return {
      user: userData as User,
      isAuthenticated: true,
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return {
      user: null,
      isAuthenticated: false,
    };
  }
}

/**
 * Get user authentication status only (without full user data)
 * More lightweight than getCurrentUser() when you only need to check if user is logged in
 */
export async function getAuthStatus(): Promise<{
  isAuthenticated: boolean;
  email?: string;
}> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return { isAuthenticated: false };
    }

    return {
      isAuthenticated: true,
      email: user.email,
    };
  } catch (error) {
    console.error("Error getting auth status:", error);
    return { isAuthenticated: false };
  }
}

/**
 * Require authentication in a Server Component
 * Throws an error if user is not authenticated - use this with error boundaries
 * or redirect logic in your components
 */
export async function requireAuth(): Promise<User> {
  const { user, isAuthenticated } = await getCurrentUser();

  if (!isAuthenticated || !user) {
    throw new Error("Authentication required");
  }

  return user;
}

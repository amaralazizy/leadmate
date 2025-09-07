import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

// Create a client instance to extract types
const supabase = createClient();

// Extract the exact return type from supabase.auth.getUser()
export type UserResponse = Awaited<ReturnType<typeof supabase.auth.getUser>>;

// Extract the user type from the response
export type AuthUser = UserResponse["data"]["user"];

// Alternative way to get the user type directly from Supabase
export type SupabaseAuthUser = SupabaseUser;

// Extract other auth-related types
export type SessionResponse = Awaited<
  ReturnType<typeof supabase.auth.getSession>
>;
export type AuthSession = SessionResponse["data"]["session"];

export type SignUpResponse = Awaited<ReturnType<typeof supabase.auth.signUp>>;
export type SignInResponse = Awaited<
  ReturnType<typeof supabase.auth.signInWithPassword>
>;

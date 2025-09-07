// Example usage of extracted Supabase auth types

import type { AuthUser, AuthSession, UserResponse } from "./auth";

// Example function that accepts the auth user type
export function handleAuthUser(user: AuthUser) {
  if (!user) {
    console.log("No user authenticated");
    return;
  }

  console.log("User ID:", user.id);
  console.log("User Email:", user.email);
  console.log("User Created At:", user.created_at);
  // ... any other properties available on the Supabase auth user
}

// Example function that works with the session
export function handleSession(session: AuthSession) {
  if (!session) {
    console.log("No active session");
    return;
  }

  console.log("Session User:", session.user.email);
  console.log("Access Token:", session.access_token);
  console.log("Expires At:", session.expires_at);
}

// Example function that handles the full response
export function handleUserResponse(response: UserResponse) {
  const { data, error } = response;

  if (error) {
    console.error("Auth error:", error.message);
    return;
  }

  if (data.user) {
    handleAuthUser(data.user);
  }
}

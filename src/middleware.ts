import { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Handle Supabase session update and authentication for other routes
  const supabaseResponse = await updateSession(request);

  // If updateSession redirected (e.g., to login), return that response
  if (supabaseResponse.status !== 200) {
    return supabaseResponse;
  }

  // Continue with the normal response if no redirect occurred
  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

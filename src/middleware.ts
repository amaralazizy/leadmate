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
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

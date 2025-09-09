import { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Handle Supabase session update and authentication for other routes
  const supabaseResponse = await updateSession(request);

  // If updateSession redirected (e.g., to login), return that response
  if (supabaseResponse.status !== 200) {
    return supabaseResponse;
  }

  //TODO: add the waitlist and its needed routes here ya ammar
  // make every time the user visit home redirect to the waitlist page
  // if (pathname === "/") {
  //   return NextResponse.redirect(new URL("/waitlist", request.url));
  // }

  // const allowedPaths = [
  //   "/",
  //   "/auth",
  //   "/dashboard",
  //   "/api/waitlist",
  //   "/waitlist",
  //   "/whatsapp",
  //   "/api/whatsapp",
  //   "/api/webhook/whatsapp",
  // ];

  // const publicPaths = ["/_next", "/favicon.ico", "/robots.txt", "/sitemap.xml"];

  // // Allow public paths
  // if (publicPaths.some((path) => pathname.startsWith(path))) {
  //   return NextResponse.next();
  // }

  // Allow allowed paths
  // if (
  //   allowedPaths.some(
  //     (path) => pathname === path || pathname.startsWith(path)
  //   )
  // ) {
  //   console.log("Middleware - Stay in the same page");
  //   return NextResponse.next();
  // }

  // Redirect to home if not in allowed paths
  // if (request.nextUrl.pathname !== "/") {
  //   console.log("Middleware - Redirecting to home");
  //   return NextResponse.redirect(new URL("/", request.url));
  // }
  // return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

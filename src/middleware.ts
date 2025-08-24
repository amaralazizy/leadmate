import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  //TODO: add the waitlist and its needed routes here ya ammar
  // make every time the user visit home redirect to the waitlist page
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/waitlist", request.url));
  }

  const allowedPaths = ["/", "/api/waitlist", "/waitlist"];

  const publicPaths = ["/_next", "/favicon.ico", "/robots.txt", "/sitemap.xml"];

  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  if (
    allowedPaths.some(
      (path) => pathname === path || pathname.startsWith(path + "/")
    )
  ) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

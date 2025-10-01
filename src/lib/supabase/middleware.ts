import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  const authRoutes = [
    "/login",
    "/signup",
    "/reset-password",
    "/reset-password-confirmation",
    "/auth",
  ];

  // Define public routes that don't require authentication
  const publicRoutes = [
    "/login",
    "/signup",
    "/reset-password",
    "/reset-password-confirmation",
    "/whatsapp",
    "/",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/blog",
  ];

  // Routes that don't require onboarding completion
  const onboardingExemptRoutes = [
    ...publicRoutes,
    "/onboarding", // Allow access to onboarding itself
    "/auth", // Allow auth routes like verify-email
  ];

  const isPublicRoute = publicRoutes.some(
    (route) =>
      request.nextUrl.pathname === route ||
      request.nextUrl.pathname.startsWith(route + "/")
  );

  const isOnboardingExempt = onboardingExemptRoutes.some(
    (route) =>
      request.nextUrl.pathname === route ||
      request.nextUrl.pathname.startsWith(route + "/")
  );

  // Also allow API routes that should be public (webhooks, external integrations)
  const isPublicApiRoute =
    request.nextUrl.pathname.startsWith("/api/waitlist") ||
    request.nextUrl.pathname.startsWith("/api/whatsapp") ||
    request.nextUrl.pathname.startsWith("/api/webhooks/whatsapp") ||
    request.nextUrl.pathname.startsWith("/api/onboarding") ||
    request.nextUrl.pathname.startsWith("/api/");

  if (user && authRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect to login only if user is not authenticated AND not on a public route
  if (!user && !isPublicRoute && !isPublicApiRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Check onboarding status for authenticated users on protected routes
  if (user && !isOnboardingExempt && !isPublicApiRoute) {
    try {
      // Fetch user's onboarding status from the database
      const { data: userData, error } = await supabase
        .from("users")
        .select("onboarding_completed")
        .eq("id", user.sub)
        .single();

      if (!error && userData && !userData.onboarding_completed) {
        // User hasn't completed onboarding, redirect to onboarding
        const url = request.nextUrl.clone();
        url.pathname = "/onboarding";
        return NextResponse.redirect(url);
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      // On error, allow the request to continue to avoid breaking the app
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}

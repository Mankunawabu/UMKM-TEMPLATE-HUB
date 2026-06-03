import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Skip middleware for auth callback
  if (path.startsWith("/auth/callback")) {
    return NextResponse.next();
  }

  const { supabase, supabaseResponse, user } = await updateSession(request);

  // Define route types
  const isAdminRoute = path.startsWith("/admin");
  const isDashboardRoute = path.startsWith("/dashboard");
  const isOnboardingRoute = path.startsWith("/onboarding");
  const isAuthRoute =
    path.startsWith("/login") ||
    path.startsWith("/register") ||
    path.startsWith("/forgot-password") ||
    path.startsWith("/reset-success");

  // If user is not logged in
  if (!user) {
    if (isAdminRoute || isDashboardRoute || isOnboardingRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // If logged in, prevent access to auth routes
  if (isAuthRoute) {
    // We don't fetch role here for performance. We redirect everyone to /dashboard.
    // If they are admin, the /dashboard layout will redirect them to /admin.
    // If they need onboarding, /dashboard layout will redirect to /onboarding.
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth/callback (auth callback route)
     * - Any file with extension (svg, png, jpg, jpeg, gif, webp)
     */
    "/((?!_next/static|_next/image|favicon.ico|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

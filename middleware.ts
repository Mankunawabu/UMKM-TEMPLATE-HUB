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

  // Logged in: Fetch profile to check role & onboarding status
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_onboarding_completed")
    .eq("id", user.id)
    .single();

  const role = profile?.role || "umkm";
  const isOnboardingCompleted = profile?.is_onboarding_completed ?? false;

  // If Admin
  if (role === "admin") {
    // Admin trying to access UMKM routes, onboarding, or auth pages
    if (isDashboardRoute || isOnboardingRoute || isAuthRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // If UMKM
  if (role === "umkm") {
    // UMKM trying to access Admin pages
    if (isAdminRoute) {
      const url = request.nextUrl.clone();
      url.pathname = isOnboardingCompleted ? "/dashboard" : "/onboarding";
      return NextResponse.redirect(url);
    }

    // UMKM trying to access Auth pages
    if (isAuthRoute) {
      const url = request.nextUrl.clone();
      url.pathname = isOnboardingCompleted ? "/dashboard" : "/onboarding";
      return NextResponse.redirect(url);
    }

    // Onboarding flow protection
    if (!isOnboardingCompleted) {
      // Incomplete onboarding trying to access UMKM dashboard
      if (isDashboardRoute) {
        const url = request.nextUrl.clone();
        url.pathname = "/onboarding";
        return NextResponse.redirect(url);
      }
    } else {
      // Complete onboarding trying to access onboarding page again
      if (isOnboardingRoute) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
    }
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

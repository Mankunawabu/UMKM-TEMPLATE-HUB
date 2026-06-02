import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Exchange code for session failed:", error);
    }

    if (!error && user) {
      // Check if profile exists
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      const googleMetadata = user.user_metadata;
      const fullName =
        googleMetadata?.full_name || user.email?.split("@")[0] || "Pemilik UMKM";
      const avatarUrl = googleMetadata?.avatar_url || null;

      let role = "umkm";
      let isOnboardingCompleted = false;

      if (!profile) {
        // Insert new profile since it doesn't exist
        const { error: insertErr } = await supabase.from("profiles").insert({
          id: user.id,
          role: "umkm",
          nama_lengkap: fullName,
          avatar_url: avatarUrl,
          is_onboarding_completed: false,
        });
        if (insertErr) {
          console.error("Error auto-creating profile in callback:", insertErr.message);
        }
      } else {
        role = profile.role;
        isOnboardingCompleted = profile.is_onboarding_completed;

        // If avatar_url is empty but available from Google, update it
        if (!profile.avatar_url && avatarUrl) {
          await supabase
            .from("profiles")
            .update({ avatar_url: avatarUrl })
            .eq("id", user.id);
        }
      }

      // Determine redirect URL
      const next = searchParams.get("next");
      let redirectPath = next || "/dashboard";

      if (!next) {
        if (role === "admin") {
          redirectPath = "/admin";
        } else if (!isOnboardingCompleted) {
          redirectPath = "/onboarding";
        }
      }

      return NextResponse.redirect(`${origin}${redirectPath}`);
    }
  }

  // Redirect to error page if exchange fails
  return NextResponse.redirect(
    `${origin}/auth-error?message=Gagal menukar kode otorisasi`
  );
}

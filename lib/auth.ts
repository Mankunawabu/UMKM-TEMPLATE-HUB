import { createClient } from "./supabase/server";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

export async function getCurrentProfile() {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile) return null;
  return profile;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const profile = await getCurrentProfile();
  if (!profile) {
    // If auth user exists but profile record does not, trigger onboarding or redirect to login
    redirect("/login");
  }

  if (profile.role === "umkm") {
    if (profile.is_active === false) {
      redirect("/unauthorized?reason=suspended");
    }
    if (!profile.is_onboarding_completed) {
      redirect("/onboarding");
    }
  }

  return { user, profile };
}

export async function requireAdmin() {
  const { user, profile } = await requireAuth();
  if (profile.role !== "admin") {
    redirect("/unauthorized");
  }
  return { user, profile };
}

export async function requireUmkm() {
  const { user, profile } = await requireAuth();
  if (profile.role === "admin") {
    redirect("/admin");
  }
  return { user, profile };
}

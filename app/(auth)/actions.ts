"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { logActivity } from "@/lib/activity";
import { translateError } from "@/lib/error-translator";

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email dan password harus diisi." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: translateError(error.message) };
  }

  if (!data.user) {
    return { error: "Gagal memuat pengguna setelah masuk." };
  }

  // Get user profile to determine redirect
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_onboarding_completed")
    .eq("id", data.user.id)
    .single();

  const role = profile?.role || "umkm";
  const isOnboardingCompleted = profile?.is_onboarding_completed ?? false;

  let redirectUrl = "/dashboard";
  if (role === "admin") {
    redirectUrl = "/admin";
  } else if (!isOnboardingCompleted) {
    redirectUrl = "/onboarding";
  }

  // Log activity
  await logActivity("Login ke sistem", "auth", data.user.id, { role }, "info", data.user.id);

  return { success: true, redirectUrl };
}

export async function registerAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirm_password") as string;

  if (!email || !password || !confirmPassword) {
    return { error: "Email, password, dan konfirmasi password harus diisi." };
  }

  if (password !== confirmPassword) {
    return { error: "Password dan konfirmasi password tidak cocok." };
  }

  const supabase = await createClient();

  // Check if self-registration is enabled
  const { data: settings } = await supabase
    .from("app_settings")
    .select("setting_value")
    .eq("setting_key", "access")
    .single();

  const isRegistrationEnabled = settings?.setting_value?.enable_registration ?? false;

  if (!isRegistrationEnabled) {
    return { error: "Pendaftaran mandiri saat ini dinonaktifkan oleh administrator. Silakan hubungi Admin." };
  }

  // Password strength validation
  if (password.length < 8) {
    return { error: "Password minimal harus 8 karakter." };
  }

  if (!/[A-Z]/.test(password)) {
    return { error: "Password harus mengandung minimal 1 huruf besar." };
  }

  if (!/[a-z]/.test(password)) {
    return { error: "Password harus mengandung minimal 1 huruf kecil." };
  }

  if (!/[0-9]/.test(password)) {
    return { error: "Password harus mengandung minimal 1 angka." };
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { error: "Password harus mengandung minimal 1 karakter khusus/simbol." };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: translateError(error.message) };
  }

  if (data.user) {
    // Upsert initial profile record
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: data.user.id,
        role: "umkm",
        is_onboarding_completed: false,
      });

    if (profileError) {
      console.error("Error updating profile during register:", profileError.message);
    }

    // Sign out immediately to prevent auto-login
    await supabase.auth.signOut();
  }

  return { success: true, redirectUrl: "/login?registered=true" };
}

export async function googleLoginAction() {
  const headersList = await headers();
  const origin = headersList.get("origin") || "";

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return { error: translateError(error.message) };
  }

  return { success: true, url: data.url };
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return { success: true };
}

export async function forgotPasswordAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const origin = formData.get("origin") as string;

  if (!email) {
    return { error: "Email wajib diisi." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { error: translateError(error.message) };
  }

  return { success: true, message: "Link pemulihan kata sandi telah dikirim ke email Anda. Silakan periksa inbox/spam Anda." };
}

export async function resetPasswordAction(prevState: any, formData: FormData) {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirm_password") as string;

  if (!password || !confirmPassword) {
    return { error: "Password baru dan konfirmasi password wajib diisi." };
  }

  if (password !== confirmPassword) {
    return { error: "Password baru dan konfirmasi password tidak cocok." };
  }

  // Password strength validation
  if (password.length < 8) {
    return { error: "Password minimal harus 8 karakter." };
  }

  if (!/[A-Z]/.test(password)) {
    return { error: "Password harus mengandung minimal 1 huruf besar." };
  }

  if (!/[a-z]/.test(password)) {
    return { error: "Password harus mengandung minimal 1 huruf kecil." };
  }

  if (!/[0-9]/.test(password)) {
    return { error: "Password harus mengandung minimal 1 angka." };
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { error: "Password harus mengandung minimal 1 karakter khusus/simbol." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return { error: translateError(error.message) };
  }

  // Sign out immediately to clear the recovery session
  await supabase.auth.signOut();

  return { success: true, redirectUrl: "/reset-success" };
}

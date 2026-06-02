"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

export async function updateBusinessInfo(prevState: any, formData: FormData) {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: "Sesi tidak valid." };

    const supabase = await createClient();

    // Data dari tab Bisnis & Kontak
    const nama_lengkap = formData.get("nama_lengkap") as string;
    const nama_usaha = formData.get("nama_usaha") as string;
    const category_id = formData.get("category_id") as string;
    const no_wa = formData.get("no_wa") as string;
    const instagram = formData.get("instagram") as string;
    const alamat = formData.get("alamat") as string;
    const logo_url = formData.get("logo_url") as string;

    const updates = {
      nama_lengkap: nama_lengkap || null,
      nama_usaha: nama_usaha || null,
      category_id: category_id || null,
      no_wa: no_wa || null,
      instagram: instagram || null,
      alamat: alamat || null,
      ...(logo_url && { logo_url }),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);

    if (error) {
      console.error("Update profile error:", error);
      return { error: "Gagal menyimpan profil: " + error.message };
    }

    revalidatePath("/dashboard/profil");
    revalidatePath("/dashboard"); // Sidebar might need revalidation

    await logActivity("Memperbarui Profil Bisnis", "profile", user.id, undefined, "info", user.id);

    return { success: true };

  } catch (err: any) {
    return { error: err.message || "Terjadi kesalahan internal." };
  }
}

export async function updatePassword(prevState: any, formData: FormData) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.email) return { error: "Sesi tidak valid." };

    const supabase = await createClient();
    const currentPassword = formData.get("current_password") as string;
    const newPassword = formData.get("new_password") as string;
    const confirmPassword = formData.get("confirm_password") as string;

    if (!currentPassword) {
      return { error: "Silakan masukkan password saat ini." };
    }

    // 1. Verifikasi Password Saat Ini dengan melakukan re-auth
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (signInError) {
      return { error: "Password saat ini salah." };
    }

    // 2. Validasi Password Baru
    if (!newPassword || newPassword.length < 8) {
      return { error: "Password minimal 8 karakter." };
    }

    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      return { error: "Password tidak memenuhi syarat keamanan yang ditentukan." };
    }

    if (newPassword !== confirmPassword) {
      return { error: "Konfirmasi password tidak cocok." };
    }

    // 3. Update Password
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      return { error: error.message };
    }

    await logActivity("Memperbarui Password", "security", user.id, undefined, "warning", user.id);

    return { success: true };

  } catch (err: any) {
    return { error: err.message || "Terjadi kesalahan internal." };
  }
}

"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/lib/activity";

export async function toggleUserStatus(id: string, currentStatus: boolean) {
  try {
    await requireAdmin();

    const newStatus = !currentStatus;
    const supabase = await createClient();

    // Fetch name/business name for log
    const { data: userProfile } = await supabase
      .from("profiles")
      .select("nama_usaha, nama_lengkap")
      .eq("id", id)
      .single();

    const { error } = await supabase
      .from("profiles")
      .update({ is_active: newStatus })
      .eq("id", id);

    if (error) {
      console.error("Error toggling user status:", error.message);
      return { success: false, error: error.message };
    }

    await logActivity(
      newStatus ? "user_activated" : "user_suspended",
      "profile",
      id,
      {
        nama_usaha: userProfile?.nama_usaha || "",
        nama_lengkap: userProfile?.nama_lengkap || "",
      },
      newStatus ? "success" : "warning"
    );

    revalidatePath("/admin/users");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    console.error("Auth/Toggle user status error:", err);
    return { success: false, error: err.message || "Unauthorized" };
  }
}

export async function updateUser(id: string, prevState: any, formData: FormData) {
  try {
    await requireAdmin();

    const nama_lengkap = formData.get("nama_lengkap") as string;
    const nama_usaha = formData.get("nama_usaha") as string;
    const category_id = formData.get("category_id") as string;
    const no_wa = formData.get("no_wa") as string;
    const instagram = formData.get("instagram") as string;
    const alamat = formData.get("alamat") as string;
    const role = formData.get("role") as string;

    if (!nama_lengkap || !nama_usaha || !no_wa) {
      return { success: false, error: "Nama, Nama Usaha, dan Nomor WhatsApp wajib diisi." };
    }

    if (role && !["umkm", "admin"].includes(role)) {
      return { success: false, error: "Role tidak valid." };
    }

    const supabase = await createClient();

    const updateData: any = {
      nama_lengkap,
      nama_usaha,
      category_id: category_id || null,
      no_wa,
      instagram,
      alamat,
    };

    if (role) {
      updateData.role = role;
    }

    const { error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", id);

    if (error) {
      console.error("Error updating user profile:", error.message);
      return { success: false, error: error.message };
    }

    await logActivity(
      "user_updated",
      "profile",
      id,
      { nama_usaha, nama_lengkap, role },
      "info"
    );

    revalidatePath("/admin/users");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    console.error("Auth/Update user error:", err);
    return { success: false, error: err.message || "Unauthorized" };
  }
}

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Kunci Supabase Service Role Key tidak ditemukan di .env.local");
  }

  return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function deleteUserAction(id: string, name: string) {
  try {
    await requireAdmin();
    const adminClient = getAdminClient();

    // Hapus profil terlebih dahulu untuk menghindari masalah foreign key jika tidak ada ON DELETE CASCADE
    await adminClient.from("profiles").delete().eq("id", id);
    
    // Hapus dari auth.users
    const { error } = await adminClient.auth.admin.deleteUser(id);

    if (error) {
      console.error("Error deleting user:", error.message);
      return { success: false, error: error.message };
    }

    await logActivity(
      "user_deleted",
      "profile",
      id,
      { nama_usaha: name },
      "warning"
    );

    revalidatePath("/admin/users");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    console.error("Auth/Delete user error:", err);
    return { success: false, error: err.message || "Unauthorized" };
  }
}

export async function createUserAction(prevState: any, formData: FormData) {
  try {
    await requireAdmin();
    
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = (formData.get("role") as string) || "umkm";

    if (!email || !password) {
      return { success: false, error: "Email dan Password wajib diisi." };
    }

    if (!["umkm", "admin"].includes(role)) {
      return { success: false, error: "Role tidak valid." };
    }

    const adminClient = getAdminClient();

    // 1. Create auth user
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      return { success: false, error: authError.message };
    }

    if (!authData.user) {
      return { success: false, error: "Gagal membuat user." };
    }

    // 2. Upsert profile (Hanya data dasar, biarkan UMKM mengisi sisanya saat onboarding jika umkm)
    const { error: profileError } = await adminClient
      .from("profiles")
      .upsert({
        id: authData.user.id,
        role: role,
        is_onboarding_completed: role === "admin",
        is_active: true,
      });

    if (profileError) {
      // Rollback if profile creation fails
      await adminClient.auth.admin.deleteUser(authData.user.id);
      return { success: false, error: profileError.message };
    }

    await logActivity(
      "user_created",
      "profile",
      authData.user.id,
      { email: email, role: role },
      "success"
    );

    revalidatePath("/admin/users");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    console.error("Auth/Create user error:", err);
    return { success: false, error: err.message || "Unauthorized" };
  }
}

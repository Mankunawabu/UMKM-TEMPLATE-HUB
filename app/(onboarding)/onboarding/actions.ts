"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function submitOnboarding(prevState: any, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Sesi Anda tidak valid. Silakan masuk kembali." };
  }

  const nama_lengkap = formData.get("nama_lengkap") as string;
  const nama_usaha = formData.get("nama_usaha") as string;
  const category_id = formData.get("category_id") as string;
  const no_wa = formData.get("no_wa") as string;
  const instagram = formData.get("instagram") as string;
  const alamat = formData.get("alamat") as string;
  const logo_url = formData.get("logo_url") as string;

  if (!nama_lengkap || !nama_usaha || !no_wa) {
    return { error: "Kolom Nama Lengkap, Nama Usaha, dan No WhatsApp harus diisi." };
  }

  const supabase = await createClient();

  // Update profile with onboarding data
  const { error } = await supabase
    .from("profiles")
    .update({
      nama_lengkap,
      nama_usaha,
      category_id: category_id && !category_id.startsWith("fallback") ? category_id : null,
      no_wa,
      instagram,
      alamat,
      logo_url: logo_url || null,
      is_onboarding_completed: true,
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

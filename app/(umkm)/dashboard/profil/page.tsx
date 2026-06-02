import { redirect } from "next/navigation";
import { getCurrentUser, getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ProfilClient } from "./profil-client";

export const metadata = {
  title: "Profil Usaha - UMKM Template Hub",
};

export default async function UMKMProfilPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profile = await getCurrentProfile();
  if (profile?.role === "admin") redirect("/admin");

  const supabase = await createClient();

  // Ambil data kategori untuk dropdown
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .eq("is_active", true)
    .order("name", { ascending: true });

  // Ambil setting limits (Maks Upload MB)
  const { data: limitsSetting } = await supabase
    .from("app_settings")
    .select("setting_value")
    .eq("setting_key", "limits")
    .single();
  const maxUploadMb = limitsSetting?.setting_value?.max_upload_mb || 5;

  return (
    <div className="space-y-8 font-sans">
      <ProfilClient initialProfile={profile} categories={categories || []} maxUploadMb={maxUploadMb} />
    </div>
  );
}

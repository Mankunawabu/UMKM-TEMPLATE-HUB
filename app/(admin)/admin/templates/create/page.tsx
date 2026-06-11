import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { PageHeader } from "@/components/admin/page-header";
import { CreateTemplateForm } from "./create-form";

export default async function CreateTemplatePage() {
  await requireAdmin();

  const supabase = await createClient();
  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching categories for template create:", error);
  }

  // Ambil setting limits (Maks Upload MB)
  const { data: limitsSetting } = await supabase
    .from("app_settings")
    .select("setting_value")
    .eq("setting_key", "limits")
    .single();
  const maxUploadMb = limitsSetting?.setting_value?.max_upload_mb || 5;

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans">
      <Link
        href="/admin/templates"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E07A00] hover:text-[#FF9100] transition-colors uppercase tracking-wider"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Kembali ke Daftar Template
      </Link>

      <PageHeader
        title="Buat Template Baru"
        subtitle="Tambahkan template desain baru lengkap dengan thumbnail, preview, dan file Fabric JSON"
      />

      <CreateTemplateForm categories={categories || []} maxUploadMb={maxUploadMb} />
    </div>
  );
}

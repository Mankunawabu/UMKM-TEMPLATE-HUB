import * as React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { PageHeader } from "@/components/admin/page-header";
import { EditTemplateForm } from "./edit-form";

interface EditTemplatePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTemplatePage({ params }: EditTemplatePageProps) {
  await requireAdmin();
  const { id } = await params;

  const supabase = await createClient();

  const { data: template, error: templateError } = await supabase
    .from("templates")
    .select("*")
    .eq("id", id)
    .single();

  if (templateError || !template) {
    notFound();
  }

  const mappedTemplate = {
    ...template,
    name: template.nama_template
  };

  const { data: categories, error: categoriesError } = await supabase
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
    <div className="max-w-5xl mx-auto space-y-6 font-sans">
      <Link
        href="/admin/templates"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E07A00] hover:text-[#FF9100] transition-colors uppercase tracking-wider"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Kembali ke Daftar Template
      </Link>

      <PageHeader
        title="Edit Template"
        subtitle={`Ubah informasi dan media untuk template "${mappedTemplate.name}"`}
      />

      <EditTemplateForm 
        template={mappedTemplate} 
        categories={categories || []} 
        maxUploadMb={maxUploadMb}
      />
    </div>
  );
}

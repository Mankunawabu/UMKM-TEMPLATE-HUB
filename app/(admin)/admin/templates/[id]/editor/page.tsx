import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { EditorClient } from "./editor-client";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditorPage({ params }: PageProps) {
  await requireAdmin();
  const resolvedParams = await params;
  const templateId = resolvedParams.id;
  const supabase = await createClient();

  const { data: template, error } = await supabase
    .from("templates")
    .select("id, nama_template, master_template_url")
    .eq("id", templateId)
    .single();

  if (error || !template) {
    console.error("Template not found:", error);
    notFound();
  }

  if (!template.master_template_url) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
          Template ini belum memiliki Master Template PNG Berlubang. Silakan unggah terlebih dahulu di halaman Edit Info Template.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <EditorClient template={{
        id: template.id,
        name: template.nama_template,
        master_template_url: template.master_template_url
      }} />
    </div>
  );
}

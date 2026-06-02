import { requireAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { EditorClient } from "./editor-client";

interface EditorPageProps {
  params: Promise<{ id: string }>;
}

export default async function TemplateEditorPage({ params }: EditorPageProps) {
  const { profile } = await requireAuth();
  const { id } = await params;
  const supabase = await createClient();

  // Fetch the template and its fields
  const [templateRes, fieldsRes] = await Promise.all([
    supabase
      .from("templates")
      .select("*, categories(name)")
      .eq("id", id)
      .eq("status", "published")
      .single(),
    supabase
      .from("template_fields")
      .select("*")
      .eq("template_id", id)
      .order("z_index", { ascending: true })
  ]);

  let templateFields = fieldsRes.data || [];

  // Fallback to default fields if none exist in DB
  if (templateFields.length === 0) {
    templateFields = [
      {
        id: "default-img",
        template_id: id,
        shape_type: "rect",
        placeholder_label: "Foto Produk",
        is_editable: true,
        field_role: "image",
        render_mode: "under",
        z_index: 0,
        x: 540,
        y: 540,
        width: 600,
        height: 600
      },
      {
        id: "default-text-1",
        template_id: id,
        shape_type: "text",
        placeholder_label: "Nama Produk",
        is_editable: true,
        field_role: "magic",
        render_mode: "over",
        z_index: 10,
        x: 540,
        y: 150,
        width: 800,
        height: 100,
        max_chars: 40,
        font_family: "Poppins",
        font_size: 64,
        font_weight: "800",
        color: "#3D1E30",
        text_align: "center"
      },
      {
        id: "default-text-2",
        template_id: id,
        shape_type: "text",
        placeholder_label: "Deskripsi",
        is_editable: true,
        field_role: "magic",
        render_mode: "over",
        z_index: 11,
        x: 540,
        y: 280,
        width: 800,
        height: 150,
        max_chars: 120,
        font_family: "Inter",
        font_size: 32,
        font_weight: "500",
        color: "#8C4A6E",
        text_align: "center"
      },
      {
        id: "default-text-3",
        template_id: id,
        shape_type: "text",
        placeholder_label: "Kontak",
        is_editable: true,
        field_role: "magic",
        render_mode: "over",
        z_index: 12,
        x: 540,
        y: 950,
        width: 800,
        height: 50,
        max_chars: 50,
        font_family: "Plus Jakarta Sans",
        font_size: 28,
        font_weight: "700",
        color: "#C27BA0",
        text_align: "center"
      }
    ];
  }

  const template = templateRes.data;

  if (!template) {
    redirect("/dashboard/template");
  }

  // If master template URL is missing but there's a thumbnail, we might use thumbnail as fallback for testing
  const masterUrl = template.master_template_url || template.thumbnail_url;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <EditorClient 
        template={{...template, master_template_url: masterUrl}} 
        fields={templateFields} 
        userId={profile.id}
        shopName={profile.nama_usaha}
        shopLogo={profile.logo_url || profile.avatar_url}
      />
    </div>
  );
}

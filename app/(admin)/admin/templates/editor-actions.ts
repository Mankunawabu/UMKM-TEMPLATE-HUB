"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

export interface TemplateField {
  id?: string;
  template_id: string;
  shape_type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  placeholder_label: string;
  is_editable: boolean;
  field_role: string;
  render_mode: string;
  z_index: number;
  font_family?: string;
  font_size?: number;
  font_weight?: string;
  color?: string;
  text_align?: string;
  max_chars?: number;
}

export async function getTemplateFields(templateId: string) {
  try {
    await requireAdmin();
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("template_fields")
      .select("*")
      .eq("template_id", templateId)
      .order("z_index", { ascending: true });

    if (error) {
      console.error("Error fetching template fields:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as TemplateField[] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function saveTemplateFields(templateId: string, fields: TemplateField[]) {
  try {
    await requireAdmin();
    const supabase = await createClient();

    // Hapus field lama
    const { error: deleteError } = await supabase
      .from("template_fields")
      .delete()
      .eq("template_id", templateId);

    if (deleteError) {
      console.error("Error deleting old template fields:", deleteError);
      return { success: false, error: deleteError.message };
    }

    // Jika ada field baru, insert
    if (fields && fields.length > 0) {
      // Pastikan template_id terset
      const fieldsToInsert = fields.map((f, index) => {
        return {
          ...f,
          template_id: templateId,
        };
      });

      // Hapus ID untuk semua field agar Supabase men-generate ulang UUID
      fieldsToInsert.forEach(f => {
        delete f.id;
      });

      const { error: insertError } = await supabase
        .from("template_fields")
        .insert(fieldsToInsert);

      if (insertError) {
        console.error("Error inserting template fields:", insertError);
        return { success: false, error: insertError.message };
      }
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

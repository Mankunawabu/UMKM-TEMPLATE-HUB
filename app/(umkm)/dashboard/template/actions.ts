"use client";
import { translateError } from "@/lib/error-translator";
import { createClient } from "@/lib/supabase/client";

export async function logExportAction(
  templateId: string, 
  userId: string, 
  fileType: string = "PNG",
  exportedImageUrl?: string,
  customizationData?: any
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("export_logs")
    .insert({ 
      template_id: templateId, 
      user_id: userId, 
      file_type: fileType,
      exported_image_url: exportedImageUrl,
      customization_data: customizationData
    })
    .select("id")
    .single();
    
  if (error) {
    console.error("Failed to log export:", error);
    return { success: false, error: translateError(error.message) };
  }
  return { success: true, id: data.id };
}

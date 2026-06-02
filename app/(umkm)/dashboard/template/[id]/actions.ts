"use server";
import { createClient } from "@/lib/supabase/server";

export async function getExportLogData(exportId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("export_logs")
    .select("customization_data, template_id")
    .eq("id", exportId)
    .single();

  if (error) {
    console.error("Failed to fetch export log data:", error.message);
    return null;
  }
  return data;
}

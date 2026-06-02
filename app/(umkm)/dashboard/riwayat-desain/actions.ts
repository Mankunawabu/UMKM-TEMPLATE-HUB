"use server";

import { createClient } from "@/lib/supabase/server";

export async function getExportLogs(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("export_logs")
    .select(`
      id,
      created_at,
      template_id,
      exported_image_url,
      templates (
        id,
        nama_template,
        slug,
        description,
        thumbnail_url,
        master_template_url,
        target_platform,
        category_id,
        categories (
          name
        )
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching export logs:", error.message);
    return [];
  }

  return data || [];
}

import { revalidatePath } from "next/cache";

export async function deleteExportLog(logId: string) {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data: log } = await supabase
      .from("export_logs")
      .select("exported_image_url")
      .eq("id", logId)
      .eq("user_id", user.id)
      .single();

    if (log?.exported_image_url) {
       try {
         const urlObj = new URL(log.exported_image_url);
         const pathParts = urlObj.pathname.split('/umkm_assets/');
         if (pathParts.length > 1) {
            const filePath = decodeURIComponent(pathParts[1]);
            await supabase.storage.from("umkm_assets").remove([filePath]);
         }
       } catch (e) {
         console.error("Error deleting image from storage:", e);
       }
    }

    const { error } = await supabase
      .from("export_logs")
      .delete()
      .eq("id", logId)
      .eq("user_id", user.id);

    if (error) throw error;
    
    revalidatePath("/dashboard/riwayat-desain");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteMultipleExportLogs(logIds: string[]) {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Get logs to delete storage files
    const { data: logs } = await supabase
      .from("export_logs")
      .select("exported_image_url")
      .in("id", logIds)
      .eq("user_id", user.id);

    const filesToDelete: string[] = [];
    if (logs && logs.length > 0) {
      logs.forEach(log => {
        if (log.exported_image_url) {
          try {
            const urlObj = new URL(log.exported_image_url);
            const pathParts = urlObj.pathname.split('/umkm_assets/');
            if (pathParts.length > 1) {
              filesToDelete.push(decodeURIComponent(pathParts[1]));
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
      });

      if (filesToDelete.length > 0) {
        await supabase.storage.from("umkm_assets").remove(filesToDelete);
      }
    }

    const { error } = await supabase
      .from("export_logs")
      .delete()
      .in("id", logIds)
      .eq("user_id", user.id);

    if (error) throw error;
    
    revalidatePath("/dashboard/riwayat-desain");
    return { success: true, count: logIds.length };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/lib/activity";

export async function updateMaintenanceSettings(prevState: any, formData: FormData) {
  try {
    await requireAdmin();
    const is_maintenance_mode = formData.get("is_maintenance_mode") === "true";
    const maintenance_message = formData.get("maintenance_message") as string;

    const supabase = await createClient();
    const { error } = await supabase
      .from("app_settings")
      .upsert(
        {
          setting_key: "maintenance",
          setting_value: { is_maintenance_mode, maintenance_message },
          updated_at: new Date().toISOString(),
        },
        { onConflict: "setting_key" }
      );

    if (error) throw error;
    await logActivity("settings_updated", "settings", undefined, { section: "maintenance" }, "warning");
    revalidatePath("/admin/settings");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateAccessSettings(prevState: any, formData: FormData) {
  try {
    await requireAdmin();
    const enable_registration = formData.get("enable_registration") === "true";

    const supabase = await createClient();
    const { error } = await supabase
      .from("app_settings")
      .upsert(
        {
          setting_key: "access",
          setting_value: { enable_registration },
          updated_at: new Date().toISOString(),
        },
        { onConflict: "setting_key" }
      );

    if (error) throw error;
    await logActivity("settings_updated", "settings", undefined, { section: "access" }, "info");
    revalidatePath("/admin/settings");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateLimitsSettings(prevState: any, formData: FormData) {
  try {
    await requireAdmin();
    const daily_export_limit = parseInt(formData.get("daily_export_limit") as string, 10);
    const max_upload_mb = parseInt(formData.get("max_upload_mb") as string, 10);

    const supabase = await createClient();
    const { error } = await supabase
      .from("app_settings")
      .upsert(
        {
          setting_key: "limits",
          setting_value: { daily_export_limit, max_upload_mb },
          updated_at: new Date().toISOString(),
        },
        { onConflict: "setting_key" }
      );

    if (error) throw error;
    await logActivity("settings_updated", "settings", undefined, { section: "limits" }, "info");
    revalidatePath("/admin/settings");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getGroqModels() {
  try {
    await requireAdmin();
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("Groq API key tidak dikonfigurasi di server.");
    
    const res = await fetch("https://api.groq.com/openai/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: "no-store", // Don't cache so it's fresh if key changes
    });
    
    if (!res.ok) throw new Error("Gagal mengambil model dari Groq.");
    const json = await res.json();
    return { success: true, models: json.data || [] };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateAiSettings(prevState: any, formData: FormData) {
  try {
    await requireAdmin();
    const ai_model = formData.get("ai_model") as string;
    const ai_prompt = formData.get("ai_prompt") as string;
    const ai_max_tokens = parseInt(formData.get("ai_max_tokens") as string, 10);

    const supabase = await createClient();
    const { error } = await supabase
      .from("app_settings")
      .upsert(
        {
          setting_key: "ai_magic",
          setting_value: { ai_model, ai_prompt, ai_max_tokens },
          updated_at: new Date().toISOString(),
        },
        { onConflict: "setting_key" }
      );

    if (error) throw error;
    await logActivity("settings_updated", "settings", undefined, { section: "ai_magic" }, "info");
    revalidatePath("/admin/settings");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}


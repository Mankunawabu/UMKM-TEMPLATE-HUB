import { createClient, createAdminClient } from "./supabase/server";

export type ActivitySeverity = "info" | "success" | "warning" | "error";

export async function logActivity(
  action: string,
  entityType?: string,
  entityId?: string,
  metadata?: Record<string, any>,
  severity: ActivitySeverity = "info",
  userId?: string
) {
  try {
    const supabase = await createClient();
    
    // Attempt to get the authenticated user if explicit userId is not provided
    let finalUserId = userId;
    if (!finalUserId) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      finalUserId = user?.id;
    }

    const adminClient = createAdminClient();

    const { error } = await adminClient.from("activity_logs").insert({
      user_id: finalUserId || null,
      action,
      entity_type: entityType || null,
      entity_id: entityId || null,
      metadata: metadata || null,
      severity,
    });

    if (error) {
      console.error("Error inserting activity log:", error.message);
    }
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
}

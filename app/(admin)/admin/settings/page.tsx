import * as React from "react";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { SettingsClient } from "./settings-client";

export default async function AdminSettingsPage() {
  await requireAdmin();

  const supabase = await createClient();

  const { data: settings, error } = await supabase
    .from("app_settings")
    .select("*");

  if (error) {
    console.error("Error fetching app settings:", error.message);
  }

  return (
    <div className="space-y-4 font-sans">
      <SettingsClient initialSettings={settings || []} />
    </div>
  );
}

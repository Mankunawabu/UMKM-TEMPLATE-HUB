import * as React from "react";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { TemplatesClient } from "./templates-client";

export default async function AdminTemplatesPage() {
  await requireAdmin();

  const supabase = await createClient();

  // Fetch templates with categories
  const { data: templates, error: templatesError } = await supabase
    .from("templates")
    .select(`
      *,
      categories (
        name
      )
    `)
    .order("created_at", { ascending: false });

  if (templatesError) {
    console.error("Error fetching templates:", templatesError.message);
  }

  const mappedTemplates = (templates || []).map((t: any) => ({
    ...t,
    name: t.nama_template
  }));

  return (
    <div className="space-y-4 font-sans">
      <TemplatesClient
        initialTemplates={mappedTemplates}
      />
    </div>
  );
}

import * as React from "react";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { CategoriesClient } from "./categories-client";

export default async function AdminCategoriesPage() {
  await requireAdmin();

  const supabase = await createClient();
  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching categories:", error);
  }

  return (
    <div className="space-y-4 font-sans">
      <CategoriesClient initialCategories={categories || []} />
    </div>
  );
}

import * as React from "react";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { UsersClient } from "./users-client";

export default async function AdminUsersPage() {
  await requireAdmin();

  const supabase = await createClient();

  // Fetch profiles (both UMKM and Admin)
  const { data: users, error: usersError } = await supabase
    .from("profiles")
    .select(`
      *,
      categories (
        name
      ),
      export_logs (count)
    `)
    .order("created_at", { ascending: false });

  if (usersError) {
    console.error("Error fetching UMKM users:", usersError.message);
  }

  // Format users to extract count
  const formattedUsers = users?.map(u => ({
    ...u,
    export_count: u.export_logs?.[0]?.count || 0
  })) || [];

  // Fetch active categories for edit dropdown
  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("id, name")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (categoriesError) {
    console.error("Error fetching active categories for users list:", categoriesError.message);
  }

  return (
    <div className="space-y-4 font-sans">
      <UsersClient
        initialUsers={formattedUsers as any}
        categories={categories || []}
      />
    </div>
  );
}

"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/lib/activity";

export async function createCategory(prevState: any, formData: FormData) {
  try {
    await requireAdmin();

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const icon_name = formData.get("icon_name") as string;
    const is_active = formData.get("is_active") === "true";

    if (!name || !slug || !icon_name) {
      return { success: false, error: "Nama, Slug, dan Icon harus diisi." };
    }

    const supabase = await createClient();

    const { data: category, error } = await supabase
      .from("categories")
      .insert({
        name,
        slug,
        icon_name,
        is_active,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating category:", error.message);
      return { success: false, error: error.message };
    }

    await logActivity("category_created", "category", category.id, { name }, "success");

    revalidatePath("/admin/categories");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    console.error("Auth error:", err);
    return { success: false, error: err.message || "Unauthorized" };
  }
}

export async function updateCategory(
  id: string,
  prevState: any,
  formData: FormData
) {
  try {
    await requireAdmin();

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const icon_name = formData.get("icon_name") as string;
    const is_active = formData.get("is_active") === "true";

    if (!name || !slug || !icon_name) {
      return { success: false, error: "Nama, Slug, dan Icon harus diisi." };
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from("categories")
      .update({
        name,
        slug,
        icon_name,
        is_active,
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating category:", error.message);
      return { success: false, error: error.message };
    }

    await logActivity("category_updated", "category", id, { name }, "info");

    revalidatePath("/admin/categories");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    console.error("Auth/Update error:", err);
    return { success: false, error: err.message || "Unauthorized" };
  }
}

export async function deleteCategory(id: string) {
  try {
    await requireAdmin();

    const supabase = await createClient();

    // Fetch the name first for logging
    const { data: category } = await supabase
      .from("categories")
      .select("name")
      .eq("id", id)
      .single();

    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
      console.error("Error deleting category:", error.message);
      return { success: false, error: error.message };
    }

    await logActivity(
      "category_deleted",
      "category",
      id,
      { name: category?.name || "Kategori" },
      "warning"
    );

    revalidatePath("/admin/categories");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    console.error("Auth/Delete error:", err);
    return { success: false, error: err.message || "Unauthorized" };
  }
}

export async function toggleCategoryStatus(id: string, is_active: boolean) {
  try {
    await requireAdmin();

    const supabase = await createClient();

    // Fetch category name
    const { data: category } = await supabase
      .from("categories")
      .select("name")
      .eq("id", id)
      .single();

    const { error } = await supabase
      .from("categories")
      .update({ is_active })
      .eq("id", id);

    if (error) {
      console.error("Error toggling category status:", error.message);
      return { success: false, error: error.message };
    }

    await logActivity(
      is_active ? "category_activated" : "category_deactivated",
      "category",
      id,
      { name: category?.name || "" },
      "info"
    );

    revalidatePath("/admin/categories");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    console.error("Auth/Toggle error:", err);
    return { success: false, error: err.message || "Unauthorized" };
  }
}

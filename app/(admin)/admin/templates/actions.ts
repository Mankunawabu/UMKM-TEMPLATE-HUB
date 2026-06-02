"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/lib/activity";

export async function createTemplate(prevState: any, formData: FormData) {
  try {
    const { user } = await requireAdmin();

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const category_id = formData.get("category_id") as string;
    const description = formData.get("description") as string;
    const thumbnail_url = formData.get("thumbnail_url") as string;
    const preview_image_url = formData.get("preview_image_url") as string;
    const master_template_url = formData.get("master_template_url") as string;
    const target_platform = (formData.get("target_platform") as string) || "instagram_feed";
    const status = formData.get("status") as string; // 'draft' | 'published'

    if (!id || !name || !slug || !category_id) {
      return { success: false, error: "Nama, Slug, dan Kategori wajib diisi." };
    }

    const supabase = await createClient();

    // 1. Insert template (with created_by)
    const { data: template, error: templateError } = await supabase
      .from("templates")
      .insert({
        id,
        nama_template: name,
        slug,
        category_id,
        description,
        thumbnail_url,
        preview_image_url,
        master_template_url,
        target_platform,
        status,
        created_by: user.id,
      })
      .select()
      .single();

    if (templateError) {
      console.error("Error inserting template:", templateError.message);
      return { success: false, error: templateError.message };
    }

    await logActivity("template_created", "template", template.id, { name: template.nama_template }, "success");

    revalidatePath("/admin/templates");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    console.error("Auth/Create template error:", err);
    return { success: false, error: err.message || "Unauthorized" };
  }
}

export async function updateTemplate(
  id: string,
  prevState: any,
  formData: FormData
) {
  try {
    await requireAdmin();

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const category_id = formData.get("category_id") as string;
    const description = formData.get("description") as string;
    const thumbnail_url = formData.get("thumbnail_url") as string;
    const preview_image_url = formData.get("preview_image_url") as string;
    const master_template_url = formData.get("master_template_url") as string;
    const target_platform = formData.get("target_platform") as string;
    const status = formData.get("status") as string;

    if (!name || !slug || !category_id) {
      return { success: false, error: "Nama, Slug, dan Kategori wajib diisi." };
    }

    const supabase = await createClient();

    const updateData: any = {
      nama_template: name,
      slug,
      category_id,
      description,
      status,
    };

    if (thumbnail_url) {
      updateData.thumbnail_url = thumbnail_url;
    }
    if (preview_image_url) {
      updateData.preview_image_url = preview_image_url;
    }
    if (master_template_url) {
      updateData.master_template_url = master_template_url;
    }
    if (target_platform) {
      updateData.target_platform = target_platform;
    }

    const { error } = await supabase
      .from("templates")
      .update(updateData)
      .eq("id", id);

    if (error) {
      console.error("Error updating template:", error.message);
      return { success: false, error: error.message };
    }

    await logActivity("template_updated", "template", id, { name }, "info");

    revalidatePath("/admin/templates");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    console.error("Auth/Update template error:", err);
    return { success: false, error: err.message || "Unauthorized" };
  }
}

export async function deleteTemplate(id: string) {
  try {
    await requireAdmin();

    const supabase = await createClient();

    // Fetch the name for logging
    const { data: template } = await supabase
      .from("templates")
      .select("nama_template")
      .eq("id", id)
      .single();

    const { error } = await supabase.from("templates").delete().eq("id", id);

    if (error) {
      console.error("Error deleting template:", error.message);
      return { success: false, error: error.message };
    }

    await logActivity(
      "template_deleted",
      "template",
      id,
      { name: template?.nama_template || "Template" },
      "warning"
    );

    revalidatePath("/admin/templates");
    revalidatePath("/admin/versions");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    console.error("Auth/Delete template error:", err);
    return { success: false, error: err.message || "Unauthorized" };
  }
}

export async function togglePublish(id: string, status: string) {
  try {
    await requireAdmin();

    const supabase = await createClient();

    // Fetch template name
    const { data: template } = await supabase
      .from("templates")
      .select("nama_template")
      .eq("id", id)
      .single();

    const { error } = await supabase
      .from("templates")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Error toggling template status:", error.message);
      return { success: false, error: error.message };
    }

    await logActivity(
      status === "published" ? "template_published" : "template_drafted",
      "template",
      id,
      { name: template?.nama_template || "" },
      "info"
    );

    revalidatePath("/admin/templates");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    console.error("Auth/Toggle status error:", err);
    return { success: false, error: err.message || "Unauthorized" };
  }
}

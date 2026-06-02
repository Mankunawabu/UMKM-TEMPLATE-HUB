import { requireAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { TemplateGalleryClient } from "./template-gallery-client";

interface PageProps {
  searchParams: Promise<{ kategori?: string }>;
}

export default async function UMKMTemplatePage({ searchParams }: PageProps) {
  await requireAuth();
  const { kategori } = await searchParams;

  const supabase = await createClient();

  const [{ data: templates }, { data: categories }] = await Promise.all([
    // Fetch all published templates with category info
    supabase
      .from("templates")
      .select("id, name:nama_template, slug, description, thumbnail_url, target_platform, categories(id, name)")
      .eq("status", "published")
      .order("created_at", { ascending: false }),

    // Fetch all active categories for filters
    supabase
      .from("categories")
      .select("id, name, icon_name")
      .eq("is_active", true)
      .order("name"),
  ]);

  return (
    <TemplateGalleryClient
      templates={(templates as any) || []}
      categories={categories || []}
      selectedCategory={kategori || null}
    />
  );
}

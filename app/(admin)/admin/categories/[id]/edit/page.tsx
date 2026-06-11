import * as React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { PageHeader } from "@/components/admin/page-header";
import { EditCategoryForm } from "./edit-form";

interface EditCategoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  await requireAdmin();
  const { id } = await params;

  const supabase = await createClient();
  const { data: category, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !category) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans">
      <Link
        href="/admin/categories"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E07A00] hover:text-[#FF9100] transition-colors uppercase tracking-wider"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Kembali ke Daftar Kategori
      </Link>

      <PageHeader
        title="Edit Kategori"
        subtitle={`Ubah informasi untuk kategori "${category.name}"`}
      />

      <EditCategoryForm category={category} />
    </div>
  );
}

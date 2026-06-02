"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Check } from "lucide-react";
import * as Lucide from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, Column } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { deleteCategory, toggleCategoryStatus } from "./actions";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon_name: string;
  is_active: boolean;
  created_at: string;
}

interface CategoriesClientProps {
  initialCategories: Category[];
}

export function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const [categories, setCategories] = React.useState<Category[]>(initialCategories);
  const [loadingMap, setLoadingMap] = React.useState<Record<string, boolean>>({});

  const handleToggle = async (id: string, currentStatus: boolean) => {
    setLoadingMap((prev) => ({ ...prev, [id]: true }));
    const result = await toggleCategoryStatus(id, !currentStatus);
    if (result.success) {
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, is_active: !currentStatus } : c))
      );
    } else {
      alert("Gagal mengubah status: " + result.error);
    }
    setLoadingMap((prev) => ({ ...prev, [id]: false }));
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus kategori "${name}"? Tindakan ini tidak dapat dibatalkan.`)) {
      setLoadingMap((prev) => ({ ...prev, [id]: true }));
      const result = await deleteCategory(id);
      if (result.success) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert("Gagal menghapus kategori: " + result.error);
      }
      setLoadingMap((prev) => ({ ...prev, [id]: false }));
    }
  };

  const columns: Column<Category>[] = [
    {
      header: "Icon",
      accessorKey: "icon_name",
      render: (row) => {
        const IconComp = (Lucide as any)[row.icon_name] || Lucide.HelpCircle;
        return (
          <div className="w-8 h-8 rounded-lg bg-[#FFF0F7] border border-[#F7D6E6] flex items-center justify-center text-[#8C4A6E]">
            <IconComp className="h-4 w-4" />
          </div>
        );
      },
    },
    {
      header: "Nama",
      accessorKey: "name",
      sortable: true,
      render: (row) => <span className="font-bold text-[#3D1E30]">{row.name}</span>,
    },
    {
      header: "Slug",
      accessorKey: "slug",
      sortable: true,
      render: (row) => <code className="bg-slate-100 text-xs font-semibold px-2 py-1 rounded text-[#8C4A6E]">{row.slug}</code>,
    },
    {
      header: "Status",
      accessorKey: "is_active",
      sortable: true,
      render: (row) => <StatusBadge status={row.is_active} />,
    },
    {
      header: "Tanggal Dibuat",
      accessorKey: "created_at",
      sortable: true,
      render: (row) => (
        <span className="text-slate-500 text-xs font-medium">
          {new Date(row.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      header: "Aksi",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleToggle(row.id, row.is_active)}
            disabled={loadingMap[row.id]}
            className="p-1.5 rounded-lg border border-[#F7D6E6] bg-white text-[#8C4A6E] hover:bg-[#FFF0F7] hover:text-[#C27BA0] transition-colors disabled:opacity-50"
            title={row.is_active ? "Nonaktifkan" : "Aktifkan"}
          >
            {row.is_active ? (
              <ToggleRight className="h-4 w-4 text-[#C27BA0]" />
            ) : (
              <ToggleLeft className="h-4 w-4 text-slate-400" />
            )}
          </button>
          <Link
            href={`/admin/categories/${row.id}/edit`}
            className="p-1.5 rounded-lg border border-[#F7D6E6] bg-white text-[#8C4A6E] hover:bg-[#FFF0F7] hover:text-[#C27BA0] transition-all"
            title="Edit Kategori"
          >
            <Edit className="h-4 w-4" />
          </Link>
          <button
            onClick={() => handleDelete(row.id, row.name)}
            disabled={loadingMap[row.id]}
            className="p-1.5 rounded-lg border border-red-100 bg-white text-red-600 hover:bg-red-50 transition-all disabled:opacity-50"
            title="Hapus Kategori"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daftar Kategori"
        subtitle="Kelola seluruh kategori template untuk kebutuhan segmentasi bisnis UMKM"
        action={
          <Link
            href="/admin/categories/create"
            className="flex items-center gap-2 bg-[#C27BA0] hover:bg-[#8C4A6E] text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <Plus className="h-4.5 w-4.5" />
            Tambah Kategori
          </Link>
        }
      />

      <DataTable
        columns={columns}
        data={categories}
        searchKey="name"
        searchPlaceholder="Cari kategori berdasarkan nama..."
      />
    </div>
  );
}

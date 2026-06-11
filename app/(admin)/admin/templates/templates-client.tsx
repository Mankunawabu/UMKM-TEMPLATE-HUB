"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Globe, EyeOff, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, Column } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { deleteTemplate, togglePublish } from "./actions";

interface Template {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  description: string | null;
  thumbnail_url: string | null;
  preview_image_url: string | null;
  status: string;
  current_version_id: string | null;
  created_at: string;
  categories: {
    name: string;
  } | null;
}

interface TemplatesClientProps {
  initialTemplates: Template[];
}

export function TemplatesClient({ initialTemplates }: TemplatesClientProps) {
  const [templates, setTemplates] = React.useState<Template[]>(initialTemplates);
  const [loadingMap, setLoadingMap] = React.useState<Record<string, boolean>>({});

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    setLoadingMap((prev) => ({ ...prev, [id]: true }));
    const result = await togglePublish(id, newStatus);
    if (result.success) {
      setTemplates((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
      );
    } else {
      toast.error("Gagal mengubah status: " + result.error);
    }
    setLoadingMap((prev) => ({ ...prev, [id]: false }));
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus template "${name}" beserta seluruh versinya? Tindakan ini tidak dapat dibatalkan.`)) {
      setLoadingMap((prev) => ({ ...prev, [id]: true }));
      const result = await deleteTemplate(id);
      if (result.success) {
        setTemplates((prev) => prev.filter((t) => t.id !== id));
      } else {
        toast.error("Gagal menghapus template: " + result.error);
      }
      setLoadingMap((prev) => ({ ...prev, [id]: false }));
    }
  };

  const columns: Column<Template>[] = [
    {
      header: "Thumbnail",
      accessorKey: "thumbnail_url",
      render: (row) => (
        <div className="w-12 h-12 rounded-lg bg-[#FFF5EE] border border-[#FFE6D5] flex items-center justify-center p-0.5 overflow-hidden shadow-sm shrink-0">
          {row.thumbnail_url ? (
            <img
              src={row.thumbnail_url}
              alt={row.name}
              className="w-full h-full object-contain rounded"
            />
          ) : (
            <span className="text-[10px] text-[#E07A00] font-bold uppercase">Logo</span>
          )}
        </div>
      ),
    },
    {
      header: "Nama Template",
      accessorKey: "name",
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-[#3D1E30]">{row.name}</span>
          <code className="text-[10px] text-[#E07A00] font-semibold mt-0.5">{row.slug}</code>
        </div>
      ),
    },
    {
      header: "Kategori",
      accessorKey: "categories.name",
      sortable: true,
      render: (row) => (
        <span className="px-2.5 py-1 rounded-lg bg-[#FFF5EE] text-[#E07A00] text-xs font-bold border border-[#FFE6D5]">
          {row.categories?.name || "-"}
        </span>
      ),
    },
    {
      header: "Deskripsi",
      accessorKey: "description",
      render: (row) => (
        <span className="text-slate-500 text-xs line-clamp-1 max-w-[200px]">
          {row.description || "-"}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <StatusBadge status={row.status} />
          <button
            onClick={() => handleToggleStatus(row.id, row.status)}
            disabled={loadingMap[row.id]}
            className="text-[#E07A00] hover:text-[#FF9100] transition-colors disabled:opacity-50"
            title={row.status === "published" ? "Jadikan Draft" : "Publikasikan"}
          >
            {row.status === "published" ? (
              <EyeOff className="h-4.5 w-4.5" />
            ) : (
              <Globe className="h-4.5 w-4.5" />
            )}
          </button>
        </div>
      ),
    },
    {
      header: "Tanggal Rilis",
      accessorKey: "created_at",
      sortable: true,
      render: (row) => (
        <span className="text-slate-500 text-xs font-medium font-sans">
          {new Date(row.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      header: "Aksi",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/templates/${row.id}/edit`}
            className="p-1.5 rounded-lg border border-[#FFE6D5] bg-white text-[#E07A00] hover:bg-[#FFF5EE] hover:text-[#FF9100] transition-all"
            title="Edit Info Template"
          >
            <Edit className="h-4 w-4" />
          </Link>
          <Link
            href={`/admin/templates/${row.id}/editor`}
            className="p-1.5 rounded-lg border border-[#FFE6D5] bg-white text-[#E07A00] hover:bg-[#FFF5EE] hover:text-[#FF9100] transition-all"
            title="Editor Area Lubang"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
          <button
            onClick={() => handleDelete(row.id, row.name)}
            disabled={loadingMap[row.id]}
            className="p-1.5 rounded-lg border border-red-100 bg-white text-red-600 hover:bg-red-50 transition-all disabled:opacity-50"
            title="Hapus Template"
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
        title="Daftar Template Desain"
        subtitle="Kelola desain template, media thumbnail, preview, dan berkas PNG master berlubang"
        action={
          <Link
            href="/admin/templates/create"
            className="flex items-center gap-2 bg-[#FF9100] hover:bg-[#E07A00] text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <Plus className="h-4.5 w-4.5" />
            Buat Template
          </Link>
        }
      />

      <DataTable
        columns={columns}
        data={templates}
        searchKey="name"
        searchPlaceholder="Cari template berdasarkan nama..."
      />
    </div>
  );
}

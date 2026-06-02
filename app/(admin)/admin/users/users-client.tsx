"use client";

import * as React from "react";
import { Edit, ToggleLeft, ToggleRight, X, Phone, Loader2, Trash2, Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, Column } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { toggleUserStatus, updateUser, deleteUserAction, createUserAction } from "./actions";

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
    style={{ width: "14px", height: "14px" }}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

interface Category {
  id: string;
  name: string;
}

interface UserProfile {
  id: string;
  nama_lengkap: string | null;
  nama_usaha: string | null;
  category_id: string | null;
  no_wa: string | null;
  instagram: string | null;
  alamat: string | null;
  logo_url: string | null;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  export_count?: number;
  categories: {
    name: string;
  } | null;
}

interface UsersClientProps {
  initialUsers: UserProfile[];
  categories: Category[];
}

function formatRelativeTime(dateStr: string | null) {
  if (!dateStr) return "Belum pernah online";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "Baru saja online";
  if (diffMin < 60) return `${diffMin} menit lalu`;

  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs} jam lalu`;

  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays} hari lalu`;
}

export function UsersClient({ initialUsers, categories }: UsersClientProps) {
  const [users, setUsers] = React.useState<UserProfile[]>(initialUsers);
  const [loadingMap, setLoadingMap] = React.useState<Record<string, boolean>>({});
  const [filterStatus, setFilterStatus] = React.useState<"all" | "active" | "suspended">("all");
  
  // Edit & Create Modal State
  const [editingUser, setEditingUser] = React.useState<UserProfile | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isPending, setIsPending] = React.useState(false);

  const handleDeleteUser = async (id: string, name: string) => {
    if (confirm(`PERINGATAN!\n\nApakah Anda yakin ingin MENGHAPUS PERMANEN akun UMKM "${name}"?\nTindakan ini tidak bisa dibatalkan!`)) {
      setLoadingMap((prev) => ({ ...prev, [id]: true }));
      const result = await deleteUserAction(id, name);
      if (result.success) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } else {
        alert("Gagal menghapus akun: " + result.error);
      }
      setLoadingMap((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setFormError(null);
    const formData = new FormData(e.currentTarget);
    const result = await createUserAction(null, formData);
    if (result.success) {
      window.location.reload(); // Quick refresh to get new data
    } else {
      setFormError(result.error);
      setIsPending(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean, name: string) => {
    const actionWord = currentStatus ? "menonaktifkan (suspend)" : "mengaktifkan kembali";
    if (confirm(`Apakah Anda yakin ingin ${actionWord} akun "${name}"?`)) {
      setLoadingMap((prev) => ({ ...prev, [id]: true }));
      const result = await toggleUserStatus(id, currentStatus);
      if (result.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, is_active: !currentStatus } : u))
        );
      } else {
        alert("Gagal mengubah status: " + result.error);
      }
      setLoadingMap((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleOpenEdit = (user: UserProfile) => {
    setEditingUser(user);
    setFormError(null);
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingUser) return;

    setIsPending(true);
    setFormError(null);

    const formData = new FormData(e.currentTarget);
    const result = await updateUser(editingUser.id, null, formData);

    if (result.success) {
      // Update local state
      const updatedCatId = formData.get("category_id") as string;
      const updatedCatName = categories.find((c) => c.id === updatedCatId)?.name || null;

      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                nama_lengkap: formData.get("nama_lengkap") as string,
                nama_usaha: formData.get("nama_usaha") as string,
                category_id: updatedCatId || null,
                no_wa: formData.get("no_wa") as string,
                instagram: formData.get("instagram") as string,
                alamat: formData.get("alamat") as string,
                categories: updatedCatName ? { name: updatedCatName } : null,
              }
            : u
        )
      );
      setEditingUser(null);
    } else {
      setFormError(result.error);
    }
    setIsPending(false);
  };

  // Filter Data
  const filteredUsers = React.useMemo(() => {
    if (filterStatus === "all") return users;
    if (filterStatus === "active") return users.filter((u) => u.is_active);
    return users.filter((u) => !u.is_active);
  }, [users, filterStatus]);

  const columns: Column<UserProfile>[] = [
    {
      header: "Logo",
      accessorKey: "logo_url",
      render: (row) => (
        <div className="w-10 h-10 rounded-lg bg-[#FFF0F7] border border-[#F7D6E6] flex items-center justify-center p-0.5 overflow-hidden shadow-xs shrink-0">
          {row.logo_url ? (
            <img
              src={row.logo_url}
              alt={row.nama_usaha || "Logo"}
              className="w-full h-full object-contain rounded"
            />
          ) : (
            <span className="text-xs font-extrabold text-[#8C4A6E]">
              {row.nama_usaha ? row.nama_usaha.slice(0, 2).toUpperCase() : "UM"}
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Nama Usaha",
      accessorKey: "nama_usaha",
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-[#3D1E30]">{row.nama_usaha || "Usaha Baru"}</span>
          <span className="text-[10px] text-slate-500 font-semibold">
            {row.categories?.name || "Kategori Belum Dipilih"}
          </span>
        </div>
      ),
    },
    {
      header: "Pemilik",
      accessorKey: "nama_lengkap",
      sortable: true,
      render: (row) => <span className="font-semibold text-[#8C4A6E]">{row.nama_lengkap || "-"}</span>,
    },
    {
      header: "WhatsApp",
      accessorKey: "no_wa",
      render: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
          <Phone className="h-3.5 w-3.5 text-[#C27BA0]" />
          <span>{row.no_wa || "-"}</span>
        </div>
      ),
    },
    {
      header: "Instagram",
      accessorKey: "instagram",
      render: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
          <InstagramIcon className="h-3.5 w-3.5 text-[#C27BA0]" />
          {row.instagram ? (
            <a
              href={`https://instagram.com/${row.instagram.replace("@", "")}`}
              target="_blank"
              rel="noreferrer"
              className="hover:underline text-[#C27BA0] font-bold"
            >
              @{row.instagram.replace("@", "")}
            </a>
          ) : (
            <span>-</span>
          )}
        </div>
      ),
    },
    {
      header: "Alamat Usaha",
      accessorKey: "alamat",
      render: (row) => (
        <span className="text-xs text-slate-600 line-clamp-2 max-w-[150px]" title={row.alamat || "-"}>
          {row.alamat || "-"}
        </span>
      ),
    },
    {
      header: "Online Terakhir",
      accessorKey: "last_login",
      sortable: true,
      render: (row) => (
        <span suppressHydrationWarning className="text-xs text-slate-400 font-medium font-sans">
          {formatRelativeTime(row.last_login)}
        </span>
      ),
    },
    {
      header: "Total Ekspor",
      accessorKey: "export_count",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1.5 justify-center w-8 h-8 rounded-full bg-[#FFF0F7] text-[#C27BA0] font-bold text-xs mx-auto">
          {row.export_count || 0}
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "is_active",
      sortable: true,
      render: (row) => <StatusBadge status={row.is_active ? "active" : "inactive"} />,
    },
    {
      header: "Aksi",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleToggleStatus(row.id, row.is_active, row.nama_usaha || "")}
            disabled={loadingMap[row.id]}
            className={`p-1.5 rounded-lg border transition-all ${
              row.is_active
                ? "border-[#F7D6E6] bg-white text-slate-400 hover:bg-slate-50"
                : "border-[#C27BA0] bg-[#FFF0F7] text-[#C27BA0] hover:bg-[#F7D6E6]"
            }`}
            title={row.is_active ? "Suspend Akun" : "Aktifkan Akun"}
          >
            {row.is_active ? (
              <ToggleRight className="h-4 w-4" />
            ) : (
              <ToggleLeft className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 rounded-lg border border-[#F7D6E6] bg-white text-[#8C4A6E] hover:bg-[#FFF0F7] transition-all"
            title="Edit Data UMKM"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteUser(row.id, row.nama_usaha || "")}
            disabled={loadingMap[row.id]}
            className="p-1.5 rounded-lg border border-red-100 bg-white text-red-500 hover:bg-red-50 transition-all"
            title="Hapus Akun Permanen"
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
        title="Daftar Mitra UMKM"
        subtitle="Manajemen akun UMKM terdaftar, pantau status keaktifan, dan lakukan edit detail profil usaha"
        action={
          <button
            onClick={() => {
              setIsCreateModalOpen(true);
              setFormError(null);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#C27BA0] text-white font-bold rounded-xl shadow-md hover:bg-[#8C4A6E] transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah UMKM</span>
          </button>
        }
      />

      <DataTable
        columns={columns}
        data={filteredUsers}
        searchKey="nama_usaha"
        searchPlaceholder="Cari berdasarkan nama usaha..."
        searchAction={
          <div className="flex items-center gap-2 border-b sm:border-b-0 border-[#F7D6E6] pb-1 sm:pb-0">
            {(["all", "active", "suspended"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 text-sm font-bold border-b-2 sm:border-b-0 sm:rounded-xl transition-all capitalize ${
                  filterStatus === status
                    ? "border-[#C27BA0] sm:border-none sm:bg-[#C27BA0] text-[#C27BA0] sm:text-white shadow-xs"
                    : "border-transparent text-[#8C4A6E]/70 hover:text-[#8C4A6E] hover:bg-[#FFF0F7]"
                }`}
              >
                {status === "all" ? "Semua" : status === "active" ? "Aktif" : "Suspended"}
              </button>
            ))}
          </div>
        }
      />

      {/* EDIT MODAL */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl border border-[#F7D6E6] shadow-2xl max-w-lg w-full flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-[#F7D6E6] bg-[#FFF0F7]/20">
              <h3 className="text-base font-bold text-[#3D1E30]">
                Edit Profil UMKM: {editingUser.nama_usaha}
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-[#8C4A6E] hover:text-[#C27BA0] p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
                  {formError}
                </div>
              )}

              {/* Nama Lengkap */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#8C4A6E] uppercase">Nama Pemilik</label>
                <input
                  type="text"
                  name="nama_lengkap"
                  required
                  defaultValue={editingUser.nama_lengkap || ""}
                  className="w-full px-3 py-2 text-sm border border-[#F7D6E6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C27BA0]"
                />
              </div>

              {/* Nama Usaha */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#8C4A6E] uppercase">Nama Usaha</label>
                <input
                  type="text"
                  name="nama_usaha"
                  required
                  defaultValue={editingUser.nama_usaha || ""}
                  className="w-full px-3 py-2 text-sm border border-[#F7D6E6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C27BA0]"
                />
              </div>

              {/* Kategori */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#8C4A6E] uppercase">Kategori Bisnis</label>
                <select
                  name="category_id"
                  defaultValue={editingUser.category_id || ""}
                  className="w-full px-3 py-2 text-sm border border-[#F7D6E6] bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C27BA0]"
                >
                  <option value="">-- Pilih Kategori --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* WhatsApp */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#8C4A6E] uppercase">No. WhatsApp</label>
                <input
                  type="text"
                  name="no_wa"
                  required
                  defaultValue={editingUser.no_wa || ""}
                  className="w-full px-3 py-2 text-sm border border-[#F7D6E6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C27BA0]"
                />
              </div>

              {/* Instagram */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#8C4A6E] uppercase">Username Instagram</label>
                <input
                  type="text"
                  name="instagram"
                  defaultValue={editingUser.instagram || ""}
                  placeholder="Contoh: kuliner.bunda"
                  className="w-full px-3 py-2 text-sm border border-[#F7D6E6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C27BA0]"
                />
              </div>

              {/* Alamat */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#8C4A6E] uppercase">Alamat Usaha</label>
                <textarea
                  name="alamat"
                  rows={2}
                  defaultValue={editingUser.alamat || ""}
                  className="w-full px-3 py-2 text-sm border border-[#F7D6E6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C27BA0] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F7D6E6]">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-xs font-bold border border-[#F7D6E6] bg-white rounded-xl text-[#8C4A6E] hover:bg-[#FFF0F7]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-[#C27BA0] text-white rounded-xl hover:bg-[#8C4A6E] disabled:opacity-50"
                >
                  {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* CREATE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl border border-[#F7D6E6] shadow-2xl max-w-lg w-full flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-[#F7D6E6] bg-[#FFF0F7]/20">
              <h3 className="text-base font-bold text-[#3D1E30]">Tambah Pengguna UMKM</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-[#8C4A6E] hover:text-[#C27BA0] p-1 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
                  {formError}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#8C4A6E] uppercase">Email Login</label>
                <input type="email" name="email" required placeholder="umkm@email.com" className="w-full px-3 py-2 text-sm border border-[#F7D6E6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C27BA0]" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#8C4A6E] uppercase">Password</label>
                <input type="text" name="password" required placeholder="Gunakan password kuat (min. 8 karakter, ada angka & simbol)" className="w-full px-3 py-2 text-sm border border-[#F7D6E6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C27BA0]" />
                <p className="text-[10px] text-slate-500 mt-1">Sistem hanya akan membuat akun kunci. UMKM yang bersangkutan akan diminta mengisi sisa profil secara mandiri ketika mereka pertama kali login.</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F7D6E6]">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 text-xs font-bold border border-[#F7D6E6] bg-white rounded-xl text-[#8C4A6E] hover:bg-[#FFF0F7]">
                  Batal
                </button>
                <button type="submit" disabled={isPending} className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-[#C27BA0] text-white rounded-xl hover:bg-[#8C4A6E] disabled:opacity-50">
                  {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
                  Buat Kunci Akses
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

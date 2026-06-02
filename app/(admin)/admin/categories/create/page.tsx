"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import Link from "next/link";
import {
  LayoutGrid,
  Smartphone,
  Monitor,
  Video,
  ShoppingBag,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { createCategory } from "../actions";

const ICONS = [
  { name: "LayoutGrid", label: "Grid Feed", icon: LayoutGrid },
  { name: "Smartphone", label: "Story/Reels", icon: Smartphone },
  { name: "Monitor", label: "Banner Web", icon: Monitor },
  { name: "Video", label: "Livestream", icon: Video },
  { name: "ShoppingBag", label: "Katalog Promo", icon: ShoppingBag },
];

export default function CreateCategoryPage() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [selectedIcon, setSelectedIcon] = React.useState(ICONS[0].name);
  const [isActive, setIsActive] = React.useState(true);

  // Auto-generate slug from name
  React.useEffect(() => {
    const generated = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // remove non-alphanumeric
      .replace(/\s+/g, "-") // replace spaces with hyphens
      .replace(/-+/g, "-"); // remove duplicate hyphens
    setSlug(generated);
  }, [name]);

  const [state, formAction, isPending] = useActionState(createCategory, null);

  React.useEffect(() => {
    if (state?.success) {
      router.push("/admin/categories");
    }
  }, [state, router]);

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans">
      <Link
        href="/admin/categories"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8C4A6E] hover:text-[#C27BA0] transition-colors uppercase tracking-wider"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Kembali ke Daftar Kategori
      </Link>

      <PageHeader
        title="Tambah Kategori"
        subtitle="Buat kategori baru untuk mengelompokkan template desain UMKM"
      />

      <form action={formAction} className="space-y-6">
        <div className="bg-white rounded-2xl border border-[#F7D6E6] p-6 shadow-sm space-y-6">
          {state?.error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded-xl">
              {state.error}
            </div>
          )}

          {/* Nama Kategori */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-xs font-semibold text-[#8C4A6E] tracking-wide uppercase">
              Nama Kategori
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Kuliner, Fashion"
              className="w-full px-4 py-2.5 text-sm border border-[#F7D6E6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C27BA0] focus:border-[#C27BA0] transition-colors placeholder-[#8C4A6E]/30 text-[#3D1E30]"
            />
          </div>

          {/* Slug Kategori */}
          <div className="space-y-1.5">
            <label htmlFor="slug" className="text-xs font-semibold text-[#8C4A6E] tracking-wide uppercase">
              Slug Kategori
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="contoh-slug-kategori"
              className="w-full px-4 py-2.5 text-sm border border-[#F7D6E6] bg-slate-50/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C27BA0] focus:border-[#C27BA0] transition-colors placeholder-[#8C4A6E]/30 text-[#3D1E30]"
            />
          </div>

          {/* Description removed */}

          {/* Icon Picker */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#8C4A6E] tracking-wide uppercase">
              Pilih Icon
            </label>
            <input type="hidden" name="icon_name" value={selectedIcon} />
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {ICONS.map((item) => {
                const IconComp = item.icon;
                const isSelected = selectedIcon === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setSelectedIcon(item.name)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                      isSelected
                        ? "border-[#C27BA0] bg-[#FFF0F7] text-[#C27BA0] scale-102 shadow-sm font-bold"
                        : "border-[#F7D6E6] bg-white text-[#8C4A6E] hover:border-[#C27BA0] hover:bg-[#FFF0F7]/10"
                    }`}
                  >
                    <IconComp className="h-6 w-6 mb-1.5" />
                    <span className="text-xs">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center justify-between p-4 border border-[#F7D6E6] bg-[#FFF0F7]/10 rounded-2xl">
            <div>
              <h4 className="text-sm font-bold text-[#3D1E30]">Aktifkan Kategori</h4>
              <p className="text-xs font-semibold text-[#8C4A6E] mt-0.5">
                Kategori yang aktif akan langsung muncul di halaman dropdown onboarding dan filter template UMKM.
              </p>
            </div>
            <div className="relative inline-flex items-center cursor-pointer">
              <input type="hidden" name="is_active" value={isActive ? "true" : "false"} />
              <input
                type="checkbox"
                id="is_active"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C27BA0]"></div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href="/admin/categories"
            className="px-5 py-2.5 text-sm font-bold border border-[#F7D6E6] bg-white rounded-xl text-[#8C4A6E] hover:bg-[#FFF0F7] transition-all"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-[#C27BA0] text-white rounded-xl hover:bg-[#8C4A6E] transition-all disabled:opacity-50"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Simpan Kategori
          </button>
        </div>
      </form>
    </div>
  );
}

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
} from "lucide-react";
import { updateCategory } from "../../actions";

const ICONS = [
  { name: "LayoutGrid", label: "Grid Feed", icon: LayoutGrid },
  { name: "Smartphone", label: "Story/Reels", icon: Smartphone },
  { name: "Monitor", label: "Banner Web", icon: Monitor },
  { name: "Video", label: "Livestream", icon: Video },
  { name: "ShoppingBag", label: "Katalog Promo", icon: ShoppingBag },
];

interface EditCategoryFormProps {
  category: {
    id: string;
    name: string;
    slug: string;
    icon_name: string;
    is_active: boolean;
  };
}

export function EditCategoryForm({ category }: EditCategoryFormProps) {
  const router = useRouter();
  const [name, setName] = React.useState(category.name || "");
  const [slug, setSlug] = React.useState(category.slug || "");
  const [selectedIcon, setSelectedIcon] = React.useState(category.icon_name || "Sparkles");
  const [isActive, setIsActive] = React.useState(category.is_active || false);

  // Bind the action to the ID
  const updateCategoryWithId = updateCategory.bind(null, category.id);
  const [state, formAction, isPending] = useActionState(updateCategoryWithId, null);

  React.useEffect(() => {
    if (state?.success) {
      router.push("/admin/categories");
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-6">
      <div className="bg-white rounded-2xl border border-[#FFE6D5] p-6 shadow-sm space-y-6">
        {state?.error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded-xl">
            {state.error}
          </div>
        )}

        {/* Nama Kategori */}
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-xs font-semibold text-[#E07A00] tracking-wide uppercase">
            Nama Kategori
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 text-sm border border-[#FFE6D5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF9100] focus:border-[#FF9100] transition-colors placeholder-[#E07A00]/30 text-[#3D1E30]"
          />
        </div>

        {/* Slug Kategori */}
        <div className="space-y-1.5">
          <label htmlFor="slug" className="text-xs font-semibold text-[#E07A00] tracking-wide uppercase">
            Slug Kategori
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-4 py-2.5 text-sm border border-[#FFE6D5] bg-slate-50/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF9100] focus:border-[#FF9100] transition-colors placeholder-[#E07A00]/30 text-[#3D1E30]"
          />
        </div>

        {/* Description removed */}

        {/* Icon Picker */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#E07A00] tracking-wide uppercase">
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
                      ? "border-[#FF9100] bg-[#FFF5EE] text-[#FF9100] scale-102 shadow-sm font-bold"
                      : "border-[#FFE6D5] bg-white text-[#E07A00] hover:border-[#FF9100] hover:bg-[#FFF5EE]/10"
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
        <div className="flex items-center justify-between p-4 border border-[#FFE6D5] bg-[#FFF5EE]/10 rounded-2xl">
          <div>
            <h4 className="text-sm font-bold text-[#3D1E30]">Aktifkan Kategori</h4>
            <p className="text-xs font-semibold text-[#E07A00] mt-0.5">
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
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF9100]"></div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3">
        <Link
          href="/admin/categories"
          className="px-5 py-2.5 text-sm font-bold border border-[#FFE6D5] bg-white rounded-xl text-[#E07A00] hover:bg-[#FFF5EE] transition-all"
        >
          Batal
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-[#FF9100] text-white rounded-xl hover:bg-[#E07A00] transition-all disabled:opacity-50"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Simpan Perubahan
        </button>
      </div>
    </form>
  );
}

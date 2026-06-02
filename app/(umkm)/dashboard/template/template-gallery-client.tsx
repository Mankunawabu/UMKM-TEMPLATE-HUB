"use client";

import * as React from "react";
import { Search, LayoutGrid, Smartphone, Camera, Monitor, Video, ShoppingBag, Sparkles, Palette, Filter, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { TemplateCard } from "@/components/umkm/template-card";

const categoryIconMap: Record<string, React.FC<{ className?: string }>> = {
  LayoutGrid, Smartphone, Camera, Monitor, Video, ShoppingBag, Sparkles,
};

function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = categoryIconMap[name] || LayoutGrid;
  return <Icon className={className} />;
}

interface Category {
  id: string;
  name: string;
  icon_name: string;
}

interface Template {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  categories: { id: string; name: string } | null;
}

interface TemplateGalleryClientProps {
  templates: Template[];
  categories: Category[];
  selectedCategory: string | null;
}

const gradients = [
  "from-[#F7D6E6] via-[#C27BA0]/45 to-[#FFF9FC]",
  "from-[#C27BA0]/20 to-[#8C4A6E]/40",
  "from-purple-100 to-pink-100",
  "from-rose-100 to-orange-50",
  "from-sky-100 to-blue-100",
  "from-emerald-100 to-teal-100",
];

export function TemplateGalleryClient({ templates, categories, selectedCategory }: TemplateGalleryClientProps) {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState<string | null>(selectedCategory);
  const [showFilter, setShowFilter] = React.useState(false);

  const filtered = React.useMemo(() => {
    return templates.filter((t) => {
      const matchCat = !activeCategory || t.categories?.id === activeCategory;
      const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [templates, search, activeCategory]);

  function handleCategoryClick(id: string | null) {
    setActiveCategory(id);
    const params = new URLSearchParams();
    if (id) params.set("kategori", id);
    router.push(`/dashboard/template${id ? `?kategori=${id}` : ""}`, { scroll: false });
  }

  const activeCategoryName = categories.find(c => c.id === activeCategory)?.name;

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#8C4A6E] font-heading">Galeri Template</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {filtered.length} template tersedia
            {activeCategoryName && <span className="ml-1 font-semibold text-[#C27BA0]">• {activeCategoryName}</span>}
          </p>
        </div>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="sm:hidden flex items-center gap-2 px-4 py-2 border border-[#F7D6E6] rounded-xl text-sm font-bold text-[#8C4A6E] bg-white"
        >
          <Filter className="w-4 h-4" />
          Filter
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilter ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C27BA0]" />
        <input
          type="text"
          placeholder="Cari template berdasarkan nama..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-10 py-3.5 bg-white border border-[#F7D6E6] rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C27BA0] focus:border-transparent transition-all shadow-sm"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className={`${showFilter ? "flex" : "hidden"} sm:flex flex-wrap gap-2`}>
        <button
          onClick={() => handleCategoryClick(null)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border transition-all ${
            !activeCategory
              ? "bg-[#C27BA0] text-white border-[#C27BA0] shadow-md shadow-[#C27BA0]/30"
              : "bg-white text-[#8C4A6E] border-[#F7D6E6] hover:border-[#C27BA0] hover:bg-[#FFF0F7]"
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          Semua
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border transition-all ${
              activeCategory === cat.id
                ? "bg-[#C27BA0] text-white border-[#C27BA0] shadow-md shadow-[#C27BA0]/30"
                : "bg-white text-[#8C4A6E] border-[#F7D6E6] hover:border-[#C27BA0] hover:bg-[#FFF0F7]"
            }`}
          >
            <CategoryIcon name={cat.icon_name} className="w-3.5 h-3.5" />
            {cat.name}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((tpl, idx) => (
            <TemplateCard key={tpl.id} tpl={tpl} gradient={gradients[idx % gradients.length]} />
          ))}
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-[#FFF0F7] flex items-center justify-center">
            <Palette className="w-9 h-9 text-[#F7D6E6]" />
          </div>
          <div>
            <p className="font-bold text-[#8C4A6E] text-lg">Tidak ada template ditemukan</p>
            <p className="text-sm text-slate-400 mt-1">
              {search ? `Coba kata kunci lain atau` : "Belum ada template di kategori ini,"}{" "}
              <button onClick={() => { setSearch(""); setActiveCategory(null); }} className="text-[#C27BA0] hover:underline font-bold">
                lihat semua template
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

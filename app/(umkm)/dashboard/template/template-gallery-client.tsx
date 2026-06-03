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
  target_platform: string | null;
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

  const PLATFORMS = [
    { id: "INSTAGRAM_FEED", label: "Instagram Feed" },
    { id: "INSTAGRAM_STORY", label: "Instagram Story" },
    { id: "FACEBOOK_POST", label: "Facebook Post" },
    { id: "TIKTOK_POST", label: "TikTok Post" },
    { id: "WHATSAPP_STATUS", label: "WhatsApp Status" },
    { id: "MARKETPLACE_BANNER", label: "Marketplace Banner" },
  ];

  // Helper to get categories that have templates under a specific platform
  const getCategoriesForPlatform = React.useCallback((platformId: string) => {
    // Normalize target_platform from DB (e.g. 'INSTAGRAM' vs 'INSTAGRAM_FEED')
    // We will do a loose match or exact match depending on data. 
    // Usually it's stored exact or as simple string.
    const tpls = templates.filter(t => {
      if (!t.target_platform) return false;
      const dbPlat = t.target_platform.toUpperCase().replace(/\s+/g, '_');
      const targetPlat = platformId.toUpperCase().replace(/\s+/g, '_');
      return dbPlat === targetPlat || dbPlat.includes(targetPlat) || targetPlat.includes(dbPlat);
    });

    const uniqueCats = new Map<string, Category>();
    tpls.forEach(t => {
      if (t.categories) {
        const cat = categories.find(c => c.id === t.categories!.id);
        if (cat) uniqueCats.set(cat.id, cat);
      }
    });
    return Array.from(uniqueCats.values());
  }, [templates, categories]);

  // Derived state
  const [search, setSearch] = React.useState("");
  const [activePlatform, setActivePlatform] = React.useState<string | null>(null);
  const [activeCategory, setActiveCategory] = React.useState<string | null>(selectedCategory);
  const [showMobileFilter, setShowMobileFilter] = React.useState(false);

  const filtered = React.useMemo(() => {
    return templates.filter((t) => {
      const dbPlat = t.target_platform ? t.target_platform.toUpperCase().replace(/\s+/g, '_') : "";
      const targetPlat = activePlatform ? activePlatform.toUpperCase().replace(/\s+/g, '_') : "";
      
      const matchPlatform = !activePlatform || dbPlat === targetPlat || dbPlat.includes(targetPlat) || targetPlat.includes(dbPlat);
      const matchCat = !activeCategory || t.categories?.id === activeCategory;
      const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase());
      
      return matchPlatform && matchCat && matchSearch;
    });
  }, [templates, search, activeCategory, activePlatform]);

  function handlePlatformClick(id: string | null) {
    setActivePlatform(id);
    setActiveCategory(null); // Reset category when platform changes
    
    // Update URL minimally
    const params = new URLSearchParams();
    router.push(`/dashboard/template`, { scroll: false }); // Reset URL params for clean slate
  }

  function handleCategoryClick(platId: string, catId: string) {
    setActivePlatform(platId);
    setActiveCategory(catId);
    router.push(`/dashboard/template?kategori=${catId}`, { scroll: false });
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#8C4A6E] font-heading">Galeri Template</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {filtered.length} template tersedia
            {activePlatform && <span className="ml-1 font-semibold text-[#C27BA0]">• {PLATFORMS.find(p => p.id === activePlatform)?.label}</span>}
            {activeCategory && <span className="ml-1 font-semibold text-[#8C4A6E]">• {categories.find(c => c.id === activeCategory)?.name}</span>}
          </p>
        </div>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setShowMobileFilter(!showMobileFilter)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 border border-[#F7D6E6] rounded-xl text-sm font-bold text-[#8C4A6E] bg-white"
        >
          <Filter className="w-4 h-4" />
          Filter
          <ChevronDown className={`w-4 h-4 transition-transform ${showMobileFilter ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Sidebar Filter (Tokopedia Style) */}
        <div className={`${showMobileFilter ? "block" : "hidden"} lg:block w-full lg:w-64 shrink-0 space-y-6`}>
          <div className="bg-white border border-[#F7D6E6] rounded-2xl p-5 shadow-sm sticky top-24">
            <h3 className="font-bold text-[#8C4A6E] mb-4 text-sm uppercase tracking-wider border-b border-[#F7D6E6] pb-2">
              Filter Template
            </h3>

            <div className="space-y-1">
              {/* Semua Option */}
              <button
                onClick={() => handlePlatformClick(null)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activePlatform === null && activeCategory === null
                    ? "bg-[#FFF0F7] text-[#C27BA0]"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span>Semua Template</span>
              </button>

              {/* Platform Accordions */}
              {PLATFORMS.map((plat) => {
                const isPlatformActive = activePlatform === plat.id;
                const platformCats = getCategoriesForPlatform(plat.id);
                
                // Show platform option
                return (
                  <div key={plat.id} className="pt-1">
                    <button
                      onClick={() => handlePlatformClick(plat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        isPlatformActive
                          ? "bg-[#FFF0F7] text-[#C27BA0]"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>{plat.label}</span>
                      {platformCats.length > 0 && (
                        <ChevronDown className={`w-4 h-4 transition-transform ${isPlatformActive ? "rotate-180 text-[#C27BA0]" : "text-slate-400"}`} />
                      )}
                    </button>

                    {/* Sub-categories for this platform */}
                    {isPlatformActive && platformCats.length > 0 && (
                      <div className="pl-4 pr-2 mt-1 space-y-1 border-l-2 border-[#F7D6E6] ml-3 mb-2 animate-in slide-in-from-top-2">
                        {platformCats.map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => handleCategoryClick(plat.id, cat.id)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                              activeCategory === cat.id
                                ? "bg-[#C27BA0] text-white shadow-sm"
                                : "text-slate-500 hover:text-[#8C4A6E] hover:bg-slate-50"
                            }`}
                          >
                            <CategoryIcon name={cat.icon_name} className="w-3.5 h-3.5" />
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* Empty state if no categories exist for this platform */}
                    {isPlatformActive && platformCats.length === 0 && (
                      <div className="pl-6 pr-2 py-2 mt-1 mb-2 text-[10px] text-slate-400 font-medium">
                        Belum ada kategori untuk platform ini.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 min-w-0 space-y-6">
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

          {/* Template Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
              {filtered.map((tpl, idx) => (
                <TemplateCard key={tpl.id} tpl={tpl} gradient={gradients[idx % gradients.length]} />
              ))}
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 bg-white border border-dashed border-[#F7D6E6] rounded-2xl">
              <div className="w-20 h-20 rounded-full bg-[#FFF0F7] flex items-center justify-center">
                <Palette className="w-9 h-9 text-[#F7D6E6]" />
              </div>
              <div>
                <p className="font-bold text-[#8C4A6E] text-lg">Tidak ada template ditemukan</p>
                <p className="text-sm text-slate-400 mt-1">
                  {search ? `Coba kata kunci lain atau` : "Belum ada template di filter ini,"}{" "}
                  <button onClick={() => { setSearch(""); setActiveCategory(null); setActivePlatform(null); }} className="text-[#C27BA0] hover:underline font-bold">
                    lihat semua template
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

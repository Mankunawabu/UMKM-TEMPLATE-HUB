import { requireAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Plus, Clock, Palette, LayoutGrid, Monitor, Video, ShoppingBag, Camera, Sparkles, Smartphone } from "lucide-react";
import Link from "next/link";
import { TemplateCard } from "@/components/umkm/template-card";

// Map icon names to lucide icons
const categoryIconMap: Record<string, React.FC<{ className?: string }>> = {
  LayoutGrid,
  Smartphone,
  Camera,
  Monitor,
  Video,
  ShoppingBag,
  Sparkles,
};

function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = categoryIconMap[name] || LayoutGrid;
  return <Icon className={className} />;
}

export default async function DashboardPage() {
  const { profile } = await requireAuth();
  const supabase = await createClient();

  // Fetch real data in parallel
  const [
    { data: categories, error: catError },
    { data: popularTemplates, error: popError },
    { data: recentExports, error: expError },
    { count: totalTemplates, error: countError },
  ] = await Promise.all([
    // All active categories
    supabase
      .from("categories")
      .select("id, name, icon_name, is_active")
      .eq("is_active", true)
      .order("name"),

    // Latest 3 published templates
    supabase
      .from("templates")
      .select("id, name:nama_template, slug, description, thumbnail_url, target_platform, categories(name)")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(3),

    // Recent export logs for this user
    supabase
      .from("export_logs")
      .select("id, created_at, template_id, exported_image_url, templates(name:nama_template, thumbnail_url)")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(5),

    // Total published templates count
    supabase
      .from("templates")
      .select("*", { count: "exact", head: true })
      .eq("status", "published"),
  ]);

  if (popError) console.error("POPULAR TEMPLATES ERROR:", popError);
  if (catError) console.error("CATEGORIES ERROR:", catError);
  if (expError) console.error("EXPORTS ERROR:", expError);
  if (countError) console.error("COUNT ERROR:", countError);

  // Category gradient colors (cycling)
  const catColors = [
    "bg-[#FFF9FC] text-[#8C4A6E] border-[#F7D6E6]",
    "bg-[#F7D6E6]/40 text-[#8C4A6E] border-[#F7D6E6]",
    "bg-[#C27BA0]/10 text-[#8C4A6E] border-[#C27BA0]/30",
    "bg-purple-50 text-purple-700 border-purple-100",
    "bg-rose-50 text-rose-700 border-rose-100",
  ];

  // Template card gradients (cycling)
  const tplGradients = [
    "from-[#F7D6E6] via-[#C27BA0]/45 to-[#FFF9FC]",
    "from-[#C27BA0]/20 to-[#8C4A6E]/40",
    "from-[#FFF9FC] to-[#F7D6E6]",
    "from-purple-100 to-pink-100",
    "from-rose-100 to-orange-50",
  ];

  function formatRelativeTime(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} menit lalu`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} jam lalu`;
    const days = Math.floor(hrs / 24);
    return `${days} hari lalu`;
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-[#F7D6E6] shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold text-[#8C4A6E] font-heading">
            Halo, {profile?.nama_usaha || "Sobat UMKM"} 👋
          </h1>
          <p className="text-sm text-[#C27BA0] font-medium mt-1">
            Siap untuk membuat desain promosi yang estetik hari ini?
          </p>
        </div>
        <Link
          href="/dashboard/template"
          className="inline-flex items-center gap-2 px-5 py-3.5 bg-[#C27BA0] hover:bg-[#8C4A6E] text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg active:scale-95 shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>Buat Desain Baru</span>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Template Tersedia", value: totalTemplates ?? 0, icon: Palette, color: "text-[#C27BA0]", bg: "bg-[#FFF0F7]" },
          { label: "Kategori", value: categories?.length ?? 0, icon: LayoutGrid, color: "text-purple-500", bg: "bg-purple-50" },
          { label: "Total Ekspor", value: recentExports?.length ?? 0, icon: Clock, color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "Hari Ini", value: recentExports?.filter(e => new Date(e.created_at).toDateString() === new Date().toDateString()).length ?? 0, icon: Sparkles, color: "text-amber-500", bg: "bg-amber-50" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white border border-[#F7D6E6] rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#3D1E30]">{stat.value}</p>
                <p className="text-[10px] text-slate-500 font-medium">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-[#8C4A6E] font-heading">Kategori Template</h2>
          <Link
            href="/dashboard/template"
            className="text-xs font-bold text-[#C27BA0] hover:text-[#8C4A6E] hover:underline"
          >
            Lihat Semua
          </Link>
        </div>
        {categories && categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {categories.map((cat, idx) => (
              <Link
                key={cat.id}
                href={`/dashboard/template?kategori=${cat.id}`}
                className={`flex items-center justify-center gap-2.5 p-4 rounded-xl border text-sm font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-sm ${catColors[idx % catColors.length]}`}
              >
                <CategoryIcon name={cat.icon_name} className="w-5 h-5" />
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-white border border-dashed border-[#F7D6E6] rounded-2xl text-center text-slate-400 text-sm">
            Belum ada kategori. Admin sedang menyiapkan kategori untuk Anda!
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Popular Templates */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-[#8C4A6E] font-heading">Template Terbaru</h2>
            <Link
              href="/dashboard/template"
              className="text-xs font-bold text-[#C27BA0] hover:text-[#8C4A6E] hover:underline"
            >
              Lihat Semua
            </Link>
          </div>

          {popularTemplates && popularTemplates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {popularTemplates.map((tpl: any, idx: number) => (
                <TemplateCard key={tpl.id} tpl={tpl} gradient={tplGradients[idx % tplGradients.length]} />
              ))}
            </div>
          ) : (
            <div className="p-10 bg-white border border-dashed border-[#F7D6E6] rounded-2xl text-center space-y-3">
              <Palette className="w-10 h-10 text-[#F7D6E6] mx-auto" />
              <p className="text-slate-500 text-sm font-medium">Belum ada template yang dipublikasikan.</p>
              <p className="text-xs text-slate-400">Admin sedang menyiapkan template terbaik untuk Anda!</p>
            </div>
          )}
        </div>

        {/* Recent Export History */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-[#8C4A6E] font-heading">Riwayat Ekspor</h2>
            <Link
              href="/dashboard/riwayat-desain"
              className="text-xs font-bold text-[#C27BA0] hover:text-[#8C4A6E] hover:underline"
            >
              Lihat Semua
            </Link>
          </div>
          <div className="p-5 bg-white border border-[#F7D6E6] rounded-2xl shadow-sm space-y-3">
            {recentExports && recentExports.length > 0 ? (
              recentExports.map((log: any) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 border border-[#F7D6E6] rounded-xl hover:bg-[#FFF0F7]/10 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
                    <div className="w-10 h-10 rounded-lg bg-[#FFF0F7] border border-[#F7D6E6] flex items-center justify-center text-[#8C4A6E] shrink-0 overflow-hidden">
                      {log.exported_image_url || (log.templates as any)?.thumbnail_url ? (
                        <img src={log.exported_image_url || (log.templates as any)?.thumbnail_url} className="w-full h-full object-cover" alt="Export" />
                      ) : (
                        <Clock className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 leading-snug truncate">
                        {(log.templates as any)?.name || "Template"}
                      </p>
                      <p className="text-[10px] text-slate-500 font-semibold mt-0.5 truncate">
                        {new Date(log.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 font-sans">
                    {(() => {
                       const fileType = log.exported_image_url ? (log.exported_image_url.split('.').pop()?.split('?')[0].toUpperCase() || 'JPG') : 'JPG';
                       const formatColors: any = { PNG: "#C27BA0", JPG: "#8C4A6E", PDF: "#8C4A6E" };
                       const color = formatColors[fileType] || "#8C4A6E";
                       return (
                         <span
                           style={{ backgroundColor: color + "1A", color: color }}
                           className="px-2 py-0.5 rounded text-[9px] font-black border border-current"
                         >
                           {fileType}
                         </span>
                       );
                    })()}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 space-y-2">
                <Clock className="w-8 h-8 text-[#F7D6E6] mx-auto" />
                <p className="text-xs text-slate-400 font-medium">Belum ada riwayat ekspor.</p>
                <p className="text-[10px] text-slate-300">Mulai unduh desain pertama Anda!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

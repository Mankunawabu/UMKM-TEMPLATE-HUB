"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileCode,
  Users,
  Sparkles,
  Download,
  Clock,
  ChevronRight,
  TrendingUp,
  FileText,
  AlertCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  CartesianGrid,
} from "recharts";
import { StatusBadge } from "@/components/admin/status-badge";

interface StatItem {
  name: string;
  value: string;
  icon: any;
  color: string;
  link: string;
}

interface ActivityLog {
  id: string;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  metadata: any;
  severity: string;
  created_at: string;
  profiles: {
    nama_lengkap: string;
  } | null;
}

interface ExportItem {
  id: string;
  file_type: string;
  file_url: string;
  exported_image_url?: string;
  status: string;
  created_at: string;
  profiles: {
    nama_usaha: string;
  } | null;
  templates: {
    name: string;
  } | null;
}

interface DailyChartData {
  date: string;
  count: number;
}

interface FormatChartData {
  name: string;
  value: number;
}

interface DashboardClientProps {
  stats: StatItem[];
  recentActivities: ActivityLog[];
  recentExports: ExportItem[];
  dailyChartData: DailyChartData[];
  formatChartData: FormatChartData[];
}

function getActionLabel(action: string, metadata: any, actorName?: string) {
  const actor = actorName || "Sistem";
  const entityName = metadata?.name || metadata?.nama_usaha || metadata?.template_name || "";
  const vName = metadata?.version_name ? `v${metadata.version_name}` : "";

  switch (action) {
    case "category_created":
      return `${actor} membuat kategori baru "${entityName}"`;
    case "category_updated":
      return `${actor} memperbarui kategori "${entityName}"`;
    case "category_deleted":
      return `${actor} menghapus kategori "${entityName}"`;
    case "category_activated":
      return `${actor} mengaktifkan kategori "${entityName}"`;
    case "category_deactivated":
      return `${actor} menonaktifkan kategori "${entityName}"`;
    case "template_created":
      return `${actor} membuat template baru "${entityName}"`;
    case "template_updated":
      return `${actor} memperbarui template "${entityName}"`;
    case "template_deleted":
      return `${actor} menghapus template "${entityName}"`;
    case "template_published":
      return `${actor} mempublikasikan template "${entityName}"`;
    case "template_drafted":
      return `${actor} memindahkan template "${entityName}" ke draf`;
    case "version_created":
      return `${actor} merilis versi baru ${vName} untuk template "${entityName}"`;
    case "version_published":
      return `${actor} mengaktifkan versi ${vName} untuk template "${entityName}"`;
    case "version_deleted":
      return `${actor} menghapus versi ${vName} dari template "${entityName}"`;
    case "asset_uploaded":
      return `${actor} mengunggah aset master baru "${entityName}"`;
    case "asset_deleted":
      return `${actor} menghapus aset master "${entityName}"`;
    case "user_suspended":
      return `${actor} menangguhkan (suspend) akun UMKM "${entityName}"`;
    case "user_activated":
      return `${actor} mengaktifkan kembali akun UMKM "${entityName}"`;
    case "user_created":
      return `${actor} membuatkan akun akses (Kunci) untuk UMKM "${metadata?.email || entityName}"`;
    case "user_deleted":
      return `${actor} menghapus permanen akun UMKM "${entityName}"`;
    case "user_updated":
      return `${actor} memperbarui profil UMKM "${entityName}"`;
    case "settings_updated":
      return `${actor} memperbarui konfigurasi sistem (${metadata?.section || ""})`;
    case "export_completed":
      return `Desain berhasil diekspor oleh UMKM "${entityName}"`;
    case "export_failed":
      return `Gagal mengekspor desain oleh UMKM "${entityName}"`;
    default:
      return `${actor} melakukan aksi ${action}`;
  }
}

const SEVERITY_DOTS: Record<string, string> = {
  success: "bg-emerald-500 ring-emerald-100",
  info: "bg-indigo-500 ring-indigo-100",
  warning: "bg-amber-500 ring-amber-100",
  error: "bg-rose-500 ring-rose-100",
};

const FORMAT_COLORS = {
  PNG: "#C27BA0",
  JPG: "#A65D8A",
  PDF: "#8C4A6E",
};

const ICON_MAP = {
  template: FileCode,
  category: Sparkles,
  users: Users,
  download: Download,
};

export function DashboardClient({
  stats,
  recentActivities,
  recentExports,
  dailyChartData,
  formatChartData,
}: DashboardClientProps) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="space-y-8 font-sans">
      {/* STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = (ICON_MAP as any)[stat.icon] || FileCode;
          return (
            <Link
              href={stat.link}
              key={idx}
              className="p-6 bg-white border border-[#F7D6E6] rounded-2xl shadow-xs flex items-center justify-between transition-all hover:shadow-md hover:scale-102"
            >
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {stat.name}
                </p>
                <h3 className="text-3xl font-extrabold text-[#8C4A6E] tracking-tight">
                  {stat.value}
                </h3>
                <p className="text-[10px] text-slate-500 font-semibold flex items-center gap-0.5">
                  Klik untuk detail <ChevronRight className="h-3 w-3" />
                </p>
              </div>
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}
              >
                <Icon className="w-6 h-6" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* ANALYTICS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line/Area Chart 7 Days */}
        <div className="lg:col-span-2 min-w-0 p-6 bg-white border border-[#F7D6E6] rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#3D1E30]">Tren Ekspor Desain</h3>
              <p className="text-xs text-slate-500 font-semibold">Total unduhan/ekspor desain oleh UMKM 7 hari terakhir</p>
            </div>
            <span className="text-xs font-bold text-[#C27BA0] bg-[#FFF0F7] px-2.5 py-1 rounded-lg border border-[#F7D6E6]">
              7 Hari Terakhir
            </span>
          </div>

          <div className="h-64 w-full min-w-0">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorExports" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C27BA0" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#C27BA0" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F7D6E6" opacity={0.5} />
                  <XAxis dataKey="date" stroke="#8C4A6E" fontSize={10} fontWeight="semibold" />
                  <YAxis stroke="#8C4A6E" fontSize={10} fontWeight="semibold" allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderColor: "#F7D6E6",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    name="Ekspor"
                    stroke="#C27BA0"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorExports)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center bg-[#FFF0F7]/10 rounded-2xl">
                <span className="text-xs text-slate-400">Loading chart...</span>
              </div>
            )}
          </div>
        </div>

        {/* File Format Bar Chart */}
        <div className="p-6 bg-white border border-[#F7D6E6] rounded-2xl shadow-xs space-y-4 flex flex-col justify-between min-w-0">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#3D1E30]">Format File Terpopuler</h3>
            <p className="text-xs text-slate-500 font-semibold">Distribusi tipe file hasil ekspor desain</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center min-w-0">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formatChartData} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F7D6E6" opacity={0.3} vertical={false} />
                  <XAxis dataKey="name" stroke="#8C4A6E" fontSize={10} fontWeight="semibold" />
                  <YAxis stroke="#8C4A6E" fontSize={10} fontWeight="semibold" allowDecimals={false} />
                  <Tooltip
                    cursor={{ fill: "#FFF0F7", opacity: 0.3 }}
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderColor: "#F7D6E6",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  />
                  <Bar dataKey="value" name="Total">
                    {formatChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={(FORMAT_COLORS as any)[entry.name] || "#8C4A6E"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center bg-[#FFF0F7]/10 rounded-2xl">
                <span className="text-xs text-slate-400">Loading chart...</span>
              </div>
            )}
          </div>

          {/* Legends */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#F7D6E6]">
            {formatChartData.map((item) => (
              <div key={item.name} className="flex flex-col items-center text-center">
                <span
                  style={{ color: (FORMAT_COLORS as any)[item.name] || "#8C4A6E" }}
                  className="text-xs font-black"
                >
                  {item.name}
                </span>
                <span className="text-sm font-black text-slate-700 mt-0.5">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEEDS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Feed */}
        <div className="p-6 bg-white border border-[#F7D6E6] rounded-2xl shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#F7D6E6] pb-3">
            <h3 className="text-base font-bold text-[#3D1E30]">Aktivitas Terbaru</h3>
            <span className="text-xs font-bold text-[#8C4A6E] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Clock className="h-3 w-3" /> Real-time
            </span>
          </div>

          {recentActivities.length === 0 ? (
            <div className="text-center py-12 text-xs font-medium text-[#8C4A6E]">
              Belum ada log aktivitas tercatat.
            </div>
          ) : (
            <div className="max-h-[360px] overflow-y-auto pr-2 pl-4 py-2 -ml-4">
              <div className="relative border-l-2 border-slate-100 pl-6 space-y-6">
                {recentActivities.map((log) => (
                  <div key={log.id} className="relative group/feed">
                    {/* Indicator Dot */}
                    <span
                      className={`absolute left-[-31px] top-0.5 w-3 h-3 rounded-full ring-4 ${
                        SEVERITY_DOTS[log.severity] || "bg-slate-400 ring-slate-100"
                      }`}
                    />
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-800 leading-relaxed">
                      {getActionLabel(log.action, log.metadata, log.profiles?.nama_lengkap)}
                    </p>
                    <p className="text-[10px] font-semibold text-slate-400 font-sans">
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
              ))}
              </div>
            </div>
          )}
        </div>

        {/* Recent Exports */}
        <div className="p-6 bg-white border border-[#F7D6E6] rounded-2xl shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#F7D6E6] pb-3">
            <h3 className="text-base font-bold text-[#3D1E30]">Ekspor Desain Terbaru</h3>
            <span className="text-xs font-bold text-[#C27BA0] bg-[#FFF0F7] border border-[#F7D6E6] px-2 py-0.5 rounded-md flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> Live Feed
            </span>
          </div>

          {recentExports.length === 0 ? (
            <div className="text-center py-12 text-xs font-medium text-[#8C4A6E]">
              Belum ada data ekspor terekam.
            </div>
          ) : (
            <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-2">
              {recentExports.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 border border-[#F7D6E6] rounded-xl hover:bg-[#FFF0F7]/10 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
                    <div className="w-10 h-10 rounded-lg bg-[#FFF0F7] border border-[#F7D6E6] flex items-center justify-center text-[#8C4A6E] shrink-0 overflow-hidden">
                      {item.exported_image_url || (item.templates as any)?.thumbnail_url ? (
                        <img src={item.exported_image_url || (item.templates as any)?.thumbnail_url} className="w-full h-full object-cover" alt="Export" />
                      ) : (
                        <FileText className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 leading-snug truncate">
                        {item.templates?.name || "Desain Kustom"}
                      </p>
                      <p className="text-[10px] text-slate-500 font-semibold truncate">
                        UMKM: {item.profiles?.nama_usaha || "Tanpa Nama"}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 font-sans">
                    <span
                      style={{
                        backgroundColor: (FORMAT_COLORS as any)[item.file_type] + "1A",
                        color: (FORMAT_COLORS as any)[item.file_type] || "#8C4A6E",
                      }}
                      className="px-2 py-0.5 rounded text-[9px] font-black border border-current"
                    >
                      {item.file_type}
                    </span>
                    <span className="text-[9px] font-semibold text-slate-400">
                      {new Date(item.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

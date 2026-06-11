import * as React from "react";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardClient } from "./dashboard-client";

export default async function AdminDashboardPage() {
  // 1. Enforce admin auth
  await requireAdmin();

  const supabase = await createClient();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  // 2. Fetch real counts, logs, exports, and analytics data via Promise.all
  let templatesCount = 0;
  let categoriesCount = 0;
  let umkmCount = 0;
  let exportsCount = 0;
  let recentActivities: any[] = [];
  let recentExports: any[] = [];
  let analyticsData: any[] = [];

  try {
    const [
      templatesRes,
      categoriesRes,
      profilesRes,
      exportsRes,
      recentActivitiesRes,
      recentExportsListRes,
      recentExportsAnalyticsRes,
    ] = await Promise.all([
      supabase.from("templates").select("*", { count: "exact", head: true }),
      supabase.from("categories").select("*", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "umkm"),
      supabase.from("export_logs").select("*", { count: "exact", head: true }),
      supabase
        .from("activity_logs")
        .select(`
          *,
          profiles (
            nama_lengkap
          )
        `)
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("export_logs")
        .select(`
          *,
          profiles (
            nama_usaha
          ),
          templates (
            nama_template,
            thumbnail_url
          )
        `)
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("export_logs")
        .select("created_at, file_type")
        .gte("created_at", thirtyDaysAgo.toISOString()),
    ]);

    templatesCount = templatesRes.count || 0;
    categoriesCount = categoriesRes.count || 0;
    umkmCount = profilesRes.count || 0;
    exportsCount = exportsRes.count || 0;
    recentActivities = recentActivitiesRes.data || [];
    recentExports = (recentExportsListRes.data || []).map((item: any) => ({
      ...item,
      templates: item.templates ? { name: item.templates.nama_template } : null
    }));
    analyticsData = recentExportsAnalyticsRes.data || [];
  } catch (err) {
    console.error("Error loading dashboard metrics:", err);
  }

  // 3. Compute analytics
  const exportsToday = analyticsData.filter((e) => new Date(e.created_at) >= today).length;
  const exportsWeek = analyticsData.filter((e) => new Date(e.created_at) >= sevenDaysAgo).length;
  const exportsMonth = analyticsData.length;

  // Group by date for the last 7 days
  const dailyMap: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    dailyMap[label] = 0;
  }

  analyticsData.forEach((exp) => {
    const label = new Date(exp.created_at).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
    if (dailyMap[label] !== undefined) {
      dailyMap[label]++;
    }
  });

  const dailyChartData = Object.entries(dailyMap).map(([date, count]) => ({
    date,
    count,
  }));


  // 4. Map stats items
  const stats = [
    {
      name: "Total Template",
      value: templatesCount.toLocaleString("id-ID"),
      icon: "template",
      color: "bg-[#FFFFFF] text-[#E07A00]",
      link: "/admin/templates",
    },
    {
      name: "Total Kategori",
      value: categoriesCount.toLocaleString("id-ID"),
      icon: "category",
      color: "bg-[#FFE6D5]/40 text-[#E07A00]",
      link: "/admin/categories",
    },
    {
      name: "Total Mitra UMKM",
      value: umkmCount.toLocaleString("id-ID"),
      icon: "users",
      color: "bg-emerald-50 text-emerald-700",
      link: "/admin/users",
    },
    {
      name: "Total Export Desain",
      value: exportsCount.toLocaleString("id-ID"),
      icon: "download",
      color: "bg-indigo-50 text-indigo-700",
      link: "/admin", // stays on dashboard since it's the command center
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#3D1E30] tracking-tight">
          Admin Command Center
        </h1>
        <p className="text-sm text-[#E07A00] font-medium mt-1">
          Pantau kesehatan platform, volume ekspor desain, logs aktivitas terbaru, dan pendaftaran UMKM di satu halaman dashboard terpadu.
        </p>
      </div>

      {/* Extra KPI banner for exports breakdown */}
      <div className="grid grid-cols-3 gap-4 bg-white border border-[#FFE6D5] p-4 rounded-2xl shadow-xs">
        <div className="text-center py-2 border-r border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Ekspor Hari Ini</p>
          <p className="text-lg font-extrabold text-[#E07A00] mt-1">{exportsToday}</p>
        </div>
        <div className="text-center py-2 border-r border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Ekspor Minggu Ini</p>
          <p className="text-lg font-extrabold text-[#E07A00] mt-1">{exportsWeek}</p>
        </div>
        <div className="text-center py-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Ekspor Bulan Ini</p>
          <p className="text-lg font-extrabold text-[#E07A00] mt-1">{exportsMonth}</p>
        </div>
      </div>

      <DashboardClient
        stats={stats}
        recentActivities={recentActivities}
        recentExports={recentExports}
        dailyChartData={dailyChartData}
      />
    </div>
  );
}

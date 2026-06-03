import { requireUmkm } from "@/lib/auth";
import UMKMSidebar from "@/components/sidebar/umkm-sidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  // Enforce UMKM auth and onboarding completion check
  const { profile } = await requireUmkm();

  // Check Maintenance Mode
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("app_settings")
    .select("setting_key, setting_value")
    .in("setting_key", ["maintenance", "limits"]);

  const maintenanceSettings = settings?.find(s => s.setting_key === "maintenance")?.setting_value;
  const limitsSettings = settings?.find(s => s.setting_key === "limits")?.setting_value;

  const isMaintenanceMode = maintenanceSettings?.is_maintenance_mode;

  if (isMaintenanceMode && profile.role !== "admin") {
    redirect("/maintenance");
  }

  // Count today's exports for this user
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const { count: exportsToday } = await supabase
    .from("export_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", profile.id)
    .gte("created_at", today.toISOString());

  const exportLimit = limitsSettings?.daily_export_limit || 5;
  const currentExports = exportsToday || 0;

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#FFF9FC]">
      {/* Sidebar navigation system */}
      <UMKMSidebar 
        profile={profile} 
        exportLimit={exportLimit} 
        currentExports={currentExports} 
      />

      {/* Content wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Offset for mobile toggle bar height */}
        <main className="flex-1 p-6 lg:p-10 pt-20 lg:pt-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

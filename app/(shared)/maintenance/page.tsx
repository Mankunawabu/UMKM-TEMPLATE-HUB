import { ShieldAlert, RefreshCcw } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function MaintenancePage() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("app_settings")
    .select("setting_value")
    .eq("setting_key", "maintenance")
    .single();

  const isMaintenanceMode = settings?.setting_value?.is_maintenance_mode;
  const maintenanceMessage = settings?.setting_value?.maintenance_message || "Sistem sedang dalam perbaikan rutin. Silakan kembali dalam beberapa jam.";

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
        <ShieldAlert className="h-10 w-10 text-rose-500" />
      </div>
      
      <h1 className="text-3xl font-extrabold text-slate-800 mb-4">Sistem Sedang Diperbaiki</h1>
      
      <p className="text-slate-600 max-w-md mx-auto mb-8 leading-relaxed">
        {maintenanceMessage}
      </p>

      {!isMaintenanceMode && (
        <a 
          href="/dashboard"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#FF9100] hover:bg-[#E07A00] text-white rounded-xl font-bold transition-all shadow-md shadow-[#111827]/20"
        >
          <RefreshCcw className="h-5 w-5" />
          Coba Akses Kembali
        </a>
      )}
    </div>
  );
}

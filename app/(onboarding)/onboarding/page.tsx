import { redirect } from "next/navigation";
import { getCurrentUser, getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import OnboardingForm from "@/components/auth/onboarding-form";
import { Palette } from "lucide-react";

export default async function OnboardingPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getCurrentProfile();

  // If already completed onboarding, go straight to dashboard
  if (profile?.is_onboarding_completed) {
    redirect("/dashboard");
  }

  // If Admin, redirect to admin area
  if (profile?.role === "admin") {
    redirect("/admin");
  }

  // Check Maintenance Mode and Limits
  const supabase = await createClient();
  const { data: allSettings } = await supabase
    .from("app_settings")
    .select("setting_key, setting_value")
    .in("setting_key", ["maintenance", "limits"]);

  const maintenanceSetting = allSettings?.find(s => s.setting_key === "maintenance")?.setting_value;
  const limitsSetting = allSettings?.find(s => s.setting_key === "limits")?.setting_value;

  if (maintenanceSetting?.is_maintenance_mode && profile?.role !== "admin") {
    redirect("/maintenance");
  }

  const maxUploadMb = limitsSetting?.max_upload_mb || 5;

  // Query database categories
  const { data: categories, error: catError } = await supabase
    .from("categories")
    .select("id, name")
    .order("name", { ascending: true });

  if (catError) {
    console.error("[Onboarding] Failed to load categories:", catError.message);
  } else {
    console.log("[Onboarding] Categories loaded:", categories?.length ?? 0, "rows");
  }

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#FFF9FC] p-6 relative overflow-hidden font-sans">
      {/* Soft Background Blurs */}
      <div className="absolute top-[-15%] left-[-15%] w-[50vw] h-[50vw] rounded-full bg-[#F7D6E6]/40 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-15%] w-[50vw] h-[50vw] rounded-full bg-[#C27BA0]/15 blur-[150px] pointer-events-none" />

      {/* Top logo */}
      <div className="mb-6 flex items-center gap-2 relative z-10 select-none">
        <div className="w-8 h-8 rounded-lg bg-[#C27BA0] flex items-center justify-center text-white">
          <Palette className="w-4 h-4" />
        </div>
        <span className="text-sm font-bold tracking-tight text-[#8C4A6E] font-heading">
          UMKM Template Hub
        </span>
      </div>

      <div className="w-full max-w-2xl relative z-10 flex justify-center">
        <OnboardingForm categories={categories} initialProfile={profile} maxUploadMb={maxUploadMb} />
      </div>
    </main>
  );
}

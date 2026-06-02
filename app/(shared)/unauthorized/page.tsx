import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { getCurrentProfile } from "@/lib/auth";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function UnauthorizedPage(props: { searchParams: Promise<{ reason?: string }> }) {
  const profile = await getCurrentProfile();
  const searchParams = await props.searchParams;
  const isSuspended = searchParams.reason === "suspended";

  let redirectUrl = "/login";
  let buttonText = "Kembali ke Halaman Masuk";

  if (profile) {
    if (profile.role === "admin") {
      redirectUrl = "/admin";
      buttonText = "Kembali ke Dashboard Admin";
    } else {
      redirectUrl = profile.is_onboarding_completed ? "/dashboard" : "/onboarding";
      buttonText = "Kembali ke Dashboard UMKM";
    }
  }

  // If suspended, override redirect back to login and force logout
  if (isSuspended) {
    redirectUrl = "/login";
    buttonText = "Keluar & Kembali ke Halaman Masuk";
  }

  async function forceLogout() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#FFF9FC] p-6 relative font-sans">
      {/* Background Blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#F7D6E6]/40 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#C27BA0]/15 blur-[100px] pointer-events-none" />

      {/* Card */}
      <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-md rounded-[24px] shadow-[0_8px_30px_rgb(194,123,160,0.12)] border border-[#F7D6E6] text-center relative z-10">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center text-red-600">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-bold text-[#8C4A6E] mb-2 font-heading">
          {isSuspended ? "Akun Ditangguhkan" : "Akses Ditolak"}
        </h1>

        <p className="text-sm text-slate-500 font-sans mb-6 leading-relaxed">
          {isSuspended 
            ? "Akun Anda saat ini ditangguhkan (suspend) oleh Administrator. Silakan hubungi admin untuk informasi lebih lanjut." 
            : "Anda tidak memiliki wewenang atau hak akses yang tepat untuk membuka halaman ini."}
        </p>

        {isSuspended ? (
          <form action={forceLogout} className="w-full">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-[#C27BA0] hover:bg-[#8C4A6E] text-white font-semibold rounded-xl text-sm transition-all shadow-md active:scale-[0.98]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{buttonText}</span>
            </button>
          </form>
        ) : (
          <Link
            href={redirectUrl}
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-[#C27BA0] hover:bg-[#8C4A6E] text-white font-semibold rounded-xl text-sm transition-all shadow-md active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{buttonText}</span>
          </Link>
        )}
      </div>
    </main>
  );
}

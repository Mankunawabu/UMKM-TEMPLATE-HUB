import LoginForm from "@/components/auth/login-form";
import { Sparkles, Heart, Palette } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full flex flex-col lg:flex-row bg-[#FFF9F5] relative overflow-hidden font-sans">
      {/* Soft Background Blur Circles */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#FFE6D5]/40 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#FF9100]/15 blur-[150px] pointer-events-none" />

      {/* Left Pane: Illustration & Branding Area */}
      <section className="flex w-full lg:w-1/2 flex-col justify-between p-8 pt-12 lg:p-16 relative z-10 select-none order-1">
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-8 lg:mb-0">
          <img
            src="/logo_umkm_P.png"
            alt="Logo Kancing"
            className="w-16 h-16 object-contain shrink-0"
          />
          <span className="text-2xl font-bold tracking-tight text-[#E07A00] font-heading">
            KANCING
          </span>
        </div>

        {/* Hero Section */}
        <div className="max-w-lg my-auto space-y-5 lg:space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFE6D5] text-[#E07A00] text-xs font-semibold tracking-wide shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Terinspirasi oleh IWAPI</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-extrabold text-[#E07A00] leading-[1.15] font-heading">
            Desain Instan untuk Usaha Hebatmu.
          </h1>

          <p className="text-base lg:text-lg text-[#FF9100]/90 leading-relaxed font-sans font-medium">
            Tingkatkan daya tarik produk Anda melalui ribuan template visual premium yang siap pakai. Praktis, cantik, dan langsung pakai.
          </p>

          {/* Premium Visual Cards (Canva/Pinterest Inspired) */}
          <div className="grid grid-cols-2 gap-4 pt-4 lg:pt-6">
            <div className="p-4 lg:p-5 bg-white/60 border border-[#FFE6D5] backdrop-blur-md rounded-2xl shadow-sm rotate-[-2deg] transition-all hover:rotate-0 duration-300">
              <div className="w-8 h-8 rounded-lg bg-[#FFE6D5] flex items-center justify-center mb-2 lg:mb-3">
                <Heart className="w-4 h-4 text-[#E07A00]" />
              </div>
              <h3 className="font-semibold text-xs lg:text-sm text-[#E07A00] mb-1 font-heading">
                Template Estetik
              </h3>
              <p className="text-[10px] lg:text-xs text-slate-500">
                Kuliner, Fashion, dan kosmetik siap pakai.
              </p>
            </div>

            <div className="p-4 lg:p-5 bg-white/60 border border-[#FFE6D5] backdrop-blur-md rounded-2xl shadow-sm rotate-[3deg] transition-all hover:rotate-0 duration-300 translate-y-3">
              <div className="w-8 h-8 rounded-lg bg-[#FF9100]/20 flex items-center justify-center mb-2 lg:mb-3">
                <Sparkles className="w-4 h-4 text-[#FF9100]" />
              </div>
              <h3 className="font-semibold text-xs lg:text-sm text-[#E07A00] mb-1 font-heading">
                Magic Auto Fill
              </h3>
              <p className="text-[10px] lg:text-xs text-slate-500">
                Nama & kontak usaha otomatis terisi ke desain.
              </p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-[10px] lg:text-xs text-[#FF9100] font-sans font-semibold mt-12 lg:mt-0">
          © 2026 KANCING. Dibuat dengan cinta untuk wirausaha wanita Indonesia.
        </div>
      </section>

      {/* Right Pane: Login Form Card */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10 order-2">
        <LoginForm />
      </section>
    </main>
  );
}

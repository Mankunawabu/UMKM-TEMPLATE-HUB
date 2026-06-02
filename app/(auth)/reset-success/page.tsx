import Link from "next/link";
import { Sparkles, Heart, Palette, CheckCircle2 } from "lucide-react";

export default function ResetSuccessPage() {
  return (
    <main className="min-h-screen w-full flex flex-col lg:flex-row bg-[#FFF9FC] relative overflow-hidden font-sans">
      {/* Soft Background Blur Circles */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#F7D6E6]/40 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#C27BA0]/15 blur-[150px] pointer-events-none" />

      {/* Left Pane: Illustration & Branding Area */}
      <section className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16 relative z-10 select-none">
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C27BA0] flex items-center justify-center text-white shadow-md shadow-[#C27BA0]/30 animate-pulse">
            <Palette className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#8C4A6E] font-heading">
            UMKM Template Hub
          </span>
        </div>

        {/* Hero Section */}
        <div className="max-w-lg my-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7D6E6] text-[#8C4A6E] text-xs font-semibold tracking-wide shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Terinspirasi oleh IWAPI</span>
          </div>

          <h1 className="text-5xl font-extrabold text-[#8C4A6E] leading-[1.15] font-heading">
            Desain Instan untuk Usaha Hebatmu.
          </h1>

          <p className="text-lg text-[#C27BA0]/90 leading-relaxed font-sans font-medium">
            Tingkatkan daya tarik produk Anda melalui ribuan template visual premium yang siap pakai. Praktis, cantik, dan langsung pakai.
          </p>

          {/* Premium Visual Cards */}
          <div className="grid grid-cols-2 gap-4 pt-6">
            <div className="p-5 bg-white/60 border border-[#F7D6E6] backdrop-blur-md rounded-2xl shadow-sm rotate-[-2deg] transition-all hover:rotate-0 duration-300">
              <div className="w-8 h-8 rounded-lg bg-[#F7D6E6] flex items-center justify-center mb-3">
                <Heart className="w-4 h-4 text-[#8C4A6E]" />
              </div>
              <h3 className="font-semibold text-sm text-[#8C4A6E] mb-1 font-heading">
                Template Estetik
              </h3>
              <p className="text-xs text-slate-500">
                Kuliner, Fashion, dan kosmetik siap pakai.
              </p>
            </div>

            <div className="p-5 bg-white/60 border border-[#F7D6E6] backdrop-blur-md rounded-2xl shadow-sm rotate-[3deg] transition-all hover:rotate-0 duration-300 translate-y-3">
              <div className="w-8 h-8 rounded-lg bg-[#C27BA0]/20 flex items-center justify-center mb-3">
                <Sparkles className="w-4 h-4 text-[#C27BA0]" />
              </div>
              <h3 className="font-semibold text-sm text-[#8C4A6E] mb-1 font-heading">
                Magic Auto Fill
              </h3>
              <p className="text-xs text-slate-500">
                Nama & kontak usaha otomatis terisi ke desain.
              </p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-xs text-[#C27BA0] font-sans font-semibold">
          © 2026 UMKM Template Hub. Dibuat dengan cinta untuk wirausaha wanita Indonesia.
        </div>
      </section>

      {/* Right Pane: Reset Success Card */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
        {/* Mobile Header */}
        <div className="absolute top-6 left-6 flex items-center gap-2 lg:hidden">
          <div className="w-8 h-8 rounded-lg bg-[#C27BA0] flex items-center justify-center text-white">
            <Palette className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold tracking-tight text-[#8C4A6E] font-heading">
            UMKM Hub
          </span>
        </div>

        <div className="w-full max-w-md p-8 bg-white/85 backdrop-blur-md rounded-[24px] shadow-[0_8px_30px_rgb(194,123,160,0.12)] border border-[#F7D6E6] text-center transition-all duration-300 hover:shadow-[0_8px_40px_rgb(194,123,160,0.18)]">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-[#8C4A6E] font-heading mb-3">
            Password Berhasil Diperbarui!
          </h2>
          <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">
            Kata sandi akun Anda telah diperbarui dengan sukses. Silakan kembali masuk menggunakan kata sandi yang baru.
          </p>

          <Link
            href="/login"
            className="w-full inline-flex items-center justify-center py-3.5 bg-[#C27BA0] hover:bg-[#8C4A6E] text-white font-semibold rounded-xl text-sm transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            Kembali ke Login
          </Link>
        </div>
      </section>
    </main>
  );
}

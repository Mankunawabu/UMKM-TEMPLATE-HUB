import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#FFFFFF] p-6 relative font-sans">
      {/* Background Blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#F1F5F9]/40 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#FF9100]/15 blur-[100px] pointer-events-none" />

      {/* Card */}
      <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-md rounded-[24px] shadow-[0_8px_30px_rgb(224,122,0,0.12)] border border-[#FFE6D5] text-center relative z-10">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#E07A00]/10 flex items-center justify-center text-slate-800">
          <FileQuestion className="w-8 h-8" />
        </div>

        <h1 className="text-[#E07A00]xl font-bold text-slate-800 mb-2 font-heading">
          Halaman Tidak Ditemukan
        </h1>

        <p className="text-sm text-slate-500 font-sans mb-6 leading-relaxed">
          Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-[#FF9100] hover:bg-[#E07A00] text-white font-semibold rounded-xl text-sm transition-all shadow-md active:scale-[0.98]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
    </main>
  );
}

import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#FFF9FC] p-6 relative font-sans">
      {/* Background Blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#F7D6E6]/40 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#C27BA0]/15 blur-[100px] pointer-events-none" />

      {/* Card */}
      <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-md rounded-[24px] shadow-[0_8px_30px_rgb(194,123,160,0.12)] border border-[#F7D6E6] text-center relative z-10">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#8C4A6E]/10 flex items-center justify-center text-[#8C4A6E]">
          <FileQuestion className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-bold text-[#8C4A6E] mb-2 font-heading">
          Halaman Tidak Ditemukan
        </h1>

        <p className="text-sm text-slate-500 font-sans mb-6 leading-relaxed">
          Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-[#C27BA0] hover:bg-[#8C4A6E] text-white font-semibold rounded-xl text-sm transition-all shadow-md active:scale-[0.98]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
    </main>
  );
}

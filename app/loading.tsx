import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#FFFFFF] text-[#E07A00] font-sans p-6">
      <Loader2 className="w-12 h-12 animate-spin text-[#E07A00] mb-4" />
      <p className="text-sm font-bold tracking-widest uppercase text-[#E07A00] animate-pulse">
        Memuat Halaman...
      </p>
    </div>
  );
}

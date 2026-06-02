import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#FFF9FC] text-[#8C4A6E] font-sans p-6">
      <Loader2 className="w-12 h-12 animate-spin text-[#C27BA0] mb-4" />
      <p className="text-sm font-bold tracking-widest uppercase text-[#C27BA0] animate-pulse">
        Memuat Halaman...
      </p>
    </div>
  );
}

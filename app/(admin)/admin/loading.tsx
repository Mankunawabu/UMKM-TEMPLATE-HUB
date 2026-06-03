import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-[#C27BA0]/20 rounded-full blur-xl animate-pulse" />
        <Loader2 className="w-10 h-10 text-[#C27BA0] animate-spin relative z-10" />
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500 animate-pulse">
        Menyiapkan data admin...
      </p>
    </div>
  );
}

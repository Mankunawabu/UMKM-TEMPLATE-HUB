import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="space-y-8 font-sans animate-in fade-in duration-500">
      {/* Welcome Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-[#F7D6E6] shadow-sm">
        <div className="space-y-2">
          <div className="h-7 w-64 bg-slate-200 animate-pulse rounded-md" />
          <div className="h-4 w-96 bg-slate-100 animate-pulse rounded-md" />
        </div>
        <div className="h-10 w-40 bg-[#FFF0F7] animate-pulse rounded-lg" />
      </div>

      {/* Stats Overview Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-[#F7D6E6] rounded-xl p-4 flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-slate-100 animate-pulse shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-7 w-12 bg-slate-200 animate-pulse rounded-md" />
              <div className="h-3 w-20 bg-slate-100 animate-pulse rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* Categories Skeleton */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-6 w-48 bg-slate-200 animate-pulse rounded-md" />
          <div className="h-4 w-20 bg-slate-100 animate-pulse rounded-md" />
        </div>
        <div className="flex gap-3 overflow-hidden">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="w-32 h-10 rounded-xl bg-white border border-[#F7D6E6] shrink-0 flex items-center justify-center p-2">
              <div className="w-4 h-4 rounded bg-slate-200 animate-pulse mr-2" />
              <div className="h-3 w-16 bg-slate-100 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Popular Templates Skeleton */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-6 w-40 bg-slate-200 animate-pulse rounded-md" />
            <div className="h-4 w-20 bg-slate-100 animate-pulse rounded-md" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-[#F7D6E6] rounded-2xl overflow-hidden bg-white flex flex-col">
                <div className="w-full aspect-square bg-slate-100 animate-pulse" />
                <div className="p-3.5 border-t border-[#F7D6E6] flex-1 flex flex-col gap-2">
                  <div className="h-4 w-32 bg-slate-200 animate-pulse rounded-md" />
                  <div className="h-3 w-24 bg-slate-100 animate-pulse rounded-md" />
                  <div className="h-8 w-full bg-[#FFF0F7] animate-pulse rounded-lg mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Export History Skeleton */}
        <div className="p-6 bg-white border border-[#F7D6E6] rounded-2xl shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#F7D6E6]">
            <div className="h-5 w-48 bg-slate-200 animate-pulse rounded-md" />
            <div className="h-4 w-16 bg-slate-100 animate-pulse rounded-md" />
          </div>
          <div className="space-y-3.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 border border-[#F7D6E6] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 animate-pulse" />
                  <div className="space-y-1.5">
                    <div className="h-4 w-24 bg-slate-200 animate-pulse rounded-md" />
                    <div className="h-3 w-16 bg-slate-100 animate-pulse rounded-md" />
                  </div>
                </div>
                <div className="h-4 w-8 bg-[#FFF0F7] animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

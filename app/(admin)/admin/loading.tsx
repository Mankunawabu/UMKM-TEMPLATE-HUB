import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="space-y-8 font-sans animate-in fade-in duration-500">
      {/* Stats Row Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 bg-white border border-[#FFE6D5] rounded-2xl shadow-xs flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-3 w-16 bg-slate-100 animate-pulse rounded-md" />
              <div className="h-8 w-24 bg-slate-200 animate-pulse rounded-md" />
              <div className="h-3 w-20 bg-slate-100 animate-pulse rounded-md" />
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-100 animate-pulse shrink-0" />
          </div>
        ))}
      </div>

      {/* Analytics Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart Skeleton */}
        <div className="lg:col-span-2 p-6 bg-white border border-[#FFE6D5] rounded-2xl shadow-xs space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1.5">
              <div className="h-5 w-40 bg-slate-200 animate-pulse rounded-md" />
              <div className="h-3 w-64 bg-slate-100 animate-pulse rounded-md" />
            </div>
            <div className="h-6 w-24 bg-[#FFF5EE] animate-pulse rounded-lg" />
          </div>
          <div className="h-64 w-full bg-slate-50/50 border border-slate-100 rounded-xl animate-pulse" />
        </div>

        {/* Bar Chart Skeleton */}
        <div className="p-6 bg-white border border-[#FFE6D5] rounded-2xl shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="h-5 w-40 bg-slate-200 animate-pulse rounded-md" />
            <div className="h-3 w-48 bg-slate-100 animate-pulse rounded-md" />
          </div>
          <div className="h-44 w-full bg-slate-50/50 border border-slate-100 rounded-xl animate-pulse" />
        </div>
      </div>

      {/* Activities & Exports Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Logs Skeleton */}
        <div className="lg:col-span-2 p-6 bg-white border border-[#FFE6D5] rounded-2xl shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#FFE6D5]">
            <div className="h-5 w-48 bg-slate-200 animate-pulse rounded-md" />
            <div className="h-5 w-24 bg-[#FFF5EE] animate-pulse rounded-md" />
          </div>
          <div className="space-y-6 relative">
            <div className="absolute top-0 bottom-0 left-[15px] w-px bg-slate-100" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 relative">
                <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse shrink-0 border-4 border-white" />
                <div className="flex-1 space-y-2 pt-1.5">
                  <div className="h-4 w-3/4 bg-slate-200 animate-pulse rounded-md" />
                  <div className="h-3 w-32 bg-slate-100 animate-pulse rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Exports Skeleton */}
        <div className="p-6 bg-white border border-[#FFE6D5] rounded-2xl shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#FFE6D5]">
            <div className="h-5 w-48 bg-slate-200 animate-pulse rounded-md" />
            <div className="h-5 w-24 bg-[#FFF5EE] animate-pulse rounded-md" />
          </div>
          <div className="space-y-3.5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 border border-[#FFE6D5] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 animate-pulse shrink-0" />
                  <div className="space-y-1.5">
                    <div className="h-4 w-28 bg-slate-200 animate-pulse rounded-md" />
                    <div className="h-3 w-16 bg-slate-100 animate-pulse rounded-md" />
                  </div>
                </div>
                <div className="h-4 w-12 bg-slate-100 animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilLoading() {
  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-500">
      {/* Page Header Skeleton */}
      <div className="space-y-2 mb-8">
        <div className="h-8 w-64 bg-slate-200 animate-pulse rounded-md" />
        <div className="h-4 w-96 max-w-full bg-slate-100 animate-pulse rounded-md" />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Tabs Skeleton */}
        <div className="w-full md:w-64 shrink-0 flex flex-row md:flex-col gap-1 border-b md:border-b-0 md:border-r border-[#FFE6D5] pb-2 md:pb-0 md:pr-4 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl transition-all ${
                i === 1 ? "bg-[#FF9100]" : "bg-white border border-transparent"
              }`}
            >
              <div className={`h-4.5 w-4.5 rounded ${i === 1 ? "bg-white/50" : "bg-slate-200"} animate-pulse`} />
              <div className={`h-4 w-28 rounded ${i === 1 ? "bg-white/80" : "bg-slate-100"} animate-pulse`} />
            </div>
          ))}
        </div>

        {/* Form Content Skeleton */}
        <div className="flex-1 bg-white rounded-2xl border border-[#FFE6D5] p-6 md:p-8 shadow-sm min-h-[400px]">
          <div className="space-y-6">
            {/* Logo Section Skeleton */}
            <div className="mb-6 space-y-2">
              <div className="h-3 w-24 bg-slate-200 animate-pulse rounded" />
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-[#FFE6D5] bg-slate-50 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-8 w-28 bg-slate-100 animate-pulse rounded-lg" />
                </div>
              </div>
            </div>

            {/* Grid Inputs Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-3 w-32 bg-slate-200 animate-pulse rounded" />
                  <div className="h-10 w-full bg-slate-50 border border-slate-100 animate-pulse rounded-xl" />
                </div>
              ))}
              <div className="md:col-span-2 space-y-1.5">
                <div className="h-3 w-32 bg-slate-200 animate-pulse rounded" />
                <div className="h-10 w-full bg-slate-50 border border-slate-100 animate-pulse rounded-xl" />
              </div>
            </div>

            {/* Submit Button Skeleton */}
            <div className="pt-4 border-t border-[#FFE6D5]">
              <div className="h-11 w-full sm:w-48 bg-slate-200 animate-pulse rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

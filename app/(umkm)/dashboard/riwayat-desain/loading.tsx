export default function RiwayatLoading() {
  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-500">
      {/* Header & Filters Skeleton */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search Bar Skeleton */}
        <div className="relative w-full lg:max-w-md">
          <div className="h-10 w-full bg-white border border-[#F7D6E6] rounded-xl animate-pulse" />
        </div>

        {/* Filter Pills Skeleton */}
        <div className="flex flex-wrap gap-2 justify-start lg:justify-end">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-9 w-24 bg-white border border-[#F7D6E6] rounded-full animate-pulse" />
          ))}
        </div>
      </div>

      {/* Grid Layout Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
          <div key={i} className="border border-[#F7D6E6] rounded-2xl overflow-hidden bg-white flex flex-col">
            {/* Thumbnail Box */}
            <div className="w-full aspect-square bg-slate-100 animate-pulse" />
            
            {/* Info Block */}
            <div className="p-3.5 border-t border-[#F7D6E6] flex-1 flex flex-col gap-2">
              <div className="h-4 w-3/4 bg-slate-200 animate-pulse rounded-md" />
              <div className="h-6 w-32 bg-slate-50 animate-pulse rounded-md mt-0.5" />
              
              <div className="mt-3.5 mt-auto">
                <div className="h-7 w-full bg-[#FFF0F7] animate-pulse rounded-lg border border-[#F7D6E6]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

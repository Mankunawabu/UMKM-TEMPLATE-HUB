export default function TemplateLoading() {
  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-md" />
          <div className="h-4 w-32 bg-slate-100 animate-pulse rounded-md" />
        </div>
      </div>

      {/* Search Bar Skeleton */}
      <div className="relative">
        <div className="h-14 w-full bg-white border border-[#FFE6D5] rounded-2xl animate-pulse" />
      </div>

      {/* Main Layout */}
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Sidebar Categories Skeleton */}
        <div className="w-full sm:w-64 shrink-0 space-y-2 hidden sm:block">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-11 w-full bg-white border border-[#FFE6D5] rounded-xl animate-pulse flex items-center px-4 gap-3">
               <div className="w-5 h-5 rounded bg-slate-100 shrink-0" />
               <div className="h-4 w-24 bg-slate-200 rounded" />
            </div>
          ))}
        </div>

        {/* Grid Templates Skeleton */}
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="border border-[#FFE6D5] rounded-2xl overflow-hidden bg-white flex flex-col">
                <div className="w-full aspect-[4/5] bg-slate-100 animate-pulse" />
                <div className="p-3.5 sm:p-4 border-t border-[#FFE6D5] flex-1 flex flex-col gap-2">
                  <div className="h-4 w-3/4 bg-slate-200 animate-pulse rounded-md" />
                  <div className="h-3 w-1/2 bg-slate-100 animate-pulse rounded-md" />
                  <div className="h-9 w-full bg-[#F3F4F6] animate-pulse rounded-lg mt-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

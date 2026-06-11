"use client";

import * as React from "react";
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T | string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchKey?: keyof T | string; // key to search against, if omitted searches all string values
  loading?: boolean;
  searchAction?: React.ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchPlaceholder = "Cari data...",
  searchKey,
  loading = false,
  searchAction,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortConfig, setSortConfig] = React.useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const itemsPerPage = 10;

  // Reset page when searching
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Handle sorting
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Filter data
  const filteredData = React.useMemo(() => {
    if (!searchTerm) return data;
    const lowerSearch = searchTerm.toLowerCase();

    return data.filter((item) => {
      if (searchKey) {
        const val = item[searchKey as string];
        return val ? String(val).toLowerCase().includes(lowerSearch) : false;
      }
      // search all fields
      return Object.values(item).some((val) =>
        val ? String(val).toLowerCase().includes(lowerSearch) : false
      );
    });
  }, [data, searchTerm, searchKey]);

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;

      if (aVal < bVal) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aVal > bVal) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage]);

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-md flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <Search className="h-4 w-4 text-[#E07A00]" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 text-sm border border-[#FFE6D5] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#FF9100] focus:border-[#FF9100] transition-colors placeholder-[#E07A00]/50 text-[#3D1E30]"
          />
        </div>
        
        {/* Extra Action (e.g., Filters) */}
        {searchAction && (
          <div className="w-full sm:w-auto shrink-0 overflow-x-auto pb-1 sm:pb-0">
            {searchAction}
          </div>
        )}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-[#FFE6D5] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#FFE6D5] bg-[#FFF5EE]">
                {columns.map((column, idx) => (
                  <th
                    key={idx}
                    className={`p-4 text-xs font-semibold uppercase tracking-wider text-[#E07A00] ${
                      column.sortable && column.accessorKey ? "cursor-pointer select-none hover:bg-[#FCDDEC]" : ""
                    }`}
                    onClick={() => {
                      if (column.sortable && column.accessorKey) {
                        handleSort(column.accessorKey as string);
                      }
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      {column.header}
                      {column.sortable && column.accessorKey && (
                        <ArrowUpDown className="h-3 w-3 opacity-60" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FFE6D5]">
              {loading ? (
                // Loading skeletons
                Array.from({ length: 5 }).map((_, rIdx) => (
                  <tr key={rIdx} className="animate-pulse">
                    {columns.map((_, cIdx) => (
                      <td key={cIdx} className="p-4">
                        <div className="h-4 bg-[#FFF5EE] rounded-md w-full"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="p-8 text-center text-sm font-medium text-[#E07A00]"
                  >
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, rIdx) => (
                  <tr
                    key={row.id || rIdx}
                    className="hover:bg-[#FFF5EE]/40 transition-colors"
                  >
                    {columns.map((column, cIdx) => (
                      <td key={cIdx} className="p-4 text-sm text-[#3D1E30] font-sans">
                        {column.render
                          ? column.render(row)
                          : column.accessorKey
                          ? row[column.accessorKey as string]
                          : null}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-[#FFE6D5] bg-[#FFF5EE]/20">
            <div className="text-xs font-medium text-[#E07A00]">
              Menampilkan {Math.min(filteredData.length, (currentPage - 1) * itemsPerPage + 1)} sampai{" "}
              {Math.min(filteredData.length, currentPage * itemsPerPage)} dari {filteredData.length} entri
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-[#FFE6D5] bg-white text-[#E07A00] hover:bg-[#FFF5EE] disabled:opacity-50 disabled:pointer-events-none transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 flex items-center justify-center text-xs font-semibold rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? "bg-[#FF9100] text-white"
                        : "border border-[#FFE6D5] bg-white text-[#E07A00] hover:bg-[#FFF5EE]"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-[#FFE6D5] bg-white text-[#E07A00] hover:bg-[#FFF5EE] disabled:opacity-50 disabled:pointer-events-none transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

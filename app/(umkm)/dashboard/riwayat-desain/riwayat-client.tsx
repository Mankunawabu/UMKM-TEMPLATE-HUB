"use client";

import * as React from "react";
import Link from "next/link";
import { Search, History, Download, ImageIcon, ArrowRight, LayoutDashboard, Palette, Eye, X, Trash2, Loader2, CheckSquare, Square } from "lucide-react";
import toast from "react-hot-toast";
import { deleteExportLog, deleteMultipleExportLogs } from "./actions";

interface Log {
  id: string;
  created_at: string;
  template_id: string;
  exported_image_url?: string;
  templates: {
    id: string;
    nama_template: string;
    slug: string;
    description: string | null;
    thumbnail_url: string | null;
    categories: { name: string } | null;
    target_platform: string | null;
  } | null;
}

interface RiwayatClientProps {
  logs: Log[];
}

const catColors = [
  "from-orange-100 to-[#FFF9F5]",
  "from-[#FFE6D5] to-[#FFF9F5]",
  "from-sky-100 to-indigo-100",
  "from-amber-100 to-orange-100",
  "from-emerald-100 to-teal-100"
];

export function RiwayatClient({ logs }: RiwayatClientProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeTime, setActiveTime] = React.useState("all");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [showPreview, setShowPreview] = React.useState<Log | null>(null);
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [isDeletingBulk, setIsDeletingBulk] = React.useState(false);
  const dateInputRef = React.useRef<HTMLInputElement>(null);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredLogs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredLogs.map(l => l.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Yakin ingin menghapus ${selectedIds.length} desain terpilih? File yang terhapus tidak dapat dikembalikan.`)) return;
    
    setIsDeletingBulk(true);
    const res = await deleteMultipleExportLogs(selectedIds);
    if (!res.success) {
      toast.error("Gagal menghapus: " + res.error);
    } else {
      setSelectedIds([]);
    }
    setIsDeletingBulk(false);
  };

  const handleDelete = async (e: React.MouseEvent, logId: string) => {
    e.stopPropagation();
    if (!window.confirm("Yakin ingin menghapus riwayat desain ini? File yang terhapus tidak dapat dikembalikan.")) return;
    
    setIsDeleting(logId);
    const res = await deleteExportLog(logId);
    if (!res.success) {
      toast.error("Gagal menghapus: " + res.error);
    }
    setIsDeleting(null);
  };

  const filteredLogs = React.useMemo(() => {
    let result = logs;

    // Filter Waktu
    if (activeTime !== "all") {
      const now = new Date();
      result = result.filter(log => {
        const logDate = new Date(log.created_at);
        if (activeTime === "today") {
          return logDate.toDateString() === now.toDateString();
        } else if (activeTime === "week") {
          const weekAgo = new Date();
          weekAgo.setDate(now.getDate() - 7);
          return logDate >= weekAgo;
        } else if (activeTime === "month") {
          const monthAgo = new Date();
          monthAgo.setDate(now.getDate() - 30);
          return logDate >= monthAgo;
        } else if (activeTime === "custom") {
          // startDate acts as a specific date filter
          if (startDate) {
            const selectedDate = new Date(startDate);
            return logDate.toDateString() === selectedDate.toDateString();
          }
        }
        return true;
      });
    }

    // Filter Pencarian
    if (searchTerm) {
      result = result.filter(log => {
        const templateName = log.templates?.nama_template?.toLowerCase() || "";
        return templateName.includes(searchTerm.toLowerCase());
      });
    }

    return result;
  }, [logs, searchTerm, activeTime, startDate, endDate]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1E293B]" />
          <input
            type="text"
            placeholder="Cari desain yang diekspor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-10 py-2.5 bg-white border border-[#FFE6D5] rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF9100] focus:border-transparent transition-all shadow-sm"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Time Filter Pills & Custom Date */}
        <div className="flex flex-wrap gap-2 justify-start lg:justify-end">
          {[
            { id: "all", label: "Semua Waktu" },
            { id: "today", label: "Hari Ini" },
            { id: "week", label: "7 Hari Terakhir" },
            { id: "month", label: "30 Hari Terakhir" },
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveTime(filter.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                activeTime === filter.id
                  ? "bg-[#FF9100] text-white border-[#FF9100] shadow-md shadow-[#FF9100]/30"
                  : "bg-white text-[#1E293B] border-[#FFE6D5] hover:border-[#FF9100] hover:bg-[#F3F4F6]"
              }`}
            >
              {filter.label}
            </button>
          ))}

          {/* Direct Custom Date Picker Pill */}
          <button 
            onClick={() => {
              if (dateInputRef.current) {
                try {
                  dateInputRef.current.showPicker();
                } catch (e) {
                  dateInputRef.current.focus();
                }
              }
            }}
            className={`relative flex items-center px-4 py-2 rounded-full text-xs font-bold border transition-all ${
            activeTime === "custom"
              ? "bg-[#FF9100] text-white border-[#FF9100] shadow-md shadow-[#FF9100]/30"
              : "bg-white text-[#1E293B] border-[#FFE6D5] hover:border-[#FF9100] hover:bg-[#F3F4F6]"
          }`}>
            <span>{activeTime === "custom" && startDate ? new Date(startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : "Pilih Tanggal"}</span>
            <input
              type="date"
              ref={dateInputRef}
              value={startDate}
              onChange={(e) => {
                if (e.target.value) {
                  setStartDate(e.target.value);
                  setActiveTime("custom");
                } else {
                  setActiveTime("all");
                }
              }}
              style={{ position: 'absolute', width: 0, height: 0, opacity: 0, pointerEvents: 'none' }}
              tabIndex={-1}
            />
          </button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between bg-[#F3F4F6] border border-[#FFE6D5] rounded-xl p-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-2 text-sm font-bold text-[#1E293B] hover:text-[#1E293B] transition-colors"
            >
              <CheckSquare className="w-4 h-4" />
              {selectedIds.length === filteredLogs.length ? "Batal Pilih Semua" : "Pilih Semua"}
            </button>
            <span className="text-sm text-slate-500 bg-white px-2 py-0.5 rounded-md border border-[#FFE6D5]">
              {selectedIds.length} dipilih
            </span>
          </div>
          <button
            onClick={handleBulkDelete}
            disabled={isDeletingBulk}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-lg transition-all shadow-sm disabled:opacity-50"
          >
            {isDeletingBulk ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Hapus Terpilih
          </button>
        </div>
      )}

      {filteredLogs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-[#FFE6D5] p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-[#F3F4F6] text-[#1E293B] rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-[#1E293B] mb-2 font-heading">
            {searchTerm ? "Desain Tidak Ditemukan" : "Belum Ada Riwayat Desain"}
          </h3>
          <p className="text-slate-500 max-w-md mx-auto mb-6">
            {searchTerm 
              ? "Coba cari dengan kata kunci lain."
              : "Anda belum pernah mengekspor desain apapun. Mulai buat desain promosi pertama Anda sekarang!"}
          </p>
          {!searchTerm && (
            <Link
              href="/dashboard/template"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF9100] text-white rounded-xl font-bold hover:bg-[#E07A00] transition-all"
            >
              Pilih Template <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredLogs.map((log, idx) => {
            const template = log.templates;
            const gradient = catColors[idx % catColors.length];
            const displayImage = log.exported_image_url || template?.thumbnail_url;
            
            return (
              <div key={log.id} className="group border border-[#FFE6D5] rounded-2xl overflow-hidden bg-white hover:shadow-lg hover:shadow-[#111827]/10 hover:-translate-y-1 transition-all duration-300 flex flex-col">
                {/* Template Thumbnail (Click to Preview) */}
                <div 
                  onClick={() => setShowPreview(log)}
                  className={`cursor-pointer w-full aspect-square flex items-center justify-center relative overflow-hidden bg-slate-50/50 ${displayImage ? "" : `bg-gradient-to-tr ${gradient}`}`}
                >
                  {displayImage ? (
                    <img
                      src={displayImage}
                      alt={template?.nama_template || "Template"}
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <>
                      <Palette className="w-8 h-8 text-[#1E293B]/40 group-hover:scale-110 transition-transform" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </>
                  )}
                  {/* Select Checkbox */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelect(log.id);
                    }}
                    className={`absolute top-2.5 left-2.5 z-30 p-1.5 rounded-md backdrop-blur-sm transition-all duration-300 ${
                      selectedIds.includes(log.id)
                        ? "bg-[#FF9100] text-white opacity-100"
                        : "bg-white/80 text-slate-400 hover:text-[#1E293B] opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {selectedIds.includes(log.id) ? (
                      <CheckSquare className="w-4 h-4" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </div>

                  {template?.categories?.name && (
                    <span className={`absolute bottom-2.5 left-2.5 text-[9px] font-bold bg-white/85 backdrop-blur-sm px-2 py-0.5 rounded-full text-[#1E293B] shadow-sm z-10 transition-opacity ${selectedIds.includes(log.id) ? "opacity-0 group-hover:opacity-100" : ""}`}>
                      {template.categories.name}
                    </span>
                  )}
                  
                  {/* Delete Button */}
                  <button
                    onClick={(e) => handleDelete(e, log.id)}
                    disabled={isDeleting === log.id}
                    className="absolute top-2.5 right-2.5 z-30 p-1.5 bg-white/80 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full shadow-sm backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 disabled:opacity-50"
                    title="Hapus riwayat"
                  >
                    {isDeleting === log.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-red-500" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* Hover overlay - PREVIEW */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-20">
                    <span className="text-white text-xs font-bold bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30 flex items-center gap-1.5">
                      <Eye className="w-4 h-4" />
                      Preview
                    </span>
                  </div>
                </div>

                {/* Info Block */}
                <div className="p-3.5 border-t border-[#FFE6D5] flex-1 flex flex-col bg-white">
                  <h4 className="text-xs font-bold text-[#1E293B] truncate">{template?.nama_template || "Dihapus"}</h4>
                  <div className="flex items-center gap-1 mt-1.5 mb-2 text-[9px] font-medium text-slate-500 bg-slate-50 border border-slate-100 rounded-md px-1.5 py-1 w-fit">
                    <Download className="w-3 h-3 shrink-0" />
                    <span className="truncate">{new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(log.created_at))}</span>
                  </div>
                  <div className="mt-3.5 mt-auto">
                    {template ? (
                      <Link 
                        href={`/dashboard/template/${template.id}?exportId=${log.id}`}
                        className="w-full inline-block text-center py-1.5 bg-[#F3F4F6] text-[#1E293B] hover:bg-[#FF9100] hover:text-white transition-colors text-[10px] font-bold rounded-lg border border-[#FFE6D5]"
                      >
                        Gunakan Lagi
                      </Link>
                    ) : (
                      <button disabled className="w-full text-center py-1.5 bg-slate-100 text-slate-400 text-[10px] font-bold rounded-lg border border-slate-200 cursor-not-allowed">
                        Tidak Tersedia
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── MODAL PREVIEW ── */}
      {showPreview && showPreview.templates && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowPreview(null)} />
          
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowPreview(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm hover:bg-[#F3F4F6] text-slate-500 hover:text-[#1E293B] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image */}
            <div className={`w-full md:w-1/2 aspect-square md:aspect-auto flex items-center justify-center relative bg-slate-100 ${showPreview.exported_image_url || showPreview.templates.thumbnail_url ? "" : "bg-gradient-to-tr from-[#FFE6D5] to-[#FFF9F5]"}`}>
              {showPreview.exported_image_url || showPreview.templates.thumbnail_url ? (
                <img
                  src={showPreview.exported_image_url || showPreview.templates.thumbnail_url || ""}
                  alt={showPreview.templates.nama_template}
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                <Palette className="w-16 h-16 text-[#1E293B]/30" />
              )}
            </div>

            {/* Modal Info */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col bg-white">
              <div className="mb-auto">
                {showPreview.templates.categories?.name && (
                  <span className="inline-block mb-3 text-[10px] font-bold bg-[#F3F4F6] px-2.5 py-1 rounded-md text-[#1E293B]">
                    {showPreview.templates.categories.name}
                  </span>
                )}
                <h2 className="text-2xl font-extrabold text-[#1E293B] font-heading leading-tight mb-3">
                  {showPreview.templates.nama_template}
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  {showPreview.templates.description || "Template premium ini siap digunakan untuk mendongkrak penjualan produk Anda. Mudah dikustomisasi dan diunduh."}
                </p>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-3 border-t border-[#FFE6D5]">
                    <span className="text-sm text-slate-500 font-medium">Tanggal Ekspor</span>
                    <span className="text-sm font-bold text-[#1E293B]">
                      {new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(showPreview.created_at))}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href={`/dashboard/template/${showPreview.templates.id}?exportId=${showPreview.id}`}
                className="mt-8 w-full block text-center px-6 py-3.5 bg-gradient-to-r from-[#FF9100] to-[#E07A00] text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:shadow-[#111827]/20 hover:scale-[1.02] transition-all"
              >
                Gunakan Template Lagi
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

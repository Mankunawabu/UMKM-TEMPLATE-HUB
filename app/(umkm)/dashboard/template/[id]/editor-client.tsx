"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Download, Layers, Type, Image as ImageIcon, Square, Palette, ZoomIn, ZoomOut, Upload, Grip, Undo, Redo, Loader2, Sparkles, X, Heart, MessageCircle, Send, Bookmark, Star, MapPin, MoreHorizontal, Share2, Battery, Wifi, SignalHigh, ShoppingCart, Search as SearchIcon, Menu } from "lucide-react";
import toast from "react-hot-toast";
import * as htmlToImage from "html-to-image";

interface TemplateField {
  id: string;
  shape_type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  placeholder_label: string;
  is_editable: boolean;
  field_role: string;
  render_mode: string;
  z_index: number;
  font_family?: string;
  font_size?: number;
  font_weight?: string;
  color?: string;
  text_align?: string;
  max_chars?: number;
  is_currency?: boolean;
}

interface EditorClientProps {
  template: any;
  fields: TemplateField[];
  userId: string;
  shopName?: string;
  shopLogo?: string;
  exportLimit?: number;
  currentExports?: number;
  maxUploadMb?: number;
}

interface FieldValue {
  text?: string;
  imageUrl?: string;
  imageScale: number;
  imageTranslateX: number;
  imageTranslateY: number;
  imageFilter?: string;
  fontSizeOverride?: number;
  fontFamilyOverride?: string;
  fontWeightOverride?: string;
  colorOverride?: string;
  textAlignOverride?: string;
}

import { logExportAction } from "../actions";
import { getExportLogData } from "./actions";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const DeviceMockup = ({ platform, imageUrl, shopName, shopLogo }: { platform: string | null, imageUrl: string, shopName?: string, shopLogo?: string }) => {
  const isMobileVideo = ["instagram_story", "tiktok_post", "whatsapp_status"].includes(platform || "");
  const isMarketplace = platform === "marketplace";
  const isFacebook = platform === "facebook_post";
  const displayName = shopName || "toko_umkm_hebat";

  const renderContent = () => {
    if (isMobileVideo) {
      return (
        <div className="relative w-full h-full bg-black text-white">
          <img src={imageUrl} alt="Preview" className="absolute inset-0 w-full h-full object-contain bg-black" />
          
          {platform === "tiktok_post" && (
            <div className="absolute right-3 bottom-16 flex flex-col gap-4 text-white drop-shadow-md items-center z-10">
              <div className="w-10 h-10 rounded-full bg-white p-0.5 overflow-hidden border-2 border-white mb-2 shadow-sm">
                {shopLogo ? <img src={shopLogo} className="w-full h-full object-cover rounded-full" /> : <div className="w-full h-full bg-slate-300 rounded-full" />}
              </div>
              <div className="flex flex-col items-center"><Heart className="w-6 h-6 fill-white text-white drop-shadow-md" /><span className="text-[10px] font-bold mt-1 drop-shadow-md">12K</span></div>
              <div className="flex flex-col items-center"><MessageCircle className="w-6 h-6 fill-white text-white drop-shadow-md" /><span className="text-[10px] font-bold mt-1 drop-shadow-md">134</span></div>
              <div className="flex flex-col items-center"><Bookmark className="w-6 h-6 fill-white text-white drop-shadow-md" /><span className="text-[10px] font-bold mt-1 drop-shadow-md">Simpan</span></div>
              <div className="flex flex-col items-center"><Share2 className="w-6 h-6 fill-white text-white drop-shadow-md" /><span className="text-[10px] font-bold mt-1 drop-shadow-md">Share</span></div>
              <div className="w-9 h-9 rounded-full bg-slate-800 border-[3px] border-slate-700 animate-[spin_4s_linear_infinite] mt-2 flex items-center justify-center overflow-hidden shadow-md">
                {shopLogo ? <img src={shopLogo} className="w-full h-full object-cover rounded-full opacity-80" /> : <div className="w-3 h-3 bg-slate-400 rounded-full" />}
              </div>
            </div>
          )}
          
          {(platform === "instagram_story" || platform === "whatsapp_status") && (
            <>
              {/* Progress bars removed due to overlap with phone status bar */}
              <div className="absolute top-6 left-3 flex items-center gap-2 z-10">
                <div className="w-8 h-8 rounded-full bg-white p-[1px] overflow-hidden shadow-sm">
                  {shopLogo ? <img src={shopLogo} className="w-full h-full object-cover rounded-full" /> : <div className="w-full h-full bg-slate-300 rounded-full" />}
                </div>
                <span className="text-xs font-bold text-white drop-shadow-md">{displayName}</span>
                <span className="text-[10px] text-white/80 drop-shadow-md">2j</span>
              </div>
              <div className="absolute bottom-6 inset-x-4 z-10 flex gap-3">
                <div className="flex-1 rounded-full border border-white/30 bg-black/20 text-white text-xs px-4 py-2.5 backdrop-blur-md font-medium">Kirim pesan...</div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-black/20 backdrop-blur-md border border-white/30"><Heart className="w-5 h-5 text-white drop-shadow-md" /></div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-black/20 backdrop-blur-md border border-white/30"><Send className="w-5 h-5 text-white ml-1 drop-shadow-md" /></div>
              </div>
            </>
          )}
        </div>
      );
    }

    if (isMarketplace) {
      return (
        <div className="relative w-full h-full bg-[#f5f5f5] flex flex-col">
          {/* Marketplace Header */}
          <div className="bg-white px-3 py-2 flex items-center gap-3 border-b border-slate-100 sticky top-0 z-10">
            <div className="flex-1 bg-slate-100 rounded-lg flex items-center px-3 py-1.5 gap-2">
              <SearchIcon className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-400">Cari di {displayName}</span>
            </div>
            <ShoppingCart className="w-5 h-5 text-slate-600 shrink-0" />
            <Menu className="w-5 h-5 text-slate-600 shrink-0" />
          </div>
          
          <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
            <div className="bg-white pb-3">
              <div className="w-full aspect-square bg-white flex items-center justify-center relative border-b border-slate-100">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-contain" />
                <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full">1/5</div>
              </div>
              <div className="px-4 py-3">
                <div className="text-red-500 font-extrabold text-xl mb-1">Rp 99.000</div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">Pilihan UMKM</span>
                  <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold border border-green-200">Bebas Ongkir</span>
                </div>
                <p className="text-sm text-slate-800 leading-tight mb-2">Produk Unggulan UMKM Lokal Berkualitas Tinggi dan Terjamin</p>
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex text-yellow-400">
                    <Star className="w-3.5 h-3.5 fill-yellow-400" /><Star className="w-3.5 h-3.5 fill-yellow-400" /><Star className="w-3.5 h-3.5 fill-yellow-400" /><Star className="w-3.5 h-3.5 fill-yellow-400" /><Star className="w-3.5 h-3.5 fill-yellow-400" />
                  </div>
                  <span className="text-slate-500">4.9 (450)</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500">Terjual 2rb+</span>
                </div>
              </div>
            </div>
            <div className="mt-2 bg-white p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-100">
                {shopLogo && <img src={shopLogo} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-800 flex items-center gap-1">
                  {displayName} <span className="bg-[#FFE6D5] text-[#E07A00] text-[8px] px-1 py-0.5 rounded font-bold">PRO</span>
                </div>
                <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" /> Kota Anda
                </div>
              </div>
              <button className="px-3 py-1.5 border border-green-500 text-green-600 text-xs font-bold rounded-lg">Follow</button>
            </div>
          </div>
          
          <div className="bg-white border-t border-slate-200 px-4 py-3 flex gap-3 sticky bottom-0">
            <button className="w-10 h-10 border border-slate-300 rounded-xl flex items-center justify-center text-slate-600 shrink-0"><MessageCircle className="w-5 h-5" /></button>
            <button className="flex-1 bg-white border border-green-500 text-green-600 font-bold rounded-xl text-sm">Beli</button>
            <button className="flex-1 bg-green-500 text-white font-bold rounded-xl text-sm">+ Keranjang</button>
          </div>
        </div>
      );
    }

    if (isFacebook) {
      return (
        <div className="relative w-full h-full bg-[#f0f2f5] flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden">
           <div className="bg-white mt-2 pb-3">
            <div className="px-3 py-3 flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                {shopLogo && <img src={shopLogo} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-[#1c1e21]">{displayName}</div>
                <div className="text-[10px] text-slate-500">2 jam yang lalu • 🌍</div>
              </div>
              <MoreHorizontal className="w-5 h-5 text-slate-500" />
            </div>
            <div className="px-3 pb-3 text-[13px] text-[#1c1e21]">
              Dapatkan produk unggulan dari toko kami hari ini! Promo spesial menanti Anda.
            </div>
            <div className="w-full bg-slate-100">
              <img src={imageUrl} alt="Preview" className="w-full object-contain max-h-[350px]" />
            </div>
            <div className="px-4 py-2 flex justify-between text-[11px] text-slate-500 border-b border-slate-200">
              <div className="flex items-center gap-1"><div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center"><Heart className="w-2.5 h-2.5 fill-white text-white" /></div> 124</div>
              <div>45 Komentar • 12 Kali Dibagikan</div>
            </div>
            <div className="px-2 pt-1 flex justify-between">
              <button className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-600 font-semibold text-xs hover:bg-slate-100 rounded-md transition-colors"><Heart className="w-4 h-4" /> Suka</button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-600 font-semibold text-xs hover:bg-slate-100 rounded-md transition-colors"><MessageCircle className="w-4 h-4" /> Komentar</button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-600 font-semibold text-xs hover:bg-slate-100 rounded-md transition-colors"><Share2 className="w-4 h-4" /> Bagikan</button>
            </div>
          </div>
        </div>
      );
    }

    // Default: Instagram Feed
    return (
      <div className="relative w-full h-full bg-white flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden">
        <div className="flex items-center gap-3 p-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-[#FF9100] to-[#E07A00] p-[2px] shrink-0">
            <div className="w-full h-full bg-white rounded-full border border-white overflow-hidden">
              {shopLogo ? <img src={shopLogo} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-200" />}
            </div>
          </div>
          <p className="text-sm font-bold text-slate-800 flex-1 truncate">{displayName}</p>
          <MoreHorizontal className="w-5 h-5 text-slate-800 shrink-0" />
        </div>
        <div className="w-full bg-slate-50 flex items-center justify-center overflow-hidden">
          <img src={imageUrl} alt="Preview" className="w-full object-contain max-h-[350px]" />
        </div>
        <div className="p-3 pb-6">
          <div className="flex items-center gap-4 mb-3 text-slate-800">
            <Heart className="w-6 h-6 hover:text-red-500 transition-colors cursor-pointer" />
            <MessageCircle className="w-6 h-6 cursor-pointer" />
            <Send className="w-6 h-6 cursor-pointer" />
            <Bookmark className="w-6 h-6 ml-auto cursor-pointer" />
          </div>
          <p className="text-xs font-bold text-slate-800 mb-1.5">1.240 suka</p>
          <p className="text-xs text-slate-800 leading-relaxed"><span className="font-bold mr-1.5">{displayName}</span>Dapatkan produk terbaru kami dengan harga spesial hari ini! Jangan sampai kehabisan. ✨ #UMKMHebat #ProdukLokal</p>
        </div>
      </div>
    );
  };

  return (
    <div className="relative shadow-2xl rounded-[2.5rem] border-[8px] border-slate-900 bg-slate-900 w-[300px] h-[600px] shrink-0 mx-auto transform transition-transform hover:scale-105 duration-300">
      {/* Side buttons */}
      <div className="absolute right-[-14px] top-24 w-1.5 h-12 bg-slate-800 rounded-r-md"></div>
      <div className="absolute right-[-14px] top-40 w-1.5 h-20 bg-slate-800 rounded-r-md"></div>
      
      {/* Screen Container */}
      <div className="relative w-full h-full bg-white rounded-[2rem] overflow-hidden flex flex-col">
        
        {/* Status Bar */}
        <div className={`absolute top-0 inset-x-0 h-8 flex justify-between items-center px-5 z-50 pointer-events-none transition-colors ${isMobileVideo ? "text-white" : "text-slate-800 bg-white/90 backdrop-blur-sm"}`}>
          <span className="text-[11px] font-bold tracking-wide">12:00</span>
          {/* Punch hole camera */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-slate-900 rounded-full shadow-[inset_0_1px_3px_rgba(0,0,0,1)]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-900/40 rounded-full blur-[0.5px]"></div>
          </div>
          <div className="flex items-center gap-1.5">
            <SignalHigh className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>
        
        {/* Screen Content Area */}
        <div className={`flex-1 w-full relative ${isMobileVideo ? "" : "pt-8"}`}>
          {renderContent()}
        </div>
        
        {/* Bottom Navigation Indicator */}
        <div className="absolute bottom-1 inset-x-0 h-1 bg-slate-400 mx-auto w-24 rounded-full z-50 opacity-50 mix-blend-difference"></div>
      </div>
    </div>
  );
};

export function EditorClient({ template, fields, userId, shopName, shopLogo, exportLimit = 5, currentExports = 0, maxUploadMb = 2 }: EditorClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const exportId = searchParams.get("exportId");

  const [values, setValues] = React.useState<Record<string, FieldValue>>(() => {
    const init: Record<string, FieldValue> = {};
    fields.forEach((f) => {
      init[f.id] = { text: "", imageScale: 1, imageTranslateX: 0, imageTranslateY: 0 };
    });
    return init;
  });

  const draftKey = `umkm_draft_${template.id}`;
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    if (exportId) {
      getExportLogData(exportId).then(data => {
        if (data && data.customization_data) {
          setValues(prev => ({ ...prev, ...data.customization_data }));
        }
      });
    } else {
      // Auto-Restore Draft from LocalStorage
      const savedDraftStr = localStorage.getItem(draftKey);
      if (savedDraftStr) {
        try {
          const savedDraft = JSON.parse(savedDraftStr);
          if (savedDraft && savedDraft.values) {
            setValues(prev => ({ ...prev, ...savedDraft.values }));
            toast.success("Draf lokal ditemukan dan dimuat otomatis. ✨");
          }
        } catch (err) {
          console.error("Failed to parse local draft", err);
        }
      }
    }
  }, [exportId, draftKey]);

  // Auto-Save to LocalStorage
  React.useEffect(() => {
    if (!isMounted) return;
    
    // To avoid saving empty/initial states as draft unnecessarily, 
    // we only save if there's an actual change. But since we merge, 
    // it's safe to just save the current values.
    const draftData = {
      templateId: template.id,
      templateName: template.nama_template,
      timestamp: Date.now(),
      thumbnail: template.thumbnail_url,
      values
    };
    localStorage.setItem(draftKey, JSON.stringify(draftData));
  }, [values, isMounted, draftKey, template.id, template.nama_template, template.thumbnail_url]);

  const [activeTab, setActiveTab] = React.useState<"design" | "text" | "upload" | "layers">("design");
  const [selectedField, setSelectedField] = React.useState<string | null>(null);
  const [activeFieldId, setActiveFieldId] = React.useState<string | null>(null);
  const [zoom, setZoom] = React.useState(100);
  const [isExporting, setIsExporting] = React.useState(false);
  const [naturalSize, setNaturalSize] = React.useState({ w: 1080, h: 1080 });
  
  const canvasRef = React.useRef<HTMLDivElement>(null);

  // --- UNDO / REDO STATE ---
  const [history, setHistory] = React.useState<Record<string, FieldValue>[]>([]);
  const [historyIndex, setHistoryIndex] = React.useState(-1);
  const skipHistoryRef = React.useRef(false);

  React.useEffect(() => {
    if (history.length === 0) {
      setHistory([values]);
      setHistoryIndex(0);
    }
  }, []); // Run once on mount

  React.useEffect(() => {
    if (skipHistoryRef.current) {
      skipHistoryRef.current = false;
      return;
    }
    
    const handler = setTimeout(() => {
      setHistory(prev => {
        const lastVal = prev[historyIndex];
        if (JSON.stringify(lastVal) === JSON.stringify(values)) return prev;
        
        const newHist = prev.slice(0, historyIndex + 1);
        newHist.push(values);
        if (newHist.length > 50) newHist.shift(); // Keep max 50 states
        
        setHistoryIndex(newHist.length - 1);
        return newHist;
      });
    }, 500);

    return () => clearTimeout(handler);
  }, [values, historyIndex]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      skipHistoryRef.current = true;
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setValues(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      skipHistoryRef.current = true;
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setValues(history[newIndex]);
    }
  };
  // -------------------------

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (e.currentTarget.naturalWidth > 0) {
      setNaturalSize({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight });
    }
  };

  // Sort fields by z-index for rendering
  const sortedFields = [...fields].sort((a, b) => a.z_index - b.z_index);

  // Group fields for sidebar
  const imageFields = fields.filter(f => f.field_role === "image");
  const textFields = fields.filter(f => f.field_role === "text" || f.field_role === "magic");

  const handleTextChange = (id: string, text: string, maxChars?: number) => {
    if (maxChars && text.length > maxChars) return;
    setValues(prev => ({ ...prev, [id]: { ...prev[id], text } }));
  };

  const handleFontSizeChange = (id: string, size: number) => {
    setValues(prev => ({ ...prev, [id]: { ...prev[id], fontSizeOverride: size } }));
  };

  const handleFieldOverrideChange = (id: string, key: keyof FieldValue, value: any) => {
    setValues(prev => ({ ...prev, [id]: { ...prev[id], [key]: value } }));
  };

  const handleImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > maxUploadMb * 1024 * 1024) {
      toast.error(`Ukuran gambar tidak boleh lebih dari ${maxUploadMb} MB`);
      return;
    }
    
    // Convert to base64 so it persists in the JSON draft
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      setValues(prev => ({ 
        ...prev, 
        [id]: { ...prev[id], imageUrl: base64Url, imageScale: 1, imageTranslateX: 0, imageTranslateY: 0 } 
      }));
    };
    reader.readAsDataURL(file);
  };

  const handlePanZoom = (id: string, scale: number, tx: number, ty: number) => {
    setValues(prev => ({
      ...prev,
      [id]: { ...prev[id], imageScale: scale, imageTranslateX: tx, imageTranslateY: ty }
    }));
  };

  const handleFilterChange = (id: string, filterStr: string) => {
    setValues(prev => ({
      ...prev,
      [id]: { ...prev[id], imageFilter: filterStr }
    }));
  };

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  React.useEffect(() => {
    if (window.innerWidth >= 1024) {
      setIsSidebarOpen(true);
    }
  }, []);

  const [isGeneratingText, setIsGeneratingText] = React.useState<string | null>(null);

  const handleMagicText = async (fieldId: string) => {
    const currentText = values[fieldId]?.text || "";
    const keyword = prompt("Masukkan kata kunci untuk Asisten Copywriting (misal: 'Keripik Pedas'):", currentText);
    
    if (!keyword) return;

    setIsGeneratingText(fieldId);
    try {
      const res = await fetch("/api/magic-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword })
      });
      
      const data = await res.json();
      if (res.ok && data.text) {
        setValues(prev => ({
          ...prev,
          [fieldId]: { ...prev[fieldId], text: data.text }
        }));
      } else {
        throw new Error(data.error || "Failed to generate");
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal memproses kata-kata. Pastikan koneksi dan API Key Anda benar.");
    } finally {
      setIsGeneratingText(null);
    }
  };

  const dragRef = React.useRef<{ isDragging: boolean; startX: number; startY: number; fieldId: string | null; initialTranslateX: number; initialTranslateY: number }>({
    isDragging: false, startX: 0, startY: 0, fieldId: null, initialTranslateX: 0, initialTranslateY: 0
  });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, fieldId: string, tx: number, ty: number) => {
    e.preventDefault(); 
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      fieldId,
      initialTranslateX: tx,
      initialTranslateY: ty
    };
    setActiveFieldId(fieldId);
    setIsSidebarOpen(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.isDragging || dragRef.current.fieldId === null) return;
    const { startX, startY, fieldId, initialTranslateX, initialTranslateY } = dragRef.current;
    
    const deltaX = (e.clientX - startX) / (zoom / 100);
    const deltaY = (e.clientY - startY) / (zoom / 100);

    const val = values[fieldId];
    if (val) {
      handlePanZoom(fieldId, val.imageScale, initialTranslateX + deltaX, initialTranslateY + deltaY);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current.isDragging = false;
    dragRef.current.fieldId = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>, fieldId: string) => {
    e.preventDefault();
    const val = values[fieldId];
    if (val) {
      const zoomFactor = e.deltaY < 0 ? 0.05 : -0.05;
      const newScale = Math.max(0.1, Math.min(5, val.imageScale + zoomFactor));
      handlePanZoom(fieldId, newScale, val.imageTranslateX, val.imageTranslateY);
    }
  };

  const [showExportMenu, setShowExportMenu] = React.useState(false);
  const [mockupType, setMockupType] = React.useState<string | null>(template.target_platform);
  const [exportPreviewUrl, setExportPreviewUrl] = React.useState<string | null>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const handleOpenExportMenu = async () => {
    if (currentExports >= exportLimit) {
      toast.error(`Batas ekspor harian Anda (${exportLimit}) sudah habis.`);
      return;
    }
    setIsExporting(true);
    try {
      if (canvasRef.current) {
        await new Promise(r => setTimeout(r, 100));
        const dataUrl = await htmlToImage.toPng(canvasRef.current, {
          quality: 0.8,
          pixelRatio: 1,
          fetchRequestInit: { cache: "no-cache" }
        });
        setExportPreviewUrl(dataUrl);
      }
      setShowExportMenu(true);
    } catch (err) {
      console.error("Preview generation failed", err);
      setShowExportMenu(true);
    } finally {
      setIsExporting(false);
    }
  };

  // Close dropdown on click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const exportImage = async (format: "PNG", mode: "download" | "share" = "download") => {
    if (currentExports >= exportLimit) {
      toast.error(`Batas ekspor harian Anda (${exportLimit}) sudah habis.`);
      return;
    }
    if (!canvasRef.current) return;
    setIsExporting(true);
    setShowExportMenu(false);
    try {
      // Small delay to ensure all states are settled
      await new Promise(r => setTimeout(r, 100));
      
      const dataUrl = await htmlToImage.toPng(canvasRef.current, {
        quality: 1,
        pixelRatio: 2,
        fetchRequestInit: { cache: "no-cache" }
      });

      if (mode === "download") {
        const link = document.createElement("a");
        link.download = `KANCING-Desain-${template.nama_template}.png`;
        link.href = dataUrl;
        link.click();
      } else if (mode === "share") {
        try {
          if (navigator.share) {
            const res = await fetch(dataUrl);
            const blob = await res.blob();
            const file = new File([blob], `KANCING-Desain-${template.nama_template}.png`, { type: 'image/png' });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              await navigator.share({
                title: `Desain dari KANCING`,
                text: `Lihat desain promosi saya untuk ${template.nama_template}!`,
                files: [file]
              });
            } else {
              await navigator.share({
                title: `Desain dari KANCING`,
                text: `Lihat desain promosi saya untuk ${template.nama_template}!`,
              });
            }
          } else {
            toast.error("Browser Anda tidak mendukung fitur berbagi langsung. Silakan download terlebih dahulu.");
            return;
          }
        } catch (shareErr: any) {
          if (shareErr.name === "AbortError" || (shareErr.message && shareErr.message.toLowerCase().includes("abort"))) {
            console.log("User cancelled share");
            return;
          }
          throw shareErr;
        }
      }

      // Upload to exports bucket
      let uploadedUrl = undefined;
      try {
        const supabase = createClient();
        // Upload PNG as thumbnail for the history regardless of final export format
        const pngDataUrl = format === "PNG" ? dataUrl : await htmlToImage.toPng(canvasRef.current, { quality: 0.5, pixelRatio: 1 });
        const res = await fetch(pngDataUrl);
        const blob = await res.blob();
        const fileName = `${userId}/${template.id}-${Date.now()}.png`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("exports")
          .upload(fileName, blob, { contentType: "image/png", upsert: true });

        if (!uploadError && uploadData) {
          const { data: publicUrlData } = supabase.storage
            .from("exports")
            .getPublicUrl(fileName);
          uploadedUrl = publicUrlData.publicUrl;
        }
      } catch (e) {
        console.error("Failed to upload preview to exports bucket", e);
      }

      // Log export with the image and state
      await logExportAction(template.id, userId, format, uploadedUrl, values);
      
      // Clear draft upon successful export
      localStorage.removeItem(`umkm_draft_${template.id}`);
      
      // Refresh router so the quota updates automatically in the sidebar
      router.refresh();
      
    } catch (err) {
      console.error("Export error:", err);
      toast.error("Gagal mengekspor desain. Silakan coba lagi.");
    } finally {
      setIsExporting(false);
    }
  };

  // Determine aspect ratio class
  const isPortrait = template.target_platform === "instagram_story" || template.target_platform === "tiktok";
  // Assuming a base width for the canvas container. We will scale it via CSS.
  // Standard Instagram Square: 1080x1080. Story: 1080x1920.
  const canvasBaseWidth = 1080;
  const canvasBaseHeight = isPortrait ? 1920 : 1080;

  // Render fonts CSS
  const fonts = ["Poppins", "Inter", "Montserrat", "Plus Jakarta Sans"];
  const fontUrl = `https://fonts.googleapis.com/css2?${fonts.map(f => `family=${f.replace(/ /g, '+')}:wght@400;500;600;700;800`).join('&')}&display=swap`;

  return (
    <div className="fixed inset-0 bg-[#FFFFFF] z-[100] flex flex-col font-sans">
      <style dangerouslySetInnerHTML={{ __html: `@import url('${fontUrl}');` }} />
      
      {/* ── HEADER ── */}
      <header className="h-16 bg-white border-b border-[#FFE6D5] flex items-center justify-between px-4 shrink-0 shadow-sm z-20 relative">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/dashboard/template" className="w-10 h-10 rounded-xl hover:bg-[#F3F4F6] flex items-center justify-center text-[#1E293B] transition-colors shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="h-6 w-px bg-[#F1F5F9] hidden sm:block" />
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`w-10 h-10 rounded-xl flex lg:hidden items-center justify-center transition-colors shrink-0 ${isSidebarOpen ? 'bg-[#E07A00] text-white' : 'hover:bg-[#F3F4F6] text-[#1E293B]'}`}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold text-[#1E293B] truncate max-w-[150px] md:max-w-xs">{template.nama_template}</h1>
            <p className="text-[10px] text-[#1E293B] font-medium mt-0.5">Otomatis tersimpan</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1 mr-2 border-r border-[#FFE6D5] pr-4">
            <button 
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className={`p-2 rounded-lg transition-all ${
                historyIndex <= 0 
                  ? "text-slate-300 opacity-50 cursor-not-allowed" 
                  : "text-[#1E293B] bg-[#F3F4F6] hover:bg-[#F1F5F9] cursor-pointer font-bold shadow-sm"
              }`}
              title="Undo"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button 
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className={`p-2 rounded-lg transition-all ${
                historyIndex >= history.length - 1 
                  ? "text-slate-300 opacity-50 cursor-not-allowed" 
                  : "text-[#1E293B] bg-[#F3F4F6] hover:bg-[#F1F5F9] cursor-pointer font-bold shadow-sm"
              }`}
              title="Redo"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>
          <button 
            onClick={handleOpenExportMenu}
            disabled={isExporting}
            className="px-5 py-2.5 bg-gradient-to-r from-[#FF9100] to-[#E07A00] text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>Ekspor Desain</span>
          </button>
        </div>
      </header>

      {/* ── WORKSPACE ── */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* ── LEFT SIDEBAR (TOOLS) ── */}
        <aside className={`absolute lg:relative w-80 h-[calc(100vh-4rem)] lg:h-auto bg-white border-r border-[#FFE6D5] flex flex-col shrink-0 z-20 shadow-2xl lg:shadow-sm overflow-y-auto custom-scrollbar transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="p-5 border-b border-[#FFE6D5] flex justify-between items-center bg-white sticky top-0 z-10">
            <div>
              <h2 className="text-lg font-extrabold text-[#1E293B] font-heading">Edit Konten</h2>
              <p className="text-xs text-slate-500">Sesuaikan promosi Anda.</p>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 space-y-6">
            {/* Image Fields */}
            {imageFields.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#1E293B] font-bold text-sm">
                  <ImageIcon className="w-4 h-4" /> <h3>Gambar Produk</h3>
                </div>
                {imageFields.map(field => {
                  const val = values[field.id];
                  const isActive = activeFieldId === field.id;
                  return (
                    <div 
                      key={field.id} 
                      className={`p-4 rounded-xl border-2 transition-all ${isActive ? "border-[#FF9100] bg-[#F3F4F6]" : "border-[#FFE6D5] bg-white hover:border-[#FF9100]/50"}`}
                      onClick={() => setActiveFieldId(field.id)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-slate-700 block">{field.placeholder_label || "Foto Produk"}</label>
                        <span className="text-[9px] text-slate-400 font-medium">Maks {maxUploadMb} MB</span>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleImageUpload(field.id, e)}
                        className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#F1F5F9]/40 file:text-[#1E293B] hover:file:bg-[#F1F5F9]"
                      />
                      {val.imageUrl && isActive && (
                        <div className="mt-4 p-3 bg-white rounded-lg border border-[#FFE6D5] space-y-3">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 flex justify-between">
                              <span>Perbesar (Zoom)</span>
                              <span>{Math.round(val.imageScale * 100)}%</span>
                            </label>
                            <input 
                              type="range" min="0.1" max="5" step="0.05" 
                              value={val.imageScale}
                              onChange={(e) => handlePanZoom(field.id, parseFloat(e.target.value), val.imageTranslateX, val.imageTranslateY)}
                              className="w-full accent-[#FF9100]"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] font-bold text-slate-500">Geser X</label>
                              <input 
                                type="range" min="-1500" max="1500" step="5" 
                                value={val.imageTranslateX}
                                onChange={(e) => handlePanZoom(field.id, val.imageScale, parseFloat(e.target.value), val.imageTranslateY)}
                                className="w-full accent-[#FF9100]"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-500">Geser Y</label>
                              <input 
                                type="range" min="-1500" max="1500" step="5" 
                                value={val.imageTranslateY}
                                onChange={(e) => handlePanZoom(field.id, val.imageScale, val.imageTranslateX, parseFloat(e.target.value))}
                                className="w-full accent-[#FF9100]"
                              />
                            </div>
                          </div>
                          
                          {/* One-Tap Enhance Filters */}
                          <div className="pt-2 border-t border-[#FFE6D5]">
                            <label className="text-[10px] font-bold text-slate-500 mb-2 block">One-Tap Enhance (Filter)</label>
                            <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                              {[
                                { id: "none", label: "Asli", css: "none" },
                                { id: "cerah", label: "Cerah", css: "brightness(1.2) contrast(1.1)" },
                                { id: "hangat", label: "Hangat", css: "sepia(0.3) saturate(1.2) brightness(1.05)" },
                                { id: "vibrant", label: "Vibrant", css: "saturate(1.5) contrast(1.1)" },
                                { id: "estetik", label: "Estetik", css: "sepia(0.2) contrast(0.9) brightness(1.1)" },
                                { id: "bw", label: "B&W", css: "grayscale(100%) contrast(1.2)" },
                              ].map(f => (
                                <button
                                  key={f.id}
                                  onClick={(e) => { e.stopPropagation(); handleFilterChange(field.id, f.css); }}
                                  className={`shrink-0 px-3 py-1.5 rounded-lg text-[9px] font-bold border transition-colors ${
                                    (val.imageFilter || "none") === f.css 
                                      ? "bg-[#FF9100] text-white border-[#FF9100]" 
                                      : "bg-slate-50 text-slate-600 border-slate-200 hover:border-[#FF9100]"
                                  }`}
                                >
                                  {f.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Text Fields */}
            {textFields.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#1E293B] font-bold text-sm">
                  <Type className="w-4 h-4" /> <h3>Teks Promosi</h3>
                </div>
                {textFields.map(field => {
                  const val = values[field.id];
                  const isActive = activeFieldId === field.id;
                  return (
                    <div 
                      key={field.id} 
                      className={`p-4 rounded-xl border-2 transition-all ${isActive ? "border-[#FF9100] bg-[#F3F4F6]" : "border-[#FFE6D5] bg-white hover:border-[#FF9100]/50"}`}
                      onClick={() => setActiveFieldId(field.id)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-slate-700">{field.placeholder_label || "Teks"}</label>
                        {field.max_chars && (
                          <span className={`text-[10px] font-bold ${val.text?.length === field.max_chars ? "text-red-500" : "text-slate-400"}`}>
                            {val.text?.length || 0} / {field.max_chars}
                          </span>
                        )}
                      </div>
                      <textarea
                        value={val.text || ""}
                        onChange={(e) => handleTextChange(field.id, e.target.value, field.max_chars)}
                        placeholder={`Masukkan ${field.placeholder_label}...`}
                        className="w-full bg-white border border-[#FFE6D5] rounded-lg p-2.5 text-sm text-slate-700 focus:outline-none focus:border-[#FF9100] resize-none"
                        rows={2}
                      />
                      {isActive && (
                        <div className="mt-4 pt-3 border-t border-[#FFE6D5] grid grid-cols-2 gap-3 bg-white/50 p-2.5 rounded-lg">
                          <div className="space-y-1.5 col-span-2">
                            <label className="text-[10px] font-bold text-[#1E293B] uppercase tracking-wider">Font Family</label>
                            <select
                              value={val.fontFamilyOverride || field.font_family || "Poppins"}
                              onChange={(e) => handleFieldOverrideChange(field.id, "fontFamilyOverride", e.target.value)}
                              className="w-full px-3 py-1.5 text-xs border border-[#FFE6D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9100] bg-white cursor-pointer"
                            >
                              <option value="Poppins">Poppins</option>
                              <option value="Inter">Inter</option>
                              <option value="Montserrat">Montserrat</option>
                              <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                              <option value="SF Pro Display">SF Pro</option>
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-[#1E293B] uppercase tracking-wider">Ukuran (px)</label>
                            <input
                              type="number"
                              value={val.fontSizeOverride || field.font_size || 32}
                              onChange={(e) => handleFontSizeChange(field.id, parseInt(e.target.value) || 12)}
                              className="w-full px-3 py-1.5 text-xs border border-[#FFE6D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9100] bg-white"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-[#1E293B] uppercase tracking-wider">Ketebalan</label>
                            <select
                              value={val.fontWeightOverride || field.font_weight || "normal"}
                              onChange={(e) => handleFieldOverrideChange(field.id, "fontWeightOverride", e.target.value)}
                              className="w-full px-3 py-1.5 text-xs border border-[#FFE6D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9100] bg-white cursor-pointer"
                            >
                              <option value="normal">Normal</option>
                              <option value="500">Medium</option>
                              <option value="600">Semi Bold</option>
                              <option value="bold">Bold</option>
                              <option value="800">Extra Bold</option>
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-[#1E293B] uppercase tracking-wider">Warna (Hex)</label>
                            <div className="flex gap-2">
                              <input
                                type="color"
                                value={val.colorOverride || field.color || "#000000"}
                                onChange={(e) => handleFieldOverrideChange(field.id, "colorOverride", e.target.value)}
                                className="w-8 h-8 border border-[#FFE6D5] rounded cursor-pointer shrink-0"
                              />
                              <input
                                type="text"
                                value={val.colorOverride || field.color || "#000000"}
                                onChange={(e) => handleFieldOverrideChange(field.id, "colorOverride", e.target.value)}
                                className="w-full px-2 py-1.5 text-xs border border-[#FFE6D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9100] bg-white uppercase"
                              />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-[#1E293B] uppercase tracking-wider">Align</label>
                            <select
                              value={val.textAlignOverride || field.text_align || "left"}
                              onChange={(e) => handleFieldOverrideChange(field.id, "textAlignOverride", e.target.value)}
                              className="w-full px-3 py-1.5 text-xs border border-[#FFE6D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9100] bg-white cursor-pointer"
                            >
                              <option value="left">Kiri</option>
                              <option value="center">Tengah</option>
                              <option value="right">Kanan</option>
                            </select>
                          </div>
                        </div>
                      )}
                      <button 
                        onClick={() => handleMagicText(field.id)}
                        disabled={isGeneratingText === field.id}
                        className="mt-3 w-full py-2 bg-gradient-to-r from-[#FF9100] to-[#E07A00] text-white text-[10px] font-bold rounded-lg flex items-center justify-center gap-1.5 hover:shadow-md disabled:opacity-50 transition-all"
                      >
                        {isGeneratingText === field.id ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Merangkai Kata...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3" />
                            Gunakan Asisten AI
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* ── CANVAS AREA ── */}
        <main className="flex-1 bg-[#F5F5F5] relative overflow-auto custom-scrollbar">
          
          <div className="fixed bottom-6 right-6 bg-white rounded-xl shadow-md border border-[#FFE6D5] flex items-center p-1 z-50">
            <button onClick={() => setZoom(Math.max(20, zoom - 10))} className="p-2 text-slate-500 hover:text-[#1E293B] hover:bg-[#F3F4F6] rounded-lg">
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-700 px-2 w-16 text-center">{zoom}%</span>
            <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="p-2 text-slate-500 hover:text-[#1E293B] hover:bg-[#F3F4F6] rounded-lg">
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <div className="w-fit min-h-full m-auto p-8 md:p-16">
            {/* Scale wrapper for zooming in the UI without affecting the actual DOM resolution */}
            <div 
              className="transition-transform duration-200 origin-center"
              style={{ transform: `scale(${zoom / 100})` }}
            >
              {/* The Actual Canvas DOM node to be exported */}
              <div 
                ref={canvasRef}
                className="bg-white shadow-2xl relative overflow-hidden inline-block"
                style={{ width: `${naturalSize.w}px`, height: `${naturalSize.h}px` }}
              >
                
                {/* Master Template Background (z-10 so it acts as a frame/overlay for transparent holes) */}
                {template.master_template_url ? (
                  <img 
                    src={template.master_template_url} 
                    alt="Template" 
                    className="w-full h-full block relative z-10 pointer-events-none"
                    crossOrigin="anonymous"
                    onLoad={handleImageLoad}
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 z-10 relative"></div>
                )}

                {/* Render Template Fields based on Z-Index */}
                {sortedFields.map(field => {
                  const val = values[field.id];
                  const isSelected = activeFieldId === field.id;

                  // Calculate dynamic z-index based on render_mode to properly stack over/under the template image (which is z-index 10)
                  const fieldZIndex = field.render_mode === "over" 
                    ? 20 + field.z_index 
                    : (field.z_index >= 10 ? 0 : field.z_index);

                  // Absolute PX coordinates relative to the canvas Base Width/Height.
                  const style: React.CSSProperties = {
                    position: "absolute",
                    left: `${field.x}px`,
                    top: `${field.y}px`,
                    width: `${field.width}px`,
                    height: `${field.height}px`,
                    zIndex: fieldZIndex,
                    outline: isSelected ? "2px dashed #111827" : "none",
                  };

                  // Custom polygon shape clipping (only for image fields)
                  if (field.field_role === "image" && field.shape_type === "polygon" && field.font_weight) {
                    const points = field.font_weight.trim();
                    if (points) {
                      const cssPolygon = `polygon(${points
                        .split(" ")
                        .map((p) => {
                          const [px, py] = p.split(",");
                          return `${px}% ${py}%`;
                        })
                        .join(", ")})`;
                      style.clipPath = cssPolygon;
                      (style as any).WebkitClipPath = cssPolygon;
                    }
                  }

                  // IMAGE FIELD (Z-Index Usually 0 for Underlay)
                  if (field.field_role === "image") {
                    return (
                      <div 
                        key={field.id} 
                        style={{...style, touchAction: "none"}} 
                        className="overflow-hidden flex items-center justify-center bg-slate-100/50 cursor-move" 
                        onPointerDown={(e) => {
                          if (val.imageUrl) handlePointerDown(e, field.id, val.imageTranslateX, val.imageTranslateY);
                          else {
                            setActiveFieldId(field.id);
                            setIsSidebarOpen(true);
                          }
                        }}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerUp}
                        onWheel={(e) => {
                          if (val.imageUrl) handleWheel(e, field.id);
                        }}
                      >
                        {val.imageUrl ? (
                          <img 
                            src={val.imageUrl} 
                            alt="Upload"
                            crossOrigin="anonymous"
                            className="w-full h-full object-contain select-none pointer-events-none"
                            style={{
                              transform: `translate(${val.imageTranslateX}px, ${val.imageTranslateY}px) scale(${val.imageScale})`,
                              transformOrigin: "center center",
                              filter: val.imageFilter || "none",
                            }}
                            draggable={false}
                          />
                        ) : (
                          <div className="text-center text-slate-300 pointer-events-none select-none">
                            <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p className="text-xl font-bold">{field.placeholder_label}</p>
                          </div>
                        )}
                      </div>
                    );
                  }

                  // TEXT FIELD (Z-Index Usually 20 for Overlay)
                  if (field.field_role === "text" || field.field_role === "magic") {
                    let displayText = val.text || field.placeholder_label;
                    
                    if (field.is_currency && val.text) {
                      const num = parseInt(val.text.replace(/\D/g, ""), 10);
                      if (!isNaN(num)) {
                        displayText = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);
                      }
                    }

                    return (
                      <div 
                        key={field.id} 
                        style={{
                          ...style,
                          display: "flex",
                          alignItems: "center", 
                          justifyContent: (val.textAlignOverride || field.text_align) === "center" 
                            ? "center" 
                            : (val.textAlignOverride || field.text_align) === "right" 
                              ? "flex-end" 
                              : "flex-start",
                        }}
                        className="cursor-pointer"
                        onClick={() => {
                          setActiveFieldId(field.id);
                          setIsSidebarOpen(true);
                        }}
                      >
                        <p style={{
                          fontFamily: `"${val.fontFamilyOverride || field.font_family || 'Inter'}", sans-serif`,
                          fontSize: `${val.fontSizeOverride || field.font_size || 48}px`,
                          fontWeight: val.fontWeightOverride || field.font_weight || "400",
                          color: val.colorOverride || field.color || "#000000",
                          textAlign: (val.textAlignOverride || field.text_align as any) || "left",
                          lineHeight: "1.2",
                          width: "100%",
                          wordWrap: "break-word",
                        }}>
                          {displayText}
                        </p>
                      </div>
                    );
                  }

                  return null;
                })}

              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ── EXPORT MODAL ── */}
      {showExportMenu && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-5xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-200">
            
            {/* Left Side: Preview Mockup */}
            <div className="w-full md:w-1/2 bg-slate-100 flex items-center justify-center p-8 relative min-h-[400px]">
              <div className="absolute inset-0 opacity-50 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
              {exportPreviewUrl ? (
                <div className="relative z-10 w-full flex justify-center items-center">
                  <DeviceMockup platform={mockupType} imageUrl={exportPreviewUrl} shopName={shopName} shopLogo={shopLogo} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 relative z-10">
                  <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                  <p className="text-sm font-bold">Preview tidak tersedia</p>
                </div>
              )}
            </div>

            {/* Right Side: Export Options */}
            <div className="w-full md:w-1/2 flex flex-col bg-white">
              <div className="px-8 py-8 border-b border-[#FFE6D5] flex items-start justify-between bg-gradient-to-br from-[#F3F4F6]/50 to-white">
                <div>
                  <h3 className="text-2xl font-black text-[#1E293B] mb-1">Opsi Ekspor & Bagikan</h3>
                  <p className="text-sm font-semibold text-[#1E293B]">Simpan desain Anda atau langsung bagikan ke pelanggan.</p>
                </div>
                <button 
                  onClick={() => setShowExportMenu(false)}
                  className="p-2 -mr-2 text-slate-400 hover:text-[#1E293B] hover:bg-[#F3F4F6] rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 flex-1 flex flex-col gap-6 overflow-y-auto">
                {/* Mockup Selector */}
                <div>
                  <h4 className="text-sm font-bold text-[#1E293B] mb-3">Pilih Tampilan Mockup:</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "instagram_feed", label: "Instagram Feed" },
                      { id: "instagram_story", label: "IG Story / WA" },
                      { id: "tiktok_post", label: "TikTok Post" },
                      { id: "facebook_post", label: "Facebook Post" },
                      { id: "marketplace", label: "Marketplace" },
                    ].map(mockup => (
                      <button
                        key={mockup.id || "asli"}
                        onClick={() => setMockupType(mockup.id)}
                        className={`px-4 py-2 rounded-full text-xs font-bold border transition-all shadow-sm ${
                          mockupType === mockup.id
                            ? "bg-[#FF9100] text-white border-[#FF9100] scale-105"
                            : "bg-white text-slate-600 border-[#FFE6D5] hover:border-[#FF9100] hover:text-[#E07A00]"
                        }`}
                      >
                        {mockup.label}
                      </button>
                    ))}
                  </div>
                </div>

                <hr className="border-[#FFE6D5]" />

                <div className="flex flex-col gap-4">
                  {/* PNG */}
                  <button 
                  onClick={() => exportImage("PNG")}
                  className="group flex items-center text-left p-4 border-2 border-[#FFE6D5] rounded-2xl hover:border-[#FF9100] hover:bg-[#FFFFFF] hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 shrink-0 bg-[#F3F4F6] rounded-xl flex items-center justify-center text-[#1E293B] mr-4 group-hover:scale-110 transition-transform">
                    <Download className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-[#1E293B] mb-0.5">Download Otomatis (PNG)</h4>
                    <p className="text-xs text-slate-500 font-medium">Simpan desain dengan resolusi tinggi (Otomatis Format PNG).</p>
                  </div>
                </button>

                {/* Share */}
                <button 
                  onClick={() => exportImage("PNG", "share")}
                  className="group flex items-center text-left p-4 border-2 border-[#FFE6D5] rounded-2xl hover:border-[#FF9100] hover:bg-[#FFFFFF] hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 shrink-0 bg-[#F3F4F6] rounded-xl flex items-center justify-center text-[#1E293B] mr-4 group-hover:scale-110 transition-transform">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-[#1E293B] mb-0.5">Bagikan ke Media Sosial</h4>
                    <p className="text-xs text-slate-500 font-medium">Langsung bagikan ke Instagram, WhatsApp, dll.</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

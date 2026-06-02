"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Download, Layers, Type, Image as ImageIcon, Square, Palette, ZoomIn, ZoomOut, Upload, Grip, Undo, Redo, Loader2, Sparkles, X, Heart, MessageCircle, Send, Bookmark, Star, MapPin, MoreHorizontal, Share2, Battery, Wifi, SignalHigh, ShoppingCart, Search as SearchIcon, Menu } from "lucide-react";
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
}

interface FieldValue {
  text?: string;
  imageUrl?: string;
  imageScale: number;
  imageTranslateX: number;
  imageTranslateY: number;
  imageFilter?: string;
  fontSizeOverride?: number;
}

import { logExportAction } from "../actions";
import { getExportLogData } from "./actions";
import { useSearchParams } from "next/navigation";
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
            <div className="absolute right-3 bottom-16 flex flex-col gap-4 text-slate-800 drop-shadow-md items-center z-10">
              <div className="w-10 h-10 rounded-full bg-white p-0.5 overflow-hidden border-2 border-white mb-2 shadow-sm">
                {shopLogo ? <img src={shopLogo} className="w-full h-full object-cover rounded-full" /> : <div className="w-full h-full bg-slate-300 rounded-full" />}
              </div>
              <div className="flex flex-col items-center"><Heart className="w-6 h-6 fill-slate-800 text-slate-800" /><span className="text-[10px] font-bold mt-1">12K</span></div>
              <div className="flex flex-col items-center"><MessageCircle className="w-6 h-6 fill-slate-800 text-slate-800" /><span className="text-[10px] font-bold mt-1">134</span></div>
              <div className="flex flex-col items-center"><Bookmark className="w-6 h-6 fill-slate-800 text-slate-800" /><span className="text-[10px] font-bold mt-1">Simpan</span></div>
              <div className="flex flex-col items-center"><Share2 className="w-6 h-6 fill-slate-800 text-slate-800" /><span className="text-[10px] font-bold mt-1">Share</span></div>
              <div className="w-9 h-9 rounded-full bg-slate-800 border-[3px] border-slate-700 animate-[spin_4s_linear_infinite] mt-2 flex items-center justify-center overflow-hidden shadow-md">
                {shopLogo ? <img src={shopLogo} className="w-full h-full object-cover rounded-full opacity-80" /> : <div className="w-3 h-3 bg-slate-400 rounded-full" />}
              </div>
            </div>
          )}
          
          {(platform === "instagram_story" || platform === "whatsapp_status") && (
            <>
              <div className="absolute top-2 inset-x-2 flex gap-1.5 z-10">
                <div className="h-1 bg-slate-800/20 w-full rounded-full overflow-hidden"><div className="w-2/3 h-full bg-slate-800"></div></div>
                <div className="h-1 bg-slate-800/20 w-full rounded-full"></div>
                <div className="h-1 bg-slate-800/20 w-full rounded-full"></div>
              </div>
              <div className="absolute top-6 left-3 flex items-center gap-2 z-10">
                <div className="w-8 h-8 rounded-full bg-white p-[1px] overflow-hidden shadow-sm">
                  {shopLogo ? <img src={shopLogo} className="w-full h-full object-cover rounded-full" /> : <div className="w-full h-full bg-slate-300 rounded-full" />}
                </div>
                <span className="text-xs font-bold text-slate-800 drop-shadow-sm">{displayName}</span>
                <span className="text-[10px] text-slate-600 drop-shadow-sm">2j</span>
              </div>
              <div className="absolute bottom-6 inset-x-4 z-10 flex gap-3">
                <div className="flex-1 rounded-full border border-slate-800/30 bg-white/50 text-slate-800 text-xs px-4 py-2.5 backdrop-blur-md font-medium">Kirim pesan...</div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-white/50 backdrop-blur-md border border-slate-800/20"><Heart className="w-5 h-5 text-slate-800" /></div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-white/50 backdrop-blur-md border border-slate-800/20"><Send className="w-5 h-5 text-slate-800 ml-1" /></div>
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
                  {displayName} <span className="bg-purple-100 text-purple-700 text-[8px] px-1 py-0.5 rounded font-bold">PRO</span>
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
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-fuchsia-600 p-[2px] shrink-0">
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

export function EditorClient({ template, fields, userId, shopName, shopLogo }: EditorClientProps) {
  const searchParams = useSearchParams();
  const exportId = searchParams.get("exportId");

  const [values, setValues] = React.useState<Record<string, FieldValue>>(() => {
    const init: Record<string, FieldValue> = {};
    fields.forEach((f) => {
      init[f.id] = { text: "", imageScale: 1, imageTranslateX: 0, imageTranslateY: 0 };
    });
    return init;
  });

  React.useEffect(() => {
    if (exportId) {
      getExportLogData(exportId).then(data => {
        if (data && data.customization_data) {
          // Merge with initial values to ensure all fields have at least default state
          setValues(prev => ({ ...prev, ...data.customization_data }));
        }
      });
    }
  }, [exportId]);

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

  const handleImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
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
      alert("Gagal memproses kata-kata. Pastikan koneksi dan API Key Anda benar.");
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
  const [exportPreviewUrl, setExportPreviewUrl] = React.useState<string | null>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const handleOpenExportMenu = async () => {
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

  const exportImage = async (format: "PNG" | "JPG" | "PDF") => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    setShowExportMenu(false);
    try {
      // Small delay to ensure all states are settled
      await new Promise(r => setTimeout(r, 100));
      
      let dataUrl = "";
      const isPortrait = template.target_platform === "instagram_story" || template.target_platform === "tiktok";
      const w = 1080;
      const h = isPortrait ? 1920 : 1080;

      if (format === "PNG" || format === "PDF") {
        dataUrl = await htmlToImage.toPng(canvasRef.current, {
          quality: 1,
          pixelRatio: 2,
          fetchRequestInit: { cache: "no-cache" }
        });
      } else if (format === "JPG") {
        dataUrl = await htmlToImage.toJpeg(canvasRef.current, {
          quality: 0.95,
          pixelRatio: 2,
          fetchRequestInit: { cache: "no-cache" }
        });
      }

      if (format === "PDF") {
        const { jsPDF } = await import("jspdf");
        // Create PDF with exact dimensions (in pixels, mapped to points/mm)
        // A standard portrait is 1080x1920 px. Let's use pt.
        const pdf = new jsPDF({
          orientation: isPortrait ? "portrait" : "landscape",
          unit: "px",
          format: [w, h]
        });
        pdf.addImage(dataUrl, "PNG", 0, 0, w, h);
        pdf.save(`UMKM-Desain-${template.nama_template}.pdf`);
      } else {
        const link = document.createElement("a");
        link.download = `UMKM-Desain-${template.nama_template}.${format.toLowerCase()}`;
        link.href = dataUrl;
        link.click();
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
      
    } catch (err) {
      console.error("Export error:", err);
      alert("Gagal mengekspor desain. Silakan coba lagi.");
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
    <div className="fixed inset-0 bg-[#FFF9FC] z-[100] flex flex-col font-sans">
      <style dangerouslySetInnerHTML={{ __html: `@import url('${fontUrl}');` }} />
      
      {/* ── HEADER ── */}
      <header className="h-16 bg-white border-b border-[#F7D6E6] flex items-center justify-between px-4 shrink-0 shadow-sm z-20 relative">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/dashboard/template" className="w-10 h-10 rounded-xl hover:bg-[#FFF0F7] flex items-center justify-center text-[#8C4A6E] transition-colors shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="h-6 w-px bg-[#F7D6E6] hidden sm:block" />
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`w-10 h-10 rounded-xl flex lg:hidden items-center justify-center transition-colors shrink-0 ${isSidebarOpen ? 'bg-[#8C4A6E] text-white' : 'hover:bg-[#FFF0F7] text-[#8C4A6E]'}`}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold text-[#3D1E30] truncate max-w-[150px] md:max-w-xs">{template.nama_template}</h1>
            <p className="text-[10px] text-[#C27BA0] font-medium mt-0.5">Otomatis tersimpan</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1 mr-2 border-r border-[#F7D6E6] pr-4">
            <button 
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className={`p-2 rounded-lg transition-all ${
                historyIndex <= 0 
                  ? "text-slate-300 opacity-50 cursor-not-allowed" 
                  : "text-[#8C4A6E] bg-[#FFF0F7] hover:bg-[#F7D6E6] cursor-pointer font-bold shadow-sm"
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
                  : "text-[#8C4A6E] bg-[#FFF0F7] hover:bg-[#F7D6E6] cursor-pointer font-bold shadow-sm"
              }`}
              title="Redo"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>
          <button 
            onClick={handleOpenExportMenu}
            disabled={isExporting}
            className="px-5 py-2.5 bg-gradient-to-r from-[#C27BA0] to-[#8C4A6E] text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>Ekspor Desain</span>
          </button>
        </div>
      </header>

      {/* ── WORKSPACE ── */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* ── LEFT SIDEBAR (TOOLS) ── */}
        <aside className={`absolute lg:relative w-80 h-[calc(100vh-4rem)] lg:h-auto bg-white border-r border-[#F7D6E6] flex flex-col shrink-0 z-20 shadow-2xl lg:shadow-sm overflow-y-auto custom-scrollbar transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="p-5 border-b border-[#F7D6E6] flex justify-between items-center bg-white sticky top-0 z-10">
            <div>
              <h2 className="text-lg font-extrabold text-[#3D1E30] font-heading">Edit Konten</h2>
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
                <div className="flex items-center gap-2 text-[#8C4A6E] font-bold text-sm">
                  <ImageIcon className="w-4 h-4" /> <h3>Gambar Produk</h3>
                </div>
                {imageFields.map(field => {
                  const val = values[field.id];
                  const isActive = activeFieldId === field.id;
                  return (
                    <div 
                      key={field.id} 
                      className={`p-4 rounded-xl border-2 transition-all ${isActive ? "border-[#C27BA0] bg-[#FFF0F7]" : "border-[#F7D6E6] bg-white hover:border-[#C27BA0]/50"}`}
                      onClick={() => setActiveFieldId(field.id)}
                    >
                      <label className="text-xs font-bold text-slate-700 block mb-2">{field.placeholder_label || "Foto Produk"}</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleImageUpload(field.id, e)}
                        className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#F7D6E6]/40 file:text-[#8C4A6E] hover:file:bg-[#F7D6E6]"
                      />
                      {val.imageUrl && isActive && (
                        <div className="mt-4 p-3 bg-white rounded-lg border border-[#F7D6E6] space-y-3">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 flex justify-between">
                              <span>Perbesar (Zoom)</span>
                              <span>{Math.round(val.imageScale * 100)}%</span>
                            </label>
                            <input 
                              type="range" min="0.5" max="3" step="0.1" 
                              value={val.imageScale}
                              onChange={(e) => handlePanZoom(field.id, parseFloat(e.target.value), val.imageTranslateX, val.imageTranslateY)}
                              className="w-full accent-[#C27BA0]"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] font-bold text-slate-500">Geser X</label>
                              <input 
                                type="range" min="-500" max="500" step="10" 
                                value={val.imageTranslateX}
                                onChange={(e) => handlePanZoom(field.id, val.imageScale, parseFloat(e.target.value), val.imageTranslateY)}
                                className="w-full accent-[#C27BA0]"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-500">Geser Y</label>
                              <input 
                                type="range" min="-500" max="500" step="10" 
                                value={val.imageTranslateY}
                                onChange={(e) => handlePanZoom(field.id, val.imageScale, val.imageTranslateX, parseFloat(e.target.value))}
                                className="w-full accent-[#C27BA0]"
                              />
                            </div>
                          </div>
                          
                          {/* One-Tap Enhance Filters */}
                          <div className="pt-2 border-t border-[#F7D6E6]">
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
                                      ? "bg-[#C27BA0] text-white border-[#C27BA0]" 
                                      : "bg-slate-50 text-slate-600 border-slate-200 hover:border-[#C27BA0]"
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
                <div className="flex items-center gap-2 text-[#8C4A6E] font-bold text-sm">
                  <Type className="w-4 h-4" /> <h3>Teks Promosi</h3>
                </div>
                {textFields.map(field => {
                  const val = values[field.id];
                  const isActive = activeFieldId === field.id;
                  return (
                    <div 
                      key={field.id} 
                      className={`p-4 rounded-xl border-2 transition-all ${isActive ? "border-[#C27BA0] bg-[#FFF0F7]" : "border-[#F7D6E6] bg-white hover:border-[#C27BA0]/50"}`}
                      onClick={() => setActiveFieldId(field.id)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-slate-700">{field.placeholder_label || "Teks"}</label>
                        {field.max_chars && (
                          <span className={`text-[10px] font-bold ${val.text?.length === field.max_chars ? "text-rose-500" : "text-slate-400"}`}>
                            {val.text?.length || 0} / {field.max_chars}
                          </span>
                        )}
                      </div>
                      <textarea
                        value={val.text || ""}
                        onChange={(e) => handleTextChange(field.id, e.target.value, field.max_chars)}
                        placeholder={`Masukkan ${field.placeholder_label}...`}
                        className="w-full bg-white border border-[#F7D6E6] rounded-lg p-2.5 text-sm text-slate-700 focus:outline-none focus:border-[#C27BA0] resize-none"
                        rows={2}
                      />
                      <div className="mt-2 flex items-center justify-between">
                        <label className="text-[10px] font-bold text-slate-500">Ukuran Teks</label>
                        <input
                          type="number"
                          value={val.fontSizeOverride || field.font_size || 32}
                          onChange={(e) => handleFontSizeChange(field.id, parseInt(e.target.value) || 12)}
                          className="w-16 px-2 py-1 text-xs border border-[#F7D6E6] rounded-md focus:outline-none focus:border-[#C27BA0]"
                        />
                      </div>
                      <button 
                        onClick={() => handleMagicText(field.id)}
                        disabled={isGeneratingText === field.id}
                        className="mt-3 w-full py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] font-bold rounded-lg flex items-center justify-center gap-1.5 hover:shadow-md disabled:opacity-50 transition-all"
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
          
          <div className="fixed bottom-6 right-6 bg-white rounded-xl shadow-md border border-[#F7D6E6] flex items-center p-1 z-50">
            <button onClick={() => setZoom(Math.max(20, zoom - 10))} className="p-2 text-slate-500 hover:text-[#8C4A6E] hover:bg-[#FFF0F7] rounded-lg">
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-700 px-2 w-16 text-center">{zoom}%</span>
            <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="p-2 text-slate-500 hover:text-[#8C4A6E] hover:bg-[#FFF0F7] rounded-lg">
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

                  // Absolute PX coordinates relative to the canvas Base Width/Height.
                  const style: React.CSSProperties = {
                    position: "absolute",
                    left: `${field.x}px`,
                    top: `${field.y}px`,
                    width: `${field.width}px`,
                    height: `${field.height}px`,
                    zIndex: field.z_index,
                    outline: isSelected ? "2px dashed #C27BA0" : "none",
                  };

                  // IMAGE FIELD (Z-Index Usually 0 for Underlay)
                  if (field.field_role === "image") {
                    return (
                      <div 
                        key={field.id} 
                        style={{...style, touchAction: "none"}} 
                        className="overflow-hidden flex items-center justify-center bg-slate-100/50 cursor-move" 
                        onPointerDown={(e) => {
                          if (val.imageUrl) handlePointerDown(e, field.id, val.imageTranslateX, val.imageTranslateY);
                          else setActiveFieldId(field.id);
                        }}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerLeave={handlePointerUp}
                        onPointerCancel={handlePointerUp}
                        onTouchStart={(e) => {
                          if (val.imageUrl) {
                            dragRef.current = {
                              isDragging: true,
                              startX: e.touches[0].clientX,
                              startY: e.touches[0].clientY,
                              fieldId: field.id,
                              initialTranslateX: val.imageTranslateX,
                              initialTranslateY: val.imageTranslateY
                            };
                            setActiveFieldId(field.id);
                          }
                        }}
                        onTouchMove={(e) => {
                          if (!dragRef.current.isDragging || dragRef.current.fieldId !== field.id) return;
                          const { startX, startY, initialTranslateX, initialTranslateY } = dragRef.current;
                          const deltaX = (e.touches[0].clientX - startX) / (zoom / 100);
                          const deltaY = (e.touches[0].clientY - startY) / (zoom / 100);
                          handlePanZoom(field.id, val.imageScale, initialTranslateX + deltaX, initialTranslateY + deltaY);
                        }}
                        onTouchEnd={() => { dragRef.current.isDragging = false; }}
                        onWheel={(e) => {
                          if (val.imageUrl) handleWheel(e, field.id);
                        }}
                      >
                        {val.imageUrl ? (
                          <img 
                            src={val.imageUrl} 
                            alt="Upload"
                            crossOrigin="anonymous"
                            className="w-full h-full object-cover select-none pointer-events-none"
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
                          justifyContent: field.text_align === "center" ? "center" : field.text_align === "right" ? "flex-end" : "flex-start",
                        }}
                        className="cursor-pointer"
                        onClick={() => setActiveFieldId(field.id)}
                      >
                        <p style={{
                          fontFamily: `"${field.font_family || 'Inter'}", sans-serif`,
                          fontSize: `${val.fontSizeOverride || field.font_size || 48}px`,
                          fontWeight: field.font_weight || "400",
                          color: field.color || "#000000",
                          textAlign: (field.text_align as any) || "left",
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
                  <DeviceMockup platform={template.target_platform} imageUrl={exportPreviewUrl} shopName={shopName} shopLogo={shopLogo} />
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
              <div className="px-8 py-8 border-b border-[#F7D6E6] flex items-start justify-between bg-gradient-to-br from-[#FFF0F7]/50 to-white">
                <div>
                  <h3 className="text-2xl font-black text-[#3D1E30] mb-1">Format Ekspor</h3>
                  <p className="text-sm font-semibold text-[#8C4A6E]">Pilih format yang paling sesuai untuk kebutuhan promosi Anda.</p>
                </div>
                <button 
                  onClick={() => setShowExportMenu(false)}
                  className="p-2 -mr-2 text-slate-400 hover:text-[#8C4A6E] hover:bg-[#FFF0F7] rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 flex-1 flex flex-col gap-4 overflow-y-auto">
                {/* PNG */}
                <button 
                  onClick={() => exportImage("PNG")}
                  className="group flex items-center text-left p-4 border-2 border-[#F7D6E6] rounded-2xl hover:border-[#C27BA0] hover:bg-[#FFF9FC] hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 shrink-0 bg-[#FFF0F7] rounded-xl flex items-center justify-center text-[#C27BA0] mr-4 group-hover:scale-110 transition-transform">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-[#3D1E30] mb-0.5">PNG Kualitas Tinggi</h4>
                    <p className="text-xs text-slate-500 font-medium">Resolusi maksimal. Cocok untuk banner web atau poster.</p>
                  </div>
                </button>

                {/* JPG */}
                <button 
                  onClick={() => exportImage("JPG")}
                  className="group flex items-center text-left p-4 border-2 border-[#F7D6E6] rounded-2xl hover:border-[#C27BA0] hover:bg-[#FFF9FC] hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 shrink-0 bg-[#FFF0F7] rounded-xl flex items-center justify-center text-[#C27BA0] mr-4 group-hover:scale-110 transition-transform">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-[#3D1E30] mb-0.5">JPG Standar</h4>
                    <p className="text-xs text-slate-500 font-medium">Ukuran file ringkas. Paling pas untuk Feed atau Story Instagram.</p>
                  </div>
                </button>

                {/* PDF */}
                <button 
                  onClick={() => exportImage("PDF")}
                  className="group flex items-center text-left p-4 border-2 border-[#F7D6E6] rounded-2xl hover:border-[#C27BA0] hover:bg-[#FFF9FC] hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 shrink-0 bg-[#FFF0F7] rounded-xl flex items-center justify-center text-[#C27BA0] mr-4 group-hover:scale-110 transition-transform">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-[#3D1E30] mb-0.5">Dokumen PDF</h4>
                    <p className="text-xs text-slate-500 font-medium">Format cetak. Gunakan jika desain ingin dicetak ke brosur.</p>
                  </div>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

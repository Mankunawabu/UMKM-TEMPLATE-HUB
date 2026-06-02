"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Save, Trash2, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { getTemplateFields, saveTemplateFields, TemplateField } from "../../editor-actions";

// Palette for field indicators
const PALETTE = ["#C27BA0", "#8C4A6E", "#E0B0FF", "#FFB6C1", "#F7D6E6", "#FF99CC"];

interface EditorClientProps {
  template: {
    id: string;
    name: string;
    master_template_url: string;
  };
}

// ----------------------------------------------------------------------
// Draggable & Resizable Box Component
// ----------------------------------------------------------------------
interface DraggableBoxProps {
  label: string;
  color: string;
  renderedX: number;
  renderedY: number;
  renderedW: number;
  renderedH: number;
  zIndex: number;
  onUpdate: (x: number, y: number, w: number, h: number) => void;
  isActive: boolean;
  onClick: () => void;
}

function DraggableBox({
  label, color, renderedX, renderedY, renderedW, renderedH, zIndex, onUpdate, isActive, onClick
}: DraggableBoxProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [isResizing, setIsResizing] = React.useState<string | null>(null); // 'nw', 'ne', 'sw', 'se'
  
  // Track start positions
  const startPos = React.useRef({ x: 0, y: 0 });
  const startDim = React.useRef({ x: 0, y: 0, w: 0, h: 0 });

  const handlePointerDown = (e: React.PointerEvent, action: string) => {
    e.stopPropagation();
    onClick();
    
    // Capture pointer to allow dragging outside the element
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);

    startPos.current = { x: e.clientX, y: e.clientY };
    startDim.current = { x: renderedX, y: renderedY, w: renderedW, h: renderedH };

    if (action === 'move') {
      setIsDragging(true);
    } else {
      setIsResizing(action);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging && !isResizing) return;

    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;

    const { x, y, w, h } = startDim.current;

    let newX = x;
    let newY = y;
    let newW = w;
    let newH = h;

    if (isDragging) {
      newX = x + dx;
      newY = y + dy;
    } else if (isResizing) {
      if (isResizing.includes('n')) {
        newY = y + dy;
        newH = h - dy;
      }
      if (isResizing.includes('s')) {
        newH = h + dy;
      }
      if (isResizing.includes('w')) {
        newX = x + dx;
        newW = w - dx;
      }
      if (isResizing.includes('e')) {
        newW = w + dx;
      }
    }

    // Min dimensions
    if (newW < 20) newW = 20;
    if (newH < 20) newH = 20;

    onUpdate(newX, newY, newW, newH);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.stopPropagation();
    const el = e.currentTarget as HTMLElement;
    el.releasePointerCapture(e.pointerId);
    setIsDragging(false);
    setIsResizing(null);
  };

  const handleSize = 10;

  return (
    <div
      onPointerDown={(e) => handlePointerDown(e, 'move')}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        position: 'absolute',
        left: renderedX,
        top: renderedY,
        width: renderedW,
        height: renderedH,
        zIndex,
        border: `2px ${isActive ? 'solid' : 'dashed'} ${color}`,
        backgroundColor: `${color}33`,
        cursor: isDragging ? 'grabbing' : 'grab',
        boxShadow: isActive ? `0 0 0 2px rgba(255,255,255,0.5), 0 0 10px ${color}` : 'none',
        transition: isDragging || isResizing ? 'none' : 'box-shadow 0.2s',
      }}
      className="group flex items-center justify-center overflow-hidden touch-none"
    >
      <span className="bg-[#3D1E30]/80 text-white text-xs font-bold px-2 py-1 rounded truncate max-w-[90%] pointer-events-none select-none">
        {label}
      </span>

      {/* Resize Handles (only visible when active or hovered) */}
      {isActive && (
        <>
          {/* NW */}
          <div
            onPointerDown={(e) => handlePointerDown(e, 'nw')}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="absolute bg-white border border-[#3D1E30] rounded-full"
            style={{ width: handleSize, height: handleSize, top: -handleSize/2, left: -handleSize/2, cursor: 'nwse-resize' }}
          />
          {/* NE */}
          <div
            onPointerDown={(e) => handlePointerDown(e, 'ne')}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="absolute bg-white border border-[#3D1E30] rounded-full"
            style={{ width: handleSize, height: handleSize, top: -handleSize/2, right: -handleSize/2, cursor: 'nesw-resize' }}
          />
          {/* SW */}
          <div
            onPointerDown={(e) => handlePointerDown(e, 'sw')}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="absolute bg-white border border-[#3D1E30] rounded-full"
            style={{ width: handleSize, height: handleSize, bottom: -handleSize/2, left: -handleSize/2, cursor: 'nesw-resize' }}
          />
          {/* SE */}
          <div
            onPointerDown={(e) => handlePointerDown(e, 'se')}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="absolute bg-white border border-[#3D1E30] rounded-full"
            style={{ width: handleSize, height: handleSize, bottom: -handleSize/2, right: -handleSize/2, cursor: 'nwse-resize' }}
          />
        </>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// Main Editor Component
// ----------------------------------------------------------------------
export function EditorClient({ template }: EditorClientProps) {
  const router = useRouter();
  const [fields, setFields] = React.useState<TemplateField[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  
  const [activeFieldIndex, setActiveFieldIndex] = React.useState<number | null>(null);
  const [showAdvancedIndex, setShowAdvancedIndex] = React.useState<number | null>(null);

  // Scaling
  const [imgScale, setImgScale] = React.useState(1);
  const imageRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await getTemplateFields(template.id);
      if (res.success && res.data) {
        setFields(res.data);
      } else {
        alert("Gagal memuat field: " + res.error);
      }
      setLoading(false);
    }
    load();
  }, [template.id]);

  // Handle window resize to recalculate scale
  React.useEffect(() => {
    const handleResize = () => {
      if (imageRef.current && imageRef.current.naturalWidth > 0) {
        setImgScale(imageRef.current.clientWidth / imageRef.current.naturalWidth);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleImageLoad = () => {
    if (imageRef.current && imageRef.current.naturalWidth > 0) {
      setImgScale(imageRef.current.clientWidth / imageRef.current.naturalWidth);
    }
  };

  const addField = () => {
    const newField: TemplateField = {
      template_id: template.id,
      shape_type: "rect",
      x: Math.round(100 / (imgScale || 1)),
      y: Math.round(100 / (imgScale || 1)),
      width: Math.round(300 / (imgScale || 1)),
      height: Math.round(300 / (imgScale || 1)),
      placeholder_label: "Area Baru " + (fields.length + 1),
      is_editable: true,
      field_role: "image",
      render_mode: "under",
      z_index: fields.length,
    };
    setFields([...fields, newField]);
    setActiveFieldIndex(fields.length);
  };

  const updateField = (index: number, key: keyof TemplateField, value: any) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], [key]: value };
    setFields(newFields);
  };

  // Callback from DraggableBox (receives rendered pixels, converts to natural pixels)
  const handleBoxUpdate = (index: number, rx: number, ry: number, rw: number, rh: number) => {
    const newFields = [...fields];
    newFields[index] = {
      ...newFields[index],
      x: Math.round(rx / imgScale),
      y: Math.round(ry / imgScale),
      width: Math.round(rw / imgScale),
      height: Math.round(rh / imgScale),
    };
    setFields(newFields);
  };

  const removeField = (index: number) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
    if (activeFieldIndex === index) setActiveFieldIndex(null);
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await saveTemplateFields(template.id, fields);
    setSaving(false);
    if (res.success) {
      alert("Area berhasil disimpan!");
      router.push("/admin/templates");
    } else {
      alert("Gagal menyimpan: " + res.error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#C27BA0]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/templates" className="inline-flex items-center text-sm font-semibold text-[#8C4A6E] hover:text-[#C27BA0] mb-2 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Kembali ke Daftar
          </Link>
          <h1 className="text-2xl font-bold text-[#3D1E30]">Editor Interaktif: {template.name}</h1>
          <p className="text-sm text-[#8C4A6E] mt-1">Geser (Drag) dan Tarik Sudut (Resize) kotak pada gambar di panel kanan.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#C27BA0] to-[#8C4A6E] text-white text-sm font-bold rounded-xl hover:shadow-md hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Simpan Konfigurasi
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT PANEL: Simplified Inputs */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-[#F7D6E6] shadow-sm overflow-hidden flex flex-col h-[calc(100vh-200px)]">
            <div className="p-4 border-b border-[#F7D6E6] bg-[#FFF0F7] flex items-center justify-between">
              <h3 className="font-bold text-[#3D1E30] flex items-center gap-2">
                Daftar Area <span className="px-2 py-0.5 bg-[#C27BA0] text-white text-[10px] rounded-full">{fields.length}</span>
              </h3>
              <button
                onClick={addField}
                className="flex items-center gap-1 px-3 py-1.5 bg-white border-2 border-[#C27BA0] text-[#C27BA0] hover:bg-[#C27BA0] hover:text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                <Plus className="h-3.5 w-3.5" /> Tambah Area
              </button>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto space-y-4 bg-slate-50/50" onClick={() => setActiveFieldIndex(null)}>
              {fields.length === 0 ? (
                <div className="text-center py-12 text-[#8C4A6E]/60 text-sm">
                  Belum ada area lubang.<br/>Klik <b>Tambah Area</b> untuk mulai.
                </div>
              ) : (
                fields.map((f, i) => {
                  const color = PALETTE[i % PALETTE.length];
                  const isActive = activeFieldIndex === i;

                  return (
                    <div 
                      key={i} 
                      onClick={(e) => { e.stopPropagation(); setActiveFieldIndex(i); }}
                      className={`p-4 bg-white rounded-xl border-2 transition-all shadow-sm relative cursor-pointer
                        ${isActive ? 'border-[#C27BA0] ring-4 ring-[#FFF0F7]' : 'border-[#F7D6E6] hover:border-[#C27BA0]/50'}`}
                    >
                      {/* Color Indicator */}
                      <div className="absolute top-0 left-0 bottom-0 w-2 rounded-l-lg" style={{ backgroundColor: color }} />
                      
                      <button
                        onClick={(e) => { e.stopPropagation(); removeField(i); }}
                        className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                        title="Hapus area"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                      
                      <div className="pl-3 space-y-3">
                        <div className="space-y-1.5 pr-6">
                          <label className="text-[10px] font-bold text-[#8C4A6E] uppercase tracking-wider">Nama Label</label>
                          <input
                            type="text"
                            value={f.placeholder_label}
                            onChange={(e) => updateField(i, "placeholder_label", e.target.value)}
                            className="w-full px-3 py-2 text-sm font-semibold border border-[#F7D6E6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C27BA0] bg-white transition-shadow"
                            placeholder="Contoh: Foto Produk"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-[#8C4A6E] uppercase tracking-wider">Tipe Konten</label>
                            <select
                              value={f.field_role}
                              onChange={(e) => updateField(i, "field_role", e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-[#F7D6E6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C27BA0] bg-white"
                            >
                              <option value="image">Gambar (Image)</option>
                              <option value="text">Teks (Text)</option>
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-[#8C4A6E] uppercase tracking-wider">Posisi Z</label>
                            <select
                              value={f.render_mode}
                              onChange={(e) => updateField(i, "render_mode", e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-[#F7D6E6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C27BA0] bg-white"
                            >
                              <option value="under">Di Bawah Template</option>
                              <option value="over">Di Atas Template</option>
                            </select>
                          </div>
                        </div>

                        {/* Text Styling Options */}
                        {f.field_role === "text" && (
                          <div className="grid grid-cols-2 gap-3 p-3 bg-[#FFF0F7]/50 rounded-lg border border-[#F7D6E6]/50">
                            <div className="space-y-1.5 col-span-2">
                              <label className="text-[10px] font-bold text-[#8C4A6E] uppercase tracking-wider">Font Family (Fix)</label>
                              <select
                                value={f.font_family || "Poppins"}
                                onChange={(e) => updateField(i, "font_family", e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-[#F7D6E6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C27BA0] bg-white"
                              >
                                <option value="Poppins">Poppins</option>
                                <option value="Inter">Inter</option>
                                <option value="Montserrat">Montserrat</option>
                                <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                                <option value="SF Pro Display">SF Pro</option>
                              </select>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-[#8C4A6E] uppercase tracking-wider">Font Size (px)</label>
                              <input
                                type="number"
                                value={f.font_size || 32}
                                onChange={(e) => updateField(i, "font_size", parseInt(e.target.value) || 12)}
                                className="w-full px-3 py-2 text-sm border border-[#F7D6E6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C27BA0] bg-white"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-[#8C4A6E] uppercase tracking-wider">Font Weight</label>
                              <select
                                value={f.font_weight || "normal"}
                                onChange={(e) => updateField(i, "font_weight", e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-[#F7D6E6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C27BA0] bg-white"
                              >
                                <option value="normal">Normal</option>
                                <option value="500">Medium</option>
                                <option value="600">Semi Bold</option>
                                <option value="bold">Bold</option>
                                <option value="800">Extra Bold</option>
                              </select>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-[#8C4A6E] uppercase tracking-wider">Warna (Hex)</label>
                              <div className="flex gap-2">
                                <input
                                  type="color"
                                  value={f.color || "#000000"}
                                  onChange={(e) => updateField(i, "color", e.target.value)}
                                  className="w-8 h-9 border border-[#F7D6E6] rounded cursor-pointer"
                                />
                                <input
                                  type="text"
                                  value={f.color || "#000000"}
                                  onChange={(e) => updateField(i, "color", e.target.value)}
                                  className="w-full px-3 py-2 text-sm border border-[#F7D6E6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C27BA0] bg-white uppercase"
                                />
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-[#8C4A6E] uppercase tracking-wider">Align</label>
                              <select
                                value={f.text_align || "left"}
                                onChange={(e) => updateField(i, "text_align", e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-[#F7D6E6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C27BA0] bg-white"
                              >
                                <option value="left">Kiri</option>
                                <option value="center">Tengah</option>
                                <option value="right">Kanan</option>
                              </select>
                            </div>
                            <div className="space-y-1.5 col-span-2">
                              <label className="text-[10px] font-bold text-[#8C4A6E] uppercase tracking-wider">Batas Karakter</label>
                              <input
                                type="number"
                                value={f.max_chars || ""}
                                onChange={(e) => updateField(i, "max_chars", parseInt(e.target.value) || undefined)}
                                placeholder="Kosongkan jika tidak ada"
                                className="w-full px-3 py-2 text-sm border border-[#F7D6E6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C27BA0] bg-white"
                              />
                            </div>
                          </div>
                        )}

                        {/* Advanced Accordion */}
                        <div className="pt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowAdvancedIndex(showAdvancedIndex === i ? null : i);
                            }}
                            className="flex items-center text-[11px] font-bold text-[#8C4A6E] hover:text-[#C27BA0] transition-colors"
                          >
                            {showAdvancedIndex === i ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
                            Data Koordinat Asli (Manual)
                          </button>
                          
                          {showAdvancedIndex === i && (
                            <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-[#F7D6E6]/50">
                              <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-500 uppercase">X (px)</label>
                                <input
                                  type="number"
                                  value={f.x}
                                  onChange={(e) => updateField(i, "x", parseInt(e.target.value) || 0)}
                                  className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:border-[#C27BA0]"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-500 uppercase">Y (px)</label>
                                <input
                                  type="number"
                                  value={f.y}
                                  onChange={(e) => updateField(i, "y", parseInt(e.target.value) || 0)}
                                  className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:border-[#C27BA0]"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-500 uppercase">Width</label>
                                <input
                                  type="number"
                                  value={f.width}
                                  onChange={(e) => updateField(i, "width", parseInt(e.target.value) || 0)}
                                  className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:border-[#C27BA0]"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-500 uppercase">Height</label>
                                <input
                                  type="number"
                                  value={f.height}
                                  onChange={(e) => updateField(i, "height", parseInt(e.target.value) || 0)}
                                  className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:border-[#C27BA0]"
                                />
                              </div>
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Visual Interactive Preview */}
        <div className="lg:col-span-8">
          <div 
            className="bg-[url('https://transparenttextures.com/patterns/cubes.png')] bg-[#e5e5e5] rounded-2xl border-2 border-[#F7D6E6] overflow-hidden shadow-inner flex items-center justify-center p-8 min-h-[calc(100vh-200px)] relative"
            onClick={() => setActiveFieldIndex(null)}
          >
            <div className="relative shadow-2xl bg-white/50" style={{ display: "inline-block" }}>
              <img
                ref={imageRef}
                src={template.master_template_url}
                alt="Master Template"
                className="max-w-full max-h-[calc(100vh-250px)] object-contain select-none pointer-events-none"
                onLoad={handleImageLoad}
                crossOrigin="anonymous"
              />
              
              {/* Draggable Overlays */}
              {fields.map((f, i) => {
                const color = PALETTE[i % PALETTE.length];
                const isActive = activeFieldIndex === i;

                // Konversi dari pixel asli (database) ke pixel layar (rendered)
                const renderedX = f.x * imgScale;
                const renderedY = f.y * imgScale;
                const renderedW = f.width * imgScale;
                const renderedH = f.height * imgScale;

                return (
                  <DraggableBox
                    key={i}
                    label={f.placeholder_label || `Area ${i+1}`}
                    color={color}
                    renderedX={renderedX}
                    renderedY={renderedY}
                    renderedW={renderedW}
                    renderedH={renderedH}
                    zIndex={f.render_mode === "over" ? 20 + i : 10 + i}
                    isActive={isActive}
                    onClick={() => setActiveFieldIndex(i)}
                    onUpdate={(rx, ry, rw, rh) => handleBoxUpdate(i, rx, ry, rw, rh)}
                  />
                );
              })}
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-3 text-xs text-[#8C4A6E] font-medium px-2">
            <p>💡 Tips: Klik pada kotak di atas gambar untuk menggeser (drag) atau menarik ujungnya (resize).</p>
            <p>Skala Layar: {Math.round(imgScale * 100)}%</p>
          </div>
        </div>

      </div>
    </div>
  );
}

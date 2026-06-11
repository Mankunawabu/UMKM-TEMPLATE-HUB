"use client";

import * as React from "react";
import { X, ZoomIn, ZoomOut, Move } from "lucide-react";

interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onCrop: (croppedBlob: Blob) => void;
}

export function ImageCropperModal({ isOpen, imageSrc, onClose, onCrop }: ImageCropperModalProps) {
  const [scale, setScale] = React.useState(1);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const dragStart = React.useRef({ x: 0, y: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);
  const imageRef = React.useRef<HTMLImageElement>(null);

  const [imgSize, setImgSize] = React.useState({ w: 240, h: 240 });

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth && naturalHeight) {
      const aspect = naturalWidth / naturalHeight;
      if (aspect >= 1) {
        // Landscape: lock height to 240px, scale width
        setImgSize({ w: 240 * aspect, h: 240 });
      } else {
        // Portrait: lock width to 240px, scale height
        setImgSize({ w: 240, h: 240 / aspect });
      }
    }
  };

  // Reset state when opening a new image
  React.useEffect(() => {
    if (isOpen) {
      setScale(1);
      setOffset({ x: 0, y: 0 });
    }
  }, [isOpen, imageSrc]);

  if (!isOpen || !imageSrc) return null;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.current.x;
    const newY = e.clientY - dragStart.current.y;
    setOffset({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleSave = () => {
    if (!imageRef.current || !containerRef.current) return;

    const img = imageRef.current;
    const cropSize = 512; // output resolution

    // Create a canvas to render the cropped image
    const canvas = document.createElement("canvas");
    canvas.width = cropSize;
    canvas.height = cropSize;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Clear background to white
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, cropSize, cropSize);

    // Get actual bounding rectangles of container and transformed image
    const containerRect = containerRef.current.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();

    if (imgRect.width === 0 || imgRect.height === 0) return;

    const guideSize = 240;

    // Calculate crop guide viewport coordinates (centered in the container)
    const cropLeftViewport = containerRect.left + containerRect.width / 2 - guideSize / 2;
    const cropTopViewport = containerRect.top + containerRect.height / 2 - guideSize / 2;

    // Calculate scale factor between natural image pixels and screen pixels
    const scaleFactor = img.naturalWidth / imgRect.width;

    // Crop box relative to image top-left in screen pixels, then scaled to natural image dimensions
    const sx = (cropLeftViewport - imgRect.left) * scaleFactor;
    const sy = (cropTopViewport - imgRect.top) * scaleFactor;
    const sWidth = guideSize * scaleFactor;
    const sHeight = guideSize * scaleFactor;

    ctx.save();
    // Make output circular
    ctx.beginPath();
    ctx.arc(cropSize / 2, cropSize / 2, cropSize / 2, 0, Math.PI * 2);
    ctx.clip();

    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, cropSize, cropSize);
    ctx.restore();

    canvas.toBlob(
      (blob) => {
        if (blob) {
          onCrop(blob);
        }
      },
      "image/png",
      1.0
    );
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col p-6 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-black text-[#1E293B]">Sesuaikan Foto</h3>
            <p className="text-xs font-semibold text-[#1E293B]">Geser dan perbesar agar pas di dalam lingkaran.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-[#1E293B] hover:bg-[#F3F4F6] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cropper Container */}
        <div 
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative w-full aspect-square rounded-2xl bg-slate-900 overflow-hidden cursor-move touch-none flex items-center justify-center"
        >
          {/* Mask Overlay */}
          <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
            {/* Dark Dimmer Backdrop with a circular cutout */}
            <div className="absolute inset-0 bg-black/60" style={{
              clipPath: "polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%, 0% 0%, calc(50% - 120px) calc(50% - 120px), calc(50% + 120px) calc(50% - 120px), calc(50% + 120px) calc(50% + 120px), calc(50% - 120px) calc(50% + 120px), calc(50% - 120px) calc(50% - 120px))"
            }} />
            
            {/* Guide Circle Border */}
            <div className="w-[240px] h-[240px] rounded-full border-2 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0)]" />
          </div>

          {/* White Canvas Background Box (representing the crop output boundary) */}
          <div className="absolute w-[240px] h-[240px] bg-white pointer-events-none rounded-sm shadow-inner" style={{ zIndex: 0 }} />

          {/* Draggable Image */}
          <img
            ref={imageRef}
            src={imageSrc}
            alt="Source"
            onLoad={handleImageLoad}
            className="max-w-none max-h-none pointer-events-none select-none shrink-0 shadow-lg border border-slate-200/50"
            style={{
              width: `${imgSize.w}px`,
              height: `${imgSize.h}px`,
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
              transformOrigin: "center center"
            }}
          />

          {/* Hint Overlay */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1 opacity-60">
            <Move className="w-3 h-3" />
            <span>Sentuh & seret untuk geser</span>
          </div>
        </div>

        {/* Zoom Slider */}
        <div className="mt-5 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500">
            <span className="flex items-center gap-1"><ZoomOut className="w-3.5 h-3.5" /> Perkecil</span>
            <span>{Math.round(scale * 100)}%</span>
            <span className="flex items-center gap-1">Perbesar <ZoomIn className="w-3.5 h-3.5" /></span>
          </div>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.05"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="w-full accent-[#FF9100] h-2 bg-slate-100 rounded-lg cursor-pointer appearance-none"
          />
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border-2 border-[#FFE6D5] hover:bg-[#F3F4F6] text-slate-700 font-bold rounded-xl text-sm transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 bg-gradient-to-r from-[#FF9100] to-[#E07A00] text-white font-bold rounded-xl text-sm shadow-md hover:shadow-lg transition-all"
          >
            Selesai
          </button>
        </div>

      </div>
    </div>
  );
}

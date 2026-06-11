"use client";

import * as React from "react";
import Link from "next/link";
import { Palette, Eye, X, LayoutGrid, Video, Monitor, Camera, ShoppingBag } from "lucide-react";

interface Template {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  categories: { name: string } | null;
  target_platform?: string | null;
}

interface TemplateCardProps {
  tpl: Template;
  gradient: string;
}

export function TemplateCard({ tpl, gradient }: TemplateCardProps) {
  const [showPreview, setShowPreview] = React.useState(false);

  // Map target_platform to a nice label
  let platformLabel = "Lainnya";
  if (tpl.target_platform === "instagram_feed") platformLabel = "Instagram Feed";
  else if (tpl.target_platform === "instagram_story") platformLabel = "Instagram Story";
  else if (tpl.target_platform === "facebook_post") platformLabel = "Facebook Post";
  else if (tpl.target_platform === "tiktok_post" || tpl.target_platform === "tiktok") platformLabel = "TikTok Post";
  else if (tpl.target_platform === "whatsapp_status") platformLabel = "WhatsApp Status";
  else if (tpl.target_platform === "marketplace") platformLabel = "Marketplace Banner";
  else if (tpl.target_platform) {
    platformLabel = tpl.target_platform.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  }

  // Determine resolution based on platform
  const isPortrait = tpl.target_platform === "instagram_story" || tpl.target_platform === "tiktok_post" || tpl.target_platform === "whatsapp_status" || tpl.target_platform === "tiktok";
  const resolution = isPortrait ? "1080 x 1920 px" : "1080 x 1080 px";

  return (
    <>
      {/* ── CARD ── */}
      <div className="group border border-[#FFE6D5] rounded-2xl overflow-hidden bg-white hover:shadow-lg hover:shadow-[#E07A00]/10 hover:-translate-y-1 transition-all duration-300 flex flex-col">
        {/* Template Thumbnail (Click to Preview) */}
        <div 
          onClick={() => setShowPreview(true)}
          className={`cursor-pointer w-full aspect-square flex items-center justify-center relative overflow-hidden bg-slate-50/50 ${tpl.thumbnail_url ? "" : `bg-gradient-to-tr ${gradient}`}`}
        >
          {tpl.thumbnail_url ? (
            <img
              src={tpl.thumbnail_url}
              alt={tpl.name}
              className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <>
              <Palette className="w-8 h-8 text-[#E07A00]/40 group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </>
          )}
          {tpl.categories?.name && (
            <span className="absolute top-2.5 left-2.5 text-[9px] font-bold bg-white/85 backdrop-blur-sm px-2 py-0.5 rounded-full text-[#E07A00] shadow-sm z-10">
              {tpl.categories.name}
            </span>
          )}

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
          <h4 className="text-xs font-bold text-[#E07A00] truncate">{tpl.name}</h4>
          {tpl.description && (
            <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{tpl.description}</p>
          )}
          <div className="mt-2.5 mt-auto">
            <Link 
              href={`/dashboard/template/${tpl.id}`}
              className="w-full inline-block text-center py-1.5 bg-[#FFF5EE] text-[#E07A00] hover:bg-[#E07A00] hover:text-white transition-colors text-[10px] font-bold rounded-lg border border-[#FFE6D5]"
            >
              Gunakan Template
            </Link>
          </div>
        </div>
      </div>

      {/* ── MODAL PREVIEW ── */}
      {showPreview && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowPreview(false)} />
          
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowPreview(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm hover:bg-[#FFF5EE] text-slate-500 hover:text-[#E07A00] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image */}
            <div className={`w-full md:w-1/2 aspect-square md:aspect-auto flex items-center justify-center relative bg-slate-100 ${tpl.thumbnail_url ? "" : `bg-gradient-to-tr ${gradient}`}`}>
              {tpl.thumbnail_url ? (
                <img
                  src={tpl.thumbnail_url}
                  alt={tpl.name}
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                <Palette className="w-16 h-16 text-[#E07A00]/30" />
              )}
            </div>

            {/* Modal Info */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col bg-white">
              <div className="mb-auto">
                {tpl.categories?.name && (
                  <span className="inline-block mb-3 text-[10px] font-bold bg-[#FFF5EE] px-2.5 py-1 rounded-md text-[#E07A00]">
                    {tpl.categories.name}
                  </span>
                )}
                <h2 className="text-2xl font-extrabold text-[#1E293B] font-heading leading-tight mb-3">
                  {tpl.name}
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  {tpl.description || "Template premium ini siap digunakan untuk mendongkrak penjualan produk Anda. Mudah dikustomisasi dan diunduh."}
                </p>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-3 border-t border-[#FFE6D5]">
                    <span className="text-sm text-slate-500 font-medium">Platform Target</span>
                    <span className="text-sm font-bold text-[#E07A00]">
                      {platformLabel}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-t border-[#FFE6D5]">
                    <span className="text-sm text-slate-500 font-medium">Resolusi</span>
                    <span className="text-sm font-bold text-[#E07A00] bg-[#FFF5EE] px-2 py-0.5 rounded">{resolution}</span>
                  </div>
                </div>
              </div>

              <Link
                href={`/dashboard/template/${tpl.id}`}
                className="mt-8 w-full block text-center px-6 py-3.5 bg-gradient-to-r from-[#FF9100] to-[#E07A00] text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:shadow-[#E07A00]/20 hover:scale-[1.02] transition-all"
              >
                Gunakan Template Ini
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

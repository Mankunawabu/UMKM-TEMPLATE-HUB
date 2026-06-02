"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { FileUploader } from "@/components/admin/file-uploader";
import { createTemplate } from "../actions";

interface Category {
  id: string;
  name: string;
}

interface CreateTemplateFormProps {
  categories: Category[];
  maxUploadMb: number;
}

// Note: To match page.tsx props structure, interface is Category
export function CreateTemplateForm({ categories, maxUploadMb }: CreateTemplateFormProps) {
  const router = useRouter();
  const [templateId] = React.useState(() => crypto.randomUUID());

  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [thumbnailUrl, setThumbnailUrl] = React.useState("");
  const [previewImageUrl, setPreviewImageUrl] = React.useState("");
  const [masterTemplateUrl, setMasterTemplateUrl] = React.useState("");
  const [targetPlatform, setTargetPlatform] = React.useState("instagram_feed");

  const [status, setStatus] = React.useState("draft");

  // Auto slugify name
  React.useEffect(() => {
    const generated = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    setSlug(generated);
  }, [name]);

  const [state, formAction, isPending] = useActionState(createTemplate, null);

  React.useEffect(() => {
    if (state?.success) {
      router.push(`/admin/templates/${templateId}/editor`);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-6">
      {/* Pass generated template ID and metadata to the action */}
      <input type="hidden" name="id" value={templateId} />
      <input type="hidden" name="thumbnail_url" value={thumbnailUrl} />
      <input type="hidden" name="preview_image_url" value={previewImageUrl} />
      <input type="hidden" name="master_template_url" value={masterTemplateUrl} />
      <input type="hidden" name="status" value={status} />
      {/* Send empty object for legacy fabric_json support */}
      <input type="hidden" name="fabric_json" value="{}" />

      <div className="bg-white rounded-2xl border border-[#F7D6E6] p-6 shadow-sm space-y-6">
        {state?.error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded-xl">
            {state.error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT COLUMN: Metadata & Settings */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-[#3D1E30] border-b border-[#F7D6E6] pb-2">
              Informasi Template
            </h3>

            {/* Nama */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-semibold text-[#8C4A6E] tracking-wide uppercase">
                Nama Template
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Banner Promo Lebaran"
                className="w-full px-4 py-2.5 text-sm border border-[#F7D6E6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C27BA0] focus:border-[#C27BA0] transition-colors placeholder-[#8C4A6E]/30 text-[#3D1E30]"
              />
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <label htmlFor="slug" className="text-xs font-semibold text-[#8C4A6E] tracking-wide uppercase">
                Slug Template
              </label>
              <input
                id="slug"
                name="slug"
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="banner-promo-lebaran"
                className="w-full px-4 py-2.5 text-sm border border-[#F7D6E6] bg-slate-50/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C27BA0] focus:border-[#C27BA0] transition-colors placeholder-[#8C4A6E]/30 text-[#3D1E30]"
              />
            </div>

            {/* Kategori */}
            <div className="space-y-1.5">
              <label htmlFor="category_id" className="text-xs font-semibold text-[#8C4A6E] tracking-wide uppercase">
                Kategori Bisnis
              </label>
              <select
                id="category_id"
                name="category_id"
                required
                className="w-full px-4 py-2.5 text-sm border border-[#F7D6E6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C27BA0] focus:border-[#C27BA0] transition-colors text-[#3D1E30] bg-white"
              >
                <option value="">-- Pilih Kategori --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Platform */}
            <div className="space-y-1.5">
              <label htmlFor="target_platform" className="text-xs font-semibold text-[#8C4A6E] tracking-wide uppercase">
                Target Platform
              </label>
              <select
                id="target_platform"
                name="target_platform"
                value={targetPlatform}
                onChange={(e) => setTargetPlatform(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-[#F7D6E6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C27BA0] focus:border-[#C27BA0] transition-colors text-[#3D1E30] bg-white"
              >
                <option value="instagram_feed">Instagram Feed</option>
                <option value="instagram_story">Instagram Story</option>
                <option value="facebook_post">Facebook Post</option>
                <option value="tiktok_post">TikTok Post</option>
                <option value="whatsapp_status">WhatsApp Status</option>
                <option value="marketplace">Marketplace Banner</option>
              </select>
            </div>

            {/* Deskripsi */}
            <div className="space-y-1.5">
              <label htmlFor="description" className="text-xs font-semibold text-[#8C4A6E] tracking-wide uppercase">
                Deskripsi Template
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Berikan deskripsi atau panduan singkat penggunaan template ini..."
                className="w-full px-4 py-2.5 text-sm border border-[#F7D6E6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C27BA0] focus:border-[#C27BA0] transition-colors placeholder-[#8C4A6E]/30 text-[#3D1E30] resize-none"
              />
            </div>
          </div>

          {/* RIGHT COLUMN: Media Uploads & Actions */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-[#3D1E30] border-b border-[#F7D6E6] pb-2">
              Media & Status Publikasi
            </h3>

            {/* Master Template PNG Berlubang */}
            <FileUploader
              bucket="templates_admin"
              folder={`previews/${templateId}/masters`}
              accept="image/*"
              label="Master Template PNG Berlubang (Wajib)"
              maxMb={maxUploadMb}
              onComplete={(url) => setMasterTemplateUrl(url)}
              value={masterTemplateUrl}
            />

            {/* Thumbnail Upload */}
            <FileUploader
              bucket="templates_admin"
              folder={`thumbnails/${templateId}`}
              accept="image/*"
              label="Thumbnail Template (48x48)"
              maxMb={maxUploadMb}
              onComplete={(url) => setThumbnailUrl(url)}
              value={thumbnailUrl}
            />

            {/* Preview Upload */}
            <FileUploader
              bucket="templates_admin"
              folder={`previews/${templateId}`}
              accept="image/*"
              label="Preview Desain (Landscape/Resolusi Penuh)"
              maxMb={maxUploadMb}
              onComplete={(url) => setPreviewImageUrl(url)}
              value={previewImageUrl}
            />

            {/* Status Option */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#8C4A6E] tracking-wide uppercase">
                Status Publikasi
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStatus("draft")}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                    status === "draft"
                      ? "border-[#C27BA0] bg-[#FFF0F7] text-[#C27BA0] shadow-sm"
                      : "border-[#F7D6E6] bg-white text-[#8C4A6E] hover:bg-[#FFF0F7]/10"
                  }`}
                >
                  Draft (Simpan Internal)
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("published")}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                    status === "published"
                      ? "border-[#C27BA0] bg-[#FFF0F7] text-[#C27BA0] shadow-sm"
                      : "border-[#F7D6E6] bg-white text-[#8C4A6E] hover:bg-[#FFF0F7]/10"
                  }`}
                >
                  Published (Tersedia untuk UMKM)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3">
        <Link
          href="/admin/templates"
          className="px-5 py-2.5 text-sm font-bold border border-[#F7D6E6] bg-white rounded-xl text-[#8C4A6E] hover:bg-[#FFF0F7] transition-all"
        >
          Batal
        </Link>
        <button
          type="submit"
          disabled={isPending || !masterTemplateUrl}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-[#C27BA0] text-white rounded-xl hover:bg-[#8C4A6E] transition-all disabled:opacity-50"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Buat Template
        </button>
      </div>
    </form>
  );
}

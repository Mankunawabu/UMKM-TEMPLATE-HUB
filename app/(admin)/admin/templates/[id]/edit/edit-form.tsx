"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { FileUploader } from "@/components/admin/file-uploader";
import { updateTemplate } from "../../actions";

interface Category {
  id: string;
  name: string;
}

interface Template {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  description: string | null;
  thumbnail_url: string | null;
  preview_image_url: string | null;
  master_template_url: string | null;
  target_platform: string | null;
  status: string;
}

interface EditTemplateFormProps {
  categories: Category[];
  template: Template;
  maxUploadMb: number;
}

export function EditTemplateForm({ categories, template, maxUploadMb }: EditTemplateFormProps) {
  const router = useRouter();

  const [name, setName] = React.useState(template.name);
  const [slug, setSlug] = React.useState(template.slug);
  const [thumbnailUrl, setThumbnailUrl] = React.useState(template.thumbnail_url || "");
  const [previewImageUrl, setPreviewImageUrl] = React.useState(template.preview_image_url || "");
  const [masterTemplateUrl, setMasterTemplateUrl] = React.useState(template.master_template_url || "");
  const [targetPlatform, setTargetPlatform] = React.useState(template.target_platform || "instagram_feed");
  const [status, setStatus] = React.useState(template.status || "draft");

  const updateTemplateWithId = updateTemplate.bind(null, template.id);
  const [state, formAction, isPending] = useActionState(updateTemplateWithId, null);

  React.useEffect(() => {
    if (state?.success) {
      router.push("/admin/templates");
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="thumbnail_url" value={thumbnailUrl} />
      <input type="hidden" name="preview_image_url" value={previewImageUrl} />
      <input type="hidden" name="master_template_url" value={masterTemplateUrl} />
      <input type="hidden" name="status" value={status} />

      <div className="bg-white rounded-2xl border border-[#FFE6D5] p-6 shadow-sm space-y-6">
        {state?.error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded-xl">
            {state.error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT COLUMN: Metadata */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-[#3D1E30] border-b border-[#FFE6D5] pb-2">
              Informasi Template
            </h3>

            {/* Nama */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-semibold text-[#E07A00] tracking-wide uppercase">
                Nama Template
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-[#FFE6D5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF9100] focus:border-[#FF9100] transition-colors placeholder-[#E07A00]/30 text-[#3D1E30]"
              />
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <label htmlFor="slug" className="text-xs font-semibold text-[#E07A00] tracking-wide uppercase">
                Slug Template
              </label>
              <input
                id="slug"
                name="slug"
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-[#FFE6D5] bg-slate-50/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF9100] focus:border-[#FF9100] transition-colors placeholder-[#E07A00]/30 text-[#3D1E30]"
              />
            </div>

            {/* Kategori */}
            <div className="space-y-1.5">
              <label htmlFor="category_id" className="text-xs font-semibold text-[#E07A00] tracking-wide uppercase">
                Kategori Bisnis
              </label>
              <select
                id="category_id"
                name="category_id"
                required
                defaultValue={template.category_id}
                className="w-full px-4 py-2.5 text-sm border border-[#FFE6D5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF9100] focus:border-[#FF9100] transition-colors text-[#3D1E30] bg-white"
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
              <label htmlFor="target_platform" className="text-xs font-semibold text-[#E07A00] tracking-wide uppercase">
                Target Platform
              </label>
              <select
                id="target_platform"
                name="target_platform"
                value={targetPlatform}
                onChange={(e) => setTargetPlatform(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-[#FFE6D5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF9100] focus:border-[#FF9100] transition-colors text-[#3D1E30] bg-white"
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
              <label htmlFor="description" className="text-xs font-semibold text-[#E07A00] tracking-wide uppercase">
                Deskripsi Template
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={template.description || ""}
                placeholder="Berikan deskripsi atau panduan singkat penggunaan template ini..."
                className="w-full px-4 py-2.5 text-sm border border-[#FFE6D5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF9100] focus:border-[#FF9100] transition-colors placeholder-[#E07A00]/30 text-[#3D1E30] resize-none"
              />
            </div>
          </div>

          {/* RIGHT COLUMN: Media Uploads & Status */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-[#3D1E30] border-b border-[#FFE6D5] pb-2">
              Media & Status Publikasi
            </h3>

            {/* Master Template PNG Berlubang */}
            <FileUploader
              bucket="templates_admin"
              folder={`previews/${template.id}/masters`}
              accept="image/*"
              label="Master Template PNG Berlubang (Wajib)"
              maxMb={maxUploadMb}
              onComplete={(url) => setMasterTemplateUrl(url)}
              value={masterTemplateUrl}
            />

            {/* Thumbnail Upload */}
            <FileUploader
              bucket="templates_admin"
              folder={`thumbnails/${template.id}`}
              accept="image/*"
              label="Thumbnail Template (48x48)"
              maxMb={maxUploadMb}
              onComplete={(url) => setThumbnailUrl(url)}
              value={thumbnailUrl}
            />

            {/* Preview Upload */}
            <FileUploader
              bucket="templates_admin"
              folder={`previews/${template.id}`}
              accept="image/*"
              label="Preview Desain (Landscape/Resolusi Penuh)"
              maxMb={maxUploadMb}
              onComplete={(url) => setPreviewImageUrl(url)}
              value={previewImageUrl}
            />

            {/* Status Option */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#E07A00] tracking-wide uppercase">
                Status Publikasi
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStatus("draft")}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                    status === "draft"
                      ? "border-[#FF9100] bg-[#FFF5EE] text-[#FF9100] shadow-sm"
                      : "border-[#FFE6D5] bg-white text-[#E07A00] hover:bg-[#FFF5EE]/10"
                  }`}
                >
                  Draft (Simpan Internal)
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("published")}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                    status === "published"
                      ? "border-[#FF9100] bg-[#FFF5EE] text-[#FF9100] shadow-sm"
                      : "border-[#FFE6D5] bg-white text-[#E07A00] hover:bg-[#FFF5EE]/10"
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
          className="px-5 py-2.5 text-sm font-bold border border-[#FFE6D5] bg-white rounded-xl text-[#E07A00] hover:bg-[#FFF5EE] transition-all"
        >
          Batal
        </Link>
        <button
          type="submit"
          disabled={isPending || !masterTemplateUrl}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-[#FF9100] text-white rounded-xl hover:bg-[#E07A00] transition-all disabled:opacity-50"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Simpan Perubahan
        </button>
      </div>
    </form>
  );
}

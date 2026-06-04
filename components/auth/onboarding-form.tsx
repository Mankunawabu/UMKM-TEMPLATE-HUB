"use client";

import { useActionState, startTransition, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Briefcase,
  Phone,
  MapPin,
  UploadCloud,
  X,
  Loader2,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Image as ImageIcon,
} from "lucide-react";
import { submitOnboarding } from "@/app/(onboarding)/onboarding/actions";
import { createClient } from "@/lib/supabase/client";
import { ImageCropperModal } from "../umkm/image-cropper-modal";

// ─────────────────────────────────────────────
// Instagram SVG icon (lucide doesn't have one)
// ─────────────────────────────────────────────
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface Category {
  id: string;
  name: string;
}

interface OnboardingFormProps {
  categories: Category[] | null;
  initialProfile: {
    nama_lengkap?: string | null;
    nama_usaha?: string | null;
    no_wa?: string | null;
  } | null;
  maxUploadMb: number;
}

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const ALLOWED_EXTS = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" } as const;

// ─────────────────────────────────────────────
// LogoUploader sub-component
// ─────────────────────────────────────────────
interface LogoUploaderProps {
  maxUploadMb: number;
  disabled?: boolean;
  onUploadComplete: (url: string) => void;
}

function LogoUploader({ onUploadComplete, disabled, maxUploadMb }: LogoUploaderProps) {
  const MAX_SIZE_BYTES = maxUploadMb * 1024 * 1024;

  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadDone, setUploadDone] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cropper states
  const [cropperSrc, setCropperSrc] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const pendingFileRef = useRef<File | null>(null);

  const processFile = useCallback(
    async (file: File) => {
      // ── validation ──
      if (!ALLOWED_TYPES.includes(file.type)) {
        setUploadError("Format tidak didukung. Gunakan PNG, JPG, atau WEBP.");
        return;
      }
      if (file.size > MAX_SIZE_BYTES) {
        setUploadError(`Ukuran file maksimal ${maxUploadMb} MB.`);
        return;
      }

      setUploadError(null);
      setUploadDone(false);

      // Save file ref and open cropper modal
      pendingFileRef.current = file;
      const objectUrl = URL.createObjectURL(file);
      setCropperSrc(objectUrl);
      setIsCropperOpen(true);
    },
    [maxUploadMb, MAX_SIZE_BYTES]
  );

  const handleCropComplete = async (croppedBlob: Blob) => {
    setIsCropperOpen(false);
    setCropperSrc(null);

    const file = pendingFileRef.current;
    if (!file) return;

    // Show cropped preview locally
    const objectUrl = URL.createObjectURL(croppedBlob);
    setPreview(objectUrl);

    setUploading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sesi tidak valid.");

      // Always upload cropped logo as PNG
      const path = `logos/${user.id}/logo-${Date.now()}.png`;

      const { error: uploadErr } = await supabase.storage
        .from("umkm_assets")
        .upload(path, croppedBlob, { upsert: true, contentType: "image/png" });

      if (uploadErr) throw uploadErr;

      const { data: urlData } = supabase.storage
        .from("umkm_assets")
        .getPublicUrl(path);

      onUploadComplete(urlData.publicUrl);
      setUploadDone(true);
    } catch (err: any) {
      setUploadError(err?.message ?? "Gagal mengunggah logo. Coba lagi.");
      setPreview(null);
    } finally {
      setUploading(false);
      pendingFileRef.current = null;
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      if (disabled || uploading) return;
      const file = e.dataTransfer.files?.[0];
      if (file) processFile(file);
    },
    [disabled, uploading, processFile]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setUploadDone(false);
    setUploadError(null);
    onUploadComplete("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C4A6E] mb-1.5">
        Logo Usaha
      </label>

      {/* Drop Zone & Preview Row */}
      <div className="flex items-center gap-3">
        {/* Drop Zone (Long bar on the left) */}
        <div
          onDragOver={(e) => { e.preventDefault(); if (!disabled && !uploading) setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
          className={[
            "flex-1 h-12 px-4 rounded-xl border border-[#F7D6E6] hover:border-[#C27BA0] bg-[#FFF0F7]/40 hover:bg-[#FFF0F7] cursor-pointer flex items-center gap-2.5 transition-all duration-200 select-none overflow-hidden text-xs font-semibold text-[#8C4A6E]",
            isDragOver ? "ring-2 ring-[#C27BA0]/20 bg-[#FDF0F7]" : "",
            (disabled || uploading) ? "pointer-events-none opacity-70" : "",
          ].join(" ")}
        >
          {uploading ? (
            <Loader2 className="w-4.5 h-4.5 text-[#C27BA0] animate-spin shrink-0" />
          ) : (
            <ImageIcon className="w-4.5 h-4.5 text-[#C27BA0] shrink-0" />
          )}
          <span className="truncate flex-1 text-slate-600 text-[11px] font-sans text-left">
            {uploading
              ? "Mengunggah logo…"
              : preview
                ? preview // show the preview URL/filename
                : "Klik atau seret file logo ke sini"}
          </span>
        </div>

        {/* Preview Area (Circle on the right) */}
        <div className="w-12 h-12 shrink-0 rounded-full border border-[#F7D6E6] bg-white flex items-center justify-center overflow-hidden shadow-xs relative">
          {preview ? (
            <img
               src={preview}
               alt="Logo Usaha"
               className="w-full h-full object-cover rounded-full"
            />
          ) : (
            // Placeholder when no preview is uploaded
            <div className="w-full h-full bg-[#FFF9FC] flex items-center justify-center text-[#C27BA0]/40 rounded-full">
              <User className="w-5 h-5" />
            </div>
          )}
          {/* Overlay loading indicator if uploading new image while preview is already showing */}
          {preview && uploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_TYPES.join(",")}
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled || uploading}
        />
      </div>

      {/* Status row */}
      <div className="flex items-center justify-between min-h-[18px]">
        {uploadError && (
          <p className="text-[11px] text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 shrink-0" />
            {uploadError}
          </p>
        )}
        {uploadDone && !uploadError && (
          <p className="text-[11px] text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 shrink-0" />
            Logo berhasil diunggah
          </p>
        )}
        {preview && (
          <button
            type="button"
            onClick={handleRemove}
            className="ml-auto flex items-center gap-1 text-[11px] text-[#C27BA0] hover:text-[#8C4A6E] transition-colors"
          >
            <X className="w-3 h-3" />
            Hapus
          </button>
        )}
      </div>

      <ImageCropperModal
        isOpen={isCropperOpen}
        imageSrc={cropperSrc}
        onClose={() => {
          setIsCropperOpen(false);
          setCropperSrc(null);
          pendingFileRef.current = null;
        }}
        onCrop={handleCropComplete}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────
export default function OnboardingForm({
  categories,
  initialProfile,
  maxUploadMb,
}: OnboardingFormProps) {
  const [logoUrl, setLogoUrl] = useState<string>("");

  const [state, formAction, isPending] = useActionState(submitOnboarding, null);

  // Fallback categories if DB returns empty
  const fallbackCategories = [
    { id: "fallback-kuliner", name: "🍜 Kuliner (Makanan & Minuman)" },
    { id: "fallback-fashion", name: "👗 Fashion & Pakaian" },
    { id: "fallback-kosmetik", name: "💄 Kosmetik & Kecantikan" },
    { id: "fallback-kerajinan", name: "🛍 Kerajinan Tangan" },
    { id: "fallback-jasa", name: "💼 Jasa & Konsultasi" },
    { id: "fallback-pertanian", name: "🌾 Pertanian & Hasil Alam" },
  ];

  const actualCategories =
    categories && categories.length > 0 ? categories : fallbackCategories;

  return (
    <div className="w-full max-w-2xl p-8 bg-white/90 backdrop-blur-md rounded-[24px] shadow-[0_8px_30px_rgb(194,123,160,0.12)] border border-[#F7D6E6] relative">
      <div className="absolute top-4 right-4 text-[#C27BA0] animate-bounce">
        <Sparkles className="w-6 h-6" />
      </div>

      {/* Header */}
      <div className="mb-8 text-center max-w-md mx-auto">
        <h2 className="text-3xl font-bold tracking-tight text-[#8C4A6E] font-heading">
          Lengkapi Profil Usahamu
        </h2>
        <p className="mt-2 text-sm text-[#C27BA0] font-sans">
          Data ini akan digunakan untuk fitur{" "}
          <strong>Magic Auto Fill</strong> guna membuat desain promosi Anda
          secara otomatis.
        </p>
      </div>

      {/* Global error */}
      {state?.error && (
        <div className="flex items-center gap-2 p-3 mb-6 text-sm text-[#8C4A6E] bg-[#FFF9FC] border border-[#F7D6E6] rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#C27BA0]" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          // Inject the uploaded logo URL into form data
          formData.set("logo_url", logoUrl);
          startTransition(() => {
            formAction(formData);
          });
        }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* ── Left column ── */}
        <div className="space-y-4">
          {/* Nama Lengkap */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C4A6E] mb-1.5">
              Nama Lengkap Pemilik
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <User className="w-4 h-4 text-[#C27BA0]" />
              </div>
              <input
                type="text"
                name="nama_lengkap"
                required
                disabled={isPending}
                defaultValue={initialProfile?.nama_lengkap || ""}
                placeholder="Nama Lengkap Pemilik"
                className="w-full pl-9 pr-3 py-2.5 bg-[#FFF9FC] text-slate-800 placeholder-slate-400 border border-[#F7D6E6] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C27BA0] focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Nama Usaha */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C4A6E] mb-1.5">
              Nama Usaha / Brand
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Briefcase className="w-4 h-4 text-[#C27BA0]" />
              </div>
              <input
                type="text"
                name="nama_usaha"
                required
                disabled={isPending}
                defaultValue={initialProfile?.nama_usaha || ""}
                placeholder="Contoh: Dapur Bunda"
                className="w-full pl-9 pr-3 py-2.5 bg-[#FFF9FC] text-slate-800 placeholder-slate-400 border border-[#F7D6E6] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C27BA0] focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Kategori Usaha */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C4A6E] mb-1.5">
              Kategori Usaha
            </label>
            <div className="relative">
              <select
                name="category_id"
                disabled={isPending}
                className="w-full pl-3 pr-8 py-2.5 bg-[#FFF9FC] text-slate-700 border border-[#F7D6E6] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C27BA0] focus:border-transparent transition-all appearance-none cursor-pointer"
              >
                {actualCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#C27BA0]">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          {/* No WhatsApp */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C4A6E] mb-1.5">
              No WhatsApp Bisnis
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Phone className="w-4 h-4 text-[#C27BA0]" />
              </div>
              <input
                type="tel"
                name="no_wa"
                required
                disabled={isPending}
                defaultValue={initialProfile?.no_wa || ""}
                placeholder="08123456789"
                className="w-full pl-9 pr-3 py-2.5 bg-[#FFF9FC] text-slate-800 placeholder-slate-400 border border-[#F7D6E6] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C27BA0] focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="space-y-4">
          {/* Instagram */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C4A6E] mb-1.5">
              Username Instagram
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <InstagramIcon className="w-4 h-4 text-[#C27BA0]" />
              </div>
              <input
                type="text"
                name="instagram"
                disabled={isPending}
                placeholder="@dapur.bunda"
                className="w-full pl-9 pr-3 py-2.5 bg-[#FFF9FC] text-slate-800 placeholder-slate-400 border border-[#F7D6E6] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C27BA0] focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Alamat Usaha */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C4A6E] mb-1.5">
              Alamat Usaha / Toko
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <MapPin className="w-4 h-4 text-[#C27BA0]" />
              </div>
              <textarea
                name="alamat"
                disabled={isPending}
                placeholder="Jl. Mawar Indah No. 12, Jakarta"
                rows={2}
                className="w-full pl-9 pr-3 py-2 bg-[#FFF9FC] text-slate-800 placeholder-slate-400 border border-[#F7D6E6] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C27BA0] focus:border-transparent transition-all resize-none"
              />
            </div>
          </div>

          {/* Logo Upload */}
          <LogoUploader
            disabled={isPending}
            maxUploadMb={maxUploadMb}
            onUploadComplete={(url) => setLogoUrl(url)}
          />
        </div>

        {/* ── Submit button ── */}
        <div className="md:col-span-2 pt-4">
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 py-4 bg-[#C27BA0] hover:bg-[#8C4A6E] text-white font-bold rounded-xl text-sm transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-75 disabled:cursor-not-allowed active:scale-[0.99]"
          >
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Simpan & Buka Dashboard</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

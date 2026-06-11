"use client";

import * as React from "react";
import { Upload, X, FileJson, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface FileUploaderProps {
  bucket: string;
  folder: string; // e.g. "thumbnails/temp" or "assets/sticker"
  accept: string; // e.g. "image/*" or ".json"
  maxMb?: number;
  onComplete: (url: string) => void;
  value?: string; // Pre-existing URL
  label?: string;
}

export function FileUploader({
  bucket,
  folder,
  accept,
  maxMb = 5,
  onComplete,
  value = "",
  label,
}: FileUploaderProps) {
  const [dragActive, setDragActive] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const [fileUrl, setFileUrl] = React.useState<string>(value);
  const [fileName, setFileName] = React.useState<string>("");

  React.useEffect(() => {
    setFileUrl(value);
  }, [value]);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndUploadFile = async (file: File) => {
    setError(null);
    setProgress(0);

    // Validate size
    if (file.size > maxMb * 1024 * 1024) {
      setError(`Ukuran file maksimal adalah ${maxMb}MB.`);
      return;
    }

    // Validate type (basic)
    if (accept.includes("image/*") && !file.type.startsWith("image/")) {
      setError("File harus berupa gambar.");
      return;
    }
    if (accept.includes(".json") && !file.name.endsWith(".json") && file.type !== "application/json") {
      setError("File harus berupa JSON.");
      return;
    }

    setUploading(true);
    setFileName(file.name);

    try {
      // Create unique path
      const fileExt = file.name.split(".").pop();
      const sanitizedName = file.name
        .replace(/[^a-zA-Z0-9]/g, "_")
        .toLowerCase();
      const uniqueId = Math.random().toString(36).substring(2, 11);
      const filePath = `${folder}/${uniqueId}_${sanitizedName}.${fileExt}`;

      // Upload file
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(filePath);

      setFileUrl(publicUrl);
      onComplete(publicUrl);
      setProgress(100);
    } catch (err: any) {
      console.error("Error uploading file:", err);
      setError(err.message || "Gagal mengunggah file. Silakan coba lagi.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await validateAndUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await validateAndUploadFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setFileUrl("");
    setFileName("");
    setProgress(0);
    setError(null);
    onComplete("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isImage = accept.includes("image/*") || fileUrl.match(/\.(jpeg|jpg|gif|png|webp|svg)/i);

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-xs font-semibold text-[#E07A00] tracking-wide uppercase">
          {label}
        </label>
      )}

      <div
        className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 min-h-[140px] transition-all ${
          dragActive
            ? "border-[#FF9100] bg-[#FFF5EE]"
            : "border-[#FFE6D5] bg-white hover:border-[#FF9100] hover:bg-[#FFF5EE]/10"
        } ${error ? "border-red-300 bg-red-50/10" : ""}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:pointer-events-none"
          disabled={uploading}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-3 py-2">
            <Loader2 className="h-8 w-8 text-[#FF9100] animate-spin" />
            <div className="text-sm font-semibold text-[#3D1E30]">
              Mengunggah {fileName}...
            </div>
            <div className="w-48 bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#FF9100] h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        ) : fileUrl ? (
          <div className="flex flex-col items-center gap-4 w-full">
            {isImage ? (
              <div className="relative group w-32 h-32 rounded-xl border border-[#FFE6D5] bg-[#FFF5EE]/30 overflow-hidden flex items-center justify-center p-1">
                <img
                  src={fileUrl}
                  alt="Preview"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
            ) : (
              <div className="flex items-center gap-3 bg-[#FFF5EE] border border-[#FFE6D5] px-4 py-2.5 rounded-xl max-w-full">
                <FileJson className="h-5 w-5 text-[#FF9100] shrink-0" />
                <span className="text-xs font-semibold text-[#E07A00] truncate max-w-[200px]">
                  {fileName || fileUrl.split("/").pop()}
                </span>
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              </div>
            )}

            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-xl transition-all"
            >
              <X className="h-3.5 w-3.5" />
              Hapus File
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center gap-2 py-2 pointer-events-none">
            <div className="p-3 bg-[#FFF5EE] rounded-2xl border border-[#FFE6D5]">
              <Upload className="h-6 w-6 text-[#FF9100]" />
            </div>
            <div className="text-sm font-bold text-[#3D1E30]">
              Drag & Drop file di sini, atau <span className="text-[#FF9100] underline">Pilih File</span>
            </div>
            <div className="text-xs font-medium text-[#E07A00]">
              {accept.includes("image/*") ? "Format Gambar (PNG, JPG, WEBP)" : "Format JSON (.json)"} hingga {maxMb}MB
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs font-semibold text-red-600 px-1">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </div>
      )}
    </div>
  );
}

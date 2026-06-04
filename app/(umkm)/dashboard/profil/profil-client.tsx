"use client";

import { useActionState, startTransition, useState, useRef, useCallback } from "react";
import {
  User,
  Briefcase,
  Phone,
  MapPin,
  Loader2,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Check,
  Image as ImageIcon,
  X,
  Lock,
  Eye,
  EyeOff,
  ShieldAlert
} from "lucide-react";
import { updateBusinessInfo, updatePassword } from "./actions";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/admin/page-header";
import { ImageCropperModal } from "@/components/umkm/image-cropper-modal";

// ─────────────────────────────────────────────
// Instagram SVG icon
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
// Constants
// ─────────────────────────────────────────────
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const ALLOWED_EXTS = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" } as const;

interface ProfilClientProps {
  initialProfile: any;
  categories: { id: string; name: string }[];
  maxUploadMb: number;
}

export function ProfilClient({ initialProfile, categories, maxUploadMb }: ProfilClientProps) {
  const MAX_SIZE_BYTES = maxUploadMb * 1024 * 1024;
  
  const [activeTab, setActiveTab] = useState<"bisnis" | "kontak" | "keamanan">("bisnis");
  
  // Business Info State
  const [logoUrl, setLogoUrl] = useState<string>(initialProfile?.logo_url || "");
  const [businessState, businessAction, isBusinessPending] = useActionState(updateBusinessInfo, null);
  const [businessSuccess, setBusinessSuccess] = useState(false);

  // Password State
  const [passwordState, passwordAction, isPasswordPending] = useActionState(updatePassword, null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPasswordValue, setNewPasswordValue] = useState("");

  const reqLength = newPasswordValue.length >= 8;
  const reqUpper = /[A-Z]/.test(newPasswordValue);
  const reqLower = /[a-z]/.test(newPasswordValue);
  const reqNum = /\d/.test(newPasswordValue);
  const reqSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPasswordValue);

  // Uploader logic
  const [preview, setPreview] = useState<string | null>(initialProfile?.logo_url || null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cropper states
  const [cropperSrc, setCropperSrc] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const pendingFileRef = useRef<File | null>(null);

  const processFile = useCallback(async (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError("Format tidak didukung. Gunakan PNG, JPG, atau WEBP.");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setUploadError(`Ukuran maksimal ${maxUploadMb} MB.`);
      return;
    }

    setUploadError(null);

    // Save file ref and open cropper modal
    pendingFileRef.current = file;
    const objectUrl = URL.createObjectURL(file);
    setCropperSrc(objectUrl);
    setIsCropperOpen(true);
  }, [maxUploadMb, MAX_SIZE_BYTES]);

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

      setLogoUrl(urlData.publicUrl);
    } catch (err: any) {
      setUploadError(err?.message || "Gagal mengunggah logo.");
      setPreview(initialProfile?.logo_url || null);
    } finally {
      setUploading(false);
      pendingFileRef.current = null;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleRemoveLogo = () => {
    setPreview(null);
    setLogoUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleBusinessSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusinessSuccess(false);
    const formData = new FormData(e.currentTarget);
    formData.set("logo_url", logoUrl);
    
    startTransition(() => {
      businessAction(formData);
      // We will show success message using useEffect if state has no error, but let's just use a simple timeout for UX
      setTimeout(() => setBusinessSuccess(true), 1000);
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordSuccess(false);
    startTransition(() => {
      passwordAction(new FormData(e.currentTarget));
      setTimeout(() => setPasswordSuccess(true), 1000);
    });
  };

  const tabs = [
    { id: "bisnis", label: "Informasi Bisnis", icon: Briefcase },
    { id: "kontak", label: "Kontak & Sosmed", icon: Phone },
    { id: "keamanan", label: "Keamanan Akun", icon: Lock },
  ] as const;

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Profil Toko & Bisnis"
        subtitle="Kelola identitas merek, informasi kontak, dan keamanan akun UMKM Anda"
      />
      <div className="flex flex-col md:flex-row gap-6">
        {/* TABS SIDEBAR */}
        <div className="w-full md:w-64 shrink-0 flex flex-row md:flex-col gap-1 border-b md:border-b-0 md:border-r border-[#F7D6E6] pb-2 md:pb-0 md:pr-4 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-[#C27BA0] text-white shadow-sm"
                    : "text-[#8C4A6E] hover:bg-[#FFF0F7]"
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB CONTENTS */}
        <div className="flex-1 bg-white rounded-2xl border border-[#F7D6E6] p-6 md:p-8 shadow-sm min-h-[400px]">
          {/* TAB 1 & 2: BISNIS & KONTAK */}
          {(activeTab === "bisnis" || activeTab === "kontak") && (
            <form onSubmit={handleBusinessSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            
            {businessState?.error && (
              <div className="flex items-center gap-2 p-3 text-sm text-[#8C4A6E] bg-[#FFF9FC] border border-[#F7D6E6] rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#C27BA0]" />
                <span>{businessState.error}</span>
              </div>
            )}

            {businessSuccess && !businessState?.error && !isBusinessPending && (
              <div className="flex items-center gap-2 p-3 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                <span>Profil berhasil diperbarui!</span>
              </div>
            )}

            {activeTab === "bisnis" && (
              <div className="space-y-4">
                {/* Logo Uploader */}
                <div className="mb-6">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8C4A6E] mb-2">Logo Usaha</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#F7D6E6] bg-[#FFF0F7]/50 flex items-center justify-center overflow-hidden relative">
                      {preview ? (
                        <img src={preview} alt="Logo" className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <User className="w-8 h-8 text-[#C27BA0]/40 rounded-full" />
                      )}
                      {uploading && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Loader2 className="w-6 h-6 text-white animate-spin" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <input 
                        ref={fileInputRef} 
                        type="file" 
                        accept={ALLOWED_TYPES.join(",")} 
                        className="hidden" 
                        onChange={handleFileChange} 
                        disabled={isBusinessPending || uploading} 
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isBusinessPending || uploading}
                          className="px-4 py-2 text-xs font-bold bg-[#FFF0F7] text-[#C27BA0] hover:bg-[#F7D6E6] rounded-lg transition-colors"
                        >
                          Pilih Gambar
                        </button>
                        {preview && (
                          <button
                            type="button"
                            onClick={handleRemoveLogo}
                            className="px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            Hapus
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium mt-1">
                        Format: JPG, PNG, WEBP. Maksimal ukuran {maxUploadMb} MB.
                      </p>
                      {uploadError && <p className="text-[10px] text-red-500">{uploadError}</p>}
                    </div>
                  </div>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C4A6E] mb-1.5">Nama Lengkap Pemilik</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><User className="w-4 h-4 text-[#C27BA0]" /></div>
                      <input type="text" name="nama_lengkap" defaultValue={initialProfile?.nama_lengkap || ""} disabled={isBusinessPending} className="w-full pl-9 pr-3 py-2.5 bg-[#FFF9FC] border border-[#F7D6E6] rounded-xl text-sm focus:ring-2 focus:ring-[#C27BA0] focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C4A6E] mb-1.5">Nama Usaha / Brand</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><Briefcase className="w-4 h-4 text-[#C27BA0]" /></div>
                      <input type="text" name="nama_usaha" defaultValue={initialProfile?.nama_usaha || ""} disabled={isBusinessPending} className="w-full pl-9 pr-3 py-2.5 bg-[#FFF9FC] border border-[#F7D6E6] rounded-xl text-sm focus:ring-2 focus:ring-[#C27BA0] focus:outline-none" />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C4A6E] mb-1.5">Kategori Usaha</label>
                    <select name="category_id" defaultValue={initialProfile?.category_id || ""} disabled={isBusinessPending} className="w-full px-3 py-2.5 bg-[#FFF9FC] border border-[#F7D6E6] rounded-xl text-sm focus:ring-2 focus:ring-[#C27BA0] focus:outline-none">
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "kontak" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C4A6E] mb-1.5">No WhatsApp Bisnis</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><Phone className="w-4 h-4 text-[#C27BA0]" /></div>
                      <input type="tel" name="no_wa" defaultValue={initialProfile?.no_wa || ""} disabled={isBusinessPending} className="w-full pl-9 pr-3 py-2.5 bg-[#FFF9FC] border border-[#F7D6E6] rounded-xl text-sm focus:ring-2 focus:ring-[#C27BA0] focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C4A6E] mb-1.5">Username Instagram</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><InstagramIcon className="w-4 h-4 text-[#C27BA0]" /></div>
                      <input type="text" name="instagram" defaultValue={initialProfile?.instagram || ""} placeholder="@" disabled={isBusinessPending} className="w-full pl-9 pr-3 py-2.5 bg-[#FFF9FC] border border-[#F7D6E6] rounded-xl text-sm focus:ring-2 focus:ring-[#C27BA0] focus:outline-none" />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C4A6E] mb-1.5">Alamat Usaha / Toko</label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 pointer-events-none"><MapPin className="w-4 h-4 text-[#C27BA0]" /></div>
                      <textarea name="alamat" rows={3} defaultValue={initialProfile?.alamat || ""} disabled={isBusinessPending} className="w-full pl-9 pr-3 py-2 bg-[#FFF9FC] border border-[#F7D6E6] rounded-xl text-sm focus:ring-2 focus:ring-[#C27BA0] focus:outline-none resize-none" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Hidden fields to preserve data when submitting from partial tabs */}
            {activeTab === "bisnis" && (
              <>
                <input type="hidden" name="no_wa" value={initialProfile?.no_wa || ""} />
                <input type="hidden" name="instagram" value={initialProfile?.instagram || ""} />
                <input type="hidden" name="alamat" value={initialProfile?.alamat || ""} />
              </>
            )}
            {activeTab === "kontak" && (
              <>
                <input type="hidden" name="nama_lengkap" value={initialProfile?.nama_lengkap || ""} />
                <input type="hidden" name="nama_usaha" value={initialProfile?.nama_usaha || ""} />
                <input type="hidden" name="category_id" value={initialProfile?.category_id || ""} />
              </>
            )}

            <div className="pt-4 border-t border-[#F7D6E6]">
              <button
                type="submit"
                disabled={isBusinessPending || uploading}
                className="w-full sm:w-auto px-8 py-3 bg-[#C27BA0] hover:bg-[#8C4A6E] text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-75"
              >
                {isBusinessPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Simpan Perubahan
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: KEAMANAN */}
        {activeTab === "keamanan" && (
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            
            {passwordState?.error && (
              <div className="flex items-center gap-2 p-3 text-sm text-[#8C4A6E] bg-[#FFF9FC] border border-[#F7D6E6] rounded-xl max-w-md">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#C27BA0]" />
                <span>{passwordState.error}</span>
              </div>
            )}

            {passwordSuccess && !passwordState?.error && !isPasswordPending && (
              <div className="flex items-center gap-2 p-3 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl max-w-md">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                <span>Password berhasil diperbarui!</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C4A6E] mb-1.5">Password Saat Ini</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><Lock className="w-4 h-4 text-[#C27BA0]" /></div>
                    <input type={showCurrentPassword ? "text" : "password"} name="current_password" required disabled={isPasswordPending} className="w-full pl-9 pr-10 py-2.5 bg-[#FFF9FC] border border-[#F7D6E6] rounded-xl text-sm focus:ring-2 focus:ring-[#C27BA0] focus:outline-none" />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#C27BA0] hover:text-[#8C4A6E]"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C4A6E] mb-1.5">Password Baru</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><Lock className="w-4 h-4 text-[#C27BA0]" /></div>
                    <input 
                      type={showNewPassword ? "text" : "password"} 
                      name="new_password" 
                      required 
                      minLength={8} 
                      disabled={isPasswordPending} 
                      value={newPasswordValue}
                      onChange={(e) => setNewPasswordValue(e.target.value)}
                      className="w-full pl-9 pr-10 py-2.5 bg-[#FFF9FC] border border-[#F7D6E6] rounded-xl text-sm focus:ring-2 focus:ring-[#C27BA0] focus:outline-none" 
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#C27BA0] hover:text-[#8C4A6E]"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C4A6E] mb-1.5">Konfirmasi Password Baru</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><Lock className="w-4 h-4 text-[#C27BA0]" /></div>
                    <input type={showConfirmPassword ? "text" : "password"} name="confirm_password" required minLength={8} disabled={isPasswordPending} className="w-full pl-9 pr-10 py-2.5 bg-[#FFF9FC] border border-[#F7D6E6] rounded-xl text-sm focus:ring-2 focus:ring-[#C27BA0] focus:outline-none" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#C27BA0] hover:text-[#8C4A6E]"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#F7D6E6]">
                  <button
                    type="submit"
                    disabled={isPasswordPending}
                    className="w-full px-8 py-3 bg-[#C27BA0] hover:bg-[#8C4A6E] text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-75"
                  >
                    {isPasswordPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Perbarui Password"}
                  </button>
                </div>
              </div>

              {/* RIGHT COLUMN: Password Requirements */}
              <div>
                <div className="p-4 bg-[#FFF9FC] border border-[#F7D6E6]/50 rounded-xl space-y-2 font-sans h-full">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#8C4A6E] mb-3">
                    Syarat Keamanan Password:
                  </p>
                  {[
                    { label: "Minimal 8 karakter", met: reqLength },
                    { label: "Minimal 1 huruf besar (A-Z)", met: reqUpper },
                    { label: "Minimal 1 huruf kecil (a-z)", met: reqLower },
                    { label: "Minimal 1 angka (0-9)", met: reqNum },
                    { label: "Minimal 1 karakter khusus / simbol", met: reqSpecial },
                  ].map((req, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-sm">
                      {req.met ? (
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] text-slate-400 font-bold shrink-0">
                          •
                        </div>
                      )}
                      <span className={req.met ? "text-emerald-700 font-semibold" : "text-slate-500 font-medium"}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                  <p className="mt-5 text-[11px] text-slate-400 font-medium pt-3 border-t border-[#F7D6E6]/50">
                    Pastikan indikator di atas hijau semua sebelum menyimpan password.
                  </p>
                </div>
              </div>
            </div>
          </form>
        )}
        </div>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import { useActionState } from "react";
import { 
  Check, 
  Loader2, 
  AlertTriangle,
  Lock,
  Zap,
  ShieldAlert,
  Wand2
} from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import {
  updateMaintenanceSettings,
  updateAccessSettings,
  updateLimitsSettings,
  updateAiSettings,
  getGroqModels
} from "./actions";

interface SettingItem {
  setting_key: string;
  setting_value: any;
}

interface SettingsClientProps {
  initialSettings: SettingItem[];
}

export function SettingsClient({ initialSettings }: SettingsClientProps) {
  const [activeTab, setActiveTab] = React.useState<"maintenance" | "access" | "limits" | "ai_magic">("maintenance");

  // Parse initial config values
  const maintenanceSettings = initialSettings.find((s) => s.setting_key === "maintenance")?.setting_value || {
    is_maintenance_mode: false,
    maintenance_message: "Sistem sedang dalam perbaikan rutin. Silakan kembali dalam beberapa jam.",
  };
  const accessSettings = initialSettings.find((s) => s.setting_key === "access")?.setting_value || {
    enable_registration: false,
  };
  const limitsSettings = initialSettings.find((s) => s.setting_key === "limits")?.setting_value || {
    daily_export_limit: 5,
    export_quality: "standard",
  };
  const aiSettings = initialSettings.find((s) => s.setting_key === "ai_magic")?.setting_value || {
    ai_model: "llama-3.3-70b-versatile",
    ai_prompt: "Bertindaklah sebagai ahli copywriting marketing handal.\nBuatlah 1 kalimat promosi singkat yang sangat menarik, kreatif, dan bikin penasaran (maksimal 40 huruf) untuk produk atau layanan berikut: \"{keyword}\".\nJangan gunakan tanda kutip di hasil akhir. Jangan gunakan awalan seperti \"Ini dia\", \"Halo\", atau \"Berikut\". Langsung tuliskan kalimat utamanya.",
    ai_max_tokens: 50,
  };

  // State local for interactive elements
  const [isMaintenance, setIsMaintenance] = React.useState(maintenanceSettings.is_maintenance_mode);
  const [enableReg, setEnableReg] = React.useState(accessSettings.enable_registration);

  // useActionState handles
  const [mState, mFormAction, mPending] = useActionState(updateMaintenanceSettings, null);
  const [aState, aFormAction, aPending] = useActionState(updateAccessSettings, null);
  const [lState, lFormAction, lPending] = useActionState(updateLimitsSettings, null);
  const [aiState, aiFormAction, aiPending] = useActionState(updateAiSettings, null);

  const [toast, setToast] = React.useState<string | null>(null);
  
  // For Groq Models
  const [groqModels, setGroqModels] = React.useState<any[]>([]);
  const [isLoadingModels, setIsLoadingModels] = React.useState(false);

  React.useEffect(() => {
    if (mState?.success || aState?.success || lState?.success || aiState?.success) {
      setToast("Pengaturan berhasil disimpan!");
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [mState, aState, lState, aiState]);

  // Fetch Groq models once on mount
  React.useEffect(() => {
    let mounted = true;
    async function fetchModels() {
      setIsLoadingModels(true);
      const res = await getGroqModels();
      if (mounted && res.success && res.models) {
        setGroqModels(res.models);
      }
      if (mounted) setIsLoadingModels(false);
    }
    fetchModels();
    return () => { mounted = false; };
  }, []);

  const tabs = [
    { id: "maintenance", label: "Mode Pemeliharaan", icon: ShieldAlert },
    { id: "access", label: "Kebijakan Akses", icon: Lock },
    { id: "limits", label: "Batas Penggunaan", icon: Zap },
    { id: "ai_magic", label: "AI Magic", icon: Wand2 },
  ] as const;

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Pengaturan Sistem"
        subtitle="Konfigurasi kontrol akses dan pembatasan penggunaan sistem"
      />

      {toast && (
        <div className="fixed bottom-5 right-5 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 z-50 animate-bounce text-sm font-bold">
          <Check className="h-4.5 w-4.5" />
          {toast}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* TABS SIDEBAR */}
        <div className="w-full md:w-64 shrink-0 flex flex-row md:flex-col gap-1 border-b md:border-b-0 md:border-r border-[#F7D6E6] pb-2 md:pb-0 md:pr-4 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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
        <div className="flex-1 bg-white rounded-2xl border border-[#F7D6E6] p-6 shadow-sm min-h-[400px]">
          {/* TAB 1: MAINTENANCE MODE */}
          {activeTab === "maintenance" && (
            <form action={mFormAction} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h3 className="text-lg font-bold text-[#8C4A6E] flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5" /> Mode Pemeliharaan (Maintenance)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Aktifkan ini jika Anda sedang melakukan perbaikan server atau menambah template besar-besaran agar UMKM tidak mengalami error di tengah jalan.
                </p>
              </div>

              {mState?.error && (
                <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> {mState.error}
                </div>
              )}

              <div className="space-y-5">
                <div className="flex items-center justify-between p-4 border border-[#F7D6E6] bg-[#FFF0F7]/30 rounded-xl">
                  <div>
                    <h4 className="text-sm font-bold text-[#3D1E30]">Aktifkan Mode Pemeliharaan</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Semua UMKM akan diblokir dari login dan dialihkan ke halaman peringatan.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="hidden" name="is_maintenance_mode" value={isMaintenance ? "true" : "false"} />
                    <input type="checkbox" checked={isMaintenance} onChange={(e) => setIsMaintenance(e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                  </label>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#8C4A6E] uppercase">Pesan Pemeliharaan</label>
                  <textarea
                    name="maintenance_message"
                    rows={3}
                    defaultValue={maintenanceSettings.maintenance_message}
                    className="w-full px-4 py-2.5 text-sm border border-[#F7D6E6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C27BA0]"
                  />
                  <p className="text-[10px] text-slate-400">Pesan ini akan ditampilkan kepada UMKM saat mode pemeliharaan aktif.</p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#F7D6E6] flex justify-end">
                <button type="submit" disabled={mPending} className="flex items-center gap-2 bg-[#C27BA0] hover:bg-[#8C4A6E] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50">
                  {mPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Simpan Mode Pemeliharaan
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: ACCESS POLICY */}
          {activeTab === "access" && (
            <form action={aFormAction} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h3 className="text-lg font-bold text-[#8C4A6E] flex items-center gap-2">
                  <Lock className="h-5 w-5" /> Kebijakan Akses & Pendaftaran
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Atur bagaimana pengguna baru dapat mengakses platform ini.
                </p>
              </div>

              {aState?.error && (
                <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> {aState.error}
                </div>
              )}

              <div className="space-y-5">
                <div className="flex items-center justify-between p-4 border border-[#F7D6E6] bg-[#FFF0F7]/30 rounded-xl">
                  <div>
                    <h4 className="text-sm font-bold text-[#3D1E30]">Izinkan Pendaftaran Mandiri (Self-Registration)</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Jika aktif, UMKM dapat mendaftar sendiri melalui halaman Register. Jika nonaktif, HANYA admin yang bisa membuatkan akun.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="hidden" name="enable_registration" value={enableReg ? "true" : "false"} />
                    <input type="checkbox" checked={enableReg} onChange={(e) => setEnableReg(e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C27BA0]"></div>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-[#F7D6E6] flex justify-end">
                <button type="submit" disabled={aPending} className="flex items-center gap-2 bg-[#C27BA0] hover:bg-[#8C4A6E] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50">
                  {aPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Simpan Kebijakan Akses
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: LIMITS */}
          {activeTab === "limits" && (
            <form action={lFormAction} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h3 className="text-lg font-bold text-[#8C4A6E] flex items-center gap-2">
                  <Zap className="h-5 w-5" /> Batas Penggunaan Ekspor
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Atur limitasi agar server tidak terbebani oleh spammer atau penggunaan berlebih.
                </p>
              </div>

              {lState?.error && (
                <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> {lState.error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#8C4A6E] uppercase">Limit Ekspor Harian per UMKM</label>
                  <input
                    type="number"
                    name="daily_export_limit"
                    min={1}
                    max={100}
                    defaultValue={limitsSettings.daily_export_limit}
                    className="w-full px-4 py-2.5 text-sm border border-[#F7D6E6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C27BA0]"
                  />
                  <p className="text-[10px] text-slate-400">Berapa kali UMKM bisa mengunduh desain dalam 1 hari.</p>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#8C4A6E] uppercase">Maks Upload Gambar (MB)</label>
                  <input
                    type="number"
                    name="max_upload_mb"
                    min={1}
                    max={50}
                    defaultValue={limitsSettings.max_upload_mb || 5}
                    className="w-full px-4 py-2.5 text-sm border border-[#F7D6E6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C27BA0]"
                  />
                  <p className="text-[10px] text-slate-400">Batas ukuran file maksimal bagi UMKM saat mengunggah aset.</p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#F7D6E6] flex justify-end">
                <button type="submit" disabled={lPending} className="flex items-center gap-2 bg-[#C27BA0] hover:bg-[#8C4A6E] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50">
                  {lPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Simpan Batas Penggunaan
                </button>
              </div>
            </form>
          )}
          {/* TAB 4: AI MAGIC */}
          {activeTab === "ai_magic" && (
            <form action={aiFormAction} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h3 className="text-lg font-bold text-[#8C4A6E] flex items-center gap-2">
                  <Wand2 className="h-5 w-5" /> Pengaturan AI Magic
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Atur model AI (Groq), instruksi (prompt), dan batasan untuk pembuatan kalimat otomatis.
                </p>
              </div>

              {aiState?.error && (
                <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> {aiState.error}
                </div>
              )}

              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#8C4A6E] uppercase">Model Groq AI</label>
                  {isLoadingModels ? (
                    <div className="flex items-center gap-2 text-sm text-slate-500 py-2.5">
                      <Loader2 className="w-4 h-4 animate-spin" /> Memuat model...
                    </div>
                  ) : (
                    <select
                      name="ai_model"
                      defaultValue={aiSettings.ai_model}
                      className="w-full px-4 py-2.5 text-sm border border-[#F7D6E6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C27BA0] bg-white cursor-pointer"
                    >
                      {groqModels.length > 0 ? (
                        groqModels.filter(m => m.active).map(m => (
                          <option key={m.id} value={m.id}>{m.id} (oleh {m.owned_by})</option>
                        ))
                      ) : (
                        <option value={aiSettings.ai_model}>{aiSettings.ai_model} (Fallback)</option>
                      )}
                    </select>
                  )}
                  <p className="text-[10px] text-slate-400">Pilih model LLM yang ingin digunakan secara dinamis.</p>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#8C4A6E] uppercase">System Prompt (Instruksi)</label>
                  <textarea
                    name="ai_prompt"
                    rows={5}
                    defaultValue={aiSettings.ai_prompt}
                    className="w-full px-4 py-2.5 text-sm border border-[#F7D6E6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C27BA0] resize-y min-h-[100px]"
                  />
                  <p className="text-[10px] text-slate-400">Gunakan tag <code className="bg-slate-100 px-1 py-0.5 rounded text-[#C27BA0]">{"{keyword}"}</code> sebagai tempat kata kunci produk/jasa dari UMKM disisipkan.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#8C4A6E] uppercase">Max Tokens (Panjang Kata)</label>
                  <input
                    type="number"
                    name="ai_max_tokens"
                    min={10}
                    max={1000}
                    defaultValue={aiSettings.ai_max_tokens}
                    className="w-full px-4 py-2.5 text-sm border border-[#F7D6E6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C27BA0]"
                  />
                  <p className="text-[10px] text-slate-400">Jumlah token maksimal yang diizinkan untuk di-generate (50 token ~ 35 kata).</p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#F7D6E6] flex justify-end">
                <button type="submit" disabled={aiPending} className="flex items-center gap-2 bg-[#C27BA0] hover:bg-[#8C4A6E] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50">
                  {aiPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Simpan AI Magic
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

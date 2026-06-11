import { redirect } from "next/navigation";
import { getCurrentUser, getCurrentProfile } from "@/lib/auth";
import { getExportLogs } from "./actions";
import { History } from "lucide-react";
import { RiwayatClient } from "./riwayat-client";

export const metadata = {
  title: "Riwayat Desain - KANCING",
};

export default async function RiwayatDesainPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profile = await getCurrentProfile();
  if (profile?.role === "admin") redirect("/admin");

  const logs = await getExportLogs(user.id);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#E07A00] flex items-center gap-2 font-heading">
            <History className="w-6 h-6 text-[#FF9100]" />
            Riwayat Desain
          </h1>
          <p className="text-slate-500 mt-1">
            Daftar desain yang pernah Anda ekspor sebelumnya.
          </p>
        </div>
      </div>

      <RiwayatClient logs={logs as any} />
    </div>
  );
}

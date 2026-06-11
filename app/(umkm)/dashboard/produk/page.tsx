import { requireAuth } from "@/lib/auth";

export default async function UMKMProdukPage() {
  await requireAuth();

  return (
    <div className="space-y-4 font-sans">
      <h1 className="text-2xl font-extrabold text-[#1E293B] font-heading">Produk Saya</h1>
      <p className="text-slate-500 text-sm">
        Halaman placeholder untuk manajemen foto produk dan deskripsi harga produk UMKM.
      </p>
    </div>
  );
}

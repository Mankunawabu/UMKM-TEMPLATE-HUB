"use client";

import * as React from "react";
import Link from "next/link";
import {
  Palette,
  Sparkles,
  Zap,
  ShieldCheck,
  Star,
  ArrowRight,
  CheckCircle2,
  Camera,
  Monitor,
  ShoppingBag,
  Video,
  LayoutGrid,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const features = [
  {
    icon: LayoutGrid,
    title: "Template Feed Instagram",
    desc: "Ratusan desain feed profesional siap pakai, tinggal sesuaikan dengan brand Anda.",
    color: "from-pink-400 to-rose-500",
  },
  {
    icon: Camera,
    title: "Stories & Reels",
    desc: "Template story vertikal dengan animasi dan tata letak yang menawan mata.",
    color: "from-purple-400 to-pink-500",
  },
  {
    icon: Monitor,
    title: "Banner Web & Marketplace",
    desc: "Banner ukuran standar marketplace yang siap upload tanpa perlu riset ukuran.",
    color: "from-blue-400 to-cyan-500",
  },
  {
    icon: Video,
    title: "Livestream Shopping",
    desc: "Frame dan overlay grafis keren untuk sesi live selling yang lebih menarik.",
    color: "from-orange-400 to-amber-500",
  },
  {
    icon: ShoppingBag,
    title: "Katalog Promo",
    desc: "Desain katalog produk yang elegan dan profesional untuk promosi harian.",
    color: "from-emerald-400 to-teal-500",
  },
  {
    icon: Sparkles,
    title: "Kustomisasi Instan",
    desc: "Ubah teks, warna, dan logo dengan editor mudah tanpa keahlian desain.",
    color: "from-[#FF9100] to-[#E07A00]",
  },
];

const steps = [
  {
    step: "01",
    title: "Daftar & Lengkapi Profil",
    desc: "Buat akun gratis dan isi informasi usaha Anda dalam 2 menit.",
  },
  {
    step: "02",
    title: "Pilih Template",
    desc: "Jelajahi ratusan template sesuai kategori usaha dan platform media sosial.",
  },
  {
    step: "03",
    title: "Kustomisasi & Unduh",
    desc: "Sesuaikan desain dengan logo dan warna brand Anda, lalu unduh hasilnya.",
  },
];

const testimonials = [
  {
    name: "Sari Wijaya",
    usaha: "Kue Artisan Sari",
    text: "Dulu bikin konten bisa 2 jam, sekarang cuma 10 menit. Omzet naik 40% sejak aktif posting!",
    initials: "SW",
    color: "from-pink-400 to-rose-500",
  },
  {
    name: "Dewi Permatasari",
    usaha: "Batik Nusantara",
    text: "Template-nya elegan dan cocok banget buat produk batik saya. Terlihat jauh lebih profesional!",
    initials: "DP",
    color: "from-purple-400 to-violet-500",
  },
  {
    name: "Rina Lestari",
    usaha: "Frozen Food Rina",
    text: "Akhirnya bisa bikin banner marketplace sendiri tanpa bayar desainer. Hemat ratusan ribu tiap bulan!",
    initials: "RL",
    color: "from-emerald-400 to-teal-500",
  },
];

const faqs = [
  {
    q: "Apakah KANCING gratis?",
    a: "Ya, platform ini gratis untuk semua UMKM anggota. Anda hanya perlu mendaftar dan mulai menggunakan ribuan template tanpa biaya.",
  },
  {
    q: "Apakah saya perlu keahlian desain grafis?",
    a: "Tidak sama sekali! Editor kami dirancang sangat mudah — Anda hanya perlu klik, ubah teks, dan unduh. Tidak ada kurva pembelajaran yang rumit.",
  },
  {
    q: "Format apa saja yang bisa diunduh?",
    a: "Anda bisa mengunduh desain dalam format JPG (standar) atau PNG kualitas tinggi, siap diupload ke Instagram, Tokopedia, Shopee, dan platform lainnya.",
  },
  {
    q: "Apakah template bisa disesuaikan dengan logo saya?",
    a: "Tentu saja! Setiap template bisa dikustomisasi — Anda bisa mengganti teks, warna, dan menambahkan logo usaha Anda sendiri.",
  },
];

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="border border-[#FFE6D5] rounded-2xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left font-bold text-[#2E2520] hover:bg-[#FFF9F5] transition-colors"
      >
        <span>{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-[#FF9100] shrink-0 ml-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-[#FFE6D5] pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function LandingPage() {
  const [mobileMenu, setMobileMenu] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#FFF9F5] font-sans overflow-x-hidden">

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#FFE6D5] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo_umkm_P.png"
              alt="Logo Kancing"
              className="w-16 h-16 object-contain shrink-0"
            />
            <span className="text-xl font-extrabold tracking-tight text-[#E07A00] font-heading">
              KANCING
            </span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#fitur" className="text-sm font-semibold text-slate-600 hover:text-[#FF9100] transition-colors">Fitur</a>
            <a href="#cara-kerja" className="text-sm font-semibold text-slate-600 hover:text-[#FF9100] transition-colors">Cara Kerja</a>
            <a href="#testimoni" className="text-sm font-semibold text-slate-600 hover:text-[#FF9100] transition-colors">Testimoni</a>
            <a href="#faq" className="text-sm font-semibold text-slate-600 hover:text-[#FF9100] transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login" className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold text-[#E07A00] hover:text-[#FF9100] transition-colors">
              Masuk
            </Link>
            <Link
              href="/register"
              className="px-3 py-1.5 sm:px-5 sm:py-2.5 bg-gradient-to-r from-[#FF9100] to-[#E07A00] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-[#FF9100]/30 hover:shadow-lg hover:shadow-[#FF9100]/40 hover:scale-[1.02] transition-all"
            >
              Daftar
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-1.5 ml-1 text-[#E07A00]">
            {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="md:hidden border-t border-[#FFE6D5] bg-white px-6 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
            {["#fitur", "#cara-kerja", "#testimoni", "#faq"].map((href, i) => (
              <a key={i} href={href} onClick={() => setMobileMenu(false)} className="block text-sm font-semibold text-slate-600 hover:text-[#FF9100] py-2 transition-colors capitalize">
                {href.replace("#", "").replace("-", " ")}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 py-20 text-center overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#FFE6D5]/50 blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#FF9100]/15 blur-[160px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] rounded-full bg-[#E07A00]/5 blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFE6D5] text-[#E07A00] text-xs font-bold tracking-wide mb-8 border border-[#FF9100]/20 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Platform Desain Gratis untuk UMKM Indonesia
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-[#2E2520] leading-[1.1] tracking-tight font-heading mb-6">
            Desain Promosi{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-[#FF9100] to-[#E07A00] bg-clip-text text-transparent">
                Kelas Dunia
              </span>
              <span className="absolute bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9100] to-[#E07A00] rounded-full opacity-30" />
            </span>
            <br />dalam Hitungan Menit
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10 font-medium">
            Ratusan template profesional untuk Instagram, Marketplace, dan Livestream — 
            dirancang khusus untuk pelaku UMKM Indonesia. <strong className="text-[#E07A00]">Gratis selamanya.</strong>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#FF9100] to-[#E07A00] text-white font-bold rounded-2xl text-base shadow-xl shadow-[#FF9100]/30 hover:shadow-2xl hover:shadow-[#FF9100]/40 hover:scale-[1.03] transition-all duration-300"
            >
              Mulai Desain Gratis
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 px-8 py-4 bg-white text-[#E07A00] font-bold rounded-2xl text-base border border-[#FFE6D5] hover:bg-[#FFF5EE] hover:border-[#FF9100] transition-all shadow-sm"
            >
              Sudah Punya Akun
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-6 mt-12 text-sm text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <div className="flex -space-x-2">
                {["SW", "DP", "RL", "AM"].map((init, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-extrabold bg-gradient-to-br ${i === 0 ? "from-pink-400 to-rose-500" : i === 1 ? "from-purple-400 to-violet-500" : i === 2 ? "from-emerald-400 to-teal-500" : "from-[#FF9100] to-[#E07A00]"}`}>
                    {init}
                  </div>
                ))}
              </div>
              <span>500+ UMKM aktif</span>
            </div>
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              <span className="text-slate-500 ml-1">4.9/5</span>
            </div>
          </div>
        </div>

        {/* Hero Visual Cards */}
        <div className="relative z-10 mt-20 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
          {[
            { label: "Feed Instagram", icon: LayoutGrid, color: "from-pink-100 to-rose-100", iconColor: "text-rose-500" },
            { label: "Story & Reels", icon: Camera, color: "from-purple-100 to-pink-100", iconColor: "text-purple-500" },
            { label: "Banner Web", icon: Monitor, color: "from-blue-100 to-cyan-100", iconColor: "text-blue-500" },
            { label: "Katalog Promo", icon: ShoppingBag, color: "from-emerald-100 to-teal-100", iconColor: "text-emerald-500" },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={i} className={`group p-5 bg-gradient-to-br ${card.color} rounded-2xl border border-white/60 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default`}>
                <div className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                  <Icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
                <p className="text-xs font-bold text-slate-700">{card.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="py-12 bg-gradient-to-r from-[#E07A00] to-[#FF9100]">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {[
            { value: "500+", label: "UMKM Aktif" },
            { value: "1.000+", label: "Template Tersedia" },
            { value: "10.000+", label: "Desain Dibuat" },
            { value: "100%", label: "Gratis" },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-3xl md:text-4xl font-extrabold font-heading">{stat.value}</div>
              <div className="text-white/75 text-sm font-medium mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FITUR ── */}
      <section id="fitur" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFE6D5] text-[#E07A00] text-xs font-bold mb-5">
              <Zap className="w-3.5 h-3.5" /> Fitur Unggulan
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#2E2520] font-heading mb-4">
              Semua yang Anda Butuhkan
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Dari feed Instagram hingga banner marketplace, kami punya semua template yang Anda butuhkan untuk tampil profesional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="group p-6 bg-white rounded-2xl border border-[#FFE6D5] hover:border-[#FF9100]/40 hover:shadow-xl hover:shadow-[#FF9100]/10 hover:-translate-y-1 transition-all duration-300">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-[#2E2520] text-lg mb-2 font-heading">{f.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CARA KERJA ── */}
      <section id="cara-kerja" className="py-24 px-6 bg-gradient-to-b from-[#FFF5EE] to-[#FFF9F5]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFE6D5] text-[#E07A00] text-xs font-bold mb-5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Mudah & Cepat
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#2E2520] font-heading mb-4">
              3 Langkah Mudah
            </h2>
            <p className="text-slate-600 max-w-lg mx-auto">
              Tidak perlu keahlian desain. Siapapun bisa membuat konten promosi yang memukau.
            </p>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-10 left-[calc(16.67%-1px)] right-[calc(16.67%-1px)] h-0.5 bg-gradient-to-r from-[#FFE6D5] via-[#FF9100] to-[#FFE6D5]" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((s, i) => (
                <div key={i} className="relative text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF9100] to-[#E07A00] flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[#FF9100]/30 relative z-10">
                    <span className="text-white text-2xl font-extrabold font-heading">{s.step}</span>
                  </div>
                  <h3 className="font-bold text-[#2E2520] text-lg mb-2 font-heading">{s.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-14">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#FF9100] to-[#E07A00] text-white font-bold rounded-2xl text-base shadow-xl shadow-[#FF9100]/30 hover:scale-[1.03] transition-all"
            >
              Coba Sekarang — Gratis!
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONI ── */}
      <section id="testimoni" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFE6D5] text-[#E07A00] text-xs font-bold mb-5">
              <Star className="w-3.5 h-3.5" /> Dari Sesama UMKM
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#2E2520] font-heading mb-4">
              Mereka Sudah Merasakannya
            </h2>
            <p className="text-slate-600 max-w-lg mx-auto">
              Bergabunglah bersama ratusan pelaku UMKM yang sudah meningkatkan penjualan mereka.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="group p-6 bg-white rounded-2xl border border-[#FFE6D5] hover:border-[#FF9100]/40 hover:shadow-xl hover:shadow-[#FF9100]/10 transition-all duration-300 flex flex-col">
                <div className="flex text-amber-400 mb-4 gap-0.5">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                </div>
                <blockquote className="text-slate-600 text-sm leading-relaxed italic flex-1 mb-5">
                  "{t.text}"
                </blockquote>
                <div className="flex items-center gap-3 pt-4 border-t border-[#FFE6D5]">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-extrabold shrink-0`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-bold text-[#2E2520] text-sm">{t.name}</p>
                    <p className="text-[#FF9100] text-xs">{t.usaha}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24 px-6 bg-gradient-to-b from-[#FFF5EE] to-[#FFF9F5]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFE6D5] text-[#E07A00] text-xs font-bold mb-5">
              <ShieldCheck className="w-3.5 h-3.5" /> Pertanyaan Umum
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#2E2520] font-heading mb-4">
              Ada Pertanyaan?
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl bg-gradient-to-br from-[#E07A00] via-[#FF9100] to-[#FFE6D5] p-12 md:p-16 text-center overflow-hidden shadow-2xl shadow-[#FF9100]/30">
            {/* Decorative circles */}
            <div className="absolute top-[-30%] right-[-10%] w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="absolute bottom-[-30%] left-[-10%] w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center mx-auto mb-6 shadow-lg rounded-2xl p-2">
                <img
                  src="/logo_umkm_P.png"
                  alt="Logo Kancing"
                  className="w-full h-full object-contain"
                />
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white font-heading mb-4 leading-tight">
                Siap Tampil Lebih<br />Profesional?
              </h2>
              <p className="text-white/80 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                Bergabunglah sekarang dan mulai buat konten promosi yang memukau. Gratis, cepat, dan mudah.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="group flex items-center gap-2 px-8 py-4 bg-white text-[#E07A00] font-extrabold rounded-2xl text-base hover:bg-[#FFF5EE] hover:scale-[1.03] transition-all shadow-lg"
                >
                  Daftar Gratis Sekarang
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-4 border-2 border-white/40 text-white font-bold rounded-2xl text-base hover:bg-white/10 transition-all"
                >
                  Masuk ke Akun
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#FFE6D5] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo_umkm_P.png"
              alt="Logo Kancing"
              className="w-12 h-12 object-contain shrink-0"
            />
            <span className="font-bold text-[#E07A00] font-heading">KANCING</span>
          </div>
          <p className="text-sm text-slate-400 text-center">
            © 2026 KANCING. Dibuat dengan ❤️ untuk wirausaha Indonesia.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm text-slate-500 hover:text-[#FF9100] font-medium transition-colors">Masuk</Link>
            <Link href="/register" className="text-sm text-slate-500 hover:text-[#FF9100] font-medium transition-colors">Daftar</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

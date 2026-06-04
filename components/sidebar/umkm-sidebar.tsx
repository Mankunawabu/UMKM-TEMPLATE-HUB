"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Palette,
  Briefcase,
  History,
  User,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { logoutAction } from "@/app/(auth)/actions";

interface UMKMProfile {
  nama_usaha?: string | null;
  nama_lengkap?: string | null;
  avatar_url?: string | null;
  logo_url?: string | null;
}

interface UMKMSidebarProps {
  profile: UMKMProfile | null;
  exportLimit?: number;
  currentExports?: number;
}

function getInitials(name: string | null | undefined): string {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function UMKMSidebar({ profile, exportLimit = 5, currentExports = 0 }: UMKMSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = async () => {
    const res = await logoutAction();
    if (res?.success) {
      router.push("/login");
      router.refresh();
    }
  };

  const menuItems = [
    {
      name: "Beranda",
      href: "/dashboard",
      icon: Home,
    },
    {
      name: "Template",
      href: "/dashboard/template",
      icon: Palette,
    },
    {
      name: "Riwayat Desain",
      href: "/dashboard/riwayat-desain",
      icon: History,
    },
    {
      name: "Profil",
      href: "/dashboard/profil",
      icon: User,
    },
  ];

  const sidebarWidthClass = isCollapsed ? "w-20" : "w-64";

  return (
    <>
      {/* Mobile Toggle Navbar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-[#F7D6E6] text-[#8C4A6E] fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center gap-2">
          {profile?.logo_url ? (
            <div className="w-8 h-8 rounded-full bg-[#FFF0F7] border border-[#F7D6E6] flex items-center justify-center overflow-hidden shrink-0">
              <img
                src={profile.logo_url}
                alt="Logo Usaha"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          ) : (
            <Palette className="w-6 h-6 text-[#C27BA0]" />
          )}
          <span className="font-extrabold text-sm tracking-tight truncate">
            {profile?.nama_usaha || "UMKM Hub"}
          </span>
        </div>
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 hover:bg-[#FFF9FC] rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer Menu */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-white border-r border-[#F7D6E6] z-50 flex flex-col justify-between transition-transform duration-300 transform lg:hidden ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#F7D6E6]">
            <div className="flex items-center gap-2">
              {profile?.logo_url ? (
                <div className="w-8 h-8 rounded-full bg-[#FFF0F7] border border-[#F7D6E6] flex items-center justify-center overflow-hidden shrink-0">
                  <img
                    src={profile.logo_url}
                    alt="Logo Usaha"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              ) : (
                <Palette className="w-6 h-6 text-[#C27BA0]" />
              )}
              <span className="font-bold text-md tracking-tight text-[#8C4A6E] truncate">
                {profile?.nama_usaha || "UMKM Hub"}
              </span>
            </div>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-1 hover:bg-[#FFF9FC] rounded-lg text-slate-400 hover:text-[#8C4A6E] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-2">
            {menuItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-[#F7D6E6] text-[#8C4A6E]"
                      : "text-slate-600 hover:bg-[#FFF9FC] hover:text-[#8C4A6E]"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Quota & Profile & Logout */}
        <div className="p-4 border-t border-[#F7D6E6] space-y-4 bg-[#FFF9FC]">
          
          {/* Quota Indicator */}
          <div className="px-2">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-[#8C4A6E]">Sisa Ekspor</span>
              <span className={currentExports >= exportLimit ? "text-red-500" : "text-[#C27BA0]"}>
                {exportLimit - currentExports} / {exportLimit}
              </span>
            </div>
            <div className="w-full h-1.5 bg-white border border-[#F7D6E6] rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${currentExports >= exportLimit ? 'bg-red-500' : 'bg-[#C27BA0]'}`}
                style={{ width: `${Math.min((currentExports / exportLimit) * 100, 100)}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C27BA0] to-[#8C4A6E] border-2 border-[#F7D6E6] flex items-center justify-center text-white text-xs font-extrabold font-sans overflow-hidden shrink-0 shadow-sm">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Owner Photo"
                  className="w-full h-full object-cover"
                />
              ) : (
                getInitials(profile?.nama_lengkap)
              )}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-[#8C4A6E] truncate">
                {profile?.nama_lengkap || "Pemilik UMKM"}
              </p>
              <p className="text-[10px] text-[#C27BA0]">Pemilik Usaha</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Desktop Sidebar (Persistent) */}
      <aside
        className={`hidden lg:flex flex-col justify-between bg-white border-r border-[#F7D6E6] shrink-0 sticky top-0 h-screen transition-all duration-300 ${sidebarWidthClass} z-30`}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#F7D6E6] relative">
            <div className="flex items-center gap-2 overflow-hidden">
              {profile?.logo_url ? (
                <div className="w-8 h-8 rounded-full bg-[#FFF0F7] border border-[#F7D6E6] flex items-center justify-center overflow-hidden shrink-0">
                  <img
                    src={profile.logo_url}
                    alt="Logo Usaha"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              ) : (
                <Palette className="w-6 h-6 text-[#C27BA0] shrink-0" />
              )}
              {!isCollapsed && (
                <span className="font-extrabold text-md tracking-tight text-[#8C4A6E] font-heading truncate">
                  {profile?.nama_usaha || "UMKM Hub"}
                </span>
              )}
            </div>

            {/* Collapse toggle button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="absolute right-[-14px] top-1/2 -translate-y-1/2 w-7 h-7 bg-white border border-[#F7D6E6] rounded-full flex items-center justify-center text-[#8C4A6E] hover:bg-[#FFF9FC] shadow-sm cursor-pointer z-40 active:scale-95"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-2">
            {menuItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all relative group/item ${
                    isActive
                      ? "bg-[#F7D6E6] text-[#8C4A6E]"
                      : "text-slate-600 hover:bg-[#FFF9FC] hover:text-[#8C4A6E]"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!isCollapsed && <span className="truncate">{item.name}</span>}

                  {/* Tooltip on Hover when Collapsed */}
                  {isCollapsed && (
                    <div className="absolute left-16 bg-[#8C4A6E] text-white text-xs px-2.5 py-1.5 rounded-lg opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200 shadow-md whitespace-nowrap z-50">
                      {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Quota & Profile & Logout */}
        <div className="p-4 border-t border-[#F7D6E6] space-y-4 bg-[#FFF9FC]">
          
          {/* Quota Indicator - expanded */}
          {!isCollapsed && (
            <div className="px-1">
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-[#8C4A6E]">Sisa Ekspor</span>
                <span className={currentExports >= exportLimit ? "text-red-500" : "text-[#C27BA0]"}>
                  {exportLimit - currentExports} / {exportLimit}
                </span>
              </div>
              <div className="w-full h-1.5 bg-white border border-[#F7D6E6] rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${currentExports >= exportLimit ? 'bg-red-500' : 'bg-[#C27BA0]'}`}
                  style={{ width: `${Math.min((currentExports / exportLimit) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Profile Row */}
          <div className="flex items-center gap-3 px-1 relative group/profile">
            {/* Avatar - always visible */}
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C27BA0] to-[#8C4A6E] border-2 border-[#F7D6E6] flex items-center justify-center text-white text-xs font-extrabold font-sans overflow-hidden shadow-sm">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Owner Photo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getInitials(profile?.nama_lengkap)
                )}
              </div>
              {/* Collapsed quota mini-badge */}
              {isCollapsed && (
                <div
                  className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-[8px] font-extrabold flex items-center justify-center border border-white shadow-sm ${
                    currentExports >= exportLimit ? "bg-red-500 text-white" : "bg-[#C27BA0] text-white"
                  }`}
                  title={`Ekspor: ${exportLimit - currentExports} sisa`}
                >
                  {exportLimit - currentExports}
                </div>
              )}
            </div>

            {!isCollapsed && (
              <div className="truncate">
                <p className="text-xs font-bold text-[#8C4A6E] truncate">
                  {profile?.nama_lengkap || "Pemilik UMKM"}
                </p>
                <p className="text-[10px] text-[#C27BA0]">Pemilik Usaha</p>
              </div>
            )}

            {/* Tooltip when collapsed */}
            {isCollapsed && (
              <div className="absolute left-14 bottom-0 bg-[#3D1E30] text-white text-xs px-2.5 py-1.5 rounded-lg opacity-0 invisible group-hover/profile:opacity-100 group-hover/profile:visible transition-all duration-200 shadow-md whitespace-nowrap z-50">
                {profile?.nama_lengkap || "Pemilik UMKM"}<br/>
                <span className={currentExports >= exportLimit ? "text-red-300" : "text-[#F7D6E6]"}>
                  Ekspor: {exportLimit - currentExports}/{exportLimit}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all ${
              isCollapsed ? "justify-center" : ""
            } relative group/logout`}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span>Keluar</span>}

            {isCollapsed && (
              <div className="absolute left-16 bg-red-600 text-white text-xs px-2.5 py-1.5 rounded-lg opacity-0 invisible group-hover/logout:opacity-100 group-hover/logout:visible transition-all duration-200 shadow-md whitespace-nowrap z-50">
                Keluar
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

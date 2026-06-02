"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileCode,
  Layers,
  GitBranch,
  Users,
  History,
  Image as ImageIcon,
  Download,
  Settings,
  LogOut,
  Menu,
  X,
  Palette,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { logoutAction } from "@/app/(auth)/actions";

interface AdminSidebarProps {
  profile: {
    nama_lengkap?: string | null;
    avatar_url?: string | null;
  } | null;
}

export default function AdminSidebar({ profile }: AdminSidebarProps) {
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

  const menuGroups = [
    {
      title: "Umum",
      items: [
        {
          name: "Dashboard",
          href: "/admin",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: "Template Management",
      items: [
        {
          name: "Templates",
          href: "/admin/templates",
          icon: FileCode,
        },
        {
          name: "Categories",
          href: "/admin/categories",
          icon: Layers,
        },
      ],
    },
    {
      title: "User Management",
      items: [
        {
          name: "UMKM Users",
          href: "/admin/users",
          icon: Users,
        },
      ],
    },
    {
      title: "System",
      items: [
        {
          name: "Settings",
          href: "/admin/settings",
          icon: Settings,
        },
      ],
    },
  ];

  const sidebarWidthClass = isCollapsed ? "w-20" : "w-64";

  return (
    <>
      {/* Mobile Toggle Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-[#F7D6E6] text-[#8C4A6E] fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center gap-2">
          <Palette className="w-6 h-6 text-[#C27BA0]" />
          <span className="font-bold text-sm tracking-tight">Admin Hub</span>
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
              <Palette className="w-6 h-6 text-[#C27BA0]" />
              <span className="font-bold text-md tracking-tight text-[#8C4A6E]">
                Admin Hub
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
          <nav className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
            {menuGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                <span className="text-[10px] font-bold text-[#C27BA0] uppercase tracking-wider block px-3 mb-1">
                  {group.title}
                </span>
                {group.items.map((item, idx) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={idx}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
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
              </div>
            ))}
          </nav>
        </div>

        {/* Footer Profile & Logout */}
        <div className="p-4 border-t border-[#F7D6E6] space-y-3 bg-[#FFF9FC]">
          <div className="flex items-center gap-3 px-3">
            <div className="w-8 h-8 rounded-full bg-[#C27BA0] flex items-center justify-center text-white text-xs font-bold font-sans overflow-hidden">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                profile?.nama_lengkap?.slice(0, 1) || "A"
              )}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-[#8C4A6E] truncate">
                {profile?.nama_lengkap || "Administrator"}
              </p>
              <p className="text-[10px] text-[#C27BA0]">Administrator</p>
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
              <Palette className="w-6 h-6 text-[#C27BA0] shrink-0" />
              {!isCollapsed && (
                <span className="font-extrabold text-md tracking-tight text-[#8C4A6E] font-heading truncate">
                  Admin Hub
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
          <nav className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-180px)]">
            {menuGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                {!isCollapsed && (
                  <span className="text-[10px] font-bold text-[#C27BA0] uppercase tracking-wider block px-3 mb-1">
                    {group.title}
                  </span>
                )}
                {group.items.map((item, idx) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={idx}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all relative group/item ${
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
              </div>
            ))}
          </nav>
        </div>

        {/* Footer Profile & Logout */}
        <div className="p-4 border-t border-[#F7D6E6] space-y-3 bg-[#FFF9FC]">
          <div className="flex items-center gap-3 px-1">
            <div className="w-8 h-8 rounded-full bg-[#C27BA0] flex items-center justify-center text-white text-xs font-bold font-sans overflow-hidden shrink-0">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                profile?.nama_lengkap?.slice(0, 1) || "A"
              )}
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <p className="text-xs font-bold text-[#8C4A6E] truncate">
                  {profile?.nama_lengkap || "Administrator"}
                </p>
                <p className="text-[10px] text-[#C27BA0]">Administrator</p>
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

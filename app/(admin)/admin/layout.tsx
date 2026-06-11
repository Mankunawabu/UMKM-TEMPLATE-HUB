import { requireAdmin } from "@/lib/auth";
import AdminSidebar from "@/components/sidebar/admin-sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // Enforce admin auth on the layout layer
  const { profile } = await requireAdmin();

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#FFFFFF]">
      {/* Interactive Desktop Sidebar and Mobile Drawer Overlay */}
      <AdminSidebar profile={profile} />

      {/* Content pane */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Offset for mobile toggle bar height */}
        <main className="flex-1 p-6 lg:p-10 pt-20 lg:pt-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

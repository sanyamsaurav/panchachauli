"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Settings,
  FileText,
  LogOut,
  Activity,
  Mail,
  Newspaper,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/utils/cn";
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";

interface MenuItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const menuItems: MenuItem[] = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Customer Enquiries", href: "/admin/contacts", icon: Mail },
  { title: "School Inquiries", href: "/admin/school", icon: GraduationCap },
  { title: "Products & Gear", href: "/admin/products", icon: FileText },
  { title: "Blogs", href: "/admin/blogs", icon: FileText },
  { title: "Experiences", href: "/admin/experiences", icon: Activity },
  { title: "Newsletter", href: "/admin/newsletter", icon: Newspaper },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [unreadEnquiries, setUnreadEnquiries] = React.useState<number>(0);

  React.useEffect(() => {
    let isMounted = true;
    const fetchUnread = async () => {
      try {
        const res = await fetch("/api/admin/contacts?limit=1&status=new");
        if (res.ok) {
          const json = await res.json();
          if (isMounted && typeof json?.pagination?.total === "number") {
            setUnreadEnquiries(json.pagination.total);
          }
        }
      } catch {
        // silent fallback
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 30000); // Check every 30 seconds
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    if (href === "/admin/contacts") {
      return pathname === "/admin/contacts" || pathname?.startsWith("/admin/enquiries");
    }
    return pathname?.startsWith(href);
  };

  return (
    <>
      <SidebarHeader className="border-b border-gray-800 p-0 bg-black">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center bg-white">
              <FileText className="h-6 w-6 text-black" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">FlyPanchachauli</span>
              <span className="text-xs text-gray-400">Admin Panel</span>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4 bg-black">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const active = isActive(item.href);
            const isEnquiries = item.href === "/admin/contacts";
            const badgeText = isEnquiries && unreadEnquiries > 0
              ? `${unreadEnquiries} New`
              : item.badge;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-white text-black font-semibold"
                    : "text-gray-300 hover:bg-gray-900 hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="flex-1">{item.title}</span>
                {badgeText && (
                  <span
                    className={cn(
                      "px-2 py-0.5 text-xs font-semibold rounded-full border",
                      isEnquiries && unreadEnquiries > 0
                        ? active
                          ? "bg-amber-500 text-white border-amber-600 animate-pulse"
                          : "bg-amber-400/20 text-amber-300 border-amber-500/40 animate-pulse"
                        : active
                        ? "bg-black text-white border-gray-800"
                        : "bg-gray-800 text-gray-200 border-gray-700"
                    )}
                  >
                    {badgeText}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-800 p-0 bg-black">
        <div className="p-4">

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex w-full cursor-pointer items-center gap-3 text-sm text-gray-300 transition-colors hover:bg-gray-900 hover:text-white px-3 py-2"
          >
            <span className="flex items-center justify-center bg-gray-800 p-2"><LogOut className="h-4 w-4 shrink-0" /></span>
            <span>Logout</span>
          </button>
        </div>
      </SidebarFooter>
    </>
  );
}

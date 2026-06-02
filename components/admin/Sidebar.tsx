"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  LogOut,
  UserPlus,
  DollarSign,
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
  { title: "Products & Gear", href: "/admin/products", icon: FileText },
  { title: "Blogs", href: "/admin/blogs", icon: FileText },
  { title: "Experiences", href: "/admin/experiences", icon: Activity },
  { title: "School", href: "/admin/school", icon: GraduationCap },
  { title: "Contacts", href: "/admin/contacts", icon: Mail },
  { title: "Newsletter", href: "/admin/newsletter", icon: Newspaper },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
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
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-white text-black"
                    : "text-gray-300 hover:bg-gray-900 hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
                {item.badge && (
                  <span className="ml-auto bg-black text-white px-2 py-0.5 text-xs font-semibold border border-gray-700">
                    {item.badge}
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

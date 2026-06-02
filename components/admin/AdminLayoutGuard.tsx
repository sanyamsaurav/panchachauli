"use client";

import { usePathname } from "next/navigation";
import AdminLayout from "./Main";

export default function AdminLayoutGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return <AdminLayout>{children}</AdminLayout>;
}

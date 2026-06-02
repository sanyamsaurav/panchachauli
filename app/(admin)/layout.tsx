import type { Metadata } from "next";
import { AdminLayoutGuard } from "@/components/admin";

export const metadata: Metadata = {
  title: "Admin Dashboard - Fly Panchachauli",
  description: "Admin dashboard for managing Fly Panchachauli operations",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminLayoutGuard>{children}</AdminLayoutGuard>;
}


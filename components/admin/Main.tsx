"use client";

import * as React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from "@/components/ui/sidebar";
import AdminSidebar from "./Sidebar";
import Nav from "./Nav";

export default function AdminMain({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        <Sidebar variant="sidebar" collapsible="offcanvas">
          <AdminSidebar />
        </Sidebar>

        {/* Main Content Area */}
        <SidebarInset className="flex flex-1 flex-col">
          {/* Top Navigation */}
          <Nav />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-white p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

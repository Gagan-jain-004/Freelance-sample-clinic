"use client";

import React, { useState, Suspense } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { DemoNotice } from "@/components/ui/DemoNotice";

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Demo Banner */}
      <DemoNotice variant="banner" />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block shrink-0">
          <Suspense fallback={<div className="w-64 bg-slate-900 h-full" />}>
            <Sidebar
              collapsed={sidebarCollapsed}
              onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
          </Suspense>
        </div>

        {/* Mobile Drawer Overlay */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
              onClick={() => setMobileDrawerOpen(false)}
            />
            {/* Drawer */}
            <div className="relative z-10 animate-in slide-in-from-left duration-200">
              <Suspense fallback={<div className="w-72 bg-slate-900 h-full" />}>
                <Sidebar
                  isMobile
                  onMobileItemClick={() => setMobileDrawerOpen(false)}
                />
              </Suspense>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <Suspense fallback={<div className="h-16 bg-white border-b border-slate-200" />}>
            <Header onOpenMobileMenu={() => setMobileDrawerOpen(true)} />
          </Suspense>

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Suspense fallback={<div className="p-8 text-xs text-slate-400">Loading module...</div>}>
              {children}
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}

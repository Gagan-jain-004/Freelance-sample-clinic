"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Clock,
  Stethoscope,
  FileText,
  Receipt,
  BarChart3,
  Settings,
  RotateCcw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { useDemoData } from "@/lib/demo-storage";
import { ResetModal } from "./ResetModal";

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobile?: boolean;
  onMobileItemClick?: () => void;
}

export function Sidebar({
  collapsed = false,
  onToggleCollapse,
  isMobile = false,
  onMobileItemClick,
}: SidebarProps) {
  const pathname = usePathname();
  const { data } = useDemoData();
  const [resetModalOpen, setResetModalOpen] = useState(false);

  // Calculate live waiting queue count for today
  const todayStr = "2026-10-18";
  const waitingCount = data.appointments.filter(
    (a) => a.date === todayStr && a.status === "Checked-in"
  ).length;

  const navItems = [
    { label: "Overview", href: "/demo/dashboard", icon: LayoutDashboard },
    { label: "Patients", href: "/demo/patients", icon: Users },
    { label: "Appointments", href: "/demo/appointments", icon: CalendarDays },
    {
      label: "Waiting Queue",
      href: "/demo/queue",
      icon: Clock,
      badge: waitingCount > 0 ? waitingCount : undefined,
    },
    { label: "Consultations", href: "/demo/consultations", icon: Stethoscope },
    { label: "Prescriptions", href: "/demo/prescriptions", icon: FileText },
    { label: "Billing", href: "/demo/billing", icon: Receipt },
    { label: "Reports", href: "/demo/reports", icon: BarChart3 },
    { label: "Clinic Settings", href: "/demo/settings", icon: Settings },
  ];

  return (
    <>
      <aside
        className={`bg-slate-900 text-slate-300 flex flex-col justify-between transition-all duration-200 border-r border-slate-800 h-full no-print ${
          isMobile
            ? "w-72"
            : collapsed
            ? "w-20"
            : "w-64"
        }`}
      >
        {/* Top: Brand & Clinic Header */}
        <div>
          <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800">
            <Link
              href="/demo/dashboard"
              className="flex items-center gap-3 overflow-hidden group"
              onClick={onMobileItemClick}
            >
              <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-teal-500/20">
                <Stethoscope className="w-5 h-5" />
              </div>
              {(!collapsed || isMobile) && (
                <div className="flex flex-col min-w-0">
                  <span className="font-extrabold text-white text-sm tracking-tight truncate leading-tight">
                    {data.settings.clinicName || "CareWell Clinic"}
                  </span>
                  <span className="text-[10px] text-teal-400 font-semibold tracking-wider uppercase truncate">
                    Doctor Portal Demo
                  </span>
                </div>
              )}
            </Link>

            {!isMobile && onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/demo/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onMobileItemClick}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? "bg-teal-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/80"
                  }`}
                  title={collapsed && !isMobile ? item.label : undefined}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? "text-white" : "text-slate-400 group-hover:text-teal-400"
                    }`}
                  />
                  {(!collapsed || isMobile) && (
                    <span className="flex-1 truncate">{item.label}</span>
                  )}
                  {item.badge !== undefined && (!collapsed || isMobile) && (
                    <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Demo Utilities & Reset */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          {(!collapsed || isMobile) && (
            <div className="rounded-xl bg-slate-800/60 p-3 text-[11px] text-slate-400 border border-slate-700/60 space-y-2">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>Demo Session Sandbox</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Data persists in your current browser session.
              </p>
              <div className="flex items-center gap-2 pt-1 text-teal-400">
                <Link
                  href="/register"
                  target="_blank"
                  className="hover:underline flex items-center gap-1 text-[10px]"
                >
                  <span>Open Intake Form</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </Link>
                <span>•</span>
                <Link
                  href="/"
                  className="hover:underline text-[10px]"
                >
                  Home
                </Link>
              </div>
            </div>
          )}

          {/* Reset Demo Button */}
          <button
            type="button"
            onClick={() => setResetModalOpen(true)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-900/40 transition-colors ${
              collapsed && !isMobile ? "justify-center" : ""
            }`}
            title="Reset Demo Data"
          >
            <RotateCcw className="w-4 h-4 shrink-0" />
            {(!collapsed || isMobile) && <span>Reset Demo Data</span>}
          </button>
        </div>
      </aside>

      <ResetModal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
      />
    </>
  );
}

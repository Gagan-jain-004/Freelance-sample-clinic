"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  RotateCcw,
  UserCheck,
  Stethoscope,
  ChevronDown,
  Info,
  Calendar,
} from "lucide-react";
import { useDemoData } from "@/lib/demo-storage";
import { DemoNotice } from "../ui/DemoNotice";
import { ResetModal } from "./ResetModal";

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export function Header({ onOpenMobileMenu }: HeaderProps) {
  const pathname = usePathname();
  const { data } = useDemoData();
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Map route to readable page title
  const getPageTitle = (path: string): string => {
    if (path === "/demo/dashboard") return "Doctor Dashboard Overview";
    if (path.startsWith("/demo/patients")) return "Patient Directory & Records (EMR)";
    if (path.startsWith("/demo/appointments")) return "Appointment Scheduling";
    if (path.startsWith("/demo/queue")) return "Live Waiting Room Queue";
    if (path.startsWith("/demo/consultations")) return "Clinical Encounters & Notes";
    if (path.startsWith("/demo/prescriptions")) return "Digital Prescriptions";
    if (path.startsWith("/demo/billing")) return "Billing, Invoices & Payments";
    if (path.startsWith("/demo/reports")) return "Clinic Analytics & Reporting";
    if (path.startsWith("/demo/settings")) return "Clinic Profile & Branding Settings";
    return "Clinic Management";
  };

  const [todayFormatted, setTodayFormatted] = useState("Sun, 18 Oct 2026");

  React.useEffect(() => {
    try {
      setTodayFormatted(
        new Date().toLocaleDateString("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      );
    } catch {
      // fallback
    }
  }, []);

  return (
    <>
      <header className="h-16 border-b border-slate-200 bg-white px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 no-print">
        {/* Left: Mobile trigger & Page Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              {getPageTitle(pathname)}
            </h1>
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{todayFormatted}</span>
              <span>•</span>
              <span className="text-teal-700 font-semibold">{data.settings.clinicName}</span>
            </div>
          </div>
        </div>

        {/* Right: Demo Badge, Action controls & Doctor Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Demo Mode Badge */}
          <DemoNotice variant="subtle" />

          {/* Quick Reset Demo button */}
          <button
            type="button"
            onClick={() => setResetModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:text-rose-700 hover:bg-rose-50 hover:border-rose-200 transition-colors"
            title="Reset sample data"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Seed</span>
          </button>

          {/* Quick link to register demo patient */}
          <Link
            href="/register"
            target="_blank"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-xs font-semibold text-teal-800 hover:bg-teal-100 transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-teal-700" />
            <span>+ Test Patient Intake</span>
          </Link>

          {/* Doctor Profile Pill */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2.5 pl-2 pr-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold text-xs">
                {data.settings.doctorName ? data.settings.doctorName.charAt(4) || "D" : "D"}
              </div>
              <div className="hidden xl:block">
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  {data.settings.doctorName || "Dr. Vikram Sen"}
                </p>
                <p className="text-[10px] text-slate-500 leading-tight">
                  {data.settings.doctorSpecialty || "Consultant Physician"}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Profile Dropdown */}
            {profileDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setProfileDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200 shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold text-sm shrink-0">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-900">
                        {data.settings.doctorName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {data.settings.doctorQualifications}
                      </p>
                      <p className="text-[10px] text-teal-700 font-mono font-semibold mt-0.5">
                        Reg: {data.settings.doctorRegNumber}
                      </p>
                    </div>
                  </div>

                  <div className="my-3 rounded-xl bg-amber-50 p-2.5 text-[11px] text-amber-900 flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <p>
                      Simulated Doctor Session. No external login is active. All data remains in your local browser.
                    </p>
                  </div>

                  <div className="space-y-1 text-xs font-semibold">
                    <Link
                      href="/demo/settings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      Clinic Profile &amp; Settings
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setResetModalOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      Reset All Demo Records
                    </button>
                    <Link
                      href="/"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="block px-3 py-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                    >
                      Exit to Home
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <ResetModal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
      />
    </>
  );
}

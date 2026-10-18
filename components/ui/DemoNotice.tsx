import React from "react";
import { AlertCircle, ShieldCheck } from "lucide-react";

interface DemoNoticeProps {
  className?: string;
  variant?: "banner" | "subtle" | "card";
}

export function DemoNotice({ className = "", variant = "subtle" }: DemoNoticeProps) {
  if (variant === "banner") {
    return (
      <div className={`bg-amber-50 border-b border-amber-200 text-amber-900 text-xs px-4 py-2 flex items-center justify-between no-print ${className}`}>
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <p className="font-medium">
            <strong className="font-semibold">DEMO MODE:</strong> All patient records, consultations, prescriptions, and billing data are simulated and stored locally in your browser. No live clinical data is collected or transmitted.
          </p>
        </div>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={`rounded-xl border border-teal-200 bg-teal-50/60 p-4 text-teal-900 ${className}`}>
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <p className="font-semibold text-teal-900 mb-1">Local Browser Demo Storage</p>
            <p className="text-teal-800">
              This sandbox allows you to safely test real clinic workflows. Changes you make will persist in your current browser session (localStorage). You can reset to initial seed data anytime in Clinic Settings.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-semibold ${className}`}>
      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
      <span>DEMO MODE</span>
    </div>
  );
}

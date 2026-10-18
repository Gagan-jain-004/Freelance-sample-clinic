"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Clock,
  UserCheck,
  Stethoscope,
  CheckCircle2,
  AlertCircle,
  Play,
  XCircle,
  Plus,
  ArrowRight,
} from "lucide-react";
import { useDemoData, updateAppointmentStatus } from "@/lib/demo-storage";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { NewConsultationModal } from "@/components/consultations/NewConsultationModal";
import { Appointment } from "@/lib/demo-types";

export function getWaitingMinutes(checkInTime?: string): number {
  if (!checkInTime) return 10;
  try {
    const checkInMs = new Date(checkInTime).getTime();
    const referenceMs = new Date("2026-10-18T11:20:00.000Z").getTime();
    const diffMs = referenceMs - checkInMs;
    return Math.max(5, Math.round(diffMs / 60000));
  } catch {
    return 12;
  }
}

export default function WaitingQueuePage() {
  const { data } = useDemoData();

  const [activeConsultationApt, setActiveConsultationApt] = useState<Appointment | null>(null);

  const todayStr = "2026-10-18";

  // Today's appointments that are in queue (Checked-in) or currently In Consultation
  const queueItems = data.appointments
    .filter((a) => a.date === todayStr && (a.status === "Checked-in" || a.status === "In Consultation"))
    .sort((a, b) => (a.tokenNumber || 999) - (b.tokenNumber || 999));

  // Today's confirmed appointments not yet checked in
  const todayUpcoming = data.appointments.filter(
    (a) => a.date === todayStr && a.status === "Confirmed"
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl font-black text-slate-900">
              Live Outpatient Waiting Queue
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time outpatient triage, token sequence, and clinical consult progression
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-2 text-xs font-bold text-amber-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            <span>{queueItems.length} Patients in Waiting Area</span>
          </div>
        </div>
      </div>

      {/* Main Queue Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Active Waiting Tokens (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Active Tokens in Room ({queueItems.length})
          </h3>

          {queueItems.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-xs text-slate-400 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="font-semibold text-slate-700">
                The waiting lounge is currently clear!
              </p>
              <p className="max-w-sm mx-auto text-slate-500">
                You can check in patients from today&#39;s confirmed roster on the right panel to generate their queue tokens.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {queueItems.map((apt) => {
                const isCurrentlyConsulting = apt.status === "In Consultation";
                const waitTime = getWaitingMinutes(apt.checkInTime);

                return (
                  <div
                    key={apt.id}
                    className={`p-5 rounded-3xl border transition-all ${
                      isCurrentlyConsulting
                        ? "bg-teal-50/70 border-teal-300 shadow-sm"
                        : "bg-white border-slate-200 shadow-xs"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Left: Token & Patient Info */}
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-bold font-mono shrink-0 shadow-xs ${
                            isCurrentlyConsulting
                              ? "bg-teal-700 text-white"
                              : "bg-amber-100 text-amber-900 border border-amber-300"
                          }`}
                        >
                          <span className="text-[10px] uppercase tracking-wider leading-none">
                            Token
                          </span>
                          <span className="text-xl font-black leading-tight mt-0.5">
                            #{apt.tokenNumber || "—"}
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/demo/patients/${apt.patientId}`}
                              className="font-bold text-base text-slate-900 hover:text-teal-700 hover:underline"
                            >
                              {apt.patientName}
                            </Link>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                isCurrentlyConsulting
                                  ? "bg-teal-700 text-white"
                                  : "bg-amber-100 text-amber-900 border border-amber-200"
                              }`}
                            >
                              {apt.status}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 mt-1">
                            <span>Slot: <strong>{apt.time}</strong></span>
                            <span>•</span>
                            <span className="text-teal-800 font-semibold">{apt.reason}</span>
                            <span>•</span>
                            <span className="text-slate-400">
                              Waiting: ~{waitTime} mins
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Operational Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {!isCurrentlyConsulting ? (
                          <button
                            type="button"
                            onClick={() => {
                              updateAppointmentStatus(apt.id, "In Consultation");
                              setActiveConsultationApt(apt);
                            }}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Call / Consult</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setActiveConsultationApt(apt)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-800 text-white font-bold text-xs shadow-xs hover:bg-teal-900 transition-colors cursor-pointer"
                          >
                            <Stethoscope className="w-3.5 h-3.5" />
                            <span>Open Notes</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => updateAppointmentStatus(apt.id, "Completed")}
                          className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs border border-emerald-200 transition-colors cursor-pointer"
                          title="Mark visit finished"
                        >
                          Finish
                        </button>

                        <button
                          type="button"
                          onClick={() => updateAppointmentStatus(apt.id, "Cancelled")}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Remove from queue"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Confirmed Appointments awaiting check-in (1 col) */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Today&#39;s Expected Arrivals ({todayUpcoming.length})
          </h3>

          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
            <p className="text-xs text-slate-500">
              Patients scheduled for today who have not yet checked in at reception:
            </p>

            {todayUpcoming.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                All scheduled patients for today have checked in!
              </p>
            ) : (
              <div className="space-y-2.5">
                {todayUpcoming.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                  >
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">
                        {apt.patientName}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        Slot: {apt.time}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => updateAppointmentStatus(apt.id, "Checked-in")}
                      className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                    >
                      Check-in Now
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Consultation Modal linked to queue patient */}
      {activeConsultationApt && (
        <NewConsultationModal
          isOpen={!!activeConsultationApt}
          onClose={() => setActiveConsultationApt(null)}
          preselectedPatientId={activeConsultationApt.patientId}
          preselectedAppointmentId={activeConsultationApt.id}
        />
      )}
    </div>
  );
}

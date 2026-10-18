"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Search,
  Printer,
  Pill,
  User,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { useDemoData } from "@/lib/demo-storage";
import { formatDate } from "@/lib/formatters";
import { CreatePrescriptionModal } from "@/components/prescriptions/CreatePrescriptionModal";
import { PrintPrescriptionModal } from "@/components/prescriptions/PrintPrescriptionModal";
import { Prescription } from "@/lib/demo-types";

export default function PrescriptionsPage() {
  const { data } = useDemoData();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPrintRx, setSelectedPrintRx] = useState<Prescription | null>(null);

  const filteredPrescriptions = data.prescriptions.filter((rx) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      rx.patientName.toLowerCase().includes(q) ||
      rx.diagnosis.toLowerCase().includes(q) ||
      rx.id.toLowerCase().includes(q) ||
      rx.medicines.some((m) => m.medicineName.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-700" />
            <h2 className="text-xl font-black text-slate-900">
              Digital Prescriptions
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Standardized digital Rx slips formatted with dosage frequencies, intake guidelines, and print preview
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>+ Write Prescription</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search patient, diagnosis, medicine..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <span className="text-xs text-slate-500 hidden sm:inline-block">
          Showing {filteredPrescriptions.length} issued prescriptions
        </span>
      </div>

      {/* Prescription Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPrescriptions.length === 0 ? (
          <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200 p-16 text-center text-xs text-slate-400">
            No prescriptions found matching &ldquo;{searchTerm}&rdquo;. Click &ldquo;+ Write Prescription&rdquo; to issue one.
          </div>
        ) : (
          filteredPrescriptions.map((rx) => (
            <div
              key={rx.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-teal-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3 mb-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-teal-800">
                      #{rx.id}
                    </span>
                    <Link
                      href={`/demo/patients/${rx.patientId}`}
                      className="font-bold text-base text-slate-900 hover:text-teal-700 hover:underline block"
                    >
                      {rx.patientName}
                    </Link>
                    <span className="text-xs text-slate-500">
                      Date: {formatDate(rx.date)}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-teal-900 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200 truncate max-w-xs">
                    {rx.diagnosis}
                  </span>
                </div>

                {/* Medicine Pills list */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Prescribed Medicines ({rx.medicines.length}):
                  </span>
                  <div className="space-y-1.5">
                    {rx.medicines.map((m) => (
                      <div
                        key={m.id}
                        className="bg-slate-50 p-2 rounded-xl border border-slate-200/80 text-xs flex items-center justify-between"
                      >
                        <div>
                          <span className="font-bold text-slate-900">
                            {m.medicineName}
                          </span>
                          <span className="text-[11px] text-teal-700 font-mono ml-1.5 font-semibold">
                            {m.strength}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600 font-mono">
                          {m.frequency} • {m.duration}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                {rx.generalAdvice && (
                  <p className="mt-3 text-xs text-slate-600 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100 italic">
                    &ldquo;{rx.generalAdvice}&rdquo;
                  </p>
                )}
              </div>

              {/* Action footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/demo/patients/${rx.patientId}`}
                  className="text-xs text-slate-500 hover:text-teal-700 font-semibold"
                >
                  View Patient &rarr;
                </Link>

                <button
                  type="button"
                  onClick={() => setSelectedPrintRx(rx)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      <CreatePrescriptionModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onPrescriptionCreated={(newRx) => setSelectedPrintRx(newRx)}
      />

      <PrintPrescriptionModal
        isOpen={!!selectedPrintRx}
        onClose={() => setSelectedPrintRx(null)}
        prescription={selectedPrintRx}
      />
    </div>
  );
}

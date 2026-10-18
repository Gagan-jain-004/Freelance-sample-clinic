"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Stethoscope,
  Plus,
  Search,
  HeartPulse,
  Pill,
  Calendar,
  User,
  ChevronDown,
  ChevronUp,
  FileText,
  Receipt,
} from "lucide-react";
import { useDemoData } from "@/lib/demo-storage";
import { formatDate } from "@/lib/formatters";
import { NewConsultationModal } from "@/components/consultations/NewConsultationModal";
import { CreatePrescriptionModal } from "@/components/prescriptions/CreatePrescriptionModal";
import { PrintPrescriptionModal } from "@/components/prescriptions/PrintPrescriptionModal";
import { CreateInvoiceModal } from "@/components/billing/CreateInvoiceModal";
import { Consultation, Prescription } from "@/lib/demo-types";

export default function ConsultationsPage() {
  const { data } = useDemoData();

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedConId, setExpandedConId] = useState<string | null>(null);

  // Link to Rx / Billing
  const [selectedConForRx, setSelectedConForRx] = useState<Consultation | null>(null);
  const [selectedConForBill, setSelectedConForBill] = useState<Consultation | null>(null);
  const [printRx, setPrintRx] = useState<Prescription | null>(null);

  const filteredConsultations = data.consultations.filter((c) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      c.patientName.toLowerCase().includes(q) ||
      c.diagnosis.toLowerCase().includes(q) ||
      c.chiefComplaint.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q)
    );
  });

  const toggleExpand = (id: string) => {
    setExpandedConId(expandedConId === id ? null : id);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-teal-700" />
            <h2 className="text-xl font-black text-slate-900">
              Clinical Encounters &amp; Consultations
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Electronic clinical documentation, outpatient vitals, physical findings, and care plans
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsNewModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Consultation</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search diagnosis, complaint, patient..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <span className="text-xs text-slate-500 hidden sm:inline-block">
          Showing {filteredConsultations.length} records
        </span>
      </div>

      {/* Consultations List */}
      <div className="space-y-4">
        {filteredConsultations.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center text-xs text-slate-400">
            No consultations matching current query. Use the &ldquo;+ New Consultation&rdquo; action above.
          </div>
        ) : (
          filteredConsultations.map((con) => {
            const isExpanded = expandedConId === con.id;

            return (
              <div
                key={con.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 transition-all space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <Link
                        href={`/demo/patients/${con.patientId}`}
                        className="text-base font-bold text-slate-900 hover:text-teal-700 hover:underline"
                      >
                        {con.patientName}
                      </Link>
                      <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        #{con.id}
                      </span>
                      {con.isDraft && (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                          Draft
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 mt-1">
                      Consultation Date: {formatDate(con.date, "dd MMM yyyy, hh:mm a")}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start">
                    <span className="text-xs font-bold text-teal-900 bg-teal-50 border border-teal-200 px-3 py-1 rounded-xl">
                      {con.diagnosis}
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleExpand(con.id)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
                      title={isExpanded ? "Collapse" : "Expand details"}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Vitals summary bar */}
                <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-teal-800 font-bold">
                    <HeartPulse className="w-3.5 h-3.5" />
                    <span>Vitals:</span>
                  </div>
                  {con.vitals.bloodPressure && (
                    <span className="text-slate-700">BP: <strong>{con.vitals.bloodPressure}</strong></span>
                  )}
                  {con.vitals.pulse && (
                    <span className="text-slate-700">Pulse: <strong>{con.vitals.pulse}</strong></span>
                  )}
                  {con.vitals.temperature && (
                    <span className="text-slate-700">Temp: <strong>{con.vitals.temperature}</strong></span>
                  )}
                  {con.vitals.weight && (
                    <span className="text-slate-700">Weight: <strong>{con.vitals.weight}</strong></span>
                  )}
                  {con.vitals.spo2 && (
                    <span className="text-slate-700">SpO2: <strong>{con.vitals.spo2}</strong></span>
                  )}
                </div>

                {/* Complaint & Treatment preview */}
                <div className="text-xs text-slate-700 space-y-1">
                  <p>
                    <strong className="text-slate-900">Chief Complaint: </strong>
                    {con.chiefComplaint}
                  </p>
                  <p>
                    <strong className="text-slate-900">Treatment Plan: </strong>
                    {con.treatmentPlan}
                  </p>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="pt-3 border-t border-slate-100 text-xs space-y-3 bg-slate-50/60 p-4 rounded-2xl animate-in fade-in duration-150">
                    {con.symptoms && (
                      <div>
                        <span className="font-bold text-slate-800 block">Reported Symptoms:</span>
                        <p className="text-slate-600 mt-0.5">{con.symptoms}</p>
                      </div>
                    )}
                    {con.examinationNotes && (
                      <div>
                        <span className="font-bold text-slate-800 block">Examination &amp; Physical Findings:</span>
                        <p className="text-slate-600 mt-0.5">{con.examinationNotes}</p>
                      </div>
                    )}
                    {con.advice && (
                      <div>
                        <span className="font-bold text-slate-800 block">Lifestyle &amp; Diet Advice:</span>
                        <p className="text-slate-600 mt-0.5">{con.advice}</p>
                      </div>
                    )}
                    {con.followUpDate && (
                      <div className="text-teal-800 font-semibold">
                        Next Recommended Review: <strong>{formatDate(con.followUpDate)}</strong>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Bar */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedConForRx(con)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Pill className="w-3.5 h-3.5 text-teal-700" />
                      <span>Issue Prescription</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedConForBill(con)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Receipt className="w-3.5 h-3.5 text-teal-700" />
                      <span>Create Bill</span>
                    </button>
                  </div>

                  <Link
                    href={`/demo/patients/${con.patientId}`}
                    className="text-xs font-semibold text-slate-500 hover:text-teal-700"
                  >
                    Open Patient Chart &rarr;
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* New Consultation Modal */}
      <NewConsultationModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
      />

      {/* Write Prescription Modal linked to this consultation */}
      {selectedConForRx && (
        <CreatePrescriptionModal
          isOpen={!!selectedConForRx}
          onClose={() => setSelectedConForRx(null)}
          preselectedPatientId={selectedConForRx.patientId}
          preselectedConsultationId={selectedConForRx.id}
          onPrescriptionCreated={(newRx) => setPrintRx(newRx)}
        />
      )}

      {/* Create Invoice Modal linked to this consultation */}
      {selectedConForBill && (
        <CreateInvoiceModal
          isOpen={!!selectedConForBill}
          onClose={() => setSelectedConForBill(null)}
          preselectedPatientId={selectedConForBill.patientId}
          preselectedAppointmentId={selectedConForBill.appointmentId}
        />
      )}

      {/* Print modal if generated right after consult */}
      <PrintPrescriptionModal
        isOpen={!!printRx}
        onClose={() => setPrintRx(null)}
        prescription={printRx}
      />
    </div>
  );
}

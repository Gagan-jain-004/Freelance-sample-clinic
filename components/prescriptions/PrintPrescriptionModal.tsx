"use client";

import React from "react";
import { Printer, Stethoscope, X, Calendar, Phone, MapPin } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Prescription } from "@/lib/demo-types";
import { useDemoData } from "@/lib/demo-storage";
import { formatDate } from "@/lib/formatters";

interface PrintPrescriptionModalProps {
  prescription: Prescription | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PrintPrescriptionModal({
  prescription,
  isOpen,
  onClose,
}: PrintPrescriptionModalProps) {
  const { data } = useDemoData();

  if (!prescription) return null;

  const patient = data.patients.find((p) => p.id === prescription.patientId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Printable Medical Prescription"
      description="Official prescription slip formatted for standard A4 browser printing"
      maxWidth="4xl"
    >
      <div className="space-y-4">
        {/* Print Action Bar */}
        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200 no-print">
          <p className="text-xs text-slate-600">
            Click <strong>Print Slip</strong> to preview the official clinic letterhead or save as PDF.
          </p>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Slip (Ctrl+P)</span>
          </button>
        </div>

        {/* Printable Canvas */}
        <div className="print-container bg-white border border-slate-300 rounded-2xl p-8 sm:p-10 shadow-sm text-slate-900 font-sans">
          {/* Clinic Header / Letterhead */}
          <div className="border-b-2 border-teal-700 pb-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-teal-800 tracking-tight">
                    {data.settings.clinicName}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {data.settings.tagline}
                  </p>
                  <p className="text-[11px] text-slate-600 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3 h-3 text-teal-600" />
                    <span>{data.settings.address}</span>
                  </p>
                </div>
              </div>

              {/* Doctor Details */}
              <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                <h3 className="text-base font-bold text-slate-900">
                  {data.settings.doctorName}
                </h3>
                <p className="text-xs font-semibold text-teal-700">
                  {data.settings.doctorQualifications}
                </p>
                <p className="text-xs text-slate-600">
                  {data.settings.doctorSpecialty}
                </p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Reg No: {data.settings.doctorRegNumber}
                </p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Ph: {data.settings.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Patient Meta Strip */}
          <div className="bg-slate-50 rounded-xl p-3.5 mb-6 border border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Patient Name
              </span>
              <span className="font-bold text-slate-900 text-sm">
                {prescription.patientName}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Patient ID
              </span>
              <span className="font-mono font-semibold text-teal-800">
                {prescription.patientId}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Age / Gender
              </span>
              <span className="font-medium text-slate-800">
                {prescription.patientAgeGender || (patient ? `${patient.gender}` : "N/A")}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Date Issued
              </span>
              <span className="font-medium text-slate-800">
                {formatDate(prescription.date)}
              </span>
            </div>
          </div>

          {/* Diagnosis */}
          <div className="mb-6 flex items-start gap-2">
            <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
              Diagnosis:
            </span>
            <span className="text-xs font-bold text-teal-900 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200">
              {prescription.diagnosis}
            </span>
          </div>

          {/* Rx Symbol */}
          <div className="font-serif text-3xl font-black text-teal-800 mb-2">
            ℞
          </div>

          {/* Medications Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Medicine &amp; Strength</th>
                  <th className="py-2.5 px-3">Dosage / Form</th>
                  <th className="py-2.5 px-3">Frequency</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3">Instructions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {prescription.medicines.map((med, idx) => (
                  <tr key={med.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900 block text-sm">
                        {med.medicineName}
                      </span>
                      <span className="text-[11px] text-teal-700 font-semibold font-mono">
                        {med.strength} ({med.route})
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700">
                      {med.dosage}
                    </td>
                    <td className="py-3 px-3 font-semibold text-teal-800">
                      {med.frequency}
                    </td>
                    <td className="py-3 px-3 text-slate-700">
                      {med.duration}
                    </td>
                    <td className="py-3 px-3 text-slate-600 italic">
                      {med.instructions}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Advice & Follow-Up */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Advice &amp; Instructions
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/80 p-3 rounded-xl border border-slate-200/60">
                {prescription.generalAdvice || "Take medications as advised. In case of unexpected reactions or fever spikes, consult clinic immediately."}
              </p>

              {prescription.nextFollowUpDate && (
                <p className="mt-3 text-xs text-teal-800 font-semibold">
                  Next Follow-Up Review: <strong>{formatDate(prescription.nextFollowUpDate)}</strong>
                </p>
              )}
            </div>

            {/* Doctor Signature */}
            <div className="flex flex-col items-end justify-end mt-6 sm:mt-0">
              <div className="w-48 text-center border-t border-slate-400 pt-2">
                <p className="text-xs font-bold text-slate-900">
                  {data.settings.doctorName}
                </p>
                <p className="text-[10px] text-slate-500">
                  Authorized Signatory
                </p>
              </div>
            </div>
          </div>

          {/* Print Footer Note */}
          <div className="mt-8 pt-4 border-t border-dashed border-slate-200 text-[10px] text-slate-600 flex items-center justify-between">
            <span>Prescription ID: {prescription.id}</span>
            <span>Generated via {data.settings.clinicName} (Demo)</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}

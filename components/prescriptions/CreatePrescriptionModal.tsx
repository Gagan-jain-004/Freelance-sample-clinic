"use client";

import React, { useState } from "react";
import { Plus, Trash2, Pill, FileText, CheckCircle2 } from "lucide-react";
import { Modal } from "../ui/Modal";
import { MedicineRow, Prescription } from "@/lib/demo-types";
import { addPrescription, useDemoData } from "@/lib/demo-storage";

interface CreatePrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPatientId?: string;
  preselectedConsultationId?: string;
  onPrescriptionCreated?: (prescription: Prescription) => void;
}

export function CreatePrescriptionModal({
  isOpen,
  onClose,
  preselectedPatientId,
  preselectedConsultationId,
  onPrescriptionCreated,
}: CreatePrescriptionModalProps) {
  const { data } = useDemoData();

  const [patientId, setPatientId] = useState(
    preselectedPatientId || data.patients[0]?.id || ""
  );
  const [consultationId, setConsultationId] = useState(
    preselectedConsultationId || ""
  );
  const [diagnosis, setDiagnosis] = useState("General Clinical Management");
  const [generalAdvice, setGeneralAdvice] = useState(
    "Drink plenty of fluids. Take prescribed medications after meals. Adequate rest."
  );
  const [nextFollowUpDate, setNextFollowUpDate] = useState("");
  const [medicines, setMedicines] = useState<MedicineRow[]>([
    {
      id: "med-1",
      medicineName: "Paracetamol",
      strength: "650 mg",
      dosage: "1 Tablet",
      route: "Oral",
      frequency: "1-0-1 (Twice daily)",
      duration: "5 Days",
      instructions: "After food",
    },
    {
      id: "med-2",
      medicineName: "Pantoprazole",
      strength: "40 mg",
      dosage: "1 Tablet",
      route: "Oral",
      frequency: "1-0-0 (Morning empty stomach)",
      duration: "5 Days",
      instructions: "30 mins before breakfast",
    },
  ]);

  const handleAddMedicine = () => {
    const newMed: MedicineRow = {
      id: `med-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      medicineName: "",
      strength: "500 mg",
      dosage: "1 Tablet",
      route: "Oral",
      frequency: "1-0-1",
      duration: "5 Days",
      instructions: "After meals",
    };
    setMedicines([...medicines, newMed]);
  };

  const handleRemoveMedicine = (id: string) => {
    if (medicines.length === 1) return;
    setMedicines(medicines.filter((m) => m.id !== id));
  };

  const handleUpdateMedicine = (id: string, field: keyof MedicineRow, value: string) => {
    setMedicines(
      medicines.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = data.patients.find((p) => p.id === patientId);
    if (!patient) return;

    // Filter out rows without medicine names
    const validMedicines = medicines.filter((m) => m.medicineName.trim().length > 0);
    if (validMedicines.length === 0) {
      alert("Please provide at least one medicine name.");
      return;
    }

    const newRx = addPrescription({
      patientId: patient.id,
      patientName: patient.fullName,
      patientAgeGender: `${patient.gender} • Demo Patient`,
      consultationId: consultationId || undefined,
      date: new Date().toISOString().split("T")[0],
      diagnosis,
      medicines: validMedicines,
      generalAdvice,
      nextFollowUpDate: nextFollowUpDate || undefined,
    });

    onClose();
    if (onPrescriptionCreated) onPrescriptionCreated(newRx);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Digital Prescription"
      description="Add medications with dosages, route, frequencies, and patient instructions"
      maxWidth="4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Patient and Consultation Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Select Patient <span className="text-rose-500">*</span>
            </label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
              required
            >
              {data.patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName} ({p.id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Link Consultation (Optional)
            </label>
            <select
              value={consultationId}
              onChange={(e) => {
                setConsultationId(e.target.value);
                const con = data.consultations.find((c) => c.id === e.target.value);
                if (con) {
                  setDiagnosis(con.diagnosis);
                }
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
            >
              <option value="">-- No consultation link --</option>
              {data.consultations
                .filter((c) => c.patientId === patientId)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id} - {c.diagnosis}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Diagnosis / Clinical Indication <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g. Essential Hypertension"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
              required
            />
          </div>
        </div>

        {/* Medicines Table */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-800 uppercase tracking-wider">
              <Pill className="w-4 h-4 text-teal-600" />
              <span>Prescribed Medications ({medicines.length})</span>
            </div>
            <button
              type="button"
              onClick={handleAddMedicine}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 hover:bg-teal-100 text-xs font-bold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Medicine</span>
            </button>
          </div>

          <div className="space-y-3">
            {medicines.map((med, index) => (
              <div
                key={med.id}
                className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">
                    Medicine #{index + 1}
                  </span>
                  {medicines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMedicine(med.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Remove row"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
                  <div className="col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Drug / Medicine Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Telmisartan"
                      value={med.medicineName}
                      onChange={(e) =>
                        handleUpdateMedicine(med.id, "medicineName", e.target.value)
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Strength
                    </label>
                    <input
                      type="text"
                      placeholder="40 mg"
                      value={med.strength}
                      onChange={(e) =>
                        handleUpdateMedicine(med.id, "strength", e.target.value)
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Dosage Form
                    </label>
                    <input
                      type="text"
                      placeholder="1 Tab"
                      value={med.dosage}
                      onChange={(e) =>
                        handleUpdateMedicine(med.id, "dosage", e.target.value)
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Route
                    </label>
                    <select
                      value={med.route}
                      onChange={(e) =>
                        handleUpdateMedicine(med.id, "route", e.target.value)
                      }
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white"
                    >
                      <option value="Oral">Oral</option>
                      <option value="Topical">Topical</option>
                      <option value="Inhalation">Inhalation</option>
                      <option value="Injectable">Injectable</option>
                      <option value="Drops">Drops</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Frequency
                    </label>
                    <input
                      type="text"
                      placeholder="1-0-1"
                      value={med.frequency}
                      onChange={(e) =>
                        handleUpdateMedicine(med.id, "frequency", e.target.value)
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      placeholder="5 Days"
                      value={med.duration}
                      onChange={(e) =>
                        handleUpdateMedicine(med.id, "duration", e.target.value)
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-3">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Special Intake Instructions
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. After meals with warm water"
                      value={med.instructions}
                      onChange={(e) =>
                        handleUpdateMedicine(med.id, "instructions", e.target.value)
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advice & Next Visit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              General Advice &amp; Lifestyle Instructions
            </label>
            <textarea
              rows={2}
              value={generalAdvice}
              onChange={(e) => setGeneralAdvice(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Next Follow-Up Date (Optional)
            </label>
            <input
              type="date"
              value={nextFollowUpDate}
              onChange={(e) => setNextFollowUpDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 bg-white"
            />
          </div>
        </div>

        {/* Action Bar */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            Issue Prescription
          </button>
        </div>
      </form>
    </Modal>
  );
}

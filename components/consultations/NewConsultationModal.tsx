"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HeartPulse, Stethoscope, Activity, FileText } from "lucide-react";
import { Modal } from "../ui/Modal";
import { consultationSchema, ConsultationFormValues } from "@/lib/demo-validation";
import { addConsultation, useDemoData } from "@/lib/demo-storage";

interface NewConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPatientId?: string;
  preselectedAppointmentId?: string;
  onConsultationCreated?: (consultationId: string) => void;
}

export function NewConsultationModal({
  isOpen,
  onClose,
  preselectedPatientId,
  preselectedAppointmentId,
  onConsultationCreated,
}: NewConsultationModalProps) {
  const { data } = useDemoData();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      patientId: preselectedPatientId || (data.patients[0]?.id ?? ""),
      appointmentId: preselectedAppointmentId || "",
      chiefComplaint: "",
      symptoms: "",
      bloodPressure: "120/80 mmHg",
      pulse: "72 bpm",
      temperature: "98.4 °F",
      weight: "68 kg",
      spo2: "99%",
      examinationNotes: "",
      diagnosis: "",
      treatmentPlan: "",
      advice: "",
      followUpDate: "",
      isDraft: false,
    },
  });

  const selectedPatientId = watch("patientId");
  const selectedPatient = data.patients.find((p) => p.id === selectedPatientId);

  const onSubmit = (values: ConsultationFormValues) => {
    const patient = data.patients.find((p) => p.id === values.patientId);
    if (!patient) return;

    const newCon = addConsultation({
      patientId: patient.id,
      patientName: patient.fullName,
      appointmentId: values.appointmentId || undefined,
      date: new Date().toISOString(),
      chiefComplaint: values.chiefComplaint,
      symptoms: values.symptoms || "",
      vitals: {
        bloodPressure: values.bloodPressure,
        pulse: values.pulse,
        temperature: values.temperature,
        weight: values.weight,
        spo2: values.spo2,
      },
      examinationNotes: values.examinationNotes || "",
      diagnosis: values.diagnosis,
      treatmentPlan: values.treatmentPlan,
      advice: values.advice || "",
      followUpDate: values.followUpDate || undefined,
      isDraft: values.isDraft,
    });

    reset();
    onClose();
    if (onConsultationCreated) onConsultationCreated(newCon.id);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Clinical Encounter (Consultation)"
      description="Document outpatient vitals, physical findings, diagnosis, and care plan"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Patient Selection & Appointment Link */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Patient <span className="text-rose-500">*</span>
            </label>
            <select
              {...register("patientId")}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 bg-white"
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
              Link to Today&#39;s Appointment (Optional)
            </label>
            <select
              {...register("appointmentId")}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 bg-white"
            >
              <option value="">-- No specific appointment --</option>
              {data.appointments
                .filter((a) => a.patientId === selectedPatientId)
                .map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.id} • {a.date} ({a.time}) - {a.status}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Section: Vitals */}
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-teal-800 uppercase tracking-wider">
            <HeartPulse className="w-4 h-4 text-teal-600" />
            <span>Patient Vitals</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Blood Pressure
              </label>
              <input
                type="text"
                placeholder="120/80 mmHg"
                {...register("bloodPressure")}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Pulse (bpm)
              </label>
              <input
                type="text"
                placeholder="72 bpm"
                {...register("pulse")}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Temperature
              </label>
              <input
                type="text"
                placeholder="98.4 °F"
                {...register("temperature")}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Weight (kg)
              </label>
              <input
                type="text"
                placeholder="68 kg"
                {...register("weight")}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                SpO2 (%)
              </label>
              <input
                type="text"
                placeholder="99%"
                {...register("spo2")}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section: Clinical Observations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Chief Complaint <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Recurrent frontal headaches for 3 weeks"
              {...register("chiefComplaint")}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
            {errors.chiefComplaint && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.chiefComplaint.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Associated Symptoms
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Nausea, eye strain after prolonged screen work"
              {...register("symptoms")}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Examination & Diagnosis */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Clinical Physical Examination
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Pupils equal and reactive, tender temporal arteries absent"
              {...register("examinationNotes")}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Clinical Diagnosis <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Tension-Type Headache with Refractive Eye Strain"
              {...register("diagnosis")}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
            {errors.diagnosis && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.diagnosis.message}</p>
            )}
          </div>
        </div>

        {/* Treatment Plan & Advice */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Treatment Plan <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Mild analgesics SOS, ergonomic adjustments, ophthalmology consult"
              {...register("treatmentPlan")}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
            {errors.treatmentPlan && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.treatmentPlan.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Dietary &amp; Lifestyle Advice
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Follow 20-20-20 screen rule, hydrate with 3L water/day"
              {...register("advice")}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Follow-up date */}
        <div className="sm:w-1/2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Recommended Follow-Up Date
          </label>
          <input
            type="date"
            {...register("followUpDate")}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 bg-white"
          />
        </div>

        {/* Submit Bar */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <label className="inline-flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
            <input type="checkbox" {...register("isDraft")} className="rounded text-teal-600" />
            <span>Save as Draft (Patient still in consult)</span>
          </label>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              Save Consultation Record
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

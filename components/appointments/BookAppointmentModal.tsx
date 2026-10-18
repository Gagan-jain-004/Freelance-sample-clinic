"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Clock, DollarSign, AlertCircle, Plus, User } from "lucide-react";
import { Modal } from "../ui/Modal";
import { appointmentBookingSchema, AppointmentBookingFormValues } from "@/lib/demo-validation";
import { addAppointment, useDemoData } from "@/lib/demo-storage";
import { AddPatientModal } from "../patients/AddPatientModal";

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPatientId?: string;
  onAppointmentBooked?: (appointmentId: string) => void;
}

export function BookAppointmentModal({
  isOpen,
  onClose,
  preselectedPatientId,
  onAppointmentBooked,
}: BookAppointmentModalProps) {
  const { data } = useDemoData();
  const [conflictError, setConflictError] = useState<string | null>(null);
  const [addPatientOpen, setAddPatientOpen] = useState(false);

  const todayStr = "2026-10-18";

  const timeSlots = [
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
    "05:30 PM",
    "06:00 PM",
    "06:30 PM",
  ];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentBookingFormValues>({
    resolver: zodResolver(appointmentBookingSchema),
    defaultValues: {
      patientId: preselectedPatientId || (data.patients[0]?.id ?? ""),
      date: todayStr,
      time: "10:30 AM",
      reason: "General Consultation & Checkup",
      fee: data.settings.defaultConsultationFee || 500,
      notes: "",
    },
  });

  const selectedPatientId = watch("patientId");

  const onSubmit = (values: AppointmentBookingFormValues) => {
    // Conflict detection: verify if another active appointment exists for same date and time
    const conflict = data.appointments.find(
      (a) =>
        a.date === values.date &&
        a.time === values.time &&
        a.status !== "Cancelled" &&
        a.status !== "Completed"
    );

    if (conflict) {
      setConflictError(
        `Time slot conflict! Dr. ${data.settings.doctorName} already has an active appointment with ${conflict.patientName} at ${values.time} on ${values.date}. Please choose another slot.`
      );
      return;
    }

    setConflictError(null);

    const patient = data.patients.find((p) => p.id === values.patientId);
    if (!patient) return;

    const newApt = addAppointment({
      patientId: patient.id,
      patientName: patient.fullName,
      patientMobile: patient.mobile,
      date: values.date,
      time: values.time,
      reason: values.reason,
      fee: Number(values.fee),
      notes: values.notes || undefined,
      status: values.date === todayStr ? "Confirmed" : "Confirmed",
    });

    reset();
    onClose();
    if (onAppointmentBooked) onAppointmentBooked(newApt.id);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Schedule Patient Appointment"
        description="Book a consultation slot for an outpatient"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {conflictError && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p>{conflictError}</p>
            </div>
          )}

          {/* Patient Selector */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Select Patient <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setAddPatientOpen(true)}
                className="text-[11px] font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>+ Quick Register New</span>
              </button>
            </div>

            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <select
                {...register("patientId")}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 bg-white"
              >
                <option value="">-- Choose registered patient --</option>
                {data.patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.fullName} ({p.id}) • {p.mobile}
                  </option>
                ))}
              </select>
            </div>
            {errors.patientId && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.patientId.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="date"
                  {...register("date")}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 bg-white"
                />
              </div>
              {errors.date && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.date.message}</p>
              )}
            </div>

            {/* Time Slot */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Time Slot <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <select
                  {...register("time")}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
              {errors.time && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.time.message}</p>
              )}
            </div>

            {/* Consultation Fee */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Consultation Fee (₹)
              </label>
              <div className="relative">
                <span className="text-xs font-bold text-slate-400 absolute left-3 top-2">₹</span>
                <input
                  type="number"
                  {...register("fee")}
                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 bg-white"
                />
              </div>
              {errors.fee && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.fee.message}</p>
              )}
            </div>

            {/* Visit Reason */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Reason for Visit <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Hypertension Follow-up"
                {...register("reason")}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
              {errors.reason && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.reason.message}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Internal Clinical / Reception Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Bring previous blood work reports"
              {...register("notes")}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Doctor Info notice */}
          <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Attending Doctor: <strong>{data.settings.doctorName}</strong> ({data.settings.doctorSpecialty})</span>
            <span className="font-semibold text-teal-700">{data.settings.slotDurationMinutes} min slot</span>
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
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
              Confirm Appointment
            </button>
          </div>
        </form>
      </Modal>

      <AddPatientModal
        isOpen={addPatientOpen}
        onClose={() => setAddPatientOpen(false)}
        onPatientAdded={(newId) => {
          setValue("patientId", newId);
          setAddPatientOpen(false);
        }}
      />
    </>
  );
}

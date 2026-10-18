"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Clock,
  HeartPulse,
  Pill,
  Receipt,
  Printer,
  Plus,
  Edit2,
  CalendarCheck,
  Stethoscope,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { useDemoData, updatePatient, deletePatient } from "@/lib/demo-storage";
import { formatCurrency, formatDate, getStatusBadgeClass } from "@/lib/formatters";
import { BookAppointmentModal } from "@/components/appointments/BookAppointmentModal";
import { NewConsultationModal } from "@/components/consultations/NewConsultationModal";
import { CreatePrescriptionModal } from "@/components/prescriptions/CreatePrescriptionModal";
import { PrintPrescriptionModal } from "@/components/prescriptions/PrintPrescriptionModal";
import { CreateInvoiceModal } from "@/components/billing/CreateInvoiceModal";
import { RecordPaymentModal } from "@/components/billing/RecordPaymentModal";
import { PrintInvoiceModal } from "@/components/billing/PrintInvoiceModal";
import { Prescription, Invoice } from "@/lib/demo-types";
import { Modal } from "@/components/ui/Modal";

export default function PatientDetailPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-xs text-slate-400">Loading patient chart...</div>}>
      <PatientDetailContent />
    </React.Suspense>
  );
}

function PatientDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { data } = useDemoData();

  const patientId = params?.id as string;
  const patient = data.patients.find((p) => p.id === patientId);

  const [activeTab, setActiveTab] = useState<
    "appointments" | "consultations" | "prescriptions" | "billing"
  >("appointments");

  // Modal states
  const [bookAptOpen, setBookAptOpen] = useState(false);
  const [newConsultOpen, setNewConsultOpen] = useState(false);
  const [createRxOpen, setCreateRxOpen] = useState(false);
  const [createInvoiceOpen, setCreateInvoiceOpen] = useState(false);

  // Print modals
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentInvoice, setPaymentInvoice] = useState<Invoice | null>(null);

  // Edit modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(patient?.fullName || "");
  const [editMobile, setEditMobile] = useState(patient?.mobile || "");
  const [editEmail, setEditEmail] = useState(patient?.email || "");
  const [editAddress, setEditAddress] = useState(patient?.address || "");
  const [editReason, setEditReason] = useState(patient?.reasonForVisit || "");
  const [editNotes, setEditNotes] = useState(patient?.demoNotes || "");

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  if (!patient) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto my-12">
        <h3 className="text-lg font-bold text-slate-900">Patient Record Not Found</h3>
        <p className="text-xs text-slate-500 mt-2">
          The requested patient ID &ldquo;{patientId}&rdquo; was not found in browser demo storage.
        </p>
        <Link
          href="/demo/patients"
          className="mt-6 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Patient Directory</span>
        </Link>
      </div>
    );
  }

  // Related collections
  const patientAppointments = data.appointments.filter((a) => a.patientId === patient.id);
  const patientConsultations = data.consultations.filter((c) => c.patientId === patient.id);
  const patientPrescriptions = data.prescriptions.filter((p) => p.patientId === patient.id);
  const patientInvoices = data.invoices.filter((i) => i.patientId === patient.id);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePatient({
      ...patient,
      fullName: editName,
      mobile: editMobile,
      email: editEmail || undefined,
      address: editAddress || undefined,
      reasonForVisit: editReason || undefined,
      demoNotes: editNotes || undefined,
    });
    setEditModalOpen(false);
  };

  const handleDelete = () => {
    deletePatient(patient.id);
    router.push("/demo/patients");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Back button & Title Strip */}
      <div className="flex items-center justify-between">
        <Link
          href="/demo/patients"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Patients</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setEditModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Edit Record</span>
          </button>
          <button
            type="button"
            onClick={() => setDeleteModalOpen(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
            title="Delete demo patient"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Patient Demographic Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-teal-700/20 shrink-0">
              {patient.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {patient.fullName}
                </h2>
                <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200">
                  {patient.id}
                </span>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                  {patient.gender}
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-1">
                Registered on {formatDate(patient.registrationDate)}
              </p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-6 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-semibold">{patient.mobile}</span>
                </div>
                {patient.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{patient.email}</span>
                  </div>
                )}
                {patient.dob && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>DOB: {formatDate(patient.dob)}</span>
                  </div>
                )}
                {patient.address && (
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{patient.address}</span>
                  </div>
                )}
              </div>

              {patient.reasonForVisit && (
                <div className="mt-3 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 max-w-xl">
                  <span className="font-bold text-slate-700">Reason for visit: </span>
                  <span className="text-slate-600">{patient.reasonForVisit}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Consultation & Booking Triggers */}
          <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setBookAptOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>

            <button
              type="button"
              onClick={() => setNewConsultOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
            >
              <Stethoscope className="w-3.5 h-3.5 text-teal-700" />
              <span>New Consult</span>
            </button>

            <button
              type="button"
              onClick={() => setCreateInvoiceOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
            >
              <Receipt className="w-3.5 h-3.5 text-teal-700" />
              <span>Bill Patient</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("appointments")}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === "appointments"
              ? "border-teal-700 text-teal-800"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Appointments ({patientAppointments.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("consultations")}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === "consultations"
              ? "border-teal-700 text-teal-800"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Consultations ({patientConsultations.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("prescriptions")}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === "prescriptions"
              ? "border-teal-700 text-teal-800"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Prescriptions ({patientPrescriptions.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("billing")}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === "billing"
              ? "border-teal-700 text-teal-800"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Invoices &amp; Receipts ({patientInvoices.length})
        </button>
      </div>

      {/* Tab 1: Appointments */}
      {activeTab === "appointments" && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Appointment History
            </h3>
            <button
              type="button"
              onClick={() => setBookAptOpen(true)}
              className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:underline cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule New</span>
            </button>
          </div>

          {patientAppointments.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">
              No appointments on record for this patient.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {patientAppointments.map((apt) => {
                const badge = getStatusBadgeClass(apt.status);
                return (
                  <div key={apt.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">
                          {formatDate(apt.date)} at {apt.time}
                        </span>
                        {apt.tokenNumber && (
                          <span className="text-[10px] font-mono px-1.5 bg-slate-100 text-slate-600 rounded">
                            Token #{apt.tokenNumber}
                          </span>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                          {apt.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{apt.reason}</p>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-xs font-semibold text-slate-900">
                        {formatCurrency(apt.fee)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Consultations */}
      {activeTab === "consultations" && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Clinical Consultations &amp; Diagnostic Notes
            </h3>
            <button
              type="button"
              onClick={() => setNewConsultOpen(true)}
              className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:underline cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Consultation</span>
            </button>
          </div>

          {patientConsultations.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">
              No clinical consultations recorded for this patient.
            </p>
          ) : (
            <div className="space-y-4">
              {patientConsultations.map((con) => (
                <div
                  key={con.id}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/70 pb-2.5">
                    <div>
                      <span className="font-mono text-[11px] font-bold text-teal-800">
                        #{con.id}
                      </span>
                      <span className="text-xs text-slate-500 ml-2">
                        {formatDate(con.date, "dd MMM yyyy, hh:mm a")}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-teal-900 bg-teal-100/70 px-2.5 py-0.5 rounded-md border border-teal-200">
                      {con.diagnosis}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-white p-2.5 rounded-xl border border-slate-200/80 font-mono">
                    {con.vitals.bloodPressure && (
                      <div>
                        <span className="text-slate-400 block text-[10px]">BP:</span>
                        <span className="font-semibold">{con.vitals.bloodPressure}</span>
                      </div>
                    )}
                    {con.vitals.pulse && (
                      <div>
                        <span className="text-slate-400 block text-[10px]">Pulse:</span>
                        <span className="font-semibold">{con.vitals.pulse}</span>
                      </div>
                    )}
                    {con.vitals.temperature && (
                      <div>
                        <span className="text-slate-400 block text-[10px]">Temp:</span>
                        <span className="font-semibold">{con.vitals.temperature}</span>
                      </div>
                    )}
                    {con.vitals.weight && (
                      <div>
                        <span className="text-slate-400 block text-[10px]">Weight:</span>
                        <span className="font-semibold">{con.vitals.weight}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-xs space-y-1.5">
                    <p>
                      <strong className="text-slate-700">Chief Complaint: </strong>
                      <span className="text-slate-600">{con.chiefComplaint}</span>
                    </p>
                    {con.symptoms && (
                      <p>
                        <strong className="text-slate-700">Symptoms: </strong>
                        <span className="text-slate-600">{con.symptoms}</span>
                      </p>
                    )}
                    <p>
                      <strong className="text-slate-700">Treatment Plan: </strong>
                      <span className="text-slate-600">{con.treatmentPlan}</span>
                    </p>
                    {con.advice && (
                      <p>
                        <strong className="text-slate-700">Advice: </strong>
                        <span className="text-slate-600">{con.advice}</span>
                      </p>
                    )}
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setCreateRxOpen(true)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:underline cursor-pointer"
                    >
                      <Pill className="w-3.5 h-3.5" />
                      <span>Issue Prescription for this visit &rarr;</span>
                    </button>
                    {con.followUpDate && (
                      <span className="text-[11px] text-slate-500">
                        Follow-up: <strong>{formatDate(con.followUpDate)}</strong>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Prescriptions */}
      {activeTab === "prescriptions" && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Prescriptions Issued
            </h3>
            <button
              type="button"
              onClick={() => setCreateRxOpen(true)}
              className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:underline cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Write Prescription</span>
            </button>
          </div>

          {patientPrescriptions.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">
              No prescriptions issued to this patient yet.
            </p>
          ) : (
            <div className="space-y-4">
              {patientPrescriptions.map((rx) => (
                <div
                  key={rx.id}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-teal-800">
                        #{rx.id}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {rx.diagnosis}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Issued on {formatDate(rx.date)} • {rx.medicines.length} medications prescribed
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {rx.medicines.map((m) => (
                        <span
                          key={m.id}
                          className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-700 font-semibold"
                        >
                          {m.medicineName} ({m.strength})
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedRx(rx)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-colors self-start sm:self-center cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Slip</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Billing */}
      {activeTab === "billing" && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Billing History &amp; Invoices
            </h3>
            <button
              type="button"
              onClick={() => setCreateInvoiceOpen(true)}
              className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:underline cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Invoice</span>
            </button>
          </div>

          {patientInvoices.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">
              No billing records for this patient.
            </p>
          ) : (
            <div className="space-y-3">
              {patientInvoices.map((inv) => {
                const badge = getStatusBadgeClass(inv.status);
                return (
                  <div
                    key={inv.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-teal-800">
                          #{inv.id}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                          {inv.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Dated: {formatDate(inv.invoiceDate)} • {inv.items.length} line items
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-sm font-bold text-slate-900 font-mono block">
                          {formatCurrency(inv.totalAmount)}
                        </span>
                        {inv.balanceAmount > 0 ? (
                          <span className="text-[11px] text-rose-600 font-bold block font-mono">
                            Due: {formatCurrency(inv.balanceAmount)}
                          </span>
                        ) : (
                          <span className="text-[11px] text-emerald-600 font-semibold block">
                            Settled in full
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {inv.balanceAmount > 0 && (
                          <button
                            type="button"
                            onClick={() => setPaymentInvoice(inv)}
                            className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 font-bold text-xs border border-teal-200 transition-colors cursor-pointer"
                          >
                            Pay
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setSelectedInvoice(inv)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-white border border-slate-200 transition-colors"
                          title="Print receipt"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Edit Patient Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Patient Record"
        description="Update demographics and contact numbers"
        maxWidth="md"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              Mobile Number *
            </label>
            <input
              type="tel"
              value={editMobile}
              onChange={(e) => setEditMobile(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              Address
            </label>
            <input
              type="text"
              value={editAddress}
              onChange={(e) => setEditAddress(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              Reason for Visit / Clinical Tag
            </label>
            <input
              type="text"
              value={editReason}
              onChange={(e) => setEditReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              Demo Notes
            </label>
            <textarea
              rows={2}
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-700 text-white font-bold text-xs"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Patient Record"
        description="Permanently remove demo record from browser localStorage"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <p>
              Are you sure you want to delete <strong>{patient.fullName}</strong> ({patient.id})? This action cannot be undone.
            </p>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* Modals */}
      <BookAppointmentModal
        isOpen={bookAptOpen}
        onClose={() => setBookAptOpen(false)}
        preselectedPatientId={patient.id}
      />

      <NewConsultationModal
        isOpen={newConsultOpen}
        onClose={() => setNewConsultOpen(false)}
        preselectedPatientId={patient.id}
      />

      <CreatePrescriptionModal
        isOpen={createRxOpen}
        onClose={() => setCreateRxOpen(false)}
        preselectedPatientId={patient.id}
        onPrescriptionCreated={(newRx) => setSelectedRx(newRx)}
      />

      <PrintPrescriptionModal
        isOpen={!!selectedRx}
        onClose={() => setSelectedRx(null)}
        prescription={selectedRx}
      />

      <CreateInvoiceModal
        isOpen={createInvoiceOpen}
        onClose={() => setCreateInvoiceOpen(false)}
        preselectedPatientId={patient.id}
      />

      <RecordPaymentModal
        isOpen={!!paymentInvoice}
        onClose={() => setPaymentInvoice(null)}
        invoice={paymentInvoice}
      />

      <PrintInvoiceModal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        invoice={selectedInvoice}
      />
    </div>
  );
}

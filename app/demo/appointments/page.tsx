"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  CalendarCheck,
  Plus,
  Search,
  Filter,
  Download,
  Clock,
  User,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from "lucide-react";
import {
  useDemoData,
  updateAppointmentStatus,
  rescheduleAppointment,
} from "@/lib/demo-storage";
import { formatCurrency, formatDate, getStatusBadgeClass } from "@/lib/formatters";
import { BookAppointmentModal } from "@/components/appointments/BookAppointmentModal";
import { Appointment, AppointmentStatus } from "@/lib/demo-types";
import { Modal } from "@/components/ui/Modal";

export default function AppointmentsPage() {
  const { data } = useDemoData();

  const [dateFilter, setDateFilter] = useState<"today" | "tomorrow" | "all">("all");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  // Reschedule state
  const [rescheduleApt, setRescheduleApt] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");

  const todayStr = "2026-10-18";
  const tomorrowStr = "2026-10-19";

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
  ];

  // Filtering
  const filteredAppointments = data.appointments.filter((apt) => {
    // Date filter
    if (dateFilter === "today" && apt.date !== todayStr) return false;
    if (dateFilter === "tomorrow" && apt.date !== tomorrowStr) return false;

    // Status filter
    if (statusFilter !== "ALL" && apt.status !== statusFilter) return false;

    // Search filter
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match =
        apt.patientName.toLowerCase().includes(q) ||
        apt.id.toLowerCase().includes(q) ||
        apt.patientMobile.includes(q) ||
        apt.reason.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  // Handle Reschedule submit
  const handleSaveReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleApt || !rescheduleDate || !rescheduleTime) return;
    rescheduleAppointment(rescheduleApt.id, rescheduleDate, rescheduleTime);
    setRescheduleApt(null);
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      "Appointment ID",
      "Patient Name",
      "Mobile",
      "Date",
      "Time",
      "Status",
      "Token",
      "Reason",
      "Fee (INR)",
    ];
    const rows = filteredAppointments.map((a) => [
      `"${a.id}"`,
      `"${a.patientName}"`,
      `"${a.patientMobile}"`,
      `"${a.date}"`,
      `"${a.time}"`,
      `"${a.status}"`,
      `"${a.tokenNumber || ""}"`,
      `"${a.reason}"`,
      `"${a.fee}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      "# NOTICE: DEMO DATA ONLY - FOR EVALUATION PURPOSES ONLY\n" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `demo_appointments_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-teal-700" />
            <h2 className="text-xl font-black text-slate-900">
              Appointment Management &amp; Scheduling
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage outpatient consultation slots, check-ins, and conflict-free bookings
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setIsBookModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Book Slot</span>
          </button>
        </div>
      </div>

      {/* Date Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Date Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full md:w-auto">
          <button
            type="button"
            onClick={() => setDateFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              dateFilter === "all"
                ? "bg-white text-teal-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All Dates ({data.appointments.length})
          </button>
          <button
            type="button"
            onClick={() => setDateFilter("today")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              dateFilter === "today"
                ? "bg-white text-teal-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Today ({data.appointments.filter((a) => a.date === todayStr).length})
          </button>
          <button
            type="button"
            onClick={() => setDateFilter("tomorrow")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              dateFilter === "tomorrow"
                ? "bg-white text-teal-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Tomorrow ({data.appointments.filter((a) => a.date === tomorrowStr).length})
          </button>
        </div>

        {/* Search & Status Filter */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter patient, slot, or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Checked-in">Checked-in</option>
            <option value="In Consultation">In Consultation</option>
            <option value="Completed">Completed</option>
            <option value="Requested">Requested</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Appointment Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredAppointments.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            No appointments found matching current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Date &amp; Time</th>
                  <th className="py-3 px-4">Patient Details</th>
                  <th className="py-3 px-4">Visit Reason</th>
                  <th className="py-3 px-4">Fee (₹)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAppointments.map((apt) => {
                  const badge = getStatusBadgeClass(apt.status);
                  return (
                    <tr key={apt.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Date & Time */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-bold text-slate-900 text-sm block">
                          {formatDate(apt.date)}
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px] mt-0.5">
                          <Clock className="w-3 h-3 text-teal-600" />
                          <span>{apt.time}</span>
                          {apt.tokenNumber && (
                            <span className="bg-slate-100 px-1.5 py-0.2 rounded font-bold text-slate-700">
                              Token #{apt.tokenNumber}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Patient Details */}
                      <td className="py-3.5 px-4">
                        <Link
                          href={`/demo/patients/${apt.patientId}`}
                          className="font-bold text-slate-900 hover:text-teal-700 hover:underline block"
                        >
                          {apt.patientName}
                        </Link>
                        <span className="text-[11px] text-slate-500">
                          {apt.patientMobile}
                        </span>
                      </td>

                      {/* Visit Reason */}
                      <td className="py-3.5 px-4 text-slate-700">
                        <span className="font-medium truncate max-w-xs block">
                          {apt.reason}
                        </span>
                      </td>

                      {/* Fee */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                        {formatCurrency(apt.fee)}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          <span>{apt.status}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {apt.status === "Confirmed" && (
                            <button
                              type="button"
                              onClick={() => updateAppointmentStatus(apt.id, "Checked-in")}
                              className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold text-xs border border-sky-200 transition-colors cursor-pointer"
                              title="Check-in patient to waiting queue"
                            >
                              Check In
                            </button>
                          )}

                          {apt.status === "Checked-in" && (
                            <button
                              type="button"
                              onClick={() => updateAppointmentStatus(apt.id, "In Consultation")}
                              className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 font-bold text-xs border border-teal-200 transition-colors cursor-pointer"
                              title="Start clinical consultation"
                            >
                              Consult
                            </button>
                          )}

                          {apt.status === "In Consultation" && (
                            <button
                              type="button"
                              onClick={() => updateAppointmentStatus(apt.id, "Completed")}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs border border-emerald-200 transition-colors cursor-pointer"
                              title="Mark appointment completed"
                            >
                              Complete
                            </button>
                          )}

                          {/* Reschedule Button */}
                          {apt.status !== "Completed" && apt.status !== "Cancelled" && (
                            <button
                              type="button"
                              onClick={() => {
                                setRescheduleApt(apt);
                                setRescheduleDate(apt.date);
                                setRescheduleTime(apt.time);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                              title="Reschedule slot"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Cancel Button */}
                          {apt.status !== "Cancelled" && apt.status !== "Completed" && (
                            <button
                              type="button"
                              onClick={() => updateAppointmentStatus(apt.id, "Cancelled")}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Cancel appointment"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
          <span>Showing {filteredAppointments.length} appointments</span>
          <span className="text-[11px] text-teal-800 font-semibold">
            Single-doctor practice schedule • {data.settings.doctorName}
          </span>
        </div>
      </div>

      {/* Book Appointment Modal */}
      <BookAppointmentModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
      />

      {/* Reschedule Modal */}
      <Modal
        isOpen={!!rescheduleApt}
        onClose={() => setRescheduleApt(null)}
        title="Reschedule Appointment"
        description={
          rescheduleApt
            ? `Moving slot for ${rescheduleApt.patientName} (Current: ${rescheduleApt.date} ${rescheduleApt.time})`
            : ""
        }
        maxWidth="md"
      >
        <form onSubmit={handleSaveReschedule} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              New Date *
            </label>
            <input
              type="date"
              value={rescheduleDate}
              onChange={(e) => setRescheduleDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              New Time Slot *
            </label>
            <select
              value={rescheduleTime}
              onChange={(e) => setRescheduleTime(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
              required
            >
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setRescheduleApt(null)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-700 text-white font-bold text-xs"
            >
              Confirm Reschedule
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

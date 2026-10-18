"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  CalendarCheck,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  Clock,
  Plus,
  ArrowRight,
  TrendingUp,
  Activity,
  Calendar,
  Receipt,
  Stethoscope,
  ChevronRight,
  UserPlus,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import { useDemoData, updateAppointmentStatus } from "@/lib/demo-storage";
import {
  calculateDashboardMetrics,
  calculateWeeklyTrends,
  calculateRevenueTrends,
} from "@/lib/demo-calculations";
import { formatCurrency, formatDate, getStatusBadgeClass } from "@/lib/formatters";
import { AddPatientModal } from "@/components/patients/AddPatientModal";
import { BookAppointmentModal } from "@/components/appointments/BookAppointmentModal";
import { NewConsultationModal } from "@/components/consultations/NewConsultationModal";
import { CreateInvoiceModal } from "@/components/billing/CreateInvoiceModal";

export default function DashboardOverviewPage() {
  const { data } = useDemoData();

  const [addPatientOpen, setAddPatientOpen] = useState(false);
  const [bookAptOpen, setBookAptOpen] = useState(false);
  const [newConsultOpen, setNewConsultOpen] = useState(false);
  const [createInvoiceOpen, setCreateInvoiceOpen] = useState(false);

  const metrics = calculateDashboardMetrics(data);
  const weeklyTrends = calculateWeeklyTrends(data.appointments);
  const revenueTrends = calculateRevenueTrends(data.invoices);

  const todayStr = "2026-10-18";
  const todayAppointments = data.appointments.filter((a) => a.date === todayStr);
  const upcomingAppointments = data.appointments
    .filter((a) => a.date > todayStr)
    .slice(0, 5);

  const waitingQueue = todayAppointments.filter((a) => a.status === "Checked-in");

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner / Welcome & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
              Active Outpatient Clinic Portal
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1">
            Welcome back, {data.settings.doctorName}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {data.settings.doctorSpecialty} • {data.settings.clinicName}
          </p>
        </div>

        {/* 4 Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setAddPatientOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Add Patient</span>
          </button>

          <button
            type="button"
            onClick={() => setBookAptOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
          >
            <CalendarCheck className="w-3.5 h-3.5 text-teal-700" />
            <span>Book Appointment</span>
          </button>

          <button
            type="button"
            onClick={() => setNewConsultOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
          >
            <Stethoscope className="w-3.5 h-3.5 text-teal-700" />
            <span>Start Consult</span>
          </button>

          <button
            type="button"
            onClick={() => setCreateInvoiceOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
          >
            <Receipt className="w-3.5 h-3.5 text-teal-700" />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Patients */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Patients</span>
            <Users className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{metrics.totalPatients}</div>
          <Link href="/demo/patients" className="text-[11px] text-teal-700 font-semibold hover:underline mt-1 block">
            View all directory &rarr;
          </Link>
        </div>

        {/* Today's Appointments */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Today&#39;s Slots</span>
            <CalendarCheck className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{metrics.todayAppointmentsCount}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {metrics.todayCompletedCount} Completed
          </span>
        </div>

        {/* Patients Waiting */}
        <div className="bg-white p-4 rounded-2xl border border-amber-200/80 bg-amber-50/20 shadow-2xs hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between text-amber-800 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Waiting Queue</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-900">{metrics.waitingQueueCount}</div>
          <Link href="/demo/queue" className="text-[11px] text-amber-700 font-semibold hover:underline mt-1 block">
            Open waiting room &rarr;
          </Link>
        </div>

        {/* Completed Today */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Done Today</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{metrics.todayCompletedCount}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Consultations done
          </span>
        </div>

        {/* Today's Collection */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Today Collected</span>
            <DollarSign className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-teal-800 font-mono">
            {formatCurrency(metrics.todayCollectionAmount)}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            UPI, Cash &amp; Cards
          </span>
        </div>

        {/* Pending Balance */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending Balances</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 font-mono">
            {formatCurrency(metrics.pendingBalanceAmount)}
          </div>
          <Link href="/demo/billing" className="text-[11px] text-rose-700 font-semibold hover:underline mt-1 block">
            Review invoices &rarr;
          </Link>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Appointment Volume Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Weekly Appointments &amp; Completed Visits
              </h3>
              <p className="text-xs text-slate-500">Last 7 days clinical workload</p>
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
              Live Chart
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderRadius: "0.75rem",
                    border: "none",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="appointments" fill="#38bdf8" name="Appointments" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" fill="#0f766e" name="Completed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Performance Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Monthly Billing &amp; Collection Performance
              </h3>
              <p className="text-xs text-slate-500">Revenue trajectory (₹)</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              Financial Trend
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrends}>
                <defs>
                  <linearGradient id="colorBilled" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f766e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickFormatter={(v) => `₹${v / 1000}k`}
                />
                <Tooltip
                  formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, ""]}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderRadius: "0.75rem",
                    border: "none",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="billed"
                  stroke="#0f766e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorBilled)"
                  name="Total Billed"
                />
                <Area
                  type="monotone"
                  dataKey="collected"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCollected)"
                  name="Collected"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Today's Appointments & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Today&#39;s Appointment Roster ({todayAppointments.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Schedule for today (18 Oct 2026)
                </p>
              </div>
              <Link
                href="/demo/appointments"
                className="text-xs font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1"
              >
                <span>View Full Calendar</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {todayAppointments.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No appointments booked for today. Use the "+ Book Appointment" action above.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {todayAppointments.slice(0, 6).map((apt) => {
                  const badge = getStatusBadgeClass(apt.status);
                  return (
                    <div
                      key={apt.id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 rounded-xl px-2 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs flex flex-col items-center justify-center shrink-0">
                          <span className="font-mono text-teal-800">{apt.time.split(" ")[0]}</span>
                          <span className="text-[9px] text-slate-500">{apt.time.split(" ")[1]}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900">
                              {apt.patientName}
                            </span>
                            {apt.tokenNumber && (
                              <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                                Token #{apt.tokenNumber}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 truncate max-w-xs">
                            {apt.reason}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badge.bg}`}>
                          {apt.status}
                        </span>

                        {/* Quick state triggers */}
                        {apt.status === "Confirmed" && (
                          <button
                            type="button"
                            onClick={() => updateAppointmentStatus(apt.id, "Checked-in")}
                            className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-bold border border-sky-200 transition-colors cursor-pointer"
                          >
                            Check-in
                          </button>
                        )}
                        {apt.status === "Checked-in" && (
                          <button
                            type="button"
                            onClick={() => updateAppointmentStatus(apt.id, "In Consultation")}
                            className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 text-xs font-bold border border-teal-200 transition-colors cursor-pointer"
                          >
                            Start Consult
                          </button>
                        )}
                        {apt.status === "In Consultation" && (
                          <button
                            type="button"
                            onClick={() => updateAppointmentStatus(apt.id, "Completed")}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold border border-emerald-200 transition-colors cursor-pointer"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing top today&#39;s consultations</span>
            <Link href="/demo/appointments" className="font-semibold text-teal-700 hover:underline">
              Manage all {todayAppointments.length} appointments
            </Link>
          </div>
        </div>

        {/* Live Waiting Queue & Activity Feed (1 col) */}
        <div className="space-y-6">
          {/* Waiting Room Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Patients In Waiting Queue ({waitingQueue.length})
                </h3>
              </div>
              <Link href="/demo/queue" className="text-xs text-teal-700 font-bold hover:underline">
                View Queue
              </Link>
            </div>

            {waitingQueue.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                Waiting room is currently clear.
              </p>
            ) : (
              <div className="space-y-2">
                {waitingQueue.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900">
                          {item.patientName}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 bg-amber-200 text-amber-900 rounded font-mono">
                          Token #{item.tokenNumber}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 block">
                        Slot: {item.time}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => updateAppointmentStatus(item.id, "In Consultation")}
                      className="px-2.5 py-1 rounded-lg bg-teal-700 text-white font-bold text-[11px] hover:bg-teal-800 transition-colors cursor-pointer"
                    >
                      Call Next
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity Log */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  Recent Clinic Activity
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Real-time log</span>
            </div>

            <div className="space-y-3">
              {(data.activityLogs || []).slice(0, 5).map((act) => (
                <div key={act.id} className="text-xs flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-800 leading-tight">
                      {act.title}
                    </p>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                      {act.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Global Modals */}
      <AddPatientModal
        isOpen={addPatientOpen}
        onClose={() => setAddPatientOpen(false)}
      />

      <BookAppointmentModal
        isOpen={bookAptOpen}
        onClose={() => setBookAptOpen(false)}
      />

      <NewConsultationModal
        isOpen={newConsultOpen}
        onClose={() => setNewConsultOpen(false)}
      />

      <CreateInvoiceModal
        isOpen={createInvoiceOpen}
        onClose={() => setCreateInvoiceOpen(false)}
      />
    </div>
  );
}

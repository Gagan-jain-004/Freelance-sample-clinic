"use client";

import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  Users,
  CheckCircle2,
  PieChart as PieChartIcon,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { useDemoData } from "@/lib/demo-storage";
import {
  calculateAppointmentStatusDistribution,
  calculateDashboardMetrics,
  calculateRevenueTrends,
  calculateWeeklyTrends,
} from "@/lib/demo-calculations";
import { formatCurrency } from "@/lib/formatters";

export default function ReportsPage() {
  const { data } = useDemoData();

  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "all">("30d");

  const metrics = calculateDashboardMetrics(data);
  const statusDistribution = calculateAppointmentStatusDistribution(data.appointments);
  const weeklyTrends = calculateWeeklyTrends(data.appointments);
  const revenueTrends = calculateRevenueTrends(data.invoices);

  // Export functions with clear demo warnings
  const handleExport = (type: "patients" | "appointments" | "invoices") => {
    let headers: string[] = [];
    let rows: string[][] = [];
    let filename = "";

    const todayStr = new Date().toISOString().split("T")[0];

    if (type === "patients") {
      filename = `demo_patients_report_${todayStr}.csv`;
      headers = ["ID", "Name", "Mobile", "Gender", "RegistrationDate", "PrimaryReason"];
      rows = data.patients.map((p) => [
        `"${p.id}"`,
        `"${p.fullName}"`,
        `"${p.mobile}"`,
        `"${p.gender}"`,
        `"${p.registrationDate}"`,
        `"${p.reasonForVisit || ""}"`,
      ]);
    } else if (type === "appointments") {
      filename = `demo_appointments_report_${todayStr}.csv`;
      headers = ["ID", "PatientName", "Date", "Time", "Status", "Reason", "Fee"];
      rows = data.appointments.map((a) => [
        `"${a.id}"`,
        `"${a.patientName}"`,
        `"${a.date}"`,
        `"${a.time}"`,
        `"${a.status}"`,
        `"${a.reason}"`,
        `"${a.fee}"`,
      ]);
    } else {
      filename = `demo_invoices_report_${todayStr}.csv`;
      headers = ["ID", "PatientName", "Date", "Status", "Total", "Paid", "Balance"];
      rows = data.invoices.map((i) => [
        `"${i.id}"`,
        `"${i.patientName}"`,
        `"${i.invoiceDate}"`,
        `"${i.status}"`,
        `"${i.totalAmount}"`,
        `"${i.paidAmount}"`,
        `"${i.balanceAmount}"`,
      ]);
    }

    const csvContent =
      "data:text/csv;charset=utf-8," +
      "# NOTICE: DEMO DATA ONLY - FOR EVALUATION PURPOSES ONLY\n" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-700" />
            <h2 className="text-xl font-black text-slate-900">
              Clinic Reports &amp; Practice Analytics
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Visual metrics derived dynamically from your local browser clinic dataset
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start sm:self-center">
          <button
            type="button"
            onClick={() => setTimeframe("7d")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              timeframe === "7d" ? "bg-white text-teal-800 shadow-xs" : "text-slate-600"
            }`}
          >
            Last 7 Days
          </button>
          <button
            type="button"
            onClick={() => setTimeframe("30d")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              timeframe === "30d" ? "bg-white text-teal-800 shadow-xs" : "text-slate-600"
            }`}
          >
            Last 30 Days
          </button>
          <button
            type="button"
            onClick={() => setTimeframe("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              timeframe === "all" ? "bg-white text-teal-800 shadow-xs" : "text-slate-600"
            }`}
          >
            All-Time
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Total Revenue Billed
          </span>
          <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">
            {formatCurrency(metrics.totalRevenue + metrics.pendingBalanceAmount)}
          </span>
          <span className="text-xs text-teal-700 font-semibold mt-0.5 block">
            {data.invoices.length} total invoices
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Collected Revenue
          </span>
          <span className="text-2xl font-black text-emerald-700 font-mono mt-1 block">
            {formatCurrency(metrics.totalRevenue)}
          </span>
          <span className="text-xs text-emerald-600 font-semibold mt-0.5 block">
            Settled via UPI, Cash &amp; Cards
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Outstanding Balances
          </span>
          <span className="text-2xl font-black text-rose-600 font-mono mt-1 block">
            {formatCurrency(metrics.pendingBalanceAmount)}
          </span>
          <span className="text-xs text-rose-600 font-medium mt-0.5 block">
            Pending patient settlement
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Total Consultations
          </span>
          <span className="text-2xl font-black text-teal-800 font-mono mt-1 block">
            {data.consultations.length}
          </span>
          <span className="text-xs text-slate-500 mt-0.5 block">
            {data.patients.length} active patients
          </span>
        </div>
      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Revenue & Collections */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Monthly Billing vs. Collection Trends
              </h3>
              <p className="text-xs text-slate-500">Trailing financial performance (₹)</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              Collections
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickFormatter={(v) => `₹${v / 1000}k`}
                />
                <Tooltip
                  formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, ""]}
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
                  fill="#0f766e"
                  fillOpacity={0.15}
                  name="Total Invoiced"
                />
                <Area
                  type="monotone"
                  dataKey="collected"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.25}
                  name="Total Collected"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Appointment Status Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Appointment Status Distribution
              </h3>
              <p className="text-xs text-slate-500">Breakdown of scheduled visits</p>
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
              Status Mix
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderRadius: "0.75rem",
                    border: "none",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-xs font-medium text-slate-700">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* CSV Export Tools */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Data Export Utility (CSV)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Download clean CSV spreadsheets of your local demo records for audit or demonstration
            </p>
          </div>
          <span className="text-xs bg-amber-50 text-amber-900 font-semibold px-3 py-1 rounded-full border border-amber-200 self-start sm:self-center">
            Includes Demo Watermark
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => handleExport("patients")}
            className="p-4 rounded-2xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/30 transition-all text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3 group-hover:bg-teal-700 group-hover:text-white transition-colors">
              <Download className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              Export Patients ({data.patients.length})
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Name, mobile, gender, DOB, address, and registration dates
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleExport("appointments")}
            className="p-4 rounded-2xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/30 transition-all text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3 group-hover:bg-teal-700 group-hover:text-white transition-colors">
              <Download className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              Export Appointments ({data.appointments.length})
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Time slots, token numbers, status logs, and consultation fees
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleExport("invoices")}
            className="p-4 rounded-2xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/30 transition-all text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3 group-hover:bg-teal-700 group-hover:text-white transition-colors">
              <Download className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              Export Billing Invoices ({data.invoices.length})
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Billed totals, discounts, taxes, payments, and balances
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

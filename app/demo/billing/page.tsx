"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Receipt,
  Plus,
  Search,
  Printer,
  CreditCard,
  Download,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { useDemoData } from "@/lib/demo-storage";
import { formatCurrency, formatDate, getStatusBadgeClass } from "@/lib/formatters";
import { CreateInvoiceModal } from "@/components/billing/CreateInvoiceModal";
import { RecordPaymentModal } from "@/components/billing/RecordPaymentModal";
import { PrintInvoiceModal } from "@/components/billing/PrintInvoiceModal";
import { Invoice } from "@/lib/demo-types";

export default function BillingPage() {
  const { data } = useDemoData();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Modals
  const [paymentInvoice, setPaymentInvoice] = useState<Invoice | null>(null);
  const [printInvoice, setPrintInvoice] = useState<Invoice | null>(null);

  // Financial KPIs
  const totalBilled = data.invoices
    .filter((i) => i.status !== "Cancelled")
    .reduce((acc, i) => acc + i.totalAmount, 0);

  const totalCollected = data.invoices
    .filter((i) => i.status !== "Cancelled")
    .reduce((acc, i) => acc + i.paidAmount, 0);

  const totalOutstanding = data.invoices
    .filter((i) => i.status !== "Cancelled")
    .reduce((acc, i) => acc + i.balanceAmount, 0);

  // Filtering
  const filteredInvoices = data.invoices.filter((inv) => {
    if (statusFilter !== "ALL" && inv.status !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match =
        inv.patientName.toLowerCase().includes(q) ||
        inv.id.toLowerCase().includes(q) ||
        inv.patientMobile.includes(q);
      if (!match) return false;
    }
    return true;
  });

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      "Invoice ID",
      "Patient Name",
      "Mobile",
      "Date",
      "Due Date",
      "Status",
      "Subtotal",
      "Discount",
      "Tax",
      "Total Amount",
      "Paid Amount",
      "Balance Due",
    ];
    const rows = filteredInvoices.map((inv) => [
      `"${inv.id}"`,
      `"${inv.patientName}"`,
      `"${inv.patientMobile}"`,
      `"${inv.invoiceDate}"`,
      `"${inv.dueDate || ""}"`,
      `"${inv.status}"`,
      `"${inv.subtotal}"`,
      `"${inv.discountAmount}"`,
      `"${inv.taxAmount}"`,
      `"${inv.totalAmount}"`,
      `"${inv.paidAmount}"`,
      `"${inv.balanceAmount}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      "# NOTICE: DEMO DATA ONLY - FOR EVALUATION PURPOSES ONLY\n" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `demo_billing_${new Date().toISOString().split("T")[0]}.csv`);
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
            <Receipt className="w-5 h-5 text-teal-700" />
            <h2 className="text-xl font-black text-slate-900">
              Billing, Invoices &amp; Payments
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Outpatient fee receipts, multi-item invoicing, partial payments, and collections
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
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Invoice</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Total Billed Revenue
          </span>
          <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">
            {formatCurrency(totalBilled)}
          </span>
          <span className="text-xs text-slate-400 mt-0.5 block">
            Across {data.invoices.length} total invoices
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 bg-emerald-50/20 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
            Total Collected Payments
          </span>
          <span className="text-2xl font-black text-emerald-700 font-mono mt-1 block">
            {formatCurrency(totalCollected)}
          </span>
          <span className="text-xs text-emerald-600 font-medium mt-0.5 block">
            Cash, UPI &amp; Cards verified
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-rose-200/80 bg-rose-50/20 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 block">
            Total Outstanding Balance
          </span>
          <span className="text-2xl font-black text-rose-600 font-mono mt-1 block">
            {formatCurrency(totalOutstanding)}
          </span>
          <span className="text-xs text-rose-600 font-medium mt-0.5 block">
            Unpaid or partially settled
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search invoice #, patient, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white"
          >
            <option value="ALL">All Invoices</option>
            <option value="Paid">Paid</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredInvoices.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            No invoices found matching current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Invoice # &amp; Date</th>
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">Items Summary</th>
                  <th className="py-3 px-4 text-right">Total (₹)</th>
                  <th className="py-3 px-4 text-right">Balance Due (₹)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((inv) => {
                  const badge = getStatusBadgeClass(inv.status);
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Invoice ID & Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <Link
                          href={`/demo/billing/${inv.id}`}
                          className="font-bold text-slate-900 font-mono hover:text-teal-700 hover:underline block"
                        >
                          #{inv.id}
                        </Link>
                        <span className="text-[11px] text-slate-500">
                          {formatDate(inv.invoiceDate)}
                        </span>
                      </td>

                      {/* Patient */}
                      <td className="py-3.5 px-4">
                        <Link
                          href={`/demo/patients/${inv.patientId}`}
                          className="font-bold text-slate-900 hover:text-teal-700 hover:underline block"
                        >
                          {inv.patientName}
                        </Link>
                        <span className="text-[11px] text-slate-500">
                          {inv.patientMobile}
                        </span>
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-4 text-slate-700">
                        <span className="truncate max-w-xs block font-medium">
                          {inv.items.map((i) => i.description).join(", ")}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {inv.items.length} service line(s)
                        </span>
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900 font-mono">
                        {formatCurrency(inv.totalAmount)}
                      </td>

                      {/* Balance */}
                      <td className="py-3.5 px-4 text-right font-mono">
                        {inv.balanceAmount > 0 ? (
                          <span className="font-bold text-rose-600">
                            {formatCurrency(inv.balanceAmount)}
                          </span>
                        ) : (
                          <span className="font-semibold text-emerald-600 text-[11px]">
                            ₹0 (Settled)
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          <span>{inv.status}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {inv.balanceAmount > 0 && (
                            <button
                              type="button"
                              onClick={() => setPaymentInvoice(inv)}
                              className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 font-bold text-xs border border-teal-200 transition-colors cursor-pointer"
                              title="Record payment"
                            >
                              Collect Pay
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setPrintInvoice(inv)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                            title="Print receipt"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          <Link
                            href={`/demo/billing/${inv.id}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-teal-700 transition-colors"
                            title="View details"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Link>
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
          <span>Showing {filteredInvoices.length} invoices</span>
          <span className="font-semibold text-teal-800">Deterministic invoice numbering system</span>
        </div>
      </div>

      {/* Modals */}
      <CreateInvoiceModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onInvoiceCreated={(newId) => {
          const created = data.invoices.find((i) => i.id === newId);
          if (created) setPrintInvoice(created);
        }}
      />

      <RecordPaymentModal
        isOpen={!!paymentInvoice}
        onClose={() => setPaymentInvoice(null)}
        invoice={paymentInvoice}
      />

      <PrintInvoiceModal
        isOpen={!!printInvoice}
        onClose={() => setPrintInvoice(null)}
        invoice={printInvoice}
      />
    </div>
  );
}

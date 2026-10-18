"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Receipt,
  Printer,
  CreditCard,
  Calendar,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  Plus,
} from "lucide-react";
import { useDemoData } from "@/lib/demo-storage";
import { formatCurrency, formatDate, formatDateTime, getStatusBadgeClass } from "@/lib/formatters";
import { RecordPaymentModal } from "@/components/billing/RecordPaymentModal";
import { PrintInvoiceModal } from "@/components/billing/PrintInvoiceModal";

export default function InvoiceDetailPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-xs text-slate-400">Loading invoice details...</div>}>
      <InvoiceDetailContent />
    </React.Suspense>
  );
}

function InvoiceDetailContent() {
  const params = useParams();
  const { data } = useDemoData();

  const invoiceId = params?.id as string;
  const invoice = data.invoices.find((i) => i.id === invoiceId);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [printModalOpen, setPrintModalOpen] = useState(false);

  if (!invoice) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto my-12">
        <h3 className="text-lg font-bold text-slate-900">Invoice Record Not Found</h3>
        <p className="text-xs text-slate-500 mt-2">
          Invoice &ldquo;{invoiceId}&rdquo; was not found in browser demo storage.
        </p>
        <Link
          href="/demo/billing"
          className="mt-6 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Invoices</span>
        </Link>
      </div>
    );
  }

  const badge = getStatusBadgeClass(invoice.status);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Back button & Action strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/demo/billing"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Invoices</span>
        </Link>

        <div className="flex items-center gap-3">
          {invoice.balanceAmount > 0 && (
            <button
              type="button"
              onClick={() => setPaymentModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Record Payment</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setPrintModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>

      {/* Invoice Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-slate-100 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black font-mono text-slate-900">
                #{invoice.id}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold border ${badge.bg}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                <span>{invoice.status}</span>
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-1">
              Issued on {formatDate(invoice.invoiceDate)} • Due: {invoice.dueDate ? formatDate(invoice.dueDate) : "On Demand"}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-right min-w-[200px]">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Invoice Amount
            </span>
            <span className="text-2xl font-black text-teal-800 font-mono block mt-0.5">
              {formatCurrency(invoice.totalAmount)}
            </span>
            {invoice.balanceAmount > 0 ? (
              <span className="text-xs font-bold text-rose-600 block mt-1">
                Outstanding: {formatCurrency(invoice.balanceAmount)}
              </span>
            ) : (
              <span className="text-xs font-semibold text-emerald-600 block mt-1">
                Paid in Full
              </span>
            )}
          </div>
        </div>

        {/* Patient Details strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 mb-6 text-xs">
          <div>
            <span className="text-slate-400 font-semibold block text-[11px] uppercase">
              Billed To
            </span>
            <Link
              href={`/demo/patients/${invoice.patientId}`}
              className="font-bold text-sm text-slate-900 hover:text-teal-700 hover:underline block mt-0.5"
            >
              {invoice.patientName}
            </Link>
            <span className="text-slate-500 font-mono text-[11px]">
              ID: {invoice.patientId}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-semibold block text-[11px] uppercase">
              Contact Phone
            </span>
            <span className="font-semibold text-slate-800 block mt-0.5">
              {invoice.patientMobile}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-semibold block text-[11px] uppercase">
              Attending Clinic
            </span>
            <span className="font-semibold text-slate-800 block mt-0.5">
              {data.settings.clinicName}
            </span>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden mb-6">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Service / Procedure Description</th>
                <th className="py-3 px-4 text-center">Qty</th>
                <th className="py-3 px-4 text-right">Unit Rate (₹)</th>
                <th className="py-3 px-4 text-right">Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoice.items.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {item.description}
                  </td>
                  <td className="py-3 px-4 text-center text-slate-700">
                    {item.quantity}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-700 font-mono">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900 font-mono">
                    {formatCurrency(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculation summary */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
          {/* Payment History */}
          <div className="flex-1 w-full">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Payment Transactions ({invoice.payments.length})
            </h4>

            {invoice.payments.length === 0 ? (
              <p className="text-xs text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">
                No payment recorded yet. Collect payment to update status.
              </p>
            ) : (
              <div className="space-y-2">
                {invoice.payments.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">
                          {p.paymentMethod}
                        </span>
                        <span className="font-mono text-emerald-700 font-bold">
                          {formatCurrency(p.amount)}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        {formatDateTime(p.date)}
                        {p.transactionRef ? ` • Ref: ${p.transactionRef}` : ""}
                      </span>
                    </div>

                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Totals column */}
          <div className="w-full sm:w-72 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-mono font-semibold">{formatCurrency(invoice.subtotal)}</span>
            </div>
            {invoice.discountAmount > 0 && (
              <div className="flex justify-between text-rose-600">
                <span>Discount ({invoice.discountPercentage}%):</span>
                <span className="font-mono">-{formatCurrency(invoice.discountAmount)}</span>
              </div>
            )}
            {invoice.taxAmount > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Tax ({invoice.taxPercentage}%):</span>
                <span className="font-mono">+{formatCurrency(invoice.taxAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
              <span>Grand Total:</span>
              <span className="font-mono text-teal-800">{formatCurrency(invoice.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-emerald-700 font-semibold pt-1">
              <span>Amount Paid:</span>
              <span className="font-mono">{formatCurrency(invoice.paidAmount)}</span>
            </div>
            <div className="flex justify-between font-bold text-rose-700 pt-1 border-t border-dashed border-slate-200">
              <span>Balance Pending:</span>
              <span className="font-mono">{formatCurrency(invoice.balanceAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Record Payment Modal */}
      <RecordPaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        invoice={invoice}
      />

      {/* Print Modal */}
      <PrintInvoiceModal
        isOpen={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        invoice={invoice}
      />
    </div>
  );
}

"use client";

import React from "react";
import { Printer, Stethoscope, MapPin, CheckCircle2 } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Invoice } from "@/lib/demo-types";
import { useDemoData } from "@/lib/demo-storage";
import { formatCurrency, formatDate, formatDateTime, getStatusBadgeClass } from "@/lib/formatters";

interface PrintInvoiceModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PrintInvoiceModal({
  invoice,
  isOpen,
  onClose,
}: PrintInvoiceModalProps) {
  const { data } = useDemoData();

  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const badge = getStatusBadgeClass(invoice.status);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Printable Medical Invoice & Receipt"
      description="Official outpatient billing receipt formatted for standard browser printing"
      maxWidth="3xl"
    >
      <div className="space-y-4">
        {/* Print Action Bar */}
        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200 no-print">
          <p className="text-xs text-slate-600">
            Click <strong>Print Receipt</strong> to print the clinic billing invoice or save as PDF.
          </p>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt (Ctrl+P)</span>
          </button>
        </div>

        {/* Printable Canvas */}
        <div className="print-container bg-white border border-slate-300 rounded-2xl p-8 sm:p-10 shadow-sm text-slate-900 font-sans">
          {/* Clinic Header */}
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

              <div className="sm:text-right">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                  TAX INVOICE / RECEIPT
                </span>
                <span className="text-lg font-black font-mono text-teal-800 block mt-0.5">
                  #{invoice.id}
                </span>
                <span
                  className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full border mt-1.5 ${badge.bg}`}
                >
                  Status: {invoice.status}
                </span>
              </div>
            </div>
          </div>

          {/* Meta Details */}
          <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Billed To (Patient)
              </span>
              <span className="font-bold text-slate-900 text-sm">
                {invoice.patientName}
              </span>
              <span className="text-slate-500 text-[11px] block mt-0.5">
                ID: {invoice.patientId}
              </span>
              <span className="text-slate-500 text-[11px] block">
                Ph: {invoice.patientMobile}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Invoice Date
              </span>
              <span className="font-semibold text-slate-900">
                {formatDate(invoice.invoiceDate)}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Due Date
              </span>
              <span className="font-semibold text-slate-900">
                {invoice.dueDate ? formatDate(invoice.dueDate) : "On Visit"}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Attending Doctor
              </span>
              <span className="font-semibold text-slate-900">
                {data.settings.doctorName}
              </span>
              <span className="text-slate-500 text-[10px] block">
                {data.settings.doctorSpecialty}
              </span>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Service / Item Description</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Rate (₹)</th>
                  <th className="py-2.5 px-3 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.items.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {item.description}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-700">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-700 font-mono">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900 font-mono">
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculations Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-6">
            {/* Payment history notes */}
            <div className="flex-1 w-full sm:max-w-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Recorded Payments ({invoice.payments.length})
              </h4>
              {invoice.payments.length === 0 ? (
                <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                  No payment recorded yet. Balance pending.
                </p>
              ) : (
                <div className="space-y-1.5">
                  {invoice.payments.map((p) => (
                    <div
                      key={p.id}
                      className="text-xs bg-slate-50 p-2 rounded-lg border border-slate-200 flex justify-between items-center"
                    >
                      <div>
                        <span className="font-semibold text-slate-800">
                          {p.paymentMethod}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {formatDateTime(p.date)}
                        </span>
                      </div>
                      <span className="font-bold text-emerald-700 font-mono">
                        {formatCurrency(p.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="w-full sm:w-64 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold font-mono">{formatCurrency(invoice.subtotal)}</span>
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
              <div className="flex justify-between text-sm font-black text-slate-900 pt-1.5 border-t border-slate-200">
                <span>Total Amount:</span>
                <span className="text-teal-800 font-mono">{formatCurrency(invoice.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-xs text-emerald-700 font-semibold pt-1">
                <span>Total Paid:</span>
                <span className="font-mono">{formatCurrency(invoice.paidAmount)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-rose-700 pt-1 border-t border-dashed border-slate-200">
                <span>Balance Due:</span>
                <span className="font-mono">{formatCurrency(invoice.balanceAmount)}</span>
              </div>
            </div>
          </div>

          {/* Signoff */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
            <p>Thank you for consulting with {data.settings.clinicName}. Wishing you speedy recovery!</p>
            <div className="mt-4 sm:mt-0 text-center">
              <div className="w-40 border-t border-slate-300 pt-1 font-semibold text-slate-800">
                Authorized Signatory
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

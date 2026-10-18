"use client";

import React, { useState } from "react";
import { DollarSign, CreditCard } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Invoice, PaymentMethod } from "@/lib/demo-types";
import { recordInvoicePayment } from "@/lib/demo-storage";
import { formatCurrency } from "@/lib/formatters";

interface RecordPaymentModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess?: () => void;
}

export function RecordPaymentModal({
  invoice,
  isOpen,
  onClose,
  onPaymentSuccess,
}: RecordPaymentModalProps) {
  if (!invoice) return null;

  const [amount, setAmount] = useState<number>(invoice.balanceAmount);
  const [method, setMethod] = useState<PaymentMethod>("UPI");
  const [ref, setRef] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      alert("Payment amount must be greater than zero.");
      return;
    }

    recordInvoicePayment(invoice.id, {
      amount: Number(amount),
      paymentMethod: method,
      transactionRef: ref || undefined,
      notes: notes || undefined,
    });

    onClose();
    if (onPaymentSuccess) onPaymentSuccess();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Record Payment for #${invoice.id}`}
      description={`Patient: ${invoice.patientName} • Remaining Due: ${formatCurrency(invoice.balanceAmount)}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
          <div>
            <span className="text-slate-500 block">Total Invoice Amount:</span>
            <span className="font-bold text-slate-900">{formatCurrency(invoice.totalAmount)}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Already Paid:</span>
            <span className="font-semibold text-emerald-600">{formatCurrency(invoice.paidAmount)}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-500 block">Balance Pending:</span>
            <span className="font-bold text-rose-600">{formatCurrency(invoice.balanceAmount)}</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Payment Amount to Collect (₹) *
          </label>
          <div className="relative">
            <span className="text-sm font-bold text-slate-400 absolute left-3 top-2">₹</span>
            <input
              type="number"
              min="1"
              max={invoice.balanceAmount}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Payment Method *
          </label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as PaymentMethod)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
          >
            <option value="UPI">UPI / QR Code</option>
            <option value="Cash">Cash Currency</option>
            <option value="Card">Credit / Debit Card</option>
            <option value="Other">Bank Transfer / Cheque</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Transaction ID / Ref (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. UPI/394801928374 or Auth Code"
            value={ref}
            onChange={(e) => setRef(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Notes / Receipt Remarks (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Cleared remaining balance at pharmacy"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
          />
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            Save Payment Record
          </button>
        </div>
      </form>
    </Modal>
  );
}

"use client";

import React, { useState } from "react";
import { Plus, Trash2, Receipt, DollarSign, CreditCard } from "lucide-react";
import { Modal } from "../ui/Modal";
import { InvoiceItem, PaymentMethod } from "@/lib/demo-types";
import { addInvoice, useDemoData } from "@/lib/demo-storage";
import { formatCurrency } from "@/lib/formatters";

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPatientId?: string;
  preselectedAppointmentId?: string;
  onInvoiceCreated?: (invoiceId: string) => void;
}

export function CreateInvoiceModal({
  isOpen,
  onClose,
  preselectedPatientId,
  preselectedAppointmentId,
  onInvoiceCreated,
}: CreateInvoiceModalProps) {
  const { data } = useDemoData();

  const todayStr = "2026-10-18";

  const [patientId, setPatientId] = useState(
    preselectedPatientId || data.patients[0]?.id || ""
  );
  const [appointmentId, setAppointmentId] = useState(
    preselectedAppointmentId || ""
  );
  const [invoiceDate, setInvoiceDate] = useState(todayStr);
  const [dueDate, setDueDate] = useState(todayStr);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [taxPercentage, setTaxPercentage] = useState(0);
  const [notes, setNotes] = useState("");

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: "item-1",
      description: "Physician Consultation Fee",
      quantity: 1,
      unitPrice: data.settings.defaultConsultationFee || 500,
      total: data.settings.defaultConsultationFee || 500,
    },
  ]);

  // Initial payment fields
  const [recordInitialPayment, setRecordInitialPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");
  const [paymentNotes, setPaymentNotes] = useState("Collected at billing counter");

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      description: "",
      quantity: 1,
      unitPrice: 300,
      total: 300,
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length === 1) return;
    setItems(items.filter((i) => i.id !== id));
  };

  const handleUpdateItem = (
    id: string,
    field: "description" | "quantity" | "unitPrice",
    val: string | number
  ) => {
    setItems(
      items.map((i) => {
        if (i.id !== id) return i;
        const updated = { ...i, [field]: val };
        const q = field === "quantity" ? Number(val) || 1 : updated.quantity;
        const p = field === "unitPrice" ? Number(val) || 0 : updated.unitPrice;
        updated.total = q * p;
        return updated;
      })
    );
  };

  // Calculations
  const subtotal = items.reduce((acc, i) => acc + i.total, 0);
  const discountAmount = Math.round((subtotal * discountPercentage) / 100);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round((taxableAmount * taxPercentage) / 100);
  const totalAmount = taxableAmount + taxAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = data.patients.find((p) => p.id === patientId);
    if (!patient) return;

    const validItems = items.filter((i) => i.description.trim().length > 0);
    if (validItems.length === 0) {
      alert("Please add at least one line item.");
      return;
    }

    const newInv = addInvoice({
      patientId: patient.id,
      patientName: patient.fullName,
      patientMobile: patient.mobile,
      appointmentId: appointmentId || undefined,
      invoiceDate,
      dueDate,
      items: validItems,
      subtotal,
      discountPercentage,
      discountAmount,
      taxPercentage,
      taxAmount,
      totalAmount,
      notes: notes || undefined,
      initialPayment: recordInitialPayment
        ? {
            amount: totalAmount,
            method: paymentMethod,
            notes: paymentNotes,
          }
        : undefined,
    });

    onClose();
    if (onInvoiceCreated) onInvoiceCreated(newInv.id);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generate Patient Invoice"
      description="Create an itemized billing invoice for consultations, procedures, and tests"
      maxWidth="3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Patient Selection & Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Patient <span className="text-rose-500">*</span>
            </label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
              required
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
              Invoice Date
            </label>
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
            />
          </div>
        </div>

        {/* Line Items */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
              Billed Services &amp; Line Items
            </span>
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 hover:bg-teal-100 text-xs font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Item</span>
            </button>
          </div>

          <div className="space-y-2">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-12 gap-2 p-2.5 rounded-xl border border-slate-200 bg-white items-center"
              >
                <div className="col-span-6">
                  <input
                    type="text"
                    placeholder="e.g. ECG, CBC Test, Dressing"
                    value={item.description}
                    onChange={(e) =>
                      handleUpdateItem(item.id, "description", e.target.value)
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 font-medium"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) =>
                      handleUpdateItem(item.id, "quantity", e.target.value)
                    }
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 text-center"
                  />
                </div>

                <div className="col-span-2">
                  <div className="relative">
                    <span className="text-[11px] font-bold text-slate-400 absolute left-2 top-1.5">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="0"
                      placeholder="Rate"
                      value={item.unitPrice}
                      onChange={(e) =>
                        handleUpdateItem(item.id, "unitPrice", e.target.value)
                      }
                      className="w-full pl-5 pr-2 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 text-right"
                    />
                  </div>
                </div>

                <div className="col-span-1 text-right text-xs font-bold text-slate-900">
                  {formatCurrency(item.total)}
                </div>

                <div className="col-span-1 text-right">
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals & Discounts Section */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Discount (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(Number(e.target.value) || 0)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Tax / GST (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={taxPercentage}
                onChange={(e) => setTaxPercentage(Number(e.target.value) || 0)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white"
              />
            </div>
          </div>

          {/* Computed Summary */}
          <div className="pt-2 border-t border-slate-200 space-y-1 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold">{formatCurrency(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-rose-600">
                <span>Discount ({discountPercentage}%):</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            {taxAmount > 0 && (
              <div className="flex justify-between">
                <span>Tax ({taxPercentage}%):</span>
                <span>+{formatCurrency(taxAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold text-slate-900 pt-1 border-t border-slate-200">
              <span>Total Invoice Amount:</span>
              <span className="text-teal-800">{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Initial Payment Option */}
        <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-3.5 space-y-3">
          <label className="flex items-center gap-2 text-xs font-bold text-teal-900 cursor-pointer">
            <input
              type="checkbox"
              checked={recordInitialPayment}
              onChange={(e) => setRecordInitialPayment(e.target.checked)}
              className="rounded text-teal-600"
            />
            <span>Record full payment immediately (Settled at desk)</span>
          </label>

          {recordInitialPayment && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-teal-900 mb-1">
                  Payment Mode
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-teal-300 text-xs text-slate-900 bg-white"
                >
                  <option value="UPI">UPI / QR Scan</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Debit / Credit Card</option>
                  <option value="Other">Bank Transfer / Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-teal-900 mb-1">
                  Payment Remarks
                </label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-teal-300 text-xs text-slate-900 bg-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Bar */}
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
            className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            Generate Invoice
          </button>
        </div>
      </form>
    </Modal>
  );
}

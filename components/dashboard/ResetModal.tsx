"use client";

import React from "react";
import { RotateCcw, AlertTriangle } from "lucide-react";
import { Modal } from "../ui/Modal";
import { resetDemoState } from "@/lib/demo-storage";

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ResetModal({ isOpen, onClose, onSuccess }: ResetModalProps) {
  const handleReset = () => {
    resetDemoState();
    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reset Demo Data to Initial Seed"
      description="Restore the default sample dataset for demonstration"
      maxWidth="sm"
    >
      <div className="space-y-4">
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Warning:</strong> This will discard any new patients, appointments, consultations, prescriptions, or invoices you created during this demo session and reload the original 12+ seed patients and appointments.
          </p>
        </div>

        <p className="text-sm text-slate-600">
          Are you sure you want to restore the clean baseline state?
        </p>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}

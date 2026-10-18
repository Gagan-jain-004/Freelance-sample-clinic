"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Appointment,
  AppointmentStatus,
  ClinicSettings,
  Consultation,
  DemoState,
  Invoice,
  Patient,
  PaymentRecord,
  Prescription,
} from "./demo-types";
import { getInitialDemoSeed } from "./demo-seed";
import {
  generateAppointmentId,
  generateConsultationId,
  generateInvoiceId,
  generatePatientId,
  generatePaymentId,
  generatePrescriptionId,
  generateTokenNumber,
} from "./demo-ids";

const STORAGE_KEY = "zust-clinic-demo-v1";
const STORAGE_EVENT = "zust_clinic_storage_change";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

/**
 * Retrieves the current state from localStorage or initializes it with seed data.
 */
export function getDemoState(): DemoState {
  if (!isBrowser()) {
    return getInitialDemoSeed();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seed = getInitialDemoSeed();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }

    const parsed = JSON.parse(raw) as Partial<DemoState>;
    // Ensure all required fields exist
    if (
      !parsed.patients ||
      !parsed.appointments ||
      !parsed.consultations ||
      !parsed.prescriptions ||
      !parsed.invoices ||
      !parsed.settings
    ) {
      const fallback = getInitialDemoSeed();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
      return fallback;
    }

    return parsed as DemoState;
  } catch (err) {
    console.warn("Failed to load clinic demo storage from localStorage:", err);
    return getInitialDemoSeed();
  }
}

/**
 * Persists the entire state to localStorage and notifies active components.
 */
export function saveDemoState(state: DemoState): void {
  if (!isBrowser()) return;
  try {
    state.lastUpdated = new Date().toISOString();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: state }));
  } catch (err) {
    console.error("Failed to save clinic demo storage:", err);
  }
}

/**
 * Resets the demo data back to the clean seed dataset.
 */
export function resetDemoState(): DemoState {
  const seed = getInitialDemoSeed();
  saveDemoState(seed);
  return seed;
}

/**
 * React hook to access demo state with live synchronization.
 */
export function useDemoData() {
  const [data, setData] = useState<DemoState>(() => getInitialDemoSeed());
  const [isLoaded, setIsLoaded] = useState(false);

  const reload = useCallback(() => {
    const current = getDemoState();
    setData(current);
  }, []);

  useEffect(() => {
    reload();
    setIsLoaded(true);

    const handleStorageChange = (e: Event) => {
      const customEvent = e as CustomEvent<DemoState>;
      if (customEvent.detail) {
        setData(customEvent.detail);
      } else {
        reload();
      }
    };

    window.addEventListener(STORAGE_EVENT, handleStorageChange);
    window.addEventListener("storage", reload);

    return () => {
      window.removeEventListener(STORAGE_EVENT, handleStorageChange);
      window.removeEventListener("storage", reload);
    };
  }, [reload]);

  return { data, isLoaded, reload };
}

// -------------------------------------------------------------
// Helper Actions
// -------------------------------------------------------------

export function addPatient(patientData: Omit<Patient, "id" | "registrationDate">): Patient {
  const state = getDemoState();
  const id = generatePatientId(state.patients.length);
  const newPatient: Patient = {
    ...patientData,
    id,
    registrationDate: new Date().toISOString(),
  };

  state.patients.unshift(newPatient);
  logActivityToState(state, "New Patient Registered", `Added ${newPatient.fullName} (${newPatient.id})`, "patient");
  saveDemoState(state);
  return newPatient;
}

export function updatePatient(patient: Patient): void {
  const state = getDemoState();
  const idx = state.patients.findIndex((p) => p.id === patient.id);
  if (idx !== -1) {
    state.patients[idx] = patient;
    // update cached patient name in appointments and invoices
    state.appointments.forEach((apt) => {
      if (apt.patientId === patient.id) {
        apt.patientName = patient.fullName;
        apt.patientMobile = patient.mobile;
      }
    });
    logActivityToState(state, "Patient Record Updated", `Updated details for ${patient.fullName}`, "patient");
    saveDemoState(state);
  }
}

export function deletePatient(patientId: string): void {
  const state = getDemoState();
  const patient = state.patients.find((p) => p.id === patientId);
  state.patients = state.patients.filter((p) => p.id !== patientId);
  if (patient) {
    logActivityToState(state, "Patient Record Removed", `Removed ${patient.fullName} (${patient.id})`, "patient");
  }
  saveDemoState(state);
}

export function addAppointment(
  data: Omit<Appointment, "id" | "status" | "createdAt" | "tokenNumber"> & { status?: AppointmentStatus }
): Appointment {
  const state = getDemoState();
  const id = generateAppointmentId(state.appointments.length);
  
  // Calculate token number if for today and checked in / confirmed
  const todayStr = new Date().toISOString().split("T")[0];
  const isForToday = data.date === todayStr;
  const todayCount = state.appointments.filter((a) => a.date === todayStr).length;
  const tokenNumber = isForToday ? generateTokenNumber(todayCount) : undefined;

  const newAppointment: Appointment = {
    ...data,
    id,
    tokenNumber,
    status: data.status || "Confirmed",
    createdAt: new Date().toISOString(),
  };

  state.appointments.unshift(newAppointment);
  logActivityToState(
    state,
    "Appointment Scheduled",
    `Booked appointment for ${newAppointment.patientName} at ${newAppointment.time} on ${newAppointment.date}`,
    "appointment"
  );
  saveDemoState(state);
  return newAppointment;
}

export function updateAppointmentStatus(
  appointmentId: string,
  newStatus: AppointmentStatus,
  extra?: Partial<Appointment>
): void {
  const state = getDemoState();
  const apt = state.appointments.find((a) => a.id === appointmentId);
  if (!apt) return;

  const prevStatus = apt.status;
  apt.status = newStatus;

  if (newStatus === "Checked-in" && !apt.checkInTime) {
    apt.checkInTime = new Date().toISOString();
    if (!apt.tokenNumber) {
      const todayStr = new Date().toISOString().split("T")[0];
      const todayCount = state.appointments.filter((a) => a.date === todayStr && a.tokenNumber).length;
      apt.tokenNumber = todayCount + 1;
    }
  }

  if (newStatus === "In Consultation" && !apt.consultationStartTime) {
    apt.consultationStartTime = new Date().toISOString();
  }

  if (newStatus === "Completed" && !apt.consultationEndTime) {
    apt.consultationEndTime = new Date().toISOString();
  }

  if (extra) {
    Object.assign(apt, extra);
  }

  logActivityToState(
    state,
    "Appointment Status Updated",
    `${apt.patientName}'s appointment marked as ${newStatus} (was ${prevStatus})`,
    "appointment"
  );
  saveDemoState(state);
}

export function rescheduleAppointment(appointmentId: string, newDate: string, newTime: string): void {
  const state = getDemoState();
  const apt = state.appointments.find((a) => a.id === appointmentId);
  if (!apt) return;

  apt.date = newDate;
  apt.time = newTime;
  logActivityToState(
    state,
    "Appointment Rescheduled",
    `Rescheduled ${apt.patientName} to ${newDate} at ${newTime}`,
    "appointment"
  );
  saveDemoState(state);
}

export function addConsultation(
  data: Omit<Consultation, "id" | "createdAt">
): Consultation {
  const state = getDemoState();
  const id = generateConsultationId(state.consultations.length);
  const newConsultation: Consultation = {
    ...data,
    id,
    createdAt: new Date().toISOString(),
  };

  state.consultations.unshift(newConsultation);

  // If tied to an appointment, mark appointment completed
  if (data.appointmentId) {
    const apt = state.appointments.find((a) => a.id === data.appointmentId);
    if (apt) {
      apt.status = "Completed";
      apt.consultationEndTime = new Date().toISOString();
    }
  }

  logActivityToState(
    state,
    "Consultation Completed",
    `Completed clinical encounter for ${data.patientName}: ${data.diagnosis}`,
    "consultation"
  );
  saveDemoState(state);
  return newConsultation;
}

export function addPrescription(
  data: Omit<Prescription, "id" | "createdAt">
): Prescription {
  const state = getDemoState();
  const id = generatePrescriptionId(state.prescriptions.length);
  const newPrescription: Prescription = {
    ...data,
    id,
    createdAt: new Date().toISOString(),
  };

  state.prescriptions.unshift(newPrescription);
  logActivityToState(
    state,
    "Prescription Issued",
    `Created Rx ${id} for ${data.patientName} (${data.medicines.length} medications)`,
    "prescription"
  );
  saveDemoState(state);
  return newPrescription;
}

export function addInvoice(
  data: Omit<Invoice, "id" | "createdAt" | "paidAmount" | "balanceAmount" | "status" | "payments"> & {
    initialPayment?: { amount: number; method: PaymentRecord["paymentMethod"]; notes?: string };
  }
): Invoice {
  const state = getDemoState();
  const id = generateInvoiceId(state.invoices.length);

  const totalAmount = data.totalAmount;
  let paidAmount = 0;
  const payments: PaymentRecord[] = [];

  if (data.initialPayment && data.initialPayment.amount > 0) {
    paidAmount = Math.min(data.initialPayment.amount, totalAmount);
    payments.push({
      id: generatePaymentId(),
      invoiceId: id,
      amount: paidAmount,
      paymentMethod: data.initialPayment.method,
      date: new Date().toISOString(),
      notes: data.initialPayment.notes || "Initial payment at creation",
    });
  }

  const balanceAmount = Math.max(0, totalAmount - paidAmount);
  const status =
    paidAmount >= totalAmount ? "Paid" : paidAmount > 0 ? "Partially Paid" : "Unpaid";

  const newInvoice: Invoice = {
    id,
    patientId: data.patientId,
    patientName: data.patientName,
    patientMobile: data.patientMobile,
    appointmentId: data.appointmentId,
    invoiceDate: data.invoiceDate,
    dueDate: data.dueDate,
    items: data.items,
    subtotal: data.subtotal,
    discountPercentage: data.discountPercentage,
    discountAmount: data.discountAmount,
    taxPercentage: data.taxPercentage,
    taxAmount: data.taxAmount,
    totalAmount,
    paidAmount,
    balanceAmount,
    status,
    payments,
    notes: data.notes,
    createdAt: new Date().toISOString(),
  };

  state.invoices.unshift(newInvoice);
  logActivityToState(
    state,
    "Invoice Created",
    `Generated Invoice #${id} for ${newInvoice.patientName} (Total: ₹${totalAmount})`,
    "billing"
  );
  saveDemoState(state);
  return newInvoice;
}

export function recordInvoicePayment(
  invoiceId: string,
  paymentData: { amount: number; paymentMethod: PaymentRecord["paymentMethod"]; transactionRef?: string; notes?: string }
): void {
  const state = getDemoState();
  const inv = state.invoices.find((i) => i.id === invoiceId);
  if (!inv) return;

  const paymentRecord: PaymentRecord = {
    id: generatePaymentId(),
    invoiceId,
    amount: paymentData.amount,
    paymentMethod: paymentData.paymentMethod,
    date: new Date().toISOString(),
    transactionRef: paymentData.transactionRef,
    notes: paymentData.notes,
  };

  inv.payments = inv.payments || [];
  inv.payments.push(paymentRecord);
  inv.paidAmount = inv.payments.reduce((acc, p) => acc + p.amount, 0);
  inv.balanceAmount = Math.max(0, inv.totalAmount - inv.paidAmount);

  if (inv.paidAmount >= inv.totalAmount) {
    inv.status = "Paid";
  } else if (inv.paidAmount > 0) {
    inv.status = "Partially Paid";
  }

  logActivityToState(
    state,
    "Payment Received",
    `Recorded payment of ₹${paymentData.amount} (${paymentData.paymentMethod}) for Invoice #${inv.id}`,
    "billing"
  );
  saveDemoState(state);
}

export function updateClinicSettings(newSettings: ClinicSettings): void {
  const state = getDemoState();
  state.settings = newSettings;
  logActivityToState(state, "Clinic Profile Updated", `Updated branding & schedule for ${newSettings.clinicName}`, "system");
  saveDemoState(state);
}

function logActivityToState(
  state: DemoState,
  title: string,
  description: string,
  category: "patient" | "appointment" | "consultation" | "prescription" | "billing" | "system"
): void {
  const logItem = {
    id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
    title,
    description,
    timestamp: new Date().toISOString(),
    category,
  };
  state.activityLogs = [logItem, ...(state.activityLogs || []).slice(0, 25)];
}

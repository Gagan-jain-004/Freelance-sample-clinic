export type Gender = "Male" | "Female" | "Other" | "Prefer not to say";

export type AppointmentStatus =
  | "Requested"
  | "Confirmed"
  | "Checked-in"
  | "In Consultation"
  | "Completed"
  | "Cancelled"
  | "No-show";

export type InvoiceStatus = "Unpaid" | "Partially Paid" | "Paid" | "Cancelled";

export type PaymentMethod = "Cash" | "UPI" | "Card" | "Other";

export interface Patient {
  id: string; // e.g. "PT-2026-001"
  fullName: string;
  mobile: string;
  email?: string;
  dob?: string;
  gender: Gender;
  address?: string;
  registrationDate: string; // ISO string
  reasonForVisit?: string;
  emergencyContact?: string;
  demoNotes?: string;
}

export interface Appointment {
  id: string; // e.g. "APT-101"
  patientId: string;
  patientName: string;
  patientMobile: string;
  date: string; // YYYY-MM-DD
  time: string; // "10:30 AM"
  tokenNumber?: number;
  reason: string;
  fee: number;
  status: AppointmentStatus;
  checkInTime?: string; // ISO string
  consultationStartTime?: string;
  consultationEndTime?: string;
  notes?: string;
  createdAt: string;
}

export interface Consultation {
  id: string; // e.g. "CON-101"
  patientId: string;
  patientName: string;
  appointmentId?: string;
  date: string; // ISO string
  chiefComplaint: string;
  symptoms: string;
  vitals: {
    bloodPressure?: string; // e.g. "120/80 mmHg"
    pulse?: string; // e.g. "72 bpm"
    temperature?: string; // e.g. "98.4 °F"
    weight?: string; // e.g. "68 kg"
    spo2?: string; // e.g. "99%"
  };
  examinationNotes: string;
  diagnosis: string;
  treatmentPlan: string;
  advice: string;
  followUpDate?: string; // YYYY-MM-DD
  isDraft: boolean;
  createdAt: string;
}

export interface MedicineRow {
  id: string;
  medicineName: string;
  strength: string; // e.g. "500 mg"
  dosage: string; // e.g. "1 Tablet"
  route: string; // "Oral", "Topical", "Inhalation", "Injectable"
  frequency: string; // e.g. "1-0-1 (Twice daily)"
  duration: string; // e.g. "5 Days"
  instructions: string; // e.g. "After meals"
}

export interface Prescription {
  id: string; // e.g. "RX-101"
  patientId: string;
  patientName: string;
  patientAgeGender?: string;
  consultationId?: string;
  date: string; // ISO string
  diagnosis: string;
  medicines: MedicineRow[];
  generalAdvice: string;
  nextFollowUpDate?: string;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PaymentRecord {
  id: string;
  invoiceId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  date: string; // ISO string
  transactionRef?: string;
  notes?: string;
}

export interface Invoice {
  id: string; // e.g. "INV-2026-101"
  patientId: string;
  patientName: string;
  patientMobile: string;
  appointmentId?: string;
  invoiceDate: string; // YYYY-MM-DD
  dueDate?: string; // YYYY-MM-DD
  items: InvoiceItem[];
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  taxPercentage: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: InvoiceStatus;
  payments: PaymentRecord[];
  notes?: string;
  createdAt: string;
}

export interface ClinicSettings {
  clinicName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  doctorName: string;
  doctorQualifications: string;
  doctorSpecialty: string;
  doctorRegNumber: string; // Marked as fictional demo
  workingDays: string[];
  workingHoursStart: string; // e.g. "09:00"
  workingHoursEnd: string; // e.g. "18:00"
  slotDurationMinutes: number; // 15, 30, 45, 60
  defaultConsultationFee: number;
  primaryColor: string; // Hex e.g. "#0F766E"
  accentColor: string; // Hex e.g. "#0284C7"
  logoIcon: string; // "Stethoscope", "Cross", "HeartPulse", "ShieldPlus"
}

export interface ActivityLogItem {
  id: string;
  title: string;
  description: string;
  timestamp: string; // ISO string
  category: "patient" | "appointment" | "consultation" | "prescription" | "billing" | "system";
}

export interface DemoState {
  patients: Patient[];
  appointments: Appointment[];
  consultations: Consultation[];
  prescriptions: Prescription[];
  invoices: Invoice[];
  settings: ClinicSettings;
  activityLogs: ActivityLogItem[];
  lastUpdated: string;
}

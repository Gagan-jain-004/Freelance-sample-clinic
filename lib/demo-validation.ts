import { z } from "zod";

export const patientRegistrationSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters"),
  mobile: z
    .string()
    .min(10, "Please enter a valid 10-digit mobile number")
    .max(15, "Mobile number too long")
    .regex(/^[0-9+() -]+$/, "Mobile number can only contain digits and phone symbols"),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  dob: z.string().optional().or(z.literal("")),
  gender: z.enum(["Male", "Female", "Other", "Prefer not to say"], {
    errorMap: () => ({ message: "Please select a gender" }),
  }),
  address: z.string().max(250, "Address is too long").optional().or(z.literal("")),
  reasonForVisit: z.string().max(300, "Reason too long").optional().or(z.literal("")),
  emergencyContact: z.string().max(100).optional().or(z.literal("")),
  demoNotes: z.string().max(500).optional().or(z.literal("")),
});

export type PatientRegistrationFormValues = z.infer<typeof patientRegistrationSchema>;

export const appointmentBookingSchema = z.object({
  patientId: z.string().min(1, "Please select a patient"),
  date: z.string().min(1, "Please select an appointment date"),
  time: z.string().min(1, "Please select an appointment time slot"),
  reason: z.string().min(2, "Please state the reason for consultation").max(200),
  fee: z.coerce.number().min(0, "Fee cannot be negative"),
  notes: z.string().max(500).optional().or(z.literal("")),
});

export type AppointmentBookingFormValues = z.infer<typeof appointmentBookingSchema>;

export const consultationSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  appointmentId: z.string().optional().or(z.literal("")),
  chiefComplaint: z.string().min(3, "Please enter chief complaint"),
  symptoms: z.string().optional().or(z.literal("")),
  bloodPressure: z.string().optional().or(z.literal("")),
  pulse: z.string().optional().or(z.literal("")),
  temperature: z.string().optional().or(z.literal("")),
  weight: z.string().optional().or(z.literal("")),
  spo2: z.string().optional().or(z.literal("")),
  examinationNotes: z.string().optional().or(z.literal("")),
  diagnosis: z.string().min(2, "Please enter clinical diagnosis"),
  treatmentPlan: z.string().min(2, "Please provide treatment plan or instructions"),
  advice: z.string().optional().or(z.literal("")),
  followUpDate: z.string().optional().or(z.literal("")),
  isDraft: z.boolean(),
});

export type ConsultationFormValues = z.infer<typeof consultationSchema>;

export const medicineRowSchema = z.object({
  id: z.string(),
  medicineName: z.string().min(1, "Medicine name is required"),
  strength: z.string().min(1, "Strength required (e.g. 500mg)"),
  dosage: z.string().min(1, "Dosage required"),
  route: z.string().default("Oral"),
  frequency: z.string().min(1, "Frequency required"),
  duration: z.string().min(1, "Duration required"),
  instructions: z.string().default("After meals"),
});

export const prescriptionSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  consultationId: z.string().optional().or(z.literal("")),
  diagnosis: z.string().min(2, "Diagnosis is required"),
  medicines: z.array(medicineRowSchema).min(1, "Add at least one medicine"),
  generalAdvice: z.string().optional().or(z.literal("")),
  nextFollowUpDate: z.string().optional().or(z.literal("")),
});

export type PrescriptionFormValues = z.infer<typeof prescriptionSchema>;

export const invoiceItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "Description required"),
  quantity: z.coerce.number().min(1, "Min quantity is 1"),
  unitPrice: z.coerce.number().min(0, "Price must be positive"),
  total: z.coerce.number(),
});

export const invoiceSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  appointmentId: z.string().optional().or(z.literal("")),
  invoiceDate: z.string().min(1, "Date is required"),
  dueDate: z.string().optional().or(z.literal("")),
  items: z.array(invoiceItemSchema).min(1, "Add at least one invoice item"),
  discountPercentage: z.coerce.number().min(0).max(100).default(0),
  taxPercentage: z.coerce.number().min(0).max(100).default(0),
  notes: z.string().optional().or(z.literal("")),
});

export type InvoiceFormValues = z.infer<typeof invoiceSchema>;

export const paymentSchema = z.object({
  amount: z.coerce.number().min(1, "Payment amount must be greater than 0"),
  paymentMethod: z.enum(["Cash", "UPI", "Card", "Other"]),
  transactionRef: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;

export const clinicSettingsSchema = z.object({
  clinicName: z.string().min(2, "Clinic name required"),
  tagline: z.string().optional().or(z.literal("")),
  phone: z.string().min(10, "Phone number required"),
  email: z.string().email("Valid email required"),
  address: z.string().min(5, "Address required"),
  doctorName: z.string().min(2, "Doctor name required"),
  doctorQualifications: z.string().min(2, "Qualifications required"),
  doctorSpecialty: z.string().min(2, "Specialty required"),
  doctorRegNumber: z.string().min(2, "Registration number required"),
  workingDays: z.array(z.string()).min(1, "Select at least one day"),
  workingHoursStart: z.string(),
  workingHoursEnd: z.string(),
  slotDurationMinutes: z.coerce.number(),
  defaultConsultationFee: z.coerce.number().min(0),
  primaryColor: z.string(),
  accentColor: z.string(),
  logoIcon: z.string(),
});

export type ClinicSettingsFormValues = z.infer<typeof clinicSettingsSchema>;

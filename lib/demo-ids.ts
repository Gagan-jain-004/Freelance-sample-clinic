export function generatePatientId(existingCount: number = 0): string {
  const currentYear = 2026;
  const index = existingCount + 1;
  const paddedIndex = index.toString().padStart(3, "0");
  return `PT-${currentYear}-${paddedIndex}`;
}

export function generateAppointmentId(existingCount: number = 0): string {
  const index = 100 + existingCount + 1;
  return `APT-${index}`;
}

export function generateConsultationId(existingCount: number = 0): string {
  const index = 100 + existingCount + 1;
  return `CON-${index}`;
}

export function generatePrescriptionId(existingCount: number = 0): string {
  const index = 100 + existingCount + 1;
  return `RX-${index}`;
}

export function generateInvoiceId(existingCount: number = 0): string {
  const currentYear = 2026;
  const index = 100 + existingCount + 1;
  return `INV-${currentYear}-${index}`;
}

export function generatePaymentId(): string {
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `PAY-${Date.now().toString().slice(-4)}-${rand}`;
}

export function generateTokenNumber(existingTodayCount: number = 0): number {
  return existingTodayCount + 1;
}

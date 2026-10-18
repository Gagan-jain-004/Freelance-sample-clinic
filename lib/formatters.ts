import { format, parseISO, isValid } from "date-fns";

export function formatCurrency(amount: number): string {
  if (isNaN(amount)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString?: string, formatPattern: string = "dd MMM yyyy"): string {
  if (!dateString) return "—";
  try {
    const parsed = parseISO(dateString);
    if (!isValid(parsed)) {
      const d = new Date(dateString);
      return isValid(d) ? format(d, formatPattern) : dateString;
    }
    return format(parsed, formatPattern);
  } catch {
    return dateString;
  }
}

export function formatTime(timeString?: string): string {
  if (!timeString) return "—";
  return timeString;
}

export function formatDateTime(isoString?: string): string {
  if (!isoString) return "—";
  return formatDate(isoString, "dd MMM yyyy, hh:mm a");
}

export function formatPhone(phone: string): string {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
}

export function getStatusBadgeClass(status: string): { bg: string; text: string; dot: string } {
  switch (status) {
    case "Checked-in":
      return { bg: "bg-blue-50 text-blue-700 border-blue-200", text: "text-blue-700", dot: "bg-blue-500" };
    case "In Consultation":
      return { bg: "bg-teal-50 text-teal-700 border-teal-200", text: "text-teal-700", dot: "bg-teal-500" };
    case "Completed":
    case "Paid":
      return { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500" };
    case "Confirmed":
      return { bg: "bg-sky-50 text-sky-700 border-sky-200", text: "text-sky-700", dot: "bg-sky-500" };
    case "Partially Paid":
    case "Requested":
      return { bg: "bg-amber-50 text-amber-700 border-amber-200", text: "text-amber-700", dot: "bg-amber-500" };
    case "Cancelled":
    case "No-show":
      return { bg: "bg-rose-50 text-rose-700 border-rose-200", text: "text-rose-700", dot: "bg-rose-500" };
    case "Unpaid":
      return { bg: "bg-red-50 text-red-700 border-red-200", text: "text-red-700", dot: "bg-red-500" };
    default:
      return { bg: "bg-slate-100 text-slate-700 border-slate-200", text: "text-slate-700", dot: "bg-slate-400" };
  }
}

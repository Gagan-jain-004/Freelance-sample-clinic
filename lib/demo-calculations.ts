import { Appointment, Consultation, DemoState, Invoice } from "./demo-types";
import { format, subDays, isToday, parseISO } from "date-fns";

export interface DashboardMetrics {
  totalPatients: number;
  todayAppointmentsCount: number;
  todayCompletedCount: number;
  todayCollectionAmount: number;
  pendingBalanceAmount: number;
  waitingQueueCount: number;
  totalRevenue: number;
}

const REFERENCE_TODAY = new Date("2026-10-18T10:00:00.000Z");

export function calculateDashboardMetrics(state: DemoState): DashboardMetrics {
  const todayStr = "2026-10-18";

  const todayAppointments = state.appointments.filter((apt) => apt.date === todayStr);

  const todayCompleted = todayAppointments.filter((apt) => apt.status === "Completed");

  // Today's collection from payments recorded today
  const todayCollection = state.invoices.reduce((acc, inv) => {
    const todayPayments = (inv.payments || []).filter((p) => {
      try {
        return isToday(parseISO(p.date));
      } catch {
        return false;
      }
    });
    return acc + todayPayments.reduce((pAcc, p) => pAcc + p.amount, 0);
  }, 0);

  // Total pending balance across all active invoices
  const pendingBalance = state.invoices
    .filter((inv) => inv.status !== "Cancelled" && inv.status !== "Paid")
    .reduce((acc, inv) => acc + (inv.balanceAmount || 0), 0);

  // Waiting queue count: checked-in today
  const waitingCount = state.appointments.filter(
    (apt) => apt.date === todayStr && apt.status === "Checked-in"
  ).length;

  const totalRevenue = state.invoices
    .filter((inv) => inv.status !== "Cancelled")
    .reduce((acc, inv) => acc + inv.paidAmount, 0);

  return {
    totalPatients: state.patients.length,
    todayAppointmentsCount: todayAppointments.length,
    todayCompletedCount: todayCompleted.length,
    todayCollectionAmount: todayCollection,
    pendingBalanceAmount: pendingBalance,
    waitingQueueCount: waitingCount,
    totalRevenue,
  };
}

export interface WeeklyChartPoint {
  day: string;
  appointments: number;
  completed: number;
}

export function calculateWeeklyTrends(appointments: Appointment[]): WeeklyChartPoint[] {
  const points: WeeklyChartPoint[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = subDays(REFERENCE_TODAY, i);
    const dateStr = format(d, "yyyy-MM-dd");
    const dayLabel = format(d, "EEE");

    const forDay = appointments.filter((a) => a.date === dateStr);
    points.push({
      day: dayLabel,
      appointments: forDay.length,
      completed: forDay.filter((a) => a.status === "Completed").length,
    });
  }

  return points;
}

export interface RevenueChartPoint {
  month: string;
  billed: number;
  collected: number;
}

export function calculateRevenueTrends(invoices: Invoice[]): RevenueChartPoint[] {
  // Return last 6 months summary based on invoice data with realistic fallbacks
  const months = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];
  const baselineCollection = [28500, 34200, 42000, 38900, 48200, 52400];
  const baselineBilled = [32000, 39000, 46000, 43500, 54000, 58000];

  const totalPaid = invoices.reduce((acc, inv) => acc + inv.paidAmount, 0);
  const totalBilled = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);

  return months.map((month, idx) => {
    // dynamically factor in current month demo changes
    const isCurrent = idx === months.length - 1;
    return {
      month,
      collected: isCurrent ? baselineCollection[idx] + totalPaid : baselineCollection[idx],
      billed: isCurrent ? baselineBilled[idx] + totalBilled : baselineBilled[idx],
    };
  });
}

export function calculateAppointmentStatusDistribution(appointments: Appointment[]): { name: string; value: number; color: string }[] {
  const statuses = [
    { name: "Completed", color: "#10B981" },
    { name: "In Consultation", color: "#0F766E" },
    { name: "Checked-in", color: "#0284C7" },
    { name: "Confirmed", color: "#38BDF8" },
    { name: "Requested", color: "#F59E0B" },
    { name: "Cancelled", color: "#EF4444" },
  ];

  return statuses
    .map((s) => ({
      name: s.name,
      value: appointments.filter((a) => a.status === s.name).length,
      color: s.color,
    }))
    .filter((s) => s.value > 0);
}

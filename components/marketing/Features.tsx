import React from "react";
import {
  Users,
  CalendarCheck,
  FileSpreadsheet,
  Receipt,
  BarChart3,
  Palette,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Users,
    title: "Patient Management",
    description:
      "Maintain centralized electronic medical records (EMR) including demographics, visit logs, medical history, allergies, and contact details with rapid search.",
    badge: "EMR Core",
    link: "/demo/patients",
  },
  {
    icon: CalendarCheck,
    title: "Appointment Scheduling",
    description:
      "Organize daily clinical consultations, manage double-booking prevention, track real-time patient queue statuses, and handle reschedules effortlessly.",
    badge: "Smart Calendar",
    link: "/demo/appointments",
  },
  {
    icon: FileSpreadsheet,
    title: "Digital Prescriptions",
    description:
      "Generate clear, standardized prescriptions with dosage frequencies, intake instructions, and direct browser-based printing on clinic letterhead.",
    badge: "Print Ready",
    link: "/demo/prescriptions",
  },
  {
    icon: Receipt,
    title: "Billing & Payments",
    description:
      "Create itemized invoices for consultations, procedures, and diagnostics. Support split payments across Cash, UPI, and Cards with printable receipts.",
    badge: "Multi-Mode Pay",
    link: "/demo/billing",
  },
  {
    icon: BarChart3,
    title: "Clinic Analytics",
    description:
      "Gain visual clarity over patient volume trends, completed visits, outstanding balances, and monthly collections to make informed clinical decisions.",
    badge: "Visual Reports",
    link: "/demo/reports",
  },
  {
    icon: Palette,
    title: "Clinic Branding",
    description:
      "Customize clinic names, doctor credentials, registration numbers, consultation fees, working hours, and signature headers to reflect your clinic identity.",
    badge: "White Label",
    link: "/demo/settings",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Comprehensive Suite
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
            Engineered For Clinical Workflow Efficiency
          </h2>
          <p className="text-slate-600 mt-4 text-base sm:text-lg">
            Every module in this demo reflects practical daily needs of outpatient clinics, independent doctors, and polyclinics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="group relative rounded-2xl border border-slate-200 bg-slate-50/50 p-7 hover:bg-white hover:border-teal-300 hover:shadow-xl hover:shadow-teal-900/5 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center group-hover:bg-teal-700 group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 bg-white border border-slate-200/80 px-2.5 py-1 rounded-full">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mt-2.5">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between">
                  <Link
                    href={feat.link}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 transition-colors"
                  >
                    <span>Test module in demo</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

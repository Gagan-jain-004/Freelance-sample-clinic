import React from "react";
import Link from "next/link";
import { Stethoscope, UserCheck, ArrowRight, ShieldAlert, Sparkles } from "lucide-react";

export function DemoCards() {
  return (
    <section id="demo-portals" className="py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Interactive Sandboxes
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
            Two Dual Entry Points To Test
          </h2>
          <p className="text-slate-600 mt-3 text-base">
            Test both the clinician operational interface and the patient intake workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: Doctor Dashboard */}
          <div className="rounded-3xl border-2 border-teal-600/30 bg-gradient-to-br from-teal-50/50 via-white to-teal-50/30 p-8 sm:p-10 flex flex-col justify-between shadow-xl shadow-teal-900/5 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-teal-700 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3" />
              <span>Full Access</span>
            </div>

            <div>
              <div className="w-14 h-14 rounded-2xl bg-teal-700 text-white flex items-center justify-center mb-6 shadow-md shadow-teal-700/20">
                <Stethoscope className="w-7 h-7" />
              </div>

              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Doctor Dashboard Demo
              </h3>

              <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
                Explore patient records, appointments, consultations, prescriptions, billing, and clinic analytics. Features pre-loaded sample patients and live interactive forms.
              </p>

              <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-teal-900">
                <span className="bg-teal-100/70 border border-teal-200 px-2.5 py-1 rounded-md">EMR Database</span>
                <span className="bg-teal-100/70 border border-teal-200 px-2.5 py-1 rounded-md">Live Queue</span>
                <span className="bg-teal-100/70 border border-teal-200 px-2.5 py-1 rounded-md">Printable Rx</span>
                <span className="bg-teal-100/70 border border-teal-200 px-2.5 py-1 rounded-md">Invoicing</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-teal-100/80">
              <Link
                href="/demo/dashboard"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-md shadow-teal-700/20 hover:shadow-teal-700/30 transition-all"
              >
                <span>Open Doctor Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="mt-3 text-[11px] text-center text-slate-600 flex items-center justify-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                Demonstration interface • Fictional clinical data only
              </p>
            </div>
          </div>

          {/* Card 2: Patient Registration */}
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-sky-50/40 via-white to-slate-50 p-8 sm:p-10 flex flex-col justify-between shadow-lg shadow-slate-900/5 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-sky-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Public View
            </div>

            <div>
              <div className="w-14 h-14 rounded-2xl bg-sky-600 text-white flex items-center justify-center mb-6 shadow-md shadow-sky-600/20">
                <UserCheck className="w-7 h-7" />
              </div>

              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Patient Registration Demo
              </h3>

              <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
                See how patients could register with your clinic through a simple registration form. When you register a test patient, they immediately show up in the doctor dashboard!
              </p>

              <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-sky-900">
                <span className="bg-sky-100/70 border border-sky-200 px-2.5 py-1 rounded-md">Simple Form</span>
                <span className="bg-sky-100/70 border border-sky-200 px-2.5 py-1 rounded-md">Auto ID Generation</span>
                <span className="bg-sky-100/70 border border-sky-200 px-2.5 py-1 rounded-md">Instant Doctor Sync</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200/80">
              <Link
                href="/register"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 shadow-xs hover:border-slate-400 transition-all"
              >
                <span>Open Registration Form</span>
                <ArrowRight className="w-4 h-4 text-sky-600" />
              </Link>
              <p className="mt-3 text-[11px] text-center text-slate-600 flex items-center justify-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                Demonstration intake • No patient account or portal created
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

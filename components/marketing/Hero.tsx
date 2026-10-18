import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  Sparkles,
  Users,
  CalendarCheck,
  Receipt,
  FileText,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { DemoNotice } from "../ui/DemoNotice";

export function Hero() {
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100/50">
      {/* Decorative clean background mesh */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-teal-50/60 to-transparent pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Demo Mode Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Interactive Sales Product Demonstration</span>
            <span className="text-slate-300">•</span>
            <span className="text-amber-800 font-bold">Demo Mode</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
            Simplify Your Clinic. <br />
            <span className="text-teal-700 bg-clip-text text-transparent bg-gradient-to-r from-teal-800 via-teal-700 to-sky-700">
              Focus on Your Patients.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
            Explore a modern clinic management experience designed to help doctors organize appointments, patient records, digital prescriptions, and billing — all in one place.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/demo/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-base shadow-lg shadow-teal-700/25 hover:shadow-teal-700/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Explore Doctor Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-base border border-slate-200 shadow-xs hover:border-slate-300 transition-all"
            >
              <ClipboardList className="w-4 h-4 text-teal-700" />
              <span>Patient Registration Demo</span>
            </Link>
          </div>

          {/* Micro trust indicators */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-500 font-medium">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              Pre-loaded with sample patients
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              Persists in your browser (localStorage)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              Customizable for private clinic deployments
            </span>
          </div>
        </div>

        {/* Realistic Product Mockup Preview */}
        <div className="mt-14 max-w-5xl mx-auto rounded-2xl border border-slate-200/90 bg-white p-3 sm:p-5 shadow-2xl shadow-slate-900/10">
          {/* Mockup browser bar */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
              <span className="ml-3 font-mono text-[11px] text-slate-500 hidden sm:inline-block">
                zustclinic.demo/dashboard
              </span>
            </div>
            <div className="flex items-center gap-2">
              <DemoNotice variant="subtle" />
            </div>
          </div>

          {/* Interactive Preview Canvas */}
          <div className="rounded-xl bg-slate-50 border border-slate-200/70 p-4 sm:p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Metric 1 */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
                <span>Today&#39;s Appointments</span>
                <CalendarCheck className="w-4 h-4 text-teal-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">14</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1">4 Completed • 3 In Queue</div>
            </div>

            {/* Metric 2 */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
                <span>Active Patients</span>
                <Users className="w-4 h-4 text-sky-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">16+</div>
              <div className="text-[11px] text-slate-500 mt-1">Simulated EHR records</div>
            </div>

            {/* Metric 3 */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
                <span>Today&#39;s Collection</span>
                <Receipt className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">₹2,400</div>
              <div className="text-[11px] text-slate-500 mt-1">Cash, UPI &amp; Cards</div>
            </div>

            {/* Metric 4 */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
                <span>Digital Rx Issued</span>
                <FileText className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">Printable</div>
              <div className="text-[11px] text-teal-600 font-semibold mt-1">Clinic letterhead formatted</div>
            </div>

            {/* Live CTA Banner inside preview */}
            <div className="md:col-span-4 rounded-xl bg-gradient-to-r from-teal-700 to-teal-800 text-white p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-bold text-base sm:text-lg">Experience the full workflow now</p>
                <p className="text-xs sm:text-sm text-teal-100 mt-0.5">
                  Try checking in a patient, conducting a consult, issuing a prescription, and printing an invoice.
                </p>
              </div>
              <Link
                href="/demo/dashboard"
                className="whitespace-nowrap px-4 py-2.5 rounded-lg bg-white text-teal-800 font-bold text-xs hover:bg-teal-50 transition-colors shadow-sm"
              >
                Launch Doctor Dashboard &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

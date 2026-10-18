"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Stethoscope,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  FileQuestion,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import {
  patientRegistrationSchema,
  PatientRegistrationFormValues,
} from "@/lib/demo-validation";
import { addPatient } from "@/lib/demo-storage";
import { siteConfig } from "@/config/site";
import { DemoNotice } from "@/components/ui/DemoNotice";

export default function PatientRegistrationPage() {
  const [submittedPatientId, setSubmittedPatientId] = useState<string | null>(null);
  const [submittedName, setSubmittedName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PatientRegistrationFormValues>({
    resolver: zodResolver(patientRegistrationSchema),
    defaultValues: {
      fullName: "",
      mobile: "",
      email: "",
      dob: "",
      gender: "Prefer not to say",
      address: "",
      reasonForVisit: "",
      emergencyContact: "",
      demoNotes: "Registered via Public Demo Intake Form",
    },
  });

  const onSubmit = (values: PatientRegistrationFormValues) => {
    setIsSubmitting(true);
    try {
      const created = addPatient({
        fullName: values.fullName,
        mobile: values.mobile,
        email: values.email || undefined,
        dob: values.dob || undefined,
        gender: values.gender,
        address: values.address || undefined,
        reasonForVisit: values.reasonForVisit || undefined,
        emergencyContact: values.emergencyContact || undefined,
        demoNotes: values.demoNotes || undefined,
      });

      setSubmittedPatientId(created.id);
      setSubmittedName(created.fullName);
    } catch (err) {
      console.error("Registration error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterAnother = () => {
    setSubmittedPatientId(null);
    setSubmittedName("");
    reset();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Demo Banner */}
      <DemoNotice variant="banner" />

      {/* Header */}
      <header className="border-b border-slate-200/80 bg-white py-4 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-teal-700 transition-colors text-sm font-semibold">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center">
              <Stethoscope className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-slate-900 tracking-tight text-base">
              Zust<span className="text-teal-700">Clinic</span>
            </span>
            <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-200">
              Demo Intake
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-10 flex-1">
        {submittedPatientId ? (
          /* Success Screen */
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xl shadow-slate-900/5 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Registration Successful
            </span>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
              Patient Record Created!
            </h1>

            <p className="mt-2 text-slate-600 text-sm max-w-md mx-auto">
              <strong>{submittedName}</strong> has been registered successfully in this browser’s demo clinic database.
            </p>

            {/* Generated ID Box */}
            <div className="my-6 inline-block bg-slate-50 border-2 border-dashed border-teal-300 rounded-2xl px-8 py-5">
              <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
                Assigned Demo Patient ID
              </span>
              <span className="text-3xl font-black text-teal-800 font-mono tracking-tight mt-1 block">
                {submittedPatientId}
              </span>
            </div>

            <div className="bg-teal-50/60 border border-teal-200/80 rounded-xl p-4 text-left text-xs text-teal-900 max-w-lg mx-auto mb-8 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Where does this record go?</p>
                <p className="text-teal-800 mt-0.5">
                  Because this is an interactive demo, this patient was just written to your browser’s <code className="bg-teal-100 px-1 py-0.5 rounded font-mono">localStorage</code>. You can immediately see and manage this patient in the <strong>Doctor Dashboard</strong>!
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/demo/patients"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-md transition-all"
              >
                <span>View Patient in Doctor Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={handleRegisterAnother}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors"
              >
                Register Another Patient
              </button>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-900/5 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-700 to-teal-800 px-6 sm:px-10 py-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-200 bg-teal-900/60 px-2.5 py-1 rounded-md">
                    Sample Patient Intake
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black mt-2">
                    Patient Self-Registration Form
                  </h1>
                </div>
              </div>
              <p className="mt-2 text-xs sm:text-sm text-teal-100 max-w-xl">
                Experience how your patients can quickly pre-register with your clinic. Fields marked with <span className="text-amber-300 font-bold">*</span> are required.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-10 space-y-6">
              {/* Demo Notice Inside Form */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Demo Only:</strong> Please do not submit real medical records. All data entered here is stored solely in your local browser storage and is used to test the doctor dashboard.
                </p>
              </div>

              {/* Grid 1: Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. Aditi Sharma"
                      {...register("fullName")}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 transition-all ${
                        errors.fullName ? "border-rose-300 bg-rose-50/30" : "border-slate-300 bg-white"
                      }`}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-xs text-rose-600 mt-1">{errors.fullName.message}</p>
                  )}
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      {...register("mobile")}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 transition-all ${
                        errors.mobile ? "border-rose-300 bg-rose-50/30" : "border-slate-300 bg-white"
                      }`}
                    />
                  </div>
                  {errors.mobile && (
                    <p className="text-xs text-rose-600 mt-1">{errors.mobile.message}</p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Date of Birth (Optional)
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="date"
                      {...register("dob")}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 transition-all"
                    />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Gender
                  </label>
                  <select
                    {...register("gender")}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 transition-all"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      placeholder="name@example.com"
                      {...register("email")}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 transition-all ${
                        errors.email ? "border-rose-300 bg-rose-50/30" : "border-slate-300 bg-white"
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-rose-600 mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Residential Address (Optional)
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. Flat 301, Sector 4, Indiranagar"
                      {...register("address")}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 transition-all"
                    />
                  </div>
                </div>

                {/* Reason for visit */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Reason for Visit / Primary Symptoms (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Mild headache and throat pain since 2 days"
                    {...register("reasonForVisit")}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 transition-all"
                  />
                </div>

                {/* Emergency contact */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Emergency Contact Name &amp; Phone (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rajesh Sharma (Spouse) - 9876543211"
                    {...register("emergencyContact")}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 transition-all"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-slate-600">
                  By clicking Submit, record is saved locally in this browser.
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Generating Patient ID..." : "Submit Registration"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Footer Minimal */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-600">
        <p>{siteConfig.name} Clinic Management Demo • No real patient accounts or credentials required.</p>
      </footer>
    </div>
  );
}

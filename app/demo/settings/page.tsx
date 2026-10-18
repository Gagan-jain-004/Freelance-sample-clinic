"use client";

import React, { useState } from "react";
import {
  Settings,
  Building,
  User,
  Clock,
  Palette,
  RotateCcw,
  CheckCircle2,
  Stethoscope,
  MapPin,
  Phone,
  Mail,
  ShieldAlert,
} from "lucide-react";
import { useDemoData, updateClinicSettings, resetDemoState } from "@/lib/demo-storage";
import { ResetModal } from "@/components/dashboard/ResetModal";
import { siteConfig } from "@/config/site";
import { ClinicSettings } from "@/lib/demo-types";

export default function SettingsPage() {
  const { data } = useDemoData();

  const [settings, setSettings] = useState<ClinicSettings>(data.settings);
  const [savedAlert, setSavedAlert] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const brandColors = [
    { name: "Medical Teal", hex: "#0F766E" },
    { name: "Sky Cyan", hex: "#0284C7" },
    { name: "Classic Navy", hex: "#1E3A8A" },
    { name: "Health Emerald", hex: "#047857" },
    { name: "Clinical Indigo", hex: "#4338CA" },
  ];

  const handleToggleDay = (day: string) => {
    const current = settings.workingDays || [];
    const exists = current.includes(day);
    const updated = exists ? current.filter((d) => d !== day) : [...current, day];
    setSettings({ ...settings, workingDays: updated });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateClinicSettings(settings);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-teal-700" />
            <h2 className="text-xl font-black text-slate-900">
              Clinic Profile, Schedule &amp; Branding Settings
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure clinic credentials, consultation fees, hours, and live white-label previews
          </p>
        </div>

        {savedAlert && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings Saved to Browser!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Clinic Profile */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <Building className="w-5 h-5 text-teal-700" />
            <h3 className="text-base font-bold text-slate-900">
              Clinic Identity &amp; Contact
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Clinic / Hospital Name *
              </label>
              <input
                type="text"
                value={settings.clinicName}
                onChange={(e) => setSettings({ ...settings, clinicName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Tagline / Sub-heading
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Official Phone Number *
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Official Email Address *
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Clinic Physical Address (Printed on prescriptions &amp; invoices) *
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Doctor Profile */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <User className="w-5 h-5 text-teal-700" />
            <h3 className="text-base font-bold text-slate-900">
              Consulting Physician Profile
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Doctor Name *
              </label>
              <input
                type="text"
                value={settings.doctorName}
                onChange={(e) => setSettings({ ...settings, doctorName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Degrees &amp; Qualifications *
              </label>
              <input
                type="text"
                value={settings.doctorQualifications}
                onChange={(e) => setSettings({ ...settings, doctorQualifications: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Medical Specialty / Department *
              </label>
              <input
                type="text"
                value={settings.doctorSpecialty}
                onChange={(e) => setSettings({ ...settings, doctorSpecialty: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Registration Number (Sample Demo) *
              </label>
              <input
                type="text"
                value={settings.doctorRegNumber}
                onChange={(e) => setSettings({ ...settings, doctorRegNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 3: Schedule & Operational Timings */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <Clock className="w-5 h-5 text-teal-700" />
            <h3 className="text-base font-bold text-slate-900">
              Schedule &amp; Operating Hours
            </h3>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Working Days
            </label>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map((day) => {
                const isSelected = settings.workingDays?.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleToggleDay(day)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-teal-700 text-white shadow-2xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Opening Time
              </label>
              <input
                type="time"
                value={settings.workingHoursStart}
                onChange={(e) => setSettings({ ...settings, workingHoursStart: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Closing Time
              </label>
              <input
                type="time"
                value={settings.workingHoursEnd}
                onChange={(e) => setSettings({ ...settings, workingHoursEnd: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Slot Duration (Minutes)
              </label>
              <select
                value={settings.slotDurationMinutes}
                onChange={(e) => setSettings({ ...settings, slotDurationMinutes: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
              >
                <option value={15}>15 Minutes</option>
                <option value={20}>20 Minutes</option>
                <option value={30}>30 Minutes</option>
                <option value={45}>45 Minutes</option>
                <option value={60}>60 Minutes</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Default Consult Fee (₹)
              </label>
              <input
                type="number"
                min="0"
                value={settings.defaultConsultationFee}
                onChange={(e) => setSettings({ ...settings, defaultConsultationFee: Number(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section 4: White-Label Branding & Prescription Header Preview */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <Palette className="w-5 h-5 text-teal-700" />
            <h3 className="text-base font-bold text-slate-900">
              White-Label Palette &amp; Letterhead Preview
            </h3>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Primary Theme Color
            </label>
            <div className="flex flex-wrap gap-3">
              {brandColors.map((color) => {
                const isSelected = settings.primaryColor === color.hex;
                return (
                  <button
                    key={color.hex}
                    type="button"
                    onClick={() => setSettings({ ...settings, primaryColor: color.hex })}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "border-slate-900 ring-2 ring-teal-500/30"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full inline-block shadow-2xs"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span>{color.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Letterhead Preview Box */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Live Prescription / Invoice Header Preview:
            </span>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-slate-200">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl text-white flex items-center justify-center font-bold text-lg shadow-sm"
                    style={{ backgroundColor: settings.primaryColor }}
                  >
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div>
                    <h4
                      className="text-lg font-black tracking-tight"
                      style={{ color: settings.primaryColor }}
                    >
                      {settings.clinicName || "Clinic Name"}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {settings.tagline || "Clinic Sub-heading"}
                    </p>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      {settings.address || "123 Health Street, Bengaluru"}
                    </p>
                  </div>
                </div>

                <div className="sm:text-right text-xs">
                  <p className="font-bold text-slate-900">{settings.doctorName}</p>
                  <p className="text-teal-700 font-semibold">{settings.doctorQualifications}</p>
                  <p className="text-slate-500 text-[11px]">Reg: {settings.doctorRegNumber}</p>
                  <p className="text-slate-500 text-[11px]">Ph: {settings.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Demo Preferences & Safety */}
        <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-slate-900">
              Demo Environment &amp; Data Reset
            </h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            All records exist purely within your browser&rsquo;s <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono">localStorage</code>. When presenting to a prospective clinic client, you can return to the initial pristine seed data at any time.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => setResetModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Demo Records to Initial Seed</span>
            </button>
          </div>
        </div>

        {/* Global Save Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-8 py-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            Save All Settings
          </button>
        </div>
      </form>

      <ResetModal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onSuccess={() => {
          setSettings(data.settings);
          setSavedAlert(true);
        }}
      />
    </div>
  );
}

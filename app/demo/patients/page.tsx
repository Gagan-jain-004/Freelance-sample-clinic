"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  UserPlus,
  Filter,
  Download,
  Calendar,
  Phone,
  FileText,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { useDemoData } from "@/lib/demo-storage";
import { formatDate } from "@/lib/formatters";
import { AddPatientModal } from "@/components/patients/AddPatientModal";

export default function PatientsDirectoryPage() {
  const { data } = useDemoData();

  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter patients by search & gender
  const filteredPatients = data.patients.filter((p) => {
    const matchesSearch =
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.mobile.includes(searchTerm);

    const matchesGender =
      genderFilter === "ALL" || p.gender === genderFilter;

    return matchesSearch && matchesGender;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPatients.length / pageSize) || 1;
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // CSV Export
  const handleExportCSV = () => {
    const headers = ["Patient ID", "Full Name", "Mobile", "Gender", "Date of Birth", "Registration Date", "Address", "Reason for Visit"];
    const rows = filteredPatients.map((p) => [
      `"${p.id}"`,
      `"${p.fullName}"`,
      `"${p.mobile}"`,
      `"${p.gender}"`,
      `"${p.dob || ""}"`,
      `"${p.registrationDate}"`,
      `"${p.address || ""}"`,
      `"${p.reasonForVisit || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      "# NOTICE: DEMO DATA ONLY - FOR EVALUATION PURPOSES ONLY\n" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `demo_patients_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-700" />
            <h2 className="text-xl font-black text-slate-900">
              Patient Management &amp; Directory
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Total of {data.patients.length} outpatient medical records registered in browser storage
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Patient</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, ID, or mobile..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-500">Gender:</span>
          <select
            value={genderFilter}
            onChange={(e) => {
              setGenderFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white"
          >
            <option value="ALL">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Patients Data Table / Desktop */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {paginatedPatients.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            No patient records found matching &ldquo;{searchTerm}&rdquo;. Try another search or add a new patient.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Patient Name &amp; ID</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Gender &amp; DOB</th>
                  <th className="py-3 px-4">Primary Concern</th>
                  <th className="py-3 px-4">Registered Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <Link
                        href={`/demo/patients/${patient.id}`}
                        className="font-bold text-slate-900 text-sm hover:text-teal-700 hover:underline block"
                      >
                        {patient.fullName}
                      </Link>
                      <span className="text-[11px] font-mono text-teal-800 font-semibold">
                        {patient.id}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800 block">
                        {patient.mobile}
                      </span>
                      {patient.email && (
                        <span className="text-[11px] text-slate-400 block truncate max-w-xs">
                          {patient.email}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="font-medium text-slate-800">{patient.gender}</span>
                      {patient.dob && (
                        <span className="text-[11px] text-slate-400 block">
                          DOB: {formatDate(patient.dob)}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="truncate max-w-xs block font-medium">
                        {patient.reasonForVisit || "General Consultation"}
                      </span>
                      {patient.emergencyContact && (
                        <span className="text-[10px] text-slate-400 block truncate">
                          Em: {patient.emergencyContact}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {formatDate(patient.registrationDate)}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <Link
                        href={`/demo/patients/${patient.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 font-bold text-xs transition-colors"
                      >
                        <span>View Chart</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {paginatedPatients.length} of {filteredPatients.length} patients
          </span>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                    currentPage === i + 1
                      ? "bg-teal-700 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <AddPatientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}

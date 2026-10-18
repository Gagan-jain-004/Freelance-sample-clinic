import React from "react";
import Link from "next/link";
import { Stethoscope, Mail, ShieldAlert, ExternalLink } from "lucide-react";
import { siteConfig } from "@/config/site";

export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white">
                <Stethoscope className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-white text-lg tracking-tight">
                {siteConfig.name}
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md">
              ZustDevServices provides high-performance custom web applications, SaaS platforms, and specialized clinic management systems engineered for modern outpatient practices.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-slate-300">
              <Mail className="w-4 h-4 text-teal-400 shrink-0" />
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="hover:text-teal-400 transition-colors font-medium underline underline-offset-4"
              >
                {siteConfig.contactEmail}
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              Demo Navigation
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/demo/dashboard" className="hover:text-white transition-colors">
                  Doctor Dashboard
                </Link>
              </li>
              <li>
                <Link href="/demo/patients" className="hover:text-white transition-colors">
                  Patient Records (EMR)
                </Link>
              </li>
              <li>
                <Link href="/demo/appointments" className="hover:text-white transition-colors">
                  Appointment Calendar
                </Link>
              </li>
              <li>
                <Link href="/demo/queue" className="hover:text-white transition-colors">
                  Live Waiting Queue
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Patient Self-Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Social / Direct Connect */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              Connect With Us
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a
                  href={siteConfig.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-400 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>LinkedIn Profile</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-400 transition-colors inline-flex items-center gap-1.5"
                >
                  {/* <span>Instagram</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" /> */}
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-400 transition-colors inline-flex items-center gap-1.5"
                >
                  {/* <span>YouTube Channel</span> */}
                  {/* <ExternalLink className="w-3 h-3 text-slate-500" /> */}
                </a>
              </li>
              <li>
                {/* <Link href="#contact" className="hover:text-white transition-colors">
                  Request Custom Quote
                </Link> */}
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Strip */}
        <div className="mt-12 pt-8 border-t border-slate-800/80">
          <div className="rounded-xl bg-slate-900 p-4 border border-slate-800 text-xs text-slate-400 flex items-start gap-3 mb-6">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-slate-200">Legal &amp; Privacy Disclaimer:</strong> {siteConfig.demoDisclaimer}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <p>© {currentYear} {siteConfig.name}. All rights reserved.</p>
            <p>Designed for Healthcare Practitioners &amp; Clinic Administrators</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

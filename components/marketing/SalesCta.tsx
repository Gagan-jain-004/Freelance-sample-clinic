import React from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { getCustomEnquiryMailtoUrl, siteConfig } from "@/config/site";

export function SalesCta() {
  const mailtoUrl = getCustomEnquiryMailtoUrl(
    "Custom Clinic Management Suite Inquiry - ZustDevServices",
    `Hello ZustDevServices Team,

I evaluated your Clinic Management System Demo and would like to consult on deploying a customized clinic software for our practice.

Clinic Name: 
Doctor / Practice Head: 
Specialty / Clinic Type: 
Location (City/State): 
Key Custom Modules Needed (e.g. Multi-Doctor, Pharmacy, WhatsApp reminders, Lab Integration): 
Contact Number: 

Please share details regarding pricing, development timeline, and deployment.

Thank you!`
  );

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white relative overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-950/80 border border-teal-800/80 px-3.5 py-1 rounded-full">
          Tailored Engineering by {siteConfig.name}
        </span>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mt-4 text-white">
          Want a Clinic Management System <br className="hidden sm:inline" />
          Built for Your Clinic?
        </h2>

        <p className="mt-5 text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Get a customized clinic management solution tailored to your clinic’s workflow, branding, and requirements — including multi-doctor scheduling, pharmacy inventory, WhatsApp notifications, and dedicated data sovereignty.
        </p>

        {/* Feature bullets */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-y-3 gap-x-8 text-xs sm:text-sm text-teal-200">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            100% White-Labeled with Your Logo &amp; Colors
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            Custom Prescription &amp; Bill Formats
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            Private Secure Cloud Database
          </span>
        </div>

        {/* Action Button */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={mailtoUrl}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-base shadow-xl shadow-teal-500/20 hover:shadow-teal-400/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Mail className="w-5 h-5" />
            <span>Contact ZustDevServices</span>
          </a>
        </div>

        <p className="mt-4 text-xs text-slate-400">
          Opens direct email draft to <strong className="text-slate-200 font-semibold">{siteConfig.contactEmail}</strong>
        </p>
      </div>
    </section>
  );
}

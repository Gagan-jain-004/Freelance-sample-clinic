import React from "react";
import { MousePointerClick, SlidersHorizontal, Rocket } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: MousePointerClick,
    title: "Explore the Interactive Demo",
    description:
      "Navigate through the pre-seeded doctor dashboard, live patient queue, consultation records, digital prescriptions, and billing modules in your browser.",
  },
  {
    step: "02",
    icon: SlidersHorizontal,
    title: "Test Clinic Workflows",
    description:
      "Register a patient, book an appointment, check them into the waiting room, document clinical notes, issue a prescription, and generate an invoice.",
  },
  {
    step: "03",
    icon: Rocket,
    title: "Order Your Custom Clinic Suite",
    description:
      "Contact ZustDevServices to get your clinic management system tailored with your own branding, custom fields, dedicated backend, and secure deployment.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Process &amp; Evaluation
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
            How This Demonstration Works
          </h2>
          <p className="text-slate-600 mt-4 text-base sm:text-lg">
            Experience the software hands-on before deciding on a production setup for your clinic.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative rounded-2xl bg-white border border-slate-200/90 p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/60 flex items-center justify-center font-bold">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black text-slate-300 font-mono">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2.5">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-teal-700">
                  Step {idx + 1} of 3
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

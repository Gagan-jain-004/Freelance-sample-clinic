"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Stethoscope, Menu, X, ArrowRight, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/config/site";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-teal-700 flex items-center justify-center text-white shadow-md shadow-teal-700/20 group-hover:bg-teal-600 transition-colors">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-slate-900 tracking-tight leading-none text-lg">
              Zust<span className="text-teal-700">Clinic</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-600">
              by {siteConfig.name}
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <Link href="#features" className="hover:text-teal-700 transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="hover:text-teal-700 transition-colors">
            How It Works
          </Link>
          <Link href="#demo-portals" className="hover:text-teal-700 transition-colors">
            Demo Portals
          </Link>
          <Link href="#contact" className="hover:text-teal-700 transition-colors">
            Custom Build
          </Link>
        </nav>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/register"
            className="text-xs font-semibold px-3 py-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Patient Register Demo
          </Link>
          <Link
            href="/demo/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white shadow-sm transition-all"
          >
            <span>Explore Demo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <Link
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700 hover:text-teal-700"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700 hover:text-teal-700"
          >
            How It Works
          </Link>
          <Link
            href="#demo-portals"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700 hover:text-teal-700"
          >
            Demo Portals
          </Link>
          <Link
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700 hover:text-teal-700"
          >
            Custom Solutions
          </Link>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-2 text-sm font-semibold border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50"
            >
              Patient Registration Demo
            </Link>
            <Link
              href="/demo/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-2 text-sm font-semibold bg-teal-700 text-white rounded-lg hover:bg-teal-800"
            >
              Open Doctor Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

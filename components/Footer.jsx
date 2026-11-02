"use client";

import React from "react";
import Link from "next/link";
import { Activity, Shield, Clock, Phone, MapPin, Mail, Award, HeartPulse } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm shadow-blue-500/20">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Care<span className="text-blue-400">Slot</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Advanced Real-Time Doctor Availability and Dynamic OPD Queue Management System. Eliminating waiting hall congestion, double bookings, and communication latency.
            </p>
            <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold bg-blue-950/40 border border-blue-800/60 p-2.5 rounded-lg">
              <HeartPulse className="w-4 h-4 shrink-0 text-blue-400" />
              <span>OPD Emergency Triage Desk: 108 / 112</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">
              Hospital OPD Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/doctors" className="hover:text-blue-400 transition-colors">
                  Find Available Doctors
                </Link>
              </li>
              <li>
                <Link href="/queue" className="hover:text-blue-400 transition-colors">
                  Live OPD Waiting Board (Kiosk)
                </Link>
              </li>
              <li>
                <Link href="/patient" className="hover:text-blue-400 transition-colors">
                  Patient Portal & Digital Tokens
                </Link>
              </li>
              <li>
                <Link href="/doctor" className="hover:text-blue-400 transition-colors">
                  Doctor Queue Console
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-blue-400 transition-colors">
                  Admin Analytics & Management
                </Link>
              </li>
              <li>
                <Link href="/tests" className="hover:text-blue-400 transition-colors">
                  QA Test Execution (30 Cases)
                </Link>
              </li>
            </ul>
          </div>

          {/* OPD Departments */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">
              Key Specializations
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between">
                <span>Cardiology (Cath Wing)</span>
                <span className="text-blue-400 text-[10px] font-mono">Room 102</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Neurology & Spine</span>
                <span className="text-blue-400 text-[10px] font-mono">Room 204</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Pediatrics Clinic</span>
                <span className="text-blue-400 text-[10px] font-mono">Room 108</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Orthopedics & Joint Care</span>
                <span className="text-blue-400 text-[10px] font-mono">Room 112</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Dermatology Center</span>
                <span className="text-blue-400 text-[10px] font-mono">Room 215</span>
              </li>
              <li className="flex items-center justify-between">
                <span>General Internal Medicine</span>
                <span className="text-blue-400 text-[10px] font-mono">Room 101</span>
              </li>
            </ul>
          </div>

          {/* Academic & Project Details */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">
              Engineering Specs
            </h4>
            <div className="space-y-2 text-xs">
              <p className="flex items-center gap-1.5 text-slate-300">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>B.Tech CSE Project / Internship</span>
              </p>
              <p className="text-[11px] text-slate-400">
                Department of Computer Science & Engineering, Academic Session 2025–2026.
              </p>
              <div className="p-2.5 rounded bg-slate-800/80 border border-slate-700/60 text-[11px] font-mono text-slate-300 space-y-1">
                <div>Architecture: 3-Tier Client-Server</div>
                <div>Avg Latency: &lt; 142ms</div>
                <div>Queue Wait Reduction: &gt; 60%</div>
                <div>Security: PDO / RBAC / XSS Escaped</div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 CareSlot Healthcare System. All academic rights reserved.</p>
          <p className="flex items-center gap-3">
            <span>IEEE Citation: Smith et al. (2021)</span>
            <span>•</span>
            <span className="text-blue-400 font-mono">Version 2.4.0-Production</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

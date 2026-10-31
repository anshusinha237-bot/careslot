"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "../context/AppContext";
import Navbar from "../components/Navbar";
import DoctorCard from "../components/DoctorCard";
import BookingModal from "../components/BookingModal";
import PrintableTokenSlip from "../components/PrintableTokenSlip";
import SymptomCheckerModal from "../components/SymptomCheckerModal";
import {
  Search,
  Sparkles,
  Clock,
  Shield,
  Activity,
  HeartPulse,
  Brain,
  Baby,
  Bone,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingDown,
  Zap,
  Users,
  QrCode,
  Calendar,
} from "lucide-react";

export default function HomePage() {
  const { doctors, departments } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState(null);
  const [isSymptomCheckerOpen, setIsSymptomCheckerOpen] = useState(false);

  // Filter featured doctors
  const filteredDoctors = doctors.filter((doc) => {
    const matchesQuery =
      doc.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.dept_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.opd_room.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === "All" || doc.dept_name === selectedDept;
    return matchesQuery && matchesDept;
  });

  const availableNowCount = doctors.filter((d) => d.current_status === "Available").length;
  const inSurgeryCount = doctors.filter((d) => d.current_status === "In-Surgery").length;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onOpenSymptomChecker={() => setIsSymptomCheckerOpen(true)} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/60 via-slate-50 to-white pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0d94880a_1px,transparent_1px),linear-gradient(to_bottom,#0d94880a_1px,transparent_1px)] bg-[size:32px_32px]"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            {/* Pill Header */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-100/70 border border-teal-200 text-teal-800 text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span>
              <span>CARESLOT LIVE OPD PLATFORM • REAL-TIME AVAILABILITY</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Zero Waiting Rooms. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                Live Doctor Availability.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Track minute-by-minute doctor OPD presence, book non-conflicting time slots with instant digital tokens, and receive live delay alerts directly to your phone.
            </p>

            {/* Quick Search & AI Triage Bar */}
            <div className="pt-4 max-w-2xl mx-auto">
              <div className="bg-white p-2 rounded-2xl shadow-xl border border-slate-200/80 flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1 flex items-center">
                  <Search className="w-5 h-5 absolute left-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search specialist, cardiology, OPD room, or symptom..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 text-sm text-slate-800 rounded-xl focus:outline-none font-medium placeholder:text-slate-400"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsSymptomCheckerOpen(true)}
                    className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>AI Triage</span>
                  </button>
                  <Link
                    href="/doctors"
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition-colors whitespace-nowrap"
                  >
                    <span>Find Doctors</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar from Research Report */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
              <div className="bg-white/90 backdrop-blur-xs p-3.5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-center gap-1 text-teal-600 font-bold text-lg">
                  <TrendingDown className="w-4 h-4" />
                  <span>&gt; 60%</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Wait Time Reduced</p>
                <p className="text-[9px] text-slate-400">62m → 18m avg OPD</p>
              </div>

              <div className="bg-white/90 backdrop-blur-xs p-3.5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-center gap-1 text-emerald-600 font-bold text-lg">
                  <Zap className="w-4 h-4" />
                  <span>142 ms</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Slot Query Latency</p>
                <p className="text-[9px] text-slate-400">Sub-200ms benchmark</p>
              </div>

              <div className="bg-white/90 backdrop-blur-xs p-3.5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-center gap-1 text-indigo-600 font-bold text-lg">
                  <Shield className="w-4 h-4" />
                  <span>0 Collisions</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Concurrency Lock</p>
                <p className="text-[9px] text-slate-400">Zero double bookings</p>
              </div>

              <div className="bg-white/90 backdrop-blur-xs p-3.5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-center gap-1 text-blue-600 font-bold text-lg">
                  <Users className="w-4 h-4" />
                  <span>{availableNowCount} Doctors</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Live On Duty</p>
                <p className="text-[9px] text-slate-400">{inSurgeryCount} in OT procedure</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real-Time OPD Waiting Board Snapshot */}
      <section className="py-10 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                  Live Concourse Queue Stream
                </span>
              </div>
              <h2 className="text-2xl font-black">Out-Patient Department (OPD) Waiting Board</h2>
            </div>
            <Link
              href="/queue"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-400 hover:text-teal-300 text-xs font-semibold border border-slate-700 self-start md:self-auto transition-colors"
            >
              <span>Open Full Waiting Hall Display Screen</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {doctors.slice(0, 4).map((doc) => (
              <div
                key={doc.doctor_id}
                className="bg-slate-800/90 rounded-xl p-4 border border-slate-700/80 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-teal-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                      {doc.opd_room}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        doc.current_status === "Available"
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                          : doc.current_status === "In-Surgery"
                          ? "bg-rose-950 text-rose-300 border border-rose-800"
                          : "bg-amber-950 text-amber-300 border border-amber-800"
                      }`}
                    >
                      {doc.current_status}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-sm truncate">{doc.full_name}</h3>
                  <p className="text-xs text-slate-400 mb-3">{doc.dept_name}</p>

                  <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase text-slate-500 font-bold block">
                        Serving Token
                      </span>
                      <span className="text-2xl font-black text-white font-mono">
                        {doc.current_status === "Available"
                          ? `#${doc.current_token_serving}`
                          : "PAUSED"}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase text-slate-500 font-bold block">
                        Next in Line
                      </span>
                      <span className="text-sm font-bold text-teal-400 font-mono">
                        {doc.next_token ? `#${doc.next_token}` : "None"}
                      </span>
                    </div>
                  </div>
                </div>

                {doc.delay_minutes > 0 ? (
                  <div className="mt-3 text-[11px] text-amber-300 bg-amber-950/60 p-2 rounded border border-amber-800/60">
                    <span className="font-bold">Delay: ~{doc.delay_minutes}m</span> -{" "}
                    {doc.delay_reason}
                  </div>
                ) : (
                  <div className="mt-3 text-[11px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>On Schedule ({doc.shift_hours})</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OPD Departments Selector */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
              Specialized Care Wings
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              Select Out-Patient Department
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Filter available specialist consultations across hospital wings
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            <button
              onClick={() => setSelectedDept("All")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedDept === "All"
                  ? "bg-teal-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All Wings ({doctors.length})
            </button>
            {departments.map((dept) => (
              <button
                key={dept.dept_id}
                onClick={() => setSelectedDept(dept.dept_name)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedDept === dept.dept_name
                    ? "bg-teal-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <span>{dept.dept_name}</span>
              </button>
            ))}
          </div>

          {/* Doctor Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => (
              <DoctorCard
                key={doc.doctor_id}
                doctor={doc}
                onBook={(doctor) => setBookingDoctor(doctor)}
              />
            ))}
          </div>

          {filteredDoctors.length === 0 && (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="font-bold text-slate-700 text-sm">No doctors match your query</p>
              <p className="text-xs text-slate-500 mt-1">Try resetting the department or search terms</p>
              <button
                onClick={() => {
                  setSelectedDept("All");
                  setSearchQuery("");
                }}
                className="mt-3 px-4 py-2 bg-teal-600 text-white rounded-lg text-xs font-semibold"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
              Streamlined OPD Workflow
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-1">How CareSlot Operates</h2>
            <p className="text-xs text-slate-500 mt-1">
              Replacing manual paper registers and long queue congestion with live synchronicity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-black text-lg mb-4">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Check Live Doctor Status</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Before leaving home, check whether the specialist is Available, in emergency surgery, or on leave. Never waste trips.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-lg mb-4">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Book Slot & Get Digital Token</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Choose an available slot. The concurrency locking algorithm guarantees zero double bookings and issues your unique token receipt.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-lg mb-4">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Arrive Just in Time</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Monitor your queue position on your mobile phone or the concourse kiosk. Step into the doctor's room right when your token is called.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      {bookingDoctor && (
        <BookingModal
          doctor={bookingDoctor}
          onClose={() => setBookingDoctor(null)}
          onBookingSuccess={(app) => {
            setBookingDoctor(null);
            setConfirmedAppointment(app);
          }}
        />
      )}

      {confirmedAppointment && (
        <PrintableTokenSlip
          appointment={confirmedAppointment}
          onClose={() => setConfirmedAppointment(null)}
        />
      )}

      <SymptomCheckerModal
        isOpen={isSymptomCheckerOpen}
        onClose={() => setIsSymptomCheckerOpen(false)}
        onSelectDoctor={(doc) => setBookingDoctor(doc)}
      />
    </div>
  );
}

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
  Calendar,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  Sparkle,
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

  const getDeptIcon = (name) => {
    switch (name) {
      case "Cardiology":
        return HeartPulse;
      case "Neurology":
        return Brain;
      case "Pediatrics":
        return Baby;
      case "Orthopedics":
        return Bone;
      default:
        return Stethoscope;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-teal-600 selection:text-white">
      <Navbar onOpenSymptomChecker={() => setIsSymptomCheckerOpen(true)} />

      {/* Hero Section with Ambient Glow */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200/80 bg-white">
        {/* Soft Background Mesh Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-teal-400/15 via-emerald-300/15 to-sky-400/15 blur-3xl rounded-full pointer-events-none -z-10"></div>
        <div className="absolute -bottom-10 right-0 w-[500px] h-[300px] bg-gradient-to-bl from-teal-300/10 via-purple-300/10 to-transparent blur-3xl rounded-full pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & Search */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Feature Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200/80 text-teal-800 text-xs font-bold shadow-2xs">
                <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-ping"></span>
                <span className="tracking-wide">LIVE OPD DOCTOR AVAILABILITY &amp; QUEUE</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Zero Waiting Rooms. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500">
                  Live Doctor Availability.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Check minute-by-minute doctor OPD presence, reserve non-conflicting time slots with instant digital tokens, and receive live delay alerts directly on your phone.
              </p>

              {/* Elevated Search Bar */}
              <div className="pt-2 max-w-xl mx-auto lg:mx-0">
                <div className="bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-xl shadow-slate-200/70 border border-slate-200/90 flex flex-col sm:flex-row gap-2 transition-all focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500">
                  <div className="relative flex-1 flex items-center">
                    <Search className="w-5 h-5 absolute left-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search doctor, cardiology, OPD room, or symptom..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 text-sm text-slate-800 rounded-xl focus:outline-none font-medium placeholder:text-slate-400 bg-transparent"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsSymptomCheckerOpen(true)}
                      className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 text-purple-700 text-xs font-bold border border-purple-200/80 transition-all shadow-2xs whitespace-nowrap"
                    >
                      <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
                      <span>AI Triage</span>
                    </button>
                    <Link
                      href="/doctors"
                      className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-bold shadow-md shadow-teal-600/25 transition-all whitespace-nowrap active:scale-95"
                    >
                      <span>Find Doctors</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Quick Specialty Chips */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 mt-3 text-xs">
                  <span className="text-slate-400 font-semibold mr-1">Popular:</span>
                  {["Cardiology", "Neurology", "Pediatrics", "Orthopedics"].map((spec) => (
                    <button
                      key={spec}
                      onClick={() => {
                        setSelectedDept(spec);
                        setSearchQuery("");
                      }}
                      className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 font-medium transition-colors border border-slate-200/60"
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              </div>

              {/* Research Metrics Pill Strip */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto lg:mx-0">
                <div className="bg-slate-50/80 backdrop-blur-xs p-3 rounded-2xl border border-slate-200/80">
                  <div className="flex items-center gap-1 text-teal-600 font-black text-lg">
                    <TrendingDown className="w-4 h-4" />
                    <span>&gt; 60%</span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-700">Wait Reduction</p>
                  <p className="text-[9px] text-slate-400">62m → 18m avg OPD</p>
                </div>

                <div className="bg-slate-50/80 backdrop-blur-xs p-3 rounded-2xl border border-slate-200/80">
                  <div className="flex items-center gap-1 text-emerald-600 font-black text-lg">
                    <Zap className="w-4 h-4" />
                    <span>142 ms</span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-700">Slot Latency</p>
                  <p className="text-[9px] text-slate-400">Sub-200ms benchmark</p>
                </div>

                <div className="bg-slate-50/80 backdrop-blur-xs p-3 rounded-2xl border border-slate-200/80">
                  <div className="flex items-center gap-1 text-indigo-600 font-black text-lg">
                    <Shield className="w-4 h-4" />
                    <span>0 Collisions</span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-700">Slot Locking</p>
                  <p className="text-[9px] text-slate-400">Zero double bookings</p>
                </div>

                <div className="bg-slate-50/80 backdrop-blur-xs p-3 rounded-2xl border border-slate-200/80">
                  <div className="flex items-center gap-1 text-blue-600 font-black text-lg">
                    <Users className="w-4 h-4" />
                    <span>{availableNowCount} Doctors</span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-700">Live in OPD</p>
                  <p className="text-[9px] text-slate-400">{inSurgeryCount} in OT surgery</p>
                </div>
              </div>
            </div>

            {/* Right Column: Live OPD Station Showcase Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 shadow-2xl shadow-teal-900/10 border border-slate-200/90 overflow-hidden">
                {/* Station Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
                    <span className="text-xs font-black uppercase tracking-wider text-slate-900 font-mono">
                      LIVE STATION: ROOM 102
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Cath Lab Wing
                  </span>
                </div>

                {/* Doctor In Consultation */}
                <div className="py-4 flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-white font-black text-xl flex items-center justify-center shadow-md shadow-teal-500/25">
                    PS
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-lg">Dr. Priya Sharma</h4>
                    <p className="text-xs font-bold text-teal-600">Chief Interventional Cardiologist</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">MD, DM (Cardiology), FACC • 14 Yrs Exp</p>
                  </div>
                </div>

                {/* Big Live Token Board Widget */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-4 text-center my-2 shadow-inner">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-teal-400 block">
                    NOW CONSULTING IN ROOM
                  </span>
                  <span className="text-4xl font-black font-mono tracking-tight text-amber-300 block my-1">
                    TOKEN #104
                  </span>
                  <div className="flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-slate-700/80">
                    <span>Next Token:</span>
                    <span className="font-mono font-bold text-teal-400">Token #105 (Ready)</span>
                  </div>
                </div>

                {/* Live Progress Bar */}
                <div className="pt-3 space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span className="font-semibold">Today&apos;s Queue Progress:</span>
                    <span className="font-bold text-slate-900">12 of 18 Consultations</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full w-[67%] transition-all"></div>
                  </div>
                </div>

                {/* Live Action Pill */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">Sync Rate: &lt;142ms</span>
                  <Link
                    href="/queue"
                    className="text-teal-600 hover:text-teal-700 font-bold flex items-center gap-1 hover:underline"
                  >
                    <span>View All 8 Rooms</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialty Departments Showcase */}
      <section className="py-14 bg-slate-50/80 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-200/60">
              Specialized Medical Wings
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Browse by OPD Department
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select a specialized clinical wing to discover available doctors and time slots
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {departments.map((dept) => {
              const Icon = getDeptIcon(dept.dept_name);
              const isSelected = selectedDept === dept.dept_name;

              return (
                <button
                  key={dept.dept_id}
                  onClick={() => {
                    setSelectedDept(isSelected ? "All" : dept.dept_name);
                  }}
                  className={`p-5 rounded-3xl border text-left transition-all duration-300 flex flex-col justify-between group ${
                    isSelected
                      ? "bg-teal-600 text-white border-teal-600 shadow-lg shadow-teal-600/20 -translate-y-1"
                      : "bg-white text-slate-800 border-slate-200/90 hover:border-teal-400 hover:shadow-md hover:-translate-y-0.5"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-teal-50 text-teal-700"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {dept.floor?.split("-")[0] || "Wing"}
                    </span>
                  </div>

                  <div>
                    <h3
                      className={`font-bold text-sm ${
                        isSelected ? "text-white" : "text-slate-900 group-hover:text-teal-600"
                      }`}
                    >
                      {dept.dept_name}
                    </h3>
                    <p
                      className={`text-[11px] line-clamp-2 mt-1 leading-relaxed ${
                        isSelected ? "text-teal-100" : "text-slate-500"
                      }`}
                    >
                      {dept.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section className="py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
                Physicians On Duty
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                {selectedDept === "All" ? "Featured Specialist Doctors" : `${selectedDept} Specialists`}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Real-time consultation status, current token, and non-overlapping slot allocation
              </p>
            </div>

            {selectedDept !== "All" && (
              <button
                onClick={() => setSelectedDept("All")}
                className="text-xs font-bold text-teal-600 hover:text-teal-700 self-start sm:self-auto hover:underline"
              >
                Clear Department Filter (Show All)
              </button>
            )}
          </div>

          {/* Doctor Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.slice(0, 6).map((doc) => (
              <DoctorCard
                key={doc.doctor_id}
                doctor={doc}
                onBook={(doctor) => setBookingDoctor(doctor)}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/doctors"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <span>Explore Complete Hospital Roster ({doctors.length} Doctors)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How CareSlot Works (Modern 3-Step Section) */}
      <section className="py-16 bg-slate-50/80 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-200/60">
              Zero Confusion
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              How CareSlot Works in 3 Steps
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Eliminating physical queues, phone tag, and double bookings forever
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow relative">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-black text-lg mb-4 border border-teal-100">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Check Live Availability</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Before leaving your home, view whether the doctor is actively in their OPD room, busy in emergency surgery, or on leave. Never waste trips.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow relative">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-lg mb-4 border border-emerald-100">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Book Slot &amp; Get Digital Token</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Select an available time slot. The database concurrency lock guarantees zero double bookings, issuing an instant digital token slip with QR verification.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow relative">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-lg mb-4 border border-indigo-100">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Arrive Just-In-Time</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Track your queue position from your phone or the concourse TV board. Step directly into the consultation room the moment your token is called.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
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

      {/* Printable Slip */}
      {confirmedAppointment && (
        <PrintableTokenSlip
          appointment={confirmedAppointment}
          onClose={() => setConfirmedAppointment(null)}
        />
      )}

      {/* AI Symptom Recommender */}
      <SymptomCheckerModal
        isOpen={isSymptomCheckerOpen}
        onClose={() => setIsSymptomCheckerOpen(false)}
        onSelectDoctor={(doc) => setBookingDoctor(doc)}
      />
    </div>
  );
}

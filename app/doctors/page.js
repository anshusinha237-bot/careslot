"use client";

import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import Navbar from "../../components/Navbar";
import DoctorCard from "../../components/DoctorCard";
import BookingModal from "../../components/BookingModal";
import PrintableTokenSlip from "../../components/PrintableTokenSlip";
import SymptomCheckerModal from "../../components/SymptomCheckerModal";
import {
  Search,
  Filter,
  Stethoscope,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Clock,
  ArrowUpDown,
  X,
  Activity,
  CheckCircle2,
} from "lucide-react";

export default function DoctorsDirectoryPage() {
  const { doctors, departments } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [bookingSlot, setBookingSlot] = useState("");
  const [confirmedAppointment, setConfirmedAppointment] = useState(null);
  const [isSymptomCheckerOpen, setIsSymptomCheckerOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncText, setLastSyncText] = useState("Live Just Now");

  // Handle Manual Refresh (Requirement 3)
  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncText("Synced Just Now");
    }, 600);
  };

  // Filter & Sort Logic
  const filteredDoctors = doctors
    .filter((doc) => {
      const q = searchQuery.toLowerCase();
      const hospitalMatches = doc.hospitals?.some(
        (h) =>
          h.name?.toLowerCase().includes(q) ||
          h.branch?.toLowerCase().includes(q) ||
          h.short_name?.toLowerCase().includes(q)
      );

      const matchesSearch =
        doc.full_name.toLowerCase().includes(q) ||
        doc.dept_name.toLowerCase().includes(q) ||
        doc.qualification.toLowerCase().includes(q) ||
        doc.opd_room.toLowerCase().includes(q) ||
        Boolean(hospitalMatches);

      const matchesDept = selectedDept === "All" || doc.dept_name === selectedDept;
      const matchesStatus = selectedStatus === "All" || doc.current_status === selectedStatus;

      return matchesSearch && matchesDept && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "fee_asc") return a.consultation_fee - b.consultation_fee;
      if (sortBy === "fee_desc") return b.consultation_fee - a.consultation_fee;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedDept !== "All" ||
    selectedStatus !== "All" ||
    sortBy !== "default";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedDept("All");
    setSelectedStatus("All");
    setSortBy("default");
  };

  const handleBookDoctorWithSlot = (doctor, slot = "") => {
    setBookingDoctor(doctor);
    setBookingSlot(slot);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar onOpenSymptomChecker={() => setIsSymptomCheckerOpen(true)} />

      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200 py-8 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Stethoscope className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-black uppercase tracking-wider text-blue-700">
                  CareSlot Out-Patient Department Directory
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Find Available OPD Doctors
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                Real-time doctor presence, active token queue status, and instant slot reservations.
              </p>
            </div>

            <button
              onClick={() => setIsSymptomCheckerOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-900 text-xs font-bold border border-blue-200 shadow-2xs self-start md:self-auto transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Not sure which specialist? Try AI Triage</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {/* =========================================================
            UNIFIED STICKY SEARCH & FILTER TOOLBAR (Requirement 2 & 3)
        ========================================================= */}
        <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-xl border-2 border-slate-200/90 shadow-md rounded-3xl p-3 sm:p-4 mb-8 transition-all">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1. Unified Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search doctor, specialty, room..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-2xs placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* 2. Department Dropdown */}
            <div className="relative">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full pl-3.5 pr-8 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-2xs appearance-none cursor-pointer"
              >
                <option value="All">All Departments ({departments.length})</option>
                {departments.map((d) => (
                  <option key={d.dept_id} value={d.dept_name}>
                    {d.dept_name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-3 pointer-events-none text-slate-400">
                <Filter className="w-4 h-4 text-blue-600" />
              </div>
            </div>

            {/* 3. Live Status Filter */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full pl-3.5 pr-8 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-2xs appearance-none cursor-pointer"
              >
                <option value="All">All Live Statuses</option>
                <option value="Available">● Available Now (In OPD)</option>
                <option value="Busy">● Busy (In Consultation)</option>
                <option value="In-Surgery">● In-Surgery (Delayed)</option>
                <option value="On-Leave">● On Leave Today</option>
              </select>
              <div className="absolute right-3 top-3 pointer-events-none text-slate-400">
                <Activity className="w-4 h-4 text-emerald-600" />
              </div>
            </div>

            {/* 4. Sort Options */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-3.5 pr-8 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-2xs appearance-none cursor-pointer"
              >
                <option value="default">Sort by: Default</option>
                <option value="fee_asc">Consultation Fee: Low to High</option>
                <option value="fee_desc">Consultation Fee: High to Low</option>
                <option value="rating">Patient Rating: High to Low</option>
              </select>
              <div className="absolute right-3 top-3 pointer-events-none text-slate-400">
                <ArrowUpDown className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Bottom Bar: Live Feedback Status + Reset Option */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Left: Real-Time System Feedback (Requirement 3) */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
              </span>
              <span className="font-bold text-slate-800">
                Showing <strong className="text-blue-700">{filteredDoctors.length}</strong> Specialists
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                <span>{lastSyncText}</span>
              </span>
              <button
                type="button"
                onClick={handleManualSync}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition-colors"
                title="Refresh Real-Time Status"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-blue-600" : ""}`} />
              </button>
            </div>

            {/* Right: Active Filter Indicators & Reset Button */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs border border-blue-200 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Doctor Grid (with enhanced DoctorCard action buttons and contrast) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => (
            <DoctorCard
              key={doc.doctor_id}
              doctor={doc}
              onBook={handleBookDoctorWithSlot}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredDoctors.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 max-w-md mx-auto shadow-xs">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 text-base">No Specialists Found</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              No doctors match your selected search query or specialty filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20"
            >
              Show All Doctors
            </button>
          </div>
        )}
      </main>

      {/* Booking Modal (receives preselected slot if clicked directly on card) */}
      {bookingDoctor && (
        <BookingModal
          doctor={bookingDoctor}
          preselectedSlot={bookingSlot}
          onClose={() => {
            setBookingDoctor(null);
            setBookingSlot("");
          }}
          onBookingSuccess={(app) => {
            setBookingDoctor(null);
            setBookingSlot("");
            setConfirmedAppointment(app);
          }}
        />
      )}

      {/* Printable Token Slip */}
      {confirmedAppointment && (
        <PrintableTokenSlip
          appointment={confirmedAppointment}
          onClose={() => setConfirmedAppointment(null)}
        />
      )}

      {/* Symptom Checker Modal */}
      <SymptomCheckerModal
        isOpen={isSymptomCheckerOpen}
        onClose={() => setIsSymptomCheckerOpen(false)}
        onSelectDoctor={(doc) => handleBookDoctorWithSlot(doc)}
      />
    </div>
  );
}

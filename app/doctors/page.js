"use client";

import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import Navbar from "../../components/Navbar";
import DoctorCard from "../../components/DoctorCard";
import BookingModal from "../../components/BookingModal";
import PrintableTokenSlip from "../../components/PrintableTokenSlip";
import SymptomCheckerModal from "../../components/SymptomCheckerModal";
import { Search, Filter, Stethoscope, Sparkles, AlertCircle, RefreshCw } from "lucide-react";

export default function DoctorsDirectoryPage() {
  const { doctors, departments } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState(null);
  const [isSymptomCheckerOpen, setIsSymptomCheckerOpen] = useState(false);

  // Filter & Sort Logic
  const filteredDoctors = doctors
    .filter((doc) => {
      const matchesSearch =
        doc.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.dept_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.qualification.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.opd_room.toLowerCase().includes(searchQuery.toLowerCase());

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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar onOpenSymptomChecker={() => setIsSymptomCheckerOpen(true)} />

      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Stethoscope className="w-4 h-4 text-teal-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                  CareSlot Out-Patient Department Directory
                </span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Find Available OPD Doctors
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Real-time doctor presence, active token queue count, and instant booking slots.
              </p>
            </div>

            <button
              onClick={() => setIsSymptomCheckerOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200 self-start md:self-auto transition-colors"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Not sure which specialist? Try AI Triage</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search doctor, qualification, room..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              />
            </div>

            {/* Department Filter */}
            <div>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                <option value="All">All Departments ({departments.length})</option>
                {departments.map((d) => (
                  <option key={d.dept_id} value={d.dept_name}>
                    {d.dept_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Live Status Filter */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                <option value="All">All Live Statuses</option>
                <option value="Available">Available Now (In OPD)</option>
                <option value="Busy">Busy (In Consultation)</option>
                <option value="In-Surgery">In-Surgery (Delayed)</option>
                <option value="On-Leave">On Leave</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                <option value="default">Sort by: Default</option>
                <option value="fee_asc">Fee: Low to High</option>
                <option value="fee_desc">Fee: High to Low</option>
                <option value="rating">Patient Rating</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-semibold text-slate-600">
            Showing <span className="text-teal-700 font-bold">{filteredDoctors.length}</span>{" "}
            specialists on duty
          </p>

          {(searchQuery || selectedDept !== "All" || selectedStatus !== "All") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedDept("All");
                setSelectedStatus("All");
                setSortBy("default");
              }}
              className="text-xs text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Doctor Grid */}
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
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 max-w-md mx-auto">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">No Specialists Found</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              No doctors match your selected specialty and status filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedDept("All");
                setSelectedStatus("All");
              }}
              className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold"
            >
              Show All Doctors
            </button>
          </div>
        )}
      </main>

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
        onSelectDoctor={(doc) => setBookingDoctor(doc)}
      />
    </div>
  );
}

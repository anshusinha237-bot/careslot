"use client";

import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import BookingModal from "../../components/BookingModal";
import PrintableTokenSlip from "../../components/PrintableTokenSlip";
import CancellationModal from "../../components/CancellationModal";
import RescheduleModal from "../../components/RescheduleModal";
import { useApp } from "../../context/AppContext";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Printer,
  XCircle,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Activity,
  User,
} from "lucide-react";

export default function AppointmentsPage() {
  const {
    appointments,
    doctors,
    departments,
    bookAppointment,
    cancelAppointment,
    rescheduleAppointment,
    currentUser,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);

  const [selectedSlip, setSelectedSlip] = useState(null);
  const [cancellingApp, setCancellingApp] = useState(null);
  const [reschedulingApp, setReschedulingApp] = useState(null);
  const [actionNotice, setActionNotice] = useState("");

  // Filter appointments
  const filteredAppointments = appointments.filter((app) => {
    const matchesSearch =
      (app.patient_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.doctor_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.patient_phone || "").includes(searchQuery) ||
      String(app.token_number || "").includes(searchQuery) ||
      String(app.appointment_id || "").includes(searchQuery);

    const matchesDept =
      selectedDept === "All" || (app.dept_name || "").toLowerCase() === selectedDept.toLowerCase();

    const matchesStatus =
      selectedStatus === "All" || app.status === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleOpenBooking = (doc = null) => {
    setSelectedDoctorForBooking(doc || doctors[0] || null);
    setIsBookingOpen(true);
  };

  const handleBookingSubmit = async (bookingData) => {
    const result = await bookAppointment(bookingData);
    setIsBookingOpen(false);
    if (result.success) {
      setActionNotice(
        `Appointment confirmed! Digital Token #${result.appointment.token_number} allocated for ${result.appointment.doctor_name}.`
      );
      setTimeout(() => setActionNotice(""), 6000);
    }
  };

  const handleConfirmCancellation = (refundDetails) => {
    if (!cancellingApp) return;
    const appId = cancellingApp.appointment_id;
    cancelAppointment(appId, refundDetails);
    setActionNotice(
      `Appointment #${appId} cancelled. Status: ${refundDetails.refundStatus} (Refund: ₹${refundDetails.refundAmount.toFixed(
        2
      )}).`
    );
    setCancellingApp(null);
    setTimeout(() => setActionNotice(""), 6000);
  };

  const handleConfirmReschedule = (appId, newDate, newSlot, reason, deptName) => {
    rescheduleAppointment(appId, newDate, newSlot, reason, deptName);
    setActionNotice(
      `Appointment #${appId} rescheduled to ${newDate} at ${newSlot} (${deptName || "Same Specialty"}).`
    );
    setReschedulingApp(null);
    setTimeout(() => setActionNotice(""), 6000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-blue-600 selection:text-white">
      <Navbar />

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white py-12 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                <Calendar className="w-3.5 h-3.5" />
                <span>Central OPD Scheduling &amp; Token Registry</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Hospital OPD Appointments &amp; Tokens
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                Reserve non-overlapping consultation slots, track sequential queue tokens, reschedule across specialty wings, and download printable verification slips.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => handleOpenBooking()}
                className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Book New OPD Slot</span>
              </button>
              <Link
                href="/queue"
                className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-1.5"
              >
                <Clock className="w-4 h-4 text-cyan-300" />
                <span>Live Waiting Board</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Action Notice Toast */}
        {actionNotice && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center justify-between gap-3 shadow-xs animate-in slide-in-from-top-3 duration-200">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{actionNotice}</span>
            </div>
            <button
              onClick={() => setActionNotice("")}
              className="text-emerald-700 hover:text-emerald-900 text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Filter and Search Bar Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Patient Name, Doctor, Phone, Token #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Department Filter */}
            <div className="sm:col-span-3">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="All">All Specialty Departments</option>
                {departments.map((d) => (
                  <option key={d.dept_id} value={d.dept_name}>
                    {d.dept_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="sm:col-span-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="All">All Statuses</option>
                <option value="confirmed">Confirmed / Scheduled</option>
                <option value="in-progress">In-Room / Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
            <span>
              Showing <strong>{filteredAppointments.length}</strong> registered OPD appointments
            </span>
            {(searchQuery || selectedDept !== "All" || selectedStatus !== "All") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDept("All");
                  setSelectedStatus("All");
                }}
                className="text-blue-600 hover:text-blue-800 font-bold"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Appointments Table Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Token &amp; Ref #</th>
                  <th className="py-3.5 px-4">Patient Profile</th>
                  <th className="py-3.5 px-4">Specialist Doctor &amp; Wing</th>
                  <th className="py-3.5 px-4">Date &amp; Slot</th>
                  <th className="py-3.5 px-4">Consultation Fee</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((app) => (
                    <tr key={app.appointment_id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Token & Ref */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-mono font-black text-sm flex items-center justify-center">
                            #{app.token_number}
                          </span>
                          <div>
                            <span className="font-mono text-[10px] text-slate-400 block">
                              ID: #{app.appointment_id}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium">OPD Token</span>
                          </div>
                        </div>
                      </td>

                      {/* Patient */}
                      <td className="py-4 px-4">
                        <p className="font-bold text-slate-900">{app.patient_name}</p>
                        <p className="text-[11px] text-slate-500 font-mono">{app.patient_phone}</p>
                      </td>

                      {/* Doctor */}
                      <td className="py-4 px-4">
                        <p className="font-bold text-slate-900">{app.doctor_name}</p>
                        <p className="text-[11px] text-blue-600 font-semibold">{app.dept_name}</p>
                        <span className="text-[10px] text-slate-400 font-mono">{app.opd_room}</span>
                      </td>

                      {/* Date & Slot */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800">
                          <Calendar className="w-3.5 h-3.5 text-blue-500" />
                          <span>{app.appointment_date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5 font-mono">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{app.appointment_time}</span>
                        </div>
                      </td>

                      {/* Fee */}
                      <td className="py-4 px-4">
                        <p className="font-black text-slate-900 font-mono">₹{app.fee?.toFixed(0)}</p>
                        <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {app.payment_method || "Paid (UPI)"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                            app.status === "in-progress"
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : app.status === "confirmed"
                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                              : app.status === "completed"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : "bg-rose-100 text-rose-800 border border-rose-200"
                          }`}
                        >
                          {app.status === "confirmed" && <CheckCircle2 className="w-3 h-3 text-blue-600" />}
                          {app.status === "in-progress" && <Activity className="w-3 h-3 text-amber-600 animate-pulse" />}
                          {app.status === "completed" && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          <span className="capitalize">{app.status}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Print Token Slip */}
                          <button
                            type="button"
                            onClick={() => setSelectedSlip(app)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            title="Print OPD Token Slip"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          {/* Reschedule Button */}
                          {app.status === "confirmed" && (
                            <button
                              type="button"
                              onClick={() => setReschedulingApp(app)}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] transition-colors"
                              title="Reschedule to same specialty"
                            >
                              Reschedule
                            </button>
                          )}

                          {/* Cancel Button */}
                          {app.status === "confirmed" && (
                            <button
                              type="button"
                              onClick={() => setCancellingApp(app)}
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Cancel Appointment"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="font-semibold text-slate-700">No appointments matching criteria</p>
                      <p className="text-[11px] mt-0.5">Try adjusting your department, status, or search query.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      {isBookingOpen && (
        <BookingModal
          isOpen={isBookingOpen}
          doctor={selectedDoctorForBooking}
          onClose={() => setIsBookingOpen(false)}
          onBook={handleBookingSubmit}
        />
      )}

      {/* Printable Token Slip Modal */}
      {selectedSlip && (
        <PrintableTokenSlip appointment={selectedSlip} onClose={() => setSelectedSlip(null)} />
      )}

      {/* Cancellation Modal with Refund Rules */}
      {cancellingApp && (
        <CancellationModal
          isOpen={!!cancellingApp}
          appointment={cancellingApp}
          onClose={() => setCancellingApp(null)}
          onConfirmCancel={handleConfirmCancellation}
          onSwitchToReschedule={() => {
            const app = cancellingApp;
            setCancellingApp(null);
            setReschedulingApp(app);
          }}
        />
      )}

      {/* Reschedule Modal with Same-Specialty Fee Waiver */}
      {reschedulingApp && (
        <RescheduleModal
          isOpen={!!reschedulingApp}
          appointment={reschedulingApp}
          onClose={() => setReschedulingApp(null)}
          onConfirmReschedule={handleConfirmReschedule}
        />
      )}

      <Footer />
    </div>
  );
}

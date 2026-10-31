"use client";

import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import Navbar from "../../components/Navbar";
import PrintableTokenSlip from "../../components/PrintableTokenSlip";
import BookingModal from "../../components/BookingModal";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Printer,
  XCircle,
  AlertCircle,
  CheckCircle2,
  User,
  Plus,
  Activity,
  History,
  FileText,
  HeartPulse,
} from "lucide-react";

export default function PatientDashboardPage() {
  const { currentUser, appointments, doctors, cancelAppointment } = useApp();
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [bookingDoctor, setBookingDoctor] = useState(null);

  // Filter appointments for current patient or demo patient (user_id 1)
  const patientId = currentUser ? currentUser.user_id : 1;
  const userAppointments = appointments.filter(
    (app) => app.patient_id === patientId || app.patient_email === currentUser?.email
  );

  const activeAppointments = userAppointments.filter(
    (app) => app.status === "confirmed" || app.status === "in-progress"
  );

  // TC-25: Past medical history sorted by date DESC
  const pastAppointments = userAppointments
    .filter((app) => app.status === "completed" || app.status === "cancelled")
    .sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Patient Header */}
      <div className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white font-bold text-xl flex items-center justify-center shadow-md">
                {currentUser?.full_name?.charAt(0) || "P"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    Patient OPD Portal
                  </span>
                  <span className="text-xs text-slate-400">ID: #CS-PAT-{currentUser?.user_id || "101"}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
                  Welcome, {currentUser?.full_name || "Amit Kumar"}
                </h1>
                <p className="text-xs text-slate-500">
                  {currentUser?.email || "patient@careslot.com"} • {currentUser?.phone || "+91 91234 56789"}
                </p>
              </div>
            </div>

            <Link
              href="/doctors"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 self-start sm:self-auto transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Book New OPD Slot</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Active / Today's Digital Tokens */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse"></span>
              <h2 className="text-lg font-bold text-slate-900">
                Active Digital Tokens & Upcoming OPD Visits ({activeAppointments.length})
              </h2>
            </div>
            <Link href="/queue" className="text-xs text-teal-600 font-semibold hover:underline">
              View Hospital Concourse Display →
            </Link>
          </div>

          {activeAppointments.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeAppointments.map((app) => {
                const doc = doctors.find((d) => d.doctor_id === app.doctor_id);
                const currentServing = doc ? doc.current_token_serving : 0;
                const difference = app.token_number - currentServing;

                return (
                  <div
                    key={app.appointment_id}
                    className="bg-white rounded-2xl border-2 border-teal-500/40 p-6 shadow-md flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                            CONFIRMED OPD VISIT
                          </span>
                          <h3 className="text-xl font-bold text-slate-900 mt-2">
                            {app.doctor_name}
                          </h3>
                          <p className="text-xs font-semibold text-teal-600">
                            {app.dept_name} • {app.opd_room}
                          </p>
                        </div>

                        {/* Large Token Badge */}
                        <div className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white p-3 rounded-2xl text-center min-w-[100px] shadow-sm">
                          <span className="text-[9px] uppercase font-bold tracking-widest block opacity-90">
                            OPD TOKEN
                          </span>
                          <span className="text-3xl font-black font-mono block">
                            #{app.token_number}
                          </span>
                        </div>
                      </div>

                      {/* Live Queue Position Status */}
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-4 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Doctor&apos;s Current Token:</span>
                          <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                            Token #{currentServing}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Your Queue Position:</span>
                          <span className="font-bold text-teal-700">
                            {difference <= 0
                              ? "Now inside / Consult in progress"
                              : difference === 1
                              ? "Next in Line (Proceed to Door)"
                              : `${difference} patients ahead of you`}
                          </span>
                        </div>

                        {doc?.delay_minutes > 0 && (
                          <div className="mt-2 text-xs text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-200 flex items-start gap-1.5">
                            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <span>
                              Emergency Delay Notice: ~{doc.delay_minutes} mins delay ({doc.delay_reason})
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Date & Time Slot Details */}
                      <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-teal-600" />
                          <span>Date: {app.appointment_date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-teal-600" />
                          <span>Slot: {app.appointment_time}</span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-4">
                        <span className="font-bold text-slate-700">Symptoms: </span>
                        <span>{app.symptoms}</span>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 gap-3">
                      <button
                        onClick={() => setSelectedSlip(app)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold border border-teal-200 transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Digital Slip</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm("Are you sure you want to cancel this booking? The slot will be freed for other patients.")) {
                            cancelAppointment(app.appointment_id);
                          }
                        }}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel Booking</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center max-w-lg mx-auto">
              <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 text-base">No Active OPD Bookings</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                You have no scheduled doctor consultations for today.
              </p>
              <Link
                href="/doctors"
                className="px-4 py-2.5 bg-teal-600 text-white rounded-xl text-xs font-bold inline-block"
              >
                Find & Book Doctor
              </Link>
            </div>
          )}
        </div>

        {/* Past Consultation History (TC-25) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-slate-500" />
              Previous OPD Consultation Records (TC-25: Date DESC)
            </h2>
            <span className="text-xs text-slate-500">{pastAppointments.length} past records</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            {pastAppointments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                    <tr>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Doctor & Specialty</th>
                      <th className="py-3 px-4">OPD Room</th>
                      <th className="py-3 px-4">Token #</th>
                      <th className="py-3 px-4">Symptoms / Diagnosis</th>
                      <th className="py-3 px-4">Fee</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {pastAppointments.map((app) => (
                      <tr key={app.appointment_id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-4 font-mono font-medium">{app.appointment_date}</td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-900">{app.doctor_name}</p>
                          <p className="text-[10px] text-teal-600">{app.dept_name}</p>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{app.opd_room}</td>
                        <td className="py-3 px-4 font-mono font-bold">#{app.token_number}</td>
                        <td className="py-3 px-4 italic text-slate-500 max-w-[200px] truncate">
                          {app.symptoms}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          ₹{app.fee?.toFixed(0)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              app.status === "completed"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500">
                No past appointment history available.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Printable Slip Modal */}
      {selectedSlip && (
        <PrintableTokenSlip
          appointment={selectedSlip}
          onClose={() => setSelectedSlip(null)}
        />
      )}
    </div>
  );
}

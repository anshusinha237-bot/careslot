"use client";

import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import Navbar from "../../components/Navbar";
import PrintableTokenSlip from "../../components/PrintableTokenSlip";
import CancellationModal from "../../components/CancellationModal";
import RescheduleModal from "../../components/RescheduleModal";
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
  RefreshCw,
  ShieldCheck,
  ArrowRight,
  Info,
} from "lucide-react";

export default function PatientDashboardPage() {
  const {
    currentUser,
    appointments,
    doctors,
    cancelAppointment,
    rescheduleAppointment,
  } = useApp();

  const [selectedSlip, setSelectedSlip] = useState(null);
  const [cancellingApp, setCancellingApp] = useState(null);
  const [reschedulingApp, setReschedulingApp] = useState(null);
  const [actionBanner, setActionBanner] = useState("");

  // Filter appointments for current patient or demo patient (user_id 1)
  const patientId = currentUser ? currentUser.user_id : 1;
  const userAppointments = appointments.filter(
    (app) => app.patient_id === patientId || app.patient_email === currentUser?.email
  );

  const activeAppointments = userAppointments.filter(
    (app) => app.status === "confirmed" || app.status === "in-progress"
  );

  // Status tracking & past medical history sorted by date DESC
  const pastAppointments = userAppointments
    .filter((app) => app.status === "completed" || app.status === "cancelled" || app.rescheduled)
    .sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date));

  // Handle Cancellation confirmation with refund policy
  const handleConfirmCancellation = (refundDetails) => {
    if (!cancellingApp) return;
    const appId = cancellingApp.appointment_id;

    cancelAppointment(appId, refundDetails);

    if (refundDetails.refundAmount > 0) {
      setActionBanner(
        `Appointment #${appId} cancelled. Status: ${refundDetails.refundStatus} (Refund: ₹${refundDetails.refundAmount.toFixed(
          2
        )}, Fee deduction: ₹${refundDetails.cancellationFee.toFixed(2)}).`
      );
    } else {
      setActionBanner(
        `Appointment #${appId} cancelled. Status: No Refund (Cancelled within 4-hour threshold).`
      );
    }

    setCancellingApp(null);
    setTimeout(() => setActionBanner(""), 6000);
  };

  // Handle Reschedule confirmation with same-specialty fee waiver
  const handleConfirmReschedule = (appId, newDate, newSlot, reason, deptName) => {
    rescheduleAppointment(appId, newDate, newSlot, reason, deptName);
    setActionBanner(
      `Appointment #${appId} successfully rescheduled to ${deptName || "Same Specialty"} on ${newDate} at ${newSlot}! Standard cancellation penalties were waived.`
    );
    setReschedulingApp(null);
    setTimeout(() => setActionBanner(""), 6000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Patient Header */}
      <div className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold text-xl flex items-center justify-center shadow-md">
                {currentUser?.full_name?.charAt(0) || "P"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 self-start sm:self-auto transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Book New OPD Slot</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionBanner && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full">
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-semibold">{actionBanner}</span>
            </div>
            <button
              onClick={() => setActionBanner("")}
              className="text-blue-700 hover:text-blue-900 font-bold text-xs"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* CareSlot Policy Summary Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold uppercase text-slate-700 tracking-wider">
              CareSlot OPD Cancellation &amp; Reschedule Policy:
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="block font-bold text-slate-800">&gt; 8 Hours Before</span>
              <span className="text-[11px] text-emerald-700 font-bold block mt-0.5">100% Full Refund</span>
              <span className="text-[10px] text-slate-400 mt-1 block">0% fee deduction</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200">
              <span className="block font-bold text-slate-800">4 – 8 Hours Before</span>
              <span className="text-[11px] text-amber-800 font-bold block mt-0.5">17% Fee Cut</span>
              <span className="text-[10px] text-slate-500 mt-1 block">83% credited back</span>
            </div>
            <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200">
              <span className="block font-bold text-slate-800">&lt; 4 Hours Before</span>
              <span className="text-[11px] text-rose-700 font-bold block mt-0.5">No Refund (0%)</span>
              <span className="text-[10px] text-slate-500 mt-1 block">Reserved clinical slot</span>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
              <span className="block font-bold text-blue-900">Rescheduling</span>
              <span className="text-[11px] text-blue-700 font-bold block mt-0.5">100% Free Anytime</span>
              <span className="text-[10px] text-slate-500 mt-1 block">Preserves token &amp; fee</span>
            </div>
          </div>
        </div>

        {/* Active / Today's Digital Tokens */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
              <h2 className="text-lg font-bold text-slate-900">
                Active Digital Tokens &amp; Upcoming OPD Visits ({activeAppointments.length})
              </h2>
            </div>
            <Link href="/queue" className="text-xs text-blue-600 font-semibold hover:underline">
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
                    className="bg-white rounded-2xl border-2 border-blue-500/40 p-6 shadow-md flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                              CONFIRMED OPD VISIT
                            </span>
                            {app.rescheduled && (
                              <span className="text-[10px] uppercase font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200 flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-indigo-600" />
                                <span>Rescheduled</span>
                              </span>
                            )}
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 mt-2">
                            {app.doctor_name}
                          </h3>
                          <p className="text-xs font-semibold text-blue-600">
                            {app.dept_name} • {app.opd_room}
                          </p>
                        </div>

                        {/* Large Token Badge */}
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-3 rounded-2xl text-center min-w-[100px] shadow-sm">
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
                          <span className="font-bold text-blue-700">
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
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span>Date: <strong className="text-slate-800 font-semibold">{app.appointment_date}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span>Slot: <strong className="text-slate-800 font-semibold">{app.appointment_time}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-3">
                        <span className="text-slate-500">Payment:</span>
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <span>₹{app.fee?.toFixed(0)}</span>
                          {app.payment_status === "paid" ? (
                            <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-[10px] font-bold">
                              Paid Online ({app.payment_method || "UPI"})
                            </span>
                          ) : (
                            <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[10px] font-bold">
                              Pay at OPD Counter
                            </span>
                          )}
                        </span>
                      </div>

                      <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-4">
                        <span className="font-bold text-slate-700">Symptoms: </span>
                        <span>{app.symptoms}</span>
                      </div>
                    </div>

                    {/* Card Actions: Print Slip, Reschedule, Cancel */}
                    <div className="flex flex-wrap items-center justify-between pt-4 border-t border-slate-100 gap-2">
                      <button
                        onClick={() => setSelectedSlip(app)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Slip</span>
                      </button>

                      <div className="flex items-center gap-2">
                        {/* Reschedule Button */}
                        <button
                          onClick={() => setReschedulingApp(app)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 transition-colors"
                          title="Reschedule to same department with penalty waiver"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Reschedule</span>
                        </button>

                        {/* Cancel Appointment Button */}
                        <button
                          onClick={() => setCancellingApp(app)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 transition-colors"
                          title="Cancel appointment and view real-time refund calculation"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Cancel Appointment</span>
                        </button>
                      </div>
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
                className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold inline-block"
              >
                Find &amp; Book Doctor
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
                      <th className="py-3 px-4">Doctor &amp; Specialty</th>
                      <th className="py-3 px-4">OPD Room</th>
                      <th className="py-3 px-4">Token #</th>
                      <th className="py-3 px-4">Symptoms / Diagnosis</th>
                      <th className="py-3 px-4">Fee Paid</th>
                      <th className="py-3 px-4">Status &amp; Refund</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {pastAppointments.map((app) => (
                      <tr key={app.appointment_id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-4 font-mono font-medium">{app.appointment_date}</td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-900">{app.doctor_name}</p>
                          <p className="text-[10px] text-blue-600">{app.dept_name}</p>
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
                          {app.rescheduled && app.status !== "cancelled" ? (
                            <div className="space-y-0.5">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 inline-block">
                                Rescheduled to {app.rescheduled_to_dept || app.dept_name}
                              </span>
                              <p className="text-[10px] text-slate-500 font-medium">
                                Slot: {app.appointment_date} at {app.appointment_time}
                              </p>
                            </div>
                          ) : app.status === "completed" ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-300">
                              Completed
                            </span>
                          ) : app.status === "cancelled" ? (
                            <div className="space-y-0.5">
                              {app.refund_status === "Refund Initiated - 83%" ||
                              app.cancellation_tier === "more_than_8" ||
                              app.refund_percent === 83 ? (
                                <>
                                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 inline-block">
                                    Refund Initiated - 83%
                                  </span>
                                  <p className="text-[10px] text-slate-500">
                                    Refund: ₹{app.refund_amount?.toFixed(0)} (17% fee: ₹
                                    {app.cancellation_fee?.toFixed(0)})
                                  </p>
                                </>
                              ) : app.refund_status === "Refund Initiated - 50%" ||
                                app.cancellation_tier === "between_4_and_8" ? (
                                <>
                                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 inline-block">
                                    Refund Initiated - 50%
                                  </span>
                                  <p className="text-[10px] text-slate-500">
                                    Partial refund: ₹{app.refund_amount?.toFixed(0)} (50% fee: ₹
                                    {app.cancellation_fee?.toFixed(0)})
                                  </p>
                                </>
                              ) : (
                                <>
                                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 inline-block">
                                    No Refund
                                  </span>
                                  <p className="text-[10px] text-slate-500">
                                    Cancelled &lt; 4h threshold (₹0 refund)
                                  </p>
                                </>
                              )}
                            </div>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                              {app.status}
                            </span>
                          )}
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

      {/* Cancellation & Refund Policy Modal */}
      {cancellingApp && (
        <CancellationModal
          appointment={cancellingApp}
          onClose={() => setCancellingApp(null)}
          onConfirmCancel={handleConfirmCancellation}
          onSwitchToReschedule={() => {
            const target = cancellingApp;
            setCancellingApp(null);
            setReschedulingApp(target);
          }}
        />
      )}

      {/* Reschedule Date/Slot Modal */}
      {reschedulingApp && (
        <RescheduleModal
          appointment={reschedulingApp}
          doctor={doctors.find((d) => d.doctor_id === reschedulingApp.doctor_id)}
          onClose={() => setReschedulingApp(null)}
          onConfirmReschedule={handleConfirmReschedule}
        />
      )}
    </div>
  );
}

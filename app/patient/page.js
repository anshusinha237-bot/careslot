"use client";

import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import Navbar from "../../components/Navbar";
import PrintableTokenSlip from "../../components/PrintableTokenSlip";
import PrintablePrescriptionModal from "../../components/PrintablePrescriptionModal";
import PrintableInvoiceModal from "../../components/PrintableInvoiceModal";
import LabReportModal from "../../components/LabReportModal";
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
  Pill,
  CreditCard,
  Bell,
  Thermometer,
  Scale,
  Droplet,
  Heart,
  FileCheck2,
  Receipt,
  Download,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export default function PatientDashboardPage() {
  const {
    currentUser,
    appointments,
    doctors,
    cancelAppointment,
    rescheduleAppointment,
    prescriptions,
    labReports,
    invoices,
    patientVitals,
    notifications,
  } = useApp();

  const [activeTab, setActiveTab] = useState("overview");
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [selectedRx, setSelectedRx] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedLabReport, setSelectedLabReport] = useState(null);
  const [cancellingApp, setCancellingApp] = useState(null);
  const [reschedulingApp, setReschedulingApp] = useState(null);
  const [actionBanner, setActionBanner] = useState("");

  // Patient identification
  const patientId = currentUser ? currentUser.user_id : 1;
  const userAppointments = appointments.filter(
    (app) => app.patient_id === patientId || app.patient_email === currentUser?.email
  );

  const activeAppointments = userAppointments.filter(
    (app) => app.status === "confirmed" || app.status === "in-progress"
  );

  const pastAppointments = userAppointments
    .filter((app) => app.status === "completed" || app.status === "cancelled" || app.rescheduled)
    .sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date));

  // Patient-specific prescriptions, labs, invoices
  const userPrescriptions = (prescriptions || []).filter(
    (p) => p.patient_id === patientId || !p.patient_id
  );
  const userLabReports = (labReports || []).filter(
    (l) => l.patient_id === patientId || !l.patient_id
  );
  const userInvoices = invoices || [];

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

      {/* Hero Patient Header */}
      <div className="bg-white border-b border-slate-200 py-6 sm:py-8 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-md ring-4 ring-blue-50 shrink-0">
                {currentUser?.full_name?.charAt(0) || "A"}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    CareSlot OPD Patient Portal
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    ID: #CS-PAT-{currentUser?.user_id || "101"}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    ABHA Verified
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  Welcome, {currentUser?.full_name || "Amit Kumar"}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  {currentUser?.email || "patient@careslot.com"} • {currentUser?.phone || "+91 91234 56789"} • ABHA: <span className="font-mono text-slate-700">{patientVitals?.abha_id || "91-8849-2041-9923"}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-start md:self-auto">
              <Link
                href="/queue"
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                <Clock className="w-4 h-4 text-slate-500" />
                <span>Live Hospital Concourse</span>
              </Link>
              <Link
                href="/doctors"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Book New OPD Slot</span>
              </Link>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto mt-6 pt-4 border-t border-slate-100 no-scrollbar">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === "overview"
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-600/25"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Active Tokens &amp; Visits ({activeAppointments.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("vitals")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === "vitals"
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-600/25"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <HeartPulse className="w-4 h-4" />
              <span>Health Profile &amp; Vitals</span>
            </button>

            <button
              onClick={() => setActiveTab("prescriptions")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === "prescriptions"
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-600/25"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Pill className="w-4 h-4" />
              <span>E-Prescriptions ({userPrescriptions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("labReports")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === "labReports"
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-600/25"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Lab Reports ({userLabReports.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("billing")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === "billing"
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-600/25"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>Billing &amp; Invoices</span>
            </button>

            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === "notifications"
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-600/25"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Alerts &amp; Reminders</span>
            </button>
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

      {/* Main Dashboard Tabs Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* =========================================================
            TAB 1: OVERVIEW & ACTIVE APPOINTMENTS
        ========================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-8">
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
                        className="bg-white rounded-3xl border-2 border-blue-500/40 p-6 shadow-md flex flex-col justify-between"
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
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-3 rounded-2xl text-center min-w-[100px] shadow-sm">
                              <span className="text-[9px] uppercase font-bold tracking-widest block opacity-90">
                                OPD TOKEN
                              </span>
                              <span className="text-3xl font-black font-mono block">
                                #{app.token_number}
                              </span>
                            </div>
                          </div>

                          {/* Live Queue Position Status */}
                          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-4 space-y-2">
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
                            <span>Print Token Slip</span>
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
                              <span>Cancel</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center max-w-lg mx-auto shadow-xs">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">No Active OPD Bookings</h3>
                  <p className="text-xs text-slate-500 mt-1 mb-5">
                    You currently do not have any pending doctor consultations for today.
                  </p>
                  <Link
                    href="/doctors"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-md shadow-blue-600/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Find &amp; Book Specialist</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Past Consultation History */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <History className="w-5 h-5 text-slate-500" />
                  <span>Previous OPD Consultation History</span>
                </h2>
                <span className="text-xs text-slate-500">{pastAppointments.length} past records</span>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
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
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 inline-block">
                                  Rescheduled
                                </span>
                              ) : app.status === "completed" ? (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-300">
                                  Completed
                                </span>
                              ) : app.status === "cancelled" ? (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 inline-block">
                                  {app.refund_status || "Cancelled"}
                                </span>
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
                  <div className="p-8 text-center text-xs text-slate-500">
                    No past appointment history available.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 2: HEALTH PROFILE & VITALS
        ========================================================= */}
        {activeTab === "vitals" && (
          <div className="space-y-6">
            {/* ABHA & Digital Health Card */}
            <div className="bg-gradient-to-br from-blue-700 via-indigo-700 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                      National Digital Health Mission (ABHA)
                    </span>
                    <span className="text-[10px] bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold">
                      Active
                    </span>
                  </div>
                  <h2 className="text-2xl font-black">{currentUser?.full_name || "Amit Kumar"}</h2>
                  <p className="text-xs text-blue-100 font-mono mt-1">
                    ABHA ID: {patientVitals?.abha_id || "91-8849-2041-9923"}
                  </p>
                  <p className="text-xs text-blue-200/80 font-mono">
                    Aadhaar: {patientVitals?.aadhaar_masked || "XXXX XXXX 4812"}
                  </p>
                </div>
                <div className="text-left sm:text-right bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                  <span className="text-[10px] uppercase font-bold text-blue-200 block">Blood Group</span>
                  <span className="text-3xl font-black text-white block mt-0.5">
                    {patientVitals?.blood_group || "O+"}
                  </span>
                  <span className="text-[10px] text-blue-200 block mt-1">Universal Donor</span>
                </div>
              </div>
            </div>

            {/* Vitals Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-[11px] font-bold uppercase">Blood Pressure</span>
                  <HeartPulse className="w-4 h-4 text-rose-500" />
                </div>
                <p className="text-xl font-black text-slate-900">{patientVitals?.bp || "122/78"}</p>
                <span className="text-[10px] text-emerald-600 font-bold block mt-1">Optimal Range</span>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-[11px] font-bold uppercase">Heart Pulse</span>
                  <Activity className="w-4 h-4 text-blue-500" />
                </div>
                <p className="text-xl font-black text-slate-900">{patientVitals?.pulse || "72 bpm"}</p>
                <span className="text-[10px] text-emerald-600 font-bold block mt-1">Resting Normal</span>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-[11px] font-bold uppercase">Oxygen (SpO2)</span>
                  <Droplet className="w-4 h-4 text-cyan-500" />
                </div>
                <p className="text-xl font-black text-slate-900">{patientVitals?.spO2 || "99%"}</p>
                <span className="text-[10px] text-emerald-600 font-bold block mt-1">Room Air</span>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-[11px] font-bold uppercase">Temperature</span>
                  <Thermometer className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-xl font-black text-slate-900">{patientVitals?.temperature || "98.4 °F"}</p>
                <span className="text-[10px] text-emerald-600 font-bold block mt-1">Afebrile</span>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-[11px] font-bold uppercase">Body Weight</span>
                  <Scale className="w-4 h-4 text-indigo-500" />
                </div>
                <p className="text-xl font-black text-slate-900">{patientVitals?.weight || "68 kg"}</p>
                <span className="text-[10px] text-slate-400 font-medium block mt-1">Height: {patientVitals?.height || "174 cm"}</span>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-[11px] font-bold uppercase">BMI</span>
                  <Activity className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-xl font-black text-slate-900">{patientVitals?.bmi?.split(" ")[0] || "22.5"}</p>
                <span className="text-[10px] text-emerald-600 font-bold block mt-1">Healthy Weight</span>
              </div>
            </div>

            {/* Chronic Conditions & Allergies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-bold text-slate-900">Documented Drug Allergies</h3>
                </div>
                <div className="space-y-2">
                  {(patientVitals?.allergies || ["Penicillin (Mild)", "Dust & Pollen"]).map((all, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs font-semibold text-amber-900 flex items-center justify-between"
                    >
                      <span>{all}</span>
                      <span className="text-[10px] bg-amber-200/60 px-2 py-0.5 rounded-md font-bold">
                        Caution
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <h3 className="text-sm font-bold text-slate-900">Chronic Medical Conditions</h3>
                </div>
                <div className="space-y-2">
                  {(patientVitals?.chronic_conditions || ["Hypertension (Grade 1 - Controlled)"]).map((cond, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center justify-between"
                    >
                      <span>{cond}</span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md font-bold">
                        Under Rx Management
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 3: E-PRESCRIPTIONS
        ========================================================= */}
        {activeTab === "prescriptions" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Electronic Prescriptions (Rx)</h2>
                <p className="text-xs text-slate-500">
                  Doctor prescribed medications with dosage schedules and instructions.
                </p>
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                {userPrescriptions.length} Digital Prescriptions
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {userPrescriptions.map((rx) => (
                <div
                  key={rx.prescription_id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:border-blue-400 transition-all"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-black text-blue-600 italic font-serif">℞</span>
                          <span className="text-xs font-mono font-bold text-slate-500">
                            {rx.prescription_id}
                          </span>
                          {rx.is_active && (
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                              Active Regimen
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-slate-900 mt-1">{rx.doctor_name}</h3>
                        <p className="text-xs text-blue-600">{rx.dept_name}</p>
                      </div>
                      <span className="text-xs text-slate-500 font-mono">{rx.date}</span>
                    </div>

                    {/* Diagnosis */}
                    <div className="mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Diagnosis
                      </span>
                      <p className="font-semibold text-slate-800 mt-0.5">{rx.diagnosis}</p>
                    </div>

                    {/* Medicines Summary */}
                    <div className="space-y-2 mb-4">
                      <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                        Prescribed Medicines ({rx.medicines?.length || 0})
                      </span>
                      {rx.medicines?.map((med, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-blue-50/50 border border-blue-100 text-xs flex items-center justify-between"
                        >
                          <div>
                            <p className="font-bold text-slate-900">{med.name}</p>
                            <p className="text-[11px] text-blue-700">{med.frequency} • {med.duration}</p>
                          </div>
                          <span className="text-[11px] font-mono text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                            {med.dosage}
                          </span>
                        </div>
                      ))}
                    </div>

                    {rx.doctor_notes && (
                      <p className="text-xs text-slate-500 italic mb-4">
                        Doctor Note: {rx.doctor_notes}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      CareSlot Signed
                    </span>
                    <button
                      onClick={() => setSelectedRx(rx)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>View &amp; Print Prescription</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 4: LABORATORY REPORTS
        ========================================================= */}
        {activeTab === "labReports" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Laboratory &amp; Diagnostic Reports</h2>
                <p className="text-xs text-slate-500">
                  NABL accredited pathology and diagnostic test results with parameter breakdowns.
                </p>
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                {userLabReports.length} Reports Available
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {userLabReports.map((report) => (
                <div
                  key={report.report_id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:border-blue-400 transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span className="text-xs font-mono font-bold text-slate-500">
                            {report.report_id}
                          </span>
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                            {report.overall_status || "Normal"}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 mt-1">{report.test_name}</h3>
                        <p className="text-xs text-blue-600">{report.category}</p>
                      </div>
                      <span className="text-xs text-slate-500 font-mono">{report.reporting_date}</span>
                    </div>

                    {/* Parameters Preview */}
                    <div className="space-y-1.5 mb-4">
                      {report.parameters?.slice(0, 3).map((p, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-slate-50 border border-slate-100"
                        >
                          <span className="text-slate-700 font-medium">{p.parameter}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-900">
                              {p.value} {p.unit}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                              {p.flag}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <p className="text-xs text-slate-500">
                      Signoff: <strong>{report.pathologist}</strong>
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Specimen: {report.specimen}</span>
                    <button
                      onClick={() => setSelectedLabReport(report)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Open Full Report</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 5: BILLING & INVOICES
        ========================================================= */}
        {activeTab === "billing" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Billing &amp; Payment Receipts</h2>
                <p className="text-xs text-slate-500">
                  Itemized OPD consultation receipts, online transaction IDs, and refund records.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                    <tr>
                      <th className="py-3.5 px-4">Receipt #</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4">Doctor &amp; Department</th>
                      <th className="py-3.5 px-4">Payment Mode</th>
                      <th className="py-3.5 px-4">Transaction Ref</th>
                      <th className="py-3.5 px-4">Amount</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {userInvoices.map((inv) => (
                      <tr key={inv.invoice_id} className="hover:bg-slate-50/80">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          {inv.invoice_id}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 font-mono">{inv.date}</td>
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-900">{inv.doctor_name}</p>
                          <p className="text-[10px] text-blue-600">{inv.dept_name}</p>
                        </td>
                        <td className="py-3.5 px-4 font-medium">{inv.payment_mode}</td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                          {inv.transaction_id}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          ₹{inv.total_amount?.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedInvoice(inv)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold text-[11px] hover:bg-blue-100"
                          >
                            <Receipt className="w-3 h-3" />
                            <span>Receipt</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 6: NOTIFICATIONS & DELAYS
        ========================================================= */}
        {activeTab === "notifications" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Notifications &amp; OPD Reminders</h2>
                <p className="text-xs text-slate-500">
                  Real-time queue announcements, doctor delays, and appointment confirmations.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {(notifications || []).map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-2xl border flex items-start gap-3 shadow-xs ${
                    notif.type === "warning"
                      ? "bg-amber-50/70 border-amber-200 text-amber-900"
                      : "bg-blue-50/70 border-blue-200 text-blue-900"
                  }`}
                >
                  {notif.type === "warning" ? (
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  ) : (
                    <Bell className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider">{notif.title}</h4>
                      <span className="text-[10px] opacity-70 font-mono">{notif.time}</span>
                    </div>
                    <p className="text-xs mt-1 leading-relaxed">{notif.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Printable Token Slip Modal */}
      {selectedSlip && (
        <PrintableTokenSlip
          appointment={selectedSlip}
          onClose={() => setSelectedSlip(null)}
        />
      )}

      {/* Printable Prescription Modal */}
      {selectedRx && (
        <PrintablePrescriptionModal
          prescription={selectedRx}
          onClose={() => setSelectedRx(null)}
        />
      )}

      {/* Printable Invoice Modal */}
      {selectedInvoice && (
        <PrintableInvoiceModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}

      {/* Diagnostic Lab Report Modal */}
      {selectedLabReport && (
        <LabReportModal
          report={selectedLabReport}
          onClose={() => setSelectedLabReport(null)}
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

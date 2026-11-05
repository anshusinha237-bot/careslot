"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "../../context/AppContext";
import Navbar from "../../components/Navbar";
import DoctorPrescriptionModal from "../../components/DoctorPrescriptionModal";
import PatientMedicalHistoryModal from "../../components/PatientMedicalHistoryModal";
import PrintablePrescriptionModal from "../../components/PrintablePrescriptionModal";
import {
  Activity,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  Phone,
  Calendar,
  Send,
  Users,
  Settings,
  ChevronRight,
  Shield,
  FileText,
  Volume2,
  Stethoscope,
  Sparkles,
  Pill,
  HeartPulse,
  History,
  TrendingUp,
  Receipt,
  Printer,
  ChevronDown,
  Building2,
} from "lucide-react";

export default function DoctorDashboardPage() {
  const router = useRouter();
  const {
    currentUser,
    isAuthLoading,
    switchRole,
    doctors,
    appointments,
    updateDoctorStatus,
    broadcastDelay,
    clearDelay,
    callNextPatient,
    completeConsultation,
    prescriptions,
    addPrescription,
    patientVitals,
  } = useApp();

  const [selectedDoctorId, setSelectedDoctorId] = useState(null);

  // Determine active doctor: Selected from dropdown OR logged in doctor OR first doctor
  const activeDoctor =
    doctors.find((d) => d.doctor_id === selectedDoctorId) ||
    doctors.find((d) => d.doctor_id === currentUser?.doctor_id || d.user_id === currentUser?.user_id) ||
    doctors[0] || {};

  const [prescribingPatient, setPrescribingPatient] = useState(null);
  const [historyPatient, setHistoryPatient] = useState(null);
  const [viewingRx, setViewingRx] = useState(null);
  const [prescriptionSuccess, setPrescriptionSuccess] = useState("");
  const [delayInput, setDelayInput] = useState(activeDoctor.delay_minutes || 20);
  const [delayReason, setDelayReason] = useState(activeDoctor.delay_reason || "Emergency procedural case in OT");
  const [consultationNotes, setConsultationNotes] = useState("");
  const [prescriptionSaved, setPrescriptionSaved] = useState(false);
  const [scheduleShiftHours, setScheduleShiftHours] = useState(activeDoctor.shift_hours || "09:00 AM - 01:30 PM");
  const [consultationInterval, setConsultationInterval] = useState("15 Minutes");
  const [scheduleNotice, setScheduleNotice] = useState("");

  // Redirect unauthenticated visitor to login
  useEffect(() => {
    if (!isAuthLoading && !currentUser) {
      router.push("/login");
    }
  }, [isAuthLoading, currentUser, router]);

  // Loading state guard
  if (isAuthLoading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  // RBAC Protection - Only Doctor or Admin can access
  if (currentUser?.role === "patient") {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Doctor Terminal Restricted</h2>
              <p className="text-xs text-slate-500 mt-1">
                You are currently signed in as a <strong>Patient</strong> ({currentUser.full_name}). The Doctor OPD Terminal is restricted to authorized medical staff.
              </p>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/patient"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-colors"
              >
                Return to Patient Portal
              </Link>
              <button
                type="button"
                onClick={() => switchRole("doctor")}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                Switch to Demo Doctor Account
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Appointments for this doctor
  const doctorAppointments = appointments.filter((a) => a.doctor_id === activeDoctor.doctor_id);
  const todayAppointments = doctorAppointments.filter((a) => a.appointment_date === "2026-10-31" || a.appointment_date === "2026-11-01" || a.appointment_date === "2026-11-02");
  const inProgressApp = todayAppointments.find((a) => a.status === "in-progress");
  const confirmedApps = todayAppointments.filter((a) => a.status === "confirmed");
  const completedApps = todayAppointments.filter((a) => a.status === "completed");

  // Prescriptions issued by this doctor
  const doctorPrescriptions = (prescriptions || []).filter(
    (p) => p.doctor_id === activeDoctor.doctor_id || p.doctor_name === activeDoctor.full_name
  );

  const handleBroadcastDelay = (e) => {
    e.preventDefault();
    broadcastDelay(activeDoctor.doctor_id, Number(delayInput), delayReason);
  };

  const handleClearDelay = () => {
    clearDelay(activeDoctor.doctor_id);
    setDelayInput(0);
    setDelayReason("");
  };

  const handleSaveNotes = (e) => {
    e.preventDefault();
    setPrescriptionSaved(true);
    setTimeout(() => setPrescriptionSaved(false), 3000);
  };

  const handleUpdateSchedule = (e) => {
    e.preventDefault();
    setScheduleNotice("Working hours & consultation interval updated successfully!");
    setTimeout(() => setScheduleNotice(""), 3500);
  };

  const handleFinishAndCallNext = (appId) => {
    completeConsultation(appId);
    callNextPatient(activeDoctor.doctor_id);
  };

  const handleSavePrescription = (prescriptionData) => {
    addPrescription(prescriptionData);
    setPrescriptionSuccess(`Prescription #${prescriptionData.prescription_id} issued and added to patient record.`);
    setTimeout(() => setPrescriptionSuccess(""), 5000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* =========================================
          DOCTOR TERMINAL HEADER
      ========================================= */}
      <div className="bg-white border-b border-slate-200 py-6 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            {/* Doctor Info & Switcher */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-md shrink-0">
                {activeDoctor.full_name
                  .split(" ")
                  .filter((n) => !n.startsWith("Dr."))
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("") || "DR"}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    Clinical Console
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                    {activeDoctor.opd_room}
                  </span>
                  <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-blue-600" />
                    {activeDoctor.hospitals?.[0]?.short_name || "Apex Central Campus"}
                  </span>
                  <span className="text-xs text-slate-400">• Fee: ₹{activeDoctor.consultation_fee}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <h1 className="text-2xl font-black text-slate-900">
                    {activeDoctor.full_name}
                  </h1>

                  {/* Doctor Terminal Selector for QA / Testing */}
                  <select
                    value={activeDoctor.doctor_id}
                    onChange={(e) => setSelectedDoctorId(Number(e.target.value))}
                    className="ml-2 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-xl px-2.5 py-1 focus:outline-none cursor-pointer"
                    title="Switch doctor console view"
                  >
                    {doctors.map((doc) => (
                      <option key={doc.doctor_id} value={doc.doctor_id}>
                        {doc.full_name} ({doc.dept_name})
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {activeDoctor.qualification} • {activeDoctor.dept_name} • Shift: {activeDoctor.shift_hours}
                </p>
              </div>
            </div>

            {/* LIVE STATUS TOGGLE */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-2.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">
                Consultation Status:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "Available", bg: "bg-emerald-600", dot: "bg-emerald-300" },
                  { id: "Busy", bg: "bg-amber-600", dot: "bg-amber-300" },
                  { id: "In-Surgery", bg: "bg-rose-600", dot: "bg-rose-300" },
                  { id: "On-Leave", bg: "bg-slate-700", dot: "bg-slate-400" },
                ].map((s) => {
                  const isCurrent = activeDoctor.current_status === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => updateDoctorStatus(activeDoctor.doctor_id, s.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isCurrent
                          ? `${s.bg} text-white shadow-xs ring-2 ring-slate-900/10`
                          : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${s.dot}`}></span>
                      <span>{s.id}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prescription Success Toast */}
      {prescriptionSuccess && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 w-full">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{prescriptionSuccess}</span>
            </div>
            <button
              onClick={() => setPrescriptionSuccess("")}
              className="text-emerald-700 hover:text-emerald-900"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* =========================================
          MAIN CLINICAL WORKFLOW TERMINAL
      ========================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        {/* KPI Strip: Today's Clinical Snapshot */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Total Patients Today
            </span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {todayAppointments.length} Consultations
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold">Registered tokens</span>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Completed Consultations
            </span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">
              {completedApps.length} Seen
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Examined &amp; discharged</span>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Waiting in Queue
            </span>
            <span className="text-2xl font-black text-amber-600 mt-1 block font-mono">
              {confirmedApps.length} Patients
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Outside OPD door</span>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Current Serving Token
            </span>
            <span className="text-2xl font-black text-blue-700 mt-1 block font-mono">
              #{activeDoctor.current_token_serving}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Next in line: #{activeDoctor.next_token}</span>
          </div>
        </div>

        {/* BROADCAST EMERGENCY DELAY NOTICE */}
        <div className="bg-gradient-to-r from-amber-50 to-amber-100/40 border border-amber-300 rounded-3xl p-5 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
                <h3 className="font-bold text-amber-950 text-sm">
                  Broadcast Emergency OPD Delay Notice
                </h3>
                {activeDoctor.delay_minutes > 0 && (
                  <span className="bg-amber-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full">
                    Active Delay: ~{activeDoctor.delay_minutes}m
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-900/90 leading-relaxed">
                Emergency surgery or trauma ward rounds? Broadcast estimated delay to update all patient portals and waiting board concourses instantly.
              </p>
            </div>

            <form onSubmit={handleBroadcastDelay} className="flex flex-wrap items-center gap-2 shrink-0">
              <input
                type="number"
                min="0"
                max="180"
                value={delayInput}
                onChange={(e) => setDelayInput(e.target.value)}
                placeholder="Mins"
                className="w-20 px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                title="Delay duration in minutes"
              />
              <input
                type="text"
                value={delayReason}
                onChange={(e) => setDelayReason(e.target.value)}
                placeholder="Reason (e.g. emergency OT procedure)"
                className="w-56 sm:w-64 px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                Broadcast Notice
              </button>
              {activeDoctor.delay_minutes > 0 && (
                <button
                  type="button"
                  onClick={handleClearDelay}
                  className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition-colors"
                >
                  Clear Delay
                </button>
              )}
            </form>
          </div>
        </div>

        {/* 2-Column Clinical Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* =========================================
              LEFT (2 Cols): Active In-Room Consultation Console
          ========================================= */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <h2 className="text-base font-bold text-slate-900">
                    Active In-Room Patient Consultation
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => callNextPatient(activeDoctor.doctor_id)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Call Next Patient (Token #{activeDoctor.next_token})</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {inProgressApp ? (
                <div className="space-y-4">
                  {/* In-Room Patient Card */}
                  <div className="flex items-start justify-between bg-blue-50/70 p-4 rounded-2xl border border-blue-200/80">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block">
                        PATIENT CURRENTLY INSIDE CONSULTATION ROOM
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 mt-1">
                        {inProgressApp.patient_name}
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Phone: {inProgressApp.patient_phone} • Slot: {inProgressApp.appointment_time}
                      </p>
                    </div>

                    <div className="text-right flex flex-col items-end gap-2">
                      <div className="bg-blue-600 text-white px-3 py-1.5 rounded-xl text-center">
                        <span className="text-[9px] uppercase font-bold block opacity-90">TOKEN</span>
                        <span className="text-2xl font-black font-mono block">
                          #{inProgressApp.token_number}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Reported Symptoms & Quick Action Bar */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-700">Chief Symptoms &amp; Clinical Complaints:</span>
                      <button
                        type="button"
                        onClick={() => setHistoryPatient(inProgressApp)}
                        className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline"
                      >
                        <History className="w-3.5 h-3.5" />
                        <span>View Past Medical History</span>
                      </button>
                    </div>
                    <p className="text-slate-600 italic leading-relaxed">{inProgressApp.symptoms}</p>
                  </div>

                  {/* Quick Prescription & E-Pad Trigger */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                        <Pill className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">Digital E-Prescription Pad</h4>
                        <p className="text-[11px] text-slate-500">
                          Prescribe medications, dosage schedules, and clinical advice.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPrescribingPatient(inProgressApp)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Pill className="w-3.5 h-3.5" />
                      <span>Write Prescription</span>
                    </button>
                  </div>

                  {/* Clinical Notes & Quick Finish */}
                  <form onSubmit={handleSaveNotes} className="space-y-3 pt-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      OPD Clinical Notes &amp; Observations:
                    </label>
                    <textarea
                      rows={2}
                      value={consultationNotes}
                      onChange={(e) => setConsultationNotes(e.target.value)}
                      placeholder="Enter clinical examination notes, vitals (BP/Pulse), and advice..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
                    />
                    <div className="flex items-center justify-between gap-3 pt-1">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors"
                      >
                        Save Clinical Notes
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFinishAndCallNext(inProgressApp.appointment_id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Finish Consultation &amp; Call Next</span>
                      </button>
                    </div>
                    {prescriptionSaved && (
                      <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Notes stored in patient digital health record.
                      </p>
                    )}
                  </form>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-500">
                  <Activity className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="font-bold text-slate-800 text-base">No Patient Currently Inside</p>
                  <p className="text-xs text-slate-400 mt-1 mb-4">
                    The consultation room is clear. Click below to announce Token #{activeDoctor.next_token} inside.
                  </p>
                  <button
                    type="button"
                    onClick={() => callNextPatient(activeDoctor.doctor_id)}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all"
                  >
                    Call Next Token (#{activeDoctor.next_token})
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* =========================================
              RIGHT (1 Col): Working Hours & Consultation Interval
          ========================================= */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
                <Clock className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Working Hours &amp; Shift Interval
                </h3>
              </div>

              <form onSubmit={handleUpdateSchedule} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">OPD Working Shift Hours:</label>
                  <input
                    type="text"
                    value={scheduleShiftHours}
                    onChange={(e) => setScheduleShiftHours(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Consultation Interval:</label>
                  <select
                    value={consultationInterval}
                    onChange={(e) => setConsultationInterval(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="15 Minutes">15 Minutes per patient</option>
                    <option value="20 Minutes">20 Minutes per patient</option>
                    <option value="30 Minutes">30 Minutes per patient</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Max Daily Token Cap:</label>
                  <input
                    type="number"
                    defaultValue={30}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors shadow-2xs"
                >
                  Save Shift Settings
                </button>

                {scheduleNotice && (
                  <p className="text-blue-800 font-bold text-xs bg-blue-50 p-2 rounded-lg border border-blue-200">
                    {scheduleNotice}
                  </p>
                )}
              </form>
            </div>

            <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 space-y-1 mt-4">
              <p className="font-semibold text-slate-700">Today&apos;s Active Slots:</p>
              <div className="flex flex-wrap gap-1">
                {activeDoctor.available_slots.slice(0, 6).map((slot) => (
                  <span key={slot} className="bg-slate-100 px-2 py-0.5 rounded text-[10px] text-slate-600 font-mono">
                    {slot}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            DOCTOR'S PRESCRIPTION MANAGEMENT STRIP
        ========================================= */}
        {doctorPrescriptions.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Recently Issued Digital Prescriptions ({doctorPrescriptions.length})
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctorPrescriptions.map((rx) => (
                <div
                  key={rx.prescription_id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-500">{rx.prescription_id}</span>
                      <span className="font-mono text-slate-400 text-[11px]">{rx.date}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 mt-1">{rx.patient_name}</h4>
                    <p className="text-blue-600 text-[11px] font-medium">{rx.diagnosis}</p>
                    <p className="text-slate-500 text-[11px] mt-1">
                      {rx.medicines?.length || 0} Prescribed Medicines
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      Active
                    </span>
                    <button
                      onClick={() => setViewingRx(rx)}
                      className="text-blue-600 font-bold hover:underline flex items-center gap-1"
                    >
                      <Printer className="w-3 h-3" />
                      <span>View Slip</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================
            TODAY'S FULL SCHEDULE / WAITING BOARD
        ========================================= */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Today&apos;s Full Patient Roster &amp; Queue Management</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              {todayAppointments.length} Total Patients Registered
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Token #</th>
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">Slot Time</th>
                  <th className="py-3 px-4">Contact Phone</th>
                  <th className="py-3 px-4">Chief Complaint</th>
                  <th className="py-3 px-4">Queue Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {todayAppointments.map((app) => (
                  <tr key={app.appointment_id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-mono font-black text-sm text-slate-900">
                      #{app.token_number}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{app.patient_name}</p>
                      <button
                        type="button"
                        onClick={() => setHistoryPatient(app)}
                        className="text-[10px] text-blue-600 hover:underline"
                      >
                        View History
                      </button>
                    </td>
                    <td className="py-3 px-4 font-medium text-blue-700 font-mono">{app.appointment_time}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{app.patient_phone}</td>
                    <td className="py-3 px-4 italic text-slate-500 max-w-[220px] truncate">
                      {app.symptoms}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          app.status === "in-progress"
                            ? "bg-amber-100 text-amber-800 animate-pulse border border-amber-300"
                            : app.status === "confirmed"
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : app.status === "completed"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {app.status === "in-progress"
                          ? "Inside Room"
                          : app.status === "confirmed"
                          ? "Waiting in Concourse"
                          : app.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPrescribingPatient(app)}
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-bold text-[11px] border border-blue-200"
                          title="Write prescription"
                        >
                          Rx
                        </button>
                        {app.status === "confirmed" && (
                          <button
                            type="button"
                            onClick={() => callNextPatient(activeDoctor.doctor_id)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[11px] transition-colors"
                          >
                            Call In
                          </button>
                        )}
                        {app.status === "in-progress" && (
                          <button
                            type="button"
                            onClick={() => completeConsultation(app.appointment_id)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] shadow-2xs transition-colors"
                          >
                            Finish
                          </button>
                        )}
                        {app.status === "completed" && (
                          <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Seen</span>
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Doctor Prescription Pad Modal */}
      {prescribingPatient && (
        <DoctorPrescriptionModal
          doctor={activeDoctor}
          patient={prescribingPatient}
          onClose={() => setPrescribingPatient(null)}
          onSavePrescription={handleSavePrescription}
        />
      )}

      {/* Patient Medical History Modal */}
      {historyPatient && (
        <PatientMedicalHistoryModal
          patient={historyPatient}
          appointments={appointments}
          prescriptions={prescriptions}
          vitals={patientVitals}
          onClose={() => setHistoryPatient(null)}
        />
      )}

      {/* Printable Prescription Modal */}
      {viewingRx && (
        <PrintablePrescriptionModal
          prescription={viewingRx}
          onClose={() => setViewingRx(null)}
        />
      )}
    </div>
  );
}

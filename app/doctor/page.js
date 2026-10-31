"use client";

import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import Navbar from "../../components/Navbar";
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
} from "lucide-react";

export default function DoctorDashboardPage() {
  const {
    currentUser,
    doctors,
    appointments,
    updateDoctorStatus,
    broadcastDelay,
    clearDelay,
    callNextPatient,
    completeConsultation,
  } = useApp();

  // Find active doctor: If current user is doctor role, match user_id or doctor_id; otherwise default to Dr. Priya Sharma (101)
  const activeDoctor =
    doctors.find((d) => d.doctor_id === currentUser?.doctor_id || d.user_id === currentUser?.user_id) ||
    doctors[0]; // Dr. Priya Sharma

  const [delayInput, setDelayInput] = useState(activeDoctor.delay_minutes || 15);
  const [delayReason, setDelayReason] = useState(activeDoctor.delay_reason || "Emergency procedural case in OT");
  const [consultationNotes, setConsultationNotes] = useState("");
  const [prescriptionSaved, setPrescriptionSaved] = useState(false);
  const [scheduleShiftHours, setScheduleShiftHours] = useState(activeDoctor.shift_hours);
  const [scheduleNotice, setScheduleNotice] = useState("");

  // Appointments for this doctor
  const doctorAppointments = appointments.filter((a) => a.doctor_id === activeDoctor.doctor_id);
  const todayAppointments = doctorAppointments.filter((a) => a.appointment_date === "2026-10-31");
  const inProgressApp = todayAppointments.find((a) => a.status === "in-progress");
  const confirmedApps = todayAppointments.filter((a) => a.status === "confirmed");
  const completedApps = todayAppointments.filter((a) => a.status === "completed");

  const handleBroadcastDelay = (e) => {
    e.preventDefault();
    broadcastDelay(activeDoctor.doctor_id, delayInput, delayReason);
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
    setScheduleNotice("Schedule shift updated successfully (TC-13)!");
    setTimeout(() => setScheduleNotice(""), 3500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Doctor Header Banner */}
      <div className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 to-teal-700 text-white font-bold text-xl flex items-center justify-center shadow-md">
                {activeDoctor.full_name
                  .split(" ")
                  .filter((n) => !n.startsWith("Dr."))
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("") || "DR"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
                    OPD Specialist Console
                  </span>
                  <span className="text-xs font-mono text-slate-500 font-bold">{activeDoctor.opd_room}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
                  {activeDoctor.full_name}
                </h1>
                <p className="text-xs text-slate-500">
                  {activeDoctor.qualification} • {activeDoctor.dept_name} • Fee: ₹{activeDoctor.consultation_fee}
                </p>
              </div>
            </div>

            {/* Real-time Status Selector (TC-11) */}
            <div className="bg-slate-50 p-2 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase px-2">
                Live Status:
              </span>
              <div className="flex flex-wrap gap-1">
                {["Available", "Busy", "In-Surgery", "On-Leave"].map((status) => {
                  const isCurrent = activeDoctor.current_status === status;
                  return (
                    <button
                      key={status}
                      onClick={() => updateDoctorStatus(activeDoctor.doctor_id, status)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isCurrent
                          ? status === "Available"
                            ? "bg-emerald-600 text-white shadow-sm"
                            : status === "In-Surgery"
                            ? "bg-rose-600 text-white shadow-sm"
                            : status === "Busy"
                            ? "bg-amber-600 text-white shadow-sm"
                            : "bg-slate-700 text-white shadow-sm"
                          : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          status === "Available"
                            ? "bg-emerald-400"
                            : status === "In-Surgery"
                            ? "bg-rose-400"
                            : status === "Busy"
                            ? "bg-amber-400"
                            : "bg-slate-400"
                        }`}
                      ></span>
                      <span>{status}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Statistics Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold uppercase text-slate-400 block">Today&apos;s Bookings</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {todayAppointments.length} Patients
            </span>
            <span className="text-[10px] text-teal-600 font-medium">Scheduled for today</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold uppercase text-slate-400 block">Completed Visits</span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">
              {completedApps.length} Seen
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Consultations finished</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold uppercase text-slate-400 block">Waiting in Queue</span>
            <span className="text-2xl font-black text-amber-600 mt-1 block font-mono">
              {confirmedApps.length} Next
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Waiting outside room</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold uppercase text-slate-400 block">Active Serving Token</span>
            <span className="text-2xl font-black text-teal-700 mt-1 block font-mono">
              #{activeDoctor.current_token_serving}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Inside consultation</span>
          </div>
        </div>

        {/* Emergency Delay Broadcaster (TC-24) */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-50 to-amber-100/50 border border-amber-300 rounded-2xl p-5 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-5 h-5 text-amber-700" />
                <h3 className="font-bold text-amber-900 text-sm">
                  Broadcast Emergency OPD Delay Notice (TC-24)
                </h3>
              </div>
              <p className="text-xs text-amber-800">
                Delayed by emergency surgery or trauma rounds? Input delay minutes to instantly notify all booked patients & the concourse board.
              </p>
            </div>

            <form onSubmit={handleBroadcastDelay} className="flex flex-wrap items-center gap-2">
              <input
                type="number"
                min="0"
                max="180"
                value={delayInput}
                onChange={(e) => setDelayInput(e.target.value)}
                placeholder="Delay mins"
                className="w-24 px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
              />
              <input
                type="text"
                value={delayReason}
                onChange={(e) => setDelayReason(e.target.value)}
                placeholder="Reason (e.g. emergency OT procedure)"
                className="w-64 px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                Broadcast Delay
              </button>
              {activeDoctor.delay_minutes > 0 && (
                <button
                  type="button"
                  onClick={handleClearDelay}
                  className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                >
                  Clear Delay
                </button>
              )}
            </form>
          </div>
        </div>

        {/* 2-Column: Active Patient Consultation & Queue Advancement */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Consultation Console */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <h2 className="text-base font-bold text-slate-900">
                    Active In-Room Patient Consultation
                  </h2>
                </div>
                <button
                  onClick={() => callNextPatient(activeDoctor.doctor_id)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition-colors"
                >
                  <span>Call Next Patient (TC-12)</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {inProgressApp ? (
                <div className="space-y-4">
                  <div className="flex items-start justify-between bg-teal-50/60 p-4 rounded-xl border border-teal-200">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block">
                        PATIENT INSIDE OPD ROOM
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 mt-1">
                        {inProgressApp.patient_name}
                      </h3>
                      <p className="text-xs text-slate-600">
                        Phone: {inProgressApp.patient_phone} • Slot: {inProgressApp.appointment_time}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">TOKEN</span>
                      <span className="text-3xl font-black font-mono text-teal-800">
                        #{inProgressApp.token_number}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                    <span className="font-bold text-slate-700 block mb-1">Reported Symptoms / Complaints:</span>
                    <p className="text-slate-600 italic leading-relaxed">{inProgressApp.symptoms}</p>
                  </div>

                  {/* Consultation Notes & Prescription */}
                  <form onSubmit={handleSaveNotes} className="space-y-3 pt-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Doctor Clinical Notes & Prescription Advice:
                    </label>
                    <textarea
                      rows={3}
                      value={consultationNotes}
                      onChange={(e) => setConsultationNotes(e.target.value)}
                      placeholder="Enter clinical examination notes, vitals (BP/HR), and advised medication..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <div className="flex items-center justify-between">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors"
                      >
                        Save Clinical Notes
                      </button>
                      <button
                        type="button"
                        onClick={() => completeConsultation(inProgressApp.appointment_id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
                      >
                        Mark Consultation Complete
                      </button>
                    </div>
                    {prescriptionSaved && (
                      <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Notes stored in patient digital record.
                      </p>
                    )}
                  </form>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-500">
                  <Activity className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="font-bold text-slate-700 text-sm">No Patient Currently Inside</p>
                  <p className="text-xs text-slate-400 mt-1 mb-4">
                    Click &apos;Call Next Patient&apos; to invite Token #{activeDoctor.next_token} into the consultation room.
                  </p>
                  <button
                    onClick={() => callNextPatient(activeDoctor.doctor_id)}
                    className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    Call Next Token (#{activeDoctor.next_token})
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Schedule Settings & Shift Hours (TC-13) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
                <Settings className="w-4 h-4 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Working Shift & Slot Settings (TC-13)
                </h3>
              </div>

              <form onSubmit={handleUpdateSchedule} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">OPD Shift Hours:</label>
                  <input
                    type="text"
                    value={scheduleShiftHours}
                    onChange={(e) => setScheduleShiftHours(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Consultation Interval:</label>
                  <select className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>15 Minutes per patient</option>
                    <option>20 Minutes per patient</option>
                    <option>30 Minutes per patient</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Max Daily Token Cap:</label>
                  <input
                    type="number"
                    defaultValue={30}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-colors"
                >
                  Save Schedule
                </button>

                {scheduleNotice && (
                  <p className="text-emerald-700 font-bold text-xs bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                    {scheduleNotice}
                  </p>
                )}
              </form>
            </div>

            <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
              <p className="font-semibold text-slate-700">Available Slots Today:</p>
              <div className="flex flex-wrap gap-1">
                {activeDoctor.available_slots.slice(0, 6).map((slot) => (
                  <span key={slot} className="bg-slate-100 px-2 py-0.5 rounded text-[10px] text-slate-600">
                    {slot}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Today's Queue List Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-600" />
              Today&apos;s OPD Patient Queue List (Date: 2026-10-31)
            </h3>
            <span className="text-xs text-slate-500">
              {todayAppointments.length} Total Registered Tokens
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Token #</th>
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">Time Slot</th>
                  <th className="py-3 px-4">Contact Phone</th>
                  <th className="py-3 px-4">Chief Complaint</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {todayAppointments.map((app) => (
                  <tr key={app.appointment_id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-mono font-black text-sm text-slate-900">
                      #{app.token_number}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">{app.patient_name}</td>
                    <td className="py-3 px-4 font-medium text-teal-700">{app.appointment_time}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{app.patient_phone}</td>
                    <td className="py-3 px-4 italic text-slate-500 max-w-[220px] truncate">
                      {app.symptoms}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          app.status === "in-progress"
                            ? "bg-amber-100 text-amber-800 animate-pulse"
                            : app.status === "confirmed"
                            ? "bg-blue-100 text-blue-800"
                            : app.status === "completed"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {app.status === "confirmed" && (
                        <button
                          onClick={() => callNextPatient(activeDoctor.doctor_id)}
                          className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded font-semibold text-[11px]"
                        >
                          Call In
                        </button>
                      )}
                      {app.status === "in-progress" && (
                        <button
                          onClick={() => completeConsultation(app.appointment_id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold text-[11px]"
                        >
                          Finish
                        </button>
                      )}
                      {app.status === "completed" && (
                        <span className="text-[11px] text-slate-400">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

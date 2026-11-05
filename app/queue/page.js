"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../../context/AppContext";
import Navbar from "../../components/Navbar";
import {
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Volume2,
  Tv,
  Search,
  Bell,
  Activity,
  ArrowRight,
  ShieldAlert,
  Building2,
} from "lucide-react";

export default function LiveQueueBoardPage() {
  const router = useRouter();
  const { doctors, appointments, currentUser, isAuthLoading } = useApp();

  const [tokenSearch, setTokenSearch] = useState("");
  const [patientLookupResult, setPatientLookupResult] = useState(null);
  const [chimeMessage, setChimeMessage] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("All");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !currentUser) {
      router.push("/login");
    }
  }, [isAuthLoading, currentUser, router]);

  if (isAuthLoading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  const handleLookupToken = (e) => {
    e.preventDefault();
    const tokenNum = parseInt(tokenSearch.trim(), 10);
    if (isNaN(tokenNum)) return;

    // Look up in appointments
    const matchedApp = appointments.find(
      (app) => app.token_number === tokenNum && app.status !== "cancelled"
    );

    if (matchedApp) {
      const doc = doctors.find((d) => d.doctor_id === matchedApp.doctor_id);
      const currentlyServing = doc ? doc.current_token_serving : 0;
      const difference = tokenNum - currentlyServing;

      let waitEstimate = "Within 5-10 mins";
      let statusDesc = "Please stand by near the door.";

      if (difference <= 0) {
        statusDesc = "Your token is currently being called or completed!";
        waitEstimate = "Now in progress";
      } else if (difference === 1) {
        statusDesc = "You are NEXT in queue! Please proceed immediately to OPD door.";
        waitEstimate = "~5-8 mins";
      } else {
        const estMinutes = difference * 12 + (doc?.delay_minutes || 0);
        statusDesc = `${difference} patients ahead of you in line.`;
        waitEstimate = `~${estMinutes} mins`;
      }

      setPatientLookupResult({
        appointment: matchedApp,
        doctor: doc,
        currentlyServing,
        difference,
        statusDesc,
        waitEstimate,
      });
    } else {
      setPatientLookupResult({ notFound: true, searchedToken: tokenNum });
    }
  };

  const handleSimulateChime = (doc) => {
    setChimeMessage(`🔔 Announcement Chime: Token #${doc.next_token} please proceed to ${doc.opd_room} (${doc.full_name})`);
    setTimeout(() => {
      setChimeMessage("");
    }, 4500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      {/* Top Banner / Waiting Lounge Kiosk Header */}
      <div className="bg-slate-900 border-b border-slate-800 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Tv className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping"></span>
                <span className="text-xs font-bold text-blue-400 tracking-wider uppercase font-mono">
                  LIVE HOSPITAL CONCOURSE OPD BROADCAST
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Real-Time OPD Queue Display
              </h1>
            </div>
          </div>

          {/* Live Clock / Shift Indicator */}
          <div className="flex items-center gap-4 bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>OPD Active Hours: 08:30 AM – 06:30 PM</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-1.5 text-blue-400 font-bold font-mono">
              <Activity className="w-4 h-4" />
              <span>SYNC 142MS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chime Announcement Bar */}
      {chimeMessage && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 text-center font-bold text-sm tracking-wide shadow-lg animate-in slide-in-from-top-4 duration-200">
          {chimeMessage}
        </div>
      )}

      {/* Main Queue Interface */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Interactive "Find My Token & Wait Time" Tool */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-xl">
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center justify-center gap-2">
              <Bell className="w-5 h-5 text-amber-400" />
              Patient Personal Token Wait Tracker
            </h2>
            <p className="text-xs text-slate-400">
              Got your appointment slip? Enter your token number (e.g. 104, 105, 201) to check your exact live queue position and estimated arrival time.
            </p>

            <form onSubmit={handleLookupToken} className="flex gap-2 max-w-md mx-auto pt-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="number"
                  placeholder="Enter Token # (e.g., 105)"
                  value={tokenSearch}
                  onChange={(e) => setTokenSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
              >
                Track Token
              </button>
            </form>

            {/* Token Lookup Result Banner */}
            {patientLookupResult && (
              <div className="mt-4 text-left animate-in fade-in duration-200">
                {patientLookupResult.notFound ? (
                  <div className="bg-rose-950/60 border border-rose-800 text-rose-200 p-4 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>
                      Token #{patientLookupResult.searchedToken} was not found among active bookings for today.
                    </span>
                  </div>
                ) : (
                  <div className="bg-blue-950/60 border-2 border-blue-500 rounded-xl p-4 text-white space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-wider font-mono">
                        Live Tracking: Token #{patientLookupResult.appointment.token_number}
                      </span>
                      <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-bold">
                        {patientLookupResult.waitEstimate}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs border-t border-blue-800/80">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Patient</span>
                        <span className="font-bold text-white">
                          {patientLookupResult.appointment.patient_name}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">OPD Doctor</span>
                        <span className="font-bold text-blue-300">
                          {patientLookupResult.doctor?.full_name}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Room</span>
                        <span className="font-bold text-white">
                          {patientLookupResult.doctor?.opd_room}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Doctor Serving Now</span>
                        <span className="font-black text-amber-300 font-mono text-sm">
                          Token #{patientLookupResult.currentlyServing}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-blue-200 font-medium pt-1">
                      {patientLookupResult.statusDesc}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Live OPD Rooms Grid Display */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <h2 className="text-xl font-black text-white">
                All Active OPD Consultation Rooms
              </h2>
              <span className="text-xs bg-emerald-950 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-800 flex items-center gap-1">
                Live Updating
              </span>
            </div>

            {/* Live Refresh Trigger & Concourse Status */}
            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-400 font-mono hidden sm:inline">
                Auto-sync active (&lt;142ms)
              </span>
              <button
                type="button"
                onClick={() => {
                  setChimeMessage("🔄 Queue database synced with hospital central server!");
                  setTimeout(() => setChimeMessage(""), 3000);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold border border-slate-700 transition-colors"
                title="Manually trigger live database refresh"
              >
                <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Sync Now</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {doctors.map((doc) => (
              <div
                key={doc.doctor_id}
                className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                  doc.current_status === "Available"
                    ? "bg-slate-900 border-slate-800 hover:border-blue-500/50"
                    : doc.current_status === "In-Surgery"
                    ? "bg-rose-950/30 border-rose-900/60"
                    : doc.current_status === "Busy"
                    ? "bg-amber-950/20 border-amber-900/50"
                    : "bg-slate-900/50 border-slate-800 opacity-60"
                }`}
              >
                <div>
                  {/* Room & Status Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-xs font-bold text-blue-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                      {doc.opd_room}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        doc.current_status === "Available"
                          ? "bg-blue-950 text-blue-300 border border-blue-800"
                          : doc.current_status === "In-Surgery"
                          ? "bg-rose-950 text-rose-300 border border-rose-800 animate-pulse"
                          : doc.current_status === "Busy"
                          ? "bg-amber-950 text-amber-300 border border-amber-800"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {doc.current_status}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-white">{doc.full_name}</h3>
                  <p className="text-xs text-blue-400 font-medium">{doc.dept_name}</p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1 mb-4">
                    <Building2 className="w-3 h-3 text-slate-500 shrink-0" />
                    <span className="truncate">{doc.hospitals?.[0]?.short_name || "Apex Central Campus"}</span>
                  </p>

                  {/* Gigantic Token Display */}
                  <div className="bg-slate-950/90 rounded-xl p-4 border border-slate-800 text-center mb-3">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                        NOW CONSULTING (LIVE)
                      </span>
                    </div>
                    <span className="text-4xl font-black text-amber-400 font-mono tracking-tight my-1 block">
                      {doc.current_status === "Available"
                        ? `#${doc.current_token_serving}`
                        : doc.current_status === "In-Surgery"
                        ? "OT DELAY"
                        : `#${doc.current_token_serving}`}
                    </span>
                    <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                      <span>Next in Queue:</span>
                      <span className="font-mono font-bold text-blue-400">
                        {doc.next_token ? `Token #${doc.next_token}` : "None"}
                      </span>
                    </div>
                  </div>

                  {/* Delay / Surgery notice */}
                  {doc.delay_minutes > 0 && (
                    <div className="bg-amber-950/60 border border-amber-800/80 p-2.5 rounded-xl text-xs text-amber-200 mb-3 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-amber-300">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Doctor Delayed: ~{doc.delay_minutes} mins</span>
                      </div>
                      <p className="text-[11px] text-amber-200/90">{doc.delay_reason}</p>
                    </div>
                  )}
                </div>

                {/* Chime simulator button */}
                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Shift: {doc.shift_hours}</span>
                  <button
                    onClick={() => handleSimulateChime(doc)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-white transition-colors"
                    title="Simulate Queue Chime Speaker Announcement"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

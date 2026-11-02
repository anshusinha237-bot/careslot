"use client";

import React, { useState } from "react";
import {
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  Star,
  CheckCircle2,
  Stethoscope,
  ChevronRight,
  ShieldCheck,
  Award,
  RefreshCw,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function DoctorCard({ doctor, onBook }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState("Just now");

  const handleManualRefresh = (e) => {
    e.stopPropagation();
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshed("Just now");
    }, 600);
  };

  // High-contrast, solid color-coded status chips (Requirement 1)
  const getStatusBadge = (status) => {
    switch (status) {
      case "Available":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            <span>Available Now</span>
          </span>
        );
      case "Busy":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-white shadow-xs animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span>Busy In OPD</span>
          </span>
        );
      case "In-Surgery":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white shadow-xs animate-pulse">
            <AlertCircle className="w-3.5 h-3.5 text-white stroke-[2.5]" />
            <span>In Emergency Surgery</span>
          </span>
        );
      case "On-Leave":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-slate-700 text-white shadow-xs">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            <span>On Leave Today</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-800">
            {status}
          </span>
        );
    }
  };

  const isAvailable = doctor.current_status === "Available" || doctor.current_status === "Busy";

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300 overflow-hidden flex flex-col justify-between group relative">
      {/* Top Accent Strip */}
      <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500" />

      <div>
        {/* Main Card Content */}
        <div className="p-6 pb-4">
          {/* Header Row: Doctor Avatar, Name & Solid Status Badge */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-md ring-4 ring-blue-50 group-hover:scale-105 transition-all duration-300 shrink-0">
                {doctor.full_name
                  .split(" ")
                  .filter((n) => !n.startsWith("Dr."))
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("") || "DR"}
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-lg group-hover:text-blue-700 transition-colors leading-tight">
                  {doctor.full_name}
                </h3>
                <p className="text-xs font-black text-blue-700 uppercase tracking-wider mt-0.5">
                  {doctor.dept_name}
                </p>
              </div>
            </div>
            {getStatusBadge(doctor.current_status)}
          </div>

          {/* Secondary Info with IMPROVED CONTRAST (Requirement 1) */}
          <div className="text-xs space-y-1.5 mb-4">
            {/* Bold high-contrast qualification */}
            <p className="font-bold text-slate-900 text-[13px] tracking-tight">
              {doctor.qualification}
            </p>
            {/* High-readability description */}
            <p className="text-slate-700 font-medium line-clamp-2 leading-relaxed">
              {doctor.bio}
            </p>
          </div>

          {/* High Contrast Badges: Room, Experience & Rating */}
          <div className="flex flex-wrap items-center gap-2 text-xs mb-4">
            {/* High contrast OPD Room Pill */}
            <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-950 px-3 py-1 rounded-xl font-bold border border-blue-200/90 shadow-2xs">
              <MapPin className="w-3.5 h-3.5 text-blue-700 shrink-0" />
              <span>{doctor.opd_room}</span>
            </span>

            {/* High contrast Experience badge */}
            <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-900 px-3 py-1 rounded-xl font-bold border border-slate-300/80 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{doctor.experience} Experience</span>
            </span>

            {/* High contrast Rating badge */}
            <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-950 px-2.5 py-1 rounded-xl font-black border border-amber-300 shadow-2xs">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{doctor.rating}</span>
              <span className="text-slate-500 font-normal">({doctor.reviews_count})</span>
            </span>
          </div>

          {/* Emergency Delay Notice if active */}
          {doctor.delay_minutes > 0 && (
            <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-xs text-amber-950 flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-black text-amber-900">
                  Emergency Delay Notice (~{doctor.delay_minutes} mins):{" "}
                </span>
                <span className="font-semibold text-amber-900/90">
                  {doctor.delay_reason || "Attending urgent procedural case in OT."}
                </span>
              </div>
            </div>
          )}

          {/* Available Slots Preview Bar directly on Card */}
          {doctor.available_slots && doctor.available_slots.length > 0 && (
            <div className="mb-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  Available Slots Today:
                </span>
                <button
                  type="button"
                  onClick={() => setShowFullSchedule(!showFullSchedule)}
                  className="text-[11px] font-bold text-blue-700 hover:text-blue-800 flex items-center gap-0.5"
                >
                  <span>{showFullSchedule ? "Hide Schedule" : "View All"}</span>
                  {showFullSchedule ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {(showFullSchedule
                  ? doctor.available_slots
                  : doctor.available_slots.slice(0, 4)
                ).map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    disabled={!isAvailable}
                    onClick={() => onBook(doctor, slot)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-800 border border-slate-200 transition-colors cursor-pointer"
                    title={`Click to book slot at ${slot}`}
                  >
                    {slot}
                  </button>
                ))}
                {!showFullSchedule && doctor.available_slots.length > 4 && (
                  <span
                    onClick={() => setShowFullSchedule(true)}
                    className="px-2 py-1 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-600 cursor-pointer hover:bg-slate-200"
                  >
                    +{doctor.available_slots.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Live Token Status Box with LIVE REFRESH INDICATOR (Requirement 3) */}
        <div className="bg-gradient-to-r from-slate-50 to-blue-50/40 border-t border-b border-slate-200 px-6 py-3">
          <div className="flex items-center justify-between text-xs">
            {/* Left: Current Serving Token + Live Pulse */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
              </span>
              <span className="text-slate-700 font-bold">Now Serving:</span>
              <span className="font-black font-mono text-blue-900 bg-white px-2.5 py-0.5 rounded-lg border border-slate-300 shadow-2xs">
                {doctor.current_status === "Available"
                  ? `Token #${doctor.current_token_serving}`
                  : doctor.current_status === "Busy"
                  ? `Token #${doctor.current_token_serving} (In-Room)`
                  : doctor.current_status}
              </span>
            </div>

            {/* Right: Manual Refresh & Shift Hours */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleManualRefresh}
                className="flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-blue-700 bg-white px-2 py-0.5 rounded-md border border-slate-200 transition-colors"
                title="Refresh real-time token status"
              >
                <RefreshCw
                  className={`w-3 h-3 text-blue-600 ${isRefreshing ? "animate-spin" : ""}`}
                />
                <span className="hidden sm:inline">Live Sync</span>
              </button>
              <div className="flex items-center gap-1 text-slate-700 font-bold">
                <Clock className="w-3.5 h-3.5 text-blue-700" />
                <span>{doctor.shift_hours}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prominent Direct Action Buttons (Requirement 1) */}
      <div className="p-6 pt-4 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Fee Column */}
        <div>
          <span className="text-[10px] uppercase font-black text-slate-500 block tracking-wider">
            Consultation Fee
          </span>
          <span className="text-2xl font-black text-slate-900 font-mono">
            ₹{doctor.consultation_fee.toFixed(0)}
          </span>
        </div>

        {/* Action Buttons Group */}
        <div className="flex items-center gap-2">
          {/* View Schedule Button */}
          <button
            type="button"
            onClick={() => setShowFullSchedule(!showFullSchedule)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-colors"
          >
            <Clock className="w-3.5 h-3.5 text-slate-600" />
            <span>{showFullSchedule ? "Close" : "Schedule"}</span>
          </button>

          {/* Prominent Direct "Book Appointment" Button */}
          <button
            type="button"
            onClick={() => onBook(doctor)}
            disabled={doctor.current_status === "On-Leave"}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all shadow-md active:scale-95 ${
              doctor.current_status === "On-Leave"
                ? "bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300 shadow-none"
                : "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white hover:from-blue-700 hover:to-indigo-700 shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-600/35"
            }`}
          >
            <Calendar className="w-4 h-4 stroke-[2.5]" />
            <span>{doctor.current_status === "On-Leave" ? "On Leave" : "Book Appointment"}</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

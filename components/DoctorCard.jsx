"use client";

import React from "react";
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
} from "lucide-react";

export default function DoctorCard({ doctor, onBook }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "Available":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/90 shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Available Now
          </span>
        );
      case "Busy":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/90 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            In Consultation
          </span>
        );
      case "In-Surgery":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/90 shadow-2xs animate-pulse">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            In Emergency Surgery
          </span>
        );
      case "On-Leave":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            On Leave Today
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between group relative">
      {/* Top subtle color highlight line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-600"></div>

      <div>
        {/* Main Content */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-teal-500/20 border border-teal-200/70 text-teal-700 flex items-center justify-center font-black text-lg shadow-2xs group-hover:scale-105 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                {doctor.full_name
                  .split(" ")
                  .filter((n) => !n.startsWith("Dr."))
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("") || "DR"}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base group-hover:text-teal-600 transition-colors leading-tight">
                  {doctor.full_name}
                </h3>
                <p className="text-xs font-bold text-teal-600 mt-0.5">{doctor.dept_name}</p>
              </div>
            </div>
            {getStatusBadge(doctor.current_status)}
          </div>

          <div className="text-xs text-slate-600 space-y-1.5 mb-4">
            <p className="font-semibold text-slate-700">{doctor.qualification}</p>
            <p className="text-slate-500 line-clamp-2 leading-relaxed">{doctor.bio}</p>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 bg-slate-50 text-slate-700 px-2.5 py-1 rounded-xl font-medium border border-slate-200/70">
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              {doctor.opd_room}
            </span>
            <span className="inline-flex items-center gap-1 bg-slate-50 text-slate-700 px-2.5 py-1 rounded-xl font-medium border border-slate-200/70">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              {doctor.experience} Exp
            </span>
            <span className="inline-flex items-center gap-1 bg-amber-50/90 text-amber-800 px-2.5 py-1 rounded-xl font-bold border border-amber-200/70">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {doctor.rating} ({doctor.reviews_count})
            </span>
          </div>

          {/* Delay notification */}
          {doctor.delay_minutes > 0 && (
            <div className="mt-4 p-3 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-800">
                  Delay Notice (~{doctor.delay_minutes} mins):{" "}
                </span>
                <span className="text-amber-800/90">{doctor.delay_reason || "Handling emergency OT procedure."}</span>
              </div>
            </div>
          )}
        </div>

        {/* Live Token Status Box */}
        <div className="bg-gradient-to-b from-slate-50 to-slate-50/60 border-t border-b border-slate-100 px-6 py-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Serving:</span>
              <span className="font-bold font-mono text-slate-900 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
                {doctor.current_status === "Available"
                  ? `Token #${doctor.current_token_serving}`
                  : doctor.current_status}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              <span>Shift: {doctor.shift_hours}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Booking Actions */}
      <div className="p-6 pt-4 flex items-center justify-between gap-3 bg-white">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Consultation Fee
          </span>
          <span className="text-xl font-black text-slate-900">
            ₹{doctor.consultation_fee.toFixed(0)}
          </span>
        </div>

        <button
          onClick={() => onBook(doctor)}
          disabled={doctor.current_status === "On-Leave"}
          className={`flex items-center gap-1.5 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-sm ${
            doctor.current_status === "On-Leave"
              ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
              : "bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:from-teal-700 hover:to-emerald-700 hover:shadow-md hover:shadow-teal-500/20 active:scale-95"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{doctor.current_status === "On-Leave" ? "On Leave" : "Book Slot"}</span>
          <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}

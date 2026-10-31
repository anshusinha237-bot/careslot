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
} from "lucide-react";

export default function DoctorCard({ doctor, onBook }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "Available":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Available Now
          </span>
        );
      case "Busy":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            In Consultation
          </span>
        );
      case "In-Surgery":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            In Emergency Surgery
          </span>
        );
      case "On-Leave":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-300">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            On Leave Today
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group">
      <div>
        {/* Top Header */}
        <div className="p-5 pb-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-teal-50 to-teal-100 border border-teal-200 text-teal-700 flex items-center justify-center font-bold text-lg shadow-xs group-hover:scale-105 transition-transform">
                {doctor.full_name
                  .split(" ")
                  .filter((n) => !n.startsWith("Dr."))
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("") || "DR"}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors leading-tight">
                  {doctor.full_name}
                </h3>
                <p className="text-xs font-semibold text-teal-600">{doctor.dept_name}</p>
              </div>
            </div>
            {getStatusBadge(doctor.current_status)}
          </div>

          <div className="text-xs text-slate-600 space-y-1 mb-3">
            <p className="font-medium text-slate-700">{doctor.qualification}</p>
            <p className="text-slate-500 line-clamp-2">{doctor.bio}</p>
          </div>

          {/* OPD Room & Experience Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium">
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              {doctor.opd_room}
            </span>
            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              {doctor.experience} Exp
            </span>
            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-1 rounded-md font-medium border border-amber-100">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {doctor.rating} ({doctor.reviews_count})
            </span>
          </div>

          {/* Emergency delay alert banner if doctor is delayed */}
          {doctor.delay_minutes > 0 && (
            <div className="mt-3.5 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-800">
                  Delay Notice (~{doctor.delay_minutes} mins):{" "}
                </span>
                <span>{doctor.delay_reason || "Doctor handling emergency procedure."}</span>
              </div>
            </div>
          )}
        </div>

        {/* Live Token Status Box */}
        <div className="bg-slate-50/90 border-t border-b border-slate-100 px-5 py-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Current Queue:</span>
              <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                {doctor.current_status === "Available"
                  ? `Token #${doctor.current_token_serving}`
                  : doctor.current_status}
              </span>
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Shift: {doctor.shift_hours}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Booking Actions */}
      <div className="p-5 pt-3.5 flex items-center justify-between gap-3 bg-white">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Consultation Fee
          </span>
          <span className="text-lg font-bold text-slate-900">
            ₹{doctor.consultation_fee.toFixed(0)}
          </span>
        </div>

        <button
          onClick={() => onBook(doctor)}
          disabled={doctor.current_status === "On-Leave"}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-xs ${
            doctor.current_status === "On-Leave"
              ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
              : "bg-teal-600 text-white hover:bg-teal-700 hover:shadow-teal-500/20 shadow-sm"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{doctor.current_status === "On-Leave" ? "Unavailable" : "Book Slot"}</span>
          <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </button>
      </div>
    </div>
  );
}

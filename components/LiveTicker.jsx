"use client";

import React from "react";
import { useApp } from "../context/AppContext";
import { AlertCircle, Clock, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function LiveTicker() {
  const { doctors } = useApp();

  const delayedDoctors = doctors.filter((d) => d.delay_minutes > 0);
  const activeDoctors = doctors.filter((d) => d.current_status === "Available");

  return (
    <div className="bg-slate-900 text-slate-100 text-xs py-2 px-4 border-b border-slate-800 flex items-center justify-between overflow-hidden">
      <div className="flex items-center gap-2 shrink-0 pr-4 border-r border-slate-700">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
        </span>
        <span className="font-semibold uppercase tracking-wider text-teal-400">
          Live OPD Stream:
        </span>
      </div>

      <div className="overflow-x-auto whitespace-nowrap flex items-center gap-6 py-0.5 scrollbar-none text-slate-300">
        {delayedDoctors.length > 0 && (
          <div className="flex items-center gap-1.5 text-amber-300 bg-amber-950/60 border border-amber-800/60 px-2.5 py-0.5 rounded-full font-medium">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              Emergency Notice: {delayedDoctors[0].full_name} ({delayedDoctors[0].dept_name}) delayed by ~{delayedDoctors[0].delay_minutes}m ({delayedDoctors[0].delay_reason || "Emergency duty"})
            </span>
          </div>
        )}

        {doctors.slice(0, 4).map((doc) => (
          <div key={doc.doctor_id} className="flex items-center gap-1.5 shrink-0">
            <span className="text-slate-400">{doc.opd_room}:</span>
            <span className="text-white font-medium">{doc.full_name}</span>
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                doc.current_status === "Available"
                  ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                  : doc.current_status === "In-Surgery"
                  ? "bg-rose-950 text-rose-300 border border-rose-800"
                  : doc.current_status === "Busy"
                  ? "bg-amber-950 text-amber-300 border border-amber-800"
                  : "bg-slate-800 text-slate-400 border border-slate-700"
              }`}
            >
              {doc.current_status === "Available"
                ? `Serving #${doc.current_token_serving}`
                : doc.current_status}
            </span>
          </div>
        ))}
      </div>

      <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-700 shrink-0 text-slate-400">
        <Clock className="w-3.5 h-3.5 text-teal-400" />
        <span>OPD Hours: 08:30 AM – 06:30 PM</span>
        <Link
          href="/queue"
          className="text-teal-400 hover:text-teal-300 ml-2 inline-flex items-center gap-0.5 hover:underline"
        >
          OPD Screen <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

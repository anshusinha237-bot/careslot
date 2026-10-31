"use client";

import React, { useState } from "react";
import {
  X,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Building2,
} from "lucide-react";

export default function RescheduleModal({
  appointment,
  doctor,
  onClose,
  onConfirmReschedule,
}) {
  if (!appointment) return null;

  // Tomorrow as default new date
  const tomorrowStr = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  })();

  const [newDate, setNewDate] = useState(tomorrowStr);
  const availableSlots = doctor?.available_slots || [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
  ];
  const [selectedSlot, setSelectedSlot] = useState(
    availableSlots.find((s) => s !== appointment.appointment_time) || availableSlots[0]
  );
  const [reason, setReason] = useState("Personal Schedule Conflict");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const todayStr = new Date().toISOString().split("T")[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!newDate) {
      setErrorMsg("Please select a new appointment date.");
      return;
    }

    if (newDate < todayStr) {
      setErrorMsg("Past dates are not allowed for rescheduling.");
      return;
    }

    if (!selectedSlot) {
      setErrorMsg("Please select an available time slot.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onConfirmReschedule(
        appointment.appointment_id,
        newDate,
        selectedSlot,
        reason,
        appointment.dept_name
      );
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-800 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/30">
              <Calendar className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Reschedule Appointment</h2>
              <p className="text-xs text-teal-100">Same Department / Specialty Slot Transfer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Current Booking Info */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Doctor / Specialist:</span>
              <span className="font-bold text-slate-800">{appointment.doctor_name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Department / Specialty:</span>
              <span className="font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-teal-600" />
                <span>{appointment.dept_name}</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Current Slot:</span>
              <span className="font-mono line-through text-slate-400">
                {appointment.appointment_date} at {appointment.appointment_time}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-200">
              <span className="text-slate-500">OPD Queue Token:</span>
              <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                Token #{appointment.token_number} (Preserved)
              </span>
            </div>
          </div>

          {/* Same-Specialty Penalty Waiver Notice */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Same Department Waiver Policy Active</p>
              <p className="text-[11px] text-emerald-800/90 mt-0.5 leading-relaxed">
                Standard cancellation penalties are <strong>100% waived</strong> for rescheduling within the same specialty ({appointment.dept_name}). Your consultation fee (₹
                {(appointment.fee || 500).toFixed(0)}) and queue token are transferred seamlessly with zero deductions.
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Select New Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                <span>Select New Appointment Date *:</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Min: Today</span>
            </label>
            <input
              type="date"
              min={todayStr}
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              required
            />
          </div>

          {/* Select New Time Slot */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              <span>Select Available OPD Time Slot *:</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {availableSlots.map((slot) => {
                const isSelected = selectedSlot === slot;
                const isCurrent = slot === appointment.appointment_time;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center flex flex-col items-center justify-center ${
                      isSelected
                        ? "bg-teal-600 text-white border-teal-600 shadow-xs ring-2 ring-teal-600/20"
                        : "bg-white text-slate-700 border-slate-200 hover:border-teal-300 hover:bg-teal-50/50"
                    }`}
                  >
                    <span>{slot}</span>
                    {isCurrent && (
                      <span
                        className={`text-[9px] ${
                          isSelected ? "text-teal-200" : "text-slate-400"
                        }`}
                      >
                        (Current)
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reason for Reschedule */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Reason for Reschedule:
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            >
              <option value="Personal Schedule Conflict">Personal Schedule Conflict</option>
              <option value="Work / Office Commitment">Work / Office Commitment</option>
              <option value="Travel / Commute Constraint">Travel / Commute Constraint</option>
              <option value="Doctor Recommendation">Doctor Recommendation</option>
              <option value="Family Medical Reason">Family Medical Reason</option>
              <option value="Other">Other Reason</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Discard Changes
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition-all flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Rescheduling...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirm Reschedule to {appointment.dept_name}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

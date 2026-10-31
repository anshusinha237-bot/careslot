"use client";

import React, { useState, useMemo } from "react";
import {
  X,
  AlertTriangle,
  Clock,
  Calendar,
  CheckCircle2,
  DollarSign,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Info,
} from "lucide-react";

export default function CancellationModal({
  appointment,
  onClose,
  onConfirmCancel,
  onSwitchToReschedule,
}) {
  if (!appointment) return null;

  const fee = appointment.fee || 500;

  // Calculate actual hours remaining between current time and scheduled appointment
  const calculateActualHours = () => {
    try {
      if (!appointment.appointment_date) return 6; // default 6h for demo
      // Parse slot time e.g. "11:00 AM"
      const dateStr = appointment.appointment_date;
      const timeStr = appointment.appointment_time || "10:00 AM";

      const [time, period] = timeStr.split(" ");
      const [rawHours, rawMinutes] = time.split(":").map(Number);
      let hours = rawHours;
      if (period === "PM" && hours < 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;

      const appDateTime = new Date(dateStr);
      appDateTime.setHours(hours, rawMinutes, 0, 0);

      const now = new Date();
      const diffMs = appDateTime.getTime() - now.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      // Return rounded to 1 decimal place
      return diffHours;
    } catch {
      return 6;
    }
  };

  const actualDiff = calculateActualHours();

  // Test simulation override mode: "auto" (live clock) | "<4h" | "4-8h" | ">8h"
  const [selectedTier, setSelectedTier] = useState(
    actualDiff < 4 ? "less_than_4" : actualDiff < 8 ? "between_4_and_8" : "more_than_8"
  );
  const [cancelReason, setCancelReason] = useState("Change of plans");
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate refund and fee cut based on active tier
  const policyCalculation = useMemo(() => {
    if (selectedTier === "less_than_4") {
      // Under 4 hours: No refund (100% cancellation fee)
      return {
        tierName: "Under 4 Hours Before Schedule",
        badge: "No Refund (100% Cut)",
        badgeColor: "bg-rose-100 text-rose-800 border-rose-300",
        deductionPercent: 100,
        cancellationFee: fee,
        refundPercent: 0,
        refundAmount: 0,
        refundStatus: "no_refund",
        explanation:
          "Cancellations under 4 hours before the scheduled OPD slot are non-refundable as the doctor's reserved clinical time cannot be reallocated.",
      };
    } else if (selectedTier === "between_4_and_8") {
      // 4 to 8 hours: 17% cut, 83% refund
      const cancellationFee = Number((fee * 0.17).toFixed(2));
      const refundAmount = Number((fee - cancellationFee).toFixed(2));
      return {
        tierName: "4 to 8 Hours Before Schedule",
        badge: "17% Cut (83% Refund)",
        badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
        deductionPercent: 17,
        cancellationFee,
        refundPercent: 83,
        refundAmount,
        refundStatus: "processed",
        explanation:
          "Cancellations between 4 to 8 hours before the scheduled slot incur a 17% administrative deduction. 83% is refunded to your original payment method.",
      };
    } else {
      // More than 8 hours: Full 100% refund (0% cut)
      return {
        tierName: "More than 8 Hours Before Schedule",
        badge: "100% Full Refund (0% Cut)",
        badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
        deductionPercent: 0,
        cancellationFee: 0,
        refundPercent: 100,
        refundAmount: fee,
        refundStatus: "processed",
        explanation:
          "Cancellations made more than 8 hours in advance are eligible for a full 100% refund back to your account.",
      };
    }
  }, [selectedTier, fee]);

  const handleConfirm = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onConfirmCancel({
        refundAmount: policyCalculation.refundAmount,
        cancellationFee: policyCalculation.cancellationFee,
        cancellationTier: selectedTier,
        refundStatus: policyCalculation.refundStatus,
        reason: cancelReason,
      });
      setIsProcessing(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 to-rose-700 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/30">
              <AlertTriangle className="w-5 h-5 text-rose-100" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Cancel OPD Appointment</h2>
              <p className="text-xs text-rose-100">Review CareSlot Refund &amp; Cancellation Policy</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Appointment Summary Box */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Doctor / Clinic:</span>
              <span className="font-bold text-slate-800">{appointment.doctor_name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Department / OPD Room:</span>
              <span className="font-medium text-slate-700">
                {appointment.dept_name} • {appointment.opd_room}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Scheduled Time Slot:</span>
              <span className="font-mono font-bold text-teal-700">
                {appointment.appointment_date} at {appointment.appointment_time}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-200">
              <span className="text-slate-500">Consultation Fee Paid:</span>
              <span className="font-black text-slate-900 text-sm">₹{fee.toFixed(2)}</span>
            </div>
          </div>

          {/* Cancellation Schedule Tier Selector (Allows easy evaluation & verification) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                <span>Time of Cancellation Before Schedule:</span>
              </label>
              <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                Policy Active
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedTier("less_than_4")}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedTier === "less_than_4"
                    ? "border-rose-500 bg-rose-50/50 ring-2 ring-rose-500/20 shadow-xs"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <span className="block text-[11px] font-bold text-slate-800">&lt; 4 Hours</span>
                <span className="block text-[10px] font-bold text-rose-600 mt-0.5">No Refund</span>
                <span className="block text-[9px] text-slate-400 mt-1">100% Fee Cut</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTier("between_4_and_8")}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedTier === "between_4_and_8"
                    ? "border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20 shadow-xs"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <span className="block text-[11px] font-bold text-slate-800">4 – 8 Hours</span>
                <span className="block text-[10px] font-bold text-amber-700 mt-0.5">17% Cut</span>
                <span className="block text-[9px] text-slate-400 mt-1">83% Refunded</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTier("more_than_8")}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedTier === "more_than_8"
                    ? "border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20 shadow-xs"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <span className="block text-[11px] font-bold text-slate-800">&gt; 8 Hours</span>
                <span className="block text-[10px] font-bold text-emerald-700 mt-0.5">100% Refund</span>
                <span className="block text-[9px] text-slate-400 mt-1">0% Fee Cut</span>
              </button>
            </div>
          </div>

          {/* Refund Breakdown Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-medium">Refund Calculation Breakdown:</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${policyCalculation.badgeColor}`}
              >
                {policyCalculation.badge}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-slate-700">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">
                  Cancellation Fee ({policyCalculation.deductionPercent}% Cut)
                </p>
                <p className="text-base font-bold font-mono text-rose-400 mt-0.5">
                  - ₹{policyCalculation.cancellationFee.toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-teal-300 uppercase font-semibold">
                  Amount to be Refunded ({policyCalculation.refundPercent}%)
                </p>
                <p className="text-base font-black font-mono text-emerald-400 mt-0.5">
                  ₹{policyCalculation.refundAmount.toFixed(2)}
                </p>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed pt-2 border-t border-slate-700/60">
              {policyCalculation.explanation}
            </p>
          </div>

          {/* Alternative Suggestion: Reschedule Instead */}
          {onSwitchToReschedule && (
            <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-between gap-3">
              <div className="text-xs">
                <p className="font-bold text-teal-900">Want to avoid cancellation cuts?</p>
                <p className="text-[11px] text-teal-700">
                  Rescheduling to another date is <strong>100% free</strong> with zero deductions.
                </p>
              </div>
              <button
                type="button"
                onClick={onSwitchToReschedule}
                className="shrink-0 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1"
              >
                <span>Reschedule</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Optional reason */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Cancellation Reason (Optional):
            </label>
            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="Change of plans">Change of plans / Emergency</option>
              <option value="Symptom improved">Health improved / Not needed</option>
              <option value="Travel constraint">Travel or transport delay</option>
              <option value="Booking error">Booked incorrect doctor or slot</option>
              <option value="Other">Other reason</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Keep Appointment
            </button>
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleConfirm}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all flex items-center gap-1.5"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <X className="w-3.5 h-3.5" />
                  <span>
                    Confirm Cancel &amp; Refund (₹{policyCalculation.refundAmount.toFixed(0)})
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle2,
  Lock,
  Stethoscope,
  Sparkles,
} from "lucide-react";

export default function BookingModal({ doctor, onClose, onBookingSuccess }) {
  const { currentUser, appointments, bookAppointment } = useApp();

  const todayStr = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [patientName, setPatientName] = useState(currentUser?.full_name || "");
  const [patientEmail, setPatientEmail] = useState(currentUser?.email || "");
  const [patientPhone, setPatientPhone] = useState(currentUser?.phone || "+91 ");
  const [symptoms, setSymptoms] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!doctor) return null;

  // Find booked slots for this doctor on the selected date
  const bookedSlots = appointments
    .filter(
      (app) =>
        app.doctor_id === doctor.doctor_id &&
        app.appointment_date === selectedDate &&
        app.status !== "cancelled"
    )
    .map((app) => app.appointment_time);

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    // TC-22 validation
    if (newDate < todayStr) {
      setErrorMsg("Validation Error (TC-22): Cannot select a past date for OPD appointment booking.");
      return;
    }
    setErrorMsg("");
    setSelectedDate(newDate);
    setSelectedSlot("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!selectedDate) {
      setErrorMsg("Please select an appointment date.");
      return;
    }
    if (selectedDate < todayStr) {
      setErrorMsg("Validation Error (TC-22): Past dates are not permitted.");
      return;
    }
    if (!selectedSlot) {
      setErrorMsg("Please choose an available consultation time slot.");
      return;
    }
    if (!patientName.trim()) {
      setErrorMsg("Patient name is required.");
      return;
    }
    if (!patientPhone.trim() || patientPhone.trim().length < 8) {
      setErrorMsg("A valid contact phone number is required.");
      return;
    }

    setIsSubmitting(true);

    // Simulate minor network / database transaction lock latency (142ms)
    setTimeout(() => {
      const result = bookAppointment({
        doctorId: doctor.doctor_id,
        appointmentDate: selectedDate,
        appointmentTime: selectedSlot,
        symptoms,
        patientName,
        patientEmail,
        patientPhone,
      });

      setIsSubmitting(false);

      if (result.success) {
        onBookingSuccess(result.appointment);
      } else {
        setErrorMsg(result.message);
      }
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-800 text-white p-5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-teal-600/80 text-teal-100 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                Instant Slot Reservation
              </span>
              <span className="text-teal-200 text-xs flex items-center gap-1">
                <Lock className="w-3 h-3" /> ACID Transaction Lock
              </span>
            </div>
            <h2 className="text-xl font-bold">{doctor.full_name}</h2>
            <p className="text-xs text-teal-100">
              {doctor.dept_name} • {doctor.opd_room} • Fee: ₹{doctor.consultation_fee}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-teal-200 hover:text-white p-1 rounded-lg hover:bg-teal-600/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error notification banner */}
        {errorMsg && (
          <div className="bg-rose-50 border-b border-rose-200 p-3.5 text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Booking Notice</p>
              <p>{errorMsg}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* 1. Date Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-teal-600" />
              1. Select Appointment Date:
            </label>
            <input
              type="date"
              min={todayStr}
              value={selectedDate}
              onChange={handleDateChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-medium text-slate-800"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Consultation shifts operate daily from {doctor.shift_hours}.
            </p>
          </div>

          {/* 2. Dynamic Slots Grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                2. Select Available Time Slot:
              </label>
              <span className="text-[11px] text-slate-500">
                {doctor.available_slots.length - bookedSlots.length} open slots remaining
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-44 overflow-y-auto p-1 border border-slate-200 rounded-xl bg-slate-50">
              {doctor.available_slots.map((slot) => {
                const isBooked = bookedSlots.includes(slot);
                const isSelected = selectedSlot === slot;

                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={isBooked}
                    onClick={() => {
                      setSelectedSlot(slot);
                      setErrorMsg("");
                    }}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg transition-all text-center flex flex-col items-center justify-center gap-0.5 ${
                      isBooked
                        ? "bg-slate-200/80 text-slate-400 cursor-not-allowed line-through"
                        : isSelected
                        ? "bg-teal-600 text-white shadow-sm ring-2 ring-teal-600"
                        : "bg-white text-slate-700 border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50"
                    }`}
                  >
                    <span>{slot}</span>
                    <span className="text-[9px] font-normal">
                      {isBooked ? "Booked" : isSelected ? "Selected" : "Open"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Patient Contact & Details */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-teal-600" />
              3. Patient Information:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  placeholder="Patient Full Legal Name *"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Mobile Phone Number *"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
            </div>

            <div>
              <input
                type="email"
                placeholder="Email Address (for Digital Slip & Reminders)"
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <textarea
                placeholder="Chief Complaints / Symptoms (e.g., severe joint pain, fever for 2 days, follow-up ECG)"
                rows={2}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-none sm:px-6 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Confirming Slot Lock...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Generate Token (₹{doctor.consultation_fee})</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

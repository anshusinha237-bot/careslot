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
  CreditCard,
  QrCode,
  Building,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Wallet,
  Receipt,
  Check,
} from "lucide-react";

export default function BookingModal({ doctor, onClose, onBookingSuccess }) {
  const { currentUser, appointments, bookAppointment } = useApp();

  const todayStr = new Date().toISOString().split("T")[0];
  const [step, setStep] = useState(1); // 1 = Details, 2 = Payment
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [patientName, setPatientName] = useState(currentUser?.full_name || "");
  const [patientEmail, setPatientEmail] = useState(currentUser?.email || "");
  const [patientPhone, setPatientPhone] = useState(currentUser?.phone || "+91 91234 56789");
  const [symptoms, setSymptoms] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState("upi"); // upi, card, netbanking, counter
  const [upiId, setUpiId] = useState("patient@okhdfcbank");
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8821");
  const [cardExpiry, setCardExpiry] = useState("08/28");
  const [cardCvv, setCardCvv] = useState("321");
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");

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
    if (newDate < todayStr) {
      setErrorMsg("Validation Error (TC-22): Cannot select a past date for OPD appointment booking.");
      return;
    }
    setErrorMsg("");
    setSelectedDate(newDate);
    setSelectedSlot("");
  };

  const validateStep1 = () => {
    setErrorMsg("");

    if (!selectedDate) {
      setErrorMsg("Please select an appointment date.");
      return false;
    }
    if (selectedDate < todayStr) {
      setErrorMsg("Validation Error (TC-22): Past dates are not permitted.");
      return false;
    }
    if (!selectedSlot) {
      setErrorMsg("Please choose an available consultation time slot.");
      return false;
    }
    if (!patientName.trim()) {
      setErrorMsg("Patient legal name is required.");
      return false;
    }
    if (!patientPhone.trim() || patientPhone.trim().length < 8) {
      setErrorMsg("A valid contact phone number is required.");
      return false;
    }

    return true;
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleConfirmAndPay = () => {
    setErrorMsg("");
    setIsSubmitting(true);

    const generatedTxnId = `TXN-CS-${Math.floor(100000 + Math.random() * 900000)}`;
    const paymentStatus = paymentMethod === "counter" ? "pay_at_counter" : "paid";

    // Simulate payment gateway handshake & ACID transaction locking
    setTimeout(() => {
      const result = bookAppointment({
        doctorId: doctor.doctor_id,
        appointmentDate: selectedDate,
        appointmentTime: selectedSlot,
        symptoms,
        patientName,
        patientEmail,
        patientPhone,
        paymentMethod:
          paymentMethod === "upi"
            ? "UPI / QR Code"
            : paymentMethod === "card"
            ? "Credit/Debit Card"
            : paymentMethod === "netbanking"
            ? `Net Banking (${selectedBank})`
            : "Hospital OPD Counter",
        paymentStatus,
        transactionId: generatedTxnId,
      });

      setIsSubmitting(false);

      if (result.success) {
        onBookingSuccess(result.appointment);
      } else {
        setStep(1);
        setErrorMsg(result.message);
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-700 text-white p-5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-white/20 text-teal-100 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                {step === 1 ? "Step 1 of 2: Appointment Details" : "Step 2 of 2: Payment & Token Allocation"}
              </span>
              <span className="text-teal-200 text-xs flex items-center gap-1 font-medium">
                <Lock className="w-3 h-3" /> 256-Bit SSL Secured
              </span>
            </div>
            <h2 className="text-xl font-bold">{doctor.full_name}</h2>
            <p className="text-xs text-teal-100 mt-0.5">
              {doctor.dept_name} • {doctor.opd_room} • Consultation Fee: <strong>₹{doctor.consultation_fee.toFixed(0)}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-teal-200 hover:text-white p-1 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-2 bg-slate-100 text-xs font-bold border-b border-slate-200">
          <div
            className={`py-2 px-4 text-center flex items-center justify-center gap-2 ${
              step === 1 ? "bg-teal-50 text-teal-800 border-b-2 border-teal-600 font-extrabold" : "text-slate-500"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[11px] flex items-center justify-center">1</span>
            <span>Slot &amp; Patient Details</span>
          </div>
          <div
            className={`py-2 px-4 text-center flex items-center justify-center gap-2 ${
              step === 2 ? "bg-teal-50 text-teal-800 border-b-2 border-teal-600 font-extrabold" : "text-slate-400"
            }`}
          >
            <span className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center ${step === 2 ? "bg-teal-600 text-white" : "bg-slate-300 text-slate-600"}`}>2</span>
            <span>Payment Options</span>
          </div>
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

        {/* STEP 1: Details & Slot Picker */}
        {step === 1 && (
          <form onSubmit={handleProceedToPayment} className="p-6 space-y-5">
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-medium text-slate-800 bg-white"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Doctor consultation shift: {doctor.shift_hours}.
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

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-40 overflow-y-auto p-1.5 border border-slate-200 rounded-xl bg-slate-50">
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
                      className={`py-2 px-2 text-xs font-semibold rounded-xl transition-all text-center flex flex-col items-center justify-center gap-0.5 ${
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
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                    required
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Mobile Phone Number *"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email Address (for Digital Slip &amp; Reminders)"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              <div>
                <textarea
                  placeholder="Chief Symptoms / Reason for Consultation (e.g. routine BP check, chest pain, knee swelling)"
                  rows={2}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Actions for Step 1 */}
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
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition-all active:scale-95"
              >
                <span>Proceed to Payment (₹{doctor.consultation_fee.toFixed(0)})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Payment Options */}
        {step === 2 && (
          <div className="p-6 space-y-5">
            {/* Order / Fee Summary Card */}
            <div className="bg-gradient-to-br from-slate-50 to-teal-50/40 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-bold text-slate-800">OPD Consultation Summary:</span>
                <span className="font-bold text-teal-700">{doctor.opd_room}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-600 text-[11px]">
                <div>
                  <span className="text-slate-400 block">Doctor</span>
                  <span className="font-semibold text-slate-800">{doctor.full_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Scheduled Slot</span>
                  <span className="font-semibold text-slate-800">{selectedDate} at {selectedSlot}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Patient</span>
                  <span className="font-semibold text-slate-800">{patientName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Total Payable</span>
                  <span className="font-black text-teal-800 text-sm">₹{doctor.consultation_fee.toFixed(0)}</span>
                </div>
              </div>
            </div>

            {/* Select Payment Method Tabs */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-teal-600" />
                Choose Payment Method:
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                {[
                  { id: "upi", label: "UPI / QR", icon: QrCode },
                  { id: "card", label: "Cards", icon: CreditCard },
                  { id: "netbanking", label: "NetBanking", icon: Building },
                  { id: "counter", label: "Pay at OPD", icon: Receipt },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = paymentMethod === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPaymentMethod(item.id)}
                      className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1 transition-all ${
                        isActive
                          ? "bg-teal-50 border-teal-600 text-teal-800 font-bold shadow-xs ring-1 ring-teal-600"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? "text-teal-600" : "text-slate-500"}`} />
                      <span className="text-xs">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Payment Details Container */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 text-xs">
                {/* 1. UPI Payment Option */}
                {paymentMethod === "upi" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">Scan &amp; Pay via UPI Apps</span>
                        <span className="text-[10px] text-teal-700 bg-teal-100 px-2 py-0.5 rounded font-bold">GPay / PhonePe / Paytm</span>
                      </div>
                      <span className="font-bold text-teal-700">₹{doctor.consultation_fee.toFixed(0)}</span>
                    </div>

                    <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200">
                      {/* Simulated QR Code graphic */}
                      <div className="w-20 h-20 bg-slate-900 rounded-lg p-1.5 flex items-center justify-center shrink-0">
                        <div className="w-full h-full bg-white grid grid-cols-4 gap-0.5 p-1 rounded">
                          <div className="bg-slate-900"></div>
                          <div className="bg-white"></div>
                          <div className="bg-slate-900"></div>
                          <div className="bg-slate-900"></div>
                          <div className="bg-slate-900"></div>
                          <div className="bg-slate-900"></div>
                          <div className="bg-white"></div>
                          <div className="bg-slate-900"></div>
                          <div className="bg-white"></div>
                          <div className="bg-slate-900"></div>
                          <div className="bg-slate-900"></div>
                          <div className="bg-white"></div>
                          <div className="bg-slate-900"></div>
                          <div className="bg-white"></div>
                          <div className="bg-slate-900"></div>
                          <div className="bg-slate-900"></div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-slate-800">CareSlot Healthcare VPA:</p>
                        <p className="font-mono text-[11px] text-teal-700">careslot.opd@hdfcbank</p>
                        <p className="text-[10px] text-slate-400">Scan using Google Pay, PhonePe, or BHIM</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Or enter your UPI ID:
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@okhdfcbank"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                )}

                {/* 2. Credit / Debit Card Option */}
                {paymentMethod === "card" && (
                  <div className="space-y-3">
                    <span className="font-bold text-slate-800 block">Credit / Debit Card Details:</span>
                    <div>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="Card Number (e.g. 4532 8921 0021 8821)"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="CVV"
                        maxLength={4}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Supports Visa, MasterCard, RuPay &amp; Maestro</span>
                    </div>
                  </div>
                )}

                {/* 3. Net Banking Option */}
                {paymentMethod === "netbanking" && (
                  <div className="space-y-3">
                    <span className="font-bold text-slate-800 block">Select Your Bank:</span>
                    <div className="grid grid-cols-2 gap-2">
                      {["HDFC Bank", "State Bank of India", "ICICI Bank", "Axis Bank", "Punjab National Bank"].map((bank) => (
                        <button
                          key={bank}
                          type="button"
                          onClick={() => setSelectedBank(bank)}
                          className={`p-2 rounded-xl border text-left text-xs font-semibold flex items-center justify-between ${
                            selectedBank === bank
                              ? "bg-teal-50 border-teal-600 text-teal-800"
                              : "bg-white border-slate-200 text-slate-700"
                          }`}
                        >
                          <span>{bank}</span>
                          {selectedBank === bank && <Check className="w-3.5 h-3.5 text-teal-600" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Pay at Hospital OPD Counter Option */}
                {paymentMethod === "counter" && (
                  <div className="space-y-2 p-1">
                    <div className="flex items-center gap-2 text-teal-800 font-bold">
                      <Receipt className="w-4 h-4 text-teal-600" />
                      <span>Pay at Hospital OPD Counter on Arrival</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      Your digital token will be reserved immediately. You can settle the consultation fee of <strong>₹{doctor.consultation_fee.toFixed(0)}</strong> in cash or card at the OPD triage desk before entering <strong>{doctor.opd_room}</strong>.
                    </p>
                    <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-amber-900 text-[10px] flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Please arrive 15 minutes before your time slot ({selectedSlot}) for counter verification.</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Security Guarantee & Cancellation Policy */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1 text-teal-700 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>Free Rescheduling Anytime • Transparent Refund Policy</span>
                </span>
                <span>Hospital Reg #DL-MED-2026-904</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Policy: 100% refund (&gt;8h before), 83% refund with 17% cut (4–8h before), no refund (&lt;4h before).
              </p>
            </div>

            {/* Actions for Step 2 */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Details</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmAndPay}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                {isSubmitting ? (
                  <span>Processing Payment &amp; Lock...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {paymentMethod === "counter"
                        ? `Confirm & Pay at Counter (₹${doctor.consultation_fee.toFixed(0)})`
                        : `Pay ₹${doctor.consultation_fee.toFixed(0)} & Generate Token`}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

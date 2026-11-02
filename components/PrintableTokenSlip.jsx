"use client";

import React from "react";
import {
  Printer,
  X,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  FileText,
  Activity,
  QrCode,
} from "lucide-react";
import Link from "next/link";

export default function PrintableTokenSlip({ appointment, onClose }) {
  if (!appointment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Action Header (hidden during print) */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-sm">Appointment Confirmed &amp; Token Allocated</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Slip Content */}
        <div id="printable-slip" className="p-6 bg-white text-slate-800">
          {/* Hospital Header */}
          <div className="text-center border-b-2 border-dashed border-slate-300 pb-4 mb-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Activity className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">
                CareSlot Hospital OPD
              </h1>
            </div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Out-Patient Department (OPD) Consultation Token &amp; Slip
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Sector 12, Health City • Tel: +91 (11) 2658-8500 • Emergency: 108
            </p>
          </div>

          {/* Large Token Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-500 rounded-xl p-4 text-center mb-5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-blue-700 block">
              YOUR QUEUE TOKEN NUMBER
            </span>
            <span className="text-4xl font-black text-blue-900 tracking-tight block my-1">
              TOKEN #{appointment.token_number}
            </span>
            <span className="text-xs font-semibold text-slate-600 block">
              Please watch the digital OPD board for your turn
            </span>
            {appointment.rescheduled && (
              <span className="inline-block mt-2 bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-300">
                Rescheduled to {appointment.appointment_date} ({appointment.appointment_time})
              </span>
            )}
          </div>

          {/* Key Appointment Details */}
          <div className="grid grid-cols-2 gap-3 text-xs mb-4">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Doctor</span>
              <span className="font-bold text-slate-900 text-sm block">
                {appointment.doctor_name}
              </span>
              <span className="text-blue-600 font-medium">{appointment.dept_name}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Location</span>
              <span className="font-bold text-slate-900 text-sm block">
                {appointment.opd_room}
              </span>
              <span className="text-slate-500">Wait in Main Concourse</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Date &amp; Shift</span>
              <span className="font-bold text-slate-900 block flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                {appointment.appointment_date}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Time Slot</span>
              <span className="font-bold text-slate-900 block flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                {appointment.appointment_time}
              </span>
            </div>
          </div>

          {/* Patient Details */}
          <div className="border border-slate-200 rounded-lg p-3 text-xs mb-4 space-y-1.5 bg-white">
            <div className="flex justify-between">
              <span className="text-slate-500">Patient Name:</span>
              <span className="font-bold text-slate-900">{appointment.patient_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Contact Phone:</span>
              <span className="font-mono text-slate-800">{appointment.patient_phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Chief Symptoms:</span>
              <span className="text-slate-800 italic max-w-[260px] truncate text-right">
                {appointment.symptoms}
              </span>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-1.5 items-center">
              <span className="text-slate-500">Consultation Fee:</span>
              <span className="font-bold text-slate-900">₹{appointment.fee?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Payment Status:</span>
              {appointment.payment_status === "paid" ? (
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  PAID ONLINE ({appointment.payment_method || "UPI"})
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded text-[10px] border border-amber-200">
                  DUE AT OPD COUNTER (₹{appointment.fee?.toFixed(0)})
                </span>
              )}
            </div>
            {appointment.transaction_id && (
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction ID:</span>
                <span className="font-mono text-[10px] text-slate-700 font-bold">{appointment.transaction_id}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500">Booking Reference:</span>
              <span className="font-mono text-[10px] text-slate-500">
                CS-OPD-{appointment.appointment_id}
              </span>
            </div>
          </div>

          {/* Simulated Barcode & QR Code */}
          <div className="flex items-center justify-between border-t border-b border-slate-200 py-3 mb-4">
            <div className="flex flex-col items-center">
              {/* CSS simulated barcode lines */}
              <div className="flex items-end gap-1 h-8">
                <span className="w-1.5 h-8 bg-slate-900"></span>
                <span className="w-0.5 h-8 bg-slate-900"></span>
                <span className="w-1 h-8 bg-slate-900"></span>
                <span className="w-2 h-8 bg-slate-900"></span>
                <span className="w-0.5 h-8 bg-slate-900"></span>
                <span className="w-1.5 h-8 bg-slate-900"></span>
                <span className="w-2 h-8 bg-slate-900"></span>
                <span className="w-0.5 h-8 bg-slate-900"></span>
                <span className="w-1.5 h-8 bg-slate-900"></span>
                <span className="w-1 h-8 bg-slate-900"></span>
                <span className="w-2 h-8 bg-slate-900"></span>
                <span className="w-0.5 h-8 bg-slate-900"></span>
                <span className="w-1.5 h-8 bg-slate-900"></span>
              </div>
              <span className="font-mono text-[9px] text-slate-600 mt-1">
                *CS-{appointment.appointment_id}-{appointment.token_number}*
              </span>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded border border-slate-200">
              <div className="w-10 h-10 border-2 border-slate-800 rounded flex items-center justify-center p-0.5 bg-white">
                <div className="w-full h-full bg-slate-800 grid grid-cols-3 gap-0.5 p-0.5">
                  <div className="bg-white"></div>
                  <div className="bg-white"></div>
                  <div className="bg-slate-800"></div>
                  <div className="bg-slate-800"></div>
                  <div className="bg-white"></div>
                  <div className="bg-white"></div>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 leading-tight">
                <p className="font-bold text-slate-700">Digital Token</p>
                <p>Scan at OPD kiosk</p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-[10px] text-slate-500 space-y-1">
            <p className="font-bold text-slate-700 uppercase">Hospital OPD Guidelines:</p>
            <p>1. Please report to {appointment.opd_room} at least 15 minutes before your time.</p>
            <p>2. In case of emergency surgical delays, alerts will reflect on the live screen.</p>
            <p>3. This slip serves as a valid OPD entry pass for the patient & one attendant.</p>
          </div>
        </div>

        {/* Modal Footer (no-print) */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between no-print">
          <Link
            href="/patient"
            onClick={onClose}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            View in My Appointments Dashboard →
          </Link>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs font-bold text-slate-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

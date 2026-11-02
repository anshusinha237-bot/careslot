"use client";

import React from "react";
import { X, User, HeartPulse, History, Pill, FileText, AlertTriangle, ShieldCheck } from "lucide-react";

export default function PatientMedicalHistoryModal({
  patient,
  appointments,
  prescriptions,
  vitals,
  onClose,
}) {
  if (!patient) return null;

  const pastConsultations = (appointments || []).filter(
    (a) =>
      a.patient_id === patient.patient_id ||
      a.patient_email === patient.patient_email ||
      a.patient_name === patient.patient_name
  );

  const patientPrescriptions = (prescriptions || []).filter(
    (p) =>
      p.patient_id === patient.patient_id ||
      p.patient_name === patient.patient_name
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 font-black flex items-center justify-center">
              {patient.patient_name?.charAt(0) || "P"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{patient.patient_name}</h3>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  ID: #{patient.patient_id || "101"}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {patient.patient_phone || "+91 91234 56789"} • {patient.patient_email || "patient@careslot.com"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Vitals Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Blood Group</span>
            <span className="text-lg font-black text-slate-900 mt-0.5 block">{vitals?.blood_group || "O+"}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Resting BP</span>
            <span className="text-lg font-black text-slate-900 mt-0.5 block">{vitals?.bp || "122/78"}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Pulse</span>
            <span className="text-lg font-black text-slate-900 mt-0.5 block">{vitals?.pulse || "72 bpm"}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">SpO2</span>
            <span className="text-lg font-black text-slate-900 mt-0.5 block">{vitals?.spO2 || "99%"}</span>
          </div>
        </div>

        {/* Allergies & Chronic Conditions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Known Drug Allergies:</span>
            </div>
            <p className="text-amber-800">
              {vitals?.allergies?.join(", ") || "Penicillin (Mild), Dust & Pollen"}
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
              <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
              <span>Chronic Medical History:</span>
            </div>
            <p className="text-slate-700">
              {vitals?.chronic_conditions?.join(", ") || "Hypertension (Grade 1 - Controlled)"}
            </p>
          </div>
        </div>

        {/* Prior Consultations */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-blue-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              OPD Encounter History ({pastConsultations.length})
            </h4>
          </div>

          <div className="rounded-2xl border border-slate-200 overflow-hidden max-h-44 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 font-semibold text-[10px] uppercase">
                <tr>
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">Doctor</th>
                  <th className="py-2 px-3">Specialty</th>
                  <th className="py-2 px-3">Symptoms</th>
                  <th className="py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {pastConsultations.map((c) => (
                  <tr key={c.appointment_id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-mono">{c.appointment_date}</td>
                    <td className="py-2 px-3 font-bold">{c.doctor_name}</td>
                    <td className="py-2 px-3 text-blue-600">{c.dept_name}</td>
                    <td className="py-2 px-3 italic truncate max-w-[150px]">{c.symptoms}</td>
                    <td className="py-2 px-3">
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>CareSlot Electronic Medical Record (EMR)</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
          >
            Close EMR
          </button>
        </div>
      </div>
    </div>
  );
}

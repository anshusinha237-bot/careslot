"use client";

import React from "react";
import { X, Printer, Stethoscope, Pill, CheckCircle2, ShieldCheck } from "lucide-react";

export default function PrintablePrescriptionModal({ prescription, onClose }) {
  if (!prescription) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header Actions */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              CareSlot Official E-Prescription
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold border border-blue-200 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Rx</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Prescription Body */}
        <div className="space-y-6 text-slate-800 print:text-black">
          {/* Hospital Masthead */}
          <div className="flex items-start justify-between border-b-2 border-blue-600 pb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-blue-900">
                CareSlot <span className="text-blue-600">Super Speciality Hospital</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                NABH Accredited Tertiary Healthcare &amp; OPD Centre
              </p>
              <p className="text-[11px] text-slate-400">
                Sector 12, Health City, New Delhi - 110029 • Emergency: 108 / 112
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-slate-500 block">
                Rx ID: {prescription.prescription_id}
              </span>
              <span className="text-xs text-slate-600 block mt-0.5">
                Date: <strong>{prescription.date}</strong>
              </span>
            </div>
          </div>

          {/* Doctor & Patient Info Bar */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Consultant Physician
              </span>
              <p className="text-sm font-black text-slate-900 mt-0.5">{prescription.doctor_name}</p>
              <p className="text-blue-600 font-medium">{prescription.dept_name}</p>
              <p className="text-slate-500 text-[11px]">{prescription.qualification || "Super Specialist"}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Patient Details
              </span>
              <p className="text-sm font-black text-slate-900 mt-0.5">{prescription.patient_name}</p>
              <p className="text-slate-600">Patient ID: #CS-PAT-{prescription.patient_id || "101"}</p>
              {prescription.vitals_recorded && (
                <p className="text-[11px] text-slate-500 mt-1 font-mono">{prescription.vitals_recorded}</p>
              )}
            </div>
          </div>

          {/* Clinical Diagnosis */}
          <div className="border-l-4 border-blue-600 pl-3 py-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Provisional / Clinical Diagnosis
            </span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{prescription.diagnosis}</p>
          </div>

          {/* Rx Symbol & Medication Table */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl font-black text-blue-700 font-serif italic">℞</span>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Prescribed Medications
              </span>
            </div>

            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Medicine &amp; Strength</th>
                    <th className="py-2.5 px-3">Dosage</th>
                    <th className="py-2.5 px-3">Frequency</th>
                    <th className="py-2.5 px-3">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {prescription.medicines?.map((med, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono text-slate-400">{idx + 1}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-slate-900 block">{med.name}</span>
                        {med.instructions && (
                          <span className="text-[11px] text-slate-500 italic block">
                            Note: {med.instructions}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-medium">{med.dosage}</td>
                      <td className="py-2.5 px-3 text-blue-700 font-semibold">{med.frequency}</td>
                      <td className="py-2.5 px-3 font-mono">{med.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Clinical Advice & Follow-Up */}
          {prescription.doctor_notes && (
            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950">
              <span className="font-bold uppercase tracking-wider text-[10px] text-blue-700 block mb-1">
                Doctor&apos;s Advice &amp; Lifestyle Instructions:
              </span>
              <p>{prescription.doctor_notes}</p>
            </div>
          )}

          {/* Footer & Signature */}
          <div className="pt-6 border-t border-slate-200 flex items-end justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-400 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Digitally Authenticated by CareSlot HMS Core</span>
            </div>
            <div className="text-right">
              <div className="w-36 border-b border-slate-400 mb-1" />
              <p className="font-bold text-slate-900">{prescription.doctor_name}</p>
              <p className="text-[10px] text-slate-500">Authorized Medical Officer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

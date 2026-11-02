"use client";

import React, { useState } from "react";
import { X, Plus, Trash2, Pill, CheckCircle2, Stethoscope, ShieldCheck } from "lucide-react";

export default function DoctorPrescriptionModal({
  doctor,
  patient,
  onClose,
  onSavePrescription,
}) {
  const [diagnosis, setDiagnosis] = useState("");
  const [vitals, setVitals] = useState("BP: 120/80 mmHg | Pulse: 72 bpm | SpO2: 99%");
  const [doctorNotes, setDoctorNotes] = useState("");
  const [medicines, setMedicines] = useState([
    {
      name: "",
      dosage: "1 Tablet",
      frequency: "Twice Daily (After food)",
      duration: "5 Days",
      instructions: "Take with plain water",
    },
  ]);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAddMedicine = () => {
    setMedicines([
      ...medicines,
      {
        name: "",
        dosage: "1 Tablet",
        frequency: "Once Daily (Morning)",
        duration: "7 Days",
        instructions: "Take after food",
      },
    ]);
  };

  const handleRemoveMedicine = (index) => {
    if (medicines.length === 1) return;
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!diagnosis.trim()) {
      setErrorMsg("Please enter a clinical diagnosis.");
      return;
    }

    const validMedicines = medicines.filter((m) => m.name.trim() !== "");
    if (validMedicines.length === 0) {
      setErrorMsg("Please add at least one medication with a valid name.");
      return;
    }

    const prescriptionData = {
      prescription_id: `RX-2026-${Math.floor(100 + Math.random() * 900)}`,
      doctor_id: doctor.doctor_id,
      doctor_name: doctor.full_name,
      dept_name: doctor.dept_name,
      qualification: doctor.qualification,
      patient_id: patient?.patient_id || 1,
      patient_name: patient?.patient_name || "Amit Kumar",
      date: new Date().toISOString().split("T")[0],
      diagnosis: diagnosis.trim(),
      vitals_recorded: vitals.trim(),
      medicines: validMedicines,
      doctor_notes: doctorNotes.trim() || "Follow medication schedule strictly. Review if symptoms persist.",
      is_active: true,
    };

    onSavePrescription(prescriptionData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Issue Electronic Prescription (E-Rx)
              </h3>
              <p className="text-xs text-slate-500">
                Prescribing for: <strong>{patient?.patient_name || "Amit Kumar"}</strong> (Token #{patient?.token_number || "104"})
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

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Doctor & Patient Info Strip */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Consultant</span>
              <p className="font-bold text-slate-900">{doctor.full_name}</p>
              <p className="text-[11px] text-blue-600">{doctor.dept_name} • {doctor.opd_room}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Patient</span>
              <p className="font-bold text-slate-900">{patient?.patient_name || "Amit Kumar"}</p>
              <p className="text-[11px] text-slate-500">Slot: {patient?.appointment_time || "10:30 AM"}</p>
            </div>
          </div>

          {/* Diagnosis & Recorded Vitals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Clinical Diagnosis <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="e.g. Acute Bronchitis / Hypertension Gr 1"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Recorded Vitals (BP / Pulse / SpO2)
              </label>
              <input
                type="text"
                value={vitals}
                onChange={(e) => setVitals(e.target.value)}
                placeholder="e.g. BP: 120/80 mmHg | Pulse: 72 bpm"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>

          {/* Medicines Dynamic Pad */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
                Prescribed Medications ({medicines.length})
              </label>
              <button
                type="button"
                onClick={handleAddMedicine}
                className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Medicine</span>
              </button>
            </div>

            <div className="space-y-3">
              {medicines.map((med, index) => (
                <div
                  key={index}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[10px] text-slate-400 uppercase">
                      Drug #{index + 1}
                    </span>
                    {medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMedicine(index)}
                        className="text-slate-400 hover:text-rose-600 transition-colors"
                        title="Remove drug"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={med.name}
                      onChange={(e) => handleMedChange(index, "name", e.target.value)}
                      placeholder="Medicine Name (e.g. Tab. Paracetamol 650mg)"
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={med.dosage}
                      onChange={(e) => handleMedChange(index, "dosage", e.target.value)}
                      placeholder="Dosage (e.g. 1 Tab / 10ml / 1 Puff)"
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={med.frequency}
                      onChange={(e) => handleMedChange(index, "frequency", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 text-[11px] text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Once Daily (Morning)">Once Daily (Morning)</option>
                      <option value="Once Daily (Night)">Once Daily (Night)</option>
                      <option value="Twice Daily (After food)">Twice Daily (After food)</option>
                      <option value="Thrice Daily">Thrice Daily</option>
                      <option value="SOS (As needed)">SOS (As needed)</option>
                    </select>

                    <input
                      type="text"
                      value={med.duration}
                      onChange={(e) => handleMedChange(index, "duration", e.target.value)}
                      placeholder="Duration (e.g. 5 Days)"
                      className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 text-[11px] text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                      type="text"
                      value={med.instructions}
                      onChange={(e) => handleMedChange(index, "instructions", e.target.value)}
                      placeholder="Instructions (e.g. after food)"
                      className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 text-[11px] text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Advice / Doctor Notes */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Dietary Advice &amp; Review Instructions
            </label>
            <textarea
              rows={2}
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
              placeholder="e.g. Maintain hydration, avoid spicy food. Review in OPD after 7 days if symptoms persist."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Will attach immediately to patient digital health record</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Issue &amp; Save Prescription</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

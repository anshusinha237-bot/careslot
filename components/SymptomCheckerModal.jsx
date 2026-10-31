"use client";

import React, { useState } from "react";
import {
  X,
  Sparkles,
  Search,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  Stethoscope,
  HeartPulse,
  Brain,
  Baby,
  Bone,
} from "lucide-react";
import { useApp } from "../context/AppContext";

const PRESET_SYMPTOMS = [
  { label: "Chest pain upon exertion", dept: "Cardiology", reason: "Potential angina or coronary artery evaluation." },
  { label: "Throbbing one-sided headache & nausea", dept: "Neurology", reason: "Characteristic migraine or neurological assessment." },
  { label: "Child high fever (101°F) & vomiting", dept: "Pediatrics", reason: "Pediatric infectious illness and hydration review." },
  { label: "Knee swelling & fracture pain", dept: "Orthopedics", reason: "Joint trauma or osteoarthritis investigation." },
  { label: "Red itchy skin rash & hives", dept: "Dermatology", reason: "Allergic dermatitis or urticaria clinical review." },
  { label: "Persistent ear discharge & hearing loss", dept: "ENT (Otolaryngology)", reason: "Otitis media or tympanic membrane assessment." },
  { label: "Antenatal checkup & morning sickness", dept: "Gynecology & Obstetrics", reason: "Obstetric maternal and fetal monitoring." },
  { label: "General fatigue, dry cough & cold", dept: "General Medicine", reason: "Primary internal medicine triage and viral management." },
];

export default function SymptomCheckerModal({ isOpen, onClose, onSelectDoctor }) {
  const { doctors, departments } = useApp();
  const [query, setQuery] = useState("");
  const [recommendation, setRecommendation] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  if (!isOpen) return null;

  const analyzeSymptoms = (input) => {
    const text = (input || query).toLowerCase().trim();
    if (!text) return;

    setAnalyzing(true);
    setRecommendation(null);

    setTimeout(() => {
      let targetDept = "General Medicine";
      let matchedReason = "Your symptoms warrant general internal medicine examination and initial vitals check.";

      if (text.includes("chest") || text.includes("heart") || text.includes("breath") || text.includes("palpitat") || text.includes("bp") || text.includes("blood pressure")) {
        targetDept = "Cardiology";
        matchedReason = "Reported symptoms point toward cardiovascular or coronary evaluation. Immediate ECG / Troponin test recommended.";
      } else if (text.includes("head") || text.includes("migraine") || text.includes("brain") || text.includes("dizz") || text.includes("numb") || text.includes("seiz") || text.includes("spine")) {
        targetDept = "Neurology";
        matchedReason = "Neurological indicators observed. Examination of cranial nerves and central nervous system indicated.";
      } else if (text.includes("child") || text.includes("baby") || text.includes("infant") || text.includes("vaccin") || text.includes("pediatric")) {
        targetDept = "Pediatrics";
        matchedReason = "Child patient parameters require pediatric specialist consultation and age-appropriate dosing.";
      } else if (text.includes("knee") || text.includes("joint") || text.includes("bone") || text.includes("fract") || text.includes("back pain") || text.includes("ortho")) {
        targetDept = "Orthopedics";
        matchedReason = "Musculoskeletal symptoms suggest orthopedic evaluation, digital X-Ray, or joint mobility examination.";
      } else if (text.includes("skin") || text.includes("rash") || text.includes("itch") || text.includes("acne") || text.includes("hair") || text.includes("derma")) {
        targetDept = "Dermatology";
        matchedReason = "Dermatological signs indicate cutaneous inflammation, dermatitis, or allergy flare.";
      } else if (text.includes("ear") || text.includes("nose") || text.includes("throat") || text.includes("sinus") || text.includes("tonsil") || text.includes("ent")) {
        targetDept = "ENT (Otolaryngology)";
        matchedReason = "Upper respiratory, auditory, or pharyngeal complaints require specialized otolaryngology endoscopy.";
      } else if (text.includes("pregnan") || text.includes("period") || text.includes("matern") || text.includes("uter") || text.includes("pcod")) {
        targetDept = "Gynecology & Obstetrics";
        matchedReason = "Obstetric or gynecological consultation indicated for reproductive wellness and ultrasound check.";
      }

      const matchedDoctors = doctors.filter((d) => d.dept_name.toLowerCase().includes(targetDept.toLowerCase()));

      setRecommendation({
        department: targetDept,
        reason: matchedReason,
        doctors: matchedDoctors,
      });

      setAnalyzing(false);
    }, 350);
  };

  const handlePresetClick = (item) => {
    setQuery(item.label);
    analyzeSymptoms(item.label);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 text-white p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded text-indigo-100">
                CareSlot AI Health Assistant
              </span>
              <h2 className="text-xl font-bold">Specialty Triage & Recommender</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Input Box */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Describe your symptoms or medical concern:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g., sharp pain in left chest, severe knee joint swelling..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && analyzeSymptoms(query)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
                />
              </div>
              <button
                onClick={() => analyzeSymptoms(query)}
                disabled={analyzing || !query.trim()}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {analyzing ? "Analyzing..." : "Triage"}
              </button>
            </div>
          </div>

          {/* Quick preset chips */}
          <div>
            <p className="text-[11px] font-semibold text-slate-500 mb-2">
              Or pick a common OPD symptom:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_SYMPTOMS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePresetClick(item)}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 hover:border-indigo-200 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Recommendation Result Card */}
          {recommendation && (
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-white border-2 border-indigo-200 rounded-xl p-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Recommended OPD Department:
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-1">
                {recommendation.department}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {recommendation.reason}
              </p>

              {/* Doctors in this specialty */}
              <div>
                <p className="text-xs font-bold text-slate-700 uppercase mb-2">
                  Available Specialists on Duty:
                </p>
                <div className="space-y-2">
                  {recommendation.doctors.map((doc) => (
                    <div
                      key={doc.doctor_id}
                      className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between gap-3 shadow-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs">
                            {doc.full_name}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                              doc.current_status === "Available"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {doc.current_status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {doc.opd_room} • Fee: ₹{doc.consultation_fee}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          onClose();
                          if (onSelectDoctor) onSelectDoctor(doc);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1 shadow-xs"
                      >
                        <span>Book</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Clinical Disclaimer */}
          <div className="text-[10px] text-slate-400 bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <p>
              Automated clinical recommendation based on hospital OPD triage taxonomy. For life-threatening emergencies, immediately report to the 24x7 Trauma Casualty Ward or dial 108.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

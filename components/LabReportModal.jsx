"use client";

import React from "react";
import { X, Printer, FileText, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

export default function LabReportModal({ report, onClose }) {
  if (!report) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Diagnostic Laboratory Report
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold border border-blue-200 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Report</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 text-slate-800">
          <div className="flex items-start justify-between border-b-2 border-blue-600 pb-4">
            <div>
              <h2 className="text-xl font-black text-blue-900">
                CareSlot <span className="text-blue-600">Central Pathology &amp; Diagnostics</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                NABL Accredited Diagnostic Laboratory • ISO 15189:2022
              </p>
              <p className="text-[11px] text-slate-400">Sector 12, Health City, New Delhi - 110029</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-slate-700 block">
                ID: {report.report_id}
              </span>
              <span className="text-xs text-slate-500 block">Date: {report.reporting_date}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Investigation</span>
              <p className="font-bold text-slate-900 mt-0.5">{report.test_name}</p>
              <p className="text-blue-600">{report.category}</p>
              <p className="text-slate-500 text-[11px] mt-1">Specimen: {report.specimen}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Patient Info</span>
              <p className="font-bold text-slate-900 mt-0.5">{report.patient_name}</p>
              <p className="text-slate-500">Patient ID: #CS-PAT-{report.patient_id || "101"}</p>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {report.overall_status || "Normal"}
                </span>
                <span className="text-[10px] text-slate-400">Status: {report.status}</span>
              </div>
            </div>
          </div>

          {/* Parameters Table */}
          <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-600 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Test Parameter</th>
                  <th className="py-2.5 px-3">Observed Value</th>
                  <th className="py-2.5 px-3">Reference Range</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {report.parameters?.map((param, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{param.parameter}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-700">
                      {param.value} <span className="text-slate-400 font-normal">{param.unit}</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono">{param.reference}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          param.flag === "Normal" || param.flag === "Optimal"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {param.flag}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Impression / Notes */}
          {report.impression && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500 block mb-1">
                Clinical Impression:
              </span>
              <p className="text-slate-700">{report.impression}</p>
            </div>
          )}

          {/* Signoff */}
          <div className="pt-6 border-t border-slate-200 flex items-end justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>NABL Verified Digital Laboratory Report</span>
            </div>
            <div className="text-right">
              <div className="w-36 border-b border-slate-400 mb-1" />
              <p className="font-bold text-slate-900">{report.pathologist}</p>
              <p className="text-[10px] text-slate-500">Consultant Pathologist</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { X, Printer, ShieldCheck, Receipt } from "lucide-react";

export default function PrintableInvoiceModal({ invoice, onClose }) {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header Actions */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              CareSlot Payment Receipt
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold border border-blue-200 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Body */}
        <div className="space-y-6 text-slate-800">
          <div className="flex items-start justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                {invoice.hospital_name || "CareSlot Apex Multi-Specialty Hospital"}
              </h2>
              <p className="text-xs text-slate-500">GSTIN: 07AAAAA0000A1Z5 • {invoice.hospital_branch || "OPD Services"}</p>
              <p className="text-[11px] text-slate-400">{invoice.hospital_address || "Sector 12, Health City, New Delhi - 110029"}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-slate-900 block">
                {invoice.invoice_id}
              </span>
              <span className="text-xs text-slate-500 block">Date: {invoice.date}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Consultation For</span>
              <p className="font-bold text-slate-900 mt-0.5">{invoice.doctor_name}</p>
              <p className="text-blue-600">{invoice.dept_name}</p>
              <p className="text-slate-500 font-mono mt-1">Token #{invoice.token_number}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Payment Details</span>
              <p className="font-bold text-slate-900 mt-0.5">{invoice.payment_mode}</p>
              <p className="text-slate-500 font-mono text-[11px] truncate">Ref: {invoice.transaction_id}</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {invoice.status}
              </span>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
            <table className="w-full">
              <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-semibold">
                <tr>
                  <th className="py-2.5 px-3 text-left">Description</th>
                  <th className="py-2.5 px-3 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2.5 px-3">Specialist OPD Consultation Fee</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold">
                    ₹{invoice.consultation_fee?.toFixed(2)}
                  </td>
                </tr>
                {invoice.facility_charge && (
                  <tr>
                    <td className="py-2.5 px-3">Hospital Facility &amp; Digital Queue Charge</td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      ₹{invoice.facility_charge?.toFixed(2)}
                    </td>
                  </tr>
                )}
                {invoice.refund_amount && (
                  <tr className="bg-amber-50/60 text-amber-900">
                    <td className="py-2.5 px-3">Refund Credited Back</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">
                      - ₹{invoice.refund_amount?.toFixed(2)}
                    </td>
                  </tr>
                )}
                <tr className="bg-slate-50 font-bold text-slate-900">
                  <td className="py-3 px-3 text-sm">Total Paid</td>
                  <td className="py-3 px-3 text-right text-sm text-blue-700 font-mono">
                    ₹{invoice.total_amount?.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Computer generated receipt. No physical signature required.</span>
            </div>
            <span>CareSlot HMS Core</span>
          </div>
        </div>
      </div>
    </div>
  );
}

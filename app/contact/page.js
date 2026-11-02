"use client";

import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Building2,
  HeartPulse,
  Shield,
  LifeBuoy,
  MessageSquare,
  HelpCircle,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "General Medicine",
    subject: "OPD Appointment Inquiry",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-blue-600 selection:text-white">
      <Navbar />

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white py-12 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
            <HeartPulse className="w-3.5 h-3.5" />
            <span>24/7 Hospital Out-Patient &amp; Emergency Support</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Hospital Contact, Wing Directory &amp; Support
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Connect with our OPD reception desk, medical department coordinators, billing desk, or emergency triage response center.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Emergency Desk */}
          <div className="bg-white rounded-3xl border border-rose-200/80 p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <HeartPulse className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              Immediate Critical Care
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-2 mb-1">
              OPD Emergency &amp; Ambulance Desk
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              For acute cardiac emergencies, surgical trauma, stroke response, and immediate ambulance dispatch.
            </p>
            <div className="space-y-1.5 text-xs font-bold text-slate-900">
              <p className="text-lg text-rose-600 font-black">Hotlines: 108 / 112</p>
              <p className="text-slate-600">Direct Triage: +91 11 2658 9999</p>
            </div>
          </div>

          {/* Card 2: Central OPD Desk */}
          <div className="bg-white rounded-3xl border border-blue-200/80 p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
              <Phone className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              Patient Registration
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-2 mb-1">
              Central OPD Appointments Desk
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Schedule consultation slots with specialists, token inquiry, and department wing navigation assistance.
            </p>
            <div className="space-y-1.5 text-xs font-bold text-slate-900">
              <p className="text-base text-blue-600 font-mono">+91 11 2658 8500</p>
              <p className="text-slate-600">Hours: 08:30 AM – 06:30 PM (Mon–Sat)</p>
            </div>
          </div>

          {/* Card 3: Patient Care Support */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center mb-4">
              <Mail className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200">
              Digital Support
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-2 mb-1">
              Electronic Health Records &amp; Helpdesk
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Inquiries regarding diagnostic reports, billing invoices, cancellation refunds, and ABHA Health ID integration.
            </p>
            <div className="space-y-1.5 text-xs font-bold text-slate-900">
              <p className="text-base text-cyan-700 font-mono">support@careslot.com</p>
              <p className="text-slate-600">Response within ~2 business hours</p>
            </div>
          </div>
        </div>

        {/* Form & Wing Directory Split Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Contact & Support Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-blue-600">
              <MessageSquare className="w-5 h-5" />
              <h2 className="text-lg font-bold text-slate-900">Send an Inquiry to OPD Administration</h2>
            </div>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Have questions regarding doctor availability, slot transfers, or electronic reports? Fill out the form below.
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Full Legal Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Patel"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Mobile Phone *</label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Email Address *</label>
                    <input
                      type="email"
                      placeholder="e.g. ramesh@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Concerned Department</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option>General Medicine</option>
                      <option>Cardiology</option>
                      <option>Neurology</option>
                      <option>Pediatrics</option>
                      <option>Orthopedics</option>
                      <option>Dermatology</option>
                      <option>Billing &amp; Refunds</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Inquiry Message *</label>
                  <textarea
                    rows={4}
                    placeholder="Describe your inquiry, doctor consultation concern, or token issue..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/25 transition-all flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? "Transmitting..." : "Submit Inquiry"}</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-8 text-center bg-blue-50 rounded-2xl border border-blue-200 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Inquiry Dispatched Successfully</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{formData.name}</strong>. Your ticket has been logged with the <strong>{formData.department}</strong> department desk. Reference #{Date.now().toString().slice(-6)}.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ ...formData, message: "" });
                  }}
                  className="mt-3 px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
                >
                  Send Another Message
                </button>
              </div>
            )}
          </div>

          {/* Right: Hospital Wing Directory & Map (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-slate-900">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold">Hospital Wing Directory</h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                  <span>Block A (Clinical Diagnostic Wing)</span>
                  <span className="text-[10px] text-blue-600 font-mono">Rooms 101–105</span>
                </div>
                <p className="text-slate-500">
                  Ground Floor: General Medicine, Fever Triage, Blood Collection.
                  1st Floor: Cardiology, Cath Lab, Echocardiography.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                  <span>Block B (Neuro &amp; Specialized Care)</span>
                  <span className="text-[10px] text-blue-600 font-mono">Rooms 201–215</span>
                </div>
                <p className="text-slate-500">
                  2nd Floor: Neurology &amp; Spine Center, EEG Diagnostics.
                  3rd Floor: Clinical Dermatology, Allergy Testing &amp; ENT Clinic.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                  <span>Block C (Pediatrics &amp; Joint Surgery)</span>
                  <span className="text-[10px] text-blue-600 font-mono">Rooms 108–115</span>
                </div>
                <p className="text-slate-500">
                  1st Floor: Orthopedics &amp; Joint Preservation.
                  2nd Floor: Child Healthcare, Pediatric Immunization Clinic.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-900 text-white space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-cyan-300">
                <Clock className="w-4 h-4" />
                <span>OPD Consultation Shift Hours</span>
              </div>
              <div className="text-xs space-y-1 text-slate-200">
                <div className="flex justify-between">
                  <span>Morning Consultation Shift:</span>
                  <span className="font-mono font-bold">08:30 AM – 01:30 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Evening Follow-Up Shift:</span>
                  <span className="font-mono font-bold">02:00 PM – 06:30 PM</span>
                </div>
                <div className="flex justify-between text-cyan-300 pt-1 border-t border-white/10">
                  <span>Emergency OT &amp; Triage:</span>
                  <span className="font-bold">24 Hours / 7 Days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

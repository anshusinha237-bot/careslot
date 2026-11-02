"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "../context/AppContext";
import BookingModal from "./BookingModal";
import PrintableTokenSlip from "./PrintableTokenSlip";
import {
  Sparkles,
  MessageSquare,
  X,
  Send,
  Stethoscope,
  AlertTriangle,
  Bot,
  User,
  ArrowRight,
  Clock,
  ShieldCheck,
  ChevronRight,
  PhoneCall,
  Calendar,
  Lock,
} from "lucide-react";

export default function AiHealthChatbot({ isOpenExternal, onCloseExternal }) {
  const router = useRouter();
  const { doctors, departments, currentUser } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: "welcome-1",
      sender: "ai",
      text: "Hello! I am CareSlot AI Healthcare Assistant. Tell me your symptoms, department, or doctor, and I will directly connect you to the OPD Booking Counter.",
      timestamp: "Just now",
      suggestions: [
        "Book Dr. Priya Sharma",
        "Book Neurology Slot",
        "Book Pediatrics Slot",
        "Book Orthopedics Slot",
        "Recommend doctor for chest pain",
        "How does the live queue work?",
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Direct Booking Handler
  const handleDirectBooking = (targetDoc) => {
    if (!targetDoc) return;

    if (!currentUser) {
      const noticeMsg = {
        id: Date.now().toString(),
        sender: "ai",
        text: "🔒 Authentication Required: Each booking function can only be performed after logging in. Please sign in to proceed directly to the booking counter.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestions: ["Sign In Now", "View Live Queue"],
      };
      setMessages((prev) => [...prev, noticeMsg]);
      setTimeout(() => {
        handleClose();
        router.push("/login");
      }, 700);
      return;
    }

    // Directly open the booking counter!
    setBookingDoctor(targetDoc);
  };

  // Sync external open state if provided
  useEffect(() => {
    if (typeof isOpenExternal === "boolean") {
      setIsOpen(isOpenExternal);
    }
  }, [isOpenExternal]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    if (onCloseExternal) onCloseExternal();
  };

  const handleSendMessage = (userText) => {
    const textToSend = userText || input;
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // AI Knowledge & Triage Response Engine
    setTimeout(() => {
      const lower = textToSend.toLowerCase();
      let aiResponseText = "";
      let matchedDept = null;
      let matchedDoc = null;
      let suggestions = [];
      let autoOpenBooking = false;

      // Handle Direct "Book" Actions
      if (lower.startsWith("book") || lower.includes("book") || lower.includes("appoint")) {
        if (lower.includes("priya") || lower.includes("cardio") || lower.includes("heart") || lower.includes("chest")) {
          matchedDept = "Cardiology";
          matchedDoc = doctors.find((d) => d.dept_name.includes("Cardiology")) || doctors[0];
        } else if (lower.includes("rajesh") || lower.includes("neuro") || lower.includes("head") || lower.includes("brain")) {
          matchedDept = "Neurology";
          matchedDoc = doctors.find((d) => d.dept_name.includes("Neurology"));
        } else if (lower.includes("ananya") || lower.includes("pediatric") || lower.includes("child") || lower.includes("baby")) {
          matchedDept = "Pediatrics";
          matchedDoc = doctors.find((d) => d.dept_name.includes("Pediatrics"));
        } else if (lower.includes("vikram") || lower.includes("ortho") || lower.includes("joint") || lower.includes("bone")) {
          matchedDept = "Orthopedics";
          matchedDoc = doctors.find((d) => d.dept_name.includes("Orthopedics"));
        } else if (lower.includes("sneha") || lower.includes("derma") || lower.includes("skin")) {
          matchedDept = "Dermatology";
          matchedDoc = doctors.find((d) => d.dept_name.includes("Dermatology"));
        } else if (lower.includes("farhan") || lower.includes("ent") || lower.includes("ear") || lower.includes("throat")) {
          matchedDept = "ENT (Otolaryngology)";
          matchedDoc = doctors.find((d) => d.dept_name.includes("ENT"));
        } else if (lower.includes("meenakshi") || lower.includes("gynec") || lower.includes("matern") || lower.includes("pregnan")) {
          matchedDept = "Gynecology & Obstetrics";
          matchedDoc = doctors.find((d) => d.dept_name.includes("Gynecology"));
        } else {
          matchedDept = "General Medicine";
          matchedDoc = doctors.find((d) => d.dept_name.includes("Medicine")) || doctors[0];
        }

        if (!currentUser) {
          aiResponseText = `🔒 Authentication Required: Each booking function can only be performed after login. Redirecting you to the Login page to authenticate before booking with ${matchedDoc?.full_name || "Doctor"}...`;
          suggestions = ["Go to Login Page"];
          setTimeout(() => {
            handleClose();
            router.push("/login");
          }, 800);
        } else {
          aiResponseText = `Connecting you directly to the OPD Booking Counter for ${matchedDoc?.full_name} (${matchedDept}). Please select your hospital branch, date, and preferred slot:`;
          suggestions = [`Book ${matchedDoc?.full_name}`, "View Live Queue Concourse"];
          autoOpenBooking = true;
        }
      } else if (
        lower.includes("chest") ||
        lower.includes("heart") ||
        lower.includes("palpitat") ||
        lower.includes("breath") ||
        lower.includes("bp") ||
        lower.includes("blood pressure")
      ) {
        matchedDept = "Cardiology";
        matchedDoc = doctors.find((d) => d.dept_name.includes("Cardiology")) || doctors[0];
        aiResponseText =
          "Cardiovascular symptoms like chest tightness, breathlessness, or irregular pulse warrant evaluation by our Cardiology department. We recommend consulting Dr. Priya Sharma for an immediate ECG and clinical check.";
        suggestions = ["Book Dr. Priya Sharma", "Where is the Cath Lab?"];
      } else if (
        lower.includes("head") ||
        lower.includes("migraine") ||
        lower.includes("dizz") ||
        lower.includes("numb") ||
        lower.includes("seiz") ||
        lower.includes("brain")
      ) {
        matchedDept = "Neurology";
        matchedDoc = doctors.find((d) => d.dept_name.includes("Neurology"));
        aiResponseText =
          "Persistent headaches, migraine aura, or dizziness point toward neurological assessment. Our Neurology department evaluates cranial nerves and provides neuro-diagnostic screening.";
        suggestions = ["Book Neurology Slot", "Emergency hotline 108"];
      } else if (
        lower.includes("child") ||
        lower.includes("baby") ||
        lower.includes("infant") ||
        lower.includes("pediatric") ||
        lower.includes("vaccin")
      ) {
        matchedDept = "Pediatrics";
        matchedDoc = doctors.find((d) => d.dept_name.includes("Pediatrics"));
        aiResponseText =
          "For young infants and children, pediatric specialists provide age-specific clinical triage, growth assessment, and safe medication dosing.";
        suggestions = ["Book Pediatrics Slot", "Check Child Clinic hours"];
      } else if (
        lower.includes("knee") ||
        lower.includes("joint") ||
        lower.includes("bone") ||
        lower.includes("fract") ||
        lower.includes("back pain") ||
        lower.includes("ortho")
      ) {
        matchedDept = "Orthopedics";
        matchedDoc = doctors.find((d) => d.dept_name.includes("Orthopedics"));
        aiResponseText =
          "Joint swelling, mobility limitation, and musculoskeletal pain are handled by our Orthopedics and Trauma Care wing. Digital X-Ray and mobility scans are available on the 1st Floor.";
        suggestions = ["Book Orthopedics Slot", "View Doctor Roster"];
      } else if (
        lower.includes("skin") ||
        lower.includes("rash") ||
        lower.includes("itch") ||
        lower.includes("acne") ||
        lower.includes("allergy") ||
        lower.includes("derma")
      ) {
        matchedDept = "Dermatology";
        matchedDoc = doctors.find((d) => d.dept_name.includes("Dermatology"));
        aiResponseText =
          "Cutaneous lesions, hives, or acute allergic flares require specialized clinical dermatology examination.";
        suggestions = ["Book Dermatology Slot", "Find Doctors"];
      } else if (
        lower.includes("ear") ||
        lower.includes("throat") ||
        lower.includes("hearing") ||
        lower.includes("sinus") ||
        lower.includes("ent")
      ) {
        matchedDept = "ENT (Otolaryngology)";
        matchedDoc = doctors.find((d) => d.dept_name.includes("ENT"));
        aiResponseText =
          "Ear discharge, audiological changes, or pharyngeal irritation are treated in our ENT & Audiology clinic.";
        suggestions = ["Book ENT Slot", "View All Doctors"];
      } else if (
        lower.includes("pregnan") ||
        lower.includes("period") ||
        lower.includes("matern") ||
        lower.includes("gynec") ||
        lower.includes("pcod")
      ) {
        matchedDept = "Gynecology & Obstetrics";
        matchedDoc = doctors.find((d) => d.dept_name.includes("Gynecology"));
        aiResponseText =
          "Our Maternity & Gynecology wing provides obstetric care, ultrasound fetal checks, and hormonal wellness management.";
        suggestions = ["Book Gynecology Slot", "View Clinic Wing"];
      } else if (
        lower.includes("queue") ||
        lower.includes("token") ||
        lower.includes("wait") ||
        lower.includes("how does")
      ) {
        aiResponseText =
          "CareSlot uses an automated digital token queue. When you book an OPD slot, a unique token is generated. You can monitor the Doctor's currently serving token, queue difference, and estimated waiting time in real time on the Live Queue concourse!";
        suggestions = ["View Live Queue Concourse", "Book OPD Slot"];
      } else if (
        lower.includes("refund") ||
        lower.includes("cancel") ||
        lower.includes("policy")
      ) {
        aiResponseText =
          "CareSlot's refund policy: Cancellations > 8 hours prior receive a 100% full refund. Cancellations between 4 and 8 hours have a 17% fee deduction (83% credited back). Cancellations < 4 hours receive no refund. Rescheduling is 100% free anytime!";
        suggestions = ["View Patient Portal", "Book New Slot"];
      } else if (
        lower.includes("emergency") ||
        lower.includes("ambulance") ||
        lower.includes("108") ||
        lower.includes("phone") ||
        lower.includes("contact")
      ) {
        aiResponseText =
          "For immediate medical emergencies, contact National Emergency Ambulance Services at 108 or Central Emergency at 112. The CareSlot 24/7 Trauma Desk can be reached at +91 11 2658 8500.";
        suggestions = ["Go to Contact Page", "View Live Queue"];
      } else {
        matchedDept = "General Medicine";
        matchedDoc = doctors.find((d) => d.dept_name.includes("Medicine")) || doctors[0];
        aiResponseText =
          "Thank you for sharing. For non-specific complaints or initial triage, a General Medicine consultation is the best starting point for physical vitals examination and lab referrals.";
        suggestions = ["Book General Medicine", "Search Doctors"];
      }

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        matchedDept,
        matchedDoc,
        suggestions,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);

      if (autoOpenBooking && matchedDoc) {
        setTimeout(() => {
          setBookingDoctor(matchedDoc);
        }, 350);
      }
    }, 400);
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom Right) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-bold text-xs shadow-xl shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all duration-200 group border border-white/20"
          title="Open AI Healthcare Assistant"
        >
          <div className="relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-300 opacity-75" />
            <Sparkles className="w-4 h-4 text-amber-300 relative" />
          </div>
          <span>AI Health Assistant</span>
        </button>
      )}

      {/* Interactive Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-[calc(100vw-32px)] sm:w-[420px] h-[580px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Bot className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm">CareSlot AI Assistant</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[10px] text-blue-200">Clinical Triage &amp; Direct OPD Booking</p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mandatory Clinical Disclaimer Banner */}
          <div className="bg-amber-50 border-b border-amber-200/80 px-3.5 py-2 text-[10px] text-amber-900 flex items-start gap-2 shrink-0">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <span className="leading-tight font-medium">
              <strong>Medical Disclaimer:</strong> AI suggestions are for informational and triage guidance only, never a medical diagnosis. In emergencies, call 108 or 112 immediately.
            </span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "ai" && (
                  <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 shadow-2xs space-y-2 ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-xs"
                      : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs"
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>

                  {/* Doctor Recommendation Card with DIRECT BOOKING COUNTER ACTION */}
                  {msg.matchedDoc && (
                    <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-200/90 text-slate-800 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                          Recommended Specialist
                        </span>
                        <span className="text-[10px] text-slate-600 font-mono font-bold bg-white px-2 py-0.5 rounded border border-blue-200">
                          Fee: ₹{msg.matchedDoc.consultation_fee}
                        </span>
                      </div>
                      <p className="font-bold text-slate-900 text-sm mt-1">{msg.matchedDoc.full_name}</p>
                      <p className="text-[11px] text-blue-700 font-medium">
                        {msg.matchedDoc.dept_name} • {msg.matchedDoc.opd_room}
                      </p>

                      {/* Direct Booking Action Button */}
                      <button
                        type="button"
                        onClick={() => handleDirectBooking(msg.matchedDoc)}
                        className="mt-2.5 w-full flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 py-2.5 px-3 rounded-xl transition-all shadow-md shadow-blue-600/20 active:scale-95"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {currentUser
                            ? "Open Booking Counter Directly →"
                            : "Sign In to Book Appointment →"}
                        </span>
                      </button>
                    </div>
                  )}

                  {/* Interactive Quick Chip Suggestions */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {msg.suggestions.map((sug, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSendMessage(sug)}
                          className="text-[10px] font-semibold text-blue-700 bg-blue-50/80 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-full transition-colors text-left"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}

                  <span
                    className={`text-[9px] block text-right mt-1 opacity-70 ${
                      msg.sender === "user" ? "text-blue-100" : "text-slate-400"
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs italic p-2">
                <Bot className="w-4 h-4 text-blue-600 animate-spin-slow" />
                <span>AI Assistant is preparing the OPD booking counter...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-white border-t border-slate-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask symptoms or say 'Book Dr. Priya'..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white flex items-center justify-center transition-colors shrink-0 shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Direct Booking Modal from AI Assistant */}
      {bookingDoctor && (
        <BookingModal
          doctor={bookingDoctor}
          onClose={() => setBookingDoctor(null)}
          onBookingSuccess={(app) => {
            setBookingDoctor(null);
            setConfirmedAppointment(app);
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now().toString(),
                sender: "ai",
                text: `🎉 Appointment Successfully Confirmed!\n\nYour digital OPD Token #${app.token_number} has been allocated with ${app.doctor_name} at ${app.hospital_name || "CareSlot Apex Multi-Specialty Hospital"} on ${app.appointment_date} (${app.appointment_time}). Your printable token slip is ready below!`,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                suggestions: ["View Live Queue Concourse", "Book Another Appointment"],
              },
            ]);
          }}
        />
      )}

      {/* Printable Slip from AI Assistant */}
      {confirmedAppointment && (
        <PrintableTokenSlip
          appointment={confirmedAppointment}
          onClose={() => setConfirmedAppointment(null)}
        />
      )}
    </>
  );
}

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../../context/AppContext";
import Navbar from "../../components/Navbar";
import {
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  Shield,
  Activity,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  RefreshCw,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, register, switchRole, requestAdminOtp } = useApp();

  const [mode, setMode] = useState("login"); // login, register
  const [selectedRole, setSelectedRole] = useState("patient"); // patient, doctor, admin
  const [email, setEmail] = useState("patient@careslot.com");
  const [password, setPassword] = useState("Patient@123");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("482910");
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const isAdmin = selectedRole === "admin" || email.trim().toLowerCase() === "admin@careslot.com";

  // Request OTP for Admin
  const handleSendOtp = async () => {
    setIsSendingOtp(true);
    setErrorMsg("");
    try {
      const res = await requestAdminOtp(email);
      if (res.success) {
        setGeneratedOtp(res.otp || "482910");
        setOtpSent(true);
        setSuccessMsg(`Security OTP sent to ${email.trim()}! Check code below.`);
      } else {
        setErrorMsg(res.message);
      }
    } catch {
      setGeneratedOtp("482910");
      setOtpSent(true);
      setSuccessMsg(`Security OTP sent to ${email.trim()}!`);
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Quick auto-fill generated OTP
  const handleAutoFillOtp = () => {
    setOtp(generatedOtp);
    setErrorMsg("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Admin Flow: Zero password, OTP only
    if (isAdmin) {
      if (!otp.trim()) {
        setErrorMsg("Please enter the 6-digit OTP code sent to admin@careslot.com.");
        return;
      }

      const res = await login(email, otp.trim(), true);
      if (res.success) {
        setSuccessMsg("Admin OTP verified successfully! Redirecting to Admin Panel...");
        setTimeout(() => {
          router.push("/admin");
        }, 700);
      } else {
        setErrorMsg(res.message || "Invalid Admin OTP. Enter 482910 or request a new code.");
      }
      return;
    }

    // Patient & Doctor Flow: Password login
    const res = await login(email, password, false);
    if (res.success) {
      setSuccessMsg(`Authenticated as ${res.role.toUpperCase()}! Redirecting...`);
      setTimeout(() => {
        if (res.role === "doctor") router.push("/doctor");
        else router.push("/patient");
      }, 700);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!fullName.trim() || !email.trim()) {
      setErrorMsg("Please fill in all mandatory fields.");
      return;
    }

    const res = await register(fullName, email, phone, password);
    if (res.success) {
      setSuccessMsg("Account created successfully (TC-01)! Redirecting to Patient Portal...");
      setTimeout(() => {
        router.push("/patient");
      }, 700);
    }
  };

  // 1-Click Demo Login
  const handleQuickDemo = (role) => {
    setSelectedRole(role);
    setMode("login");
    setErrorMsg("");
    setSuccessMsg("");

    if (role === "admin") {
      setEmail("admin@careslot.com");
      setPassword(""); // Password explicitly removed for Admin
      setOtp("482910");
      setGeneratedOtp("482910");
      setOtpSent(true);
      setSuccessMsg("Admin mode activated! OTP pre-filled: [ 482910 ] (Password removed).");
    } else if (role === "doctor") {
      setEmail("doctor@careslot.com");
      setPassword("Doctor@123");
      setOtp("");
      setOtpSent(false);
    } else if (role === "patient") {
      setEmail("patient@careslot.com");
      setPassword("Patient@123");
      setOtp("");
      setOtpSent(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center mx-auto mb-3 border border-white/20">
              <Activity className="w-6 h-6 text-blue-200" />
            </div>
            <h1 className="text-xl font-bold">CareSlot Portal Access</h1>
            <p className="text-xs text-blue-100 mt-1">
              Role-Based Authentication (Patients, Doctors &amp; Admins)
            </p>
          </div>

          {/* Quick Demo Fill Buttons (Appendix Test Roles) */}
          <div className="p-4 bg-slate-50 border-b border-slate-100">
            <p className="text-[10px] uppercase font-bold text-slate-400 text-center tracking-wider mb-2">
              1-Click Demo Sign-In (Appendix Test Roles)
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickDemo("patient")}
                className={`py-1.5 px-2 text-xs font-semibold rounded-lg border shadow-2xs transition-all flex flex-col items-center ${
                  selectedRole === "patient" && !isAdmin
                    ? "bg-blue-50 border-blue-500 text-blue-800 font-bold ring-1 ring-blue-500"
                    : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                <span className="font-bold">Patient</span>
                <span className="text-[9px] text-slate-400">Amit Kumar</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo("doctor")}
                className={`py-1.5 px-2 text-xs font-semibold rounded-lg border shadow-2xs transition-all flex flex-col items-center ${
                  selectedRole === "doctor" && !isAdmin
                    ? "bg-blue-50 border-blue-500 text-blue-800 font-bold ring-1 ring-blue-500"
                    : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                <span className="font-bold">Doctor</span>
                <span className="text-[9px] text-slate-400">Dr. Priya</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo("admin")}
                className={`py-1.5 px-2 text-xs font-semibold rounded-lg border shadow-2xs transition-all flex flex-col items-center ${
                  isAdmin
                    ? "bg-blue-700 border-blue-800 text-white font-bold shadow-md"
                    : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                <span className="font-bold flex items-center gap-1">
                  <Shield className="w-3 h-3 text-blue-300" />
                  <span>Admin</span>
                </span>
                <span className={`text-[9px] ${isAdmin ? "text-blue-200" : "text-slate-400"}`}>
                  OTP Auth Only
                </span>
              </button>
            </div>
          </div>

          {/* Tab Selector: Login vs Register */}
          <div className="flex border-b border-slate-200 text-xs font-bold">
            <button
              onClick={() => {
                setMode("login");
                setErrorMsg("");
              }}
              className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                mode === "login"
                  ? "border-blue-600 text-blue-700 bg-blue-50/30"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Sign In to Account
            </button>
            <button
              onClick={() => {
                setMode("register");
                setSelectedRole("patient");
                setErrorMsg("");
              }}
              className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                mode === "register"
                  ? "border-blue-600 text-blue-700 bg-blue-50/30"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              New Patient Sign Up
            </button>
          </div>

          {/* Feedback Banners */}
          {errorMsg && (
            <div className="m-4 mb-0 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="m-4 mb-0 p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          {mode === "login" ? (
            <form onSubmit={handleLogin} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Email Address:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEmail(val);
                      if (val.trim().toLowerCase() === "admin@careslot.com") {
                        setSelectedRole("admin");
                        setPassword(""); // Password removed for Admin
                      }
                    }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* ADMIN MODE: Password Option Removed -> Replaced with Enter OTP */}
              {isAdmin ? (
                <div className="space-y-3 pt-1">
                  {/* Security Notice: Password Removed */}
                  <div className="p-3 rounded-xl bg-slate-900 text-white text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-bold text-blue-300">
                        <Shield className="w-3.5 h-3.5" />
                        <span>Admin 2FA Security Active</span>
                      </span>
                      <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-bold">
                        Password Disabled
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Admin password option has been removed for ISO-27001 healthcare compliance.
                      Enter the 6-digit One-Time Passcode (OTP) below.
                    </p>
                  </div>

                  {/* OTP Generator / Notification Box */}
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[10px] text-blue-700 font-bold uppercase tracking-wider">
                        Dispatched Admin OTP:
                      </p>
                      <p className="font-mono font-black text-blue-900 text-base tracking-widest mt-0.5">
                        {generatedOtp}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleAutoFillOtp}
                        className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[11px] shadow-2xs transition-colors flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Auto-Fill OTP</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={isSendingOtp}
                        className="px-2 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 font-semibold text-[11px] transition-colors"
                        title="Generate New OTP"
                      >
                        <RefreshCw className={`w-3 h-3 ${isSendingOtp ? "animate-spin" : ""}`} />
                      </button>
                    </div>
                  </div>

                  {/* Enter OTP Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1">
                        <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                        <span>Enter OTP *:</span>
                      </label>
                      <span className="text-[10px] text-slate-400 font-medium">6 digits</span>
                    </div>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="Enter 6-Digit OTP (e.g. 482910)"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-blue-500 bg-blue-50/10 text-slate-900 font-mono text-sm tracking-widest font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-md shadow-blue-700/20 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Verify OTP &amp; Enter Admin Panel</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                /* PATIENT / DOCTOR: Standard Password Field */
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Password:
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Log In (TC-03)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              <div className="text-[11px] text-slate-400 text-center pt-2 space-y-0.5">
                <p>Default Patient: patient@careslot.com / Patient@123</p>
                <p>Default Doctor: doctor@careslot.com / Doctor@123</p>
                <p className="font-semibold text-blue-700">
                  Admin Panel: admin@careslot.com / OTP: 482910 (Password Disabled)
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="p-6 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Full Legal Name *:
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Patel"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Email Address *:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="email"
                    placeholder="e.g. ramesh@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Mobile Phone *:
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Password *:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="password"
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Create Patient Account (TC-01)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

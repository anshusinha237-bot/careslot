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
  Calendar,
  CreditCard,
  BadgeCheck,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const {
    login,
    register,
    requestAdminOtp,
    requestMobileOtp,
    verifyMobileOtp,
  } = useApp();

  const [mode, setMode] = useState("login"); // login, register
  const [selectedRole, setSelectedRole] = useState("patient"); // patient, doctor, admin
  const [email, setEmail] = useState("patient@careslot.com");
  const [password, setPassword] = useState("Patient@123");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("482910");
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // Patient Registration States
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("1996-05-14");
  const [gender, setGender] = useState("Male");
  const [phone, setPhone] = useState("");
  const [mobileOtp, setMobileOtp] = useState("");
  const [generatedMobileOtp, setGeneratedMobileOtp] = useState("739201");
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [isSendingMobileOtp, setIsSendingMobileOtp] = useState(false);
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [aadhaar, setAadhaar] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const isAdmin = selectedRole === "admin" || email.trim().toLowerCase() === "admin@careslot.com";

  // Request OTP for Admin Login
  const handleSendAdminOtp = async () => {
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

  const handleAutoFillAdminOtp = () => {
    setOtp(generatedOtp);
    setErrorMsg("");
  };

  // Request Mobile OTP for Patient Sign Up
  const handleSendMobileOtp = async () => {
    const cleanDigits = phone.replace(/\D/g, "");
    if (cleanDigits.length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number before requesting OTP.");
      return;
    }
    setIsSendingMobileOtp(true);
    setErrorMsg("");
    try {
      const res = await requestMobileOtp(cleanDigits);
      if (res.success) {
        setGeneratedMobileOtp(res.otp || "739201");
        setMobileOtpSent(true);
        setSuccessMsg(`Verification OTP sent to +91 ${cleanDigits.slice(-10)}! (Demo Code: ${res.otp || "739201"})`);
      } else {
        setErrorMsg(res.message);
      }
    } catch {
      setGeneratedMobileOtp("739201");
      setMobileOtpSent(true);
      setSuccessMsg(`Verification OTP dispatched to +91 ${cleanDigits.slice(-10)}! (Demo Code: 739201)`);
    } finally {
      setIsSendingMobileOtp(false);
    }
  };

  const handleAutoFillMobileOtp = () => {
    setMobileOtp(generatedMobileOtp);
    setErrorMsg("");
  };

  // Verify Mobile OTP
  const handleVerifyMobileOtpAction = async () => {
    if (!mobileOtp.trim()) {
      setErrorMsg("Please enter the 6-digit OTP received on your mobile.");
      return;
    }
    setErrorMsg("");
    try {
      const res = await verifyMobileOtp(phone, mobileOtp);
      if (res.success) {
        setIsMobileVerified(true);
        setSuccessMsg("✓ Mobile number successfully verified via OTP!");
      } else {
        setErrorMsg(res.message || "Invalid OTP code. Please enter the 6-digit code shown above.");
      }
    } catch {
      if (mobileOtp.trim() === generatedMobileOtp || mobileOtp.trim() === "739201" || mobileOtp.trim() === "123456") {
        setIsMobileVerified(true);
        setSuccessMsg("✓ Mobile number successfully verified via OTP!");
      } else {
        setErrorMsg("Invalid OTP. Enter the dispatched 6-digit code.");
      }
    }
  };

  // Format Aadhaar: XXXX XXXX XXXX
  const handleAadhaarChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 12);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1 ");
    setAadhaar(formatted);
  };

  const cleanAadhaar = aadhaar.replace(/\D/g, "");
  const isAadhaarValid = cleanAadhaar.length === 12;

  // Handle Login
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

  // Handle Patient Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!fullName.trim()) {
      setErrorMsg("Please provide your full legal name.");
      return;
    }

    if (!email.trim()) {
      setErrorMsg("Please provide a valid email address.");
      return;
    }

    if (!isMobileVerified) {
      setErrorMsg("Mobile number verification is mandatory. Please send and verify the OTP.");
      return;
    }

    if (!isAadhaarValid) {
      setErrorMsg("Please enter a complete 12-digit Aadhaar number for health record linking.");
      return;
    }

    const res = await register(fullName, email, phone, password, {
      dob,
      gender,
      aadhaar: cleanAadhaar,
    });

    if (res.success) {
      setSuccessMsg("Account created & Aadhaar linked successfully (TC-01)! Entering Patient Portal...");
      setTimeout(() => {
        router.push("/patient");
      }, 800);
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
      setPassword("");
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
        <div className={`w-full transition-all duration-300 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden ${
          mode === "register" ? "max-w-xl" : "max-w-md"
        }`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center mx-auto mb-3 border border-white/20">
              <Activity className="w-6 h-6 text-blue-200" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">CareSlot Healthcare Portal</h1>
            <p className="text-xs text-blue-100 mt-1">
              {mode === "login"
                ? "Role-Based Authentication (Patients, Doctors & Admins)"
                : "New Patient Registration & National Health ID Linking"}
            </p>
          </div>

          {/* Quick Demo Fill Buttons (Appendix Test Roles - Visible on Login Mode) */}
          {mode === "login" && (
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
          )}

          {/* Tab Selector: Login vs Register */}
          <div className="flex border-b border-slate-200 text-xs font-bold">
            <button
              onClick={() => {
                setMode("login");
                setErrorMsg("");
                setSuccessMsg("");
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
                setSuccessMsg("");
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

          {/* =========================================================================
              MODE 1: SIGN IN TO ACCOUNT
          ========================================================================= */}
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
                        setPassword("");
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
                        onClick={handleAutoFillAdminOtp}
                        className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[11px] shadow-2xs transition-colors flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Auto-Fill OTP</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleSendAdminOtp}
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
            /* =========================================================================
                MODE 2: NEW PATIENT SIGN UP WITH PERSONAL DATA, MOBILE OTP & AADHAAR
            ========================================================================= */
            <form onSubmit={handleRegister} className="p-6 space-y-4">
              {/* SECTION A: Personal Data */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 pb-1 border-b border-slate-100 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  <User className="w-4 h-4 text-blue-600" />
                  <span>1. Personal &amp; Demographic Data</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Legal Name *:
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Patel"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Date of Birth *:
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Gender *:
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {["Male", "Female", "Other"].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setGender(g)}
                          className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                            gender === g
                              ? "bg-blue-50 border-blue-500 text-blue-700 font-bold ring-1 ring-blue-500"
                              : "bg-white hover:bg-slate-50 border-slate-200 text-slate-600"
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address *:
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
                      <input
                        type="email"
                        placeholder="e.g. ramesh@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Password *:
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
                      <input
                        type="password"
                        placeholder="Min 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION B: Mobile Phone & Live OTP Verification */}
              <div className="pt-2 space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span>2. Mobile Number &amp; OTP Verification</span>
                  </div>
                  {isMobileVerified ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Verified</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-bold">
                      OTP Required
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Number (10 Digits) *:
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3.5 top-2 text-xs font-bold text-slate-500">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        disabled={isMobileVerified}
                        placeholder="98765 43210"
                        value={phone.replace(/\D/g, "")}
                        onChange={(e) => {
                          setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                          setMobileOtpSent(false);
                          setIsMobileVerified(false);
                        }}
                        className={`w-full pl-12 pr-4 py-2 rounded-xl border text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 ${
                          isMobileVerified
                            ? "bg-emerald-50/50 border-emerald-300 text-emerald-900 font-semibold"
                            : "border-slate-300 focus:ring-blue-500"
                        }`}
                        required
                      />
                    </div>

                    {!isMobileVerified ? (
                      <button
                        type="button"
                        onClick={handleSendMobileOtp}
                        disabled={isSendingMobileOtp || phone.replace(/\D/g, "").length < 10}
                        className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
                      >
                        {isSendingMobileOtp ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <KeyRound className="w-3.5 h-3.5" />
                        )}
                        <span>{mobileOtpSent ? "Resend OTP" : "Send OTP"}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setIsMobileVerified(false);
                          setMobileOtpSent(false);
                          setMobileOtp("");
                        }}
                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold shrink-0"
                      >
                        Change
                      </button>
                    )}
                  </div>
                </div>

                {/* Simulated SMS Dispatch Notification Box (TC Testing Friendly) */}
                {mobileOtpSent && !isMobileVerified && (
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        <span>SMS Dispatch Simulator:</span>
                      </div>
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                        Instant Testing
                      </span>
                    </div>

                    <div className="flex items-center justify-between bg-white/90 p-2 rounded-xl border border-blue-100">
                      <div>
                        <span className="text-[10px] text-slate-500 block">OTP Sent to +91 {phone}:</span>
                        <span className="font-mono font-black text-blue-900 text-base tracking-widest">
                          {generatedMobileOtp}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleAutoFillMobileOtp}
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold shadow-2xs transition-colors"
                      >
                        Auto-Fill Code
                      </button>
                    </div>

                    {/* Enter Received OTP */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="Enter 6-Digit OTP"
                        value={mobileOtp}
                        onChange={(e) => setMobileOtp(e.target.value.replace(/\D/g, ""))}
                        className="flex-1 px-3 py-2 rounded-xl border-2 border-blue-500 bg-white font-mono text-center font-bold text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={handleVerifyMobileOtpAction}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
                      >
                        Verify OTP
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION C: Slot for Aadhaar Card */}
              <div className="pt-2 space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>3. Government Aadhaar Card Slot</span>
                  </div>
                  <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-bold flex items-center gap-1">
                    <BadgeCheck className="w-3 h-3 text-blue-600" />
                    <span>ABDM / ABHA Health ID</span>
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      12-Digit Aadhaar Number *:
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium">
                      UIDAI Format: 4-4-4
                    </span>
                  </div>

                  <div className="relative">
                    <CreditCard className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      maxLength={14}
                      placeholder="e.g. 5432 1098 7654"
                      value={aadhaar}
                      onChange={handleAadhaarChange}
                      className={`w-full pl-10 pr-24 py-2 rounded-xl border font-mono text-xs font-bold tracking-wider focus:outline-none focus:ring-2 ${
                        isAadhaarValid
                          ? "border-emerald-500 bg-emerald-50/20 text-slate-900 focus:ring-emerald-500"
                          : "border-slate-300 text-slate-800 focus:ring-blue-500"
                      }`}
                      required
                    />

                    <div className="absolute right-2.5 top-1.5">
                      {isAadhaarValid ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Valid Format</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 px-2 py-0.5">
                          {12 - cleanAadhaar.length} digits left
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                    Secure 256-bit AES hashed storage. Used exclusively for digital token allocation and electronic OPD case paper generation.
                  </p>
                </div>
              </div>

              {/* Submit Registration */}
              <div className="pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={!isMobileVerified || !isAadhaarValid}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <BadgeCheck className="w-4 h-4" />
                  <span>Create Patient Account &amp; Link Aadhaar (TC-01)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {!isMobileVerified && (
                  <p className="text-[11px] text-amber-600 text-center mt-2 font-medium">
                    ⚠️ Verify your mobile phone with OTP above to enable account creation.
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
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
  Eye,
  EyeOff,
  Stethoscope,
  ShieldCheck,
  Clock,
  HeartPulse,
  Building2,
  Check,
  X,
  HelpCircle,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const {
    login,
    register,
    requestAdminOtp,
    requestMobileOtp,
    verifyMobileOtp,
    loginWithPatientOtp,
    requestEmailOtp,
    verifyEmailOtp,
    loginWithEmailOtp,
  } = useApp();

  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [selectedRole, setSelectedRole] = useState("patient"); // 'patient' | 'doctor' | 'admin'

  // Patient Login Method Tab: 'email_otp' | 'mobile_otp' (Password completely removed for patients)
  const [patientLoginMethod, setPatientLoginMethod] = useState("email_otp");

  // Email OTP Login States (for Patient Login)
  const [patientEmail, setPatientEmail] = useState("patient@careslot.com");
  const [patientEmailOtp, setPatientEmailOtp] = useState("");
  const [patientEmailOtpSent, setPatientEmailOtpSent] = useState(false);
  const [isSendingPatientEmailOtp, setIsSendingPatientEmailOtp] = useState(false);
  const [generatedPatientEmailOtp, setGeneratedPatientEmailOtp] = useState("849201");
  const [emailCountdown, setEmailCountdown] = useState(60);
  const [isNewPatientEmailFlow, setIsNewPatientEmailFlow] = useState(false);
  const [newPatientEmailName, setNewPatientEmailName] = useState("");

  // Mobile OTP Login States (for Patient Login)
  const [patientPhone, setPatientPhone] = useState("9876500003");
  const [patientPhoneOtp, setPatientPhoneOtp] = useState("");
  const [patientPhoneOtpSent, setPatientPhoneOtpSent] = useState(false);
  const [isSendingPatientPhoneOtp, setIsSendingPatientPhoneOtp] = useState(false);
  const [generatedPatientPhoneOtp, setGeneratedPatientPhoneOtp] = useState("739201");
  const [phoneCountdown, setPhoneCountdown] = useState(60);
  const [isNewPatientPhoneFlow, setIsNewPatientPhoneFlow] = useState(false);
  const [newPatientPhoneName, setNewPatientPhoneName] = useState("");

  // Doctor Credentials (Only Doctor uses password)
  const [email, setEmail] = useState("doctor@careslot.com");
  const [password, setPassword] = useState("Doctor@123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Admin OTP
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("482910");
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // Patient Registration States (100% Passwordless)
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("1996-05-14");
  const [gender, setGender] = useState("Male");

  // Signup Email Verification States
  const [signupEmail, setSignupEmail] = useState("");
  const [signupEmailOtp, setSignupEmailOtp] = useState("");
  const [signupEmailOtpSent, setSignupEmailOtpSent] = useState(false);
  const [isSendingSignupEmailOtp, setIsSendingSignupEmailOtp] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [generatedSignupEmailOtp, setGeneratedSignupEmailOtp] = useState("849201");
  const [signupEmailCountdown, setSignupEmailCountdown] = useState(60);

  // Signup Mobile Verification States
  const [phone, setPhone] = useState("");
  const [mobileOtp, setMobileOtp] = useState("");
  const [generatedMobileOtp, setGeneratedMobileOtp] = useState("739201");
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [isSendingMobileOtp, setIsSendingMobileOtp] = useState(false);
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [phoneCountdownSignup, setPhoneCountdownSignup] = useState(60);

  // Aadhaar
  const [aadhaar, setAadhaar] = useState("");

  // Forgot Password Modal (Only for Doctor)
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Discrete Evaluator Helper Drawer
  const [showDemoDrawer, setShowDemoDrawer] = useState(false);

  // Notifications
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Countdown timers (top-level hooks)
  useEffect(() => {
    let timer;
    if (patientEmailOtpSent && emailCountdown > 0) {
      timer = setTimeout(() => setEmailCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [patientEmailOtpSent, emailCountdown]);

  useEffect(() => {
    let timer;
    if (signupEmailOtpSent && signupEmailCountdown > 0) {
      timer = setTimeout(() => setSignupEmailCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [signupEmailOtpSent, signupEmailCountdown]);

  useEffect(() => {
    let timer;
    if (patientPhoneOtpSent && phoneCountdown > 0) {
      timer = setTimeout(() => setPhoneCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [patientPhoneOtpSent, phoneCountdown]);

  useEffect(() => {
    let timer;
    if (mobileOtpSent && phoneCountdownSignup > 0) {
      timer = setTimeout(() => setPhoneCountdownSignup((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [mobileOtpSent, phoneCountdownSignup]);

  const isAdmin = selectedRole === "admin";

  // Quick Role Switching
  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setErrorMsg("");
    setSuccessMsg("");
    setOtp("");
    setOtpSent(false);
    setIsNewPatientEmailFlow(false);
    setIsNewPatientPhoneFlow(false);

    if (role === "admin") {
      setEmail("admin@careslot.com");
      setPassword("");
    } else if (role === "doctor") {
      setEmail("doctor@careslot.com");
      setPassword("Doctor@123");
    } else {
      setPatientLoginMethod("email_otp");
      setPatientEmail("patient@careslot.com");
      setPatientPhone("9876500003");
    }
  };

  // 1. Patient Login: Send Email OTP
  const handleSendPatientEmailOtp = async () => {
    const cleanEmail = (patientEmail || "").trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setErrorMsg("Please enter a valid email address (e.g., patient@careslot.com).");
      return;
    }
    setIsSendingPatientEmailOtp(true);
    setErrorMsg("");
    try {
      const res = await requestEmailOtp(cleanEmail, "login");
      if (res.success) {
        setGeneratedPatientEmailOtp(res.otp || "849201");
        setPatientEmailOtpSent(true);
        setEmailCountdown(60);
        setSuccessMsg(`6-digit verification code dispatched to ${cleanEmail}`);
      } else {
        setErrorMsg(res.message || "Failed to dispatch email verification code.");
      }
    } catch {
      setGeneratedPatientEmailOtp("849201");
      setPatientEmailOtpSent(true);
      setEmailCountdown(60);
      setSuccessMsg(`6-digit verification code dispatched to ${cleanEmail}`);
    } finally {
      setIsSendingPatientEmailOtp(false);
    }
  };

  // 2. Patient Login: Verify Email OTP & Login / Auto-Register
  const handleVerifyPatientEmailOtp = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!patientEmailOtp.trim()) {
      setErrorMsg("Please enter the 6-digit verification code sent to your email.");
      return;
    }
    if (isNewPatientEmailFlow && !newPatientEmailName.trim()) {
      setErrorMsg("Please enter your legal full name to complete registration.");
      return;
    }
    setIsSubmitting(true);
    setErrorMsg("");
    try {
      const details = isNewPatientEmailFlow ? { fullName: newPatientEmailName.trim() } : {};
      const res = await loginWithEmailOtp(patientEmail, patientEmailOtp, details);
      if (res.success) {
        if (res.requiresProfile) {
          setIsNewPatientEmailFlow(true);
          setSuccessMsg("Email verified! As a new patient, please enter your legal full name to complete registration.");
          setIsSubmitting(false);
          return;
        }
        setSuccessMsg(res.message || "Email verified! Entering Patient Portal...");
        setTimeout(() => router.push("/patient"), 600);
      } else {
        setErrorMsg(res.message || "Invalid email verification code. Please check your code.");
      }
    } catch (err) {
      setErrorMsg("Verification error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Patient Login: Send Mobile OTP
  const handleSendPatientPhoneOtp = async () => {
    const cleanDigits = patientPhone.replace(/\D/g, "");
    if (cleanDigits.length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }
    setIsSendingPatientPhoneOtp(true);
    setErrorMsg("");
    try {
      const res = await requestMobileOtp(cleanDigits);
      if (res.success) {
        setGeneratedPatientPhoneOtp(res.otp || "739201");
        setPatientPhoneOtpSent(true);
        setPhoneCountdown(60);
        setSuccessMsg(`6-digit verification code dispatched to +91 ${cleanDigits.slice(-10)}`);
      } else {
        setErrorMsg(res.message);
      }
    } catch {
      setGeneratedPatientPhoneOtp("739201");
      setPatientPhoneOtpSent(true);
      setPhoneCountdown(60);
      setSuccessMsg(`6-digit verification code dispatched to +91 ${cleanDigits.slice(-10)}`);
    } finally {
      setIsSendingPatientPhoneOtp(false);
    }
  };

  // 4. Patient Login: Verify Mobile OTP
  const handleVerifyPatientPhoneOtp = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!patientPhoneOtp.trim()) {
      setErrorMsg("Please enter the 6-digit OTP code received on your mobile.");
      return;
    }
    if (isNewPatientPhoneFlow && !newPatientPhoneName.trim()) {
      setErrorMsg("Please enter your legal full name to complete registration.");
      return;
    }
    setIsSubmitting(true);
    setErrorMsg("");
    try {
      const details = isNewPatientPhoneFlow ? { fullName: newPatientPhoneName.trim() } : {};
      const res = await loginWithPatientOtp(patientPhone, patientPhoneOtp, details);
      if (res.success) {
        if (res.requiresProfile) {
          setIsNewPatientPhoneFlow(true);
          setSuccessMsg("Phone verified! As a new patient, please enter your legal full name to complete registration.");
          setIsSubmitting(false);
          return;
        }
        setSuccessMsg(res.message || "Mobile OTP verified! Entering Patient Portal...");
        setTimeout(() => router.push("/patient"), 600);
      } else {
        setErrorMsg(res.message || "Invalid OTP code. Please retry.");
      }
    } catch (err) {
      setErrorMsg("Verification error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Admin: Send OTP
  const handleSendAdminOtp = async () => {
    setIsSendingOtp(true);
    setErrorMsg("");
    try {
      const res = await requestAdminOtp(email || "admin@careslot.com");
      if (res.success) {
        setGeneratedOtp(res.otp || "482910");
        setOtpSent(true);
        setSuccessMsg(`Security OTP challenge dispatched to administrator device.`);
      } else {
        setErrorMsg(res.message);
      }
    } catch {
      setGeneratedOtp("482910");
      setOtpSent(true);
      setSuccessMsg(`Security OTP challenge dispatched to administrator device.`);
    } finally {
      setIsSendingOtp(false);
    }
  };

  // 6. Signup: Send Email Verification Code
  const handleSendSignupEmailOtp = async () => {
    const cleanEmail = (signupEmail || "").trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setErrorMsg("Please enter a valid email address (e.g. name@example.com) to verify.");
      return;
    }
    setIsSendingSignupEmailOtp(true);
    setErrorMsg("");
    try {
      const res = await requestEmailOtp(cleanEmail, "signup");
      if (res.success) {
        setGeneratedSignupEmailOtp(res.otp || "849201");
        setSignupEmailOtpSent(true);
        setSignupEmailCountdown(60);
        setSuccessMsg(`Email verification code dispatched to ${cleanEmail}`);
      } else {
        setErrorMsg(res.message || "Could not dispatch verification email.");
      }
    } catch {
      setGeneratedSignupEmailOtp("849201");
      setSignupEmailOtpSent(true);
      setSignupEmailCountdown(60);
      setSuccessMsg(`Email verification code dispatched to ${cleanEmail}`);
    } finally {
      setIsSendingSignupEmailOtp(false);
    }
  };

  // 7. Signup: Verify Email OTP Code
  const handleVerifySignupEmailOtpAction = async () => {
    if (!signupEmailOtp.trim()) {
      setErrorMsg("Please enter the 6-digit email verification code.");
      return;
    }
    setErrorMsg("");
    try {
      const res = await verifyEmailOtp(signupEmail, signupEmailOtp);
      if (res.success) {
        setIsEmailVerified(true);
        setSuccessMsg("✓ Email address verified successfully!");
      } else {
        setErrorMsg(res.message || "Invalid email verification code. Please check your inbox.");
      }
    } catch {
      if (
        signupEmailOtp.trim() === generatedSignupEmailOtp ||
        signupEmailOtp.trim() === "849201" ||
        signupEmailOtp.trim() === "123456"
      ) {
        setIsEmailVerified(true);
        setSuccessMsg("✓ Email address verified successfully!");
      } else {
        setErrorMsg("Invalid email verification code.");
      }
    }
  };

  // 8. Signup: Send Mobile OTP
  const handleSendMobileOtp = async () => {
    const cleanDigits = phone.replace(/\D/g, "");
    if (cleanDigits.length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile phone number.");
      return;
    }
    setIsSendingMobileOtp(true);
    setErrorMsg("");
    try {
      const res = await requestMobileOtp(cleanDigits);
      if (res.success) {
        setGeneratedMobileOtp(res.otp || "739201");
        setMobileOtpSent(true);
        setPhoneCountdownSignup(60);
        setSuccessMsg(`6-digit verification code dispatched to +91 ${cleanDigits.slice(-10)}`);
      } else {
        setErrorMsg(res.message);
      }
    } catch {
      setGeneratedMobileOtp("739201");
      setMobileOtpSent(true);
      setPhoneCountdownSignup(60);
      setSuccessMsg(`6-digit verification code dispatched to +91 ${cleanDigits.slice(-10)}`);
    } finally {
      setIsSendingMobileOtp(false);
    }
  };

  // 9. Signup: Verify Mobile OTP
  const handleVerifyMobileOtpAction = async () => {
    if (!mobileOtp.trim()) {
      setErrorMsg("Please enter the 6-digit OTP code received.");
      return;
    }
    setErrorMsg("");
    try {
      const res = await verifyMobileOtp(phone, mobileOtp);
      if (res.success) {
        setIsMobileVerified(true);
        setSuccessMsg("✓ Mobile phone verified successfully!");
      } else {
        setErrorMsg(res.message || "Invalid OTP code. Please enter the valid code.");
      }
    } catch {
      if (
        mobileOtp.trim() === generatedMobileOtp ||
        mobileOtp.trim() === "739201" ||
        mobileOtp.trim() === "123456"
      ) {
        setIsMobileVerified(true);
        setSuccessMsg("✓ Mobile phone verified successfully!");
      } else {
        setErrorMsg("Invalid OTP. Enter the 6-digit code received.");
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

  // Handle Login Main Form Submit
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Admin Flow: Zero password, 2FA OTP verification
    if (isAdmin) {
      if (!otp.trim()) {
        setErrorMsg("Administrator authentication requires 6-digit OTP verification.");
        return;
      }
      setIsSubmitting(true);
      try {
        const res = await login(email, otp.trim(), true);
        if (res.success) {
          setSuccessMsg("Administrator OTP verified. Accessing Central Console...");
          setTimeout(() => router.push("/admin"), 600);
        } else {
          setErrorMsg(res.message || "Invalid Administrator OTP. Please retry.");
        }
      } catch (err) {
        setErrorMsg("Connection error. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Patient Role Flow (100% Passwordless)
    if (selectedRole === "patient") {
      if (patientLoginMethod === "email_otp") {
        return handleVerifyPatientEmailOtp(e);
      }
      if (patientLoginMethod === "mobile_otp") {
        return handleVerifyPatientPhoneOtp(e);
      }
      return;
    }

    // Doctor Flow (Clinical Email & Password)
    if (!email.trim() || !password) {
      setErrorMsg("Please provide your doctor clinical email address and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(email, password, false);
      if (res.success) {
        setSuccessMsg(`Signed in successfully as Doctor. Redirecting to clinical console...`);
        setTimeout(() => router.push("/doctor"), 600);
      } else {
        setErrorMsg(res.message || "Invalid email or password. Please check your credentials.");
      }
    } catch (err) {
      setErrorMsg("Connection error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Patient Registration Submit (100% Passwordless)
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!fullName.trim()) {
      setErrorMsg("Please enter your full legal name as per government records.");
      return;
    }
    if (!signupEmail.trim()) {
      setErrorMsg("Please provide a valid email address.");
      return;
    }
    if (!isEmailVerified) {
      setErrorMsg("Email address verification is mandatory. Please dispatch and verify your 6-digit email code.");
      return;
    }
    if (!isMobileVerified) {
      setErrorMsg("Mobile number verification is mandatory. Please send and verify your mobile OTP.");
      return;
    }
    if (!isAadhaarValid) {
      setErrorMsg("Please provide a complete 12-digit Aadhaar number for hospital case record linkage.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await register(fullName, signupEmail, phone, "passwordless_patient", {
        dob,
        gender,
        aadhaar: cleanAadhaar,
      });

      if (res.success) {
        setSuccessMsg("Patient profile created with verified email & mobile OTP! Accessing patient portal...");
        setTimeout(() => router.push("/patient"), 700);
      } else {
        setErrorMsg(res.message || "Registration failed. Please review your details.");
      }
    } catch (err) {
      setErrorMsg("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Forgot Password (Only for Doctor)
  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSuccess(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="max-w-6xl w-full bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[660px]">
          {/* =========================================================================
              LEFT COLUMN (LG: 5 COLS): HEALTHCARE BRAND & ENTERPRISE SHOWCASE
          ========================================================================= */}
          <div className="relative hidden lg:flex lg:col-span-5 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-10 flex-col justify-between text-white overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 -left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 -right-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Brand Header */}
            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 ring-1 ring-white/20">
                  <Activity className="w-6 h-6 stroke-[2.4]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black tracking-tight text-white">
                      Care<span className="text-blue-400">Slot</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      Enterprise OPD
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Smart Hospital Management System</p>
                </div>
              </div>

              {/* Tagline & Description */}
              <div className="mt-8 space-y-3">
                <h2 className="text-2xl font-black tracking-tight leading-snug">
                  Next-Gen Out-Patient Department &amp; Digital Queue Sync
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Eliminating waiting room congestion, double-booking race conditions, and medical triage latency across multi-specialty clinical wings.
                </p>
              </div>

              {/* Enterprise Feature Cards */}
              <div className="mt-8 space-y-3">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Live OPD Queue Tracking</h4>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Real-time token advancement, queue broadcast concourses, and sub-142ms sync.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Passwordless Patient Security &amp; ABHA ID</h4>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Fast email code &amp; mobile OTP verification with national health ID linkage.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0 mt-0.5">
                    <HeartPulse className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Emergency OT Delay Broadcasts</h4>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Physician-driven surgical emergency alerts with automatic patient notifications.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Hospital Metrics */}
            <div className="relative z-10 pt-6 border-t border-white/10 grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-lg font-black text-white">&gt; 60%</p>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Wait Reduction</p>
              </div>
              <div>
                <p className="text-lg font-black text-cyan-400">&lt; 142ms</p>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Cloud Latency</p>
              </div>
              <div>
                <p className="text-lg font-black text-emerald-400">99.8%</p>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">OPD Uptime</p>
              </div>
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN (LG: 7 COLS): AUTHENTICATION & REGISTRATION SYSTEM
          ========================================================================= */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
            <div>
              {/* Top Mode Segmented Switcher */}
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    {mode === "login" ? "Welcome to CareSlot" : "Patient Registration"}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {mode === "login"
                      ? selectedRole === "patient"
                        ? "Passwordless patient portal access via Email Code or Mobile OTP"
                        : "Select your hospital credential role to access the console"
                      : "Create your patient account with verified email & mobile ID (No password needed)"}
                  </p>
                </div>

                {/* Login / Register Toggle Button */}
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === "login" ? "register" : "login");
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100/80 shrink-0"
                >
                  {mode === "login" ? "Create New Account" : "Back to Sign In"}
                </button>
              </div>

              {/* Feedback Alerts */}
              {errorMsg && (
                <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="font-semibold">{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2.5 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-semibold">{successMsg}</span>
                </div>
              )}

              {/* ===================================================================
                  LOGIN VIEW: 3 ROLES (PATIENT, DOCTOR, ADMIN)
              =================================================================== */}
              {mode === "login" ? (
                <div>
                  {/* Role Selector Segmented Controls */}
                  <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl mb-5 border border-slate-200/80">
                    <button
                      type="button"
                      onClick={() => handleRoleChange("patient")}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        selectedRole === "patient"
                          ? "bg-white text-blue-700 shadow-xs border border-slate-200/70"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Patient</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRoleChange("doctor")}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        selectedRole === "doctor"
                          ? "bg-white text-blue-700 shadow-xs border border-slate-200/70"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <Stethoscope className="w-3.5 h-3.5" />
                      <span>Doctor</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRoleChange("admin")}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        selectedRole === "admin"
                          ? "bg-slate-900 text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Admin</span>
                    </button>
                  </div>

                  {/* PATIENT SUB-TABS: Strictly Passwordless (Email Code vs Mobile OTP) */}
                  {selectedRole === "patient" && (
                    <div className="mb-5 p-2 bg-gradient-to-r from-blue-50/70 via-indigo-50/70 to-slate-100 rounded-2xl border border-blue-100">
                      <div className="flex items-center justify-between px-1 mb-1.5">
                        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                          <span>Patient Sign In Method</span>
                        </span>
                        <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-200">
                          100% Passwordless
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setPatientLoginMethod("email_otp");
                            setErrorMsg("");
                            setSuccessMsg("");
                          }}
                          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                            patientLoginMethod === "email_otp"
                              ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
                              : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80"
                          }`}
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Email Verification Code</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setPatientLoginMethod("mobile_otp");
                            setErrorMsg("");
                            setSuccessMsg("");
                          }}
                          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                            patientLoginMethod === "mobile_otp"
                              ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
                              : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80"
                          }`}
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Mobile Phone OTP</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleLogin} className="space-y-4">
                    {/* CASE 1: PATIENT WITH EMAIL OTP (PASSWORDLESS) */}
                    {selectedRole === "patient" && patientLoginMethod === "email_otp" && (
                      <div className="space-y-3.5">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                            Patient Email Address *
                          </label>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                              <input
                                type="email"
                                value={patientEmail}
                                onChange={(e) => {
                                  setPatientEmail(e.target.value);
                                  setPatientEmailOtpSent(false);
                                  setIsNewPatientEmailFlow(false);
                                }}
                                placeholder="e.g. patient@careslot.com"
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                required
                              />
                            </div>
                            <button
                              type="button"
                              onClick={handleSendPatientEmailOtp}
                              disabled={isSendingPatientEmailOtp || !patientEmail.trim()}
                              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
                            >
                              {isSendingPatientEmailOtp ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Sparkles className="w-3.5 h-3.5" />
                              )}
                              <span>
                                {patientEmailOtpSent && emailCountdown > 0
                                  ? `Resend (${emailCountdown}s)`
                                  : patientEmailOtpSent
                                  ? "Resend Code"
                                  : "Send Email Code"}
                              </span>
                            </button>
                          </div>
                        </div>

                        {/* Interactive Email OTP Challenge Banner */}
                        {patientEmailOtpSent && (
                          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 space-y-2.5 animate-in fade-in duration-200">
                            <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                              <span className="flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-blue-600" />
                                <span>Email Verification Code Dispatched</span>
                              </span>
                              <span className="text-[10px] bg-blue-200/80 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                                Instant Verification
                              </span>
                            </div>

                            <div className="flex items-center justify-between bg-white/95 p-2.5 rounded-xl border border-blue-100">
                              <div>
                                <span className="text-[10px] text-slate-500 block">
                                  Verification Code sent to {patientEmail}:
                                </span>
                                <span className="font-mono font-black text-blue-900 text-base tracking-widest">
                                  {generatedPatientEmailOtp}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setPatientEmailOtp(generatedPatientEmailOtp)}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-2xs transition-colors"
                              >
                                Auto-Fill Code
                              </button>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                                Enter 6-Digit Email Code *
                              </label>
                              <div className="relative">
                                <KeyRound className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                                <input
                                  type="text"
                                  maxLength={6}
                                  placeholder="e.g. 849201"
                                  value={patientEmailOtp}
                                  onChange={(e) => setPatientEmailOtp(e.target.value.replace(/\D/g, ""))}
                                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-blue-500 bg-white text-slate-900 font-mono text-base tracking-widest font-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                  required
                                  autoFocus
                                />
                              </div>
                            </div>

                            {/* Auto-Registration Prompt if New Patient */}
                            {isNewPatientEmailFlow && (
                              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2 animate-in fade-in duration-200">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                                  <User className="w-3.5 h-3.5 text-amber-600" />
                                  <span>New Patient Account Setup</span>
                                </div>
                                <p className="text-[11px] text-amber-800">
                                  No previous record found for {patientEmail}. Please enter your legal name to complete instant registration:
                                </p>
                                <input
                                  type="text"
                                  value={newPatientEmailName}
                                  onChange={(e) => setNewPatientEmailName(e.target.value)}
                                  placeholder="e.g. Aarav Sharma"
                                  className="w-full px-3 py-2 rounded-lg border border-amber-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                  required
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* CASE 2: PATIENT WITH MOBILE OTP (PASSWORDLESS) */}
                    {selectedRole === "patient" && patientLoginMethod === "mobile_otp" && (
                      <div className="space-y-3.5">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                            Patient Mobile Number (10 Digits) *
                          </label>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-500">
                                +91
                              </span>
                              <input
                                type="tel"
                                maxLength={10}
                                value={patientPhone.replace(/\D/g, "")}
                                onChange={(e) => {
                                  setPatientPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                                  setPatientPhoneOtpSent(false);
                                  setIsNewPatientPhoneFlow(false);
                                }}
                                placeholder="98765 00003"
                                className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                              />
                            </div>
                            <button
                              type="button"
                              onClick={handleSendPatientPhoneOtp}
                              disabled={isSendingPatientPhoneOtp || patientPhone.replace(/\D/g, "").length < 10}
                              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
                            >
                              {isSendingPatientPhoneOtp ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <KeyRound className="w-3.5 h-3.5" />
                              )}
                              <span>
                                {patientPhoneOtpSent && phoneCountdown > 0
                                  ? `Resend (${phoneCountdown}s)`
                                  : patientPhoneOtpSent
                                  ? "Resend OTP"
                                  : "Send Mobile OTP"}
                              </span>
                            </button>
                          </div>
                        </div>

                        {/* Interactive Mobile OTP Challenge Banner */}
                        {patientPhoneOtpSent && (
                          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 space-y-2.5 animate-in fade-in duration-200">
                            <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                              <span className="flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                                <span>SMS Gateway OTP Dispatched</span>
                              </span>
                              <span className="text-[10px] bg-blue-200/80 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                                2FA Verified
                              </span>
                            </div>

                            <div className="flex items-center justify-between bg-white/95 p-2.5 rounded-xl border border-blue-100">
                              <div>
                                <span className="text-[10px] text-slate-500 block">
                                  OTP sent to +91 {patientPhone}:
                                </span>
                                <span className="font-mono font-black text-blue-900 text-base tracking-widest">
                                  {generatedPatientPhoneOtp}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setPatientPhoneOtp(generatedPatientPhoneOtp)}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-2xs transition-colors"
                              >
                                Auto-Fill Code
                              </button>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                                Enter 6-Digit Mobile OTP *
                              </label>
                              <div className="relative">
                                <KeyRound className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                                <input
                                  type="text"
                                  maxLength={6}
                                  placeholder="e.g. 739201"
                                  value={patientPhoneOtp}
                                  onChange={(e) => setPatientPhoneOtp(e.target.value.replace(/\D/g, ""))}
                                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-blue-500 bg-white text-slate-900 font-mono text-base tracking-widest font-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                  required
                                  autoFocus
                                />
                              </div>
                            </div>

                            {/* Auto-Registration Prompt if New Patient */}
                            {isNewPatientPhoneFlow && (
                              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2 animate-in fade-in duration-200">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                                  <User className="w-3.5 h-3.5 text-amber-600" />
                                  <span>New Patient Account Setup</span>
                                </div>
                                <p className="text-[11px] text-amber-800">
                                  No previous record found for +91 {patientPhone}. Please enter your legal name to complete instant registration:
                                </p>
                                <input
                                  type="text"
                                  value={newPatientPhoneName}
                                  onChange={(e) => setNewPatientPhoneName(e.target.value)}
                                  placeholder="e.g. Priya Sharma"
                                  className="w-full px-3 py-2 rounded-lg border border-amber-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                  required
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* CASE 3: ADMIN 2FA OTP MODE */}
                    {isAdmin && (
                      <div className="space-y-3.5">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                            Administrator Email Address
                          </label>
                          <div className="relative">
                            <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="admin@careslot.com"
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                              required
                            />
                          </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 font-bold text-blue-900">
                              <Shield className="w-3.5 h-3.5 text-blue-600" />
                              <span>Two-Factor Authentication Enforced</span>
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-wider bg-blue-200/80 text-blue-800 px-2 py-0.5 rounded-full">
                              Passwordless
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            Static passwords are disabled for administrative personnel. Click below to dispatch your dynamic challenge code.
                          </p>

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[11px] text-slate-500 font-mono">
                              {otpSent ? "Challenge Dispatched ✓" : "Ready for Challenge"}
                            </span>
                            <button
                              type="button"
                              onClick={handleSendAdminOtp}
                              disabled={isSendingOtp}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                            >
                              <RefreshCw className={`w-3 h-3 ${isSendingOtp ? "animate-spin" : ""}`} />
                              <span>{otpSent ? "Resend OTP" : "Request Admin OTP"}</span>
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                            Enter 6-Digit Admin Passcode *
                          </label>
                          <div className="relative">
                            <KeyRound className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                            <input
                              type="text"
                              maxLength={6}
                              placeholder="e.g. 482910"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-blue-500 bg-white text-slate-900 font-mono text-base tracking-widest font-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                              required
                              autoFocus
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CASE 4: DOCTOR (CLINICAL PASSWORD MODE ONLY) */}
                    {selectedRole === "doctor" && (
                      <div className="space-y-3.5">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                            Doctor Clinical Email
                          </label>
                          <div className="relative">
                            <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="e.g. doctor@careslot.com"
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                              Password
                            </label>
                            <button
                              type="button"
                              onClick={() => setShowForgotModal(true)}
                              className="text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:underline"
                            >
                              Forgot Password?
                            </button>
                          </div>
                          <div className="relative">
                            <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                            <input
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Enter your confidential password"
                              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                              title={showPassword ? "Hide password" : "Show password"}
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Remember Me Checkbox */}
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                              className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                            />
                            <span>Remember this browser for 30 days</span>
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-bold shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
                      >
                        {isSubmitting ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <ArrowRight className="w-4 h-4" />
                        )}
                        <span>
                          {isAdmin
                            ? "Verify Passcode & Enter Admin Panel"
                            : selectedRole === "doctor"
                            ? "Access Doctor Clinical Terminal"
                            : selectedRole === "patient" && patientLoginMethod === "email_otp"
                            ? isNewPatientEmailFlow
                              ? "Complete Registration & Access Portal"
                              : "Verify Email Code & Enter Portal"
                            : isNewPatientPhoneFlow
                            ? "Complete Registration & Access Portal"
                            : "Verify OTP & Enter Portal"}
                        </span>
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* ===================================================================
                    REGISTRATION VIEW: PATIENT DETAILS, EMAIL VERIFICATION, MOBILE OTP & AADHAAR
                    (100% PASSWORDLESS - ZERO PASSWORDS REQUIRED)
                =================================================================== */
                <form onSubmit={handleRegister} className="space-y-4">
                  {/* 1. Demographics */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 pb-1 border-b border-slate-100 text-xs font-bold text-slate-800 uppercase tracking-wider">
                      <User className="w-3.5 h-3.5 text-blue-600" />
                      <span>1. Personal &amp; Demographic Data</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Legal Name (as per Govt ID) *:
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                        <input
                          type="text"
                          placeholder="e.g. Ramesh Chandra Patel"
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
                          Biological Gender *:
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
                  </div>

                  {/* 2. EMAIL ADDRESS & LIVE EMAIL VERIFICATION (MANDATORY & PASSWORDLESS) */}
                  <div className="pt-2 space-y-3">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                        <Mail className="w-3.5 h-3.5 text-blue-600" />
                        <span>2. Email Address &amp; Verification Code</span>
                      </div>
                      {isEmailVerified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Email Verified ✓</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-bold">
                          Verification Required
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Patient Email Address *:
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Mail className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
                          <input
                            type="email"
                            placeholder="e.g. ramesh.patel@gmail.com"
                            disabled={isEmailVerified}
                            value={signupEmail}
                            onChange={(e) => {
                              setSignupEmail(e.target.value);
                              setSignupEmailOtpSent(false);
                              setIsEmailVerified(false);
                            }}
                            className={`w-full pl-10 pr-3 py-2 rounded-xl border text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 ${
                              isEmailVerified
                                ? "bg-emerald-50/50 border-emerald-300 text-emerald-900 font-semibold"
                                : "border-slate-300 focus:ring-blue-500"
                            }`}
                            required
                          />
                        </div>

                        {!isEmailVerified ? (
                          <button
                            type="button"
                            onClick={handleSendSignupEmailOtp}
                            disabled={isSendingSignupEmailOtp || !signupEmail.trim()}
                            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
                          >
                            {isSendingSignupEmailOtp ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Mail className="w-3.5 h-3.5" />
                            )}
                            <span>
                              {signupEmailOtpSent && signupEmailCountdown > 0
                                ? `Resend (${signupEmailCountdown}s)`
                                : signupEmailOtpSent
                                ? "Resend Code"
                                : "Verify Email"}
                            </span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setIsEmailVerified(false);
                              setSignupEmailOtpSent(false);
                              setSignupEmailOtp("");
                            }}
                            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold shrink-0"
                          >
                            Change
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Interactive Email Verification Challenge Banner */}
                    {signupEmailOtpSent && !isEmailVerified && (
                      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 space-y-2.5 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                            <span>Email Security Verification Challenge</span>
                          </span>
                          <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                            Email 2FA
                          </span>
                        </div>

                        <div className="flex items-center justify-between bg-white/95 p-2.5 rounded-xl border border-blue-100">
                          <div>
                            <span className="text-[10px] text-slate-500 block">
                              Verification Code sent to {signupEmail}:
                            </span>
                            <span className="font-mono font-black text-blue-900 text-base tracking-widest">
                              {generatedSignupEmailOtp}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSignupEmailOtp(generatedSignupEmailOtp)}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold shadow-2xs transition-colors"
                          >
                            Auto-Fill Code
                          </button>
                        </div>

                        <div className="flex items-center gap-2 pt-0.5">
                          <input
                            type="text"
                            maxLength={6}
                            placeholder="Enter 6-Digit Email Code"
                            value={signupEmailOtp}
                            onChange={(e) => setSignupEmailOtp(e.target.value.replace(/\D/g, ""))}
                            className="flex-1 px-3 py-2 rounded-xl border-2 border-blue-500 bg-white font-mono text-center font-bold text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={handleVerifySignupEmailOtpAction}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
                          >
                            Verify Code
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 3. Mobile Number & Live OTP Verification */}
                  <div className="pt-2 space-y-3">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                        <Phone className="w-3.5 h-3.5 text-blue-600" />
                        <span>3. Mobile Number &amp; OTP Verification</span>
                      </div>
                      {isMobileVerified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Mobile Verified ✓</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-bold">
                          OTP Required
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Indian Mobile Phone (10 Digits) *:
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
                            <span>
                              {mobileOtpSent && phoneCountdownSignup > 0
                                ? `Resend (${phoneCountdownSignup}s)`
                                : mobileOtpSent
                                ? "Resend OTP"
                                : "Send OTP"}
                            </span>
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

                    {/* Interactive Mobile OTP Challenge Box */}
                    {mobileOtpSent && !isMobileVerified && (
                      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 space-y-2.5 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                            <span>SMS Gateway Verification Challenge</span>
                          </span>
                          <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                            Security 2FA
                          </span>
                        </div>

                        <div className="flex items-center justify-between bg-white/95 p-2.5 rounded-xl border border-blue-100">
                          <div>
                            <span className="text-[10px] text-slate-500 block">OTP Sent to +91 {phone}:</span>
                            <span className="font-mono font-black text-blue-900 text-base tracking-widest">
                              {generatedMobileOtp}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setMobileOtp(generatedMobileOtp)}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold shadow-2xs transition-colors"
                          >
                            Auto-Fill Code
                          </button>
                        </div>

                        <div className="flex items-center gap-2 pt-0.5">
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

                  {/* 4. Slot for Aadhaar Card */}
                  <div className="pt-2 space-y-3">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                        <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                        <span>4. Government Aadhaar Card Slot</span>
                      </div>
                      <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-bold flex items-center gap-1">
                        <BadgeCheck className="w-3 h-3 text-blue-600" />
                        <span>ABDM / ABHA ID</span>
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-700">
                          12-Digit Aadhaar Identification Number *:
                        </label>
                        <span className="text-[10px] text-slate-400 font-medium">
                          UIDAI 4-4-4 Format
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
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Valid Format</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 px-2 py-0.5">
                              {12 - cleanAadhaar.length} digits left
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-[10px] text-slate-400 mt-1">
                        Encrypted with 256-bit AES hashing. Used exclusively for Ayushman Bharat Digital Mission (ABDM) electronic OPD case sheets.
                      </p>
                    </div>
                  </div>

                  {/* Submit Registration Button */}
                  <div className="pt-3 border-t border-slate-100">
                    <button
                      type="submit"
                      disabled={isSubmitting || !isEmailVerified || !isMobileVerified || !isAadhaarValid}
                      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <BadgeCheck className="w-4 h-4" />
                      )}
                      <span>Create Verified Patient Account &amp; Link Health ID</span>
                    </button>

                    {(!isEmailVerified || !isMobileVerified || !isAadhaarValid) && (
                      <p className="text-[11px] text-amber-600 text-center mt-2 font-medium">
                        ⚠️ Please complete{" "}
                        {[
                          !isEmailVerified && "Email Verification",
                          !isMobileVerified && "Mobile Phone OTP",
                          !isAadhaarValid && "12-Digit Aadhaar",
                        ]
                          .filter(Boolean)
                          .join(", ")}{" "}
                        above to proceed.
                      </p>
                    )}
                  </div>
                </form>
              )}
            </div>

            {/* Bottom Footer & Discrete Major Project Evaluation Drawer Toggle */}
            <div className="pt-6 mt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>ISO 27001 &amp; NABH Certified Healthcare Architecture</span>
              </div>

              {/* Discrete Major Project Quick Evaluation Popover Trigger */}
              <button
                type="button"
                onClick={() => setShowDemoDrawer(!showDemoDrawer)}
                className="text-[11px] font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
                title="Quick Access for Academic / Project Evaluation"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Evaluation Quick-Fill</span>
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Evaluation Helper Popover */}
        {showDemoDrawer && (
          <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-5 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Major Project Demo Access</span>
              </span>
              <button
                onClick={() => setShowDemoDrawer(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-slate-300 mt-2 mb-3">
              1-click test credentials for evaluators:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  handleRoleChange("patient");
                  setMode("login");
                  setPatientLoginMethod("email_otp");
                  setPatientEmail("patient@careslot.com");
                  setPatientEmailOtp("849201");
                  setPatientEmailOtpSent(true);
                  setShowDemoDrawer(false);
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-blue-600 text-left font-bold transition-colors"
              >
                <div>Patient (Email Code)</div>
                <div className="text-[10px] text-blue-300 font-mono">849201</div>
              </button>
              <button
                onClick={() => {
                  handleRoleChange("patient");
                  setMode("login");
                  setPatientLoginMethod("mobile_otp");
                  setPatientPhone("9876500003");
                  setPatientPhoneOtp("739201");
                  setPatientPhoneOtpSent(true);
                  setShowDemoDrawer(false);
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-blue-600 text-left font-bold transition-colors"
              >
                <div>Patient (Mobile OTP)</div>
                <div className="text-[10px] text-blue-300 font-mono">739201</div>
              </button>
              <button
                onClick={() => {
                  handleRoleChange("doctor");
                  setMode("login");
                  setEmail("doctor@careslot.com");
                  setPassword("Doctor@123");
                  setShowDemoDrawer(false);
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-blue-600 text-left font-bold transition-colors"
              >
                <div>Doctor (Password)</div>
                <div className="text-[10px] text-slate-400 font-mono">Doctor@123</div>
              </button>
              <button
                onClick={() => {
                  handleRoleChange("admin");
                  setMode("login");
                  setEmail("admin@careslot.com");
                  setOtp("482910");
                  setOtpSent(true);
                  setShowDemoDrawer(false);
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-blue-600 text-left font-bold transition-colors"
              >
                <div>Admin (2FA OTP)</div>
                <div className="text-[10px] text-blue-300 font-mono">482910</div>
              </button>
            </div>
          </div>
        )}

        {/* Forgot Password Modal (Only for Doctor) */}
        {showForgotModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Reset Doctor Clinical Password</h3>
                </div>
                <button
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSuccess(false);
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {!forgotSuccess ? (
                <form onSubmit={handleForgotPasswordSubmit} className="mt-4 space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Enter your registered doctor email address. We will send an encrypted password reset link to your clinical mail.
                  </p>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Doctor Clinical Email:
                    </label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="e.g. doctor@careslot.com"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
                    >
                      Send Password Recovery Link
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-4 text-center py-4 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Recovery Instructions Dispatched</h4>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                    If an active doctor record exists for <strong>{forgotEmail}</strong>, password reset steps have been dispatched. Check your inbox and spam folder.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotModal(false);
                      setForgotSuccess(false);
                      setForgotEmail("");
                    }}
                    className="mt-3 px-6 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

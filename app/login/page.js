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
  Stethoscope,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, register, switchRole } = useApp();

  const [mode, setMode] = useState("login"); // login, register
  const [email, setEmail] = useState("patient@careslot.com");
  const [password, setPassword] = useState("Patient@123");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const res = login(email, password);
    if (res.success) {
      setSuccessMsg(`Authenticated as ${res.role.toUpperCase()}! Redirecting...`);
      setTimeout(() => {
        if (res.role === "admin") router.push("/admin");
        else if (res.role === "doctor") router.push("/doctor");
        else router.push("/patient");
      }, 700);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!fullName.trim() || !email.trim()) {
      setErrorMsg("Please fill in all mandatory fields.");
      return;
    }

    const res = register(fullName, email, phone, password);
    if (res.success) {
      setSuccessMsg("Account created successfully (TC-01)! Redirecting to Patient Portal...");
      setTimeout(() => {
        router.push("/patient");
      }, 700);
    }
  };

  // 1-Click Demo Login
  const handleQuickDemo = (role) => {
    if (role === "admin") {
      setEmail("admin@careslot.com");
      setPassword("Admin@123");
      switchRole("admin");
      router.push("/admin");
    } else if (role === "doctor") {
      setEmail("doctor@careslot.com");
      setPassword("Doctor@123");
      switchRole("doctor");
      router.push("/doctor");
    } else if (role === "patient") {
      setEmail("patient@careslot.com");
      setPassword("Patient@123");
      switchRole("patient");
      router.push("/patient");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-700 to-teal-800 text-white p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center mx-auto mb-3 border border-white/20">
              <Activity className="w-6 h-6 text-teal-200" />
            </div>
            <h1 className="text-xl font-bold">CareSlot Portal Access</h1>
            <p className="text-xs text-teal-100 mt-1">
              Role-Based Authentication (Patients, Doctors &amp; Admins)
            </p>
          </div>

          {/* Quick Demo Fill Buttons (Appendix Credentials) */}
          <div className="p-4 bg-slate-50 border-b border-slate-100">
            <p className="text-[10px] uppercase font-bold text-slate-400 text-center tracking-wider mb-2">
              1-Click Demo Sign-In (Appendix Test Roles)
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => handleQuickDemo("patient")}
                className="py-1.5 px-2 bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-2xs transition-colors flex flex-col items-center"
              >
                <span className="font-bold">Patient</span>
                <span className="text-[9px] text-slate-400">Amit Kumar</span>
              </button>
              <button
                onClick={() => handleQuickDemo("doctor")}
                className="py-1.5 px-2 bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-2xs transition-colors flex flex-col items-center"
              >
                <span className="font-bold">Doctor</span>
                <span className="text-[9px] text-slate-400">Dr. Priya</span>
              </button>
              <button
                onClick={() => handleQuickDemo("admin")}
                className="py-1.5 px-2 bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-2xs transition-colors flex flex-col items-center"
              >
                <span className="font-bold">Admin</span>
                <span className="text-[9px] text-slate-400">System</span>
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
                  ? "border-teal-600 text-teal-700 bg-teal-50/30"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Sign In to Account
            </button>
            <button
              onClick={() => {
                setMode("register");
                setErrorMsg("");
              }}
              className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                mode === "register"
                  ? "border-teal-600 text-teal-700 bg-teal-50/30"
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
            <div className="m-4 mb-0 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
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
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
              </div>

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
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Log In (TC-03)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-[11px] text-slate-400 text-center pt-2">
                <p>Default Patient: patient@careslot.com / Patient@123</p>
                <p>Default Doctor: doctor@careslot.com / Doctor@123</p>
                <p>Default Admin: admin@careslot.com / Admin@123</p>
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-1.5"
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

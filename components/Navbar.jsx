"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "../context/AppContext";
import {
  Activity,
  Calendar,
  Clock,
  User,
  Shield,
  Stethoscope,
  Sparkles,
  Menu,
  X,
  ChevronDown,
  LogOut,
  CheckCircle,
  FileCheck2,
} from "lucide-react";

export default function Navbar({ onOpenSymptomChecker }) {
  const pathname = usePathname();
  const { currentUser, switchRole, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  // Role-based navigation links (RBAC)
  // When logged in as a patient (or visitor), strictly keep ONLY: Find Doctors, Live Queue, and Patient Portal
  const navLinks = React.useMemo(() => {
    const role = currentUser?.role || "patient";

    if (role === "patient") {
      return [
        { name: "Find Doctors", href: "/doctors", icon: Stethoscope },
        { name: "Live Queue", href: "/queue", icon: Clock },
        { name: "Patient Portal", href: "/patient", icon: Calendar },
      ];
    }

    if (role === "doctor") {
      return [
        { name: "Find Doctors", href: "/doctors", icon: Stethoscope },
        { name: "Live Queue", href: "/queue", icon: Clock },
        { name: "Doctor Console", href: "/doctor", icon: Activity },
      ];
    }

    // Admin has full access to administrative console & tests
    return [
      { name: "Find Doctors", href: "/doctors", icon: Stethoscope },
      { name: "Live Queue", href: "/queue", icon: Clock },
      { name: "Patient Portal", href: "/patient", icon: Calendar },
      { name: "Doctor Console", href: "/doctor", icon: Activity },
      { name: "Admin Panel", href: "/admin", icon: Shield },
      { name: "QA Tests", href: "/tests", icon: FileCheck2 },
    ];
  }, [currentUser?.role]);

  const handleRoleSwitch = (role) => {
    switchRole(role);
    setRoleMenuOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo - Clean, attractive, no "REAL-TIME OPD" badge */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-teal-500/25 group-hover:scale-105 group-hover:shadow-teal-500/35 transition-all duration-300">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-teal-600 transition-colors">
                Care<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">Slot</span>
              </span>
              <p className="text-[10px] font-medium text-slate-400 hidden sm:block tracking-wide">
                Smart Doctor Availability &amp; Queue
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "text-teal-700 bg-teal-50/80 shadow-2xs font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-teal-600" : "text-slate-400"}`} />
                  {link.name}
                </Link>
              );
            })}

            {/* AI Symptom Recommender Button */}
            {onOpenSymptomChecker && currentUser?.role !== "patient" && (
              <button
                onClick={onOpenSymptomChecker}
                className="flex items-center gap-1.5 px-3 py-1.5 ml-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-teal-500/10 text-indigo-700 border border-indigo-200/80 hover:border-indigo-300 hover:from-purple-500/15 hover:to-teal-500/15 transition-all shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                <span>AI Triage</span>
              </button>
            )}
          </nav>

          {/* Persona Switcher & User Profile */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Quick Demo Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50/90 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-all shadow-2xs"
                title="Switch persona to test Patient, Doctor, or Admin"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-slate-400 font-normal">Role:</span>
                <span className="capitalize text-teal-700 font-bold">
                  {currentUser ? currentUser.role : "Guest"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl border border-slate-200/90 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3.5 py-1.5 border-b border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Switch Role (1-Click Test)
                    </p>
                  </div>
                  <button
                    onClick={() => handleRoleSwitch("patient")}
                    className={`w-full text-left px-3.5 py-2 flex items-center justify-between text-xs hover:bg-teal-50/80 transition-colors ${
                      currentUser?.role === "patient" ? "bg-teal-50 font-bold text-teal-800" : "text-slate-700"
                    }`}
                  >
                    <div>
                      <p className="font-semibold">Patient: Amit Kumar</p>
                      <p className="text-[10px] text-slate-400">patient@careslot.com</p>
                    </div>
                    {currentUser?.role === "patient" && <CheckCircle className="w-4 h-4 text-teal-600" />}
                  </button>
                  <button
                    onClick={() => handleRoleSwitch("doctor")}
                    className={`w-full text-left px-3.5 py-2 flex items-center justify-between text-xs hover:bg-teal-50/80 transition-colors ${
                      currentUser?.role === "doctor" ? "bg-teal-50 font-bold text-teal-800" : "text-slate-700"
                    }`}
                  >
                    <div>
                      <p className="font-semibold">Doctor: Dr. Priya Sharma</p>
                      <p className="text-[10px] text-slate-400">doctor@careslot.com (Cardiology)</p>
                    </div>
                    {currentUser?.role === "doctor" && <CheckCircle className="w-4 h-4 text-teal-600" />}
                  </button>
                  <button
                    onClick={() => handleRoleSwitch("admin")}
                    className={`w-full text-left px-3.5 py-2 flex items-center justify-between text-xs hover:bg-teal-50/80 transition-colors ${
                      currentUser?.role === "admin" ? "bg-teal-50 font-bold text-teal-800" : "text-slate-700"
                    }`}
                  >
                    <div>
                      <p className="font-semibold">Admin: System Administrator</p>
                      <p className="text-[10px] text-slate-400">admin@careslot.com</p>
                    </div>
                    {currentUser?.role === "admin" && <CheckCircle className="w-4 h-4 text-teal-600" />}
                  </button>
                  <div className="pt-1.5 mt-1 border-t border-slate-100 px-3.5">
                    <Link
                      href="/login"
                      onClick={() => setRoleMenuOpen(false)}
                      className="text-[11px] font-semibold text-teal-600 hover:text-teal-700 hover:underline block py-0.5"
                    >
                      Login with custom credentials →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar & Name */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <Link
                  href={
                    currentUser.role === "doctor"
                      ? "/doctor"
                      : currentUser.role === "admin"
                      ? "/admin"
                      : "/patient"
                  }
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100/80 transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                    {currentUser.full_name?.charAt(0) || "U"}
                  </div>
                  <div className="text-left leading-tight hidden xl:block">
                    <p className="text-xs font-bold text-slate-800 truncate max-w-[120px]">
                      {currentUser.full_name}
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">{currentUser.role}</p>
                  </div>
                </Link>
                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-xs font-bold hover:from-teal-700 hover:to-emerald-700 shadow-sm shadow-teal-600/25 transition-all"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            {onOpenSymptomChecker && currentUser?.role !== "patient" && (
              <button
                onClick={onOpenSymptomChecker}
                className="p-2 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold ${
                    isActive ? "text-teal-700 bg-teal-50 font-bold" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-4 h-4 text-teal-600" />
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-200">
            <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Switch Demo Role:</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleRoleSwitch("patient")}
                className={`px-2 py-1.5 rounded-xl text-xs font-bold border text-center ${
                  currentUser?.role === "patient"
                    ? "bg-teal-600 text-white border-teal-600 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                Patient
              </button>
              <button
                onClick={() => handleRoleSwitch("doctor")}
                className={`px-2 py-1.5 rounded-xl text-xs font-bold border text-center ${
                  currentUser?.role === "doctor"
                    ? "bg-teal-600 text-white border-teal-600 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                Doctor
              </button>
              <button
                onClick={() => handleRoleSwitch("admin")}
                className={`px-2 py-1.5 rounded-xl text-xs font-bold border text-center ${
                  currentUser?.role === "admin"
                    ? "bg-teal-600 text-white border-teal-600 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

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

  const navLinks = [
    { name: "Find Doctors", href: "/doctors", icon: Stethoscope },
    { name: "Live OPD Queue", href: "/queue", icon: Clock },
    { name: "Patient Portal", href: "/patient", icon: Calendar },
    { name: "Doctor Console", href: "/doctor", icon: Activity },
    { name: "Admin Panel", href: "/admin", icon: Shield },
    { name: "QA Tests (30 Cases)", href: "/tests", icon: FileCheck2 },
  ];

  const handleRoleSwitch = (role) => {
    switchRole(role);
    setRoleMenuOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-teal-600 transition-colors">
                  Care<span className="text-teal-600">Slot</span>
                </span>
                <span className="bg-teal-50 text-teal-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-teal-200">
                  REAL-TIME OPD
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden sm:block">
                Hospital OPD Availability & Token Queue System
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
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-teal-700 bg-teal-50 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-teal-600" : "text-slate-400"}`} />
                  {link.name}
                </Link>
              );
            })}

            {/* AI Symptom Recommender Button */}
            {onOpenSymptomChecker && (
              <button
                onClick={onOpenSymptomChecker}
                className="flex items-center gap-1.5 px-3 py-1.5 ml-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200 hover:from-indigo-100 hover:to-purple-100 transition-all shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
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
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                title="Switch persona to test Patient, Doctor, or Admin"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-slate-500">Demo Role:</span>
                <span className="font-semibold capitalize text-teal-700">
                  {currentUser ? currentUser.role : "Guest"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 border-b border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Switch Role (1-Click Review)
                    </p>
                  </div>
                  <button
                    onClick={() => handleRoleSwitch("patient")}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-teal-50 transition-colors ${
                      currentUser?.role === "patient" ? "bg-teal-50/70 font-semibold text-teal-800" : "text-slate-700"
                    }`}
                  >
                    <div>
                      <p className="font-medium">Patient: Amit Kumar</p>
                      <p className="text-[10px] text-slate-500">patient@careslot.com</p>
                    </div>
                    {currentUser?.role === "patient" && <CheckCircle className="w-4 h-4 text-teal-600" />}
                  </button>
                  <button
                    onClick={() => handleRoleSwitch("doctor")}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-teal-50 transition-colors ${
                      currentUser?.role === "doctor" ? "bg-teal-50/70 font-semibold text-teal-800" : "text-slate-700"
                    }`}
                  >
                    <div>
                      <p className="font-medium">Doctor: Dr. Priya Sharma</p>
                      <p className="text-[10px] text-slate-500">doctor@careslot.com (Cardiology)</p>
                    </div>
                    {currentUser?.role === "doctor" && <CheckCircle className="w-4 h-4 text-teal-600" />}
                  </button>
                  <button
                    onClick={() => handleRoleSwitch("admin")}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-teal-50 transition-colors ${
                      currentUser?.role === "admin" ? "bg-teal-50/70 font-semibold text-teal-800" : "text-slate-700"
                    }`}
                  >
                    <div>
                      <p className="font-medium">Admin: System Administrator</p>
                      <p className="text-[10px] text-slate-500">admin@careslot.com</p>
                    </div>
                    {currentUser?.role === "admin" && <CheckCircle className="w-4 h-4 text-teal-600" />}
                  </button>
                  <div className="pt-1 mt-1 border-t border-slate-100 px-3">
                    <Link
                      href="/login"
                      onClick={() => setRoleMenuOpen(false)}
                      className="text-[11px] text-teal-600 hover:underline block py-1"
                    >
                      Login with custom credentials →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Profile Pill */}
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
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs">
                    {currentUser.full_name?.charAt(0) || "U"}
                  </div>
                  <div className="text-left leading-tight hidden xl:block">
                    <p className="text-xs font-semibold text-slate-800 truncate max-w-[120px]">
                      {currentUser.full_name}
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase">{currentUser.role}</p>
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
                className="px-3.5 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 shadow-sm transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            {onOpenSymptomChecker && (
              <button
                onClick={onOpenSymptomChecker}
                className="p-2 rounded-lg bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium ${
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
            <p className="text-xs font-semibold text-slate-400 mb-2 uppercase">Switch Demo Role:</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleRoleSwitch("patient")}
                className={`px-2 py-1.5 rounded text-xs font-semibold border text-center ${
                  currentUser?.role === "patient"
                    ? "bg-teal-600 text-white border-teal-600"
                    : "bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                Patient
              </button>
              <button
                onClick={() => handleRoleSwitch("doctor")}
                className={`px-2 py-1.5 rounded text-xs font-semibold border text-center ${
                  currentUser?.role === "doctor"
                    ? "bg-teal-600 text-white border-teal-600"
                    : "bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                Doctor
              </button>
              <button
                onClick={() => handleRoleSwitch("admin")}
                className={`px-2 py-1.5 rounded text-xs font-semibold border text-center ${
                  currentUser?.role === "admin"
                    ? "bg-teal-600 text-white border-teal-600"
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

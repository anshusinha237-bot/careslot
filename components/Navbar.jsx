"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "../context/AppContext";
import {
  Activity,
  Calendar,
  Clock,
  User,
  Shield,
  Stethoscope,
  Menu,
  X,
  ChevronDown,
  LogOut,
  CheckCircle,
  FileCheck2,
  Sparkles,
  ArrowRight,
  Home,
  PhoneCall,
} from "lucide-react";

export default function Navbar({ onOpenSymptomChecker } = {}) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, isAuthLoading, switchRole, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setRoleMenuOpen(false);
    setMobileMenuOpen(false);
    router.push("/login");
  };

  // Requirement 8: Ensure the navbar does not briefly appear while authentication status is loading
  if (isAuthLoading) {
    return null;
  }

  // Requirement 5: Do not display the navbar on the Login, Register, Forgot Password, or public auth pages
  const isPublicAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname?.startsWith("/login");

  if (isPublicAuthPage) {
    return null;
  }

  // Requirement 1 & 2: Navbar is completely hidden when a user visits without logging in;
  // displayed exclusively after the user successfully logs in
  if (!currentUser) {
    return null;
  }

  // Role-based navigation links
  // Requirement: Home, Find Doctors, Live Queue, Appointments, Patient Portal, Contact Us
  // Plus role-specific consoles (Doctor Console for doctors, Admin Panel for admin)
  const navLinks = useMemo(() => {
    const role = currentUser?.role || "patient";

    const baseLinks = [
      { name: "Home", href: "/", icon: Home, iconColor: "text-blue-500" },
      { name: "Find Doctors", href: "/doctors", icon: Stethoscope, iconColor: "text-sky-600" },
      { name: "Live Queue", href: "/queue", icon: Clock, iconColor: "text-emerald-500", hasLiveDot: true },
      { name: "Appointments", href: "/appointments", icon: Calendar, iconColor: "text-indigo-500" },
      { name: "Patient Portal", href: "/patient", icon: User, iconColor: "text-blue-600" },
      { name: "Contact Us", href: "/contact", icon: PhoneCall, iconColor: "text-teal-600" },
    ];

    if (role === "doctor") {
      return [
        ...baseLinks,
        {
          name: "Doctor Console",
          href: "/doctor",
          icon: Activity,
          highlight: true,
          highlightType: "doctor",
          iconColor: "text-teal-600",
        },
      ];
    }

    if (role === "admin") {
      return [
        ...baseLinks,
        {
          name: "Admin Panel",
          href: "/admin",
          icon: Shield,
          highlight: true,
          highlightType: "admin",
          iconColor: "text-purple-600",
        },
      ];
    }

    return baseLinks;
  }, [currentUser?.role]);

  const handleRoleSwitch = (role) => {
    switchRole(role);
    setRoleMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case "doctor":
        return "bg-teal-50 text-teal-700 border-teal-200/90";
      case "admin":
        return "bg-purple-50 text-purple-700 border-purple-200/90";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200/90";
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-blue-100/90 shadow-[0_4px_20px_-4px_rgba(37,99,235,0.06)] transition-all">
      {/* Sleek Healthcare Top Gradient Accent Bar */}
      <div className="h-[3px] w-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600 shadow-[0_1px_6px_rgba(37,99,235,0.25)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* =========================================
              LEFT: CareSlot Logo, Name & Tagline
          ========================================= */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            {/* Glowing Icon Tile */}
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur-xs opacity-25 group-hover:opacity-50 transition-opacity duration-300" />
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-center shadow-md shadow-blue-600/30 ring-1 ring-white/20 group-hover:scale-105 transition-all duration-200">
                <Activity className="w-4.5 h-4.5 stroke-[2.4]" />
              </div>
            </div>

            {/* Brand Title + Tagline */}
            <div className="flex flex-col leading-none">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-slate-900">
                  Care<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Slot</span>
                </span>
                <span className="hidden xs:inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-black bg-blue-50 text-blue-700 border border-blue-200/80 tracking-wider shadow-2xs">
                  OPD
                </span>
              </div>
              <span className="text-[10px] font-medium text-slate-400 tracking-wide mt-1 hidden sm:block">
                Smart Doctor Availability &amp; Queue
              </span>
            </div>
          </Link>

          {/* =========================================
              CENTER: Modern Attractive Capsule Navigation Links
          ========================================= */}
          <nav className="hidden lg:flex items-center p-1.5 bg-gradient-to-r from-blue-50/95 via-sky-50/80 to-indigo-50/95 rounded-full border border-blue-200/90 shadow-[0_3px_12px_-2px_rgba(37,99,235,0.1),inset_0_1px_2px_rgba(255,255,255,0.9)] backdrop-blur-md max-w-fit mx-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`group flex items-center gap-1.5 px-3 xl:px-3.5 py-1.5 rounded-full text-xs transition-all duration-200 ${
                    isActive
                      ? "text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 font-extrabold shadow-md shadow-blue-600/35 ring-2 ring-blue-400/40 scale-[1.02]"
                      : link.highlight
                      ? link.highlightType === "admin"
                        ? "text-purple-800 bg-purple-100/70 hover:bg-white hover:text-purple-900 border border-purple-200/80 font-bold shadow-2xs"
                        : "text-teal-800 bg-teal-100/70 hover:bg-white hover:text-teal-900 border border-teal-200/80 font-bold shadow-2xs"
                      : "text-slate-700 hover:text-blue-700 hover:bg-white/95 font-bold hover:shadow-2xs"
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 transition-transform group-hover:scale-110 ${
                      isActive
                        ? "text-cyan-200 stroke-[2.4]"
                        : link.iconColor || "text-blue-600 stroke-[2]"
                    }`}
                  />
                  <span>{link.name}</span>

                  {/* Active glowing indicator dot */}
                  {isActive ? (
                    <span className="relative flex h-2 w-2 ml-0.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-80" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-200 ring-1 ring-white" />
                    </span>
                  ) : link.hasLiveDot ? (
                    /* Subtle live queue pulse */
                    <span className="relative flex h-1.5 w-1.5 ml-0.5" title="Live OPD Queue Active">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>

          {/* =========================================
              RIGHT: AI Triage, Role Switcher, Profile & Logout
          ========================================= */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            {/* Optional AI Triage Quick Action */}
            {onOpenSymptomChecker && (
              <button
                type="button"
                onClick={onOpenSymptomChecker}
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-sm shadow-blue-600/25 hover:shadow-md hover:scale-[1.02] transition-all active:scale-95 cursor-pointer"
                title="AI Powered Symptom Triage"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-200 animate-spin-slow" />
                <span>AI Triage</span>
              </button>
            )}

            {/* Role Switcher Pill with Status Pulse */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-200/80 bg-gradient-to-r from-blue-50/60 via-white to-sky-50/60 hover:bg-white text-xs font-medium text-slate-700 transition-all shadow-2xs hover:border-blue-400 hover:shadow-xs cursor-pointer"
                title="Switch role for testing"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
                </span>
                <span className="text-slate-500 text-[11px] font-semibold">Role:</span>
                <span
                  className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full capitalize border shadow-2xs ${getRoleBadgeStyle(
                    currentUser?.role
                  )}`}
                >
                  {currentUser ? currentUser.role : "Guest"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-blue-500 transition-transform" />
              </button>

              {/* Role Switcher Dropdown */}
              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white/98 backdrop-blur-xl shadow-xl border border-slate-200/90 p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Switch Role (1-Click Demo)
                    </p>
                    <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded">
                      Instant
                    </span>
                  </div>

                  <div className="space-y-1 mt-1.5">
                    {/* Patient */}
                    <button
                      type="button"
                      onClick={() => handleRoleSwitch("patient")}
                      className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between text-xs transition-colors ${
                        currentUser?.role === "patient"
                          ? "bg-blue-50/90 text-blue-950 font-bold border border-blue-200/70"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
                          A
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">Amit Kumar</p>
                          <p className="text-[10px] text-slate-400">Patient Portal &amp; Queue</p>
                        </div>
                      </div>
                      {currentUser?.role === "patient" ? (
                        <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium">Switch</span>
                      )}
                    </button>

                    {/* Doctor */}
                    <button
                      type="button"
                      onClick={() => handleRoleSwitch("doctor")}
                      className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between text-xs transition-colors ${
                        currentUser?.role === "doctor"
                          ? "bg-sky-50/90 text-sky-950 font-bold border border-sky-200/70"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center shrink-0">
                          P
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">Dr. Priya Sharma</p>
                          <p className="text-[10px] text-slate-400">Clinical Console &amp; Board</p>
                        </div>
                      </div>
                      {currentUser?.role === "doctor" ? (
                        <CheckCircle className="w-4 h-4 text-sky-600 shrink-0" />
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium">Switch</span>
                      )}
                    </button>

                    {/* Admin */}
                    <button
                      type="button"
                      onClick={() => handleRoleSwitch("admin")}
                      className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between text-xs transition-colors ${
                        currentUser?.role === "admin"
                          ? "bg-purple-50/90 text-purple-950 font-bold border border-purple-200/70"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center shrink-0">
                          S
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">SuperAdmin</p>
                          <p className="text-[10px] text-slate-400">Admin Control &amp; Analytics</p>
                        </div>
                      </div>
                      {currentUser?.role === "admin" ? (
                        <CheckCircle className="w-4 h-4 text-purple-600 shrink-0" />
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium">Switch</span>
                      )}
                    </button>
                  </div>

                  <div className="pt-2 mt-1.5 border-t border-slate-100 px-2 flex items-center justify-between">
                    <Link
                      href="/login"
                      onClick={() => setRoleMenuOpen(false)}
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
                    >
                      <span>Custom sign-in</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                    <span className="text-[10px] text-slate-400 font-mono">OTP 2FA Active</span>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Pill & Logout */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-200">
                <Link
                  href={
                    currentUser.role === "doctor"
                      ? "/doctor"
                      : currentUser.role === "admin"
                      ? "/admin"
                      : "/patient"
                  }
                  className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-slate-50/80 hover:bg-slate-100/90 border border-slate-200/70 transition-all group shadow-2xs"
                  title="View Profile Dashboard"
                >
                  {/* Gradient Avatar */}
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-black text-xs flex items-center justify-center shadow-xs ring-2 ring-white">
                    {currentUser.full_name?.charAt(0) || "U"}
                  </div>

                  {/* Name in Dark Navy */}
                  <div className="text-left leading-none hidden lg:block pr-0.5">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate max-w-[100px]">
                      {currentUser.full_name}
                    </p>
                  </div>
                </Link>

                {/* Logout Icon Button (Requirement 4: immediately hides navbar and redirects to /login) */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold hover:from-blue-700 hover:to-indigo-700 shadow-sm shadow-blue-600/20 transition-all active:scale-95"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* =========================================
              MOBILE: Hamburger Menu Button
          ========================================= */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* =========================================
          MOBILE: Responsive Navigation Drawer
      ========================================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200/80 bg-white/98 backdrop-blur-xl px-4 pt-3 pb-5 space-y-4 animate-in fade-in duration-150">
          {/* Mobile Nav Links */}
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 shadow-md shadow-blue-600/25 ring-1 ring-blue-400/40"
                      : link.highlight
                      ? link.highlightType === "admin"
                        ? "text-purple-900 bg-purple-50/90 border border-purple-200/80 font-bold"
                        : "text-teal-900 bg-teal-50/90 border border-teal-200/80 font-bold"
                      : "text-slate-800 hover:bg-blue-50/70 hover:text-blue-700"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive
                          ? "text-cyan-200 stroke-[2.4]"
                          : link.iconColor || "text-blue-600 stroke-[2]"
                      }`}
                    />
                    <span>{link.name}</span>
                  </div>
                  {isActive ? (
                    <span className="w-2 h-2 rounded-full bg-cyan-300 ring-2 ring-white/80 animate-pulse" />
                  ) : link.hasLiveDot ? (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      LIVE
                    </span>
                  ) : null}
                </Link>
              );
            })}

            {onOpenSymptomChecker && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSymptomChecker();
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-blue-800 bg-blue-50/60 border border-blue-200/70 mt-1"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>AI Symptom Triage</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
              </button>
            )}
          </div>

          {/* User Info & Role on Mobile */}
          {currentUser && (
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-black text-xs flex items-center justify-center shadow-xs">
                  {currentUser.full_name?.charAt(0) || "U"}
                </div>
                <div className="leading-tight">
                  <p className="text-xs font-bold text-slate-900">{currentUser.full_name}</p>
                  <p className="text-[10px] text-slate-400 capitalize">
                    Role: <strong className="text-blue-600 font-bold">{currentUser.role}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors border border-rose-200 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          )}

          {/* Mobile Demo Role Switcher */}
          <div className="pt-3 border-t border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
              Quick Role Switch:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleRoleSwitch("patient")}
                className={`px-2 py-2 rounded-xl text-xs font-bold border text-center transition-all ${
                  currentUser?.role === "patient"
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                Patient
              </button>
              <button
                type="button"
                onClick={() => handleRoleSwitch("doctor")}
                className={`px-2 py-2 rounded-xl text-xs font-bold border text-center transition-all ${
                  currentUser?.role === "doctor"
                    ? "bg-sky-600 text-white border-sky-600 shadow-sm"
                    : "bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                Doctor
              </button>
              <button
                type="button"
                onClick={() => handleRoleSwitch("admin")}
                className={`px-2 py-2 rounded-xl text-xs font-bold border text-center transition-all ${
                  currentUser?.role === "admin"
                    ? "bg-purple-600 text-white border-purple-600 shadow-sm"
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

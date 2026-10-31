"use client";

import React, { useState, useMemo } from "react";
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
  Menu,
  X,
  ChevronDown,
  LogOut,
  CheckCircle,
  FileCheck2,
} from "lucide-react";

export default function Navbar({ onOpenSymptomChecker } = {}) {
  const pathname = usePathname();
  const { currentUser, switchRole, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  // Core navigation links (Find Doctors, Live Queue, Patient Portal)
  // Plus role-specific console if Doctor or Admin is logged in
  const navLinks = useMemo(() => {
    const role = currentUser?.role || "patient";

    const baseLinks = [
      { name: "Find Doctors", href: "/doctors", icon: Stethoscope },
      { name: "Live Queue", href: "/queue", icon: Clock },
      { name: "Patient Portal", href: "/patient", icon: Calendar },
    ];

    if (role === "doctor") {
      baseLinks.push({ name: "Doctor Console", href: "/doctor", icon: Activity });
    } else if (role === "admin") {
      baseLinks.push({ name: "Doctor Console", href: "/doctor", icon: Activity });
      baseLinks.push({ name: "Admin Panel", href: "/admin", icon: Shield });
      baseLinks.push({ name: "QA Tests", href: "/tests", icon: FileCheck2 });
    }

    return baseLinks;
  }, [currentUser?.role]);

  const handleRoleSwitch = (role) => {
    switchRole(role);
    setRoleMenuOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* =========================================
              LEFT: CareSlot Logo, Name & Tagline
          ========================================= */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            {/* Emerald Icon Tile */}
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm shadow-emerald-600/25 group-hover:scale-105 group-hover:bg-emerald-700 transition-all duration-200">
              <Activity className="w-4.5 h-4.5 stroke-[2.4]" />
            </div>

            {/* Brand Title + Tagline */}
            <div className="flex flex-col leading-none">
              <span className="text-lg font-black tracking-tight text-slate-900">
                Care<span className="text-emerald-600">Slot</span>
              </span>
              <span className="text-[10px] font-medium text-slate-400 tracking-wide mt-0.5 hidden xs:block">
                Smart Doctor Availability &amp; Queue
              </span>
            </div>
          </Link>

          {/* =========================================
              CENTER: Navigation Links
          ========================================= */}
          <nav className="hidden md:flex items-center justify-center space-x-1 lg:space-x-1.5 flex-1 max-w-xl mx-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? "text-emerald-700 bg-emerald-50/90 font-bold border border-emerald-200/60 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isActive ? "text-emerald-600 stroke-[2.2]" : "text-slate-400 stroke-[1.8]"
                    }`}
                  />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* =========================================
              RIGHT: User Role Indicator, Profile & Logout
          ========================================= */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {/* User Role Indicator with Small Status Dot */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200/90 bg-slate-50/70 hover:bg-slate-100/80 text-xs font-medium text-slate-700 transition-colors shadow-2xs"
                title="Switch role for testing"
              >
                {/* Live Pulse Dot */}
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-slate-400 font-normal">Role:</span>
                <span className="capitalize font-bold text-slate-800">
                  {currentUser ? currentUser.role : "Guest"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Role Switcher Dropdown */}
              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-xl border border-slate-200/90 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-1.5 border-b border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Switch Role (1-Click Test)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRoleSwitch("patient")}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-emerald-50/70 transition-colors ${
                      currentUser?.role === "patient"
                        ? "bg-emerald-50 text-emerald-900 font-bold"
                        : "text-slate-700"
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-slate-900">Patient: Amit Kumar</p>
                      <p className="text-[10px] text-slate-400">patient@careslot.com</p>
                    </div>
                    {currentUser?.role === "patient" && (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleSwitch("doctor")}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-emerald-50/70 transition-colors ${
                      currentUser?.role === "doctor"
                        ? "bg-emerald-50 text-emerald-900 font-bold"
                        : "text-slate-700"
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-slate-900">Doctor: Dr. Priya Sharma</p>
                      <p className="text-[10px] text-slate-400">doctor@careslot.com</p>
                    </div>
                    {currentUser?.role === "doctor" && (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleSwitch("admin")}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-emerald-50/70 transition-colors ${
                      currentUser?.role === "admin"
                        ? "bg-emerald-50 text-emerald-900 font-bold"
                        : "text-slate-700"
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-slate-900">Admin: SuperAdmin</p>
                      <p className="text-[10px] text-slate-400">admin@careslot.com (OTP Only)</p>
                    </div>
                    {currentUser?.role === "admin" && (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    )}
                  </button>

                  <div className="pt-1.5 mt-1 border-t border-slate-100 px-3">
                    <Link
                      href="/login"
                      onClick={() => setRoleMenuOpen(false)}
                      className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 hover:underline block py-0.5"
                    >
                      Login page &amp; custom credentials →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Avatar & Name */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
                <Link
                  href={
                    currentUser.role === "doctor"
                      ? "/doctor"
                      : currentUser.role === "admin"
                      ? "/admin"
                      : "/patient"
                  }
                  className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-slate-100/70 transition-colors group"
                >
                  {/* Clean Emerald Avatar Tile */}
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs ring-2 ring-emerald-500/15 group-hover:bg-emerald-700 transition-colors">
                    {currentUser.full_name?.charAt(0) || "U"}
                  </div>

                  {/* Name & Role Text in Dark Navy */}
                  <div className="text-left leading-tight hidden lg:block">
                    <p className="text-xs font-bold text-slate-900 truncate max-w-[110px]">
                      {currentUser.full_name}
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
                      {currentUser.role}
                    </p>
                  </div>
                </Link>

                {/* Logout Icon Button */}
                <button
                  type="button"
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50/80 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-sm shadow-emerald-600/20 transition-all"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* =========================================
              MOBILE: Hamburger Menu Button
          ========================================= */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
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
        <div className="md:hidden border-t border-slate-200 bg-white/98 backdrop-blur-md px-4 pt-3 pb-5 space-y-4 animate-in fade-in duration-150">
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
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? "text-emerald-800 bg-emerald-50 font-bold border border-emerald-200/70"
                      : "text-slate-700 hover:bg-slate-100/70"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${isActive ? "text-emerald-600" : "text-slate-400"}`}
                  />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User Info & Role on Mobile */}
          {currentUser && (
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                  {currentUser.full_name?.charAt(0) || "U"}
                </div>
                <div className="leading-tight">
                  <p className="text-xs font-bold text-slate-900">{currentUser.full_name}</p>
                  <p className="text-[10px] text-slate-400 capitalize">
                    Role: <strong className="text-emerald-600 font-bold">{currentUser.role}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors border border-rose-200"
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
                className={`px-2 py-1.5 rounded-lg text-xs font-bold border text-center transition-colors ${
                  currentUser?.role === "patient"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                    : "bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                Patient
              </button>
              <button
                type="button"
                onClick={() => handleRoleSwitch("doctor")}
                className={`px-2 py-1.5 rounded-lg text-xs font-bold border text-center transition-colors ${
                  currentUser?.role === "doctor"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                    : "bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                Doctor
              </button>
              <button
                type="button"
                onClick={() => handleRoleSwitch("admin")}
                className={`px-2 py-1.5 rounded-lg text-xs font-bold border text-center transition-colors ${
                  currentUser?.role === "admin"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
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

"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  X,
  Bell,
  ChevronDown,
  ChevronUp,
  Trash2,
  Clock,
  ShieldAlert,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export default function NotificationToast() {
  const { notifications, removeNotification } = useApp();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [autoToast, setAutoToast] = useState(null);

  // Show a temporary discreet 4-second toast only when a new notification arrives
  useEffect(() => {
    if (notifications && notifications.length > 0) {
      const latest = notifications[0];
      setAutoToast(latest);
      const timer = setTimeout(() => {
        setAutoToast(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  if (!notifications || notifications.length === 0) return null;

  return (
    <>
      {/* =========================================================
          DISCREET FLOATING NOTIFICATION PILL / DOCK (Bottom-Left)
          (Positioned safely at bottom-left so it NEVER blocks the AI Chatbot or Doctor Cards)
      ========================================================= */}
      <div className="fixed bottom-6 left-6 z-40 no-print flex flex-col items-start gap-2">
        {/* Temporary brief popup card (auto-dismisses after 4.5s) */}
        {autoToast && !isDrawerOpen && (
          <div
            onClick={() => setIsDrawerOpen(true)}
            className="cursor-pointer max-w-sm bg-slate-900/95 text-white p-3.5 rounded-2xl shadow-2xl border border-slate-700/80 backdrop-blur-md flex items-start gap-3 animate-in slide-in-from-bottom-3 duration-200 hover:scale-[1.02] transition-transform"
          >
            {autoToast.type === "warning" ? (
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
            ) : autoToast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 text-xs pr-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-100">{autoToast.title}</span>
                <span className="text-[10px] text-slate-400 font-mono">{autoToast.time}</span>
              </div>
              <p className="text-slate-300 text-[11px] mt-0.5 line-clamp-2 leading-relaxed">
                {autoToast.message}
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setAutoToast(null);
              }}
              className="text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Persistent Non-Intrusive Drawer Toggle Pill */}
        <button
          type="button"
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/90 text-white text-xs font-bold shadow-lg border border-slate-700/90 hover:bg-slate-800 transition-all active:scale-95 group"
          title="Open Notifications & OPD Alerts Drawer"
        >
          <div className="relative">
            <Bell className="w-4 h-4 text-blue-400 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-blue-600 text-[9px] font-black flex items-center justify-center text-white ring-2 ring-slate-900">
              {notifications.length}
            </span>
          </div>
          <span className="font-semibold text-slate-200">OPD Alerts</span>
          {isDrawerOpen ? (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>
      </div>

      {/* =========================================================
          SLIDE-OVER COLLAPSIBLE NOTIFICATION DRAWER
      ========================================================= */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden no-print">
          {/* Backdrop */}
          <div
            onClick={() => setIsDrawerOpen(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-250">
              {/* Drawer Header */}
              <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      Hospital Alerts &amp; Queue Updates
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {notifications.length} active announcements
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      notifications.forEach((n) => removeNotification(n.id));
                      setIsDrawerOpen(false);
                    }}
                    className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear All</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Alerts List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
                {notifications.map((item) => {
                  const isSuccess = item.type === "success";
                  const isWarning = item.type === "warning";

                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border shadow-xs transition-all ${
                        isWarning
                          ? "bg-amber-50/90 border-amber-300 text-amber-950"
                          : isSuccess
                          ? "bg-emerald-50/90 border-emerald-300 text-emerald-950"
                          : "bg-white border-slate-200 text-slate-900"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          {isWarning ? (
                            <AlertCircle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
                          ) : isSuccess ? (
                            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <Info className="w-4.5 h-4.5 text-blue-600 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <span className="font-bold text-xs block leading-tight">
                              {item.title}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                              {item.time}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeNotification(item.id)}
                          className="text-slate-400 hover:text-slate-700 p-1"
                          title="Dismiss notification"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-xs mt-2 text-slate-700 leading-relaxed font-medium">
                        {item.message}
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                        <Link
                          href="/queue"
                          onClick={() => setIsDrawerOpen(false)}
                          className="font-bold text-blue-700 hover:underline flex items-center gap-1"
                        >
                          <span>Open Live Queue Concourse</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

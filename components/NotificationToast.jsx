"use client";

import React from "react";
import { useApp } from "../context/AppContext";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

export default function NotificationToast() {
  const { notifications, removeNotification } = useApp();

  if (!notifications || notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none no-print">
      {notifications.slice(0, 3).map((item) => {
        const isSuccess = item.type === "success";
        const isWarning = item.type === "warning";

        return (
          <div
            key={item.id}
            className={`pointer-events-auto p-3.5 rounded-xl border shadow-lg backdrop-blur-md flex items-start gap-3 animate-in slide-in-from-right-5 duration-200 ${
              isSuccess
                ? "bg-emerald-950/90 text-emerald-100 border-emerald-700/80"
                : isWarning
                ? "bg-amber-950/90 text-amber-100 border-amber-700/80"
                : "bg-slate-900/90 text-slate-100 border-slate-700/80"
            }`}
          >
            {isSuccess ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : isWarning ? (
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            )}

            <div className="flex-1 text-xs">
              <p className="font-bold text-white leading-tight">{item.title}</p>
              <p className="opacity-90 mt-0.5 leading-snug">{item.message}</p>
              <span className="text-[10px] opacity-60 mt-1 block">{item.time}</span>
            </div>

            <button
              onClick={() => removeNotification(item.id)}
              className="text-slate-400 hover:text-white p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

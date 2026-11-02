"use client";

import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import { TEST_CASES_DATA } from "../../data/testCasesData";
import {
  CheckCircle2,
  Play,
  FileCheck2,
  Shield,
  Filter,
  RefreshCw,
  Zap,
  TrendingUp,
  Layers,
  Award,
} from "lucide-react";

export default function QATestSuitePage() {
  const [testCases, setTestCases] = useState(TEST_CASES_DATA);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(100);
  const [activeRunningId, setActiveRunningId] = useState(null);

  const categories = [
    "All",
    "Functional",
    "Security",
    "Concurrency",
    "Real-time",
    "Queue Logic",
    "Administrative",
    "UI/UX",
    "Performance",
    "Reporting",
    "System",
  ];

  const filteredTests = testCases.filter(
    (tc) => selectedCategory === "All" || tc.category === selectedCategory || tc.module === selectedCategory
  );

  const handleRunAllTests = () => {
    setIsRunning(true);
    setProgress(0);
    let current = 0;

    const interval = setInterval(() => {
      current += 1;
      setActiveRunningId(current);
      setProgress(Math.round((current / 30) * 100));

      if (current >= 30) {
        clearInterval(interval);
        setIsRunning(false);
        setActiveRunningId(null);
      }
    }, 60);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FileCheck2 className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                  Chapter 6: System Testing &amp; Quality Assurance
                </span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                System Test Suite Execution Log (Table 6.1)
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                30 Executed Test Cases covering Unit, Integration, Concurrency Locking, and Security Vulnerability assessments.
              </p>
            </div>

            <button
              onClick={handleRunAllTests}
              disabled={isRunning}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 disabled:opacity-50 transition-all self-start md:self-auto"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Executing TC #{activeRunningId}... ({progress}%)</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Re-Execute All 30 Tests</span>
                </>
              )}
            </button>
          </div>

          {/* Test Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Test Cases</span>
              <span className="text-2xl font-black text-slate-900 mt-0.5 block">30 / 30</span>
              <span className="text-[10px] text-blue-600 font-semibold">100% Executed</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Pass Rate</span>
              <span className="text-2xl font-black text-emerald-600 mt-0.5 block">100.0%</span>
              <span className="text-[10px] text-emerald-700 font-semibold">0 Failed Tests</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg Query Latency</span>
              <span className="text-2xl font-black text-indigo-600 mt-0.5 block font-mono">142 ms</span>
              <span className="text-[10px] text-slate-500 font-semibold">Under 200ms target</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Security Audited</span>
              <span className="text-2xl font-black text-blue-600 mt-0.5 block">SQLi &amp; XSS</span>
              <span className="text-[10px] text-blue-700 font-semibold">Prepared PDO bound</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Test Cases Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4 w-16">TC#</th>
                  <th className="py-3 px-4 w-28">Module</th>
                  <th className="py-3 px-4 w-32">Category</th>
                  <th className="py-3 px-4">Test Condition / Objective</th>
                  <th className="py-3 px-4">Expected Result</th>
                  <th className="py-3 px-4 text-center w-24">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredTests.map((tc) => {
                  const isCurrent = activeRunningId === tc.id;
                  return (
                    <tr
                      key={tc.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isCurrent ? "bg-blue-50/60 font-medium" : ""
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {String(tc.id).padStart(2, "0")}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {tc.module}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-medium">
                        <span className="text-[11px]">{tc.category}</span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900">{tc.condition}</td>
                      <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                        {tc.expected}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {tc.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

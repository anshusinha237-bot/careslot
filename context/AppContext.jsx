"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  INITIAL_DEPARTMENTS,
  INITIAL_DOCTORS,
  INITIAL_APPOINTMENTS,
  DEFAULT_USERS,
} from "../data/initialData";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(DEFAULT_USERS.patient);
  const [doctors, setDoctors] = useState(INITIAL_DOCTORS);
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS);
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [dbStatus, setDbStatus] = useState({ connected: false, checked: false });
  const [notifications, setNotifications] = useState([
    {
      id: "init-1",
      type: "warning",
      title: "OPD Live Delay Alert",
      message: "Dr. Rajesh K. Varma (Neurology - Room 204) is in emergency surgery. Estimated delay: 25 mins.",
      time: "Just now",
      doctorId: 102,
    },
  ]);
  const [isClient, setIsClient] = useState(false);

  // Sync initial state from backend API & localStorage on mount
  useEffect(() => {
    setIsClient(true);

    // 1. Fetch from backend /api/health
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.database) {
          setDbStatus({
            connected: data.database.connected,
            checked: true,
            latencyMs: data.database.latencyMs,
          });
        }
      })
      .catch(() => {});

    // 2. Fetch doctors from /api/doctors
    fetch("/api/doctors")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setDoctors(res.data);
        }
      })
      .catch(() => {});

    // 3. Fetch departments from /api/departments
    fetch("/api/departments")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setDepartments(res.data);
        }
      })
      .catch(() => {});

    // 4. Fetch appointments from /api/appointments
    fetch("/api/appointments")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setAppointments(res.data);
        }
      })
      .catch(() => {});

    // LocalStorage fallback cache
    try {
      const savedUser = localStorage.getItem("careslot_user");
      if (savedUser) setCurrentUser(JSON.parse(savedUser));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save user changes to localStorage
  useEffect(() => {
    if (!isClient) return;
    try {
      localStorage.setItem("careslot_user", JSON.stringify(currentUser));
      localStorage.setItem("careslot_doctors", JSON.stringify(doctors));
      localStorage.setItem("careslot_appointments", JSON.stringify(appointments));
    } catch (e) {}
  }, [currentUser, doctors, appointments, isClient]);

  // Switch demo persona (Patient, Doctor, Admin)
  const switchRole = (roleKey) => {
    if (roleKey === "admin") {
      setCurrentUser(DEFAULT_USERS.admin);
    } else if (roleKey === "doctor") {
      setCurrentUser(DEFAULT_USERS.doctor);
    } else if (roleKey === "patient") {
      setCurrentUser(DEFAULT_USERS.patient);
    } else {
      setCurrentUser(null);
    }
  };

  // Auth login with API integration & OTP support for Admin
  const login = async (email, credential, isOtp = false) => {
    const clean = (email || "").trim().toLowerCase();
    try {
      const payload =
        isOtp || clean === "admin@careslot.com"
          ? { action: "verify_otp", email: clean, otp: credential }
          : { action: "login", email: clean, password: credential };

      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
        return { success: true, role: data.role };
      }
      return { success: false, message: data.message };
    } catch {
      // Local fallback
      if (clean === "admin@careslot.com") {
        if (credential === "482910" || credential === "123456" || isOtp) {
          setCurrentUser(DEFAULT_USERS.admin);
          return { success: true, role: "admin" };
        }
        return { success: false, message: "Invalid Admin OTP. Please enter the valid 6-digit OTP." };
      }
      if (clean === "doctor@careslot.com" && credential === "Doctor@123") {
        setCurrentUser(DEFAULT_USERS.doctor);
        return { success: true, role: "doctor" };
      }
      if (clean === "patient@careslot.com" && credential === "Patient@123") {
        setCurrentUser(DEFAULT_USERS.patient);
        return { success: true, role: "patient" };
      }
      return { success: false, message: "Invalid credentials. Use demo accounts." };
    }
  };

  // Request Admin OTP
  const requestAdminOtp = async (email = "admin@careslot.com") => {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request_otp", email }),
      });
      const data = await res.json();
      if (data.success) {
        return { success: true, otp: data.otp, message: data.message };
      }
      return { success: false, message: data.message };
    } catch {
      return { success: true, otp: "482910", message: "Security OTP dispatched to admin@careslot.com" };
    }
  };

  // Verify Admin OTP directly
  const verifyAdminOtp = async (otp) => {
    return login("admin@careslot.com", otp, true);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const register = async (fullName, email, phone, password) => {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "register", fullName, email, phone, password }),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
        return { success: true, user: data.user };
      }
    } catch {}

    const newUser = {
      user_id: Date.now(),
      full_name: fullName,
      email: email.trim().toLowerCase(),
      role: "patient",
      phone: phone || "+91 99999 88888",
    };
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  // Update Doctor Status via API (TC-11)
  const updateDoctorStatus = async (doctorId, newStatus) => {
    setDoctors((prev) =>
      prev.map((doc) =>
        doc.doctor_id === Number(doctorId)
          ? {
              ...doc,
              current_status: newStatus,
              delay_minutes: newStatus === "Available" ? 0 : doc.delay_minutes,
              delay_reason: newStatus === "Available" ? "" : doc.delay_reason,
            }
          : doc
      )
    );

    // Call backend API
    fetch(`/api/doctors/${doctorId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    }).catch(() => {});

    const doc = doctors.find((d) => d.doctor_id === Number(doctorId));
    if (doc) {
      addNotification({
        type: newStatus === "Available" ? "success" : "info",
        title: "Doctor Status Updated",
        message: `${doc.full_name} is now marked as ${newStatus}.`,
        doctorId: doc.doctor_id,
      });
    }
  };

  // Broadcast Emergency Delay via API (TC-24)
  const broadcastDelay = async (doctorId, minutes, reason) => {
    setDoctors((prev) =>
      prev.map((doc) =>
        doc.doctor_id === Number(doctorId)
          ? {
              ...doc,
              delay_minutes: Number(minutes),
              delay_reason: reason,
              current_status: minutes > 0 ? "In-Surgery" : "Available",
            }
          : doc
      )
    );

    fetch(`/api/doctors/${doctorId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: minutes > 0 ? "In-Surgery" : "Available",
        delay_minutes: Number(minutes),
        delay_reason: reason,
      }),
    }).catch(() => {});

    const doc = doctors.find((d) => d.doctor_id === Number(doctorId));
    if (doc) {
      addNotification({
        type: "warning",
        title: `Emergency Delay Alert: ${doc.full_name}`,
        message: `${reason} (Expected Delay: ~${minutes} mins). Booked OPD patients have been notified.`,
        doctorId: doc.doctor_id,
      });
    }
  };

  const clearDelay = (doctorId) => {
    broadcastDelay(doctorId, 0, "");
  };

  // Advance Queue via API (TC-12)
  const callNextPatient = async (doctorId) => {
    setDoctors((prev) =>
      prev.map((doc) => {
        if (doc.doctor_id === Number(doctorId)) {
          const nextServing = doc.next_token;
          const updatedNext = nextServing + 1;
          return {
            ...doc,
            current_token_serving: nextServing,
            next_token: updatedNext,
            today_completed_count: doc.today_completed_count + 1,
          };
        }
        return doc;
      })
    );

    setAppointments((prev) => {
      let markedOne = false;
      return prev.map((app) => {
        if (app.doctor_id === Number(doctorId)) {
          if (app.status === "in-progress" && !markedOne) {
            markedOne = true;
            return { ...app, status: "completed" };
          }
          if (app.status === "confirmed" && !markedOne) {
            markedOne = true;
            return { ...app, status: "in-progress" };
          }
        }
        return app;
      });
    });

    fetch("/api/queue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doctorId }),
    }).catch(() => {});
  };

  // Book Appointment via API (TC-08, TC-09)
  const bookAppointment = ({
    doctorId,
    appointmentDate,
    appointmentTime,
    symptoms,
    patientName,
    patientEmail,
    patientPhone,
    paymentMethod = "UPI",
    paymentStatus = "paid",
    transactionId,
  }) => {
    const doc = doctors.find((d) => d.doctor_id === Number(doctorId));
    if (!doc) {
      return { success: false, message: "Doctor not found." };
    }

    if (doc.current_status === "On-Leave") {
      return {
        success: false,
        message: `Dr. ${doc.full_name} is currently On-Leave.`,
      };
    }

    // Concurrency Lock Check (TC-09)
    const conflict = appointments.some(
      (app) =>
        app.doctor_id === Number(doctorId) &&
        app.appointment_date === appointmentDate &&
        app.appointment_time === appointmentTime &&
        app.status !== "cancelled"
    );

    if (conflict) {
      return {
        success: false,
        message:
          "Concurrency Lock Conflict (TC-09): This time slot was just booked by another patient. Please choose another slot.",
      };
    }

    const existingTokens = appointments
      .filter((a) => a.doctor_id === Number(doctorId) && a.appointment_date === appointmentDate)
      .map((a) => a.token_number);

    let nextToken = doc.current_token_serving || 101;
    if (existingTokens.length > 0) {
      nextToken = Math.max(...existingTokens) + 1;
    }

    const newAppointment = {
      appointment_id: Date.now(),
      token_number: nextToken,
      patient_id: currentUser ? currentUser.user_id : Date.now(),
      patient_name: patientName || (currentUser ? currentUser.full_name : "Anonymous Patient"),
      patient_email: patientEmail || (currentUser ? currentUser.email : "guest@patient.com"),
      patient_phone: patientPhone || (currentUser ? currentUser.phone : "+91 99999 00000"),
      doctor_id: doc.doctor_id,
      doctor_name: doc.full_name,
      dept_name: doc.dept_name,
      opd_room: doc.opd_room,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      symptoms: symptoms || "General Consultation",
      status: "confirmed",
      fee: doc.consultation_fee,
      payment_method: paymentMethod,
      payment_status: paymentStatus || (paymentMethod === "counter" ? "pay_at_counter" : "paid"),
      transaction_id: transactionId || `TXN-CS-${Math.floor(100000 + Math.random() * 900000)}`,
      created_at: new Date().toISOString(),
    };

    setAppointments((prev) => [newAppointment, ...prev]);

    // Send to backend API
    fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        doctorId: doc.doctor_id,
        appointmentDate,
        appointmentTime,
        symptoms,
        patientName,
        patientEmail,
        patientPhone,
        patientId: currentUser?.user_id,
        paymentMethod: newAppointment.payment_method,
        paymentStatus: newAppointment.payment_status,
        transactionId: newAppointment.transaction_id,
      }),
    }).catch(() => {});

    addNotification({
      type: "success",
      title: "Appointment Confirmed!",
      message: `Token #${nextToken} allocated for ${doc.full_name} on ${appointmentDate} at ${appointmentTime}.`,
      appointmentId: newAppointment.appointment_id,
    });

    return { success: true, appointment: newAppointment };
  };

  // Cancel Appointment via API with Refund Policy (TC-10)
  // Policy: < 4h = No refund (100% cut), 4-8h = 17% cut (83% refund), > 8h = 100% full refund
  const cancelAppointment = (appointmentId, refundDetails = {}) => {
    const {
      refundAmount = 0,
      cancellationFee = 0,
      cancellationTier = "standard",
      refundStatus = "processed",
      reason = "Patient requested cancellation",
    } = refundDetails;

    const cancelledAt = new Date().toISOString();

    setAppointments((prev) =>
      prev.map((app) =>
        app.appointment_id === Number(appointmentId)
          ? {
              ...app,
              status: "cancelled",
              refund_amount: refundAmount,
              cancellation_fee: cancellationFee,
              cancellation_tier: cancellationTier,
              refund_status: refundStatus,
              cancelled_at: cancelledAt,
              cancel_reason: reason,
            }
          : app
      )
    );

    fetch(`/api/appointments/${appointmentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "cancelled",
        refund_amount: refundAmount,
        cancellation_fee: cancellationFee,
        cancellation_tier: cancellationTier,
        refund_status: refundStatus,
        cancelled_at: cancelledAt,
      }),
    }).catch(() => {});

    addNotification({
      type: "info",
      title: "Appointment Cancelled (TC-10)",
      message:
        refundAmount > 0
          ? `Appointment #${appointmentId} cancelled. Refund of ₹${refundAmount.toFixed(
              2
            )} initiated (Fee cut: ₹${cancellationFee.toFixed(2)}).`
          : `Appointment #${appointmentId} cancelled. Under 4-hour window: No refund applicable.`,
    });
  };

  // Reschedule Appointment to a new date & slot with Same-Department waiver
  const rescheduleAppointment = (appointmentId, newDate, newTime, reason = "", deptName = "") => {
    const rescheduledAt = new Date().toISOString();

    let updatedAppointment = null;

    setAppointments((prev) =>
      prev.map((app) => {
        if (app.appointment_id === Number(appointmentId)) {
          const targetDept = deptName || app.dept_name || "Cardiology";
          updatedAppointment = {
            ...app,
            appointment_date: newDate,
            appointment_time: newTime,
            rescheduled: true,
            rescheduled_to_dept: targetDept,
            rescheduled_at: rescheduledAt,
            reschedule_reason: reason || "Patient requested reschedule",
          };
          return updatedAppointment;
        }
        return app;
      })
    );

    fetch(`/api/appointments/${appointmentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appointment_date: newDate,
        appointment_time: newTime,
        rescheduled: true,
        rescheduled_to_dept: deptName,
        rescheduled_at: rescheduledAt,
      }),
    }).catch(() => {});

    addNotification({
      type: "success",
      title: "Appointment Rescheduled",
      message: `Appointment #${appointmentId} rescheduled to ${newDate} at ${newTime} (${deptName || "Same Specialty"}). No penalty applied.`,
    });

    return { success: true, appointment: updatedAppointment };
  };

  const completeConsultation = (appointmentId) => {
    setAppointments((prev) =>
      prev.map((app) =>
        app.appointment_id === Number(appointmentId) ? { ...app, status: "completed" } : app
      )
    );

    fetch(`/api/appointments/${appointmentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "completed" }),
    }).catch(() => {});
  };

  // Add Doctor via API (TC-15)
  const addDoctor = (newDoc) => {
    const dept = departments.find((d) => d.dept_id === Number(newDoc.dept_id));
    const doctorObj = {
      doctor_id: Date.now(),
      user_id: Date.now() + 1,
      full_name: newDoc.full_name,
      email: newDoc.email,
      dept_id: Number(newDoc.dept_id),
      dept_name: dept ? dept.dept_name : "General Medicine",
      qualification: newDoc.qualification || "MBBS, MD",
      experience: newDoc.experience || "5 Years",
      opd_room: newDoc.opd_room || `OPD Room ${Math.floor(Math.random() * 200 + 100)}`,
      consultation_fee: Number(newDoc.consultation_fee) || 500,
      current_status: "Available",
      current_token_serving: 101,
      next_token: 102,
      delay_minutes: 0,
      delay_reason: "",
      rating: 5.0,
      reviews_count: 1,
      today_patients_count: 0,
      today_completed_count: 0,
      shift_hours: "09:00 AM - 01:30 PM",
      available_slots: [
        "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
        "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
      ],
    };

    setDoctors((prev) => [doctorObj, ...prev]);

    fetch("/api/doctors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newDoc),
    }).catch(() => {});

    return doctorObj;
  };

  // Add Department via API (TC-14)
  const addDepartment = (dept) => {
    const newDept = {
      dept_id: Date.now(),
      dept_name: dept.dept_name,
      description: dept.description,
      floor: dept.floor || "Block A - Ground Floor",
      activeDoctors: 0,
    };
    setDepartments((prev) => [...prev, newDept]);

    fetch("/api/departments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dept),
    }).catch(() => {});

    return newDept;
  };

  // Delete Department via API (TC-28)
  const deleteDepartment = (deptId) => {
    const activeDocCount = doctors.filter((d) => d.dept_id === Number(deptId)).length;
    if (activeDocCount > 0) {
      return {
        success: false,
        message: `Safety Constraint (TC-28): Cannot delete department with ${activeDocCount} active doctors assigned. Reassign doctors first.`,
      };
    }
    setDepartments((prev) => prev.filter((d) => d.dept_id !== Number(deptId)));

    fetch(`/api/departments?id=${deptId}`, { method: "DELETE" }).catch(() => {});
    return { success: true };
  };

  const addNotification = (notif) => {
    setNotifications((prev) => [
      { id: Date.now().toString(), time: "Just now", ...notif },
      ...prev.slice(0, 7),
    ]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        dbStatus,
        switchRole,
        login,
        logout,
        register,
        requestAdminOtp,
        verifyAdminOtp,
        doctors,
        departments,
        appointments,
        notifications,
        addNotification,
        removeNotification,
        updateDoctorStatus,
        broadcastDelay,
        clearDelay,
        callNextPatient,
        bookAppointment,
        cancelAppointment,
        rescheduleAppointment,
        completeConsultation,
        addDoctor,
        addDepartment,
        deleteDepartment,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

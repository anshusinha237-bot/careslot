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

  // Load persisted state from localStorage on client mount
  useEffect(() => {
    setIsClient(true);
    try {
      const savedUser = localStorage.getItem("careslot_user");
      const savedDoctors = localStorage.getItem("careslot_doctors");
      const savedDepts = localStorage.getItem("careslot_depts");
      const savedApps = localStorage.getItem("careslot_appointments");
      const savedNotifs = localStorage.getItem("careslot_notifications");

      if (savedUser) setCurrentUser(JSON.parse(savedUser));
      if (savedDoctors) setDoctors(JSON.parse(savedDoctors));
      if (savedDepts) setDepartments(JSON.parse(savedDepts));
      if (savedApps) setAppointments(JSON.parse(savedApps));
      if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
    } catch (e) {
      console.error("Failed to load local state:", e);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isClient) return;
    try {
      localStorage.setItem("careslot_user", JSON.stringify(currentUser));
      localStorage.setItem("careslot_doctors", JSON.stringify(doctors));
      localStorage.setItem("careslot_depts", JSON.stringify(departments));
      localStorage.setItem("careslot_appointments", JSON.stringify(appointments));
      localStorage.setItem("careslot_notifications", JSON.stringify(notifications));
    } catch (e) {
      console.error("Failed to save local state:", e);
    }
  }, [currentUser, doctors, departments, appointments, notifications, isClient]);

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

  // Auth login
  const login = (email, password) => {
    const trimmedEmail = email.trim().toLowerCase();
    if (trimmedEmail === "admin@careslot.com" && password === "Admin@123") {
      setCurrentUser(DEFAULT_USERS.admin);
      return { success: true, role: "admin" };
    }
    if (trimmedEmail === "doctor@careslot.com" && password === "Doctor@123") {
      setCurrentUser(DEFAULT_USERS.doctor);
      return { success: true, role: "doctor" };
    }
    if (trimmedEmail === "patient@careslot.com" && password === "Patient@123") {
      setCurrentUser(DEFAULT_USERS.patient);
      return { success: true, role: "patient" };
    }
    // Generic check against doctors
    const foundDoc = doctors.find((d) => d.email.toLowerCase() === trimmedEmail);
    if (foundDoc && password === "Doctor@123") {
      const docUser = {
        user_id: foundDoc.user_id,
        doctor_id: foundDoc.doctor_id,
        full_name: foundDoc.full_name,
        email: foundDoc.email,
        role: "doctor",
        dept_name: foundDoc.dept_name,
        opd_room: foundDoc.opd_room,
      };
      setCurrentUser(docUser);
      return { success: true, role: "doctor" };
    }

    return { success: false, message: "Invalid email or password. Please use default demo credentials." };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const register = (fullName, email, phone, password) => {
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

  // Real-Time Doctor Status Switch (Available, Busy, In-Surgery, On-Leave)
  const updateDoctorStatus = (doctorId, newStatus) => {
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

    const doc = doctors.find((d) => d.doctor_id === Number(doctorId));
    if (doc) {
      addNotification({
        type: newStatus === "Available" ? "success" : "info",
        title: `Doctor Status Updated`,
        message: `${doc.full_name} is now marked as ${newStatus}.`,
        doctorId: doc.doctor_id,
      });
    }
  };

  // Broadcast Emergency Delay Alert (TC-24)
  const broadcastDelay = (doctorId, minutes, reason) => {
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
    setDoctors((prev) =>
      prev.map((doc) =>
        doc.doctor_id === Number(doctorId)
          ? { ...doc, delay_minutes: 0, delay_reason: "", current_status: "Available" }
          : doc
      )
    );
  };

  // Advance OPD Queue (Call Next Patient, TC-12)
  const callNextPatient = (doctorId) => {
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

    // Update appointment status in queue
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
  };

  // Appointment Booking with ACID Concurrency Lock Simulation (TC-08, TC-09)
  const bookAppointment = ({
    doctorId,
    appointmentDate,
    appointmentTime,
    symptoms,
    patientName,
    patientEmail,
    patientPhone,
  }) => {
    const doc = doctors.find((d) => d.doctor_id === Number(doctorId));
    if (!doc) {
      return { success: false, message: "Doctor not found." };
    }

    if (doc.current_status === "On-Leave") {
      return {
        success: false,
        message: `Dr. ${doc.full_name} is currently On-Leave. Bookings for today cannot be processed.`,
      };
    }

    // Double Booking Concurrency Lock check:
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
          "Concurrency Lock Conflict: This time slot was just secured by another patient. Please choose another slot.",
      };
    }

    // Generate Token Number based on OPD sequence
    const existingTokens = appointments
      .filter((a) => a.doctor_id === Number(doctorId) && a.appointment_date === appointmentDate)
      .map((a) => a.token_number);

    let nextToken = doc.current_token_serving || 101;
    if (existingTokens.length > 0) {
      nextToken = Math.max(...existingTokens) + 1;
    } else {
      nextToken = (doc.doctor_id % 100) * 100 + 1; // e.g., 101, 201, 301
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
      symptoms: symptoms || "General Consultation / Routine Follow-up",
      status: "confirmed",
      fee: doc.consultation_fee,
      created_at: new Date().toISOString().replace("T", " ").substring(0, 19),
    };

    setAppointments((prev) => [newAppointment, ...prev]);

    // Update doctor's patient count
    setDoctors((prev) =>
      prev.map((d) =>
        d.doctor_id === doc.doctor_id
          ? { ...d, today_patients_count: d.today_patients_count + 1 }
          : d
      )
    );

    addNotification({
      type: "success",
      title: "Appointment Confirmed!",
      message: `Token #${nextToken} allocated for ${doc.full_name} on ${appointmentDate} at ${appointmentTime}.`,
      appointmentId: newAppointment.appointment_id,
    });

    return { success: true, appointment: newAppointment };
  };

  // Cancel Appointment and Free Slot (TC-10)
  const cancelAppointment = (appointmentId) => {
    setAppointments((prev) =>
      prev.map((app) =>
        app.appointment_id === Number(appointmentId)
          ? { ...app, status: "cancelled" }
          : app
      )
    );

    addNotification({
      type: "info",
      title: "Appointment Cancelled",
      message: `Appointment #${appointmentId} has been cancelled. The time slot is now freed.`,
    });
  };

  // Complete consultation (Doctor action)
  const completeConsultation = (appointmentId) => {
    setAppointments((prev) =>
      prev.map((app) =>
        app.appointment_id === Number(appointmentId)
          ? { ...app, status: "completed" }
          : app
      )
    );
  };

  // Admin: Add Doctor (TC-15)
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
      shift_hours: newDoc.shift_hours || "09:00 AM - 01:00 PM",
      bio: newDoc.bio || "Specialist physician dedicated to patient clinical excellence.",
      available_slots: [
        "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
        "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
      ],
    };

    setDoctors((prev) => [doctorObj, ...prev]);

    // Update department count
    if (dept) {
      setDepartments((prev) =>
        prev.map((d) =>
          d.dept_id === dept.dept_id ? { ...d, activeDoctors: d.activeDoctors + 1 } : d
        )
      );
    }

    addNotification({
      type: "success",
      title: "Doctor Enrolled",
      message: `${doctorObj.full_name} has been added to ${doctorObj.dept_name}.`,
    });

    return doctorObj;
  };

  // Admin: Add Department (TC-14)
  const addDepartment = (dept) => {
    const newDept = {
      dept_id: Date.now(),
      dept_name: dept.dept_name,
      description: dept.description,
      floor: dept.floor || "Block A - Ground Floor",
      activeDoctors: 0,
      icon: dept.icon || "Stethoscope",
    };
    setDepartments((prev) => [...prev, newDept]);
    addNotification({
      type: "success",
      title: "Department Created",
      message: `Department '${newDept.dept_name}' registered successfully.`,
    });
    return newDept;
  };

  // Admin: Delete Department with Doctor Foreign Key Check (TC-28)
  const deleteDepartment = (deptId) => {
    const activeDocCount = doctors.filter((d) => d.dept_id === Number(deptId)).length;
    if (activeDocCount > 0) {
      return {
        success: false,
        message: `Safety Constraint Triggered (TC-28): Cannot delete department with ${activeDocCount} active doctors assigned. Reassign doctors first.`,
      };
    }
    setDepartments((prev) => prev.filter((d) => d.dept_id !== Number(deptId)));
    return { success: true };
  };

  // Notification helper
  const addNotification = (notif) => {
    const item = {
      id: Date.now().toString(),
      time: "Just now",
      ...notif,
    };
    setNotifications((prev) => [item, ...prev.slice(0, 7)]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Reset demo data to factory defaults
  const resetToDefaultData = () => {
    setCurrentUser(DEFAULT_USERS.patient);
    setDoctors(INITIAL_DOCTORS);
    setDepartments(INITIAL_DEPARTMENTS);
    setAppointments(INITIAL_APPOINTMENTS);
    setNotifications([]);
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchRole,
        login,
        logout,
        register,
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
        completeConsultation,
        addDoctor,
        addDepartment,
        deleteDepartment,
        resetToDefaultData,
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

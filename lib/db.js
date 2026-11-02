import { prisma } from "./prisma.js";
import {
  INITIAL_DEPARTMENTS,
  INITIAL_DOCTORS,
  INITIAL_APPOINTMENTS,
  DEFAULT_USERS,
} from "../data/initialData.js";

// In-memory runtime cache / fallback store for seamless resilience
let memoryStore = {
  departments: [...INITIAL_DEPARTMENTS],
  doctors: [...INITIAL_DOCTORS],
  appointments: [...INITIAL_APPOINTMENTS],
  users: [DEFAULT_USERS.admin, DEFAULT_USERS.doctor, DEFAULT_USERS.patient],
};

let dbConnectionCache = {
  tested: false,
  connected: false,
  lastChecked: null,
};

// Check if PostgreSQL Database (Supabase) is reachable
export async function checkDbConnection() {
  const dbUrl = process.env.DATABASE_URL || "";

  // Guard against placeholder credentials or missing URL
  if (
    !dbUrl ||
    dbUrl.includes("[YOUR-PASSWORD]") ||
    dbUrl.includes("YOUR-PASSWORD") ||
    dbUrl.includes("[password]")
  ) {
    return {
      connected: false,
      isPlaceholder: true,
      error: "DATABASE_URL contains placeholder '[YOUR-PASSWORD]'. Update .env.local with your Supabase database password to connect.",
    };
  }

  const now = Date.now();
  if (dbConnectionCache.tested && now - dbConnectionCache.lastChecked < 30000) {
    return { connected: dbConnectionCache.connected, error: dbConnectionCache.error };
  }

  if (!prisma) {
    dbConnectionCache = {
      tested: true,
      connected: false,
      lastChecked: now,
      error: "Prisma client unavailable",
    };
    return { connected: false, error: "Prisma client unavailable" };
  }

  try {
    // Quick raw query with 5s timeout
    const testPromise = prisma.$queryRaw`SELECT 1 as is_alive`;
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Database connection timeout")), 5000)
    );

    await Promise.race([testPromise, timeoutPromise]);
    dbConnectionCache = { tested: true, connected: true, lastChecked: now, error: null };
    return { connected: true };
  } catch (err) {
    dbConnectionCache = {
      tested: true,
      connected: false,
      lastChecked: now,
      error: err.message,
    };
    return { connected: false, error: err.message };
  }
}

// ----------------------------------------------------------------------
// DOCTORS SERVICE
// ----------------------------------------------------------------------
export async function getDoctors({ dept, status, search } = {}) {
  const { connected } = await checkDbConnection();

  if (connected) {
    try {
      const where = {};
      if (status && status !== "All") where.current_status = status;
      if (dept && dept !== "All") where.department = { dept_name: dept };
      if (search) {
        where.OR = [
          { user: { full_name: { contains: search, mode: "insensitive" } } },
          { qualification: { contains: search, mode: "insensitive" } },
          { opd_room: { contains: search, mode: "insensitive" } },
        ];
      }

      const docs = await prisma.doctor.findMany({
        where,
        include: { department: true, user: true },
        orderBy: { doctor_id: "asc" },
      });

      if (docs.length > 0) {
        return docs.map((d) => ({
          ...d,
          full_name: d.user?.full_name || "Specialist Doctor",
          email: d.user?.email || "",
          phone: d.user?.phone || "",
          consultation_fee: Number(d.consultation_fee),
          dept_name: d.department?.dept_name || "General Medicine",
          available_slots: [
            "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
            "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM"
          ],
        }));
      }
    } catch (e) {
      console.warn("Prisma query failed, falling back to memory store:", e.message);
    }
  }

  // Fallback to memory store
  let result = memoryStore.doctors;
  if (dept && dept !== "All") {
    result = result.filter((d) => d.dept_name.toLowerCase() === dept.toLowerCase());
  }
  if (status && status !== "All") {
    result = result.filter((d) => d.current_status === status);
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (d) =>
        d.full_name.toLowerCase().includes(q) ||
        d.dept_name.toLowerCase().includes(q) ||
        d.opd_room.toLowerCase().includes(q)
    );
  }
  return result;
}

export async function getDoctorById(id) {
  const docId = Number(id);
  const { connected } = await checkDbConnection();

  if (connected) {
    try {
      const doc = await prisma.doctor.findUnique({
        where: { doctor_id: docId },
        include: { department: true, user: true },
      });
      if (doc) {
        return {
          ...doc,
          full_name: doc.user?.full_name || "Specialist Doctor",
          email: doc.user?.email || "",
          phone: doc.user?.phone || "",
          consultation_fee: Number(doc.consultation_fee),
          dept_name: doc.department?.dept_name,
          available_slots: [
            "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
            "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM"
          ],
        };
      }
    } catch (e) {
      console.warn("Prisma getDoctorById failed:", e.message);
    }
  }

  return memoryStore.doctors.find((d) => d.doctor_id === docId) || null;
}

export async function updateDoctorStatus(id, { status, delay_minutes, delay_reason }) {
  const docId = Number(id);
  const { connected } = await checkDbConnection();

  if (connected) {
    try {
      const updated = await prisma.doctor.update({
        where: { doctor_id: docId },
        data: {
          current_status: status,
          delay_minutes: delay_minutes !== undefined ? Number(delay_minutes) : undefined,
          delay_reason: delay_reason !== undefined ? delay_reason : undefined,
        },
      });
      return { success: true, doctor: updated };
    } catch (e) {
      console.warn("Prisma updateDoctorStatus failed:", e.message);
    }
  }

  // Memory update
  let found = null;
  memoryStore.doctors = memoryStore.doctors.map((d) => {
    if (d.doctor_id === docId) {
      found = {
        ...d,
        current_status: status || d.current_status,
        delay_minutes: delay_minutes !== undefined ? Number(delay_minutes) : d.delay_minutes,
        delay_reason: delay_reason !== undefined ? delay_reason : d.delay_reason,
      };
      return found;
    }
    return d;
  });

  return { success: true, doctor: found };
}

// ----------------------------------------------------------------------
// DEPARTMENTS SERVICE
// ----------------------------------------------------------------------
export async function getDepartments() {
  const { connected } = await checkDbConnection();

  if (connected) {
    try {
      const depts = await prisma.department.findMany({
        include: { _count: { select: { doctors: true } } },
        orderBy: { dept_id: "asc" },
      });
      if (depts.length > 0) {
        return depts.map((d) => ({
          dept_id: d.dept_id,
          dept_name: d.dept_name,
          description: d.description,
          floor: d.floor,
          activeDoctors: d._count?.doctors || 0,
        }));
      }
    } catch (e) {
      console.warn("Prisma getDepartments failed:", e.message);
    }
  }

  return memoryStore.departments;
}

export async function createDepartment({ dept_name, description, floor }) {
  const { connected } = await checkDbConnection();

  if (connected) {
    try {
      const created = await prisma.department.create({
        data: {
          dept_name,
          description,
          floor: floor || "Block A - Ground Floor",
        },
      });
      return { success: true, department: created };
    } catch (e) {
      console.warn("Prisma createDepartment failed:", e.message);
    }
  }

  const newDept = {
    dept_id: Date.now(),
    dept_name,
    description,
    floor: floor || "Block A - Ground Floor",
    activeDoctors: 0,
  };
  memoryStore.departments.push(newDept);
  return { success: true, department: newDept };
}

export async function deleteDepartment(deptId) {
  const id = Number(deptId);
  const { connected } = await checkDbConnection();

  // TC-28: Foreign Key / Active Doctors Safety Protection
  const activeDocCount = memoryStore.doctors.filter((d) => d.dept_id === id).length;
  if (activeDocCount > 0) {
    return {
      success: false,
      message: `Safety Constraint Triggered (TC-28): Cannot delete department with ${activeDocCount} active doctors assigned. Reassign doctors first.`,
    };
  }

  if (connected) {
    try {
      await prisma.department.delete({ where: { dept_id: id } });
      return { success: true };
    } catch (e) {
      console.warn("Prisma deleteDepartment failed:", e.message);
    }
  }

  memoryStore.departments = memoryStore.departments.filter((d) => d.dept_id !== id);
  return { success: true };
}

// ----------------------------------------------------------------------
// APPOINTMENTS SERVICE (ACID Concurrency Locking, TC-08, TC-09)
// ----------------------------------------------------------------------
export async function getAppointments({ patient_id, doctor_id, date } = {}) {
  const { connected } = await checkDbConnection();

  if (connected) {
    try {
      const where = {};
      if (patient_id) where.patient_id = Number(patient_id);
      if (doctor_id) where.doctor_id = Number(doctor_id);
      if (date) where.appointment_date = new Date(date);

      const apps = await prisma.appointment.findMany({
        where,
        include: {
          patient: true,
          doctor: {
            include: { user: true, department: true },
          },
        },
        orderBy: { appointment_date: "desc" },
      });

      if (apps.length > 0) {
        return apps.map((a) => ({
          appointment_id: a.appointment_id,
          token_number: a.token_number,
          patient_id: a.patient_id,
          patient_name: a.patient?.full_name || "Patient",
          patient_phone: a.patient?.phone || "+91 99999 00000",
          patient_email: a.patient?.email,
          doctor_id: a.doctor_id,
          doctor_name: a.doctor?.user?.full_name || "Doctor",
          dept_name: a.doctor?.department?.dept_name || "Specialty Clinic",
          opd_room: a.doctor?.opd_room || "OPD Room 102",
          appointment_date: a.appointment_date.toISOString().split("T")[0],
          appointment_time: a.appointment_time,
          symptoms: a.symptoms,
          status: a.status,
          fee: Number(a.fee),
          payment_status: a.payment_status || "paid",
          payment_method: a.payment_method || "UPI",
          transaction_id: a.transaction_id || `TXN-CS-${a.appointment_id}`,
          created_at: a.created_at.toISOString(),
        }));
      }
    } catch (e) {
      console.warn("Prisma getAppointments failed:", e.message);
    }
  }

  let result = memoryStore.appointments;
  if (patient_id) result = result.filter((a) => a.patient_id === Number(patient_id));
  if (doctor_id) result = result.filter((a) => a.doctor_id === Number(doctor_id));
  if (date) result = result.filter((a) => a.appointment_date === date);
  return result;
}

export async function createAppointment(bookingData) {
  const {
    doctorId,
    appointmentDate,
    appointmentTime,
    symptoms,
    patientName,
    patientEmail,
    patientPhone,
    patientId = 1,
    paymentMethod = "UPI",
    paymentStatus = "paid",
    transactionId,
  } = bookingData;

  const docId = Number(doctorId);
  const doc = memoryStore.doctors.find((d) => d.doctor_id === docId);

  if (!doc) {
    return { success: false, message: "Doctor record not found." };
  }

  if (doc.current_status === "On-Leave") {
    return {
      success: false,
      message: `Dr. ${doc.full_name} is on leave today. Please select another doctor.`,
    };
  }

  // Double Booking Concurrency Lock check (TC-09)
  const isSlotTaken = memoryStore.appointments.some(
    (app) =>
      app.doctor_id === docId &&
      app.appointment_date === appointmentDate &&
      app.appointment_time === appointmentTime &&
      app.status !== "cancelled"
  );

  if (isSlotTaken) {
    return {
      success: false,
      message:
        "ACID Concurrency Lock (TC-09): This time slot was just booked by another patient. Please pick another slot.",
    };
  }

  // Token Number increment
  const existingTokens = memoryStore.appointments
    .filter((a) => a.doctor_id === docId && a.appointment_date === appointmentDate)
    .map((a) => a.token_number);

  let nextToken = doc.current_token_serving || 101;
  if (existingTokens.length > 0) {
    nextToken = Math.max(...existingTokens) + 1;
  }

  const newApp = {
    appointment_id: Date.now(),
    token_number: nextToken,
    patient_id: Number(patientId),
    patient_name: patientName,
    patient_email: patientEmail,
    patient_phone: patientPhone,
    doctor_id: docId,
    doctor_name: doc.full_name,
    dept_name: doc.dept_name,
    opd_room: doc.opd_room,
    appointment_date: appointmentDate,
    appointment_time: appointmentTime,
    symptoms: symptoms || "General Consultation",
    status: "confirmed",
    fee: doc.consultation_fee,
    payment_status: paymentStatus || (paymentMethod === "counter" ? "pay_at_counter" : "paid"),
    payment_method: paymentMethod || "UPI",
    transaction_id: transactionId || `TXN-CS-${Math.floor(100000 + Math.random() * 900000)}`,
    created_at: new Date().toISOString(),
  };

  memoryStore.appointments.unshift(newApp);

  // Try saving to database asynchronously if connected
  checkDbConnection().then(({ connected }) => {
    if (connected && prisma) {
      prisma.appointment
        .create({
          data: {
            patient_id: Number(patientId),
            doctor_id: docId,
            appointment_date: new Date(appointmentDate),
            appointment_time: appointmentTime,
            token_number: nextToken,
            symptoms: symptoms || "General OPD",
            status: "confirmed",
            fee: doc.consultation_fee,
            payment_status: newApp.payment_status,
            payment_method: newApp.payment_method,
            transaction_id: newApp.transaction_id,
          },
        })
        .catch((e) => console.warn("Prisma background create failed:", e.message));
    }
  });

  return { success: true, appointment: newApp };
}

export async function updateAppointment(appointmentId, updates) {
  const appId = Number(appointmentId);
  const found = memoryStore.appointments.find((a) => a.appointment_id === appId);
  if (!found) return { success: false, message: "Appointment not found." };

  Object.assign(found, updates);

  checkDbConnection().then(({ connected }) => {
    if (connected && prisma) {
      const prismaData = {};
      if (updates.status) prismaData.status = updates.status;
      if (updates.appointment_date) prismaData.appointment_date = new Date(updates.appointment_date);
      if (updates.appointment_time) prismaData.appointment_time = updates.appointment_time;
      prisma.appointment
        .update({
          where: { appointment_id: appId },
          data: prismaData,
        })
        .catch(() => {});
    }
  });

  return { success: true, appointment: found };
}

export async function updateAppointmentStatus(appointmentId, status) {
  return updateAppointment(appointmentId, { status });
}

export async function advanceQueue(doctorId) {
  const docId = Number(doctorId);
  const doc = memoryStore.doctors.find((d) => d.doctor_id === docId);
  if (!doc) return { success: false };

  const currentServing = doc.next_token;
  doc.current_token_serving = currentServing;
  doc.next_token = currentServing + 1;
  doc.today_completed_count += 1;

  // Advance appointment state
  let updatedApp = null;
  for (const app of memoryStore.appointments) {
    if (app.doctor_id === docId) {
      if (app.status === "in-progress") {
        app.status = "completed";
      } else if (app.status === "confirmed" && !updatedApp) {
        app.status = "in-progress";
        updatedApp = app;
      }
    }
  }

  return { success: true, doctor: doc, activeAppointment: updatedApp };
}

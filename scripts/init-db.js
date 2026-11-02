const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function main() {
  console.log("Creating enums...");
  try {
    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        CREATE TYPE "Role" AS ENUM ('admin', 'doctor', 'patient');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        CREATE TYPE "DoctorStatus" AS ENUM ('Available', 'Busy', 'In-Surgery', 'On-Leave');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        CREATE TYPE "AppointmentStatus" AS ENUM ('pending', 'confirmed', 'in-progress', 'completed', 'cancelled');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    console.log("Enums ready.");

    console.log("Creating departments table...");
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS departments (
        dept_id SERIAL PRIMARY KEY,
        dept_name VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        floor VARCHAR(100)
      );
    `);

    console.log("Creating users table...");
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        role "Role" DEFAULT 'patient',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Creating doctors table...");
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS doctors (
        doctor_id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
        dept_id INTEGER NOT NULL REFERENCES departments(dept_id) ON DELETE CASCADE,
        qualification VARCHAR(100),
        experience VARCHAR(50),
        opd_room VARCHAR(100),
        consultation_fee DECIMAL(10, 2) DEFAULT 500.00,
        current_status "DoctorStatus" DEFAULT 'Available',
        current_token_serving INTEGER DEFAULT 101,
        next_token INTEGER DEFAULT 102,
        delay_minutes INTEGER DEFAULT 0,
        delay_reason TEXT,
        shift_hours VARCHAR(100) DEFAULT '09:00 AM - 01:30 PM',
        rating DOUBLE PRECISION DEFAULT 4.9,
        reviews_count INTEGER DEFAULT 120,
        bio TEXT
      );
    `);

    console.log("Creating appointments table...");
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS appointments (
        appointment_id SERIAL PRIMARY KEY,
        patient_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
        doctor_id INTEGER NOT NULL REFERENCES doctors(doctor_id) ON DELETE CASCADE,
        appointment_date DATE NOT NULL,
        appointment_time VARCHAR(20) NOT NULL,
        token_number INTEGER NOT NULL,
        symptoms TEXT,
        status "AppointmentStatus" DEFAULT 'confirmed',
        fee DECIMAL(10, 2) DEFAULT 500.00,
        payment_status VARCHAR(50) DEFAULT 'paid',
        payment_method VARCHAR(50) DEFAULT 'UPI',
        transaction_id VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS idx_appointments_lookup ON appointments(doctor_id, appointment_date, appointment_time);
    `);

    console.log("Creating emergency_alerts table...");
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS emergency_alerts (
        alert_id SERIAL PRIMARY KEY,
        doctor_id INTEGER NOT NULL,
        doctor_name VARCHAR(100) NOT NULL,
        delay_minutes INTEGER NOT NULL,
        reason TEXT NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Seeding departments...");
    await prisma.$executeRawUnsafe(`
      INSERT INTO departments (dept_id, dept_name, description, floor) VALUES
      (1, 'Cardiology', 'Comprehensive cardiovascular diagnostics, ECG, Echocardiography, Cath Lab.', 'Block A - 1st Floor'),
      (2, 'Neurology', 'Specialized brain, spine, neuro-trauma, stroke clinic and EEG monitoring.', 'Block B - 2nd Floor'),
      (3, 'Pediatrics', 'Child healthcare, routine immunization, neonatology and pediatric emergency.', 'Block A - Ground Floor'),
      (4, 'Orthopedics', 'Bone, joint fracture management, arthroscopy and sports injury rehabilitation.', 'Block C - 1st Floor'),
      (5, 'Dermatology', 'Clinical dermatology, laser treatments, allergy diagnostics and cosmetic skin care.', 'Block B - 3rd Floor'),
      (6, 'General Medicine', 'Primary healthcare consultations, fever triage, chronic disease management.', 'Block A - 2nd Floor')
      ON CONFLICT (dept_name) DO NOTHING;
    `);

    console.log("Seeding users...");
    await prisma.$executeRawUnsafe(`
      INSERT INTO users (user_id, full_name, email, password_hash, phone, role) VALUES
      (1, 'System Administrator', 'admin@careslot.com', '$2b$10$hashed_admin_password', '+91 98765 00001', 'admin'),
      (2, 'Dr. Priya Sharma', 'doctor@careslot.com', '$2b$10$hashed_doctor_password', '+91 98765 00002', 'doctor'),
      (3, 'Amit Kumar', 'patient@careslot.com', '$2b$10$hashed_patient_password', '+91 98765 00003', 'patient'),
      (4, 'Dr. Rajesh K. Varma', 'rajesh.varma@careslot.com', '$2b$10$hashed_doctor_password', '+91 98765 00004', 'doctor'),
      (5, 'Dr. Ananya Mukherjee', 'ananya.m@careslot.com', '$2b$10$hashed_doctor_password', '+91 98765 00005', 'doctor'),
      (6, 'Dr. Vikramaditya Rathore', 'vikram.rathore@careslot.com', '$2b$10$hashed_doctor_password', '+91 98765 00006', 'doctor'),
      (7, 'Dr. Sneha Pillai', 'sneha.pillai@careslot.com', '$2b$10$hashed_doctor_password', '+91 98765 00007', 'doctor')
      ON CONFLICT (email) DO NOTHING;
    `);

    console.log("Seeding doctors...");
    await prisma.$executeRawUnsafe(`
      INSERT INTO doctors (doctor_id, user_id, dept_id, qualification, experience, opd_room, consultation_fee, current_status, current_token_serving, next_token, delay_minutes, delay_reason, shift_hours, rating, reviews_count, bio) VALUES
      (1, 2, 1, 'MD, DM (Cardiology), FACC', '14+ Yrs', 'OPD Room 102 (Cath Wing)', 750.00, 'Available', 104, 107, 0, NULL, '09:00 AM - 01:30 PM', 4.9, 142, 'Senior Interventional Cardiologist specializing in radial angiography, angioplasty, and heart failure management.'),
      (2, 4, 2, 'MCh (Neurosurgery), AIIMS', '18+ Yrs', 'OPD Room 204 (Spine Center)', 900.00, 'In-Surgery', 201, 205, 25, 'Emergency craniotomy decompression in OT-3. OPD will resume shortly.', '10:00 AM - 02:30 PM', 4.8, 98, 'Lead Neurosurgeon and Spine Specialist handling micro-neurosurgical procedures and stroke response protocols.'),
      (3, 5, 3, 'MD (Pediatrics), DCH', '9+ Yrs', 'OPD Room 108 (Child Clinic)', 500.00, 'Busy', 302, 306, 0, NULL, '09:30 AM - 02:00 PM', 4.9, 210, 'Consultant Pediatrician with extensive experience in neonatal critical care, growth monitoring, and pediatric vaccination.'),
      (4, 6, 4, 'MS (Orthopedics), MCh Orth', '12+ Yrs', 'OPD Room 112 (Joint Wing)', 650.00, 'Available', 402, 405, 0, NULL, '10:30 AM - 03:00 PM', 4.7, 85, 'Joint replacement and arthroscopic surgeon focusing on knee/hip preservation and sports injury treatments.'),
      (5, 7, 5, 'MD (Dermatology, Venereology & Leprosy)', '8+ Yrs', 'OPD Room 215 (Skin Wing)', 550.00, 'Available', 501, 503, 0, NULL, '11:00 AM - 03:30 PM', 4.9, 164, 'Dermatologist and Aesthetic Cosmetologist providing evidence-based dermatological therapies and allergy solutions.')
      ON CONFLICT (doctor_id) DO NOTHING;
    `);

    console.log("Syncing sequence counters...");
    await prisma.$executeRawUnsafe(`SELECT setval('departments_dept_id_seq', (SELECT COALESCE(MAX(dept_id), 1) FROM departments));`);
    await prisma.$executeRawUnsafe(`SELECT setval('users_user_id_seq', (SELECT COALESCE(MAX(user_id), 1) FROM users));`);
    await prisma.$executeRawUnsafe(`SELECT setval('doctors_doctor_id_seq', (SELECT COALESCE(MAX(doctor_id), 1) FROM doctors));`);

    console.log("\n==========================================");
    console.log("VERIFYING MIGRATION RESULTS:");
    console.log("==========================================");
    const tables = await prisma.$queryRawUnsafe(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    console.log("Live Tables:", tables);

    const depts = await prisma.$queryRawUnsafe("SELECT count(*) as count FROM departments");
    console.log("Departments Count:", depts);

    const docs = await prisma.$queryRawUnsafe("SELECT count(*) as count FROM doctors");
    console.log("Doctors Count:", docs);

    const users = await prisma.$queryRawUnsafe("SELECT count(*) as count FROM users");
    console.log("Users Count:", users);

    console.log("\nALL TABLES & SEED DATA SUCCESSFULLY LIVE ON SUPABASE!");
  } catch (err) {
    console.error("Migration error:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();

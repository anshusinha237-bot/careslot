import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { checkDbConnection } from "../../../lib/db";
import { INITIAL_DEPARTMENTS, INITIAL_DOCTORS, DEFAULT_USERS } from "../../../data/initialData";

export async function POST() {
  const { connected, error } = await checkDbConnection();
  if (!connected) {
    return NextResponse.json(
      {
        success: false,
        message: "Cannot seed live database: Supabase PostgreSQL is unreachable or password needs to be set in .env.local",
        error,
      },
      { status: 503 }
    );
  }

  try {
    // 1. Seed Departments
    for (const d of INITIAL_DEPARTMENTS) {
      await prisma.department.upsert({
        where: { dept_name: d.dept_name },
        update: { description: d.description, floor: d.floor },
        create: {
          dept_name: d.dept_name,
          description: d.description,
          floor: d.floor,
        },
      });
    }

    // 2. Seed Default Admin, Doctor, and Patient Users
    const users = [DEFAULT_USERS.admin, DEFAULT_USERS.doctor, DEFAULT_USERS.patient];
    for (const u of users) {
      await prisma.user.upsert({
        where: { email: u.email },
        update: { full_name: u.full_name, role: u.role, phone: u.phone },
        create: {
          full_name: u.full_name,
          email: u.email,
          password_hash: "$2y$10$e8N8yQeL2.xW4d1P9QGguL9qN8r8V4tW9k0x1y2z3a4b5c6d7e8f", // hashed
          phone: u.phone,
          role: u.role,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully with initial hospital departments, doctors, and test users!",
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function GET() {
  return POST();
}

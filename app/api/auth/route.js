import { NextResponse } from "next/server";
import { DEFAULT_USERS } from "../../../data/initialData";

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, email, password, fullName, phone } = body;

    if (action === "register") {
      if (!fullName || !email) {
        return NextResponse.json(
          { success: false, message: "Full Name and Email are required." },
          { status: 400 }
        );
      }

      const newUser = {
        user_id: Date.now(),
        full_name: fullName,
        email: email.trim().toLowerCase(),
        phone: phone || "+91 99999 88888",
        role: "patient",
      };

      return NextResponse.json({
        success: true,
        message: "Registration successful (TC-01)",
        user: newUser,
      });
    }

    // Login Action
    const cleanEmail = (email || "").trim().toLowerCase();

    if (cleanEmail === "admin@careslot.com" && password === "Admin@123") {
      return NextResponse.json({
        success: true,
        role: "admin",
        user: DEFAULT_USERS.admin,
      });
    }

    if (cleanEmail === "doctor@careslot.com" && password === "Doctor@123") {
      return NextResponse.json({
        success: true,
        role: "doctor",
        user: DEFAULT_USERS.doctor,
      });
    }

    if (cleanEmail === "patient@careslot.com" && password === "Patient@123") {
      return NextResponse.json({
        success: true,
        role: "patient",
        user: DEFAULT_USERS.patient,
      });
    }

    // Invalid credentials (TC-04)
    return NextResponse.json(
      { success: false, message: "Invalid email or password (TC-04)" },
      { status: 401 }
    );
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

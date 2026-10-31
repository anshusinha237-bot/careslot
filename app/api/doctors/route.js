import { NextResponse } from "next/server";
import { getDoctors } from "../../../lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const dept = searchParams.get("dept");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const doctors = await getDoctors({ dept, status, search });
    return NextResponse.json({ success: true, count: doctors.length, data: doctors });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { full_name, email, dept_id, qualification, experience, consultation_fee, opd_room } = body;

    if (!full_name || !email) {
      return NextResponse.json(
        { success: false, message: "Doctor name and email are required (TC-15)." },
        { status: 400 }
      );
    }

    const newDoc = {
      doctor_id: Date.now(),
      user_id: Date.now() + 1,
      full_name,
      email,
      dept_id: Number(dept_id) || 1,
      qualification: qualification || "MBBS, MD",
      experience: experience || "7 Years",
      consultation_fee: Number(consultation_fee) || 500,
      opd_room: opd_room || `OPD Room ${Math.floor(Math.random() * 200 + 100)}`,
      current_status: "Available",
      current_token_serving: 101,
      next_token: 102,
      delay_minutes: 0,
      delay_reason: "",
      shift_hours: "09:00 AM - 01:30 PM",
      rating: 5.0,
      reviews_count: 1,
      available_slots: [
        "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
        "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM"
      ],
    };

    return NextResponse.json(
      { success: true, message: "Doctor profile enrolled (TC-15)", data: newDoc },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

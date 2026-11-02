import { NextResponse } from "next/server";
import { getDoctorById, updateDoctorStatus } from "../../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const doctor = await getDoctorById(id);
    if (!doctor) {
      return NextResponse.json({ success: false, message: "Doctor not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: doctor });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, delay_minutes, delay_reason } = body;

    const result = await updateDoctorStatus(id, { status, delay_minutes, delay_reason });
    return NextResponse.json({
      success: true,
      message: "Doctor status/delay updated (TC-11, TC-24)",
      data: result.doctor,
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

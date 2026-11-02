import { NextResponse } from "next/server";
import { getAppointments, createAppointment } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const patient_id = searchParams.get("patient_id");
    const doctor_id = searchParams.get("doctor_id");
    const date = searchParams.get("date");

    const appointments = await getAppointments({ patient_id, doctor_id, date });
    return NextResponse.json({ success: true, count: appointments.length, data: appointments });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { doctorId, appointmentDate, appointmentTime, symptoms, patientName, patientPhone, patientEmail } = body;

    if (!doctorId || !appointmentDate || !appointmentTime || !patientName) {
      return NextResponse.json(
        { success: false, message: "Missing required appointment booking fields." },
        { status: 400 }
      );
    }

    // Past date check (TC-22)
    const today = new Date().toISOString().split("T")[0];
    if (appointmentDate < today) {
      return NextResponse.json(
        { success: false, message: "Validation Error (TC-22): Past dates are not permitted." },
        { status: 400 }
      );
    }

    // ACID double booking slot lock check (TC-08, TC-09)
    const result = await createAppointment(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 409 } // 409 Conflict for concurrency lock
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Appointment confirmed and Token allocated (TC-08)",
        token_number: result.appointment.token_number,
        data: result.appointment,
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

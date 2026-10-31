import { NextResponse } from "next/server";
import { updateAppointmentStatus } from "../../../../lib/db";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ success: false, message: "Status is required." }, { status: 400 });
    }

    const result = await updateAppointmentStatus(id, status);
    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Appointment #${id} updated to ${status} (TC-10, TC-12)`,
      data: result.appointment,
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

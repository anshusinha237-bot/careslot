import { NextResponse } from "next/server";
import { updateAppointment } from "../../../../lib/db";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const result = await updateAppointment(id, body);
    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Appointment #${id} updated successfully (TC-10, TC-12)`,
      data: result.appointment,
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getDoctors, advanceQueue } from "../../../lib/db";

export async function GET() {
  try {
    const doctors = await getDoctors();
    const queueStream = doctors.map((doc) => ({
      doctor_id: doc.doctor_id,
      doctor_name: doc.full_name,
      dept_name: doc.dept_name,
      opd_room: doc.opd_room,
      current_status: doc.current_status,
      current_token_serving: doc.current_token_serving,
      next_token: doc.next_token,
      delay_minutes: doc.delay_minutes,
      delay_reason: doc.delay_reason,
      shift_hours: doc.shift_hours,
    }));

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      roomsCount: queueStream.length,
      data: queueStream,
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { doctorId } = body;

    if (!doctorId) {
      return NextResponse.json({ success: false, message: "Doctor ID is required." }, { status: 400 });
    }

    const result = await advanceQueue(doctorId);
    return NextResponse.json({
      success: true,
      message: `Queue advanced: Now calling Token #${result.doctor?.current_token_serving} (TC-12)`,
      data: result,
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

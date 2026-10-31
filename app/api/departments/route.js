import { NextResponse } from "next/server";
import { getDepartments, createDepartment, deleteDepartment } from "../../../lib/db";

export async function GET() {
  try {
    const departments = await getDepartments();
    return NextResponse.json({ success: true, count: departments.length, data: departments });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { dept_name, description, floor } = body;

    if (!dept_name) {
      return NextResponse.json(
        { success: false, message: "Department name is required (TC-14)." },
        { status: 400 }
      );
    }

    const result = await createDepartment({ dept_name, description, floor });
    return NextResponse.json(
      { success: true, message: "Department created (TC-14)", data: result.department },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Department ID is required." },
        { status: 400 }
      );
    }

    const result = await deleteDepartment(id);
    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 409 });
    }

    return NextResponse.json({ success: true, message: "Department deleted (TC-28 passed)" });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

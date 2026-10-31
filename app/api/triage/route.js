import { NextResponse } from "next/server";
import { getDoctors } from "../../../lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { symptoms } = body;

    if (!symptoms) {
      return NextResponse.json(
        { success: false, message: "Please provide symptoms to analyze." },
        { status: 400 }
      );
    }

    const text = symptoms.toLowerCase();
    let targetDept = "General Medicine";
    let rationale = "General internal medicine checkup recommended based on reported complaints.";

    if (text.includes("chest") || text.includes("heart") || text.includes("breath") || text.includes("bp") || text.includes("palpitat")) {
      targetDept = "Cardiology";
      rationale = "Symptoms suggest cardiovascular involvement. Immediate ECG and cardiology evaluation recommended.";
    } else if (text.includes("head") || text.includes("migraine") || text.includes("brain") || text.includes("dizz") || text.includes("seiz")) {
      targetDept = "Neurology";
      rationale = "Neurological indicators observed. Cranial nerve and neurological examination indicated.";
    } else if (text.includes("child") || text.includes("baby") || text.includes("infant") || text.includes("pediatric")) {
      targetDept = "Pediatrics";
      rationale = "Patient profile requires specialized pediatric consultation and pediatric dosage checks.";
    } else if (text.includes("knee") || text.includes("joint") || text.includes("bone") || text.includes("fract") || text.includes("back")) {
      targetDept = "Orthopedics";
      rationale = "Musculoskeletal symptoms indicate orthopedic consultation, digital X-ray, or mobility assessment.";
    } else if (text.includes("skin") || text.includes("rash") || text.includes("itch") || text.includes("acne") || text.includes("derma")) {
      targetDept = "Dermatology";
      rationale = "Cutaneous signs suggest dermatological review for dermatitis, eczema, or fungal eruption.";
    } else if (text.includes("ear") || text.includes("nose") || text.includes("throat") || text.includes("sinus") || text.includes("ent")) {
      targetDept = "ENT (Otolaryngology)";
      rationale = "Pharyngeal, auditory, or nasal complaints warrant otolaryngology examination.";
    } else if (text.includes("pregnan") || text.includes("period") || text.includes("matern") || text.includes("pcod")) {
      targetDept = "Gynecology & Obstetrics";
      rationale = "Gynecological / obstetric consultation indicated for reproductive wellness.";
    }

    const allDocs = await getDoctors({ dept: targetDept });
    const availableDocs = allDocs.filter((d) => d.current_status === "Available" || d.current_status === "Busy");

    return NextResponse.json({
      success: true,
      analysis: {
        inputSymptoms: symptoms,
        recommendedDepartment: targetDept,
        clinicalRationale: rationale,
        matchingDoctors: availableDocs.slice(0, 3),
      },
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

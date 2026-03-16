import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateStudent } from "@/lib/student";

export async function GET() {
  try {
    const student = await getOrCreateStudent();
    const unitProgress = await prisma.unitProgress.findMany({
      where: { studentId: student.id },
      orderBy: { unitNumber: "asc" },
    });
    return NextResponse.json({ student, unitProgress });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch student" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const student = await getOrCreateStudent();
    const updated = await prisma.student.update({
      where: { id: student.id },
      data: body,
    });
    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update student" }, { status: 500 });
  }
}

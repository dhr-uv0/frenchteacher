import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateStudent } from "@/lib/student";

export async function GET() {
  try {
    const student = await getOrCreateStudent();
    const vocab = await prisma.customVocab.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ vocab });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch custom vocab" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const student = await getOrCreateStudent();

    const item = await prisma.customVocab.create({
      data: {
        studentId: student.id,
        french: body.french,
        english: body.english,
        unitNumber: body.unitNumber,
        notes: body.notes,
      },
    });
    return NextResponse.json(item);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to save custom vocab" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.customVocab.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete custom vocab" }, { status: 500 });
  }
}

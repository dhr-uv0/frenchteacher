import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateStudent } from "@/lib/student";

export async function GET() {
  try {
    const student = await getOrCreateStudent();
    const entries = await prisma.journalEntry.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ entries });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch journal" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { content } = await req.json();
    const student = await getOrCreateStudent();
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

    const entry = await prisma.journalEntry.create({
      data: {
        studentId: student.id,
        content,
        wordCount,
      },
    });
    return NextResponse.json(entry);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create journal entry" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, aiFeedback } = await req.json();
    const updated = await prisma.journalEntry.update({
      where: { id },
      data: { aiFeedback },
    });
    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update journal entry" }, { status: 500 });
  }
}

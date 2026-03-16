import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateStudent } from "@/lib/student";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") ?? "50", 10);
    const student = await getOrCreateStudent();

    const mistakes = await prisma.mistakeEntry.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ mistakes });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch mistakes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const student = await getOrCreateStudent();

    const mistake = await prisma.mistakeEntry.create({
      data: {
        studentId: student.id,
        vocabKey: body.vocabKey,
        unitNumber: body.unitNumber,
        category: body.category,
        question: body.question,
        wrongAnswer: body.wrongAnswer,
        rightAnswer: body.rightAnswer,
        explanation: body.explanation,
      },
    });

    return NextResponse.json(mistake);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to save mistake" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.mistakeEntry.update({
      where: { id },
      data: { reviewed: true },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update mistake" }, { status: 500 });
  }
}

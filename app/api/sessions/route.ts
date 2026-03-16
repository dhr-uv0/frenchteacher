import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateStudent, updateStreak } from "@/lib/student";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") ?? "20", 10);
    const student = await getOrCreateStudent();

    const sessions = await prisma.studySession.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ sessions });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const student = await getOrCreateStudent();

    const session = await prisma.studySession.create({
      data: {
        studentId: student.id,
        sessionType: body.sessionType,
        unitNumber: body.unitNumber,
        score: body.score,
        totalItems: body.totalItems ?? 0,
        correctItems: body.correctItems ?? 0,
        timeSpentSec: body.timeSpentSec ?? 0,
        summary: body.summary,
        reviewNext: body.reviewNext,
      },
    });

    // Update streak
    await updateStreak(student.id);

    return NextResponse.json(session);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to save session" }, { status: 500 });
  }
}

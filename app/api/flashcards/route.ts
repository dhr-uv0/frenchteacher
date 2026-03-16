import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateStudent } from "@/lib/student";
import { calculateNextReview, qualityFromButton } from "@/lib/srs";
import type { SRSCard } from "@/lib/srs";

// GET /api/flashcards?unit=1&direction=fr_en&limit=20
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const unit = url.searchParams.get("unit");
    const direction = url.searchParams.get("direction") ?? "fr_en";
    const limit = parseInt(url.searchParams.get("limit") ?? "20", 10);

    const student = await getOrCreateStudent();
    const now = new Date();

    // Get cards due for review
    const due = await prisma.flashcardProgress.findMany({
      where: {
        studentId: student.id,
        direction,
        nextReview: { lte: now },
        ...(unit ? { vocabKey: { startsWith: `u${unit}_` } } : {}),
      },
      orderBy: { nextReview: "asc" },
      take: limit,
    });

    return NextResponse.json({ cards: due, studentId: student.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch flashcards" }, { status: 500 });
  }
}

// POST /api/flashcards — review a card
export async function POST(req: Request) {
  try {
    const { vocabKey, direction, button } = await req.json();
    const student = await getOrCreateStudent();
    const quality = qualityFromButton(button);

    // Find or create progress record
    let progress = await prisma.flashcardProgress.findUnique({
      where: {
        studentId_vocabKey_direction: {
          studentId: student.id,
          vocabKey,
          direction: direction ?? "fr_en",
        },
      },
    });

    const cardState: SRSCard = progress
      ? {
          easeFactor: progress.easeFactor,
          interval: progress.interval,
          repetitions: progress.repetitions,
          nextReview: progress.nextReview,
        }
      : { easeFactor: 2.5, interval: 1, repetitions: 0, nextReview: new Date() };

    const next = calculateNextReview(cardState, quality);

    const updated = await prisma.flashcardProgress.upsert({
      where: {
        studentId_vocabKey_direction: {
          studentId: student.id,
          vocabKey,
          direction: direction ?? "fr_en",
        },
      },
      create: {
        studentId: student.id,
        vocabKey,
        direction: direction ?? "fr_en",
        ...next,
        lastReview: new Date(),
      },
      update: {
        ...next,
        lastReview: new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update flashcard" }, { status: 500 });
  }
}

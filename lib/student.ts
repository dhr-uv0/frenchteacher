import { prisma } from "./prisma";

export const DEFAULT_STUDENT_ID = "default_student";

export async function getOrCreateStudent() {
  let student = await prisma.student.findFirst();
  if (!student) {
    student = await prisma.student.create({
      data: {
        id: DEFAULT_STUDENT_ID,
        name: "Student",
        currentUnit: 3,
        streak: 0,
        unitProgress: {
          create: [1, 2, 3, 4, 5, 6].map((unit) => ({
            unitNumber: unit,
            masteryPct: unit <= 2 ? 82 : unit === 3 ? 75 : 0,
            isUnlocked: unit <= 4,
            isComplete: false,
          })),
        },
      },
      include: { unitProgress: true },
    });
  }
  return student;
}

export async function updateStreak(studentId: string) {
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) return;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastStudy = student.lastStudyDate
    ? new Date(student.lastStudyDate)
    : null;

  if (!lastStudy) {
    await prisma.student.update({
      where: { id: studentId },
      data: { streak: 1, lastStudyDate: now },
    });
    return;
  }

  const lastDay = new Date(
    lastStudy.getFullYear(),
    lastStudy.getMonth(),
    lastStudy.getDate()
  );
  const diffDays = Math.floor(
    (today.getTime() - lastDay.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) {
    // same day — no change
  } else if (diffDays === 1) {
    // consecutive day
    await prisma.student.update({
      where: { id: studentId },
      data: { streak: student.streak + 1, lastStudyDate: now },
    });
  } else {
    // streak broken
    await prisma.student.update({
      where: { id: studentId },
      data: { streak: 1, lastStudyDate: now },
    });
  }
}

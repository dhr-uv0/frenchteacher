"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn, getUnitColor, formatTime, formatDate } from "@/lib/utils";
import { UNITS } from "@/data/curriculum";
import {
  getStudent,
  getUnitProgress,
  getMistakes,
  getSessions,
} from "@/lib/store";
import type { UnitProgress, MistakeEntry, StudySession } from "@/lib/store";
import {
  Flame,
  BookOpen,
  Layers,
  PenLine,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronRight,
  CalendarDays,
  TrendingUp,
  Plus,
} from "lucide-react";

type Mistake = MistakeEntry;
type Session = StudySession;

interface CanvasAssignment {
  id: number;
  name: string;
  due_at: string | null;
  points_possible: number;
  html_url: string;
}

const UNIT_COLORS_BG: Record<string, string> = {
  blue: "bg-blue-500",
  emerald: "bg-emerald-500",
  violet: "bg-violet-500",
  orange: "bg-orange-500",
  rose: "bg-rose-500",
  amber: "bg-amber-500",
};

const UNIT_COLORS_TEXT: Record<string, string> = {
  blue: "text-blue-600 dark:text-blue-400",
  emerald: "text-emerald-600 dark:text-emerald-400",
  violet: "text-violet-600 dark:text-violet-400",
  orange: "text-orange-600 dark:text-orange-400",
  rose: "text-rose-600 dark:text-rose-400",
  amber: "text-amber-600 dark:text-amber-400",
};

const UNIT_COLORS_LIGHT: Record<string, string> = {
  blue: "bg-blue-50 dark:bg-blue-950/30",
  emerald: "bg-emerald-50 dark:bg-emerald-950/30",
  violet: "bg-violet-50 dark:bg-violet-950/30",
  orange: "bg-orange-50 dark:bg-orange-950/30",
  rose: "bg-rose-50 dark:bg-rose-950/30",
  amber: "bg-amber-50 dark:bg-amber-950/30",
};

export default function DashboardClient() {
  const [student, setStudent] = useState<{
    name: string;
    streakDays: number;
    currentUnit: number;
  } | null>(null);
  const [unitProgress, setUnitProgress] = useState<UnitProgress[]>([]);
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [canvasAssignments, setCanvasAssignments] = useState<CanvasAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage (synchronous)
    const s = getStudent();
    const up = getUnitProgress();
    const m = getMistakes(20);
    const sess = getSessions(10);

    setStudent({ name: s.name, streakDays: s.streakDays, currentUnit: s.currentUnit });
    setUnitProgress(up);
    setMistakes(m);
    setSessions(sess);
    setLoading(false);

    // Canvas still uses fetch
    fetch("/api/canvas?endpoint=assignments")
      .then((r) => r.json())
      .then((canvasData) => {
        if (canvasData.configured && canvasData.data) {
          setCanvasAssignments(canvasData.data.slice(0, 5));
        }
      })
      .catch(() => {});
  }, []);

  if (loading) return null;

  const unreviewedMistakes = mistakes.filter((m) => !m.reviewed);
  const lastSession = sessions[0];
  const totalStudyTime = sessions.reduce((sum, s) => sum + (s.timeSpentSec ?? 0), 0);

  // Today's recommended tasks based on mastery and mistakes
  const todayTasks = buildTodayTasks(unitProgress, unreviewedMistakes, student?.currentUnit ?? 3);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
            Bonjour{student?.name ? `, ${student.name}` : ""} ! 👋
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            French 1 · EntreCultures 1 · Skyline High School
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Streak badge */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold"
            style={{ backgroundColor: "var(--surface2)", color: "var(--text)" }}
          >
            <Flame className="h-4 w-4 text-orange-500" />
            {student?.streakDays ?? 0} day streak
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          icon={<TrendingUp className="h-4 w-4 text-blue-500" />}
          label="Overall Mastery"
          value={`${Math.round(
            unitProgress.reduce((sum, u) => sum + u.masteryPct, 0) /
              Math.max(unitProgress.filter((u) => u.isUnlocked).length, 1)
          )}%`}
          sub={`Units 1–${student?.currentUnit ?? 3}`}
        />
        <StatCard
          icon={<AlertCircle className="h-4 w-4 text-red-500" />}
          label="Mistakes to Review"
          value={String(unreviewedMistakes.length)}
          sub="unreviewed errors"
        />
        <StatCard
          icon={<Clock className="h-4 w-4 text-violet-500" />}
          label="Total Study Time"
          value={formatTime(totalStudyTime)}
          sub="all time"
        />
        <StatCard
          icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
          label="Sessions Done"
          value={String(sessions.length)}
          sub="all time"
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Unit progress (3 cols) */}
        <div
          className="md:col-span-3 rounded-xl p-4 space-y-3"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm" style={{ color: "var(--text)" }}>
              Unit Progress
            </h2>
            <Link
              href="/lessons"
              className="text-xs flex items-center gap-0.5 hover:underline"
              style={{ color: "var(--text-muted)" }}
            >
              All units <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-2.5">
            {UNITS.map((unit) => {
              const progress = unitProgress.find((p) => p.unitNumber === unit.number);
              const pct = progress?.masteryPct ?? 0;
              const unlocked = progress?.isUnlocked ?? false;
              const colorBg = UNIT_COLORS_BG[unit.color] ?? "bg-slate-500";
              const colorText = UNIT_COLORS_TEXT[unit.color] ?? "text-slate-600";

              return (
                <div key={unit.number}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "text-xs font-bold px-1.5 py-0.5 rounded",
                          UNIT_COLORS_LIGHT[unit.color],
                          colorText
                        )}
                      >
                        U{unit.number}
                      </span>
                      <span className="text-xs font-medium" style={{ color: unlocked ? "var(--text)" : "var(--text-subtle)" }}>
                        {unit.title}
                      </span>
                      {progress?.isComplete && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      )}
                    </div>
                    <span className="text-xs font-semibold" style={{ color: colorText.includes("blue") ? "#2563eb" : "var(--text-muted)" }}>
                      {unlocked ? `${Math.round(pct)}%` : "Locked"}
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: "var(--surface2)" }}
                  >
                    {unlocked && (
                      <div
                        className={cn("h-full rounded-full transition-all duration-700", colorBg)}
                        style={{ width: `${pct}%` }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <Link
            href={`/lessons/unit-${student?.currentUnit ?? 3}`}
            className="mt-2 flex items-center justify-center gap-2 w-full py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor: "var(--accent-fr)",
              color: "white",
            }}
          >
            <BookOpen className="h-4 w-4" />
            Continue Unit {student?.currentUnit ?? 3}
          </Link>
        </div>

        {/* Today's tasks (2 cols) */}
        <div
          className="md:col-span-2 rounded-xl p-4 space-y-3"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <h2 className="font-semibold text-sm" style={{ color: "var(--text)" }}>
            Today's Study Plan
          </h2>
          <div className="space-y-2">
            {todayTasks.map((task, i) => (
              <Link
                key={i}
                href={task.href}
                className="flex items-start gap-2.5 p-2.5 rounded-lg transition-colors hover:bg-[var(--surface2)] group"
              >
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-md flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: "var(--surface2)" }}
                >
                  {task.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium leading-tight truncate" style={{ color: "var(--text)" }}>
                    {task.title}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {task.description}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 flex-shrink-0 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--text-muted)" }} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mistake history */}
        <div
          className="rounded-xl p-4"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-sm flex items-center gap-1.5" style={{ color: "var(--text)" }}>
              <AlertCircle className="h-4 w-4 text-red-500" />
              Recent Mistakes
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400 font-medium">
              {unreviewedMistakes.length} to review
            </span>
          </div>
          {mistakes.length === 0 ? (
            <p className="text-sm text-center py-4" style={{ color: "var(--text-muted)" }}>
              No mistakes yet — keep studying!
            </p>
          ) : (
            <div className="space-y-1.5">
              {mistakes.slice(0, 5).map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "flex items-start gap-2 p-2 rounded-lg text-xs",
                    m.reviewed ? "opacity-50" : ""
                  )}
                  style={{ backgroundColor: "var(--surface2)" }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate fr-text" style={{ color: "var(--text)" }}>
                      {m.question}
                    </p>
                    <p style={{ color: "var(--text-muted)" }}>
                      You wrote: <span className="text-red-500 line-through">{m.wrongAnswer}</span>
                      {" → "}
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">{m.rightAnswer}</span>
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-subtle)" }}>
                      {m.category} · Unit {m.unitNumber ?? "?"} · {formatDate(m.createdAt)}
                    </p>
                  </div>
                  {!m.reviewed && (
                    <span className="h-2 w-2 rounded-full bg-red-500 flex-shrink-0 mt-1" />
                  )}
                </div>
              ))}
              {mistakes.length > 5 && (
                <Link
                  href="/quiz?mode=mistakes"
                  className="text-xs block text-center mt-2 hover:underline"
                  style={{ color: "var(--accent-fr)" }}
                >
                  Practice all {unreviewedMistakes.length} mistakes →
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Canvas assignments + last session */}
        <div className="space-y-4">
          {/* Canvas */}
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center gap-1.5 mb-3">
              <CalendarDays className="h-4 w-4 text-[var(--accent-fr)]" />
              <h2 className="font-semibold text-sm" style={{ color: "var(--text)" }}>
                Upcoming Canvas Work
              </h2>
            </div>
            {canvasAssignments.length === 0 ? (
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {process.env.CANVAS_API_TOKEN
                  ? "No upcoming assignments"
                  : "Configure Canvas API in .env.local to see assignments"}
              </p>
            ) : (
              <div className="space-y-1.5">
                {canvasAssignments.map((a) => (
                  <a
                    key={a.id}
                    href={a.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-xs p-2 rounded-lg hover:bg-[var(--surface2)] transition-colors"
                  >
                    <span className="truncate font-medium" style={{ color: "var(--text)" }}>
                      {a.name}
                    </span>
                    <span className="ml-2 flex-shrink-0" style={{ color: "var(--text-muted)" }}>
                      {a.due_at
                        ? new Date(a.due_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "No due date"}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Last session */}
          {lastSession && (
            <div
              className="rounded-xl p-4"
              style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <h2 className="font-semibold text-sm mb-2" style={{ color: "var(--text)" }}>
                Last Session
              </h2>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "var(--surface2)" }}
                >
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-medium capitalize" style={{ color: "var(--text)" }}>
                    {lastSession.sessionType} {lastSession.unitNumber ? `· Unit ${lastSession.unitNumber}` : ""}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {lastSession.score !== null ? `${Math.round(lastSession.score)}%` : ""}{" "}
                    {lastSession.totalItems > 0 &&
                      `${lastSession.correctItems}/${lastSession.totalItems} correct`}{" "}
                    · {formatTime(lastSession.timeSpentSec)} · {formatDate(lastSession.createdAt)}
                  </p>
                  {lastSession.reviewNext && (
                    <p className="text-xs mt-0.5 font-medium text-amber-600 dark:text-amber-400">
                      Review: {lastSession.reviewNext}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { href: "/flashcards", label: "Flashcards", icon: <Layers className="h-5 w-5" />, color: "bg-blue-500" },
          { href: "/writing", label: "Writing Practice", icon: <PenLine className="h-5 w-5" />, color: "bg-violet-500" },
          { href: "/quiz", label: "Take a Quiz", icon: <CheckCircle2 className="h-5 w-5" />, color: "bg-emerald-500" },
          { href: "/tutor", label: "AI Tutor", icon: <Plus className="h-5 w-5" />, color: "bg-orange-500" },
        ].map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="flex items-center gap-2.5 p-3 rounded-xl transition-all hover:scale-[1.02] hover:shadow-md"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg text-white", a.color)}>
              {a.icon}
            </div>
            <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
              {a.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div
      className="rounded-xl p-3"
      style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
          {label}
        </span>
      </div>
      <p className="text-xl font-bold" style={{ color: "var(--text)" }}>
        {value}
      </p>
      <p className="text-xs mt-0.5" style={{ color: "var(--text-subtle)" }}>
        {sub}
      </p>
    </div>
  );
}

interface TodayTask {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  priority: number;
}

function buildTodayTasks(
  unitProgress: UnitProgress[],
  mistakes: Mistake[],
  currentUnit: number
): TodayTask[] {
  const tasks: TodayTask[] = [];

  // Mistakes to review
  if (mistakes.length > 0) {
    tasks.push({
      title: `Review ${mistakes.length} recent mistake${mistakes.length > 1 ? "s" : ""}`,
      description: "Target your weak spots with focused practice",
      href: "/quiz?mode=mistakes",
      icon: <AlertCircle className="h-4 w-4 text-red-500" />,
      priority: 1,
    });
  }

  // Flashcards due
  tasks.push({
    title: "Daily flashcard review",
    description: "Spaced repetition — cards due today",
    href: "/flashcards",
    icon: <Layers className="h-4 w-4 text-blue-500" />,
    priority: 2,
  });

  // Current unit lesson
  const currentProgress = unitProgress.find((p) => p.unitNumber === currentUnit);
  if (currentProgress && currentProgress.masteryPct < 90) {
    tasks.push({
      title: `Unit ${currentUnit} lesson`,
      description: `${Math.round(currentProgress.masteryPct)}% mastery — keep going`,
      href: `/lessons/unit-${currentUnit}`,
      icon: <BookOpen className="h-4 w-4 text-violet-500" />,
      priority: 3,
    });
  }

  // Writing practice
  tasks.push({
    title: "Writing practice",
    description: "Output is your #1 growth area",
    href: "/writing",
    icon: <PenLine className="h-4 w-4 text-emerald-500" />,
    priority: 4,
  });

  return tasks.sort((a, b) => a.priority - b.priority).slice(0, 4);
}

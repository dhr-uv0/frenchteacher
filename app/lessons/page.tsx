import Link from "next/link";
import { UNITS } from "@/data/curriculum";
import { cn } from "@/lib/utils";
import { BookOpen, Lock } from "lucide-react";

const UNIT_COLORS_BG: Record<string, string> = {
  blue: "bg-blue-500",
  emerald: "bg-emerald-500",
  violet: "bg-violet-500",
  orange: "bg-orange-500",
  rose: "bg-rose-500",
  amber: "bg-amber-500",
};

const UNIT_COLORS_LIGHT: Record<string, string> = {
  blue: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800",
  emerald: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800",
  violet: "bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800",
  orange: "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800",
  rose: "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800",
  amber: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800",
};

export default function LessonsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
          Lessons
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          EntreCultures 1 — all 6 units with mastery-based progression
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {UNITS.map((unit) => {
          const isLocked = unit.number > 4; // Units 5-6 partially locked initially
          return (
            <Link
              key={unit.number}
              href={`/lessons/unit-${unit.number}`}
              className={cn(
                "group rounded-xl p-5 border transition-all hover:shadow-md",
                UNIT_COLORS_LIGHT[unit.color]
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl text-white text-lg font-bold",
                    UNIT_COLORS_BG[unit.color]
                  )}
                >
                  {unit.number}
                </div>
                {isLocked && <Lock className="h-4 w-4" style={{ color: "var(--text-muted)" }} />}
              </div>
              <h2 className="font-bold text-base mb-0.5" style={{ color: "var(--text)" }}>
                {unit.title}
              </h2>
              <p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>
                {unit.subtitle}
              </p>
              <div className="flex flex-wrap gap-1">
                {unit.topics.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: "var(--surface)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
                  >
                    {t}
                  </span>
                ))}
                {unit.topics.length > 3 && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: "var(--surface)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
                  >
                    +{unit.topics.length - 3} more
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

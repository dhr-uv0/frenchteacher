import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? `${count} ${singular}` : `${count} ${plural ?? singular + "s"}`;
}

export function getUnitColor(unit: number): string {
  const colors: Record<number, string> = {
    1: "blue",
    2: "emerald",
    3: "violet",
    4: "orange",
    5: "rose",
    6: "amber",
  };
  return colors[unit] ?? "slate";
}

export function getUnitColorClass(unit: number, variant: "bg" | "text" | "border" | "ring" = "bg"): string {
  const color = getUnitColor(unit);
  const map: Record<string, Record<string, string>> = {
    bg: {
      blue: "bg-blue-500",
      emerald: "bg-emerald-500",
      violet: "bg-violet-500",
      orange: "bg-orange-500",
      rose: "bg-rose-500",
      amber: "bg-amber-500",
      slate: "bg-slate-500",
    },
    text: {
      blue: "text-blue-600",
      emerald: "text-emerald-600",
      violet: "text-violet-600",
      orange: "text-orange-600",
      rose: "text-rose-600",
      amber: "text-amber-600",
      slate: "text-slate-600",
    },
    border: {
      blue: "border-blue-400",
      emerald: "border-emerald-400",
      violet: "border-violet-400",
      orange: "border-orange-400",
      rose: "border-rose-400",
      amber: "border-amber-400",
      slate: "border-slate-400",
    },
    ring: {
      blue: "ring-blue-400",
      emerald: "ring-emerald-400",
      violet: "ring-violet-400",
      orange: "ring-orange-400",
      rose: "ring-rose-400",
      amber: "ring-amber-400",
      slate: "ring-slate-400",
    },
  };
  return map[variant]?.[color] ?? "";
}

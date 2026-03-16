"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "./ThemeProvider";
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  PenLine,
  BookMarked,
  ClipboardCheck,
  MessageSquare,
  Link2,
  Star,
  Moon,
  Sun,
  GraduationCap,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/lessons", label: "Lessons", icon: BookOpen },
  { href: "/flashcards", label: "Flashcards", icon: Layers },
  { href: "/writing", label: "Writing", icon: PenLine },
  { href: "/journal", label: "Journal", icon: BookMarked },
  { href: "/quiz", label: "Quizzes", icon: ClipboardCheck },
  { href: "/glue", label: "Glue Words", icon: Link2 },
  { href: "/tutor", label: "AI Tutor", icon: MessageSquare },
  { href: "/reference", label: "Quick Reference", icon: Star },
];

const UNIT_COLORS: Record<number, string> = {
  1: "bg-blue-500",
  2: "bg-emerald-500",
  3: "bg-violet-500",
  4: "bg-orange-500",
  5: "bg-rose-500",
  6: "bg-amber-500",
};

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  return (
    <aside
      className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-40"
      style={{ width: "var(--sidebar-w)", backgroundColor: "var(--surface)", borderRight: "1px solid var(--border)" }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2 px-4 py-5 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-fr)]">
          <GraduationCap className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="font-bold text-sm leading-tight" style={{ color: "var(--text)" }}>
            FrenchMaestro
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            EntreCultures 1
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-0.5 transition-colors",
                active
                  ? "bg-[var(--accent-fr)] text-white"
                  : "text-[var(--text-muted)] hover:bg-[var(--surface2)] hover:text-[var(--text)]"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}

        {/* Unit shortcuts */}
        <div className="mt-4 px-3">
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-subtle)" }}>
            Units
          </p>
          {[1, 2, 3, 4, 5, 6].map((u) => (
            <Link
              key={u}
              href={`/lessons/unit-${u}`}
              className={cn(
                "flex items-center gap-2.5 px-2 py-1.5 rounded-md text-xs font-medium mb-0.5 transition-colors",
                pathname === `/lessons/unit-${u}`
                  ? "bg-[var(--surface2)] text-[var(--text)]"
                  : "text-[var(--text-muted)] hover:bg-[var(--surface2)]"
              )}
            >
              <span className={cn("h-2.5 w-2.5 rounded-full flex-shrink-0", UNIT_COLORS[u])} />
              Unit {u}
            </Link>
          ))}
        </div>
      </nav>

      {/* Bottom controls */}
      <div className="p-3 border-t" style={{ borderColor: "var(--border)" }}>
        <button
          onClick={toggle}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors hover:bg-[var(--surface2)]"
          style={{ color: "var(--text-muted)" }}
          title="Toggle dark mode"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>
      </div>
    </aside>
  );
}

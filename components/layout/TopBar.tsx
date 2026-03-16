"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "./ThemeProvider";
import { Moon, Sun, Star } from "lucide-react";

const BREADCRUMBS: Record<string, string> = {
  "/": "Dashboard",
  "/lessons": "Lessons",
  "/flashcards": "Flashcards",
  "/writing": "Writing",
  "/journal": "Journal",
  "/quiz": "Quizzes",
  "/glue": "Glue Words",
  "/tutor": "AI Tutor",
  "/reference": "Quick Reference",
};

export default function TopBar() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  const segments = pathname.split("/").filter(Boolean);
  const title = BREADCRUMBS[pathname] ?? (segments.map((s) => s.replace(/-/g, " ")).join(" › ") || "Dashboard");

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 h-14"
      style={{
        backgroundColor: "var(--surface)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="flex items-center gap-1 text-sm" style={{ color: "var(--text-muted)" }}>
        <Link href="/" className="hover:text-[var(--text)] transition-colors capitalize">
          Home
        </Link>
        {segments.map((seg, i) => (
          <span key={seg} className="flex items-center gap-1">
            <span>/</span>
            <Link
              href={"/" + segments.slice(0, i + 1).join("/")}
              className="hover:text-[var(--text)] transition-colors capitalize"
            >
              {seg.replace(/-/g, " ")}
            </Link>
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/reference"
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
            "hover:bg-[var(--surface2)]"
          )}
          style={{ color: "var(--text-muted)" }}
          title="Quick Reference"
        >
          <Star className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Reference</span>
        </Link>
        <button
          onClick={toggle}
          className="flex items-center justify-center h-9 w-9 rounded-md transition-colors hover:bg-[var(--surface2)]"
          style={{ color: "var(--text-muted)" }}
          title={theme === "dark" ? "Light mode" : "Dark mode"}
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
}

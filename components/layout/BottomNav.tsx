"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  PenLine,
  MessageSquare,
} from "lucide-react";

const MOBILE_NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/lessons", label: "Lessons", icon: BookOpen },
  { href: "/flashcards", label: "Cards", icon: Layers },
  { href: "/writing", label: "Write", icon: PenLine },
  { href: "/tutor", label: "Tutor", icon: MessageSquare },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center"
      style={{
        backgroundColor: "var(--surface)",
        borderTop: "1px solid var(--border)",
        paddingBottom: "env(safe-area-inset-bottom)",
        height: "calc(60px + env(safe-area-inset-bottom))",
      }}
    >
      {MOBILE_NAV.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || (href !== "/" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs font-medium transition-colors",
              active ? "text-[var(--accent-fr)]" : "text-[var(--text-muted)]"
            )}
          >
            <Icon className={cn("h-5 w-5", active && "scale-110 transition-transform")} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

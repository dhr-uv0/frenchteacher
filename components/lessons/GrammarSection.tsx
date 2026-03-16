"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { GrammarRule } from "@/data/curriculum";
import { ChevronDown, ChevronUp, MessageSquare } from "lucide-react";

interface Props {
  rules: GrammarRule[];
  unit: number;
  onMastered: () => void;
}

export default function GrammarSection({ rules, unit, onMastered }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set([rules[0]?.id ?? ""]));

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  if (rules.length === 0) {
    return (
      <div className="text-center py-8" style={{ color: "var(--text-muted)" }}>
        Grammar rules coming soon for Unit {unit}.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {rules.map((rule) => {
        const open = expanded.has(rule.id);
        return (
          <div
            key={rule.id}
            className="rounded-xl overflow-hidden"
            style={{ border: "1px solid var(--border)" }}
          >
            <button
              onClick={() => toggle(rule.id)}
              className="w-full flex items-center justify-between px-5 py-4 transition-colors hover:bg-[var(--surface2)]"
              style={{ backgroundColor: "var(--surface)" }}
            >
              <span className="font-semibold text-sm text-left" style={{ color: "var(--text)" }}>
                {rule.title}
              </span>
              {open ? (
                <ChevronUp className="h-4 w-4 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
              ) : (
                <ChevronDown className="h-4 w-4 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
              )}
            </button>

            {open && (
              <div className="px-5 pb-5 space-y-4" style={{ backgroundColor: "var(--surface)" }}>
                {/* Plain English explanation */}
                <div
                  className="p-4 rounded-lg text-sm leading-relaxed"
                  style={{ backgroundColor: "var(--surface2)", color: "var(--text)" }}
                >
                  {rule.explanation}
                </div>

                {/* Examples */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                    Examples
                  </p>
                  <div className="space-y-2">
                    {rule.examples.map((ex, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-lg"
                        style={{ backgroundColor: "var(--surface2)" }}
                      >
                        <span
                          className="flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold flex-shrink-0 mt-0.5 text-white"
                          style={{ backgroundColor: "var(--accent-fr)" }}
                        >
                          {i + 1}
                        </span>
                        <div>
                          <p className="fr-text text-base font-medium" style={{ color: "var(--text)" }}>
                            {ex.french}
                          </p>
                          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
                            {ex.english}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tables */}
                {rule.tables?.map((table) => (
                  <div key={table.title}>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                      {table.title}
                    </p>
                    <div className="overflow-x-auto rounded-lg" style={{ border: "1px solid var(--border)" }}>
                      <table className="w-full text-sm">
                        <thead style={{ backgroundColor: "var(--accent-fr)" }}>
                          <tr>
                            {table.headers.map((h) => (
                              <th
                                key={h}
                                className="px-3 py-2 text-left text-xs font-semibold text-white"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {table.rows.map((row, i) => (
                            <tr
                              key={i}
                              style={{
                                backgroundColor: i % 2 === 0 ? "var(--surface)" : "var(--surface2)",
                              }}
                            >
                              <td className="px-3 py-2 font-semibold fr-text" style={{ color: "var(--text)" }}>
                                {row.label}
                              </td>
                              {row.cells.map((cell, j) => (
                                <td key={j} className="px-3 py-2 fr-text" style={{ color: "var(--text)" }}>
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}

                {/* Ask AI button */}
                <a
                  href={`/tutor?topic=${encodeURIComponent(rule.title)}`}
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors hover:bg-[var(--surface2)]"
                  style={{ color: "var(--accent-fr)" }}
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  Ask AI Tutor about this rule
                </a>
              </div>
            )}
          </div>
        );
      })}

      <button
        onClick={onMastered}
        className="w-full py-2.5 rounded-xl text-sm font-medium border transition-colors hover:bg-[var(--surface2)]"
        style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
      >
        Mark Grammar as Reviewed ✓
      </button>
    </div>
  );
}

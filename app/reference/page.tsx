"use client";

import { useState } from "react";
import { GRAMMAR_RULES, ALL_VOCAB, GLUE_WORDS } from "@/data/curriculum";
import { cn } from "@/lib/utils";
import { Search, BookOpen, Hash, Link2 } from "lucide-react";

type Tab = "grammar" | "vocab" | "glue";

export default function ReferencePage() {
  const [tab, setTab] = useState<Tab>("grammar");
  const [search, setSearch] = useState("");

  const filteredGrammar = GRAMMAR_RULES.filter(
    (r) =>
      !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.explanation.toLowerCase().includes(search.toLowerCase())
  );

  const filteredVocab = ALL_VOCAB.filter(
    (v) =>
      v.unit > 0 &&
      (!search ||
        v.french.toLowerCase().includes(search.toLowerCase()) ||
        v.english.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredGlue = GLUE_WORDS.filter(
    (w) =>
      !search ||
      w.french.toLowerCase().includes(search.toLowerCase()) ||
      w.english.toLowerCase().includes(search.toLowerCase())
  );

  const UNIT_LABELS: Record<number, string> = {
    1: "Unit 1 — Bonjour !",
    2: "Unit 2 — Qu'est-ce que tu aimes ?",
    3: "Unit 3 — À l'école",
    4: "Unit 4 — Ma famille",
    5: "Unit 5 — Chez moi",
    6: "Unit 6 — À table !",
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: "var(--text)" }}>
          Quick Reference
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          All grammar rules, vocabulary, and glue words — searchable, always accessible.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--text-muted)" }} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search grammar rules, vocabulary, or glue words…"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-[var(--accent-fr)]"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
        />
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
        {([
          { id: "grammar", label: "Grammar Rules", icon: <BookOpen className="h-4 w-4" /> },
          { id: "vocab", label: "Vocabulary", icon: <Hash className="h-4 w-4" /> },
          { id: "glue", label: "Glue Words", icon: <Link2 className="h-4 w-4" /> },
        ] as { id: Tab; label: string; icon: React.ReactNode }[]).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn("flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition-colors", tab === t.id ? "bg-[var(--accent-fr)] text-white" : "bg-[var(--surface)] hover:bg-[var(--surface2)]")}
            style={{ color: tab === t.id ? "white" : "var(--text-muted)" }}
          >
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* Grammar tab */}
      {tab === "grammar" && (
        <div className="space-y-3">
          {filteredGrammar.map((rule) => (
            <div key={rule.id} className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
              <div className="px-4 py-3 flex items-center gap-2" style={{ backgroundColor: "var(--surface2)" }}>
                <span className="text-xs font-bold text-white px-2 py-0.5 rounded" style={{ backgroundColor: "var(--accent-fr)" }}>
                  U{rule.unit}
                </span>
                <span className="font-semibold text-sm" style={{ color: "var(--text)" }}>{rule.title}</span>
              </div>
              <div className="px-4 py-3 space-y-3" style={{ backgroundColor: "var(--surface)" }}>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>{rule.explanation}</p>
                <div className="space-y-1.5">
                  {rule.examples.map((ex, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-xs mt-0.5 font-bold flex-shrink-0" style={{ color: "var(--accent-fr)" }}>{i + 1}.</span>
                      <span className="fr-text font-medium" style={{ color: "var(--text)" }}>{ex.french}</span>
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>= {ex.english}</span>
                    </div>
                  ))}
                </div>
                {rule.tables?.map((table) => (
                  <div key={table.title} className="overflow-x-auto rounded-lg" style={{ border: "1px solid var(--border)" }}>
                    <table className="w-full text-xs">
                      <thead style={{ backgroundColor: "var(--accent-fr)" }}>
                        <tr>
                          {table.headers.map((h) => (
                            <th key={h} className="px-3 py-2 text-left font-semibold text-white whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {table.rows.map((row, i) => (
                          <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "var(--surface)" : "var(--surface2)" }}>
                            <td className="px-3 py-2 font-semibold fr-text" style={{ color: "var(--text)" }}>{row.label}</td>
                            {row.cells.map((cell, j) => (
                              <td key={j} className="px-3 py-2 fr-text" style={{ color: "var(--text)" }}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {filteredGrammar.length === 0 && (
            <p className="text-center py-8 text-sm" style={{ color: "var(--text-muted)" }}>No grammar rules match your search.</p>
          )}
        </div>
      )}

      {/* Vocab tab */}
      {tab === "vocab" && (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((unit) => {
            const unitVocab = filteredVocab.filter((v) => v.unit === unit);
            if (unitVocab.length === 0) return null;
            return (
              <div key={unit}>
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                  {UNIT_LABELS[unit]}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {unitVocab.map((v) => (
                    <div key={v.key} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
                      <span className="fr-text font-medium text-sm" style={{ color: "var(--text)" }}>{v.french}</span>
                      <span className="text-xs ml-2" style={{ color: "var(--text-muted)" }}>{v.english}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {filteredVocab.length === 0 && (
            <p className="text-center py-8 text-sm" style={{ color: "var(--text-muted)" }}>No vocabulary matches your search.</p>
          )}
        </div>
      )}

      {/* Glue tab */}
      {tab === "glue" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {filteredGlue.map((w) => (
            <div key={w.key} className="flex items-center justify-between px-3 py-2.5 rounded-xl" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
              <div>
                <span className="fr-text font-bold text-base" style={{ color: "var(--text)" }}>{w.french}</span>
                {w.audioHint && <span className="text-xs italic ml-2" style={{ color: "var(--text-subtle)" }}>[{w.audioHint}]</span>}
              </div>
              <span className="text-sm ml-2" style={{ color: "var(--text-muted)" }}>{w.english}</span>
            </div>
          ))}
          {filteredGlue.length === 0 && (
            <p className="col-span-2 text-center py-8 text-sm" style={{ color: "var(--text-muted)" }}>No glue words match your search.</p>
          )}
        </div>
      )}
    </div>
  );
}

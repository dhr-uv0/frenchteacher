"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { VocabItem } from "@/data/curriculum";
import { Volume2, Plus, ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  vocab: VocabItem[];
  unit: number;
  onMastered: () => void;
}

type FilterType = "all" | "verb" | "noun" | "adjective" | "adverb" | "phrase" | "number" | "pronoun" | "article";

const POS_COLORS: Record<string, string> = {
  verb: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
  noun: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  adjective: "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
  adverb: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300",
  phrase: "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
  greeting: "bg-pink-100 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300",
  number: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  pronoun: "bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300",
  article: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
};

export default function VocabSection({ vocab, unit, onMastered }: Props) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customFr, setCustomFr] = useState("");
  const [customEn, setCustomEn] = useState("");
  const [customNote, setCustomNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedCustom, setSavedCustom] = useState<VocabItem[]>([]);

  function speakFrench(text: string) {
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    utterance.rate = 0.85;
    speechSynthesis.speak(utterance);
  }

  const partsOfSpeech = [...new Set(vocab.map((v) => v.partOfSpeech))];
  const allVocab = [...vocab, ...savedCustom];

  const filtered = allVocab.filter((v) => {
    const matchFilter = filter === "all" || v.partOfSpeech === filter;
    const matchSearch =
      !search ||
      v.french.toLowerCase().includes(search.toLowerCase()) ||
      v.english.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  async function saveCustomWord() {
    if (!customFr.trim() || !customEn.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/custom-vocab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          french: customFr,
          english: customEn,
          unitNumber: unit,
          notes: customNote,
        }),
      });
      const saved = await res.json();
      setSavedCustom((prev) => [
        ...prev,
        {
          key: `custom_${saved.id}`,
          french: customFr,
          english: customEn,
          partOfSpeech: "custom",
          unit,
        },
      ]);
      setCustomFr("");
      setCustomEn("");
      setCustomNote("");
      setShowCustomForm(false);
    } catch {}
    setSaving(false);
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search vocabulary…"
          className="flex-1 px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--accent-fr)]"
          style={{ backgroundColor: "var(--surface2)", borderColor: "var(--border)", color: "var(--text)" }}
        />
        <button
          onClick={() => setShowCustomForm((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border transition-colors hover:bg-[var(--surface2)]"
          style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
        >
          <Plus className="h-4 w-4" /> Add Word
        </button>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-1.5">
        {(["all", ...partsOfSpeech.slice(0, 6)] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-medium transition-colors capitalize",
              filter === f
                ? "bg-[var(--accent-fr)] text-white"
                : "bg-[var(--surface2)] hover:bg-[var(--border)]"
            )}
            style={{ color: filter === f ? "white" : "var(--text-muted)" }}
          >
            {f} {f !== "all" && `(${allVocab.filter((v) => v.partOfSpeech === f).length})`}
          </button>
        ))}
      </div>

      {/* Custom word form */}
      {showCustomForm && (
        <div
          className="rounded-xl p-4 space-y-3 border"
          style={{ backgroundColor: "var(--surface2)", borderColor: "var(--accent-fr)" }}
        >
          <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>Add Custom Vocabulary</p>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={customFr}
              onChange={(e) => setCustomFr(e.target.value)}
              placeholder="French word/phrase"
              className="px-3 py-2 rounded-lg text-sm border outline-none fr-text"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
            />
            <input
              type="text"
              value={customEn}
              onChange={(e) => setCustomEn(e.target.value)}
              placeholder="English translation"
              className="px-3 py-2 rounded-lg text-sm border outline-none"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
            />
          </div>
          <input
            type="text"
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            placeholder="Notes (optional)"
            className="w-full px-3 py-2 rounded-lg text-sm border outline-none"
            style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
          />
          <div className="flex gap-2">
            <button
              onClick={saveCustomWord}
              disabled={saving || !customFr || !customEn}
              className="px-4 py-2 rounded-lg text-sm text-white disabled:opacity-60"
              style={{ backgroundColor: "var(--accent-fr)" }}
            >
              {saving ? "Saving…" : "Save to Flashcards"}
            </button>
            <button
              onClick={() => setShowCustomForm(false)}
              className="px-4 py-2 rounded-lg text-sm border transition-colors hover:bg-[var(--surface)]"
              style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Vocab list */}
      <div className="space-y-1.5">
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {filtered.length} word{filtered.length !== 1 ? "s" : ""}
        </p>
        {filtered.map((item) => (
          <div
            key={item.key}
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-[var(--surface2)]"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="fr-text font-semibold text-base" style={{ color: "var(--text)" }}>
                  {item.french}
                </span>
                {item.tricky && (
                  <button
                    onClick={() => speakFrench(item.french)}
                    className="flex items-center justify-center h-6 w-6 rounded-md transition-colors hover:bg-[var(--surface2)]"
                    style={{ color: "var(--accent-fr)" }}
                    title="Hear pronunciation"
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm" style={{ color: "var(--text-muted)" }}>{item.english}</span>
                {item.audioHint && (
                  <span className="text-xs italic" style={{ color: "var(--text-subtle)" }}>
                    [{item.audioHint}]
                  </span>
                )}
              </div>
            </div>
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0",
                POS_COLORS[item.partOfSpeech] ?? "bg-slate-100 text-slate-600"
              )}
            >
              {item.partOfSpeech}
            </span>
          </div>
        ))}
      </div>

      {filtered.length > 10 && (
        <button
          onClick={onMastered}
          className="w-full py-2.5 rounded-xl text-sm font-medium border transition-colors hover:bg-[var(--surface2)]"
          style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
        >
          Mark Vocabulary as Reviewed ✓
        </button>
      )}
    </div>
  );
}

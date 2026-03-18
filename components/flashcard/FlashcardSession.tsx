"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ALL_VOCAB, GLUE_WORDS, getVocabByUnit } from "@/data/curriculum";
import type { VocabItem } from "@/data/curriculum";
import { getCustomVocab, getDueFlashcards, upsertFlashcard, addMistake, addSession } from "@/lib/store";
import { calculateNextReview, qualityFromButton } from "@/lib/srs";
import type { SRSCard } from "@/lib/srs";
import { Volume2, RotateCcw, ChevronRight } from "lucide-react";

type Direction = "fr_en" | "en_fr";
type FilterUnit = "all" | "due" | "glue" | "custom" | "1" | "2" | "3" | "4" | "5" | "6";

interface SessionSummary {
  total: number;
  correct: number;
  again: number;
  timeSec: number;
}

export default function FlashcardSession() {
  const [filter, setFilter] = useState<FilterUnit>("due");
  const [direction, setDirection] = useState<Direction>("fr_en");
  const [deck, setDeck] = useState<VocabItem[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  const [sessionStats, setSessionStats] = useState({ correct: 0, again: 0 });
  const [startTime, setStartTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [customVocab, setCustomVocab] = useState<VocabItem[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [pickerUnit, setPickerUnit] = useState<number>(3);

  // Load custom vocab from localStorage
  useEffect(() => {
    const data = getCustomVocab();
    const mapped: VocabItem[] = data.map((v) => ({
      key: `custom_${v.id}`,
      french: v.french,
      english: v.english,
      partOfSpeech: "custom",
      unit: v.unitNumber ?? 0,
    }));
    setCustomVocab(mapped);
  }, []);

  const buildDeck = useCallback(
    (f: FilterUnit, d: Direction): VocabItem[] => {
      if (f === "due") {
        // Get SRS-due cards from store
        const dueCards = getDueFlashcards(d, 30);
        const dueKeys = new Set<string>(dueCards.map((c) => c.vocabKey));
        if (dueKeys.size === 0) {
          // Fall back to all unlocked vocab
          return [...ALL_VOCAB.filter((v) => v.unit <= 3), ...customVocab];
        }
        return ALL_VOCAB.filter((v) => dueKeys.has(v.key));
      }
      if (f === "glue") return GLUE_WORDS;
      if (f === "custom") {
        return [...ALL_VOCAB, ...customVocab].filter(v => selectedKeys.has(v.key));
      }
      if (f === "all") return [...ALL_VOCAB, ...customVocab];
      const unit = parseInt(f, 10);
      return [...getVocabByUnit(unit), ...customVocab.filter((v) => v.unit === unit)];
    },
    [customVocab]
  );

  const startSession = () => {
    setLoading(true);
    const cards = buildDeck(filter, direction);
    // Shuffle
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setIndex(0);
    setFlipped(false);
    setSessionStats({ correct: 0, again: 0 });
    setSummary(null);
    setSessionStarted(true);
    setStartTime(Date.now());
    setLoading(false);
  };

  const handleFlip = () => setFlipped((f) => !f);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!sessionStarted || summary) return;
      if (e.key === " " || e.key === "Enter") handleFlip();
    },
    [sessionStarted, summary]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  function handleResponse(response: "got_it" | "again") {
    const card = deck[index];
    const correct = response === "got_it";

    setSessionStats((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      again: prev.again + (correct ? 0 : 1),
    }));

    // Update SRS via store
    try {
      const allCards = getDueFlashcards(direction, 1000);
      const existing = allCards.find(
        (c) => c.vocabKey === card.key && c.direction === direction
      );
      const srsCard: SRSCard = {
        easeFactor: existing?.easeFactor ?? 2.5,
        interval: existing?.interval ?? 0,
        repetitions: existing?.repetitions ?? 0,
        nextReview: existing ? new Date(existing.nextReview) : new Date(),
      };
      const quality = qualityFromButton(response);
      const updated = calculateNextReview(srsCard, quality);
      upsertFlashcard({
        vocabKey: card.key,
        direction,
        easeFactor: updated.easeFactor,
        interval: updated.interval,
        repetitions: updated.repetitions,
        nextReview: updated.nextReview,
      });
    } catch {}

    // If wrong, record mistake
    if (!correct) {
      try {
        addMistake({
          unitNumber: card.unit || null,
          category: "vocabulary",
          question: direction === "fr_en" ? card.french : card.english,
          wrongAnswer: "(skipped)",
          rightAnswer: direction === "fr_en" ? card.english : card.french,
        });
      } catch {}
    }

    if (index + 1 >= deck.length) {
      // End session
      const timeSec = Math.round((Date.now() - startTime) / 1000);
      const newCorrect = sessionStats.correct + (correct ? 1 : 0);
      const newAgain = sessionStats.again + (correct ? 0 : 1);
      const final = {
        total: deck.length,
        correct: newCorrect,
        again: newAgain,
        timeSec,
      };
      setSummary(final);

      // Save session via store
      try {
        addSession({
          sessionType: "flashcard",
          unitNumber: null,
          score: (final.correct / final.total) * 100,
          totalItems: final.total,
          correctItems: final.correct,
          timeSpentSec: timeSec,
          reviewNext: null,
        });
      } catch {}
    } else {
      setIndex((i) => i + 1);
      setFlipped(false);
    }
  }

  function speakFrench(text: string) {
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    utterance.rate = 0.85;
    speechSynthesis.speak(utterance);
  }

  const card = deck[index];
  const progress = deck.length > 0 ? ((index) / deck.length) * 100 : 0;

  // ── Setup screen ──────────────────────────────────────────────────────────
  if (!sessionStarted) {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
            Flashcard Review
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Spaced repetition — practice what you need most
          </p>
        </div>

        {/* Direction toggle */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: "var(--text-muted)" }}>
            Direction
          </label>
          <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: "var(--border)" }}>
            {(["fr_en", "en_fr"] as Direction[]).map((d) => (
              <button
                key={d}
                onClick={() => setDirection(d)}
                className={cn(
                  "flex-1 py-2 text-sm font-medium transition-colors",
                  direction === d
                    ? "bg-[var(--accent-fr)] text-white"
                    : "bg-[var(--surface)] hover:bg-[var(--surface2)]"
                )}
                style={{ color: direction === d ? "white" : "var(--text)" }}
              >
                {d === "fr_en" ? "🇫🇷 French → English" : "🇺🇸 English → French"}
              </button>
            ))}
          </div>
          <p className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>
            {direction === "fr_en"
              ? "Recognition drill — see French, recall English"
              : "Production drill — see English, produce French (harder!)"}
          </p>
        </div>

        {/* Unit filter */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: "var(--text-muted)" }}>
            Card Set
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(["due", "all", "glue", "custom", "1", "2", "3", "4", "5", "6"] as FilterUnit[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "py-2 px-3 rounded-lg text-sm font-medium transition-colors border",
                  filter === f
                    ? "bg-[var(--accent-fr)] text-white border-[var(--accent-fr)]"
                    : "border-[var(--border)] hover:bg-[var(--surface2)]"
                )}
                style={{ color: filter === f ? "white" : "var(--text)" }}
              >
                {f === "due" ? "Due Now" : f === "all" ? "All" : f === "glue" ? "Glue" : f === "custom" ? "Custom" : `Unit ${f}`}
              </button>
            ))}
          </div>

          {filter === "custom" && (
            <div className="space-y-2 border rounded-xl p-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium" style={{ color: "var(--text)" }}>Pick cards for your custom set:</p>
                <div className="flex gap-2">
                  <button onClick={() => { const all = ALL_VOCAB.filter(v => v.unit === pickerUnit); setSelectedKeys(new Set(all.map(v => v.key))); }} className="text-xs px-2 py-1 rounded" style={{ color: "var(--accent-fr)" }}>All</button>
                  <button onClick={() => setSelectedKeys(new Set())} className="text-xs px-2 py-1 rounded" style={{ color: "var(--text-muted)" }}>Clear</button>
                </div>
              </div>
              {/* Unit filter for picker */}
              <div className="flex flex-wrap gap-1">
                {[1,2,3,4,5,6].map(u => (
                  <button key={u} onClick={() => setPickerUnit(u)} className={cn("px-2 py-0.5 rounded text-xs", pickerUnit === u ? "bg-[var(--accent-fr)] text-white" : "border text-[var(--text-muted)]")} style={{ borderColor: "var(--border)" }}>U{u}</button>
                ))}
              </div>
              {/* Scrollable vocab list */}
              <div className="max-h-48 overflow-y-auto space-y-1">
                {ALL_VOCAB.filter(v => v.unit === pickerUnit).map(v => (
                  <label key={v.key} className="flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-[var(--surface2)]">
                    <input
                      type="checkbox"
                      checked={selectedKeys.has(v.key)}
                      onChange={e => {
                        const next = new Set(selectedKeys);
                        if (e.target.checked) next.add(v.key);
                        else next.delete(v.key);
                        setSelectedKeys(next);
                      }}
                      className="rounded"
                    />
                    <span className="fr-text text-sm" style={{ color: "var(--text)" }}>{v.french}</span>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>— {v.english}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{selectedKeys.size} card{selectedKeys.size !== 1 ? "s" : ""} selected</p>
            </div>
          )}
        </div>

        <button
          onClick={startSession}
          disabled={loading || (filter === "custom" && selectedKeys.size === 0)}
          className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-opacity disabled:opacity-60"
          style={{ backgroundColor: "var(--accent-fr)" }}
        >
          {loading ? "Loading cards…" : "Start Session →"}
        </button>
      </div>
    );
  }

  // ── Session summary ────────────────────────────────────────────────────────
  if (summary) {
    const pct = Math.round((summary.correct / summary.total) * 100);
    return (
      <div className="max-w-lg mx-auto text-center space-y-6">
        <div className="rounded-2xl p-8 space-y-4" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="text-5xl">{pct >= 80 ? "🎉" : pct >= 60 ? "👍" : "💪"}</div>
          <h2 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Session Complete!</h2>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <p className="text-3xl font-bold text-emerald-500">{summary.correct}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Got It</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-red-500">{summary.again}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Again</p>
            </div>
            <div>
              <p className="text-3xl font-bold" style={{ color: "var(--text)" }}>{pct}%</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Score</p>
            </div>
          </div>

          {pct < 70 && (
            <div className="text-sm p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400">
              Tip: Switch to English → French direction to boost production practice.
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => { setSessionStarted(false); setSummary(null); }}
            className="flex-1 py-2.5 rounded-xl border text-sm font-medium transition-colors hover:bg-[var(--surface2)]"
            style={{ borderColor: "var(--border)", color: "var(--text)" }}
          >
            Change Settings
          </button>
          <button
            onClick={startSession}
            className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium"
            style={{ backgroundColor: "var(--accent-fr)" }}
          >
            Study Again
          </button>
        </div>
      </div>
    );
  }

  // ── Active flashcard ───────────────────────────────────────────────────────
  if (!card) return null;

  const frontText = direction === "fr_en" ? card.french : card.english;
  const backText = direction === "fr_en" ? card.english : card.french;

  return (
    <div className="max-w-lg mx-auto space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm" style={{ color: "var(--text-muted)" }}>
        <span>{index + 1} / {deck.length}</span>
        <span className="capitalize">{direction === "fr_en" ? "Recognition" : "Production"}</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--surface2)" }}>
        <div
          className="h-full bg-[var(--accent-fr)] rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Flashcard */}
      <div
        className="card-scene"
        style={{ height: "280px" }}
        onClick={handleFlip}
      >
        <div className={cn("card-inner w-full h-full cursor-pointer", flipped && "is-flipped")}>
          {/* Front */}
          <div
            className="card-front flex flex-col items-center justify-center rounded-2xl p-6 select-none"
            style={{
              backgroundColor: "var(--surface)",
              border: "2px solid var(--border)",
              height: "280px",
            }}
          >
            <p className="text-xs uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>
              {direction === "fr_en" ? "French" : "English"} · {card.partOfSpeech}
            </p>
            <p
              className={cn("text-center font-semibold leading-snug", direction === "fr_en" ? "fr-text text-3xl" : "text-2xl")}
              style={{ color: "var(--text)" }}
            >
              {frontText}
            </p>
            {direction === "fr_en" && card.tricky && (
              <button
                onClick={(e) => { e.stopPropagation(); speakFrench(card.french); }}
                className="mt-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors hover:bg-[var(--surface2)]"
                style={{ color: "var(--accent-fr)" }}
              >
                <Volume2 className="h-3.5 w-3.5" />
                {card.audioHint ?? "Hear pronunciation"}
              </button>
            )}
            <p className="mt-6 text-xs" style={{ color: "var(--text-subtle)" }}>
              Tap or press Space to flip
            </p>
          </div>

          {/* Back */}
          <div
            className="card-back flex flex-col items-center justify-center rounded-2xl p-6 select-none"
            style={{
              backgroundColor: "var(--surface2)",
              border: "2px solid var(--accent-fr)",
              height: "280px",
            }}
          >
            <p className="text-xs uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>
              {direction === "fr_en" ? "English" : "French"}
            </p>
            <p
              className={cn("text-center font-semibold leading-snug", direction === "en_fr" ? "fr-text text-3xl" : "text-2xl")}
              style={{ color: "var(--text)" }}
            >
              {backText}
            </p>
            {direction === "en_fr" && (
              <button
                onClick={(e) => { e.stopPropagation(); speakFrench(card.french); }}
                className="mt-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors hover:bg-[var(--surface)]"
                style={{ color: "var(--accent-fr)" }}
              >
                <Volume2 className="h-3.5 w-3.5" />
                Hear it
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Response buttons — only shown after flip */}
      {flipped ? (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleResponse("again")}
            className="py-3 rounded-xl text-sm font-semibold border-2 transition-colors hover:bg-red-50 dark:hover:bg-red-950/20"
            style={{ borderColor: "#ef4444", color: "#ef4444" }}
          >
            ✗ Again
          </button>
          <button
            onClick={() => handleResponse("got_it")}
            className="py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#10b981" }}
          >
            ✓ Got It
          </button>
        </div>
      ) : (
        <button
          onClick={handleFlip}
          className="w-full py-3 rounded-xl text-sm font-semibold transition-colors"
          style={{ backgroundColor: "var(--surface2)", color: "var(--text)" }}
        >
          Reveal Answer
        </button>
      )}

      {/* Session stats */}
      <div className="flex items-center justify-between text-xs" style={{ color: "var(--text-muted)" }}>
        <span className="text-emerald-500 font-medium">✓ {sessionStats.correct} correct</span>
        <button
          onClick={() => setSessionStarted(false)}
          className="flex items-center gap-1 hover:underline"
        >
          <RotateCcw className="h-3 w-3" /> Restart
        </button>
        <span className="text-red-500 font-medium">{sessionStats.again} again</span>
      </div>
    </div>
  );
}

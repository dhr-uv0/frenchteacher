"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { getVocabByUnit, getGrammarByUnit, READING_PASSAGES, WRITING_PROMPTS } from "@/data/curriculum";
import type { VocabItem, GrammarRule } from "@/data/curriculum";
import VocabSection from "./VocabSection";
import GrammarSection from "./GrammarSection";
import ExerciseSection from "./ExerciseSection";
import { BookOpen, Hash, PenLine, BookMarked, ChevronRight, CheckCircle2 } from "lucide-react";

const UNIT_COLORS: Record<number, { bg: string; text: string; light: string }> = {
  1: { bg: "bg-blue-500", text: "text-blue-600 dark:text-blue-400", light: "bg-blue-50 dark:bg-blue-950/30" },
  2: { bg: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400", light: "bg-emerald-50 dark:bg-emerald-950/30" },
  3: { bg: "bg-violet-500", text: "text-violet-600 dark:text-violet-400", light: "bg-violet-50 dark:bg-violet-950/30" },
  4: { bg: "bg-orange-500", text: "text-orange-600 dark:text-orange-400", light: "bg-orange-50 dark:bg-orange-950/30" },
  5: { bg: "bg-rose-500", text: "text-rose-600 dark:text-rose-400", light: "bg-rose-50 dark:bg-rose-950/30" },
  6: { bg: "bg-amber-500", text: "text-amber-600 dark:text-amber-400", light: "bg-amber-50 dark:bg-amber-950/30" },
};

type Section = "vocab" | "grammar" | "exercises" | "reading" | "writing";

interface Props {
  unit: number;
  title: string;
  subtitle: string;
}

export default function UnitLesson({ unit, title, subtitle }: Props) {
  const [activeSection, setActiveSection] = useState<Section>("vocab");
  const [masteredSections, setMasteredSections] = useState<Set<Section>>(new Set());

  const vocab = getVocabByUnit(unit);
  const grammar = getGrammarByUnit(unit);
  const reading = READING_PASSAGES.filter((p) => p.unit === unit);
  const writing = WRITING_PROMPTS.filter((p) => p.unit === unit);

  const colors = UNIT_COLORS[unit] ?? UNIT_COLORS[1];

  const sections: { id: Section; label: string; icon: React.ReactNode; count: string }[] = [
    { id: "vocab", label: "Vocabulary", icon: <Hash className="h-4 w-4" />, count: `${vocab.length} words` },
    { id: "grammar", label: "Grammar", icon: <BookOpen className="h-4 w-4" />, count: `${grammar.length} rules` },
    { id: "exercises", label: "Exercises", icon: <CheckCircle2 className="h-4 w-4" />, count: "5 types" },
    { id: "reading", label: "Reading", icon: <BookMarked className="h-4 w-4" />, count: `${reading.length} passages` },
    { id: "writing", label: "Writing", icon: <PenLine className="h-4 w-4" />, count: `${writing.length} prompts` },
  ];

  function markMastered(section: Section) {
    setMasteredSections((prev) => new Set([...prev, section]));
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div className={cn("rounded-xl p-5", colors.light)}>
        <div className="flex items-center gap-3">
          <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl text-white text-xl font-bold", colors.bg)}>
            {unit}
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>
              Unité {unit} — <span className="fr-text">{title}</span>
            </h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>{subtitle}</p>
          </div>
        </div>

        {/* Mastery progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>
            <span>Section progress</span>
            <span>{masteredSections.size}/{sections.length} mastered</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--surface)" }}>
            <div
              className={cn("h-full rounded-full transition-all duration-700", colors.bg)}
              style={{ width: `${(masteredSections.size / sections.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex overflow-x-auto gap-2 pb-1 no-scrollbar">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0",
              activeSection === s.id
                ? cn(colors.bg, "text-white")
                : "hover:bg-[var(--surface2)]"
            )}
            style={{ color: activeSection === s.id ? "white" : "var(--text-muted)" }}
          >
            {s.icon}
            {s.label}
            {masteredSections.has(s.id) && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
          </button>
        ))}
      </div>

      {/* Section content */}
      <div>
        {activeSection === "vocab" && (
          <VocabSection vocab={vocab} unit={unit} onMastered={() => markMastered("vocab")} />
        )}
        {activeSection === "grammar" && (
          <GrammarSection rules={grammar} unit={unit} onMastered={() => markMastered("grammar")} />
        )}
        {activeSection === "exercises" && (
          <ExerciseSection
            vocab={vocab}
            grammar={grammar}
            unit={unit}
            onMastered={() => markMastered("exercises")}
          />
        )}
        {activeSection === "reading" && (
          <ReadingSection passages={reading} unit={unit} onMastered={() => markMastered("reading")} />
        )}
        {activeSection === "writing" && (
          <WritingSection prompts={writing} unit={unit} onMastered={() => markMastered("writing")} />
        )}
      </div>
    </div>
  );
}

// ── Reading section ────────────────────────────────────────────────────────────

function ReadingSection({
  passages,
  unit,
  onMastered,
}: {
  passages: ReturnType<typeof READING_PASSAGES.filter>;
  unit: number;
  onMastered: () => void;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [graded, setGraded] = useState(false);

  if (passages.length === 0) {
    return (
      <div className="text-center py-8" style={{ color: "var(--text-muted)" }}>
        Reading passages coming soon for Unit {unit}.
      </div>
    );
  }

  async function grade() {
    setLoading(true);
    try {
      const payload = passages
        .map((p) =>
          p.questions
            .map((q, i) => `Q: ${q.question}\nStudent answer: ${answers[`${p.id}_${i}`] ?? "(no answer)"}`)
            .join("\n")
        )
        .join("\n\n");

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "grade_reading",
          content: payload,
          context: { unit },
        }),
      });
      const data = await res.json();

      setFeedback({ all: data.response });
      setGraded(true);
      onMastered();
    } catch {
      setFeedback({ all: "Unable to grade — check your AI API key." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {passages.map((p) => (
        <div
          key={p.id}
          className="rounded-xl p-5 space-y-4"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <h3 className="font-bold fr-text text-lg" style={{ color: "var(--text)" }}>{p.title}</h3>
          <div
            className="prose-fr p-4 rounded-lg fr-text text-base leading-relaxed"
            style={{ backgroundColor: "var(--surface2)", color: "var(--text)" }}
          >
            {p.text}
          </div>
          <div className="space-y-3">
            {p.questions.map((q, i) => (
              <div key={i}>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text)" }}>
                  {i + 1}. <span className="fr-text">{q.question}</span>
                </label>
                <input
                  type="text"
                  value={answers[`${p.id}_${i}`] ?? ""}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [`${p.id}_${i}`]: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-sm border outline-none transition-colors focus:ring-2 focus:ring-[var(--accent-fr)]"
                  style={{
                    backgroundColor: "var(--surface2)",
                    borderColor: "var(--border)",
                    color: "var(--text)",
                  }}
                  placeholder="Répondez en français…"
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {feedback.all ? (
        <div
          className="rounded-xl p-5 whitespace-pre-wrap text-sm font-mono"
          style={{ backgroundColor: "var(--surface2)", color: "var(--text)", border: "1px solid var(--border)" }}
        >
          {feedback.all}
        </div>
      ) : (
        <button
          onClick={grade}
          disabled={loading}
          className="w-full py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-60"
          style={{ backgroundColor: "var(--accent-fr)" }}
        >
          {loading ? "Grading with AI…" : "Grade My Answers with AI →"}
        </button>
      )}
    </div>
  );
}

// ── Writing section ────────────────────────────────────────────────────────────

function WritingSection({
  prompts,
  unit,
  onMastered,
}: {
  prompts: ReturnType<typeof WRITING_PROMPTS.filter>;
  unit: number;
  onMastered: () => void;
}) {
  const [selectedPrompt, setSelectedPrompt] = useState(0);
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [rewriteMode, setRewriteMode] = useState(false);
  const [rewrite, setRewrite] = useState("");
  const [rewriteFeedback, setRewriteFeedback] = useState("");

  const prompt = prompts[selectedPrompt];
  if (!prompt) return <div style={{ color: "var(--text-muted)" }}>No writing prompts for Unit {unit}.</div>;

  async function submitWriting(content: string, isRewrite = false) {
    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "grade_writing",
          content: `Prompt: ${prompt.prompt}\n\nStudent's writing:\n${content}`,
          context: { unit, targetStructures: prompt.focusStructures },
        }),
      });
      const data = await res.json();
      if (isRewrite) {
        setRewriteFeedback(data.response);
      } else {
        setFeedback(data.response);
        setRewriteMode(true);
        onMastered();
      }
    } catch {
      setFeedback("Unable to grade — check your AI API key.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Prompt selector */}
      {prompts.length > 1 && (
        <div className="flex gap-2">
          {prompts.map((p, i) => (
            <button
              key={p.id}
              onClick={() => { setSelectedPrompt(i); setFeedback(""); setRewriteMode(false); setText(""); }}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                selectedPrompt === i
                  ? "bg-[var(--accent-fr)] text-white border-[var(--accent-fr)]"
                  : "border-[var(--border)] hover:bg-[var(--surface2)]"
              )}
              style={{ color: selectedPrompt === i ? "white" : "var(--text-muted)" }}
            >
              Prompt {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Prompt card */}
      <div
        className="rounded-xl p-5"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <p className="font-medium text-sm mb-1" style={{ color: "var(--text)" }}>{prompt.prompt}</p>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Target length: {prompt.targetLength} · Focus: {prompt.focusStructures.join(", ")}
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {prompt.requiredVocab.map((v) => (
            <span key={v} className="text-xs px-2 py-0.5 rounded-full bg-[var(--surface2)] border border-[var(--border)]" style={{ color: "var(--text-muted)" }}>
              {v}
            </span>
          ))}
        </div>
      </div>

      {/* Writing area */}
      {!rewriteMode ? (
        <>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={7}
            className="w-full px-4 py-3 rounded-xl text-sm border outline-none resize-none transition-colors focus:ring-2 focus:ring-[var(--accent-fr)] fr-text"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
              color: "var(--text)",
              fontSize: "1rem",
            }}
            placeholder="Écris ta réponse en français ici…"
          />
          <div className="flex items-center justify-between text-xs" style={{ color: "var(--text-muted)" }}>
            <span>{text.trim().split(/\s+/).filter(Boolean).length} words</span>
          </div>
          {feedback && (
            <div
              className="rounded-xl p-5 whitespace-pre-wrap text-sm"
              style={{ backgroundColor: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)" }}
            >
              {feedback}
            </div>
          )}
          <button
            onClick={() => submitWriting(text)}
            disabled={loading || text.trim().length < 20}
            className="w-full py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-60"
            style={{ backgroundColor: "var(--accent-fr)" }}
          >
            {loading ? "Grading with AI…" : "Submit for AI Feedback →"}
          </button>
        </>
      ) : (
        <>
          {/* Original feedback */}
          <div
            className="rounded-xl p-5 whitespace-pre-wrap text-sm"
            style={{ backgroundColor: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)" }}
          >
            {feedback}
          </div>
          {/* Rewrite */}
          <div>
            <p className="text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>
              Now rewrite your paragraph applying the feedback above:
            </p>
            <textarea
              value={rewrite}
              onChange={(e) => setRewrite(e.target.value)}
              rows={7}
              className="w-full px-4 py-3 rounded-xl text-sm border outline-none resize-none focus:ring-2 focus:ring-[var(--accent-fr)] fr-text"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
                color: "var(--text)",
                fontSize: "1rem",
              }}
              placeholder="Réécris ta réponse ici avec les corrections…"
            />
          </div>
          {rewriteFeedback && (
            <div
              className="rounded-xl p-5 whitespace-pre-wrap text-sm"
              style={{ backgroundColor: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)" }}
            >
              {rewriteFeedback}
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={() => submitWriting(rewrite, true)}
              disabled={loading || rewrite.trim().length < 20}
              className="flex-1 py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-60"
              style={{ backgroundColor: "#10b981" }}
            >
              {loading ? "Checking rewrite…" : "Check My Rewrite →"}
            </button>
            <button
              onClick={() => { setFeedback(""); setRewriteMode(false); setRewrite(""); setRewriteFeedback(""); setText(""); }}
              className="px-4 py-3 rounded-xl text-sm border transition-colors hover:bg-[var(--surface2)]"
              style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
            >
              New Try
            </button>
          </div>
        </>
      )}
    </div>
  );
}

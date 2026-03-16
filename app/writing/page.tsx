"use client";

import { useState } from "react";
import { WRITING_PROMPTS } from "@/data/curriculum";
import { UNITS } from "@/data/curriculum";
import { cn } from "@/lib/utils";

export default function WritingPage() {
  const [selectedUnit, setSelectedUnit] = useState(3);
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [rewriteMode, setRewriteMode] = useState(false);
  const [rewrite, setRewrite] = useState("");
  const [rewriteFeedback, setRewriteFeedback] = useState("");
  const [rewriteLoading, setRewriteLoading] = useState(false);

  const unitPrompts = WRITING_PROMPTS.filter((p) => p.unit === selectedUnit);
  const [selectedPromptIdx, setSelectedPromptIdx] = useState(0);
  const prompt = unitPrompts[selectedPromptIdx];

  async function submit(content: string, isRewrite = false) {
    if (!prompt) return;
    if (isRewrite) setRewriteLoading(true);
    else setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "grade_writing",
          content: `Prompt: ${prompt.prompt}\n\nStudent's writing:\n${content}`,
          context: {
            unit: selectedUnit,
            targetStructures: prompt.focusStructures,
          },
        }),
      });
      const data = await res.json();

      if (isRewrite) {
        setRewriteFeedback(data.response);
      } else {
        setFeedback(data.response);
        setRewriteMode(true);

        // Save session
        await fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionType: "writing",
            unitNumber: selectedUnit,
            totalItems: 1,
            timeSpentSec: 0,
          }),
        }).catch(() => {});
      }
    } catch {
      const msg = "Could not get AI feedback — check ANTHROPIC_API_KEY.";
      if (isRewrite) setRewriteFeedback(msg);
      else setFeedback(msg);
    } finally {
      if (isRewrite) setRewriteLoading(false);
      else setLoading(false);
    }
  }

  function reset() {
    setText("");
    setFeedback("");
    setRewriteMode(false);
    setRewrite("");
    setRewriteFeedback("");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Writing Practice</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          AI-graded writing with line-by-line corrections — then rewrite to lock in the fix.
        </p>
      </div>

      {/* Unit selector */}
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5, 6].map((u) => {
          const unit = UNITS.find((un) => un.number === u)!;
          return (
            <button
              key={u}
              onClick={() => { setSelectedUnit(u); setSelectedPromptIdx(0); reset(); }}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                selectedUnit === u
                  ? "bg-[var(--accent-fr)] text-white"
                  : "bg-[var(--surface2)] hover:bg-[var(--border)]"
              )}
              style={{ color: selectedUnit === u ? "white" : "var(--text-muted)" }}
            >
              Unit {u} — {unit.title}
            </button>
          );
        })}
      </div>

      {/* Prompt selector */}
      {unitPrompts.length > 1 && (
        <div className="flex gap-2">
          {unitPrompts.map((p, i) => (
            <button
              key={p.id}
              onClick={() => { setSelectedPromptIdx(i); reset(); }}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                selectedPromptIdx === i
                  ? "bg-[var(--accent-fr)] text-white border-[var(--accent-fr)]"
                  : "border-[var(--border)] hover:bg-[var(--surface2)]"
              )}
              style={{ color: selectedPromptIdx === i ? "white" : "var(--text-muted)" }}
            >
              Prompt {i + 1}
            </button>
          ))}
        </div>
      )}

      {prompt ? (
        <>
          {/* Prompt display */}
          <div
            className="rounded-xl p-5"
            style={{ backgroundColor: "var(--surface)", border: "2px solid var(--accent-fr)" }}
          >
            <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--accent-fr)" }}>
              Writing Prompt
            </p>
            <p className="font-medium" style={{ color: "var(--text)" }}>{prompt.prompt}</p>
            <div className="mt-2 flex flex-wrap gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
              <span>📏 {prompt.targetLength}</span>
              <span>🎯 Focus: {prompt.focusStructures.slice(0, 2).join(", ")}</span>
            </div>
          </div>

          {/* Writing area */}
          {!rewriteMode ? (
            <>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 rounded-xl text-sm border outline-none resize-none fr-text focus:ring-2 focus:ring-[var(--accent-fr)]"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                  color: "var(--text)",
                  fontSize: "1rem",
                  lineHeight: "1.8",
                }}
                placeholder="Écris ta réponse en français ici… Prends ton temps !"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {text.trim().split(/\s+/).filter(Boolean).length} words
                </span>
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
                onClick={() => submit(text)}
                disabled={loading || text.trim().length < 15}
                className="w-full py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-60"
                style={{ backgroundColor: "var(--accent-fr)" }}
              >
                {loading ? "Grading with Claude AI…" : "Submit for AI Feedback →"}
              </button>
            </>
          ) : (
            <>
              {/* Feedback */}
              <div
                className="rounded-xl p-5 whitespace-pre-wrap text-sm"
                style={{ backgroundColor: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)" }}
              >
                {feedback}
              </div>

              {/* Rewrite */}
              <div>
                <p className="text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>
                  Now rewrite your paragraph applying the feedback above — this is how learning sticks:
                </p>
                <textarea
                  value={rewrite}
                  onChange={(e) => setRewrite(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 rounded-xl text-sm border outline-none resize-none fr-text focus:ring-2 focus:ring-[var(--accent-fr)]"
                  style={{
                    backgroundColor: "var(--surface)",
                    borderColor: "var(--border)",
                    color: "var(--text)",
                    fontSize: "1rem",
                    lineHeight: "1.8",
                  }}
                  placeholder="Réécris avec les corrections…"
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
                  onClick={() => submit(rewrite, true)}
                  disabled={rewriteLoading || rewrite.trim().length < 15}
                  className="flex-1 py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-60"
                  style={{ backgroundColor: "#10b981" }}
                >
                  {rewriteLoading ? "Checking rewrite…" : "Check My Rewrite →"}
                </button>
                <button
                  onClick={reset}
                  className="px-4 py-3 rounded-xl text-sm border transition-colors hover:bg-[var(--surface2)]"
                  style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
                >
                  New Prompt
                </button>
              </div>
            </>
          )}
        </>
      ) : (
        <p style={{ color: "var(--text-muted)" }}>No writing prompts for Unit {selectedUnit} yet.</p>
      )}
    </div>
  );
}

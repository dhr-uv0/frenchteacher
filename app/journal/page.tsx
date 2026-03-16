"use client";

import { useState, useEffect } from "react";
import { cn, formatDate } from "@/lib/utils";
import { getJournalEntries, addJournalEntry, updateJournalFeedback } from "@/lib/store";
import type { JournalEntry } from "@/lib/store";
import { BookMarked, Sparkles, ChevronDown, ChevronUp, Plus } from "lucide-react";

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntry, setNewEntry] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [mode, setMode] = useState<"write" | "history">("write");

  useEffect(() => {
    setEntries(getJournalEntries());
  }, []);

  function saveEntry() {
    if (!newEntry.trim()) return;
    setSaving(true);
    try {
      const saved = addJournalEntry(newEntry);
      setEntries((prev) => [saved, ...prev]);
      setNewEntry("");
      setMode("history");
    } catch {}
    setSaving(false);
  }

  async function getFeedback(entry: JournalEntry) {
    setLoadingFeedback(entry.id);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "journal_feedback",
          content: entry.content,
        }),
      });
      const data = await res.json();
      // Save feedback to store
      updateJournalFeedback(entry.id, data.response);
      setEntries((prev) =>
        prev.map((e) => (e.id === entry.id ? { ...e, aiFeedback: data.response } : e))
      );
    } catch {}
    setLoadingFeedback(null);
  }

  const totalWords = entries.reduce((sum, e) => sum + e.wordCount, 0);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: "var(--text)" }}>
            <BookMarked className="h-6 w-6 text-violet-500" />
            Mon Journal
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Free-write in French — no prompts, no pressure. {entries.length > 0 && `${entries.length} entries · ${totalWords} total words`}
          </p>
        </div>
      </div>

      {/* Mode toggle */}
      <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
        {(["write", "history"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn("flex-1 py-2.5 text-sm font-medium capitalize transition-colors", m === mode ? "bg-[var(--accent-fr)] text-white" : "bg-[var(--surface)] hover:bg-[var(--surface2)]")}
            style={{ color: m === mode ? "white" : "var(--text-muted)" }}
          >
            {m === "write" ? "✍️ New Entry" : `📖 My Entries (${entries.length})`}
          </button>
        ))}
      </div>

      {mode === "write" ? (
        <div className="space-y-4">
          <div
            className="p-4 rounded-xl text-sm"
            style={{ backgroundColor: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
          >
            This is your space to write freely in French. Write about your day, your opinions, a story, anything.
            AI feedback is <em>optional</em> — you can just write and save.
          </div>
          <textarea
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            rows={10}
            autoFocus
            className="w-full px-4 py-3 rounded-xl text-sm border outline-none resize-none fr-text focus:ring-2 focus:ring-[var(--accent-fr)]"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
              color: "var(--text)",
              fontSize: "1rem",
              lineHeight: "1.9",
            }}
            placeholder="Aujourd'hui, je pense que… / Il fait beau et… / J'aime…"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              {newEntry.trim().split(/\s+/).filter(Boolean).length} words
            </span>
            <button
              onClick={saveEntry}
              disabled={saving || newEntry.trim().length < 5}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-60"
              style={{ backgroundColor: "var(--accent-fr)" }}
            >
              <Plus className="h-4 w-4" />
              {saving ? "Saving…" : "Save Entry"}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.length === 0 ? (
            <div className="text-center py-12" style={{ color: "var(--text-muted)" }}>
              <BookMarked className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No journal entries yet.</p>
              <p className="text-sm mt-1">Start your first entry to track your French progress over time.</p>
              <button onClick={() => setMode("write")} className="mt-4 px-5 py-2.5 rounded-xl text-white text-sm" style={{ backgroundColor: "var(--accent-fr)" }}>
                Write First Entry
              </button>
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="rounded-xl overflow-hidden"
                style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <button
                  onClick={() => setExpanded((e) => (e === entry.id ? null : entry.id))}
                  className="w-full flex items-start justify-between p-4 text-left hover:bg-[var(--surface2)] transition-colors"
                >
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
                      {formatDate(entry.createdAt)} · {entry.wordCount} words
                      {entry.aiFeedback && " · Feedback received"}
                    </p>
                    <p className="text-sm fr-text leading-snug line-clamp-2" style={{ color: "var(--text)" }}>
                      {entry.content}
                    </p>
                  </div>
                  {expanded === entry.id ? (
                    <ChevronUp className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: "var(--text-muted)" }} />
                  ) : (
                    <ChevronDown className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: "var(--text-muted)" }} />
                  )}
                </button>

                {expanded === entry.id && (
                  <div className="px-4 pb-4 space-y-3 border-t" style={{ borderColor: "var(--border)" }}>
                    <div
                      className="mt-3 p-4 rounded-lg fr-text text-base leading-relaxed whitespace-pre-wrap"
                      style={{ backgroundColor: "var(--surface2)", color: "var(--text)" }}
                    >
                      {entry.content}
                    </div>

                    {entry.aiFeedback ? (
                      <div
                        className="p-4 rounded-lg whitespace-pre-wrap text-sm"
                        style={{ backgroundColor: "var(--surface2)", border: "1px solid #10b981", color: "var(--text)" }}
                      >
                        <p className="text-xs font-semibold text-emerald-600 mb-2">AI Feedback</p>
                        {entry.aiFeedback}
                      </div>
                    ) : (
                      <button
                        onClick={() => getFeedback(entry)}
                        disabled={loadingFeedback === entry.id}
                        className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg border transition-colors hover:bg-[var(--surface2)] disabled:opacity-60"
                        style={{ borderColor: "var(--border)", color: "var(--accent-fr)" }}
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        {loadingFeedback === entry.id ? "Getting feedback…" : "Get optional AI feedback"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

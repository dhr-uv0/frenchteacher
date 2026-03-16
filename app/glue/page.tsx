"use client";

import { useState } from "react";
import { GLUE_WORDS } from "@/data/curriculum";
import { cn } from "@/lib/utils";
import { Volume2, RefreshCw, CheckCircle2 } from "lucide-react";

type GlueCategory = "all" | "connector" | "time" | "manner" | "question";

const CATEGORIES: { id: GlueCategory; label: string; emoji: string }[] = [
  { id: "all", label: "All Glue Words", emoji: "🔗" },
  { id: "connector", label: "Connectors", emoji: "⚡" },
  { id: "time", label: "Time Words", emoji: "⏰" },
  { id: "manner", label: "Manner Words", emoji: "✨" },
  { id: "question", label: "Question Words", emoji: "❓" },
];

const GLUE_QUIZ: { sentence: string; blank: string; answer: string; category: GlueCategory }[] = [
  { sentence: "J'aime le français ___ les maths.", blank: "et", answer: "et", category: "connector" },
  { sentence: "J'adore la musique ___ je déteste le sport.", blank: "mais", answer: "mais", category: "connector" },
  { sentence: "Il est fatigué ___ il travaille beaucoup.", blank: "parce que", answer: "parce que", category: "connector" },
  { sentence: "Je mange ___ je vais à l'école.", blank: "avant", answer: "avant", category: "time" },
  { sentence: "___ est-ce que tu habites ?", blank: "Où", answer: "Où", category: "question" },
  { sentence: "___ cours préfères-tu ?", blank: "Quel", answer: "Quel", category: "question" },
  { sentence: "Elle chante ___ bien !", blank: "vraiment", answer: "vraiment", category: "manner" },
  { sentence: "Je parle français ___ espagnol.", blank: "et", answer: "et", category: "connector" },
  { sentence: "___ vas-tu à l'école ?", blank: "Comment", answer: "Comment", category: "question" },
  { sentence: "Il mange ___ il regarde la télé.", blank: "puis", answer: "puis", category: "time" },
];

function categorizeGlue(key: string): GlueCategory {
  const connectors = ["et", "mais", "donc", "alors", "parce_que", "ou", "car", "si"];
  const timeWords = ["quand", "apres", "avant", "puis", "ensuite", "depuis", "maintenant", "deja"];
  const mannerWords = ["avec", "sans", "aussi", "encore", "vraiment", "trop", "tres", "assez", "un_peu", "beaucoup"];
  const k = key.replace("gw_", "");
  if (connectors.some((c) => k.includes(c))) return "connector";
  if (timeWords.some((c) => k.includes(c))) return "time";
  if (mannerWords.some((c) => k.includes(c))) return "manner";
  return "question";
}

export default function GluePage() {
  const [category, setCategory] = useState<GlueCategory>("all");
  const [mode, setMode] = useState<"study" | "quiz">("study");
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizChecked, setQuizChecked] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  function speakFrench(text: string) {
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    utterance.rate = 0.85;
    speechSynthesis.speak(utterance);
  }

  const filtered = GLUE_WORDS.filter((w) => {
    if (category === "all") return true;
    return categorizeGlue(w.key) === category;
  });

  function checkQuiz() {
    let score = 0;
    const filtered = category === "all" ? GLUE_QUIZ : GLUE_QUIZ.filter((q) => q.category === category);
    filtered.forEach((q, i) => {
      if ((quizAnswers[i] ?? "").trim().toLowerCase() === q.answer.toLowerCase()) score++;
    });
    setQuizScore(score);
    setQuizChecked(true);
  }

  const quizItems = category === "all" ? GLUE_QUIZ : GLUE_QUIZ.filter((q) => q.category === category);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Glue Words</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Connectors, time words, manner words, and question words — the words that hold your French together.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
              category === c.id
                ? "bg-[var(--accent-fr)] text-white"
                : "bg-[var(--surface2)] hover:bg-[var(--border)]"
            )}
            style={{ color: category === c.id ? "white" : "var(--text-muted)" }}
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      {/* Mode toggle */}
      <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
        {(["study", "quiz"] as const).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setQuizChecked(false); setQuizAnswers({}); }}
            className={cn(
              "flex-1 py-2.5 text-sm font-medium transition-colors capitalize",
              mode === m ? "bg-[var(--accent-fr)] text-white" : "bg-[var(--surface)] hover:bg-[var(--surface2)]"
            )}
            style={{ color: mode === m ? "white" : "var(--text-muted)" }}
          >
            {m === "study" ? "📖 Study" : "✏️ Practice Quiz"}
          </button>
        ))}
      </div>

      {mode === "study" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {filtered.map((word) => (
            <div
              key={word.key}
              className="flex items-center justify-between p-3 rounded-xl transition-colors hover:bg-[var(--surface2)]"
              style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="fr-text font-bold text-lg" style={{ color: "var(--text)" }}>
                    {word.french}
                  </span>
                  {word.tricky && (
                    <button
                      onClick={() => speakFrench(word.french)}
                      className="flex items-center justify-center h-6 w-6 rounded-md hover:bg-[var(--surface2)]"
                      style={{ color: "var(--accent-fr)" }}
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>{word.english}</p>
                {word.audioHint && (
                  <p className="text-xs italic" style={{ color: "var(--text-subtle)" }}>[{word.audioHint}]</p>
                )}
              </div>
              <span
                className="text-xs px-2 py-0.5 rounded-full ml-2 flex-shrink-0"
                style={{
                  backgroundColor: "var(--surface2)",
                  color: "var(--text-muted)",
                  border: "1px solid var(--border)",
                }}
              >
                {word.partOfSpeech}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Fill in the correct glue word for each sentence:
          </p>
          {quizItems.map((q, i) => {
            const ans = quizAnswers[i] ?? "";
            const isCorrect = quizChecked && ans.trim().toLowerCase() === q.answer.toLowerCase();
            const isWrong = quizChecked && !isCorrect;
            return (
              <div
                key={i}
                className="p-4 rounded-xl space-y-2"
                style={{
                  backgroundColor: "var(--surface)",
                  border: `1px solid ${isCorrect ? "#10b981" : isWrong ? "#ef4444" : "var(--border)"}`,
                }}
              >
                <p className="fr-text text-base" style={{ color: "var(--text)" }}>
                  {q.sentence.replace(q.blank, `[${quizChecked ? (isCorrect ? "✓ " : "") + q.answer : "___"}]`)}
                </p>
                {!quizChecked && (
                  <input
                    type="text"
                    value={ans}
                    onChange={(e) => setQuizAnswers((prev) => ({ ...prev, [i]: e.target.value }))}
                    className="px-3 py-1.5 rounded-lg text-sm border outline-none fr-text focus:ring-2 focus:ring-[var(--accent-fr)]"
                    style={{ backgroundColor: "var(--surface2)", borderColor: "var(--border)", color: "var(--text)" }}
                    placeholder="Glue word…"
                  />
                )}
                {quizChecked && !isCorrect && (
                  <p className="text-xs text-red-500">You wrote: "{ans || "(blank)"}" → Correct: "{q.answer}"</p>
                )}
              </div>
            );
          })}

          {quizChecked ? (
            <div
              className="p-4 rounded-xl text-center"
              style={{ backgroundColor: "var(--surface2)", border: "1px solid var(--border)" }}
            >
              <p className="text-xl font-bold" style={{ color: "var(--text)" }}>
                {quizScore}/{quizItems.length}
              </p>
              <button
                onClick={() => { setQuizChecked(false); setQuizAnswers({}); }}
                className="mt-2 flex items-center gap-1.5 mx-auto text-sm hover:underline"
                style={{ color: "var(--accent-fr)" }}
              >
                <RefreshCw className="h-3.5 w-3.5" /> Try Again
              </button>
            </div>
          ) : (
            <button
              onClick={checkQuiz}
              className="w-full py-3 rounded-xl text-white text-sm font-semibold"
              style={{ backgroundColor: "var(--accent-fr)" }}
            >
              Check Answers →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

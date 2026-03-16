"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { cn, formatTime } from "@/lib/utils";
import { ALL_VOCAB, GRAMMAR_RULES } from "@/data/curriculum";
import { addMistake, addSession } from "@/lib/store";
import { CheckCircle2, XCircle, Timer, RefreshCw, ChevronRight } from "lucide-react";

type QuizMode = "practice" | "test" | "mistakes";
type QuestionType = "multiple_choice" | "fill_blank" | "matching" | "short_answer";

interface Question {
  id: string;
  type: QuestionType;
  question: string;
  correctAnswer: string;
  options?: string[];
  explanation: string;
  unit: number;
  category: string;
}

interface SessionResult {
  score: number;
  total: number;
  timeSec: number;
  mistakes: { question: string; wrong: string; right: string }[];
  reviewNext: string;
}

function generateQuestions(unit: number, count: number, mode: QuizMode): Question[] {
  const vocab = ALL_VOCAB.filter((v) => v.unit <= unit && v.unit > 0);
  const questions: Question[] = [];

  // Multiple choice: French → English
  const mcVocab = [...vocab].sort(() => Math.random() - 0.5).slice(0, Math.ceil(count * 0.4));
  mcVocab.forEach((v, i) => {
    const wrong = vocab
      .filter((w) => w.key !== v.key)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((w) => w.english);
    const options = [v.english, ...wrong].sort(() => Math.random() - 0.5);
    questions.push({
      id: `mc_${i}`,
      type: "multiple_choice",
      question: v.french,
      correctAnswer: v.english,
      options,
      explanation: `${v.french} = ${v.english} (${v.partOfSpeech})`,
      unit: v.unit,
      category: "vocabulary",
    });
  });

  // Fill in the blank: English → French
  const fillVocab = [...vocab].sort(() => Math.random() - 0.5).slice(0, Math.ceil(count * 0.3));
  fillVocab.forEach((v, i) => {
    questions.push({
      id: `fill_${i}`,
      type: "fill_blank",
      question: `How do you say "${v.english}" in French?`,
      correctAnswer: v.french.split(" / ")[0].split(" (")[0], // just the base form
      explanation: `${v.english} = ${v.french}`,
      unit: v.unit,
      category: "vocabulary",
    });
  });

  // Short answer: grammar
  const grammarQs: Question[] = [
    {
      id: "gram_1",
      type: "short_answer" as QuestionType,
      question: "What are the six subject pronouns in French? (give them in order)",
      correctAnswer: "je, tu, il/elle/on, nous, vous, ils/elles",
      explanation: "Subject pronouns: je (I), tu (you-informal), il/elle/on (he/she/one), nous (we), vous (you-formal/pl), ils/elles (they)",
      unit: 1,
      category: "grammar",
    },
    {
      id: "gram_2",
      type: "short_answer" as QuestionType,
      question: "Write 'She doesn't like math' in French.",
      correctAnswer: "Elle n'aime pas les maths.",
      explanation: "Negation: ne…pas wraps around the verb: Elle n'aime pas les maths.",
      unit: 2,
      category: "grammar",
    },
    {
      id: "gram_3",
      type: "short_answer" as QuestionType,
      question: "What is 'à + le' contracted to in French?",
      correctAnswer: "au",
      explanation: "à + le → au. Example: Je vais au cinéma.",
      unit: 5,
      category: "grammar",
    },
  ].filter((q) => q.unit <= unit);

  questions.push(...grammarQs.slice(0, Math.ceil(count * 0.3)));

  return questions.sort(() => Math.random() - 0.5).slice(0, count);
}

function QuizContent() {
  const searchParams = useSearchParams();
  const initialMode = (searchParams.get("mode") ?? "practice") as QuizMode;

  const [mode, setMode] = useState<QuizMode>(initialMode);
  const [selectedUnit, setSelectedUnit] = useState(3);
  const [quizActive, setQuizActive] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [startTime, setStartTime] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [result, setResult] = useState<SessionResult | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerActive]);

  function startQuiz() {
    const qs = generateQuestions(selectedUnit, mode === "test" ? 20 : 10, mode);
    setQuestions(qs);
    setCurrent(0);
    setAnswers({});
    setChecked({});
    setResult(null);
    setElapsed(0);
    setStartTime(Date.now());
    setTimerActive(true);
    setQuizActive(true);
  }

  function checkCurrent() {
    const q = questions[current];
    const answer = answers[current] ?? "";
    setChecked((prev) => ({ ...prev, [current]: true }));
    const isCorrect = normalizeAnswer(answer) === normalizeAnswer(q.correctAnswer);
    if (!isCorrect) {
      try {
        addMistake({
          unitNumber: q.unit,
          category: q.category,
          question: q.question,
          wrongAnswer: answer || "(blank)",
          rightAnswer: q.correctAnswer,
          explanation: q.explanation,
        });
      } catch {}
    }
  }

  function normalizeAnswer(a: string) {
    return a.trim().toLowerCase().replace(/[.,!?]/g, "").replace(/'/g, "'");
  }

  function next() {
    if (current + 1 >= questions.length) {
      finishQuiz();
    } else {
      setCurrent((c) => c + 1);
    }
  }

  function finishQuiz() {
    setTimerActive(false);
    if (timerRef.current) clearInterval(timerRef.current);

    let correct = 0;
    const mistakes: SessionResult["mistakes"] = [];

    questions.forEach((q, i) => {
      const ans = answers[i] ?? "";
      const isCorrect = normalizeAnswer(ans) === normalizeAnswer(q.correctAnswer);
      if (isCorrect) correct++;
      else mistakes.push({ question: q.question, wrong: ans || "(blank)", right: q.correctAnswer });
    });

    const score = (correct / questions.length) * 100;
    const reviewNext =
      mistakes.length > 0
        ? `Review: ${mistakes[0].right} (${mistakes[0].question})`
        : "Great job — practice the next unit!";

    const sessionResult: SessionResult = {
      score,
      total: questions.length,
      timeSec: elapsed,
      mistakes,
      reviewNext,
    };

    setResult(sessionResult);
    setQuizActive(false);

    // Save session via store
    try {
      addSession({
        sessionType: mode === "test" ? "test" : "quiz",
        unitNumber: selectedUnit,
        score,
        totalItems: questions.length,
        correctItems: correct,
        timeSpentSec: elapsed,
        summary: `Unit ${selectedUnit} ${mode}: ${correct}/${questions.length} correct`,
        reviewNext,
      });
    } catch {}
  }

  const q = questions[current];
  const isChecked = checked[current];
  const currentAnswer = answers[current] ?? "";
  const isCorrect = isChecked && normalizeAnswer(currentAnswer) === normalizeAnswer(q?.correctAnswer ?? "");

  // ── Setup ─────────────────────────────────────────────────────────────────
  if (!quizActive && !result) {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Quizzes & Tests</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Practice quizzes and timed tests — mirrors real Skyline French 1 format
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {[
            { id: "practice", label: "Practice Quiz", desc: "10 questions · No timer · Check as you go", icon: "📝" },
            { id: "test", label: "Test Simulation", desc: "20 questions · Timed · Full recap at end", icon: "🎯" },
            { id: "mistakes", label: "Mistake Drill", desc: "Review your worst mistakes", icon: "🔁" },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id as QuizMode)}
              className={cn(
                "flex items-start gap-3 p-4 rounded-xl text-left border transition-all",
                mode === m.id ? "border-[var(--accent-fr)] bg-blue-50 dark:bg-blue-950/20" : "border-[var(--border)] hover:bg-[var(--surface2)]"
              )}
            >
              <span className="text-2xl">{m.icon}</span>
              <div>
                <p className="font-medium text-sm" style={{ color: "var(--text)" }}>{m.label}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{m.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: "var(--text-muted)" }}>
            Unit
          </label>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6].map((u) => (
              <button
                key={u}
                onClick={() => setSelectedUnit(u)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors",
                  selectedUnit === u ? "bg-[var(--accent-fr)] text-white border-[var(--accent-fr)]" : "border-[var(--border)] hover:bg-[var(--surface2)]"
                )}
                style={{ color: selectedUnit === u ? "white" : "var(--text-muted)" }}
              >
                Unit {u}
              </button>
            ))}
          </div>
        </div>

        <button onClick={startQuiz} className="w-full py-3 rounded-xl text-white text-sm font-semibold" style={{ backgroundColor: "var(--accent-fr)" }}>
          Start {mode === "test" ? "Test" : "Quiz"} →
        </button>
      </div>
    );
  }

  // ── Result screen ──────────────────────────────────────────────────────────
  if (result) {
    const pct = Math.round(result.score);
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <div
          className="rounded-2xl p-6 text-center space-y-4"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="text-5xl">{pct >= 90 ? "🏆" : pct >= 70 ? "🎉" : pct >= 50 ? "💪" : "📚"}</div>
          <h2 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Session Complete!</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-3xl font-bold" style={{ color: pct >= 70 ? "#10b981" : "#ef4444" }}>{pct}%</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Score</p>
            </div>
            <div>
              <p className="text-3xl font-bold" style={{ color: "var(--text)" }}>{result.total - result.mistakes.length}/{result.total}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Correct</p>
            </div>
            <div>
              <p className="text-3xl font-bold" style={{ color: "var(--text)" }}>{formatTime(result.timeSec)}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Time</p>
            </div>
          </div>
          {result.reviewNext && (
            <div className="text-sm p-3 rounded-lg text-left" style={{ backgroundColor: "var(--surface2)", color: "var(--text)" }}>
              <span className="font-semibold">Review next: </span>{result.reviewNext}
            </div>
          )}
        </div>

        {result.mistakes.length > 0 && (
          <div>
            <h3 className="font-semibold text-sm mb-2" style={{ color: "var(--text)" }}>What you missed:</h3>
            <div className="space-y-2">
              {result.mistakes.map((m, i) => (
                <div key={i} className="p-3 rounded-lg text-sm" style={{ backgroundColor: "var(--surface2)", border: "1px solid var(--border)" }}>
                  <p className="fr-text font-medium" style={{ color: "var(--text)" }}>{m.question}</p>
                  <p style={{ color: "var(--text-muted)" }}>
                    You: <span className="text-red-500 line-through">{m.wrong}</span> → <span className="text-emerald-600 dark:text-emerald-400 font-medium fr-text">{m.right}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={() => { setResult(null); setQuizActive(false); }} className="flex-1 py-2.5 rounded-xl border text-sm font-medium hover:bg-[var(--surface2)]" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
            Change Settings
          </button>
          <button onClick={startQuiz} className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold" style={{ backgroundColor: "var(--accent-fr)" }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ── Active quiz ────────────────────────────────────────────────────────────
  if (!q) return null;
  const progress = ((current) / questions.length) * 100;

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
          {current + 1} / {questions.length}
        </span>
        <div className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-muted)" }}>
          <Timer className="h-4 w-4" />
          {formatTime(elapsed)}
        </div>
      </div>

      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--surface2)" }}>
        <div className="h-full bg-[var(--accent-fr)] rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>

      {/* Question */}
      <div className="rounded-xl p-5" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
        <p className="text-xs uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
          {q.type === "multiple_choice" ? "Choose the correct translation" :
            q.type === "fill_blank" ? "Type the French" :
            "Short answer"}
        </p>
        <p className="fr-text text-xl font-semibold" style={{ color: "var(--text)" }}>{q.question}</p>
      </div>

      {/* Answer input */}
      {q.type === "multiple_choice" && q.options ? (
        <div className="grid grid-cols-1 gap-2">
          {q.options.map((opt) => {
            const selected = currentAnswer === opt;
            const correct = isChecked && opt === q.correctAnswer;
            const wrong = isChecked && selected && opt !== q.correctAnswer;
            return (
              <button
                key={opt}
                onClick={() => !isChecked && setAnswers((prev) => ({ ...prev, [current]: opt }))}
                className={cn(
                  "text-left px-4 py-3 rounded-xl border text-sm transition-all",
                  correct ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300" :
                  wrong ? "border-red-500 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300" :
                  selected ? "border-[var(--accent-fr)] bg-blue-50 dark:bg-blue-950/20" :
                  "border-[var(--border)] hover:bg-[var(--surface2)]"
                )}
                style={{ color: (correct || wrong || selected) ? undefined : "var(--text)" }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      ) : (
        <input
          type="text"
          value={currentAnswer}
          onChange={(e) => !isChecked && setAnswers((prev) => ({ ...prev, [current]: e.target.value }))}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (!isChecked) checkCurrent();
              else next();
            }
          }}
          autoFocus
          className={cn(
            "w-full px-4 py-3 rounded-xl text-sm border outline-none fr-text focus:ring-2 focus:ring-[var(--accent-fr)]",
            isChecked && isCorrect ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30" :
            isChecked && !isCorrect ? "border-red-500 bg-red-50 dark:bg-red-950/30" : ""
          )}
          style={{
            backgroundColor: isChecked ? undefined : "var(--surface)",
            borderColor: isChecked ? undefined : "var(--border)",
            color: "var(--text)",
            fontSize: "1rem",
          }}
          placeholder="Écris ta réponse…"
          disabled={isChecked}
        />
      )}

      {/* Feedback */}
      {isChecked && (
        <div
          className={cn("p-3 rounded-xl text-sm", isCorrect ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-red-50 dark:bg-red-950/30")}
          style={{ color: isCorrect ? "#065f46" : "#991b1b" }}
        >
          {isCorrect ? "✓ Correct!" : <>✗ Correct answer: <strong className="fr-text">{q.correctAnswer}</strong></>}
          <p className="mt-1 text-xs opacity-80">{q.explanation}</p>
        </div>
      )}

      {/* Action button */}
      {!isChecked ? (
        <button
          onClick={checkCurrent}
          disabled={!currentAnswer.trim()}
          className="w-full py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-60"
          style={{ backgroundColor: "var(--accent-fr)" }}
        >
          Check →
        </button>
      ) : (
        <button
          onClick={next}
          className="w-full py-3 rounded-xl text-white text-sm font-semibold"
          style={{ backgroundColor: "#10b981" }}
        >
          {current + 1 >= questions.length ? "Finish & See Results →" : "Next →"}
        </button>
      )}
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="text-center py-10" style={{ color: "var(--text-muted)" }}>Loading quiz…</div>}>
      <QuizContent />
    </Suspense>
  );
}

"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import type { VocabItem, GrammarRule } from "@/data/curriculum";
import { addMistake } from "@/lib/store";
import { CheckCircle2, XCircle, RefreshCw } from "lucide-react";

type ExerciseType =
  | "fill_blank"
  | "translation"
  | "word_bank"
  | "reading_check"
  | "timed_write";

interface Props {
  vocab: VocabItem[];
  grammar: GrammarRule[];
  unit: number;
  onMastered: () => void;
}

export default function ExerciseSection({ vocab, grammar, unit, onMastered }: Props) {
  const [activeType, setActiveType] = useState<ExerciseType>("word_bank");

  const exerciseTypes: { id: ExerciseType; label: string; desc: string }[] = [
    { id: "word_bank", label: "⭐ Sentence Builder", desc: "Given a verb + adjectives — arrange words into a correct French sentence" },
    { id: "fill_blank", label: "Fill in the Blank", desc: "Complete the sentence with the correct French word" },
    { id: "translation", label: "English → French", desc: "Translate a full sentence and get instant feedback" },
    { id: "reading_check", label: "Reading Check", desc: "Short passage with comprehension questions" },
    { id: "timed_write", label: "Timed Write", desc: "3-minute free production sprint" },
  ];

  return (
    <div className="space-y-4">
      {/* Type selector */}
      <div className="grid grid-cols-1 gap-2">
        {exerciseTypes.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveType(t.id)}
            className={cn(
              "flex items-start gap-3 p-3 rounded-xl text-left border transition-all",
              activeType === t.id
                ? "border-[var(--accent-fr)] bg-blue-50 dark:bg-blue-950/20"
                : "border-[var(--border)] hover:bg-[var(--surface2)]"
            )}
          >
            <div
              className={cn(
                "h-3 w-3 rounded-full flex-shrink-0 mt-1",
                activeType === t.id ? "bg-[var(--accent-fr)]" : "bg-[var(--border)]"
              )}
            />
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{t.label}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{t.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Exercise */}
      <div className="mt-2">
        {activeType === "fill_blank" && <FillBlankExercise vocab={vocab} unit={unit} onComplete={onMastered} />}
        {activeType === "translation" && <TranslationExercise vocab={vocab} unit={unit} onComplete={onMastered} />}
        {activeType === "word_bank" && <WordBankExercise vocab={vocab} unit={unit} onComplete={onMastered} />}
        {activeType === "reading_check" && <ReadingCheckExercise unit={unit} onComplete={onMastered} />}
        {activeType === "timed_write" && <TimedWriteExercise unit={unit} onComplete={onMastered} />}
      </div>
    </div>
  );
}

// ── Fill in the Blank ──────────────────────────────────────────────────────────

const FILL_BLANK_TEMPLATES: Record<number, { sentence: string; blank: string; answer: string; hint: string }[]> = {
  1: [
    { sentence: "Je ___ américain.", blank: "suis", answer: "suis", hint: "Use être (to be) — je form" },
    { sentence: "___ tu t'appelles ?", blank: "Comment", answer: "Comment", hint: "How = ___?" },
    { sentence: "Elle est très ___.", blank: "intelligente", answer: "intelligente", hint: "Smart (feminine form)" },
    { sentence: "Bonjour ! Je m'___ Lucas.", blank: "appelle", answer: "appelle", hint: "My name is = je m'___" },
    { sentence: "Nous ___ de Paris.", blank: "sommes", answer: "sommes", hint: "Être — nous form" },
  ],
  2: [
    { sentence: "J'___ la musique.", blank: "aime", answer: "aime", hint: "I like = j'___" },
    { sentence: "Tu ___ la télé le soir ?", blank: "regardes", answer: "regardes", hint: "-ER verb regarder — tu form" },
    { sentence: "Elle ne ___ pas danser.", blank: "aime", answer: "aime", hint: "ne…pas negation" },
    { sentence: "Il est ___ heures.", blank: "trois", answer: "trois", hint: "It's 3 o'clock" },
    { sentence: "Ils ___ aux jeux vidéo.", blank: "jouent", answer: "jouent", hint: "jouer — ils form" },
  ],
  3: [
    { sentence: "J'___ un cours de maths.", blank: "ai", answer: "ai", hint: "avoir — j' form" },
    { sentence: "Les maths, c'est très ___.", blank: "difficile", answer: "difficile", hint: "It's very difficult" },
    { sentence: "Elle a ___ un stylo rouge.", blank: "toujours", answer: "toujours", hint: "Always comes after the verb" },
    { sentence: "Mon cours ___ est le français.", blank: "préféré", answer: "préféré", hint: "favorite (BAGS adj — after noun here)" },
    { sentence: "Je n'ai pas ___ calculatrice.", blank: "de", answer: "de", hint: "After negation: pas + de" },
  ],
  4: [
    { sentence: "___ père s'appelle Marc.", blank: "Mon", answer: "Mon", hint: "My (père = masculine)" },
    { sentence: "Ma sœur a quinze ___.", blank: "ans", answer: "ans", hint: "Years old with avoir" },
    { sentence: "C'est ___ beau garçon.", blank: "un", answer: "un", hint: "A/an + masculine" },
    { sentence: "Sa ___ est très sympa.", blank: "famille", answer: "famille", hint: "his/her + feminine noun" },
    { sentence: "___ parents viennent de Lyon.", blank: "Ses", answer: "Ses", hint: "Possessive adj — plural" },
  ],
  5: [
    { sentence: "Je vais ___ cinéma.", blank: "au", answer: "au", hint: "à + le → ___ (masculine)" },
    { sentence: "Elle va ___ bibliothèque.", blank: "à la", answer: "à la", hint: "à + la = ___ (feminine)" },
    { sentence: "Nous allons ___ faire un pique-nique.", blank: "aller", answer: "aller", hint: "Near future: aller + ___" },
    { sentence: "Le chat est ___ la table.", blank: "sous", answer: "sous", hint: "The cat is ___ the table" },
    { sentence: "Je ___ de Marseille.", blank: "viens", answer: "viens", hint: "venir — je form" },
  ],
  6: [
    { sentence: "Je voudrais ___ pain.", blank: "du", answer: "du", hint: "Partitive: some bread (masc.)" },
    { sentence: "Elle boit ___ café.", blank: "du", answer: "du", hint: "Some coffee (masc.)" },
    { sentence: "Il ne mange pas ___ viande.", blank: "de", answer: "de", hint: "After negation: partitive → de" },
    { sentence: "Je ___ commander une pizza.", blank: "veux", answer: "veux", hint: "vouloir — je form" },
    { sentence: "Vous ___ m'aider ?", blank: "pouvez", answer: "pouvez", hint: "pouvoir — vous form" },
  ],
};

function FillBlankExercise({
  vocab,
  unit,
  onComplete,
}: {
  vocab: VocabItem[];
  unit: number;
  onComplete: () => void;
}) {
  const questions = FILL_BLANK_TEMPLATES[unit] ?? FILL_BLANK_TEMPLATES[1];
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);

  function check() {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i]?.trim().toLowerCase() === q.answer.toLowerCase()) correct++;
    });
    setScore(correct);
    setChecked(true);
    if (correct >= Math.ceil(questions.length * 0.7)) onComplete();

    // Log mistakes via store
    questions.forEach((q, i) => {
      const ans = answers[i]?.trim() ?? "";
      if (ans.toLowerCase() !== q.answer.toLowerCase()) {
        try {
          addMistake({
            unitNumber: unit,
            category: "grammar",
            question: q.sentence.replace("___", "___"),
            wrongAnswer: ans || "(blank)",
            rightAnswer: q.answer,
            explanation: q.hint,
          });
        } catch {}
      }
    });
  }

  function reset() {
    setAnswers({});
    setChecked(false);
    setScore(0);
  }

  return (
    <div className="space-y-4">
      <div
        className="p-4 rounded-xl text-sm"
        style={{ backgroundColor: "var(--surface2)", border: "1px solid var(--border)" }}
      >
        <p style={{ color: "var(--text)" }}>
          Fill in each blank with the correct French word. Focus: this is <strong>recognition practice</strong> — you see the context, you produce the answer.
        </p>
      </div>

      <div className="space-y-3">
        {questions.map((q, i) => {
          const ans = answers[i] ?? "";
          const isCorrect = checked && ans.trim().toLowerCase() === q.answer.toLowerCase();
          const isWrong = checked && !isCorrect;

          return (
            <div
              key={i}
              className="p-4 rounded-xl"
              style={{
                backgroundColor: "var(--surface)",
                border: `1px solid ${isCorrect ? "#10b981" : isWrong ? "#ef4444" : "var(--border)"}`,
              }}
            >
              <p className="fr-text text-base mb-2" style={{ color: "var(--text)" }}>
                {q.sentence.replace(
                  "___",
                  `[${checked ? (isCorrect ? "✓" : q.answer) : "___"}]`
                )}
              </p>
              {!checked && (
                <input
                  type="text"
                  value={ans}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [i]: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && check()}
                  className="px-3 py-1.5 rounded-lg text-sm border outline-none fr-text focus:ring-2 focus:ring-[var(--accent-fr)]"
                  style={{ backgroundColor: "var(--surface2)", borderColor: "var(--border)", color: "var(--text)" }}
                  placeholder="Écris ta réponse…"
                />
              )}
              {checked && (
                <div className="flex items-center gap-2 text-xs mt-1">
                  {isCorrect ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">✓ Correct !</span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400">
                      You wrote: <strong>{ans || "(blank)"}</strong> → Correct: <strong className="fr-text">{q.answer}</strong>
                    </span>
                  )}
                  <span style={{ color: "var(--text-muted)" }}>({q.hint})</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {checked ? (
        <div className="space-y-3">
          <div
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: "var(--surface2)", border: "1px solid var(--border)" }}
          >
            <p className="text-2xl font-bold" style={{ color: "var(--text)" }}>
              {score}/{questions.length}
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              {score === questions.length
                ? "Perfect score! 🎉"
                : score >= Math.ceil(questions.length * 0.7)
                ? "Good job! Review your mistakes."
                : "Keep practicing — you've got this!"}
            </p>
          </div>
          <button
            onClick={reset}
            className="w-full py-2.5 rounded-xl text-sm font-medium border transition-colors hover:bg-[var(--surface2)] flex items-center justify-center gap-2"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
          >
            <RefreshCw className="h-4 w-4" /> Try Again
          </button>
        </div>
      ) : (
        <button
          onClick={check}
          className="w-full py-3 rounded-xl text-white text-sm font-semibold"
          style={{ backgroundColor: "var(--accent-fr)" }}
        >
          Check My Answers →
        </button>
      )}
    </div>
  );
}

// ── Translation Exercise ───────────────────────────────────────────────────────

const TRANSLATION_PROMPTS: Record<number, string[]> = {
  1: [
    "My name is Marie and I am French.",
    "He is tall and very athletic.",
    "We are from Canada — we are Canadian.",
    "She is shy but very intelligent.",
    "Good evening! My name is Thomas. I am 15 years old.",
  ],
  2: [
    "I love listening to music on Saturday.",
    "She doesn't like playing video games.",
    "Do you like dancing? I prefer singing.",
    "It is half past seven in the evening.",
    "They play soccer on Wednesdays.",
  ],
  3: [
    "I have math and French on Monday.",
    "History is interesting but very difficult.",
    "She always has a red pen in her backpack.",
    "I don't have a calculator — it's boring.",
    "My favorite class is science because it's super.",
  ],
  4: [
    "My father is tall with brown hair.",
    "Her sister is 13 years old.",
    "They have a new dog — it's beautiful!",
    "His grandparents are very old but kind.",
    "My family lives in a beautiful old house.",
  ],
  5: [
    "I go to school every day by bus.",
    "The cat is under the table in the kitchen.",
    "We are going to go to the movies tonight.",
    "She comes from Lyon and lives in Paris now.",
    "Her room is next to the bathroom.",
  ],
  6: [
    "I would like some bread and butter, please.",
    "Do you want some coffee or some tea?",
    "She can't eat meat — she's vegetarian.",
    "We want to order a salad and fish.",
    "The bill, please! Do you have ice cream?",
  ],
};

function TranslationExercise({
  vocab,
  unit,
  onComplete,
}: {
  vocab: VocabItem[];
  unit: number;
  onComplete: () => void;
}) {
  const prompts = TRANSLATION_PROMPTS[unit] ?? TRANSLATION_PROMPTS[1];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [translation, setTranslation] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const prompt = prompts[currentIdx];

  async function submit() {
    if (!translation.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "grade_translation",
          content: `Translate to French: "${prompt}"\n\nStudent's translation: "${translation}"`,
          context: { unit },
        }),
      });
      const data = await res.json();
      setFeedback(data.response ?? "Unable to grade.");
    } catch {
      setFeedback("Unable to grade — check your AI API key.");
    } finally {
      setLoading(false);
    }
  }

  function next() {
    if (currentIdx + 1 >= prompts.length) {
      setDone(true);
      onComplete();
    } else {
      setCurrentIdx((i) => i + 1);
      setTranslation("");
      setFeedback("");
    }
  }

  if (done) {
    return (
      <div className="text-center py-8 space-y-4">
        <p className="text-4xl">🏆</p>
        <p className="font-bold text-lg" style={{ color: "var(--text)" }}>All translations done!</p>
        <button
          onClick={() => { setCurrentIdx(0); setTranslation(""); setFeedback(""); setDone(false); }}
          className="px-6 py-2.5 rounded-xl text-sm font-medium border hover:bg-[var(--surface2)]"
          style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
        >
          Start Over
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs" style={{ color: "var(--text-muted)" }}>
        <span>{currentIdx + 1} / {prompts.length}</span>
        <span>English → French production</span>
      </div>

      <div
        className="p-5 rounded-xl"
        style={{ backgroundColor: "var(--surface)", border: "2px solid var(--accent-fr)" }}
      >
        <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
          Translate to French:
        </p>
        <p className="text-lg font-semibold" style={{ color: "var(--text)" }}>{prompt}</p>
      </div>

      <textarea
        value={translation}
        onChange={(e) => setTranslation(e.target.value)}
        rows={3}
        className="w-full px-4 py-3 rounded-xl text-sm border outline-none resize-none fr-text focus:ring-2 focus:ring-[var(--accent-fr)]"
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
          color: "var(--text)",
          fontSize: "1rem",
        }}
        placeholder="Écris ta traduction ici…"
        disabled={!!feedback}
      />

      {feedback && (
        <div
          className="rounded-xl p-4 whitespace-pre-wrap text-sm"
          style={{ backgroundColor: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)" }}
        >
          {feedback}
        </div>
      )}

      {!feedback ? (
        <button
          onClick={submit}
          disabled={loading || !translation.trim()}
          className="w-full py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-60"
          style={{ backgroundColor: "var(--accent-fr)" }}
        >
          {loading ? "Grading with AI…" : "Submit for AI Feedback →"}
        </button>
      ) : (
        <button
          onClick={next}
          className="w-full py-3 rounded-xl text-white text-sm font-semibold"
          style={{ backgroundColor: "#10b981" }}
        >
          {currentIdx + 1 >= prompts.length ? "Finish ✓" : "Next Sentence →"}
        </button>
      )}
    </div>
  );
}

// ── Word Bank Exercise ─────────────────────────────────────────────────────────

// Sentence Builder — each prompt gives a VERB and ADJECTIVE(S) to use.
// Slightly more complex than single-word: includes adjective agreement, adverbs, conjunctions.
const WORD_BANK_SENTENCES: Record<number, { words: string[]; answer: string; hint: string; verbFocus?: string }[]> = {
  1: [
    {
      words: ["suis", "je", "grand", "et", "sportif"],
      answer: "je suis grand et sportif",
      hint: "Verb: être — two adjectives joined by et (both masculine here)",
      verbFocus: "être + adjectives",
    },
    {
      words: ["est", "elle", "petite", "très", "intelligente", "mais"],
      answer: "elle est petite mais très intelligente",
      hint: "Verb: être — mais (but) connects two adjectives; très intensifies the second",
      verbFocus: "être + contrast with mais",
    },
    {
      words: ["ne", "nous", "sommes", "timides", "pas"],
      answer: "nous ne sommes pas timides",
      hint: "Verb: être — negation ne…pas wraps around the verb",
      verbFocus: "ne…pas + être",
    },
    {
      words: ["il", "est", "sympa", "amusant", "et", "très"],
      answer: "il est sympa et très amusant",
      hint: "Verb: être — sympa is invariable; très comes right before amusant",
      verbFocus: "être + personality adjectives",
    },
  ],
  2: [
    {
      words: ["j'aime", "la", "musique", "beaucoup", "mais", "j'aime", "aussi", "le", "sport"],
      answer: "j'aime beaucoup la musique mais j'aime aussi le sport",
      hint: "Verb: aimer — beaucoup after verb; aussi = also; definite articles la/le for general preferences",
      verbFocus: "aimer + beaucoup / aussi",
    },
    {
      words: ["elle", "n'aime", "pas", "regarder", "la", "télé", "ennuyeuse"],
      answer: "elle n'aime pas regarder la télé ennuyeuse",
      hint: "Verb: aimer — negation + infinitive; adjective ennuyeux(euse) agrees with télé (fem.)",
      verbFocus: "ne…pas aimer + infinitive",
    },
    {
      words: ["ils", "jouent", "souvent", "aux", "jeux", "vidéo", "le", "soir"],
      answer: "ils jouent souvent aux jeux vidéo le soir",
      hint: "Verb: jouer — adverb souvent comes after conjugated verb; jouer aux + plural noun",
      verbFocus: "jouer + souvent",
    },
    {
      words: ["tu", "étudies", "beaucoup", "mais", "tu", "es", "fatigué"],
      answer: "tu étudies beaucoup mais tu es fatigué",
      hint: "Two verbs: étudier (-ER) and être — connect two ideas with mais",
      verbFocus: "étudier + être + adjective",
    },
  ],
  3: [
    {
      words: ["ma", "sœur", "est", "grande", "et", "très", "intelligente"],
      answer: "ma sœur est grande et très intelligente",
      hint: "Verb: être — adjectives grande/intelligente agree with sœur (feminine); très intensifies",
      verbFocus: "être + feminine adjective agreement",
    },
    {
      words: ["j'ai", "un", "cours", "de", "maths", "difficile", "le", "mardi"],
      answer: "j'ai un cours de maths difficile le mardi",
      hint: "Verb: avoir — difficile comes AFTER the noun it describes; le mardi = on Tuesdays",
      verbFocus: "avoir + adjective after noun",
    },
    {
      words: ["mon", "père", "est", "sympa", "et", "il", "a", "les", "yeux", "bleus"],
      answer: "mon père est sympa et il a les yeux bleus",
      hint: "Two verbs: être + avoir — bleus agrees with yeux (masculine plural)",
      verbFocus: "être + avoir + color adjective",
    },
    {
      words: ["nous", "n'avons", "pas", "de", "cours", "d'EPS", "aujourd'hui"],
      answer: "nous n'avons pas de cours d'EPS aujourd'hui",
      hint: "Verb: avoir — after ne…pas, un/une/des → de; d'EPS uses elision",
      verbFocus: "ne…pas avoir + de",
    },
    {
      words: ["sa", "petite", "sœur", "est", "amusante", "mais", "un", "peu", "timide"],
      answer: "sa petite sœur est amusante mais un peu timide",
      hint: "petite is a BAGS adjective (before noun); amusante/timide agree with sœur (fem.); un peu = a little",
      verbFocus: "être + BAGS adjective + agreement",
    },
  ],
  4: [
    {
      words: ["je", "vais", "faire", "du", "sport", "cet", "après-midi"],
      answer: "je vais faire du sport cet après-midi",
      hint: "Near future: aller + infinitive faire; du sport = partitive; cet before masc. vowel sound",
      verbFocus: "aller + faire (near future)",
    },
    {
      words: ["il", "fait", "beau", "alors", "nous", "allons", "faire", "une", "longue", "promenade"],
      answer: "il fait beau alors nous allons faire une longue promenade",
      hint: "Weather expression il fait beau; alors = so/therefore; longue (BAGS adj) comes before promenade",
      verbFocus: "faire (weather) + aller + faire (activity)",
    },
    {
      words: ["elle", "finit", "ses", "devoirs", "difficiles", "avant", "de", "regarder", "la", "télé"],
      answer: "elle finit ses devoirs difficiles avant de regarder la télé",
      hint: "Verb: finir (-IR) — difficiles agrees with devoirs (masc. plural); avant de + infinitive",
      verbFocus: "finir (-IR) + adjective agreement",
    },
    {
      words: ["ils", "vont", "au", "cinéma", "ce", "soir", "parce que", "c'est", "amusant"],
      answer: "ils vont au cinéma ce soir parce que c'est amusant",
      hint: "aller + au (à+le masc.); parce que = because; c'est + adjective",
      verbFocus: "aller + au + parce que",
    },
  ],
  5: [
    {
      words: ["je", "vais", "à la", "bibliothèque", "pour", "étudier", "tranquillement"],
      answer: "je vais à la bibliothèque pour étudier tranquillement",
      hint: "aller + à la (fem.); pour + infinitive = in order to; tranquillement is an adverb (-ment)",
      verbFocus: "aller + à la + pour + infinitive",
    },
    {
      words: ["le", "chat", "paresseux", "est", "sous", "la", "grande", "table"],
      answer: "le chat paresseux est sous la grande table",
      hint: "paresseux after noun (BANGS); sous = under; grande is BAGS — before table (fem.)",
      verbFocus: "être + preposition + adjective placement",
    },
    {
      words: ["nous", "allons", "visiter", "notre", "belle", "nouvelle", "maison", "demain"],
      answer: "nous allons visiter notre belle nouvelle maison demain",
      hint: "Near future; belle and nouvelle are BAGS — both before maison; stacked pre-noun adjectives",
      verbFocus: "aller + stacked BAGS adjectives",
    },
    {
      words: ["elle", "vient", "de", "Lyon", "et", "elle", "habite", "dans", "un", "grand", "appartement"],
      answer: "elle vient de Lyon et elle habite dans un grand appartement",
      hint: "venir de = to come from; habiter dans = to live in; grand is BAGS (before masc. noun)",
      verbFocus: "venir + habiter + grand",
    },
  ],
  6: [
    {
      words: ["je", "voudrais", "du", "pain", "frais", "et", "du", "bon", "fromage", "s'il vous plaît"],
      answer: "je voudrais du pain frais et du bon fromage s'il vous plaît",
      hint: "vouloir conditionnel; du = partitive (masc.); frais after noun; bon is BAGS — before fromage",
      verbFocus: "vouloir + partitive + adjective placement",
    },
    {
      words: ["elle", "ne", "mange", "pas", "de", "viande", "rouge", "parce que", "elle", "est", "végétarienne"],
      answer: "elle ne mange pas de viande rouge parce que elle est végétarienne",
      hint: "After ne…pas, partitive → de; rouge after noun; parce que links cause",
      verbFocus: "manger + ne…pas de + parce que",
    },
    {
      words: ["nous", "pouvons", "commander", "une", "grande", "salade", "verte"],
      answer: "nous pouvons commander une grande salade verte",
      hint: "pouvoir + infinitive; grande is BAGS (before noun); verte (color) comes after noun",
      verbFocus: "pouvoir + BAGS vs color adjective",
    },
    {
      words: ["vous", "voulez", "du", "thé", "chaud", "ou", "du", "café", "fort"],
      answer: "vous voulez du thé chaud ou du café fort",
      hint: "vouloir + partitive du (both masc.); adjectives chaud/fort come AFTER the drink nouns",
      verbFocus: "vouloir + partitive + post-noun adjectives",
    },
  ],
};

function WordBankExercise({
  vocab,
  unit,
  onComplete,
}: {
  vocab: VocabItem[];
  unit: number;
  onComplete: () => void;
}) {
  const sentences = WORD_BANK_SENTENCES[unit] ?? WORD_BANK_SENTENCES[1];
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [available, setAvailable] = useState<string[]>([...sentences[0].words]);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = sentences[idx];

  function selectWord(word: string, fromSelected: boolean) {
    if (checked) return;
    if (fromSelected) {
      setSelected((s) => s.filter((w, i) => !(w === word && i === s.lastIndexOf(word))));
      setAvailable((a) => [...a, word]);
    } else {
      const idx = available.indexOf(word);
      if (idx === -1) return;
      const newAvail = [...available];
      newAvail.splice(idx, 1);
      setAvailable(newAvail);
      setSelected((s) => [...s, word]);
    }
  }

  function check() {
    const attempt = selected.join(" ").toLowerCase();
    const isCorrect = attempt === q.answer.toLowerCase();
    setCorrect(isCorrect);
    setChecked(true);
    if (isCorrect) setScore((s) => s + 1);
  }

  function next() {
    if (idx + 1 >= sentences.length) {
      setDone(true);
      onComplete();
    } else {
      const next = sentences[idx + 1];
      setIdx((i) => i + 1);
      setSelected([]);
      setAvailable([...next.words]);
      setChecked(false);
      setCorrect(false);
    }
  }

  if (done) {
    return (
      <div className="text-center py-8 space-y-3">
        <p className="text-4xl">{score >= sentences.length ? "🎉" : "💪"}</p>
        <p className="font-bold" style={{ color: "var(--text)" }}>{score}/{sentences.length} sentences correct</p>
        <button
          onClick={() => { setIdx(0); setSelected([]); setAvailable([...sentences[0].words]); setChecked(false); setCorrect(false); setDone(false); setScore(0); }}
          className="px-6 py-2.5 rounded-xl text-sm border hover:bg-[var(--surface2)]"
          style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs" style={{ color: "var(--text-muted)" }}>
        <span>{idx + 1} / {sentences.length}</span>
        <span>{score} correct</span>
      </div>

      <div className="space-y-1">
        <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
          Arrange the words to form a correct French sentence:
        </p>
        {q.verbFocus && (
          <span
            className="inline-block text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: "var(--accent-fr)", color: "white", opacity: 0.85 }}
          >
            Focus: {q.verbFocus}
          </span>
        )}
      </div>

      {/* Selected words */}
      <div
        className="min-h-12 p-3 rounded-xl border-2 border-dashed flex flex-wrap gap-2 items-center transition-colors"
        style={{
          borderColor: checked ? (correct ? "#10b981" : "#ef4444") : "var(--border)",
          backgroundColor: "var(--surface2)",
        }}
      >
        {selected.length === 0 && (
          <span className="text-xs" style={{ color: "var(--text-subtle)" }}>Tap words below to build the sentence…</span>
        )}
        {selected.map((w, i) => (
          <button
            key={`sel_${i}`}
            onClick={() => selectWord(w, true)}
            className="px-2.5 py-1 rounded-md text-sm font-medium fr-text transition-colors hover:bg-red-100 dark:hover:bg-red-950/30"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
          >
            {w}
          </button>
        ))}
      </div>

      {/* Word bank */}
      <div className="flex flex-wrap gap-2">
        {available.map((w, i) => (
          <button
            key={`avail_${i}`}
            onClick={() => selectWord(w, false)}
            className="px-2.5 py-1 rounded-md text-sm font-medium fr-text transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/30"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--accent-fr)",
              color: "var(--accent-fr)",
            }}
          >
            {w}
          </button>
        ))}
      </div>

      {checked && (
        <div
          className="p-3 rounded-xl text-sm"
          style={{
            backgroundColor: correct ? "#d1fae5" : "#fee2e2",
            color: correct ? "#065f46" : "#991b1b",
          }}
        >
          {correct ? (
            <span>✓ Correct! <strong className="fr-text">{q.answer}</strong></span>
          ) : (
            <span>Correct answer: <strong className="fr-text">{q.answer}</strong> — {q.hint}</span>
          )}
        </div>
      )}

      {!checked ? (
        <button
          onClick={check}
          disabled={selected.length === 0}
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
          {idx + 1 >= sentences.length ? "Finish ✓" : "Next →"}
        </button>
      )}
    </div>
  );
}

// ── Reading Check ──────────────────────────────────────────────────────────────

function ReadingCheckExercise({ unit, onComplete }: { unit: number; onComplete: () => void }) {
  const MINI_PASSAGES: Record<number, { text: string; questions: string[]; answers: string[] }> = {
    1: {
      text: "Bonjour ! Je m'appelle Léa. Je suis française et j'habite à Paris. Je suis sympa et un peu timide. J'ai une amie qui s'appelle Sophie. Elle est très drôle !",
      questions: ["Comment s'appelle la fille ?", "Elle est de quelle nationalité ?", "Comment est Sophie ?"],
      answers: ["Léa", "Elle est française.", "Elle est drôle."],
    },
    2: {
      text: "Le mardi, je joue au foot avec mes amis. Le vendredi soir, j'écoute de la musique. Je n'aime pas regarder la télé mais j'adore surfer sur Internet.",
      questions: ["Qu'est-ce qu'il fait le mardi ?", "Est-ce qu'il aime la télé ?", "Qu'est-ce qu'il adore ?"],
      answers: ["Il joue au foot.", "Non, il n'aime pas la télé.", "Il adore surfer sur Internet."],
    },
    3: {
      text: "J'ai cours de sciences, de maths et de français aujourd'hui. J'aime bien les sciences — c'est intéressant. Je déteste les maths parce que c'est difficile. J'ai toujours mon cahier et mon stylo.",
      questions: ["Quels cours a-t-il aujourd'hui ?", "Pourquoi aime-t-il les sciences ?", "Qu'est-ce qu'il a toujours ?"],
      answers: ["Sciences, maths et français.", "Parce que c'est intéressant.", "Son cahier et son stylo."],
    },
    4: {
      text: "Ma famille est grande. Mon père a 45 ans et ma mère a 42 ans. J'ai un frère — il s'appelle Paul et il a 12 ans. Mes grands-parents habitent à Lyon. Ils sont très vieux mais très sympas.",
      questions: ["Quel âge a son père ?", "Comment s'appelle son frère ?", "Où habitent ses grands-parents ?"],
      answers: ["Il a 45 ans.", "Il s'appelle Paul.", "Ils habitent à Lyon."],
    },
    5: {
      text: "Ma maison est grande. Il y a un salon, une cuisine, et trois chambres. Ma chambre est à côté de la salle de bain. Demain, je vais aller au cinéma avec mon ami.",
      questions: ["Combien de chambres y a-t-il ?", "Où est la chambre ?", "Qu'est-ce qu'il va faire demain ?"],
      answers: ["Il y a trois chambres.", "À côté de la salle de bain.", "Il va aller au cinéma."],
    },
    6: {
      text: "Au café, je voudrais un café et un croissant s'il vous plaît. Mon ami veut de l'eau et une salade. Nous ne mangeons pas de viande. Le garçon apporte l'addition.",
      questions: ["Qu'est-ce qu'il veut ?", "Qu'est-ce que son ami veut ?", "Est-ce qu'ils mangent de la viande ?"],
      answers: ["Un café et un croissant.", "De l'eau et une salade.", "Non, ils ne mangent pas de viande."],
    },
  };

  const passage = MINI_PASSAGES[unit] ?? MINI_PASSAGES[1];
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  async function check() {
    setLoading(true);
    try {
      const qa = passage.questions
        .map((q, i) => `Q: ${q}\nStudent: ${answers[i] ?? "(no answer)"}\nCorrect: ${passage.answers[i]}`)
        .join("\n\n");
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: "grade_reading", content: qa, context: { unit } }),
      });
      const data = await res.json();
      setFeedback(data.response);
      onComplete();
    } catch {
      setFeedback("Could not grade — check API key.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div
        className="p-4 rounded-xl fr-text text-base leading-relaxed"
        style={{ backgroundColor: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)" }}
      >
        {passage.text}
      </div>
      {passage.questions.map((q, i) => (
        <div key={i}>
          <label className="block text-sm font-medium mb-1 fr-text" style={{ color: "var(--text)" }}>
            {i + 1}. {q}
          </label>
          <input
            type="text"
            value={answers[i]}
            onChange={(e) => setAnswers((prev) => { const next = [...prev]; next[i] = e.target.value; return next; })}
            className="w-full px-3 py-2 rounded-lg text-sm border outline-none fr-text focus:ring-2 focus:ring-[var(--accent-fr)]"
            style={{ backgroundColor: "var(--surface2)", borderColor: "var(--border)", color: "var(--text)" }}
            placeholder="Répondez en français…"
          />
        </div>
      ))}
      {feedback && (
        <div className="p-4 rounded-xl whitespace-pre-wrap text-sm" style={{ backgroundColor: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)" }}>
          {feedback}
        </div>
      )}
      {!feedback && (
        <button onClick={check} disabled={loading} className="w-full py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-60" style={{ backgroundColor: "var(--accent-fr)" }}>
          {loading ? "Checking…" : "Check Answers →"}
        </button>
      )}
    </div>
  );
}

// ── Timed Write ────────────────────────────────────────────────────────────────

const TIMED_PROMPTS: Record<number, string> = {
  1: "Présente-toi : ton nom, ta nationalité, et 3 adjectifs qui te décrivent.",
  2: "Décris ce que tu aimes et n'aimes pas faire le week-end.",
  3: "Parle de ton cours préféré et de ton cours le plus difficile.",
  4: "Décris un membre de ta famille — son apparence et sa personnalité.",
  5: "Décris ta chambre et ce que tu vas faire ce week-end.",
  6: "Tu es au restaurant. Commande un repas complet pour toi et ton ami.",
};

function TimedWriteExercise({ unit, onComplete }: { unit: number; onComplete: () => void }) {
  const [started, setStarted] = useState(false);
  const [text, setText] = useState("");
  const [timeLeft, setTimeLeft] = useState(180); // 3 min
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [timerRef, setTimerRef] = useState<NodeJS.Timeout | null>(null);

  const prompt = TIMED_PROMPTS[unit] ?? TIMED_PROMPTS[1];

  function startTimer() {
    setStarted(true);
    setTimeLeft(180);
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimerRef(t);
  }

  function stop() {
    if (timerRef) clearInterval(timerRef);
    setFinished(true);
  }

  async function getFeedback() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "grade_writing",
          content: `Timed write prompt: ${prompt}\n\nStudent's writing:\n${text}`,
          context: { unit, targetStructures: ["production", "fluency", "accuracy"] },
        }),
      });
      const data = await res.json();
      setFeedback(data.response);
      onComplete();
    } catch {
      setFeedback("Could not grade — check API key.");
    } finally {
      setLoading(false);
    }
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (!started) {
    return (
      <div className="space-y-4">
        <div
          className="p-5 rounded-xl border-2 border-dashed"
          style={{ borderColor: "var(--accent-fr)", backgroundColor: "var(--surface)" }}
        >
          <p className="text-xs uppercase tracking-wider mb-2 font-semibold" style={{ color: "var(--accent-fr)" }}>
            3-Minute Production Sprint
          </p>
          <p className="fr-text text-base font-medium" style={{ color: "var(--text)" }}>{prompt}</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
            Write as much as you can in 3 minutes. Don't stop to look things up — this builds real fluency. Go!
          </p>
        </div>
        <button
          onClick={startTimer}
          className="w-full py-3 rounded-xl text-white text-sm font-semibold"
          style={{ backgroundColor: "var(--accent-red)" }}
        >
          ⏱ Start 3-Minute Timer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Timer */}
      <div
        className={cn(
          "flex items-center justify-between p-3 rounded-xl text-sm font-bold",
          timeLeft <= 30 ? "bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400" : "bg-[var(--surface2)]"
        )}
        style={{ color: timeLeft <= 30 ? undefined : "var(--text)" }}
      >
        <span>{TIMED_PROMPTS[unit]}</span>
        <span className="text-lg font-mono flex-shrink-0 ml-3">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        disabled={finished}
        autoFocus
        className="w-full px-4 py-3 rounded-xl text-sm border outline-none resize-none fr-text focus:ring-2 focus:ring-[var(--accent-fr)]"
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
          color: "var(--text)",
          fontSize: "1rem",
        }}
        placeholder="Commence à écrire…"
      />

      <div className="flex items-center justify-between text-xs" style={{ color: "var(--text-muted)" }}>
        <span>{text.trim().split(/\s+/).filter(Boolean).length} words</span>
        {!finished && (
          <button onClick={stop} className="text-amber-600 hover:underline">
            Stop early
          </button>
        )}
      </div>

      {finished && !feedback && (
        <div className="space-y-3">
          <div
            className="p-3 rounded-xl text-sm text-center"
            style={{ backgroundColor: "var(--surface2)", color: "var(--text)" }}
          >
            Time's up! You wrote {text.trim().split(/\s+/).filter(Boolean).length} words. Get AI feedback?
          </div>
          <button
            onClick={getFeedback}
            disabled={loading || !text.trim()}
            className="w-full py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-60"
            style={{ backgroundColor: "var(--accent-fr)" }}
          >
            {loading ? "Getting feedback…" : "Get AI Feedback →"}
          </button>
        </div>
      )}

      {feedback && (
        <div className="p-4 rounded-xl whitespace-pre-wrap text-sm" style={{ backgroundColor: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)" }}>
          {feedback}
        </div>
      )}
    </div>
  );
}

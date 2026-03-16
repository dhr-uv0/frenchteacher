// Rule-based French feedback engine — no AI API required.
// Inspired by the PinnaclePrepTracker studyPlan pattern:
// analyze text/performance, detect patterns, return structured feedback.

import { GRAMMAR_RULES } from "@/data/curriculum";

// ─── Accent checkers ────────────────────────────────────────────────────────

const ACCENT_CHECKS: [RegExp, string][] = [
  [/\betre\b/gi,            "être  →  needs circumflex: **ê**tre"],
  [/\beleve[sx]?\b/gi,      "eleve  →  **é**l**è**ve (two accents)"],
  [/\becole[sx]?\b/gi,      "ecole  →  **é**cole"],
  [/\betudier?\b|\betudie[zrs]?\b/gi, "etudier  →  **é**tudier"],
  [/\bfrancaise?s?\b/gi,    "francais  →  fran**ç**ais (cedilla on ç)"],
  [/\bgarcon[s]?\b/gi,      "garcon  →  gar**ç**on"],
  [/\bcafe[s]?\b/gi,        "cafe  →  caf**é**"],
  [/\bdeja\b/gi,            "deja  →  d**é**j**à**"],
  [/\bvoila\b/gi,           "voila  →  voil**à**"],
  [/\btres\b/gi,            "tres  →  tr**è**s"],
  [/\bpere[s]?\b/gi,        "pere  →  p**è**re"],
  [/\bmere[s]?\b/gi,        "mere  →  m**è**re"],
  [/\bfrere[s]?\b/gi,       "frere  →  fr**è**re"],
  [/\bnumero[s]?\b/gi,      "numero  →  num**é**ro"],
  [/\bpresente[rz]?\b/gi,   "presenter  →  pr**é**senter"],
  [/\bdesolé\b|\bdesole\b/gi, "desole  →  d**é**sol**é**"],
  [/\bfete[s]?\b/gi,        "fete  →  f**ê**te"],
  [/\bforet[s]?\b/gi,       "foret  →  for**ê**t"],
  [/\binteresse[rz]?\b/gi,  "interesse  →  int**é**ress**é**"],
  [/\bprefe[rz]?\b|\bprefere\b/gi, "prefere  →  pr**é**f**è**re"],
];

function detectAccentIssues(text: string): string[] {
  return ACCENT_CHECKS
    .filter(([pattern]) => pattern.test(text))
    .map(([, hint]) => hint);
}

// ─── Conjugation checkers ────────────────────────────────────────────────────

function detectConjugationIssues(text: string): string[] {
  const issues: string[] = [];
  // je + -ez (should be -e for -er verbs)
  if (/\bje\s+[a-zàâçéèêëîïôùûü]{3,}ez\b/i.test(text))
    issues.push("je + -**ez** is wrong  →  use -**e**: *je parle*, not *je parlez*");
  // tu + -ons (should be -es)
  if (/\btu\s+[a-zàâçéèêëîïôùûü]{3,}ons\b/i.test(text))
    issues.push("tu + -**ons** is wrong  →  use -**es**: *tu parles*");
  // il/elle + -ons or -ez
  if (/\bil\s+[a-zàâçéèêëîïôùûü]{3,}(ons|ez)\b/i.test(text) ||
      /\belle\s+[a-zàâçéèêëîïôùûü]{3,}(ons|ez)\b/i.test(text))
    issues.push("il/elle + -**ons**/-**ez** is wrong  →  use -**e**: *il parle*");
  // ils/elles + -e or -ez (should be -ent)
  if (/\b(ils|elles)\s+[a-zàâçéèêëîïôùûü]{3,}ez\b/i.test(text))
    issues.push("ils/elles + -**ez** is wrong  →  use -**ent**: *ils parlent*");
  return issues;
}

// ─── Article checkers ────────────────────────────────────────────────────────

function detectArticleIssues(text: string): string[] {
  const issues: string[] = [];
  // "le" before feminine nouns (catch a few common ones)
  if (/\ble\s+(fille|femme|mère|sœur|école|maison|famille|classe)\b/i.test(text))
    issues.push("Article agreement: use **la** before feminine nouns (la fille, la femme...)");
  // "la" before masculine nouns
  if (/\bla\s+(garçon|père|frère|homme|fils|lycée|collège)\b/i.test(text))
    issues.push("Article agreement: use **le** before masculine nouns (le garçon, le père...)");
  return issues;
}

// ─── Connector word checker ──────────────────────────────────────────────────

const CONNECTORS = ["et", "mais", "ou", "donc", "car", "parce que", "quand", "si",
                    "aussi", "alors", "puis", "ensuite", "d'abord", "enfin"];

function detectMissingConnectors(text: string): boolean {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length < 2) return false;
  const hasConnector = CONNECTORS.some(c => text.toLowerCase().includes(c));
  return !hasConnector;
}

// ─── Grammar rule lookup ─────────────────────────────────────────────────────

function findRelevantRule(topic: string): string | null {
  const lc = topic.toLowerCase();
  for (const rule of GRAMMAR_RULES) {
    const titleWords = rule.title.toLowerCase().split(/\s+/);
    if (titleWords.some(w => w.length > 3 && lc.includes(w))) {
      return `**${rule.title}**: ${rule.explanation}`;
    }
  }
  return null;
}

// ─── Score calculator ────────────────────────────────────────────────────────

function calcScore(accentIssues: number, conjugIssues: number, articleIssues: number, wordCount: number, target = 30): number {
  let score = 9;
  score -= Math.min(accentIssues * 0.5, 2.5);
  score -= Math.min(conjugIssues * 1, 2);
  score -= Math.min(articleIssues * 0.5, 1);
  if (wordCount < target * 0.4) score -= 1.5;
  else if (wordCount < target * 0.7) score -= 0.5;
  return Math.max(2, Math.min(10, Math.round(score * 2) / 2));
}

// ─── Public feedback generators ─────────────────────────────────────────────

export function gradeTranslation(content: string, unit = 3): string {
  const accentIssues   = detectAccentIssues(content);
  const conjugIssues   = detectConjugationIssues(content);
  const articleIssues  = detectArticleIssues(content);
  const wordCount      = content.trim().split(/\s+/).length;
  const score          = calcScore(accentIssues.length, conjugIssues.length, articleIssues.length, wordCount, 20);
  const allIssues      = [...accentIssues, ...conjugIssues, ...articleIssues];

  const lines: string[] = [
    "---",
    `SCORE: ${score}/10`,
    `OVERALL: ${score >= 8 ? "Solid translation — just a few polish items." : score >= 6 ? "Good effort — focus on the errors below to level up." : "Keep going! French takes practice. Work through each error below one at a time."}`,
    "",
    "LINE BY LINE:",
  ];

  if (allIssues.length === 0) {
    lines.push("✓ No obvious accent, conjugation, or article errors detected — great job!");
  } else {
    allIssues.forEach(issue => lines.push(`✗ ${issue}`));
  }

  lines.push("", "KEY ERRORS:");
  if (accentIssues.length)   lines.push(`• Accents (${accentIssues.length} issue${accentIssues.length > 1 ? "s" : ""}): French accents change meaning — they are not optional.`);
  if (conjugIssues.length)   lines.push(`• Verb endings: Each subject pronoun requires a specific ending. Review the Unit ${unit} conjugation table.`);
  if (articleIssues.length)  lines.push(`• Article agreement: le/la/les must match the gender of the noun.`);
  if (allIssues.length === 0) lines.push("• No major errors found — review your work once more to be sure.");

  lines.push("", "REWRITE PROMPT:");
  lines.push(allIssues.length > 0
    ? `Fix the errors above and rewrite your translation, paying special attention to: ${allIssues.slice(0, 3).map(i => i.split("→")[0].trim()).join(", ")}.`
    : "Your translation looks clean! Try adding one more detail or connector word (mais, parce que, aussi) to enrich it."
  );
  lines.push("---");
  return lines.join("\n");
}

export function gradeWriting(content: string, targetStructures: string[], unit = 3): string {
  const accentIssues    = detectAccentIssues(content);
  const conjugIssues    = detectConjugationIssues(content);
  const articleIssues   = detectArticleIssues(content);
  const missingConnect  = detectMissingConnectors(content);
  const wordCount       = content.trim().split(/\s+/).length;
  const score           = calcScore(accentIssues.length, conjugIssues.length, articleIssues.length, wordCount, 40);

  const lines: string[] = [
    "---",
    `SCORE: ${score}/10`,
    "",
    "STRENGTHS:",
    wordCount >= 30  ? "- Good length — you wrote enough to practice multiple structures." : "- You gave it a try — keep building!",
    conjugIssues.length === 0 ? "- No obvious conjugation errors detected." : "",
    accentIssues.length === 0 ? "- Accents look correct — nice attention to detail!" : "",
    "",
    "ERRORS (line by line):",
  ].filter(l => l !== "");

  const allIssues = [...accentIssues, ...conjugIssues, ...articleIssues];
  if (allIssues.length === 0) {
    lines.push("✓ No pattern errors found. Read your writing aloud — does it sound natural?");
  } else {
    allIssues.forEach(issue => lines.push(`✗ ${issue}`));
  }

  lines.push("", "CATEGORIES ANALYSIS:");
  lines.push(`- Vocabulary range: ${wordCount >= 40 ? "Good variety" : "Try using more vocabulary from Unit " + unit}`);
  lines.push(`- Verb conjugation: ${conjugIssues.length === 0 ? "Looks correct ✓" : conjugIssues.length + " issue(s) found — review -er verb endings"}`);
  lines.push(`- Adjective agreement: Check that adjectives match noun gender (grand/grande, petit/petite)`);
  lines.push(`- Connector word usage: ${missingConnect ? "Add connectors like mais, et, donc, parce que to link ideas" : "Good connector usage ✓"}`);

  if (targetStructures.length > 0) {
    lines.push("", "TARGET STRUCTURES CHECK:");
    targetStructures.forEach(s => {
      const found = content.toLowerCase().includes(s.toLowerCase().split(" ")[0]);
      lines.push(`${found ? "✓" : "✗"} "${s}" — ${found ? "used ✓" : "not found — try to include this structure"}`);
    });
  }

  lines.push("", "REWRITE PROMPT:");
  lines.push(allIssues.length > 0
    ? `Rewrite your passage applying these corrections: ${allIssues.slice(0, 3).map(i => i.split("→")[0].trim()).join(", ")}.`
    : "Your writing is clean! Challenge yourself: add two more sentences using a new vocabulary word from your unit."
  );
  lines.push("---");
  return lines.join("\n");
}

export function journalFeedback(content: string): string {
  const accentIssues   = detectAccentIssues(content);
  const conjugIssues   = detectConjugationIssues(content);
  const missingConnect = detectMissingConnectors(content);
  const wordCount      = content.trim().split(/\s+/).length;

  const lines: string[] = [
    "---",
    `GREAT JOB: Writing a full journal entry in French — that's real practice. You wrote ${wordCount} words!`,
    "",
    "FOCUS ON THESE 2–3 THINGS:",
  ];

  let n = 1;
  if (accentIssues.length > 0) {
    lines.push(`${n++}. **Accents**: ${accentIssues[0]} — accents are part of correct spelling in French, not optional.`);
  } else {
    lines.push(`${n++}. **Keep accent accuracy high**: Your accents look good — stay consistent.`);
  }
  if (conjugIssues.length > 0) {
    lines.push(`${n++}. **Verb endings**: ${conjugIssues[0]} — say the pronoun + verb aloud to feel the right ending.`);
  } else {
    lines.push(`${n++}. **Vary your verbs**: Try using a different verb tense or a reflexive verb if you know one.`);
  }
  if (missingConnect) {
    lines.push(`${n++}. **Connectors**: Link your sentences with mais, et, donc, parce que, ou — this makes French flow naturally.`);
  } else {
    lines.push(`${n++}. **Expand your details**: Try adding an adjective to at least one noun to be more descriptive.`);
  }

  lines.push("", "BONUS CHALLENGE: Write one sentence using a word you haven't used before from your current unit's vocabulary list.");
  lines.push("---");
  return lines.join("\n");
}

export function explainGrammar(topic: string): string {
  const rule = findRelevantRule(topic);
  if (rule) {
    const ruleObj = GRAMMAR_RULES.find(r =>
      r.title.toLowerCase().split(/\s+/).some(w => w.length > 3 && topic.toLowerCase().includes(w))
    );
    if (ruleObj) {
      const lines = [
        `**${ruleObj.title}**`,
        "",
        ruleObj.explanation,
        "",
        "EXAMPLES:",
        ...ruleObj.examples.map((ex, i) => `${i + 1}. ${ex}`),
      ];
      if (ruleObj.tables && ruleObj.tables.length > 0) {
        lines.push("", "CONJUGATION TABLE:");
        const tbl = ruleObj.tables[0];
        lines.push(`  ${tbl.title}`);
        Object.entries(tbl.rows).forEach(([pronoun, form]) => {
          lines.push(`  ${pronoun.padEnd(10)} → ${form}`);
        });
      }
      return lines.join("\n");
    }
    return rule;
  }
  // Generic response with study tip
  return `**${topic}**\n\nThis topic is covered in your Grammar tab. Open your current unit, go to the Grammar section, and look for rules related to "${topic}".\n\nTip: Read the rule, then try writing 3 example sentences using that structure — production is the best way to lock in grammar.`;
}

export function gradeReading(content: string): string {
  const wordCount = content.trim().split(/\s+/).length;
  return [
    "READING CHECK RESULTS:",
    "",
    "Review each answer against the passage:",
    "✓ For each correct answer — note WHY it was right (which sentence in the passage supports it).",
    "✗ For each wrong answer — re-read the relevant paragraph and find the correct information.",
    "",
    "SELF-SCORING GUIDE:",
    "- Re-read questions you got wrong",
    "- Find the exact sentence in the passage that answers each question",
    "- Write the answer in your own words (don't just copy)",
    "",
    wordCount > 20
      ? "Good detail in your answers — keep connecting evidence from the text to your responses."
      : "Try writing longer answers that quote or reference specific details from the passage.",
  ].join("\n");
}

export function tutorChat(content: string, unit = 3, weakAreas: string[] = []): string {
  const lc = content.toLowerCase();

  // Try to find a matching grammar rule
  for (const rule of GRAMMAR_RULES) {
    const keywords = rule.title.toLowerCase().split(/\s+/);
    if (keywords.some(w => w.length > 3 && lc.includes(w))) {
      const lines = [
        `Great question about **${rule.title}**!`,
        "",
        rule.explanation,
        "",
        "Here's a quick example:",
        rule.examples[0] ?? "",
      ];
      if (rule.examples[1]) lines.push(rule.examples[1]);
      lines.push("", `Now you try: write a sentence using this rule in the context of Unit ${unit}. I'll check your work!`);
      return lines.join("\n");
    }
  }

  // Check if asking about weak areas
  if (weakAreas.length > 0) {
    const area = weakAreas[0];
    return [
      `Based on your recent practice, let's work on **${area}**.`,
      "",
      `For ${area}, the key rule is: review your Unit ${unit} grammar tab and find the section on ${area}.`,
      "",
      "Here's a mini challenge: write two sentences that specifically demonstrate this grammar point.",
      "Post them here and I'll give you detailed feedback!",
    ].join("\n");
  }

  // Generic helpful response
  return [
    `Good question! Let's work through this together.`,
    "",
    `For Unit ${unit}, focus on:`,
    `• Vocabulary from your unit flashcards`,
    `• The verb conjugation patterns in your Grammar tab`,
    `• Using connector words (mais, et, donc, parce que) to build longer sentences`,
    "",
    "Try this: write a 3-sentence description using vocabulary from your current unit. I'll review it!",
  ].join("\n");
}

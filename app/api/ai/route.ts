import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import { getOrCreateStudent } from "@/lib/student";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = "claude-sonnet-4-20250514";

type AITask =
  | "grade_translation"
  | "grade_writing"
  | "journal_feedback"
  | "tutor_chat"
  | "grade_reading"
  | "explain_grammar";

interface AIRequest {
  task: AITask;
  content: string;
  context?: {
    unit?: number;
    targetStructures?: string[];
    history?: { role: "user" | "assistant"; content: string }[];
  };
}

const SYSTEM_BASE = `You are FrenchMaestro AI, a French language tutor for a 9th-grade student at Skyline High School in Sammamish, WA.
The student is studying French 1 using the EntreCultures 1 ©2026 textbook.

CORE RULES:
1. Always use correct standard Parisian French with proper accent marks (é, è, ê, à, â, ù, û, î, ï, ô, ç, œ, æ).
2. Explain grammar in plain English — the student is a native English speaker.
3. Always give the rule or concept behind every correction — never just fix without explaining why.
4. Push output (production) over passive recognition. When the student writes something, always ask them to rewrite with corrections applied.
5. Be encouraging but honest. Point out errors clearly and specifically.
6. Keep responses focused and actionable — avoid walls of text.
7. When the student makes a mistake, identify the pattern category: vocabulary, conjugation, agreement, negation, article, word order, or output production.`;

function buildGradeTranslationPrompt(content: string, unit?: number): string {
  return `${SYSTEM_BASE}

TASK: Grade an English→French translation from a French 1 student.

The student is in Unit ${unit ?? 3}. Grade only what they have learned through Unit ${unit ?? 3}.

Student's translation:
${content}

Respond in this EXACT format:
---
SCORE: [X/10]
OVERALL: [1-2 sentence overall assessment]

LINE BY LINE:
[Quote each French phrase/sentence, then give: ✓ (correct) or ✗ (incorrect), and if incorrect, explain the specific rule violated and give the corrected version]

KEY ERRORS:
[List each distinct error type, e.g. "Missing accent on é", "Adjective must agree: rouge → rouges"]

REWRITE PROMPT:
Now rewrite your translation, fixing these specific errors: [list the errors]
---`;
}

function buildGradeWritingPrompt(
  content: string,
  targetStructures: string[],
  unit?: number
): string {
  return `${SYSTEM_BASE}

TASK: Grade a French writing exercise from a French 1 student (Unit ${unit ?? 3}).

TARGET STRUCTURES: ${targetStructures.join(", ")}

Student's writing:
${content}

Respond in this EXACT format:
---
SCORE: [X/10]

STRENGTHS:
- [what they did well]

ERRORS (line by line):
[Quote the problematic phrase, explain the rule, give correction]

CATEGORIES ANALYSIS:
- Vocabulary range: [comment]
- Verb conjugation: [comment]
- Adjective agreement: [comment]
- Connector word usage: [comment]

REWRITE PROMPT:
Rewrite the passage applying these corrections: [list 2-3 most important fixes]
---`;
}

function buildJournalFeedbackPrompt(content: string): string {
  return `${SYSTEM_BASE}

TASK: Give gentle, encouraging feedback on a student's French journal entry. This is a free-write — the student chose to write without a prompt. Be warm and supportive. Focus on 2-3 specific improvements, not an exhaustive list of every error.

Journal entry:
${content}

Format:
---
GREAT JOB: [something genuinely positive — be specific]

FOCUS ON THESE 2–3 THINGS:
1. [specific improvement with example]
2. [specific improvement with example]
3. [optional third improvement]

BONUS CHALLENGE: [one optional way to push their French further]
---`;
}

function buildTutorSystemPrompt(unit?: number, weakAreas?: string[]): string {
  return `${SYSTEM_BASE}

You are the AI Tutor for this student.
- Current unit: ${unit ?? 3}
- Known weak areas: ${weakAreas?.join(", ") || "vocabulary, grammar, and output production"}

TUTOR BEHAVIOR:
- Never just give the answer — always teach the concept first, then guide.
- If the student writes French, correct it inline with the rule behind each correction.
- If asked to quiz, give one question at a time and wait for the answer.
- Always end with a follow-up question or challenge to push production.
- Keep responses concise and conversational — this is a chat interface.
- Use bullet points for grammar explanations, not long paragraphs.`;
}

export async function POST(req: Request) {
  try {
    const body: AIRequest = await req.json();
    const { task, content, context } = body;

    const student = await getOrCreateStudent();

    // Build mistakes context for tutor
    let weakAreas: string[] = [];
    if (task === "tutor_chat") {
      const recentMistakes = await prisma.mistakeEntry.findMany({
        where: { studentId: student.id, reviewed: false },
        orderBy: { createdAt: "desc" },
        take: 10,
      });
      const categories = [...new Set(recentMistakes.map((m) => m.category))];
      weakAreas = categories;
    }

    let prompt = "";
    let systemPrompt = SYSTEM_BASE;
    let messages: Anthropic.MessageParam[] = [];

    switch (task) {
      case "grade_translation":
        prompt = buildGradeTranslationPrompt(content, context?.unit);
        messages = [{ role: "user", content: prompt }];
        break;

      case "grade_writing":
        prompt = buildGradeWritingPrompt(
          content,
          context?.targetStructures ?? [],
          context?.unit
        );
        messages = [{ role: "user", content: prompt }];
        break;

      case "journal_feedback":
        prompt = buildJournalFeedbackPrompt(content);
        messages = [{ role: "user", content: prompt }];
        break;

      case "grade_reading":
        prompt = `${SYSTEM_BASE}\n\nTASK: A French 1 student answered reading comprehension questions. Grade their answers.\n\n${content}\n\nFor each answer: ✓ correct, ✗ incorrect (with explanation and correct answer). Give a total score.`;
        messages = [{ role: "user", content: prompt }];
        break;

      case "explain_grammar":
        prompt = `${SYSTEM_BASE}\n\nTASK: Explain the following French grammar topic in plain English for a French 1 student. Give 3 clear examples with English translations.\n\nTopic: ${content}`;
        messages = [{ role: "user", content: prompt }];
        break;

      case "tutor_chat":
        systemPrompt = buildTutorSystemPrompt(context?.unit ?? student.currentUnit, weakAreas);
        // Include conversation history
        if (context?.history && context.history.length > 0) {
          messages = [
            ...context.history.map((m) => ({
              role: m.role as "user" | "assistant",
              content: m.content,
            })),
            { role: "user" as const, content },
          ];
        } else {
          messages = [{ role: "user", content }];
        }
        break;

      default:
        return NextResponse.json({ error: "Unknown task" }, { status: 400 });
    }

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ response: text });
  } catch (e) {
    console.error("AI API error:", e);
    return NextResponse.json(
      { error: "AI request failed. Check your ANTHROPIC_API_KEY." },
      { status: 500 }
    );
  }
}

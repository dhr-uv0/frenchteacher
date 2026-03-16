import { NextResponse } from "next/server";
import {
  gradeTranslation,
  gradeWriting,
  journalFeedback,
  explainGrammar,
  gradeReading,
  tutorChat,
} from "@/lib/feedback";

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
  weakAreas?: string[];
  context?: {
    unit?: number;
    targetStructures?: string[];
    history?: { role: "user" | "assistant"; content: string }[];
  };
}

export async function POST(req: Request) {
  try {
    const body: AIRequest = await req.json();
    const { task, content, context, weakAreas } = body;

    const unit = context?.unit ?? 3;
    let response = "";

    switch (task) {
      case "grade_translation":
        response = gradeTranslation(content, unit);
        break;
      case "grade_writing":
        response = gradeWriting(content, context?.targetStructures ?? [], unit);
        break;
      case "journal_feedback":
        response = journalFeedback(content);
        break;
      case "grade_reading":
        response = gradeReading(content);
        break;
      case "explain_grammar":
        response = explainGrammar(content);
        break;
      case "tutor_chat":
        response = tutorChat(content, unit, weakAreas ?? []);
        break;
      default:
        return NextResponse.json({ error: "Unknown task" }, { status: 400 });
    }

    return NextResponse.json({ response });
  } catch (e) {
    console.error("Feedback error:", e);
    return NextResponse.json({ error: "Feedback generation failed." }, { status: 500 });
  }
}

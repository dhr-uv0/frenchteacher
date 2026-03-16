"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Send, Bot, User, RefreshCw, BookOpen } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STARTER_PROMPTS = [
  "Explain the difference between être and avoir.",
  "Quiz me on Unit 3 vocabulary.",
  "Why does the adjective agree with the noun?",
  "Help me with ne...pas negation.",
  "What's the difference between du, de la, and de l'?",
  "How does the near future work in French?",
];

function TutorContent() {
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get("topic");

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: initialTopic
        ? `Bonjour ! I see you want to learn about **${initialTopic}**. Let me explain that for you...\n\nWhat specifically would you like to know? Or I can start with a full explanation.`
        : "Bonjour ! I'm your French AI tutor. I know exactly where you are in the curriculum (Unit 3) and your weak spots.\n\nI can:\n• Explain any grammar rule in plain English\n• Quiz you on vocabulary or conjugations\n• Correct your French sentences and explain every error\n• Give you production challenges\n\nWhat would you like to work on today?",
    },
  ]);
  const [input, setInput] = useState(initialTopic ? `Explain: ${initialTopic}` : "");
  const [loading, setLoading] = useState(false);
  const [currentUnit, setCurrentUnit] = useState(3);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch student's current unit
  useEffect(() => {
    fetch("/api/student")
      .then((r) => r.json())
      .then((d) => setCurrentUnit(d.student?.currentUnit ?? 3))
      .catch(() => {});
  }, []);

  async function send(text?: string) {
    const userMsg = text ?? input.trim();
    if (!userMsg || loading) return;

    setInput("");
    const newMessages: Message[] = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "tutor_chat",
          content: userMsg,
          context: {
            unit: currentUnit,
            history: newMessages.slice(-10).map((m) => ({ role: m.role, content: m.content })),
          },
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response ?? "Sorry, I had trouble with that. Try again." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm having trouble connecting. Check your ANTHROPIC_API_KEY." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col" style={{ height: "calc(100dvh - 10rem)" }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 rounded-t-xl border"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-fr)]">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>AI French Tutor</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Unit {currentUnit} · Knows your weak spots</p>
          </div>
        </div>
        <button
          onClick={() => setMessages([{
            role: "assistant",
            content: "Bonjour ! Fresh conversation — what would you like to work on?",
          }])}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg hover:bg-[var(--surface2)]"
          style={{ color: "var(--text-muted)" }}
        >
          <RefreshCw className="h-3.5 w-3.5" /> Clear
        </button>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4 border-x"
        style={{ backgroundColor: "var(--bg)", borderColor: "var(--border)" }}
      >
        {messages.map((msg, i) => (
          <div key={i} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
            <div
              className={cn(
                "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full",
                msg.role === "assistant" ? "bg-[var(--accent-fr)]" : "bg-[var(--surface2)]"
              )}
            >
              {msg.role === "assistant" ? (
                <Bot className="h-3.5 w-3.5 text-white" />
              ) : (
                <User className="h-3.5 w-3.5" style={{ color: "var(--text-muted)" }} />
              )}
            </div>
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                msg.role === "assistant"
                  ? "rounded-tl-none"
                  : "rounded-tr-none"
              )}
              style={{
                backgroundColor: msg.role === "assistant" ? "var(--surface)" : "var(--accent-fr)",
                color: msg.role === "assistant" ? "var(--text)" : "white",
                border: msg.role === "assistant" ? "1px solid var(--border)" : "none",
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent-fr)]">
              <Bot className="h-3.5 w-3.5 text-white" />
            </div>
            <div
              className="rounded-2xl rounded-tl-none px-4 py-3 text-sm"
              style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
            >
              <span className="animate-pulse">Thinking…</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Starter prompts */}
      {messages.length <= 1 && (
        <div
          className="px-4 py-3 border-x border-b"
          style={{ backgroundColor: "var(--surface2)", borderColor: "var(--border)" }}
        >
          <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>Quick start:</p>
          <div className="flex flex-wrap gap-1.5">
            {STARTER_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                className="px-2.5 py-1 rounded-lg text-xs border transition-colors hover:bg-[var(--surface)]"
                style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div
        className="flex items-end gap-2 p-3 rounded-b-xl border"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Ask anything, write French for correction, request a quiz…"
          className="flex-1 resize-none px-3 py-2.5 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-[var(--accent-fr)]"
          style={{
            backgroundColor: "var(--surface2)",
            borderColor: "var(--border)",
            color: "var(--text)",
            minHeight: "44px",
            maxHeight: "120px",
          }}
        />
        <button
          onClick={() => send()}
          disabled={loading || !input.trim()}
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-white transition-opacity disabled:opacity-40"
          style={{ backgroundColor: "var(--accent-fr)" }}
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function TutorPage() {
  return (
    <Suspense fallback={<div className="text-center py-10" style={{ color: "var(--text-muted)" }}>Loading tutor…</div>}>
      <TutorContent />
    </Suspense>
  );
}

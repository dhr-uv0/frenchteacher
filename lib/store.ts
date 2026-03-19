/**
 * localStorage data layer — replaces Prisma/SQLite for Vercel compatibility.
 * All functions are synchronous. Use inside useEffect for SSR safety.
 */

function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ── Interfaces ────────────────────────────────────────────────────────────────

export interface Student {
  id: string;
  name: string;
  currentUnit: number;
  streakDays: number;
  lastStudied: string | null;
  totalXp: number;
}

export interface UnitProgress {
  unitNumber: number;
  masteryPct: number;
  isUnlocked: boolean;
  isComplete: boolean;
}

export interface FlashcardProgress {
  vocabKey: string;
  direction: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: string; // ISO date string
  updatedAt: string;
}

export interface MistakeEntry {
  id: string;
  unitNumber: number | null;
  category: string;
  question: string;
  wrongAnswer: string;
  rightAnswer: string;
  explanation?: string;
  reviewed: boolean;
  createdAt: string;
}

export interface StudySession {
  id: string;
  sessionType: string;
  unitNumber: number | null;
  score: number | null;
  totalItems: number;
  correctItems: number;
  timeSpentSec: number;
  summary?: string;
  reviewNext: string | null;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  content: string;
  aiFeedback: string | null;
  wordCount: number;
  createdAt: string;
}

export interface CustomVocab {
  id: string;
  french: string;
  english: string;
  unitNumber: number | null;
  notes?: string;
  createdAt: string;
}

export interface SavedSet {
  id: string;
  name: string;
  keys: string[];
  createdAt: string;
}

// ── Storage keys ──────────────────────────────────────────────────────────────

const KEYS = {
  student: "fm_student",
  unitProgress: "fm_unit_progress",
  flashcards: "fm_flashcards",
  mistakes: "fm_mistakes",
  sessions: "fm_sessions",
  journal: "fm_journal",
  customVocab: "fm_custom_vocab",
  savedSets: "fm_saved_sets",
};

function isClient(): boolean {
  return typeof window !== "undefined";
}

function getItem<T>(key: string): T | null {
  if (!isClient()) return null;
  try {
    const val = localStorage.getItem(key);
    return val ? (JSON.parse(val) as T) : null;
  } catch {
    return null;
  }
}

function setItem<T>(key: string, value: T): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// ── Default data ──────────────────────────────────────────────────────────────

const DEFAULT_STUDENT: Student = {
  id: "student_1",
  name: "Dhruv",
  currentUnit: 3,
  streakDays: 0,
  lastStudied: null,
  totalXp: 0,
};

const DEFAULT_UNIT_PROGRESS: UnitProgress[] = [
  { unitNumber: 1, masteryPct: 82, isUnlocked: true, isComplete: false },
  { unitNumber: 2, masteryPct: 83, isUnlocked: true, isComplete: false },
  { unitNumber: 3, masteryPct: 62, isUnlocked: true, isComplete: false },
  { unitNumber: 4, masteryPct: 0, isUnlocked: false, isComplete: false },
  { unitNumber: 5, masteryPct: 0, isUnlocked: false, isComplete: false },
  { unitNumber: 6, masteryPct: 0, isUnlocked: false, isComplete: false },
];

// ── Student ───────────────────────────────────────────────────────────────────

export function getStudent(): Student {
  return getItem<Student>(KEYS.student) ?? DEFAULT_STUDENT;
}

export function updateStudent(partial: Partial<Student>): Student {
  const current = getStudent();
  const updated = { ...current, ...partial };
  setItem(KEYS.student, updated);
  return updated;
}

// ── Unit Progress ─────────────────────────────────────────────────────────────

export function getUnitProgress(): UnitProgress[] {
  return getItem<UnitProgress[]>(KEYS.unitProgress) ?? DEFAULT_UNIT_PROGRESS;
}

export function updateUnitProgress(unitNumber: number, partial: Partial<UnitProgress>): UnitProgress[] {
  const all = getUnitProgress();
  const updated = all.map((u) =>
    u.unitNumber === unitNumber ? { ...u, ...partial } : u
  );
  setItem(KEYS.unitProgress, updated);
  return updated;
}

// ── Streak ────────────────────────────────────────────────────────────────────

export function updateStreak(): void {
  const student = getStudent();
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  if (!student.lastStudied) {
    updateStudent({ streakDays: 1, lastStudied: todayStr });
    return;
  }

  const lastDay = new Date(student.lastStudied);
  const lastDayStr = lastDay.toISOString().split("T")[0];

  if (lastDayStr === todayStr) {
    // same day — no change
    return;
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  if (lastDayStr === yesterdayStr) {
    // consecutive day
    updateStudent({ streakDays: student.streakDays + 1, lastStudied: todayStr });
  } else {
    // streak broken
    updateStudent({ streakDays: 1, lastStudied: todayStr });
  }
}

// ── Flashcards ────────────────────────────────────────────────────────────────

export function getFlashcardProgress(): FlashcardProgress[] {
  return getItem<FlashcardProgress[]>(KEYS.flashcards) ?? [];
}

export function getDueFlashcards(direction: string, limit: number): FlashcardProgress[] {
  const all = getFlashcardProgress();
  const now = new Date();
  return all
    .filter((c) => c.direction === direction && new Date(c.nextReview) <= now)
    .slice(0, limit);
}

export function upsertFlashcard(data: {
  vocabKey: string;
  direction: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: Date | string;
}): void {
  const all = getFlashcardProgress();
  const nextReview =
    data.nextReview instanceof Date
      ? data.nextReview.toISOString()
      : data.nextReview;
  const now = new Date().toISOString();

  const idx = all.findIndex(
    (c) => c.vocabKey === data.vocabKey && c.direction === data.direction
  );

  if (idx >= 0) {
    all[idx] = {
      ...all[idx],
      easeFactor: data.easeFactor,
      interval: data.interval,
      repetitions: data.repetitions,
      nextReview,
      updatedAt: now,
    };
  } else {
    all.push({
      vocabKey: data.vocabKey,
      direction: data.direction,
      easeFactor: data.easeFactor,
      interval: data.interval,
      repetitions: data.repetitions,
      nextReview,
      updatedAt: now,
    });
  }

  setItem(KEYS.flashcards, all);
}

// ── Mistakes ──────────────────────────────────────────────────────────────────

export function getMistakes(limit?: number): MistakeEntry[] {
  const all = getItem<MistakeEntry[]>(KEYS.mistakes) ?? [];
  const sorted = [...all].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return limit ? sorted.slice(0, limit) : sorted;
}

export function addMistake(data: Omit<MistakeEntry, "id" | "reviewed" | "createdAt">): MistakeEntry {
  const all = getItem<MistakeEntry[]>(KEYS.mistakes) ?? [];
  const entry: MistakeEntry = {
    id: uid(),
    ...data,
    reviewed: false,
    createdAt: new Date().toISOString(),
  };
  all.unshift(entry);
  setItem(KEYS.mistakes, all);
  return entry;
}

export function markMistakeReviewed(id: string): void {
  const all = getItem<MistakeEntry[]>(KEYS.mistakes) ?? [];
  const updated = all.map((m) => (m.id === id ? { ...m, reviewed: true } : m));
  setItem(KEYS.mistakes, updated);
}

// ── Sessions ──────────────────────────────────────────────────────────────────

export function getSessions(limit?: number): StudySession[] {
  const all = getItem<StudySession[]>(KEYS.sessions) ?? [];
  const sorted = [...all].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return limit ? sorted.slice(0, limit) : sorted;
}

export function addSession(data: Omit<StudySession, "id" | "createdAt">): StudySession {
  const all = getItem<StudySession[]>(KEYS.sessions) ?? [];
  const entry: StudySession = {
    id: uid(),
    ...data,
    createdAt: new Date().toISOString(),
  };
  all.unshift(entry);
  setItem(KEYS.sessions, all);
  updateStreak();
  return entry;
}

// ── Journal ───────────────────────────────────────────────────────────────────

export function getJournalEntries(): JournalEntry[] {
  const all = getItem<JournalEntry[]>(KEYS.journal) ?? [];
  return [...all].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function addJournalEntry(content: string): JournalEntry {
  const all = getItem<JournalEntry[]>(KEYS.journal) ?? [];
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const entry: JournalEntry = {
    id: uid(),
    content,
    aiFeedback: null,
    wordCount,
    createdAt: new Date().toISOString(),
  };
  all.unshift(entry);
  setItem(KEYS.journal, all);
  return entry;
}

export function updateJournalFeedback(id: string, feedback: string): void {
  const all = getItem<JournalEntry[]>(KEYS.journal) ?? [];
  const updated = all.map((e) =>
    e.id === id ? { ...e, aiFeedback: feedback } : e
  );
  setItem(KEYS.journal, updated);
}

// ── Custom Vocab ──────────────────────────────────────────────────────────────

export function getCustomVocab(): CustomVocab[] {
  const all = getItem<CustomVocab[]>(KEYS.customVocab) ?? [];
  return [...all].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function addCustomVocab(data: Omit<CustomVocab, "id" | "createdAt">): CustomVocab {
  const all = getItem<CustomVocab[]>(KEYS.customVocab) ?? [];
  const entry: CustomVocab = {
    id: uid(),
    ...data,
    createdAt: new Date().toISOString(),
  };
  all.unshift(entry);
  setItem(KEYS.customVocab, all);
  return entry;
}

export function deleteCustomVocab(id: string): void {
  const all = getItem<CustomVocab[]>(KEYS.customVocab) ?? [];
  setItem(
    KEYS.customVocab,
    all.filter((v) => v.id !== id)
  );
}

// ── Saved Sets ────────────────────────────────────────────────────────────────

export function getSavedSets(): SavedSet[] {
  return getItem<SavedSet[]>(KEYS.savedSets) ?? [];
}

export function saveSet(name: string, keys: string[]): SavedSet {
  const all = getSavedSets();
  const entry: SavedSet = {
    id: uid(),
    name: name.trim() || "Untitled Set",
    keys,
    createdAt: new Date().toISOString(),
  };
  all.unshift(entry);
  setItem(KEYS.savedSets, all);
  return entry;
}

export function deleteSavedSet(id: string): void {
  const all = getSavedSets();
  setItem(KEYS.savedSets, all.filter((s) => s.id !== id));
}

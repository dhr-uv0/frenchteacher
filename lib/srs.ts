/**
 * SM-2 Spaced Repetition Algorithm
 * Based on the SuperMemo SM-2 algorithm.
 * Quality: 0-5 (0-1 = fail, 2 = hard, 3 = ok, 4 = good, 5 = perfect)
 */

export interface SRSCard {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: Date;
}

export function calculateNextReview(
  card: SRSCard,
  quality: number // 0-5
): SRSCard {
  let { easeFactor, interval, repetitions } = card;

  if (quality < 3) {
    // Failed — reset repetitions, short interval
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  // Update ease factor (min 1.3)
  easeFactor = Math.max(
    1.3,
    easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
  );

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return { easeFactor, interval, repetitions, nextReview };
}

export function isDue(card: SRSCard): boolean {
  return new Date() >= new Date(card.nextReview);
}

export function getDaysUntilDue(card: SRSCard): number {
  const now = new Date();
  const due = new Date(card.nextReview);
  const diff = due.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// Map "Got It" / "Again" buttons to quality scores
export const QUALITY_GOT_IT = 4;
export const QUALITY_AGAIN = 1;

export function qualityFromButton(button: "got_it" | "again" | "hard" | "good" | "perfect"): number {
  const map: Record<string, number> = {
    again: 1,
    hard: 2,
    good: 3,
    got_it: 4,
    perfect: 5,
  };
  return map[button] ?? 3;
}

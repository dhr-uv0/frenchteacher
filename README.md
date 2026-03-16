# FrenchMaestro

A mastery-based French 1 learning web application built around the **EntreCultures 1 ©2026** curriculum for Skyline High School, Sammamish WA.

## Features

- **Dashboard** — unit progress bars, daily streak, spaced-repetition study plan, mistake history, Canvas assignment feed
- **Lessons** — all 6 units with vocabulary lists (audio on tricky words), interactive grammar tables, 5 exercise types per unit
- **5 Exercise Types** — fill-in-the-blank, English→French translation (AI-graded), sentence builder word bank, reading comprehension, timed write
- **SRS Flashcards** — SM-2 spaced repetition with French→English and English→French directions
- **Glue Words Module** — connectors, time words, manner words, question words
- **AI Tutor** — Claude AI aware of your current unit and mistake history
- **Writing Practice** — AI-graded writing with line-by-line corrections + immediate rewrite prompt
- **French Journal** — free-write diary with optional AI feedback
- **Quizzes & Tests** — practice quiz, timed test simulation, mistake drill with full recap
- **Quick Reference** — searchable grammar rules, vocabulary, and glue words
- **Canvas LMS Integration** — server-side proxy (token never exposed to client)
- **Custom Vocabulary** — add your own words that flow into flashcards
- **Dark Mode** + **Fully Responsive** — desktop sidebar, mobile bottom nav

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v4 |
| Database | SQLite via Prisma + libsql |
| AI | Anthropic Claude API (claude-sonnet-4-20250514) |
| Hosting | Vercel (auto-deploy on push to main) |

---

## Installation

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/frenchteacher.git
cd frenchteacher
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Required — get from console.anthropic.com
ANTHROPIC_API_KEY=sk-ant-...

# Optional — Canvas LMS integration
CANVAS_API_TOKEN=your_canvas_token_here
CANVAS_BASE_URL=https://skyline.instructure.com
CANVAS_COURSE_ID=your_course_id

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set up the database

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Getting a Canvas API Token

1. Log into Canvas at `https://skyline.instructure.com`
2. Go to **Account → Settings → Approved Integrations → + New Access Token**
3. Copy the token → add to `.env.local` as `CANVAS_API_TOKEN`
4. Course ID: open your French class in Canvas, URL = `.../courses/XXXXXX`

> **Security**: The Canvas token is NEVER sent to the browser. All Canvas calls go through `/api/canvas` server-side.

---

## Getting an Anthropic API Key

1. Sign up at [console.anthropic.com](https://console.anthropic.com)
2. **API Keys → Create Key**
3. Add to `.env.local` as `ANTHROPIC_API_KEY`
4. Model used: `claude-sonnet-4-20250514`

---

## GitHub + Vercel Setup (Auto-Deploy)

### Push to GitHub

```bash
git add .
git commit -m "Initial commit — FrenchMaestro"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/frenchteacher.git
git push -u origin main
```

### Connect to Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo
3. Add environment variables in Vercel dashboard:
   - `ANTHROPIC_API_KEY`, `CANVAS_API_TOKEN`, `CANVAS_BASE_URL`, `CANVAS_COURSE_ID`
4. Deploy

**Every push to `main` automatically deploys to Vercel — no manual steps.**

For GitHub Actions CI/CD (`.github/workflows/deploy.yml`), add these GitHub repository secrets:
- `VERCEL_TOKEN` (Vercel → Account Settings → Tokens)
- `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` (from `.vercel/project.json` after `vercel link`)
- All API keys

---

## Folder Structure

```
frenchteacher/
├── app/
│   ├── api/           # Server-side API routes
│   │   ├── ai/        # Claude AI (grading, tutor)
│   │   ├── canvas/    # Canvas LMS proxy
│   │   ├── flashcards/
│   │   ├── journal/
│   │   ├── mistakes/
│   │   ├── sessions/
│   │   ├── student/
│   │   └── custom-vocab/
│   ├── flashcards/
│   ├── glue/
│   ├── journal/
│   ├── lessons/unit-1 … unit-6/
│   ├── quiz/
│   ├── reference/
│   ├── tutor/
│   └── writing/
├── components/
│   ├── dashboard/
│   ├── flashcard/
│   ├── layout/        # Sidebar, TopBar, BottomNav, ThemeProvider
│   └── lessons/       # VocabSection, GrammarSection, ExerciseSection
├── data/
│   └── curriculum.ts  # All French 1 content — edit here to add vocab/grammar
├── lib/
│   ├── prisma.ts
│   ├── srs.ts         # SM-2 spaced repetition algorithm
│   ├── student.ts
│   └── utils.ts
└── prisma/
    ├── schema.prisma
    └── migrations/
```

---

## Adding New Units or Vocabulary

1. **Vocabulary** → add to `VOCAB_UNITX` array in `data/curriculum.ts`
2. **Grammar rules** → add to `GRAMMAR_RULES` array (include explanation + examples + tables)
3. **Writing prompts** → add to `WRITING_PROMPTS` array
4. **Reading passages** → add to `READING_PASSAGES` array
5. **Exercises** → add to `FILL_BLANK_TEMPLATES` and `WORD_BANK_SENTENCES` in `components/lessons/ExerciseSection.tsx`

No DB migrations needed for curriculum content.

---

## Curriculum Coverage

| Unit | Title | Key Topics |
|---|---|---|
| 1 | Bonjour ! | Greetings, alphabet, 0–30, être, pronouns, nationality/personality adjectives, indefinite articles, la Francophonie |
| 2 | Qu'est-ce que tu aimes ? | -ER verbs, ne...pas, definite articles, questions, 31–100, days, time, hobbies |
| 3 | À l'école | School subjects & opinions, avoir, articles in negation, adjective agreement, frequency adverbs, colors, supplies |
| 4 | Ma famille | Family vocab, possessive adjectives (mon–leurs), age, physical descriptions, beau/vieux/nouveau |
| 5 | Chez moi | House & rooms, prepositions of place, aller + contractions, near future, venir |
| 6 | À table ! | Food & restaurant, partitive articles, vouloir & pouvoir, ordering food, café culture |

---

Built for Skyline High School French 1 — EntreCultures 1 ©2026.

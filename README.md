# AI Architect Studio

> Describe your lifestyle. Watch your home materialize. Explore it in 3D.

An AI-powered three-phase web application: adaptive quiz → cinematic generation → interactive Three.js architectural viewer.

---

## Quick Start

```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

Then edit `.env` with your Mistral API key, and run:

```bash
./scripts/dev.sh
```

Open [http://localhost:3000](http://localhost:3000).

---

## What's in This Package

| File | Purpose |
|------|---------|
| `PRD.md` | Full product requirements — features, data models, API contracts |
| `MASTER_PROMPT.md` | Paste into Claude Code to build the entire app |
| `ARCHITECTURE.md` | System design, component responsibilities, data flow |
| `DECISIONS.md` | Key architectural decisions with rationale |
| `ONBOARDING.md` | Step-by-step guide for first day on codebase |
| `CLAUDE.md` | Persistent rules file for Claude Code sessions |
| `docs/` | User stories, data models, API contracts |
| `tasks/` | 9 chunked build tasks in dependency order |
| `scripts/` | Setup and dev scripts |
| `.env.example` | All required environment variables |
| `.github/workflows/ci.yml` | GitHub Actions CI pipeline |

---

## First Steps

1. Run `./scripts/setup.sh` to bootstrap your environment
2. Copy `.env.example` to `.env` and add your `MISTRAL_API_KEY`
3. Open `MASTER_PROMPT.md` and paste into Claude Code
4. Start with `tasks/TASK_001.md`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript strict |
| 3D Engine | React Three Fiber + Three.js + @react-three/drei |
| Animation | Framer Motion + GSAP |
| State | Zustand |
| Validation | Zod |
| AI | Mistral AI (mistral-small + mistral-large) |
| Styling | Tailwind CSS + CSS custom properties |
| Deploy | Vercel |

---

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-violet-light` | `#C4C3E3` | Cards, borders, grid lines |
| `--color-violet-dark` | `#504E76` | Headers, dark surfaces |
| `--color-beige` | `#FDF8E2` | Light mode background |
| `--color-sage` | `#A3B565` | Success states, cinematic specs |
| `--color-peach` | `#FCDD9D` | Hover states, warm accents |
| `--color-orange` | `#F1642E` | CTAs, high-emphasis elements |
| `--color-accent` | `#1A56DB` | Primary interactive, progress |

Light mode: `--color-beige` bg. Dark mode: `#0E0D14` bg.

---

## Typography

- **Cormorant Garamond** — headings, question text (classical architecture feel)
- **Space Grotesk** — body, UI elements, buttons
- **Space Mono** — specs, labels, blueprint data

---

## Project Structure

```
/ai-architect-studio
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx              ← Quiz phase entry
│   │   ├── viewer/page.tsx       ← 3D viewer page
│   │   └── api/
│   │       ├── quiz/route.ts
│   │       └── architect/route.ts
│   ├── components/
│   │   ├── quiz/                 ← 5 quiz components
│   │   ├── cinematic/            ← 4 animation components
│   │   ├── viewer/               ← 9 3D components
│   │   └── ui/                   ← shared UI primitives
│   ├── hooks/                    ← useQuizAgent, useArchitectAgent, useViewerControls
│   ├── lib/                      ← Mistral client, prompts, schemas, presets
│   ├── store/                    ← 3 Zustand stores
│   ├── types/                    ← TypeScript interfaces
│   └── styles/globals.css
├── docs/
├── tasks/
└── scripts/
```

---

## Environment Variables

```
MISTRAL_API_KEY=           # Required — get from console.mistral.ai
NEXT_PUBLIC_APP_URL=       # http://localhost:3000 in dev
```

---

## Build Tasks (in order)

| Task | Name |
|------|------|
| TASK_001 | Project Scaffold & Design System |
| TASK_002 | Quiz Phase UI Components |
| TASK_003 | Quiz Agent API Integration |
| TASK_004 | Cinematic Loading Animation |
| TASK_005 | Architect Agent API Integration |
| TASK_006 | Three.js 3D Viewer Core |
| TASK_007 | Interactive Viewer Controls |
| TASK_008 | Hover Prompt System |
| TASK_009 | Polish, Responsive & Deploy |

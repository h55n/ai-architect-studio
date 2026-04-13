# CLAUDE.md — AI Architect Studio

## Project
AI Architect Studio — a 3-phase web app: adaptive AI quiz → cinematic loading → interactive Three.js 3D architectural viewer.

## Stack (LOCKED)
- Next.js 14 (App Router) + TypeScript strict
- React Three Fiber + Three.js + @react-three/drei
- Framer Motion (UI transitions) + GSAP (cinematic)
- Zustand (state) + Zod (validation)
- Mistral AI SDK (quiz: mistral-small-latest, architect: mistral-large-latest)
- Tailwind CSS + CSS custom properties
- Vercel (deploy)

## Color Tokens (always use these, never hardcode hex in components)
```css
--color-violet-light: #C4C3E3
--color-violet-dark:  #504E76
--color-beige:        #FDF8E2
--color-sage:         #A3B565
--color-peach:        #FCDD9D
--color-orange:       #F1642E
--color-accent:       #1A56DB
```
Light mode bg: --color-beige | Dark mode bg: #0E0D14

## Typography
- Cormorant Garamond → headings
- Space Grotesk → body/UI
- Space Mono → specs/blueprint data

## Key Decisions (do not re-discuss)
1. No auth in v1 — decided by product owner
2. No database — all design state in Zustand + localStorage
3. Mistral AI (not OpenAI/Gemini) — product owner's choice
4. React Three Fiber over vanilla Three.js — React-idiomatic, Drei helpers save significant boilerplate
5. Zod validation with 3x retry on Architect Agent output — AI JSON can be malformed
6. GSAP for cinematic (not Framer Motion) — GSAP timeline API is better for multi-step choreography

## Conventions
- Components: PascalCase filenames, named exports
- Hooks: camelCase, prefixed with `use`
- Types: co-located in /types, no inline type definitions in components
- API routes: always return typed JSON, always handle errors
- Stores: one concern per store file (quiz / design / viewer)
- Colors: always via CSS custom property → Tailwind token, never raw hex
- Three.js: always useMemo for geometry, never create inside render

## Architecture Rules
- All Mistral calls go through /api routes — never call Mistral directly from client components
- DesignSpec is the single source of truth — everything in the viewer derives from it
- viewerStore flags drive all interactive control states (exploded, xray, materialPreset, viewMode)
- Zod schemas in /lib/designSchema.ts — import everywhere, validate before use

## What's Done
(Update this each session)
- [ ] Phase 1 — Foundation & Design System
- [ ] Phase 2 — Quiz Phase
- [ ] Phase 3 — Cinematic Loading
- [ ] Phase 4 — Architect Agent
- [ ] Phase 5 — 3D Viewer Core
- [ ] Phase 6 — Interactive Controls
- [ ] Phase 7 — Hover Prompt System
- [ ] Phase 8 — Polish & Deploy

## What's Next
Start with TASK_001 — Project Scaffold. Run: `npx create-next-app@latest ai-architect-studio --typescript --tailwind --app --src-dir --no-eslint`

## Critical Reminders
- npm run build must pass before ending any session
- Always re-read /src/types and /lib/designSchema.ts at the start of each new session
- The DesignSpec JSON schema is the contract between the Architect Agent API and the Three.js renderer — never change it without updating both sides

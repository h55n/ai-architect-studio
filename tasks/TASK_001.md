# TASK_001 — Project Scaffold & Design System

**Phase:** Foundation
**Estimated time:** 30 min
**Depends on:** Nothing

---

## Objective
A working Next.js 14 project with all dependencies installed, design tokens configured, fonts loaded, Zustand stores initialized, and Zod schemas defined. `npm run dev` starts without errors.

---

## Files to Create/Modify

| Action | File Path | Description |
|--------|-----------|-------------|
| CREATE | package.json | All deps pre-configured |
| CREATE | .env.example | All required env vars |
| CREATE | src/styles/globals.css | CSS custom properties + font imports |
| CREATE | tailwind.config.ts | Custom color tokens |
| CREATE | src/app/layout.tsx | Root layout with font injection + theme provider |
| CREATE | src/app/page.tsx | Placeholder home page |
| CREATE | src/store/quizStore.ts | Zustand quiz store (typed shell) |
| CREATE | src/store/designStore.ts | Zustand design store (typed shell) |
| CREATE | src/store/viewerStore.ts | Zustand viewer store (typed shell) |
| CREATE | src/types/quiz.types.ts | UserProfile + Question interfaces |
| CREATE | src/types/design.types.ts | DesignSpec, Floor, Room3D, FurnitureItem interfaces |
| CREATE | src/types/viewer.types.ts | ViewMode, MaterialPreset, ViewerState interfaces |
| CREATE | src/lib/designSchema.ts | Zod DesignSpec schema |
| CREATE | src/lib/profileSchema.ts | Zod UserProfile schema |
| CREATE | src/components/ui/ThemeToggle.tsx | System pref + manual toggle |

## Files NOT to Touch
None — this is greenfield.

---

## Implementation Steps

1. Run: `npx create-next-app@latest ai-architect-studio --typescript --tailwind --app --src-dir --no-eslint`
2. Install deps: `npm install @react-three/fiber @react-three/drei three @types/three framer-motion gsap @gsap/react zustand zod @mistralai/mistralai`
3. Create globals.css with all 7 CSS custom properties (--color-violet-light through --color-accent)
4. Add Google Fonts via next/font/google: Cormorant_Garamond, Space_Grotesk, Space_Mono
5. Configure tailwind.config.ts to map CSS vars to Tailwind color tokens
6. Write all TypeScript interfaces in /types before any store code
7. Write Zod schemas that mirror the TypeScript interfaces
8. Initialize 3 Zustand stores with correct typed state + actions

---

## Prompt for AI Agent

```
Initialize AI Architect Studio — a Next.js 14 project with App Router.

Run: npx create-next-app@latest ai-architect-studio --typescript --tailwind --app --src-dir --no-eslint

Then install:
npm install @react-three/fiber @react-three/drei three @types/three framer-motion gsap @gsap/react zustand zod @mistralai/mistralai

Set up globals.css with these exact CSS custom properties:
--color-violet-light: #C4C3E3
--color-violet-dark: #504E76
--color-beige: #FDF8E2
--color-sage: #A3B565
--color-peach: #FCDD9D
--color-orange: #F1642E
--color-accent: #1A56DB

Light mode body background: var(--color-beige). Dark mode body background: #0E0D14.

Load these Google Fonts via next/font/google:
- Cormorant Garamond (weights 400, 600) → headings
- Space Grotesk (weights 400, 500, 600) → body/UI
- Space Mono (weight 400) → specs/data

Configure tailwind.config.ts to expose the CSS vars as Tailwind color tokens.

Create TypeScript interfaces in /src/types matching the DesignSpec, UserProfile, and ViewerState structures from the PRD data models.

Create Zod schemas in /src/lib/designSchema.ts and profileSchema.ts that mirror those interfaces.

Create 3 Zustand stores in /src/store/ — quizStore, designStore, viewerStore — as typed shells with initial state only.

MUST: No `any` types anywhere. All Zod schemas must match TypeScript interfaces exactly.
NEVER: Do not write component logic in this task. Foundation only.

Done when:
- [ ] npm run dev starts at localhost:3000 without errors
- [ ] npm run build succeeds with 0 TypeScript errors
- [ ] All 3 Zustand stores importable without errors
- [ ] Zod schemas validate correctly (test with a sample object)
```

---

## Done Criteria
- [ ] `npm run dev` runs clean
- [ ] `npm run build` passes with 0 errors
- [ ] globals.css has all 7 color tokens
- [ ] All 3 Zustand stores importable
- [ ] /types and /lib/designSchema.ts fully typed
- [ ] .env.example exists with MISTRAL_API_KEY and NEXT_PUBLIC_APP_URL

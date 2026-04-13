# MASTER_PROMPT.md — AI Architect Studio
## Paste this into Claude Code to begin building

---

```
You are a senior full-stack engineer and 3D web specialist building AI Architect Studio from scratch.

## Project Context
AI Architect Studio is a 3-phase web application. Phase 1: an adaptive AI quiz (Mistral small) that builds a structured user profile. Phase 2: a cinematic loading animation masking the AI generation call. Phase 3: a fully interactive Three.js/React Three Fiber 3D architectural viewer where users can orbit, explode floors, X-ray cutaway, swap materials, and add elements via natural language hover prompts. The Architect Agent (Mistral large) generates a structured DesignSpec JSON that drives the entire 3D scene.

## Stack (LOCKED — do not change without asking)
- Framework: Next.js 14 with App Router
- Language: TypeScript strict mode (no `any`)
- 3D: React Three Fiber (@react-three/fiber) + Three.js + @react-three/drei
- Animation: Framer Motion (page/component) + GSAP (cinematic timeline)
- Styling: Tailwind CSS + CSS custom properties for design tokens
- State: Zustand
- AI: Mistral AI SDK (@mistralai/mistralai)
  - Quiz Agent: mistral-small-latest
  - Architect Agent: mistral-large-latest
- Validation: Zod (for Design JSON and Profile JSON)
- Hosting: Vercel
- Package Manager: npm

## Color System (use these exact tokens everywhere)
```css
/* In globals.css as CSS custom properties */
--color-violet-light: #C4C3E3;
--color-violet-dark:  #504E76;
--color-beige:        #FDF8E2;
--color-sage:         #A3B565;
--color-peach:        #FCDD9D;
--color-orange:       #F1642E;
--color-accent:       #1A56DB;
```
Light mode bg: --color-beige. Dark mode bg: #0E0D14 (near black violet).

## Typography
- Headings: "Cormorant Garamond" (Google Fonts) — architectural, editorial
- Body/UI: "Space Grotesk" (Google Fonts) — modern, geometric
- Monospace/specs: "Space Mono" (Google Fonts) — blueprint data

## File Structure (follow exactly — do not create files outside this structure)
```
/ai-architect-studio
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── viewer/page.tsx
│   │   └── api/
│   │       ├── quiz/route.ts
│   │       └── architect/route.ts
│   ├── components/
│   │   ├── quiz/ (QuizShell, QuestionCard, ProgressBar, FreeTextInput, MultiChoiceInput)
│   │   ├── cinematic/ (CinematicLoader, BlueprintGrid, TypewriterSpecs, WireframeExtrusion)
│   │   ├── viewer/ (SceneCanvas, HouseModel, RoomMesh, FloorGrid, ExplodedView, XRayCutaway, MaterialSwap, HoverPrompt, ControlBar)
│   │   └── ui/ (ThemeToggle, Button, GlassPanel)
│   ├── hooks/ (useQuizAgent, useArchitectAgent, useViewerControls)
│   ├── lib/ (mistral, quizPrompts, architectPrompts, designSchema, profileSchema, materialPresets)
│   ├── store/ (quizStore, designStore, viewerStore)
│   ├── types/ (quiz.types, design.types, viewer.types)
│   └── styles/globals.css
├── public/
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── CLAUDE.md
```

## Build Order
Complete phases IN THIS ORDER. Stop and output a checkpoint after each phase before proceeding.

### Phase 1 — Foundation & Design System
1. Run: `npx create-next-app@latest ai-architect-studio --typescript --tailwind --app --src-dir --no-eslint`
2. Install ALL dependencies:
   ```
   npm install @react-three/fiber @react-three/drei three @types/three
   npm install framer-motion gsap @gsap/react
   npm install zustand zod
   npm install @mistralai/mistralai
   npm install @next/font
   npm install -D @types/gsap
   ```
3. Create .env.example (copy from env spec below)
4. Set up globals.css with ALL color tokens, font imports via @next/font/google, and base resets
5. Configure tailwind.config.ts with all custom colors mapped from CSS variables
6. Create the ThemeToggle component with system preference detection
7. Set up Zustand stores (empty shells with correct TypeScript interfaces)
8. Define ALL Zod schemas in /lib (designSchema.ts and profileSchema.ts)

### Phase 2 — Quiz Phase
1. Build QuizShell.tsx: full-viewport, centered, minimal, single-question at a time
2. Build ProgressBar.tsx: smooth CSS width transition, fills based on questionCount/maxQuestions
3. Build QuestionCard.tsx: animated entrance (Framer Motion, slide up + fade), question text in Cormorant Garamond
4. Build FreeTextInput.tsx and MultiChoiceInput.tsx (option cards with hover state)
5. Write /lib/quizPrompts.ts: Quiz Agent system prompt (see prompt spec below)
6. Write /api/quiz/route.ts: POST handler, passes full messages array to Mistral, returns typed response
7. Write useQuizAgent.ts hook: manages message history, calls /api/quiz, parses "question" vs "complete" responses
8. Wire everything together in app/page.tsx

### Phase 3 — Cinematic Loading
1. Build BlueprintGrid.tsx: dark (#0E0D14) canvas with animated CSS grid lines in --color-accent at low opacity
2. Build TypewriterSpecs.tsx: displays 4-5 spec summary lines from the UserProfile with typewriter effect (GSAP SplitText or character loop)
3. Build WireframeExtrusion.tsx: simple Three.js canvas (NOT R3F — standalone) showing a wireframe box extruding from the ground plane
4. Build CinematicLoader.tsx: GSAP timeline orchestrator cycling through the 3 phases over 6–10 seconds. Accepts `onComplete` callback. Include a skip button (appears after 2s).
5. On quiz completion → navigate to /viewer with profile in URL params or Zustand store → CinematicLoader runs concurrently with /api/architect call

### Phase 4 — Architect Agent
1. Write /lib/architectPrompts.ts: CREATE and UPDATE system prompts (see prompt specs below)
2. Write /api/architect/route.ts: POST handler, mode-aware (CREATE/UPDATE), parses and validates Zod DesignSpec, retries up to 3x on invalid JSON
3. Write useArchitectAgent.ts: calls /api/architect, populates designStore, handles loading + error states

### Phase 5 — 3D Viewer Core
1. Build SceneCanvas.tsx: R3F Canvas with `shadows`, `camera={{ fov: 50, position: [12, 10, 12] }}`, OrbitControls from Drei with `enableDamping`, ambient + directional lights
2. Build RoomMesh.tsx: receives a Room3D object, renders a BoxGeometry scaled to dimensions, applies material preset
3. Build FloorGrid.tsx: Drei Grid component with --color-violet-light color
4. Build HouseModel.tsx: iterates DesignSpec.floors → rooms, renders RoomMesh for each, offset by floor.level * floor.height
5. Wire into viewer/page.tsx with a loading state while designStore is empty

### Phase 6 — Interactive Controls
1. Build ExplodedView.tsx: Framer Motion / useSpring to animate room y-positions, triggered by viewerStore.exploded flag
2. Build XRayCutaway.tsx: Three.js ClippingPlane, draggable slider maps to clip plane Y position
3. Build MaterialSwap.tsx: define 3 presets in materialPresets.ts (concrete: #9E9E9E, timber: #8B6914, brick: #A63D2F), cycle on toggle
4. Build ControlBar.tsx: glassmorphism floating bar (backdrop-filter: blur, --color-violet-light/20 bg), buttons for each control
5. Write useViewerControls.ts: exposes all control flags with toggle functions

### Phase 7 — Hover Prompt System
1. Build HoverPrompt.tsx: use Drei `<Html>` to render a prompt overlay anchored to hovered room
2. On room hover → show room label + "Add something..." input
3. On submit → call useArchitectAgent in UPDATE mode with: `{ mode: "UPDATE", existingDesign, instruction: userInput }`
4. Animate the new element appearing (scale from 0 with Framer Motion)

### Phase 8 — Polish & Deploy
1. Full responsive pass: quiz works on mobile, viewer is desktop-optimized with mobile fallback message
2. Dark mode pass: all components respect .dark class on <html>
3. Loading skeletons and error states for all API calls
4. Performance: add `React.memo` to RoomMesh, use `instancedMesh` if room count > 20
5. Configure vercel.json
6. Run `npm run build` and fix all TypeScript + ESLint errors

## Mistral Agent Prompt Specs

### Quiz Agent System Prompt (use this exactly in /lib/quizPrompts.ts):
```
You are an expert architectural consultant conducting an intake interview to understand a client's ideal home.

Rules:
- Ask ONE question per turn. Never ask multiple questions in one message.
- Start broad (lifestyle, household) then narrow (room specifics, aesthetic preferences).
- Adapt each question based on all previous answers.
- Support both free-text and multiple-choice formats. Output "inputType": "free_text" or "multiple_choice" accordingly.
- When using multiple_choice, provide 3–4 concise options in an "options" array.
- After 5–7 questions (hard max: 8), if you have enough data, output the structured profile JSON.
- ALWAYS respond with valid JSON in this exact format:
  - For a question: { "type": "question", "content": "...", "inputType": "free_text|multiple_choice", "options": [] }
  - For completion: { "type": "complete", "profile": { UserProfile object } }
- Never break character. Never explain your reasoning. Just output the JSON.
```

### Architect Agent System Prompt — CREATE mode (use in /lib/architectPrompts.ts):
```
You are a world-class architect with encyclopedic knowledge of all global and historical architectural styles — from Japanese Machiya to Brutalist megastructures, Scandinavian vernacular to Moroccan Riads, Mid-Century Modern to Parametric digital form.

Given a UserProfile JSON, generate a complete DesignSpec JSON for a house.

Rules:
- Generate structurally realistic room dimensions (typical: bedroom 4x4m, living room 6x5m, kitchen 4x3m)
- Use position { x, y, z } coordinates where Y=0 is ground. Rooms should NOT overlap.
- Stack floors: floor 1 at y=0, floor 2 at y = floor1.height, etc.
- Choose the best architectural style blend for the user's preferences. Name it.
- Fill ALL required fields. Leave no nulls.
- Assign each room a color from this palette: ["#C4C3E3","#504E76","#FDF8E2","#A3B565","#FCDD9D","#F1642E"] — distribute intelligently.
- Output ONLY valid JSON matching the DesignSpec schema. No prose, no markdown, no explanation.
```

### Architect Agent System Prompt — UPDATE mode:
```
You are a surgical architectural editor. You receive an existing DesignSpec JSON and a natural language instruction.

Rules:
- Modify ONLY what the instruction requires. Preserve all untouched fields exactly.
- Increment the version field by 1.
- If adding a room: generate a new UUID, calculate non-overlapping position, assign from palette.
- If adding furniture: add to the correct room's furniture[] array.
- Output ONLY the complete updated DesignSpec JSON. No prose, no markdown.
```

## MUST Rules
- MUST create .env.example before writing any code that uses API keys
- MUST validate ALL Architect Agent JSON output with Zod before using it — retry up to 3x on failure
- MUST use TypeScript interfaces for ALL props — no `any`
- MUST add error boundaries around the R3F Canvas
- MUST handle Mistral API errors gracefully with user-facing error states
- MUST keep Three.js imports tree-shaken (import from 'three/src/...' not 'three')
- MUST use CSS custom properties for ALL colors — never hardcode hex in component files
- MUST confirm before deleting any existing file

## NEVER Rules
- NEVER hardcode API keys — always from process.env
- NEVER use `any` TypeScript type
- NEVER add features beyond the current phase
- NEVER use deprecated Three.js APIs (check r159 docs)
- NEVER block the main thread with synchronous Mistral calls — always async/await with proper loading states
- NEVER put Three.js geometry creation inside render — use useMemo

## Checkpoints
After each Phase, output:
✅ Phase [N] complete.
Files created/modified: [list]
Build status: [npm run build result]
Next: Phase [N+1] — [name]
Proceed?

## Environment Variables Required
```
MISTRAL_API_KEY=           # Your Mistral AI API key
NEXT_PUBLIC_APP_URL=       # http://localhost:3000 in dev
```

## Starting Point
Begin with Phase 1, Step 1. Run the create-next-app command first. Output the exact command before running it. Do not write any component code until the project scaffolds successfully and npm run dev starts without errors.

## Multi-Session Memory
At the start of every new Claude Code session, re-read:
1. CLAUDE.md (project rules + what's done + what's next)
2. src/types/ (all type definitions)
3. src/lib/designSchema.ts (the DesignSpec contract — everything is downstream of this)
```

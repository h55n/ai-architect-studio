# Onboarding — AI Architect Studio

First time on this codebase? Read this before touching any code.

---

## What This App Does (30-second version)

User lands → answers 5–8 AI-generated questions about their lifestyle → watches a cinematic animation while their house design is generated → explores a fully interactive Three.js 3D model of their custom home. They can orbit, explode floors, X-ray cutaway, swap materials, and add furniture/rooms by hovering and typing in plain language.

---

## Mental Model: The 3 Phases

```
Phase 1 — QUIZ          Phase 2 — CINEMATIC        Phase 3 — VIEWER
/app/page.tsx      →    CinematicLoader.tsx    →    /app/viewer/page.tsx
QuizShell              (GSAP timeline, 6-10s)        SceneCanvas
useQuizAgent           BlueprintGrid                 HouseModel
/api/quiz              TypewriterSpecs               /api/architect
Mistral small          WireframeExtrusion            Mistral large
quizStore         →    designStore (filling)    →    designStore + viewerStore
```

The **DesignSpec JSON** is the spine of the whole app. Everything in Phase 3 is driven by it. Read `src/lib/designSchema.ts` before touching any viewer code.

---

## First Day Steps

### 1. Prerequisites
```bash
node -v    # must be >= 18.17.0
npm -v     # must be >= 9.0.0
```

### 2. Install & Run
```bash
chmod +x scripts/setup.sh
./scripts/setup.sh

# Edit .env with your Mistral API key:
# MISTRAL_API_KEY=your_key_here
# Get yours at: https://console.mistral.ai

./scripts/dev.sh
# Opens at http://localhost:3000
```

### 3. Understand the Stores
Open these 3 files first — they define all app state:
- `src/store/quizStore.ts` — quiz message history, UserProfile, completion flag
- `src/store/designStore.ts` — DesignSpec (the house), loading state, history
- `src/store/viewerStore.ts` — exploded, xrayLevel, materialPreset, viewMode

### 4. Understand the Contract
`src/lib/designSchema.ts` — The Zod schema for DesignSpec. This is the contract between the Architect Agent API and the Three.js renderer. If you change it, you must update both the AI prompts AND the renderer.

### 5. Understand the AI Routes
- `src/app/api/quiz/route.ts` — POST only, calls Mistral small, returns question or profile
- `src/app/api/architect/route.ts` — POST only, calls Mistral large, returns DesignSpec. Has 3x retry with Zod validation.

---

## Key Files to Read (in order)

1. `CLAUDE.md` — project rules (re-read every Claude Code session)
2. `src/types/design.types.ts` — DesignSpec, Floor, Room3D, FurnitureItem
3. `src/lib/designSchema.ts` — Zod DesignSpec schema
4. `src/lib/architectPrompts.ts` — CREATE and UPDATE prompts (understand what the AI is asked to do)
5. `src/components/viewer/HouseModel.tsx` — how DesignSpec becomes 3D geometry

---

## Common Mistakes to Avoid

**"The 3D viewer is blank"**
→ Check if `designStore.design` is null. The viewer requires a DesignSpec. Run through the quiz first, or seed a mock DesignSpec in the store for development.

**"The AI keeps returning invalid JSON"**
→ Check the Mistral temperature setting in `/api/architect/route.ts`. Should be 0.3 for CREATE, 0.1 for UPDATE. Also check if the system prompt accidentally has markdown in it — strip all backticks from prompts.

**"Three.js geometry isn't updating after design update"**
→ You probably mutated the store state directly instead of calling `setDesign()`. Zustand requires immutable updates. Use spread or immer.

**"Room positions are overlapping in 3D"**
→ The Architect Agent didn't generate non-overlapping positions. Add a post-processing validation step in `useArchitectAgent.ts` that checks for bounding box overlaps and adjusts if found.

**"GSAP timeline is playing twice"**
→ React StrictMode mounts components twice in dev. Wrap the GSAP timeline initialization in a ref check: `if (timelineRef.current) return;`

---

## Development Workflow

```bash
# Start dev server
npm run dev

# Type check (run before every commit)
npm run type-check

# Build (must pass before any PR)
npm run build

# Lint
npm run lint
```

---

## Getting a Test Design Without Running the Quiz

For development, seed designStore directly in `viewer/page.tsx`:
```typescript
// DEV ONLY — remove before production
import { sampleDesign } from '@/lib/sampleDesign';
useEffect(() => {
  if (process.env.NODE_ENV === 'development') {
    designStore.setDesign(sampleDesign);
  }
}, []);
```

Create `src/lib/sampleDesign.ts` with a valid DesignSpec object matching the schema (use the sample JSON in `docs/DATA_MODELS.md`).

---

## Deploy

```bash
# Verify build passes
npm run build

# Push to GitHub — CI runs automatically
# Deploy to Vercel:
# 1. Connect repo at vercel.com
# 2. Add MISTRAL_API_KEY to Vercel environment variables
# 3. Push main branch → auto-deploys
```

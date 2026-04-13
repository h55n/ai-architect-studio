# Architecture — AI Architect Studio

## System Overview

```
[User Browser]
       │
       ▼
[Next.js 14 App Router]
       │
  ┌────┴────────────────────────────────┐
  │                                     │
  ▼                                     ▼
[Phase 1 — Quiz]              [Phase 3 — 3D Viewer]
[/app/page.tsx]               [/app/viewer/page.tsx]
  │                                     │
  │ POST /api/quiz                       │ POST /api/architect (on load)
  ▼                                     │ POST /api/architect (on hover update)
[Mistral small]                         ▼
[Quiz Agent]                  [Mistral large]
  │                           [Architect Agent]
  │ → UserProfile JSON               │
  │                                  │ → DesignSpec JSON
  ▼                                  ▼
[Zustand quizStore]          [Zustand designStore]
       │                             │
       ▼                             ▼
[Phase 2 — Cinematic]     [React Three Fiber Canvas]
[CinematicLoader.tsx]     [HouseModel.tsx → RoomMesh.tsx]
[GSAP timeline]           [ExplodedView / XRay / Materials]
```

## Component Responsibilities

### Quiz Phase (`/components/quiz/`)
Handles the full-screen conversational intake. Manages its own local display state (current question, input value) but delegates all AI state to `useQuizAgent` hook and global `quizStore`. Does NOT know about the Architect Agent.

### Cinematic Phase (`/components/cinematic/`)
A pure visual layer. Receives `onComplete` callback and `userProfile` (for typewriter spec display). Runs a GSAP timeline across three sub-components: BlueprintGrid → TypewriterSpecs → WireframeExtrusion. Concurrently, the parent page triggers the Architect Agent call. Cinematic completes first in most cases (6–10s vs. ~5–8s API latency).

### 3D Viewer (`/components/viewer/`)
The core experience. SceneCanvas owns the R3F canvas. HouseModel reads from `designStore` and renders Room3D objects as BoxGeometry meshes. All interactive controls (explode, X-ray, material, 2D/3D) are flags in `viewerStore`. ControlBar writes these flags; the viewer components read them.

### API Layer (`/app/api/`)
Thin Next.js Route Handlers. Their only jobs: validate input, call Mistral, validate output with Zod, return typed JSON. All error handling (retries, fallbacks) lives here — never in the client.

### Stores (`/store/`)
Three Zustand stores with strict separation:
- `quizStore`: message history, current question, completion status, UserProfile
- `designStore`: DesignSpec (current + history for undo), loading/error state
- `viewerStore`: exploded (bool), xrayLevel (0–1), materialPreset (string), viewMode ("3d" | "2d")

## Data Flow

### Quiz Flow
1. User lands on `/` → QuizShell renders with empty state
2. useQuizAgent sends initial empty message to `/api/quiz`
3. Quiz Agent returns first question → stored in quizStore
4. User answers → appended to message history → next API call
5. After 5–8 questions → Quiz Agent returns `{ type: "complete", profile: {...} }`
6. quizStore.profile populated → CinematicLoader triggered → concurrent Architect Agent call

### Generation Flow
1. CinematicLoader starts GSAP timeline (6–10s)
2. Simultaneously: `/api/architect` called with UserProfile in CREATE mode
3. Architect Agent returns DesignSpec JSON → Zod validated → stored in designStore
4. When BOTH animation complete AND designStore.design is populated → navigate to `/viewer`
5. (If API returns before animation: wait. If animation ends first: navigate immediately with design.)

### Viewer Interaction Flow
1. User hovers Room3D mesh → HoverPrompt overlay appears (Drei `<Html>`)
2. User types instruction (e.g., "Add a king bed") → submits
3. useArchitectAgent called in UPDATE mode with existing design + instruction
4. Architect Agent returns updated DesignSpec → Zod validated
5. designStore updated → HouseModel re-renders with new geometry
6. New element appears with scale-in Framer Motion animation

## Key Decisions & Rationale

| Decision | Chosen | Alternatives Considered | Why |
|----------|--------|------------------------|-----|
| 3D library | React Three Fiber | Vanilla Three.js, Babylon.js | R3F is React-idiomatic, Drei provides orbit controls, HTML overlays, and helpers that save 500+ lines |
| State management | Zustand | Redux, Jotai, Context | Minimal boilerplate, perfect for 3 isolated stores, no provider hell |
| AI provider | Mistral | Gemini, OpenAI | User's explicit choice; Mistral large is strong at structured JSON generation |
| Animation | Framer Motion + GSAP | CSS only, Anime.js | Framer Motion for React component animations; GSAP for the cinematic multi-step timeline (GSAP timeline API is unmatched) |
| Validation | Zod | io-ts, yup | TypeScript-first, great error messages, works isomorphically in Next.js API routes and client |
| No auth | None in v1 | Clerk, NextAuth | Product decision — auth deferred |
| Design JSON in localStorage | Yes | Backend DB | No backend in v1; localStorage gives session persistence across refreshes |

## Scalability Notes
- At 10x users: the bottleneck is Mistral API rate limits. Add a queue (Redis + Bull) in front of `/api/architect`
- DesignSpec with > 50 rooms: switch RoomMesh to `InstancedMesh` for GPU instancing (add to TASK_008 as a conditional)
- If adding auth later: introduce a `userId` field to DesignSpec immediately — do not wait
- The Three.js scene is entirely client-side; no 3D server-side rendering needed

## Security Considerations
- `MISTRAL_API_KEY` is server-only, never exposed to client (only used in API routes)
- Input validation: all `/api/quiz` and `/api/architect` inputs are Zod-validated before being sent to Mistral
- Prompt injection: the agent system prompts enforce JSON-only output; malformed responses are caught by Zod
- No user data stored server-side; all data is session-local

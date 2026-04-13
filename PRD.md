# Product Requirements Document
**Project:** AI Architect Studio
**Version:** v1.0 — MVP
**Author:** Builder Skill (Claude) — made by hssn
**Date:** 2025-04-12
**Status:** Draft

---

## Executive Summary

AI Architect Studio is a three-phase web application that transforms a conversational AI questionnaire into a fully interactive 3D architectural viewer. Users answer 5–8 adaptive questions about their lifestyle and spatial preferences, watch a cinematic generation sequence, and explore a custom-designed house or room in a Three.js environment with orbit, explode, X-ray cutaway, material swap, and natural language prompt-based additions. The product targets design-curious users, students, and home renovators who want a tactile, visual way to explore architectural ideas without CAD expertise.

---

## Problem Statement

**Current State:** People who want to visualize a custom home design must either hire an architect, learn complex CAD software, or settle for generic 2D floor plan tools that offer no spatial sense.

**Desired State:** Anyone can describe their lifestyle in plain language, watch their home design materialize in real time, and navigate a fully interactive 3D model — adding rooms, swapping materials, and refining every detail conversationally.

**Gap:** No existing tool combines a zero-friction AI intake form, cinematic generation feedback, and a professional-grade interactive 3D viewer in a single, cohesive web experience.

---

## Target User Personas

### Persona 1 — Asha, The Curious Home Planner
- **Role/Context:** 28-year-old professional renting an apartment, planning to buy property in 2–3 years.
- **Goals:** Visualize what her ideal home could look like before committing to a purchase or contractor.
- **Pain Points:** Can't read architectural blueprints; online tools require signing up and are overwhelmingly complex.
- **Tech Comfort:** High

### Persona 2 — Dev, The Architecture Student
- **Role/Context:** 2nd-year architecture student exploring spatial concepts and form studies.
- **Goals:** Rapidly prototype and explore different structural styles to inform coursework and portfolio pieces.
- **Pain Points:** Revit and AutoCAD are slow for early ideation; wants instant visual feedback on an idea.
- **Tech Comfort:** High

### Persona 3 — Riya, The Interior Enthusiast
- **Role/Context:** 35-year-old homeowner planning a major renovation.
- **Goals:** Understand how different room layouts and materials will feel before spending money on contractors.
- **Pain Points:** Pinterest boards don't communicate spatial scale; contractor mood boards are flat and unimmersive.
- **Tech Comfort:** Medium

---

## Goals & Success Metrics

| Goal | Metric | Target (90 days) |
|------|--------|-----------------|
| Smooth quiz-to-viewer conversion | % of users who complete quiz and reach 3D viewer | > 70% |
| 3D viewer engagement | Average time in viewer per session | > 4 minutes |
| AI quality | % of Architect Agent outputs that produce valid Three.js render | > 90% |
| Performance | Time to interactive on the 3D viewer after generation | < 5s |
| Perceived magic | Cinematic animation completes before API response (mask loading) | > 85% of sessions |
| Core loop reliability | Quiz Agent JSON profile validity rate | > 95% |

---

## Feature Specification

### MVP Features (v1.0)

| # | Feature | User Story | Priority | Complexity |
|---|---------|-----------|----------|------------|
| F1 | Full-screen adaptive quiz UI | As a user, I want a distraction-free single-question layout so I can focus on each answer without overwhelm | P0 | M |
| F2 | Quiz Agent (Mistral small) | As a user, I want the system to ask me follow-up questions based on my previous answers so the design reflects my actual lifestyle | P0 | L |
| F3 | Structured JSON user profile output | As a system, I need a validated JSON profile from the quiz so the Architect Agent can generate an accurate design | P0 | M |
| F4 | Cinematic loading animation | As a user, I want an engaging animation during generation so the wait feels intentional and exciting | P0 | M |
| F5 | Architect Agent CREATE mode (Mistral large) | As a user, I want the AI to generate a complete, structurally coherent house design from my profile | P0 | L |
| F6 | Three.js 3D house renderer | As a user, I want to see my home rendered as 3D room volumes with materials so I can understand the layout spatially | P0 | L |
| F7 | Orbit / Rotate controls | As a user, I want to rotate and inspect the 3D model freely so I can explore it from any angle | P0 | S |
| F8 | Exploded view | As a user, I want to explode the floors and rooms apart so I can understand the interior layout clearly | P1 | M |
| F9 | X-Ray cutaway | As a user, I want to drag a horizontal slice plane to reveal upper floors' interiors | P1 | M |
| F10 | Material swap | As a user, I want to cycle through material presets (concrete, timber, brick) so I can explore different finishes | P1 | M |
| F11 | 2D/3D toggle | As a user, I want to switch between a top-down floor plan view and full 3D perspective | P1 | S |
| F12 | Hover prompt additions | As a user, I want to hover over a room and type a natural language prompt to add furniture or new rooms instantly | P1 | L |
| F13 | Architect Agent UPDATE mode | As a user, I want the AI to surgically update specific elements of my design without re-generating everything | P1 | M |
| F14 | Individual room explorer | As a user, I want to isolate and enter any single room for a detailed first-person 3D view | P2 | L |
| F15 | Light/Dark mode | As a user, I want a theme toggle so the interface adapts to my environment | P1 | S |
| F16 | Glassmorphism control bar | As a user, I want a floating translucent toolbar with all 3D controls organized neatly | P0 | M |

### Future Features (Post-MVP)

| # | Feature | Rationale |
|---|---------|-----------|
| F-POST-1 | User auth + design saving | Add after v1 validates retention intent |
| F-POST-2 | AR/VR viewer export | High technical complexity, needs proven user base first |
| F-POST-3 | Collaborative design sessions | Multi-user architecture is a major complexity multiplier |
| F-POST-4 | Export to CAD (DXF/IFC) | Niche power user feature; deprioritized for general audience v1 |
| F-POST-5 | Photo-realistic rendering (HDRI, ray tracing) | Performance intensive; WebGPU dependency |
| F-POST-6 | Furniture catalog integration | Requires partnerships/content licensing |
| F-POST-7 | Cost estimation engine | Requires real estate and materials pricing API |

### Explicitly Out of Scope (v1.0)
- User authentication / accounts — decided by user for post-v1
- Payment / billing — no monetization in MVP
- Backend database — all state is session-local (localStorage for design JSON)
- Multi-user / collaboration — single user experience only
- Mobile native app — responsive web first; native later
- Real-time 3D streaming — Three.js WebGL renderer only

---

## Technical Architecture

### Recommended Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | Next.js 14 (App Router) | SSR for SEO, API routes for Mistral proxy, strong ecosystem |
| Language | TypeScript (strict) | Mandatory for complex 3D data models and agent JSON schemas |
| 3D Engine | React Three Fiber + Three.js + @react-three/drei | React-idiomatic Three.js; Drei provides orbit controls, HTML overlays, shader helpers |
| Animation | Framer Motion + GSAP | Framer Motion for page/component transitions; GSAP for the cinematic timeline |
| Styling | Tailwind CSS + CSS custom properties | Utility-first + design token system for palette |
| State | Zustand | Lightweight, no boilerplate; perfect for quiz state, design JSON, viewer flags |
| AI | Mistral AI SDK (`@mistralai/mistralai`) | Quiz: mistral-small-latest; Architect: mistral-large-latest |
| Fonts | Google Fonts (Cormorant Garamond + Space Grotesk + Space Mono) | Architecture-editorial vibe |
| Hosting | Vercel | Zero-config Next.js deployment |
| Dev tooling | ESLint + Prettier + Husky | Consistent code quality |

### System Diagram

```
[User Browser]
      ↓
[Next.js App — React + Three.js Viewer]
      ↓                        ↓
[Phase 1: Quiz UI]    [Phase 3: 3D Viewer]
      ↓                        ↑
[/api/quiz Route]    [/api/architect Route]
      ↓                        ↓
[Mistral AI API]    [Mistral AI API]
(mistral-small)     (mistral-large)
      ↓
[User Profile JSON]
      ↓
[Cinematic Animation (Phase 2)]
      ↓
[Architect Agent → Design JSON]
      ↓
[Three.js Renderer → 3D Scene]
```

### Suggested File Structure

```
/ai-architect-studio
├── src/
│   ├── app/
│   │   ├── layout.tsx                  ← root layout, font injection, theme provider
│   │   ├── page.tsx                    ← landing / quiz entry point
│   │   ├── viewer/
│   │   │   └── page.tsx                ← 3D viewer page
│   │   └── api/
│   │       ├── quiz/route.ts           ← Quiz Agent Mistral proxy
│   │       └── architect/route.ts     ← Architect Agent Mistral proxy
│   ├── components/
│   │   ├── quiz/
│   │   │   ├── QuizShell.tsx           ← full-screen quiz wrapper
│   │   │   ├── QuestionCard.tsx        ← single question display
│   │   │   ├── ProgressBar.tsx         ← smooth fill progress indicator
│   │   │   ├── FreeTextInput.tsx       ← open text answer
│   │   │   └── MultiChoiceInput.tsx    ← option cards
│   │   ├── cinematic/
│   │   │   ├── CinematicLoader.tsx     ← orchestrator
│   │   │   ├── BlueprintGrid.tsx       ← dark grid phase
│   │   │   ├── TypewriterSpecs.tsx     ← scrolling spec summaries
│   │   │   └── WireframeExtrusion.tsx  ← 3D wireframe build-up
│   │   ├── viewer/
│   │   │   ├── SceneCanvas.tsx         ← R3F Canvas wrapper
│   │   │   ├── HouseModel.tsx          ← JSON → 3D geometry renderer
│   │   │   ├── RoomMesh.tsx            ← individual room volume
│   │   │   ├── FloorGrid.tsx           ← ground grid
│   │   │   ├── ExplodedView.tsx        ← explode animation controller
│   │   │   ├── XRayCutaway.tsx         ← clipping plane controller
│   │   │   ├── MaterialSwap.tsx        ← material preset manager
│   │   │   ├── HoverPrompt.tsx         ← hover detection + prompt input
│   │   │   └── ControlBar.tsx          ← glassmorphism floating toolbar
│   │   └── ui/
│   │       ├── ThemeToggle.tsx
│   │       ├── Button.tsx
│   │       └── GlassPanel.tsx
│   ├── hooks/
│   │   ├── useQuizAgent.ts             ← quiz conversation state + API calls
│   │   ├── useArchitectAgent.ts        ← architect CREATE/UPDATE logic
│   │   └── useViewerControls.ts        ← 3D control state flags
│   ├── lib/
│   │   ├── mistral.ts                  ← Mistral client wrapper
│   │   ├── quizPrompts.ts              ← Quiz Agent system prompt
│   │   ├── architectPrompts.ts         ← Architect Agent system prompt (CREATE + UPDATE)
│   │   ├── designSchema.ts             ← Zod schema for Design JSON validation
│   │   ├── profileSchema.ts            ← Zod schema for User Profile JSON validation
│   │   └── materialPresets.ts          ← Three.js material definitions
│   ├── store/
│   │   ├── quizStore.ts                ← quiz state (messages, profile, step)
│   │   ├── designStore.ts              ← design JSON, update history
│   │   └── viewerStore.ts              ← viewer flags (exploded, xray, material, mode)
│   ├── types/
│   │   ├── quiz.types.ts
│   │   ├── design.types.ts
│   │   └── viewer.types.ts
│   └── styles/
│       └── globals.css                 ← CSS custom properties, font imports
├── public/
│   └── fonts/                          ← self-hosted font fallbacks if needed
├── .env.example
├── .env.local                          ← gitignored
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── CLAUDE.md
└── vercel.json
```

---

## Data Models

### UserProfile (output of Quiz Agent)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| lifestyle | string | Yes | Broad lifestyle summary (e.g. "remote worker, minimalist") |
| household | object | Yes | `{ adults: number, children: number, pets: boolean }` |
| budget | string | Yes | Budget tier: "low" / "medium" / "high" / "luxury" |
| style | string[] | Yes | Preferred architectural styles (e.g. ["modernist", "japandi"]) |
| rooms | RoomRequirement[] | Yes | Array of rooms with size/function details |
| priorities | string[] | Yes | Top 3 design priorities (e.g. ["natural light", "open plan", "storage"]) |
| climate | string | No | User's climate zone for material recommendations |
| specialNeeds | string | No | Any special accessibility or functional requirements |

### RoomRequirement

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| type | string | Yes | Room type (e.g. "bedroom", "kitchen", "studio") |
| count | number | Yes | Number of this room type |
| sizeTier | string | Yes | "small" / "medium" / "large" |
| notes | string | No | Free-text details (e.g. "needs en-suite") |

### DesignSpec (output of Architect Agent)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | UUID — stable across UPDATE calls |
| version | number | Yes | Increments on each UPDATE |
| style | string | Yes | Primary architectural style label |
| floors | Floor[] | Yes | Array of floor objects |
| exteriorMaterial | string | Yes | Primary exterior material |
| roofType | string | Yes | e.g. "flat", "gabled", "monopitch" |
| totalArea | number | Yes | Square meters |
| generatedAt | string | Yes | ISO timestamp |

### Floor

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| level | number | Yes | 0 = ground, 1 = first floor, etc. |
| height | number | Yes | Ceiling height in meters |
| rooms | Room3D[] | Yes | Rooms on this floor |

### Room3D

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Stable UUID for UPDATE targeting |
| type | string | Yes | Room function label |
| label | string | Yes | Display label |
| position | `{ x, y, z }` | Yes | World-space origin |
| dimensions | `{ w, h, d }` | Yes | Width, height, depth in meters |
| material | string | Yes | Material preset key |
| color | string | Yes | Hex color from palette |
| connections | string[] | No | IDs of adjacent rooms (doors) |
| furniture | FurnitureItem[] | No | Added via hover prompt |

### FurnitureItem

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | UUID |
| type | string | Yes | e.g. "bed", "sofa", "desk" |
| position | `{ x, y, z }` | Yes | Room-relative position |
| dimensions | `{ w, h, d }` | Yes | Meters |

### Relationships
- DesignSpec has many Floors
- Floor has many Room3D
- Room3D optionally has many FurnitureItems
- Room3D connects to other Room3D via connections[]

---

## API Contracts

### Quiz Agent

#### POST /api/quiz
**Purpose:** Send a user message, receive the next adaptive question or final profile JSON
**Auth required:** No

Request:
```json
{
  "messages": [
    { "role": "user", "content": "I work from home and have two cats" }
  ],
  "questionCount": 2
}
```

Response (200) — next question:
```json
{
  "type": "question",
  "content": "What kind of spaces matter most to you — open communal areas, private retreats, or a mix?",
  "inputType": "multiple_choice",
  "options": ["Open communal", "Private retreats", "Mix of both"]
}
```

Response (200) — final profile:
```json
{
  "type": "complete",
  "profile": { "lifestyle": "...", "household": {}, "rooms": [], "..." : "..." }
}
```

Error Responses: 400 (invalid message format), 429 (Mistral rate limit), 500 (server)

---

### Architect Agent

#### POST /api/architect
**Purpose:** Generate (CREATE) or update (UPDATE) a DesignSpec from a UserProfile or update instructions
**Auth required:** No

Request — CREATE:
```json
{
  "mode": "CREATE",
  "profile": { "lifestyle": "...", "rooms": [] }
}
```

Request — UPDATE:
```json
{
  "mode": "UPDATE",
  "existingDesign": { "id": "...", "floors": [] },
  "instruction": "Add a rooftop terrace above the living room"
}
```

Response (200):
```json
{
  "design": { "id": "...", "version": 1, "floors": [], "style": "modernist" }
}
```

Error Responses: 400 (invalid mode/profile), 422 (agent returned invalid JSON), 500 (server)

---

## Non-Functional Requirements

| Requirement | Spec |
|-------------|------|
| 3D Viewer FPS | >= 60fps on modern desktop hardware |
| API Response Time (Quiz) | < 3s p95 (Mistral small) |
| API Response Time (Architect) | < 8s p95 (Mistral large) |
| Cinematic animation duration | 6–10s (designed to mask API latency) |
| Page Load Time | < 2s TTFB on 4G |
| Three.js bundle size | Tree-shaken; target < 800KB gzipped |
| Mobile Responsive | Viewer is desktop-primary; quiz is fully responsive |
| Accessibility | WCAG 2.1 AA for quiz and control bar |
| Browser Support | Chrome 100+, Firefox 100+, Safari 15+, Edge 100+ |
| Theme | Light and dark mode, respects system preference |

---

## Open Questions

1. **Mistral JSON reliability** — Should we add Zod validation + retry (up to 3x) for Architect Agent output to handle malformed JSON? Owner: Hassan — Deadline: Before TASK_006
2. **Hover prompt scope** — Should hover additions immediately trigger an UPDATE mode Architect Agent call, or use a lightweight heuristic placement system first? Owner: Hassan — Deadline: Before TASK_010
3. **localStorage design persistence** — Should the session design JSON survive a page refresh (localStorage) or be ephemeral (memory only)? Owner: Hassan — Deadline: Before TASK_006
4. **Cinematic skip behavior** — If user skips the animation, do we still wait for the API or navigate immediately once ready? Owner: Hassan — Deadline: Before TASK_005

---

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| v1.0 | 2025-04-12 | Initial draft |

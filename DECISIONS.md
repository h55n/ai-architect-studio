# Decisions — AI Architect Studio

Architectural decisions with context and rationale. Do not re-debate these without a compelling reason.

---

## D-001: React Three Fiber over Vanilla Three.js

**Decision:** Use @react-three/fiber + @react-three/drei
**Alternatives:** Vanilla Three.js, Babylon.js, PlayCanvas
**Rationale:**
- R3F is fully React-idiomatic — components, hooks, refs all work as expected
- Drei provides orbit controls, HTML overlays, Grid, and environment helpers out of the box, saving ~500 lines
- Babylon.js is more powerful for game-grade scenes but has a steeper learning curve and heavier bundle
- Vanilla Three.js would require manual scene graph management alongside React state — a friction-heavy hybrid

---

## D-002: Zustand over Redux/Jotai/Context

**Decision:** 3 separate Zustand stores (quiz, design, viewer)
**Alternatives:** Redux Toolkit, Jotai, React Context
**Rationale:**
- Zustand has zero boilerplate — no providers, no action creators, no reducers
- 3 isolated stores prevent cross-concern coupling: quiz state never bleeds into viewer state
- React Context would require re-renders of the entire component tree on state changes — fatal for 3D performance
- Redux is appropriate at 10x team scale; overkill here

---

## D-003: Mistral AI over Gemini/OpenAI

**Decision:** Mistral AI (mistral-small + mistral-large)
**Alternatives:** Google Gemini 2.5 Flash, OpenAI GPT-4o
**Rationale:** Product owner's explicit choice. Mistral large is competitive on structured JSON generation tasks. mistral-small is fast and cost-efficient for the conversational quiz.

---

## D-004: Two-Model Strategy (small for quiz, large for architect)

**Decision:** mistral-small-latest for Quiz Agent, mistral-large-latest for Architect Agent
**Rationale:**
- Quiz requires natural, adaptive conversation — low latency matters more than raw intelligence
- Architect Agent must generate complex, structurally coherent 3D spatial JSON — needs maximum capability
- Cost optimization: quiz runs 5-8 times per session; architect runs once (+ occasional updates)

---

## D-005: GSAP for Cinematic, Framer Motion for UI

**Decision:** GSAP handles the cinematic timeline; Framer Motion handles all component animations
**Alternatives:** GSAP only, Anime.js, CSS keyframes
**Rationale:**
- GSAP's `timeline()` API is purpose-built for multi-step choreography with precise timing control — unmatched for the 3-phase cinematic sequence
- Framer Motion's `motion.div` and `AnimatePresence` are more ergonomic for component mount/unmount and layout animations
- Using one library for both would compromise either cinematic precision or component ergonomics

---

## D-006: Zod Validation with 3x Retry on Architect Agent Output

**Decision:** Validate DesignSpec with Zod, retry up to 3 times on failure
**Rationale:**
- LLMs can output malformed JSON even with tight prompting — a production app cannot crash on this
- 3 retries cover the vast majority of transient failures without excessive latency
- After 3 failures, return a 422 error with Zod details for debugging
- Validation happens server-side in the API route — client never receives unvalidated data

---

## D-007: No Database in v1

**Decision:** All state in Zustand (session memory) + localStorage (cross-refresh persistence)
**Alternatives:** Supabase, Firebase, PlanetScale/Prisma
**Rationale:**
- Product owner explicitly deferred auth and persistence to post-v1
- A database without auth creates orphaned records with no ownership model
- If persistence is needed between sessions: localStorage for DesignSpec JSON is sufficient until auth is added
- When auth is added: introduce `userId` field on DesignSpec and migrate to Supabase

---

## D-008: No Auth in v1

**Decision:** No authentication system
**Alternatives:** Clerk, NextAuth, Supabase Auth
**Rationale:** Product owner decision. However, all data models include `id` fields (UUIDs) so the schema is auth-ready. When auth is added, simply associate each DesignSpec.id with a userId.

---

## D-009: Low Temperature (0.1–0.3) for Architect Agent

**Decision:** temperature: 0.3 for CREATE, 0.1 for UPDATE
**Rationale:**
- Architecture agent's output is a structural JSON document, not creative prose
- Higher temperature increases JSON malformation risk and structural inconsistencies
- Low temperature = deterministic, schema-compliant output
- Creative variation in the design comes from the diversity of user profiles, not temperature

---

## D-010: Separate WireframeExtrusion Canvas (not R3F)

**Decision:** WireframeExtrusion uses standalone Three.js WebGLRenderer, not React Three Fiber
**Rationale:**
- The cinematic canvas is a short-lived, self-contained visual element that doesn't need React reactivity
- Avoiding nested R3F contexts prevents potential canvas conflicts
- Standalone Three.js gives direct timeline control with GSAP's `gsap.to(mesh.scale, {...})`
- Cleanup on unmount is explicit and guaranteed via `renderer.dispose()`

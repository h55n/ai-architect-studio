# TASK_004 — Cinematic Loading Animation

**Phase:** Feature — Cinematic
**Estimated time:** 45 min
**Depends on:** TASK_003 ✅

---

## Objective
A skippable cinematic sequence (6–10 seconds) runs between quiz completion and the 3D viewer, masking the Architect Agent API call latency. The animation flows: dark blueprint grid → typewriter spec summary → 3D wireframe extrusion.

---

## Files to Create/Modify

| Action | File Path | Description |
|--------|-----------|-------------|
| CREATE | src/components/cinematic/CinematicLoader.tsx | GSAP timeline orchestrator |
| CREATE | src/components/cinematic/BlueprintGrid.tsx | Phase 1: animated dark grid |
| CREATE | src/components/cinematic/TypewriterSpecs.tsx | Phase 2: scrolling spec text |
| CREATE | src/components/cinematic/WireframeExtrusion.tsx | Phase 3: Three.js wireframe |
| MODIFY | src/app/page.tsx | Show cinematic on quiz complete |
| MODIFY | src/app/viewer/page.tsx | Receive design, skip cinematic if already done |

## Files NOT to Touch
All quiz components, all store files.

---

## Prompt for AI Agent

```
Build the Cinematic Loading Animation for AI Architect Studio.

BlueprintGrid.tsx:
- Full viewport, bg #0E0D14
- CSS grid lines: 40px spacing, 1px, var(--color-accent) at 8% opacity
- On mount: GSAP animates grid lines fading in from 0% to 8% opacity over 1.5s
- A scanning horizontal line (2px, var(--color-accent) at 40%) sweeps top to bottom, 3s duration, repeat

TypewriterSpecs.tsx:
- Receives userProfile as prop
- Displays 5 spec lines derived from profile (e.g. "STYLE: Modernist", "FLOORS: 2", "ROOMS: 5", "AREA: ~180sqm", "PALETTE: Earth tones")
- Each line appears character by character using a GSAP character loop (25ms per char delay between lines)
- Font: Space Mono, color var(--color-sage), size 0.85rem
- A blinking cursor (var(--color-accent)) follows the last typed character

WireframeExtrusion.tsx:
- Standalone Three.js canvas (NOT R3F — plain Three.js WebGLRenderer for isolation)
- Scene: a WireframeGeometry wrapping a BoxGeometry (8x1x6) extruding upward (scale Y 0→3 over 2s)
- Then 3 more boxes stack on top, staggered 400ms each
- Camera: slight perspective angle, OrbitControls disabled, slow auto-rotate
- Line color: var(--color-accent) at 70% opacity on dark background

CinematicLoader.tsx:
- Full viewport overlay
- GSAP master timeline:
  t=0.0s: BlueprintGrid fades in
  t=1.5s: TypewriterSpecs starts
  t=4.5s: WireframeExtrusion fades in, begins extruding
  t=7.5s: full fade to black, calls onComplete()
- Props: { onComplete: () => void, userProfile: UserProfile, canSkip?: boolean }
- Skip button: appears after 2s (Framer Motion fade in), bottom-right corner, "Skip →" in Space Mono
- On skip: kill GSAP timeline, immediate fade to black, call onComplete()
- onComplete should only fire once, even if called early via skip

Integrate in app/page.tsx:
- On quiz completion (isComplete = true):
  1. Start Architect Agent call (/api/architect) concurrently
  2. Render CinematicLoader with onComplete handler
  3. onComplete: check if designStore.design is ready. If yes → navigate to /viewer. If no → wait for it, then navigate.

MUST: GSAP cleanup on unmount (timeline.kill()). Three.js renderer cleanup on unmount (renderer.dispose()).
NEVER: Do not import R3F into WireframeExtrusion — use standalone Three.js.

Done when:
- [ ] Cinematic plays all 3 phases in correct order
- [ ] Skip button appears after 2s and works correctly
- [ ] GSAP timeline disposes correctly on unmount (no memory leaks)
- [ ] Three.js canvas disposes correctly
- [ ] onComplete fires exactly once
```

---

## Done Criteria
- [ ] Full cinematic plays in correct sequence
- [ ] Typewriter effect shows real profile data
- [ ] Wireframe extrudes correctly in Three.js
- [ ] Skip button functional
- [ ] No GSAP/Three.js memory leak warnings in console

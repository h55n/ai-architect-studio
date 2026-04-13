# TASK_008 — Hover Prompt System

**Phase:** Feature — AI Interaction
**Estimated time:** 45 min
**Depends on:** TASK_007 ✅

---

## Objective
Users can hover over any room, see a prompt overlay anchored to that room, type a natural language instruction (e.g. "add a king bed", "expand this room"), submit it, and see the design update in real time via the Architect Agent UPDATE mode.

---

## Files to Create/Modify

| Action | File Path | Description |
|--------|-----------|-------------|
| CREATE | src/components/viewer/HoverPrompt.tsx | Hover overlay with prompt input |
| MODIFY | src/components/viewer/RoomMesh.tsx | Add onHover/onUnhover callbacks |
| MODIFY | src/components/viewer/HouseModel.tsx | Manage hover state, pass to HoverPrompt |
| MODIFY | src/hooks/useArchitectAgent.ts | Add update() method (already planned) |

## Files NOT to Touch
All quiz, cinematic, API route files, ControlBar.

---

## Prompt for AI Agent

```
Build the Hover Prompt System for AI Architect Studio.

HoverPrompt.tsx:
- Uses Drei <Html> to anchor overlay to room position
- Props: { room: Room3D, onSubmit: (instruction: string) => void, isUpdating: boolean, onClose: () => void }
- Renders at room.position + (0, room.dimensions.h + 0.5, 0) — above the room
- Content:
  - Room type label: Space Mono, 10px, var(--color-peach)
  - Text input: "Add something to this room..." placeholder
  - Submit button: "Add →" or shows spinner when isUpdating
  - Close button: "×" top-right
- Entrance: scale from 0.8 to 1 + fade in (Framer Motion, 200ms)
- Always faces camera (use Drei <Billboard> or Html distanceFactor)
- Glassmorphism style: same as ControlBar (blur + violet-dark/25 bg)
- Keyboard: Enter to submit, Escape to close

RoomMesh.tsx changes:
- Add onPointerOver → call onHover(room.id)
- Add onPointerOut → only unhover if not hovering HoverPrompt itself
- Change cursor to 'pointer' on hover: document.body.style.cursor

HouseModel.tsx changes:
- State: hoveredRoomId (string | null), activePromptRoomId (string | null)
- onHover(id): set hoveredRoomId
- onUnhover(): clear hoveredRoomId after 300ms delay (prevents flicker)
- On room click: set activePromptRoomId (show HoverPrompt)
- On HoverPrompt close: clear activePromptRoomId
- On HoverPrompt submit: call useArchitectAgent.update(instruction), clear activePromptRoomId after

Submit flow:
1. User submits instruction
2. useArchitectAgent.update(instruction) called → sets designStore.isUpdating = true
3. POST /api/architect with mode: 'UPDATE', existingDesign, instruction
4. On success: designStore.design updated → HouseModel re-renders
5. New/changed rooms animate in: scale from 0 + fade (Framer Motion, 400ms, spring)
6. On error: show error toast "Update failed. Try again."

MUST: Prevent multiple concurrent UPDATE calls. Disable prompt input while isUpdating.
NEVER: Do not show HoverPrompt and ControlBar simultaneously if it causes z-index conflicts. HoverPrompt is always on top.

Done when:
- [ ] Hovering a room shows subtle highlight
- [ ] Clicking a room opens HoverPrompt overlay anchored above it
- [ ] Submitting a prompt triggers UPDATE mode API call
- [ ] New furniture/room appears with animation
- [ ] Escape key closes the prompt
- [ ] Error state shows if update fails
```

---

## Done Criteria
- [ ] Hover highlight works on all rooms
- [ ] HoverPrompt opens/closes correctly
- [ ] Real UPDATE mode call fires and updates DesignSpec
- [ ] New elements animate in smoothly
- [ ] Input disabled during loading
- [ ] No z-index conflicts with ControlBar

---

# TASK_009 — Polish, Responsive & Deploy

**Phase:** Polish
**Estimated time:** 45 min
**Depends on:** TASK_008 ✅

---

## Objective
The application is production-ready: responsive quiz on mobile, loading skeletons, error states, dark mode on all components, performance optimizations, and Vercel deployment configured.

---

## Files to Create/Modify

| Action | File Path | Description |
|--------|-----------|-------------|
| MODIFY | src/app/viewer/page.tsx | Mobile fallback message |
| MODIFY | src/components/quiz/*.tsx | Full mobile responsiveness |
| MODIFY | src/styles/globals.css | Dark mode variables pass |
| MODIFY | tailwind.config.ts | Dark mode class strategy |
| CREATE | vercel.json | Vercel deployment config |
| MODIFY | All components | Loading skeletons + error states |
| MODIFY | src/components/viewer/HouseModel.tsx | InstancedMesh for large room counts |

---

## Prompt for AI Agent

```
Final polish pass for AI Architect Studio.

1. RESPONSIVE — Quiz Phase:
   - QuizShell: padding 16px on mobile, 48px on desktop
   - MultiChoiceInput: 1 column on mobile (<640px), 2 on tablet, up to 4 on desktop
   - ProgressBar: always full-width
   - QuestionCard: font-size 2rem on mobile, 2.5rem on desktop
   - All tap targets minimum 44px height (WCAG)

2. VIEWER — Mobile Fallback:
   - On screens < 768px: hide SceneCanvas, show centered message:
     "AI Architect Studio is best experienced on desktop"
     + icon (Laptop from Lucide)
     + "Design saved — open on a larger screen"
   - Still show the house description text (style, rooms count, total area)

3. DARK MODE:
   - Ensure .dark class strategy in tailwind.config.ts: darkMode: 'class'
   - All components: check bg, text, border colors switch correctly
   - ControlBar backdrop in dark mode: darker tint
   - Quiz inputs in dark mode: dark bg variant

4. LOADING STATES:
   - Quiz: skeleton pulse while waiting for next question (3 lines, width 60/80/40%)
   - Viewer: pulsing wireframe box (Three.js LineDashedMaterial, animate dash offset) while designStore.design is null
   - HoverPrompt: spinner inside button while isUpdating

5. PERFORMANCE:
   - Wrap RoomMesh in React.memo with custom comparison (only re-render if room.id, position, or material changes)
   - If designStore.design has > 20 rooms total: use InstancedMesh for room rendering (log a warning to console when this triggers)
   - Add next/image for any images (none in v1 — but set up the import)

6. ERROR BOUNDARIES:
   - Global error.tsx in app/ for Next.js error handling
   - QuizErrorBoundary around QuizShell
   - ViewerErrorBoundary around SceneCanvas (with "Something went wrong in the 3D viewer. Refresh to try again." message)

7. VERCEL DEPLOY:
   - Create vercel.json with buildCommand, outputDirectory, installCommand
   - Ensure MISTRAL_API_KEY is in Vercel env (add to .env.example with instructions)
   - Run npm run build — fix ALL TypeScript and ESLint errors before completing

MUST: npm run build must pass clean before this task is done.

Done when:
- [ ] Quiz works on iPhone 12 viewport (390px)
- [ ] Viewer shows mobile fallback on < 768px
- [ ] Dark mode works on all screens
- [ ] npm run build passes with 0 errors and 0 warnings
- [ ] vercel.json present and correct
```

---

## Done Criteria
- [ ] Quiz fully mobile responsive
- [ ] Viewer has mobile fallback
- [ ] `npm run build` passes clean
- [ ] Dark mode complete
- [ ] Error boundaries in place
- [ ] vercel.json ready
- [ ] No console errors or warnings in production build

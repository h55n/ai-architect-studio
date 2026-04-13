# Changelog — AI Architect Studio

All notable changes to this project will be documented in this file.
Format: [version] — [date] — [description]

---

## v0.1.0 — 2025-04-12 — Initial Scaffold

- Initial project setup
- PRD, MASTER_PROMPT, ARCHITECTURE, DECISIONS, ONBOARDING documents generated
- 9 build tasks defined in dependency order
- CLAUDE.md rules established
- Stack locked: Next.js 14, React Three Fiber, Mistral AI, Zustand, Zod, GSAP, Framer Motion

---

## v0.2.0 — 2026-04-13 — 3D Viewer Overhaul

### Added
- `FurnitureFactory.tsx` — 9 furniture types from primitives: bed, sofa, desk, dining_table, kitchen_counter, bathtub, toilet, wardrobe, plant. Generic fallback. All geometry in useMemo.
- Architectural room geometry: floor (PlaneGeometry), 4 walls (BoxGeometry), semi-transparent ceiling (opacity 0.18, BackSide), baseboards (#504E76).
- `<Edges>` blueprint lines on all walls via @react-three/drei.
- Exploded dashed corner guidelines (LineDashedMaterial, color #1A56DB) between floors when exploded.
- Floor labels (FLOOR N · X ROOMS · Ym²) via Drei Html, animate in on explode.
- Section plane visual — blue PlaneGeometry at x-ray cut height + SECTION A–A label.
- 2D floor plan mode — camera lerps to [0, 55, 0.001], OrbitControls pan-only.
- Roof mesh above top floor (flat slab, opacity 0.55).
- ControlBar glassmorphism panel (blur 16px, rgba(80,78,118,0.22), border rgba(196,195,227,0.28)).
- 5 control buttons: Orbit, Explode, X-Ray, Material, 2D/3D.
- X-ray slider animated with framer-motion within control bar.
- ACES Filmic tone mapping (exposure 1.1) on WebGL renderer.
- Architectural lighting rig: AmbientLight + DirectionalLight castShadow + HemisphereLight + PointLight warm.
- Mistral architect prompt updated to generate furniture (bed/sofa/desk/dining_table/kitchen_counter/bathtub/toilet/wardrobe/plant) with type strings matching FurnitureFactory router.

### Changed
- `RoomMesh.tsx` — scrapped single BoxGeometry. Real wall/floor/ceiling construction. Material blends preset tint with room.color (35% lerp). Emissive hover (#1A56DB, 0.08) + select (#F1642E, 0.05).
- `HouseModel.tsx` — explode triggers dashed guidelines + floor labels. Click opens HoverPrompt (not hover).
- `SceneCanvas.tsx` — new lighting, tone mapping, section plane, 2D camera animation.
- `ControlBar.tsx` — full glassmorphism rewrite, 2D/3D toggle added.
- `HoverPrompt.tsx` — opens on click, glassmorphism panel, "Add →" button, spinner during generation.
- `ViewMode` type → `'normal' | '2d'`.

### Fixed
- `useRef` missing import in QuizShell — added.
- Zod `profileSchema.ts` strict constraints → `.catch()` fallbacks prevent AI validation failures.
- `designSchema.ts` strict UUID/.datetime/.uuid constraints → `.catch()` — no more 502 generation loops.
- Three.js import `three/src/Three.js` → `three` (fixes Webpack tree-shaking).
- WireframeExtrusion `BoxGeometry` memory leak — shared single geo + `.dispose()` on unmount.
- CinematicLoader finally integrated in QuizShell (was plain spinner).
- Mistral model `mistral-large-latest` → `mistral-small-latest` — halved latency.

---

## v0.3.0 — 2026-04-13 — System Overhaul & Builder Mode

### Added
- **Two-Phase AI Pipeline** — Split generation into `ArchitectPlan` (intent/logic) and `ArchitectGeometry` (structural layout). Fixes blank scene bugs.
- **Cinematic Loader** — 6-stage lifecycle animation masking API latency.
- **Builder Mode** — Drag-and-drop workflow via `@dnd-kit`. Asset library sidebar (Rooms, Openings, Furniture).
- **WindowMesh & DoorMesh** — Dedicated sub-components. Windows shoot physical `SpotLight` beams into interiors.
- **Visual Identity** — Systematic CSS tokens, global noise overlay, `.glass` utilities.
- **Theme Support** — Global `ThemeToggle`. Light/Dark mode parity for all components.

### Changed
- `RoomMesh.tsx` — Full rewrite. Replaced extrusion with 4-box wall logic + cutout panels. Added baseboard trim.
- `HouseModel.tsx` — Lerp Y-transitions via `useFrame` for smooth floor explosion.
- `SceneCanvas.tsx` — Capped `dpr` at 1.5, ACESFilmic tone mapping exposure at 1.08.
- `globals.css` — Moved hex codes to `--tokens`. Consistent `--viewer-bg`.
- `useArchitectAgent.ts` — Orchestrates split-API lifecycle.

### Fixed
- OrbitControls event blocking — Portalized `Html` to `html-root` overlay. Decoupled R3F events via `eventSource`.
- Lighting — Rebalanced Ambient/Directional/Hemisphere split. Removed redundant point lights for performance.
- Theme Consistency — Eliminated hardcoded hex in `.tsx` files.


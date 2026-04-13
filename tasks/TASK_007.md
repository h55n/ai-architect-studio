# TASK_007 — Interactive Viewer Controls

**Phase:** Feature — 3D Controls
**Estimated time:** 45 min
**Depends on:** TASK_006 ✅

---

## Objective
All four interactive viewer controls are functional: exploded view, X-ray cutaway, material swap, and 2D/3D toggle. A glassmorphism control bar with all four tools floats over the 3D canvas.

---

## Files to Create/Modify

| Action | File Path | Description |
|--------|-----------|-------------|
| CREATE | src/components/viewer/ControlBar.tsx | Glassmorphism floating toolbar |
| CREATE | src/components/viewer/ExplodedView.tsx | Floor/room separation animation |
| CREATE | src/components/viewer/XRayCutaway.tsx | Clipping plane slider |
| CREATE | src/components/viewer/MaterialSwap.tsx | Material preset cycler |
| CREATE | src/hooks/useViewerControls.ts | All control flag state |
| MODIFY | src/store/viewerStore.ts | Populate with all control state |
| MODIFY | src/components/viewer/HouseModel.tsx | Connect to viewerStore flags |
| MODIFY | src/components/viewer/SceneCanvas.tsx | Add clipping plane to renderer |

## Files NOT to Touch
All quiz, cinematic, API route files.

---

## Prompt for AI Agent

```
Build the Interactive Viewer Controls for AI Architect Studio.

/src/store/viewerStore.ts additions:
- exploded: boolean (default false)
- xrayLevel: number 0–1 (default 0 = no cutaway, 1 = full cutaway)
- materialPreset: 'concrete' | 'timber' | 'brick' (default 'concrete')
- viewMode: '3d' | '2d' (default '3d')
- Actions: toggleExploded, setXrayLevel, cycleMaterial, setViewMode

/src/hooks/useViewerControls.ts:
- Wraps viewerStore with convenience toggles
- cycleMaterial cycles concrete → timber → brick → concrete

ExplodedView.tsx:
- NOT a visual component — a hook or utility that returns y-offsets for each floor
- In exploded mode: floor[0] stays at y=0, floor[1] moves to y += 4, floor[2] moves to y += 8
- In normal mode: floors at their spec y positions
- Use react-spring or Framer Motion useSpring for smooth y animation (spring: stiffness 80, damping 20)
- HouseModel passes the animated y-offset to each floor's rooms

XRayCutaway.tsx:
- A Three.js Plane clipping plane: plane normal (0, -1, 0), constant = cutoff Y height
- xrayLevel 0 = constant above all geometry (no clip). xrayLevel 1 = constant at mid-height.
- Expose a draggable vertical slider UI (outside canvas, positioned right edge, absolute)
- Slider maps 0–100% to xrayLevel in viewerStore
- Apply clipping plane to renderer.clippingPlanes in SceneCanvas

MaterialSwap.tsx:
- NOT a visual component — reads viewerStore.materialPreset
- Exports a hook: useActiveMaterial() returns the Three.js material params for the active preset
- RoomMesh uses this hook to get its material

ControlBar.tsx:
- Floating bottom-center panel
- CSS: backdrop-filter: blur(16px), bg: rgba(80, 78, 118, 0.25), border: 1px solid rgba(196, 195, 227, 0.3), border-radius: 16px
- 5 icon buttons (use Lucide React icons):
  - Orbit (always active — just an indicator): RotateCcw icon
  - Explode: Layers icon, toggles viewerStore.exploded, active state: var(--color-accent) bg
  - X-Ray: ScanLine icon, toggles xray slider visibility
  - Material: Palette icon, calls cycleMaterial on click, shows preset label
  - 2D/3D: LayoutGrid / Box icon, toggles viewMode
- Tooltip on each button (Tailwind group-hover absolute label)
- Entrance: slide up from bottom with Framer Motion on viewer load

Camera 2D mode:
- In app/viewer/page.tsx: when viewMode === '2d', animate camera to [0, 40, 0] looking straight down
- Use R3F useFrame or Drei CameraControls for smooth transition

MUST: Install lucide-react: npm install lucide-react
MUST: Clipping plane must be applied at the renderer level (renderer.localClippingEnabled = true)

Done when:
- [ ] Exploded view separates floors with smooth spring animation
- [ ] X-ray slider clips the house geometry at the correct height
- [ ] Material swap cycles through 3 presets, all rooms update in real time
- [ ] 2D toggle animates camera to top-down orthographic view
- [ ] ControlBar renders with glassmorphism effect
- [ ] All 5 buttons show correct active/inactive states
```

---

## Done Criteria
- [ ] All 4 interactive modes functional
- [ ] Glassmorphism ControlBar renders correctly
- [ ] Smooth animations on all transitions (no instant jumps)
- [ ] Lucide icons load correctly
- [ ] No performance drops when switching modes

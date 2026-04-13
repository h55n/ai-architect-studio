# TASK_006 — Three.js 3D Viewer Core

**Phase:** Feature — 3D Viewer
**Estimated time:** 45 min
**Depends on:** TASK_005 ✅

---

## Objective
The 3D viewer page renders the house from designStore using React Three Fiber. Room volumes are correctly positioned, scaled, and colored. The camera orbits with damping. The viewer handles loading and empty states gracefully.

---

## Files to Create/Modify

| Action | File Path | Description |
|--------|-----------|-------------|
| CREATE | src/components/viewer/SceneCanvas.tsx | R3F Canvas with camera + lights |
| CREATE | src/components/viewer/RoomMesh.tsx | Single room volume renderer |
| CREATE | src/components/viewer/FloorGrid.tsx | Ground grid |
| CREATE | src/components/viewer/HouseModel.tsx | DesignSpec → all RoomMesh instances |
| CREATE | src/lib/materialPresets.ts | 3 material preset definitions |
| MODIFY | src/app/viewer/page.tsx | Full viewer page wiring |

## Files NOT to Touch
All quiz components, cinematic components, API routes, Zustand stores.

---

## Prompt for AI Agent

```
Build the Three.js 3D Viewer core for AI Architect Studio.

/src/lib/materialPresets.ts:
Define 3 material presets as a const object:
- concrete: MeshStandardMaterial, color: #B0B0B0, roughness: 0.85, metalness: 0.0
- timber: MeshStandardMaterial, color: #8B6914, roughness: 0.75, metalness: 0.0
- brick: MeshStandardMaterial, color: #A63D2F, roughness: 0.9, metalness: 0.0
Export as: Record<'concrete'|'timber'|'brick', MeshStandardMaterialParameters>

RoomMesh.tsx:
- Props: { room: Room3D, materialPreset: 'concrete'|'timber'|'brick', isHovered: boolean, onHover: (id) => void }
- Renders a BoxGeometry(room.dimensions.w, room.dimensions.h, room.dimensions.d)
- Base color: room.color (from DesignSpec palette) blended with materialPreset roughness/metalness
- Position: room.position.x, room.position.y + room.dimensions.h/2, room.position.z (Y offset so it sits on floor)
- On hover: slight emissive glow (emissive: var(--color-accent), emissiveIntensity: 0.1)
- Use useMemo for geometry, useRef for mesh
- Renders a small Drei <Html> room label tag on hover (room.label text, Space Mono 10px)

FloorGrid.tsx:
- Drei <Grid> component
- args: [40, 40], cellColor: #C4C3E3, sectionColor: #504E76, cellSize: 1, sectionSize: 5
- Position at y = -0.01 (just below rooms)
- fadeDistance: 30, fadeFalloff: 2

HouseModel.tsx:
- Reads designStore.design
- Iterates floors → rooms, renders RoomMesh for each
- Floor y-offset: floor.level * floor.height (passed as room.position.y base)
- Reads viewerStore.materialPreset for the materialPreset prop
- Manages hover state internally: hovered room ID in local useState

SceneCanvas.tsx:
- R3F <Canvas> with:
  - camera={{ fov: 50, position: [15, 12, 15], near: 0.1, far: 1000 }}
  - shadows={true}
  - dpr={[1, 2]}
- Drei <OrbitControls> with enableDamping={true} dampingFactor={0.05} maxPolarAngle={Math.PI/2.1}
- Drei <ambientLight> intensity={0.6}
- Drei <directionalLight> position={[10, 20, 10]} intensity={1.2} castShadow
- Renders <HouseModel /> and <FloorGrid />
- Wraps in an ErrorBoundary (implement a simple class-based one)

app/viewer/page.tsx:
- If designStore.design is null: show centered loading spinner + "Preparing your space..." in Space Mono
- If designStore.design exists: render SceneCanvas full-viewport
- ThemeToggle button in top-right corner
- Page title in Cormorant Garamond: the design.style name (e.g. "Modernist Townhouse")

MUST: useMemo for all Three.js geometries. React.memo on RoomMesh.
NEVER: Never create geometry inside render function without useMemo.
NEVER: No `any` types in Three.js component props.

Done when:
- [ ] /viewer renders the 3D house from designStore
- [ ] All rooms are correctly positioned (no overlapping)
- [ ] Camera orbits with smooth damping
- [ ] Room hover shows label tag
- [ ] Material colors visible
- [ ] Loading state shows when design is null
```

---

## Done Criteria
- [ ] House renders with correct room layout from DesignSpec
- [ ] OrbitControls work smoothly
- [ ] Room labels appear on hover
- [ ] No Three.js deprecation warnings in console
- [ ] 60fps on desktop (check with browser perf tools)
- [ ] Error boundary catches R3F crashes gracefully

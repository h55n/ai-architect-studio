'use client'

import React, { useMemo, memo } from 'react'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useViewerStore } from '@/store/viewerStore'
import { RoomMesh } from './RoomMesh'
import { FloorGrid } from './FloorGrid'
import type { DesignSpec, Floor } from '@/types/design.types'

import { PivotControls } from '@react-three/drei'
import { useDesignStore } from '@/store/designStore'

interface HouseModelProps {
  design: DesignSpec
  isScratchMode?: boolean
}

// ─── Dashed corner lines between floors when exploded ────────────────────────
const ExplodedGuidelines = memo(function ExplodedGuidelines({
  floors,
}: {
  floors: Floor[]
}) {
  const lines = useMemo(() => {
    if (floors.length < 2) return []

    // Get overall building bounds from all rooms across all floors
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity
    for (const floor of floors) {
      for (const room of floor.rooms) {
        minX = Math.min(minX, room.position.x)
        maxX = Math.max(maxX, room.position.x + room.dimensions.width)
        minZ = Math.min(minZ, room.position.z)
        maxZ = Math.max(maxZ, room.position.z + room.dimensions.depth)
      }
    }

    const corners = [
      [minX, minZ],
      [maxX, minZ],
      [minX, maxZ],
      [maxX, maxZ],
    ] as [number, number][]

    // Compute floor Y positions (mirroring RoomMesh exploded Y)
    const floorYs = floors.map((f) =>
      f.level * f.height + f.level * 6.0
    )
    const totalHeight = Math.max(...floorYs) + floors[floors.length - 1].height

    return corners.map(([cx, cz]) => {
      const points = [
        new THREE.Vector3(cx, floorYs[0], cz),
        new THREE.Vector3(cx, totalHeight, cz),
      ]
      const geo = new THREE.BufferGeometry().setFromPoints(points)
      return { geo, cx, cz }
    })
  }, [floors])

  const dashedMat = useMemo(() => {
    const m = new THREE.LineDashedMaterial({
      color: '#1A56DB',
      dashSize: 0.15,
      gapSize: 0.1,
      transparent: true,
      opacity: 0.7,
    })
    return m
  }, [])

  return (
    <>
      {lines.map(({ geo }, i) => {
        const line = new THREE.Line(geo, dashedMat)
        line.computeLineDistances()
        return <primitive key={i} object={line} />
      })}
    </>
  )
})

// ─── Floor label when exploded ────────────────────────────────────────────────
function FloorLabel({ floor, yOffset }: { floor: Floor; yOffset: number }) {
  const sqm = useMemo(
    () => floor.rooms.reduce((a, r) => a + r.dimensions.width * r.dimensions.depth, 0).toFixed(0),
    [floor]
  )
  const minX = useMemo(
    () => Math.min(...floor.rooms.map((r) => r.position.x)) - 1.5,
    [floor]
  )
  const midZ = useMemo(
    () =>
      floor.rooms.reduce((a, r) => a + r.position.z + r.dimensions.depth / 2, 0) /
      floor.rooms.length,
    [floor]
  )

  return (
    <Html position={[minX, yOffset + floor.height / 2, midZ]} distanceFactor={16} portal={{ current: document.getElementById('html-root')! }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          opacity: 1,
          animation: `slideInLeft 0.4s ${floor.level * 150}ms both`,
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-space-mono)',
            fontSize: 11,
            letterSpacing: '0.2em',
            color: 'var(--accent)',
            textTransform: 'uppercase' as const,
            whiteSpace: 'nowrap',
          }}
        >
          FLOOR {floor.level + 1}
        </span>
        <span style={{ fontFamily: 'var(--font-space-mono)', fontSize: 9, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
          {floor.rooms.length} ROOMS · {sqm}m²
        </span>
      </div>
    </Html>
  )
}

// Sub-component for individual room so we can isolate PivotControls matrix updates
function DraggableRoom({ room, floorLevel, floorHeight, ...props }: any) {
  const { updateDesign, design } = useDesignStore()
  const localMatrix = useMemo(() => new THREE.Matrix4(), [])
  const groupRef = React.useRef<THREE.Group>(null!)

  useFrame((state, delta) => {
    if (groupRef.current) {
      const targetY = props.exploded ? floorLevel * floorHeight + floorLevel * 6.0 : floorLevel * floorHeight
      groupRef.current.position.y += (targetY - groupRef.current.position.y) * 8.0 * delta
    }
  })

  const handleDrag = (local: THREE.Matrix4) => {
    localMatrix.copy(local)
  }

  const handleDragEnd = () => {
    if (!design) return
    const offset = new THREE.Vector3()
    offset.setFromMatrixPosition(localMatrix)
    
    const newX = Math.round(room.position.x + offset.x)
    const newZ = Math.round(room.position.z + offset.z)

    const newFloors = design.floors.map((f: any, i: number) => {
      if (i !== floorLevel) return f
      return {
        ...f,
        rooms: f.rooms.map((r: any) =>
          r.id === room.id ? { ...r, position: { ...r.position, x: newX, z: newZ } } : r
        ),
      }
    })

    updateDesign({ ...design, floors: newFloors })
  }

  // If in scratch mode and selected, wrap with PivotControls
  if (props.isScratchMode && props.isSelected) {
    return (
      <group ref={groupRef}>
        <PivotControls
          translationLimits={[[-100, 100], [0, 0], [-100, 100]]}
          disableRotations
          disableScaling
          activeAxes={[true, false, true]}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          hoveredColor="#FCDD9D"
          depthTest={false}
        >
          <RoomMesh room={room} floorLevel={floorLevel} floorHeight={floorHeight} {...props} />
        </PivotControls>
      </group>
    )
  }

  return (
    <group ref={groupRef}>
      <RoomMesh room={room} floorLevel={floorLevel} floorHeight={floorHeight} {...props} />
    </group>
  )
}

// ─── HouseModel ───────────────────────────────────────────────────────────────
export function HouseModel({ design, isScratchMode }: HouseModelProps) {
  const {
    exploded,
    xrayEnabled,
    xrayClipY,
    materialPreset,
    selectedRoomId,
    hoveredRoomId,
    showGrid,
    showLabels,
    setSelectedRoom,
    setHoveredRoom,
    setHoverPrompt,
  } = useViewerStore()

  const floorYOffsets = useMemo(
    () =>
      design.floors.map((f) =>
        exploded ? f.level * f.height + f.level * 6.0 : f.level * f.height
      ),
    [design.floors, exploded]
  )

  return (
    <group>
      <FloorGrid visible={showGrid || !!isScratchMode} />

      {design.floors.map((floor, fi) =>
        floor.rooms.map((room) => (
          <group key={`room-${room.id}-v${design.version}`}>
            <DraggableRoom
              room={room}
              floorLevel={floor.level}
              floorHeight={floor.height}
              isSelected={selectedRoomId === room.id}
              isHovered={hoveredRoomId === room.id}
              materialPreset={materialPreset}
              exploded={exploded}
              xrayEnabled={xrayEnabled}
              xrayClipY={xrayClipY}
              showLabels={showLabels}
              isScratchMode={isScratchMode}
              onHover={(id: string | null) => {
                if (isScratchMode) return // no hover prompt in scratch
                setHoveredRoom(id)
                if (id) {
                  setHoverPrompt({
                    visible: false, // prompt opens on click now
                    roomId: id,
                    position: [
                      room.position.x + room.dimensions.width / 2,
                      floorYOffsets[fi] + room.dimensions.height + 0.5,
                      room.position.z + room.dimensions.depth / 2,
                    ],
                  })
                }
              }}
              onSelect={(id: string | null) => {
                setSelectedRoom(id)
                if (isScratchMode) return // no popup in scratch
                const r = floor.rooms.find((rm) => rm.id === id)
                if (r && id) {
                  setHoverPrompt({
                    visible: true,
                    roomId: id,
                    position: [
                      r.position.x + r.dimensions.width / 2,
                      floorYOffsets[fi] + r.dimensions.height + 0.5,
                      r.position.z + r.dimensions.depth / 2,
                    ],
                  })
                }
              }}
            />
          </group>
        ))
      )}

      {/* Exploded guidelines between floors */}
      {exploded && design.floors.length > 1 && (
        <ExplodedGuidelines floors={design.floors} />
      )}

      {/* Floor labels when exploded */}
      {exploded &&
        design.floors.map((floor, fi) => (
          <FloorLabel key={floor.id} floor={floor} yOffset={floorYOffsets[fi]} />
        ))}
    </group>
  )
}

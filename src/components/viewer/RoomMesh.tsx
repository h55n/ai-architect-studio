import React, { useMemo } from 'react'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import type { Room3D } from '@/types/design.types'
import { WindowMesh } from './WindowMesh'
import { DoorMesh } from './DoorMesh'
import { useViewerStore } from '@/store/viewerStore'

interface RoomMeshProps {
  room: Room3D
  floorLevel: number
  floorHeight: number
  isSelected?: boolean
  isHovered?: boolean
  exploded?: boolean
  materialPreset?: string
  xrayEnabled?: boolean
  xrayClipY?: number
  showLabels?: boolean
  isScratchMode?: boolean
  onHover?: (id: string | null) => void
  onSelect?: (id: string | null) => void
}

const WALL_T = 0.12

// A complex component that takes a wall dimension, and a list of openings, and returns an array of box geometries.
// Since the user specifically asked for "split wall into 2 panels with gap", we'll assume max 1 opening for simplicity based on prompt scope, or we can just use CSG if it was allowed. However, building out panels is requested.
// We'll write a helper to make a wall with an opening.
function buildWallPanels(w: number, h: number, openingInfo: { offset: number; width: number; height: number; sill: number } | null) {
  if (!openingInfo) return [{ x: 0, y: h / 2, width: w, height: h }]

  const leftW = (w / 2) + openingInfo.offset - (openingInfo.width / 2)
  const rightW = (w / 2) - openingInfo.offset - (openingInfo.width / 2)

  const panels = []

  // Left panel
  if (leftW > 0.01) panels.push({ x: -w / 2 + leftW / 2, y: h / 2, width: leftW, height: h })
  
  // Right panel
  if (rightW > 0.01) panels.push({ x: w / 2 - rightW / 2, y: h / 2, width: rightW, height: h })

  // Sill panel (for windows)
  if (openingInfo.sill > 0.01) {
    panels.push({ x: openingInfo.offset, y: openingInfo.sill / 2, width: openingInfo.width, height: openingInfo.sill })
  }

  // Header panel
  const headStart = openingInfo.sill + openingInfo.height
  if (h - headStart > 0.01) {
    panels.push({ x: openingInfo.offset, y: headStart + (h - headStart) / 2, width: openingInfo.width, height: h - headStart })
  }

  return panels
}

function RoomMeshComponent({
  room,
  floorLevel,
  floorHeight,
  isSelected,
  isHovered,
  exploded,
  showLabels,
  onHover,
  onSelect,
}: RoomMeshProps) {
  const { w, h, d } = useMemo(() => ({ w: room.dimensions.width, h: room.dimensions.height, d: room.dimensions.depth }), [room.dimensions])

  const floorGeo = useMemo(() => new THREE.PlaneGeometry(w, d), [w, d])
  const ceilGeo = useMemo(() => new THREE.PlaneGeometry(w - 0.05, d - 0.05), [w, d])
  const baseboardGeo = useMemo(() => new THREE.BoxGeometry(w, 0.06, WALL_T * 0.8), [w])

  const color = room.color
  const darkenHex = (hex: string, amt: number) => {
    // very basic fake darken
    return hex
  }

  // Openings detection
  const hasOpening = (wall: string) => {
    const win = room.windows?.find((w) => w.wall === wall)
    if (win) return { offset: win.offsetX * w, width: win.width, height: win.height, sill: win.sillHeight, isWin: true, obj: win }
    const door = room.doors?.find((d) => d.wall === wall)
    if (door) return { offset: door.offsetX * w, width: door.width, height: 2.1, sill: 0, isWin: false, obj: door }
    return null
  }

  const northOp = hasOpening('north')
  const southOp = hasOpening('south')
  const eastOp = hasOpening('east')
  const westOp = hasOpening('west')

  const northPanels = useMemo(() => buildWallPanels(w, h, northOp), [w, h, northOp])
  const southPanels = useMemo(() => buildWallPanels(w, h, southOp), [w, h, southOp])
  const eastPanels = useMemo(() => buildWallPanels(d, h, eastOp), [d, h, eastOp])
  const westPanels = useMemo(() => buildWallPanels(d, h, westOp), [d, h, westOp])

  return (
    <group
      position={[room.position.x, exploded ? floorLevel * floorHeight + floorLevel * 6.0 : floorLevel * floorHeight, room.position.z]}
      rotation={[0, room.rotation || 0, 0]}
      onPointerOver={(e) => { e.stopPropagation(); onHover?.(room.id) }}
      onPointerOut={() => onHover?.(null)}
      onClick={(e) => { e.stopPropagation(); onSelect?.(room.id) }}
    >
      {/* Floor */}
      <mesh receiveShadow position={[w/2, 0, d/2]} rotation={[-Math.PI / 2, 0, 0]} geometry={floorGeo}>
        <meshStandardMaterial color={darkenHex(color, 0.12)} roughness={0.85} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[w/2, h, d/2]} rotation={[Math.PI / 2, 0, 0]} geometry={ceilGeo}>
        <meshStandardMaterial color={color} opacity={0.2} transparent side={THREE.BackSide} />
      </mesh>

      {/* Walls */}
      <group>
        {/* North Wall (at z = 0) */}
        {northPanels.map((p, i) => (
          <mesh castShadow receiveShadow key={`n-${i}`} position={[w/2 + p.x, p.y, WALL_T/2]}>
            <boxGeometry args={[p.width, p.height, WALL_T]} />
            <meshStandardMaterial color={color} />
          </mesh>
        ))}
        {/* South Wall (at z = d) */}
        {southPanels.map((p, i) => (
          <mesh castShadow receiveShadow key={`s-${i}`} position={[w/2 + p.x, p.y, d - WALL_T/2]}>
            <boxGeometry args={[p.width, p.height, WALL_T]} />
            <meshStandardMaterial color={color} />
          </mesh>
        ))}
        {/* East Wall (at x = w) */}
        {eastPanels.map((p, i) => (
          <mesh castShadow receiveShadow key={`e-${i}`} position={[w - WALL_T/2, p.y, d/2 + p.x]}>
            <boxGeometry args={[WALL_T, p.height, p.width]} />
            <meshStandardMaterial color={color} />
          </mesh>
        ))}
        {/* West Wall (at x = 0) */}
        {westPanels.map((p, i) => (
          <mesh castShadow receiveShadow key={`w-${i}`} position={[WALL_T/2, p.y, d/2 + p.x]}>
            <boxGeometry args={[WALL_T, p.height, p.width]} />
            <meshStandardMaterial color={color} />
          </mesh>
        ))}
      </group>

      {/* Openings (Windows and Doors rendering) */}
      {northOp?.isWin && <group position={[w/2 + northOp.offset, 0, WALL_T/2]}><WindowMesh win={northOp.obj as import('@/types/design.types').Window3D} roomHeight={h} isGroundExterior={floorLevel === 0} /></group>}
      {northOp && !northOp.isWin && <group position={[w/2 + northOp.offset, 0, WALL_T/2]}><DoorMesh door={northOp.obj as import('@/types/design.types').Door3D} roomColor={color} /></group>}

      {southOp?.isWin && <group position={[w/2 + southOp.offset, 0, d - WALL_T/2]}><WindowMesh win={southOp.obj as import('@/types/design.types').Window3D} roomHeight={h} isGroundExterior={floorLevel === 0} /></group>}
      {southOp && !southOp.isWin && <group position={[w/2 + southOp.offset, 0, d - WALL_T/2]}><DoorMesh door={southOp.obj as import('@/types/design.types').Door3D} roomColor={color} /></group>}

      {eastOp?.isWin && <group position={[w - WALL_T/2, 0, d/2 + eastOp.offset]} rotation={[0, -Math.PI/2, 0]}><WindowMesh win={eastOp.obj as import('@/types/design.types').Window3D} roomHeight={h} isGroundExterior={floorLevel === 0} /></group>}
      {eastOp && !eastOp.isWin && <group position={[w - WALL_T/2, 0, d/2 + eastOp.offset]} rotation={[0, -Math.PI/2, 0]}><DoorMesh door={eastOp.obj as import('@/types/design.types').Door3D} roomColor={color} /></group>}

      {westOp?.isWin && <group position={[WALL_T/2, 0, d/2 + westOp.offset]} rotation={[0, Math.PI/2, 0]}><WindowMesh win={westOp.obj as import('@/types/design.types').Window3D} roomHeight={h} isGroundExterior={floorLevel === 0} /></group>}
      {westOp && !westOp.isWin && <group position={[WALL_T/2, 0, d/2 + westOp.offset]} rotation={[0, Math.PI/2, 0]}><DoorMesh door={westOp.obj as import('@/types/design.types').Door3D} roomColor={color} /></group>}

      {/* Baseboard trim */}
      <mesh position={[w/2, 0.03, WALL_T/2]} geometry={baseboardGeo}>
        <meshStandardMaterial color="#504E76" metalness={0.15} roughness={0.7} />
      </mesh>
      <mesh position={[w/2, 0.03, d - WALL_T/2]} geometry={baseboardGeo}>
        <meshStandardMaterial color="#504E76" metalness={0.15} roughness={0.7} />
      </mesh>

      {/* Room Label */}
      {(showLabels || isHovered) && (
        <Html position={[w/2, h + 0.5, d/2]} center portal={{ current: document.getElementById('html-root')! }}>
          <span style={{ fontFamily: 'var(--font-space-mono)', fontSize: 11, color: 'var(--text-secondary)' }}>
            {room.label || room.name}
          </span>
        </Html>
      )}
    </group>
  )
}

export const RoomMesh = React.memo(RoomMeshComponent, (prev, next) => {
  return prev.room.id === next.room.id &&
    prev.room.color === next.room.color &&
    prev.materialPreset === next.materialPreset &&
    prev.isSelected === next.isSelected &&
    prev.isHovered === next.isHovered &&
    prev.exploded === next.exploded &&
    prev.showLabels === next.showLabels
})

import { useMemo } from 'react'
import * as THREE from 'three'
import type { Door3D } from '@/types/design.types'
import { useViewerStore } from '@/store/viewerStore'

interface DoorMeshProps {
  door: Door3D
  roomColor: string
}

function adjustColorLightness(hex: string, percent: number): string {
  // basic lighten approximation
  return hex // simplified for speed; if needed we can parse hex and shift hsl
}

export function DoorMesh({ door, roomColor }: DoorMeshProps) {
  const { viewMode } = useViewerStore()
  const width = door.width
  const height = 2.1
  const t = 0.14 // frame depth

  // Door panel: roomColor but lightened slightly
  return (
    <group position={[0, height / 2, 0]}>
      {/* Frame */}
      <mesh position={[0, height / 2 + 0.02, 0]}>
        <boxGeometry args={[width, 0.04, t]} />
        <meshStandardMaterial color="#504E76" />
      </mesh>
      <mesh position={[-width / 2 - 0.02, 0, 0]}>
        <boxGeometry args={[0.04, height, t]} />
        <meshStandardMaterial color="#504E76" />
      </mesh>
      <mesh position={[width / 2 + 0.02, 0, 0]}>
        <boxGeometry args={[0.04, height, t]} />
        <meshStandardMaterial color="#504E76" />
      </mesh>

      {/* Door Leaf (Panel) */}
      <mesh position={[width / 2 - 0.02, 0, door.swingDirection === 'inward' ? t/2 : -t/2]} rotation={[0, -Math.PI / 4, 0]}>
        <boxGeometry args={[width - 0.04, height, 0.04]} />
        <meshStandardMaterial color={roomColor} />
      </mesh>
      
      {/* Swing arc for 2D floorplan view */}
      {viewMode === '2d' && (
        <mesh position={[width / 2, -height / 2 + 0.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[width - 0.04, width - 0.02, 32, 1, 0, Math.PI / 4]} />
          <meshBasicMaterial color="#1A56DB" side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  )
}

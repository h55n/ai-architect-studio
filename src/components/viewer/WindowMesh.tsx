import { useMemo } from 'react'
import * as THREE from 'three'
import type { Window3D } from '@/types/design.types'

interface WindowMeshProps {
  win: Window3D
  roomHeight: number
  isGroundExterior: boolean
}

export function WindowMesh({ win, roomHeight, isGroundExterior }: WindowMeshProps) {
  // Simple representation: frame + glass plane
  // win.offsetX is 0-1, but the physical position inside the gap is handled by the parent placing this mesh
  
  const width = win.width
  const height = win.height
  const t = 0.15 // frame thickness

  const glassGeo = useMemo(() => new THREE.PlaneGeometry(width, height), [width, height])
  
  return (
    <group position={[0, win.sillHeight + height / 2, 0]}>
      {/* Frame */}
      <mesh position={[0, height / 2 + 0.02, 0]}>
        <boxGeometry args={[width, 0.04, t]} />
        <meshStandardMaterial color="#504E76" />
      </mesh>
      <mesh position={[0, -height / 2 - 0.02, 0]}>
        <boxGeometry args={[width, 0.04, t]} />
        <meshStandardMaterial color="#504E76" />
      </mesh>
      <mesh position={[-width / 2 - 0.02, 0, 0]}>
        <boxGeometry args={[0.04, height + 0.08, t]} />
        <meshStandardMaterial color="#504E76" />
      </mesh>
      <mesh position={[width / 2 + 0.02, 0, 0]}>
        <boxGeometry args={[0.04, height + 0.08, t]} />
        <meshStandardMaterial color="#504E76" />
      </mesh>

      {/* Glass */}
      <mesh geometry={glassGeo}>
        <meshPhysicalMaterial
          transmission={0.88}
          roughness={0.04}
          color="#A3C4D8"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* SpotLight representing sunlight through exterior ground floor windows */}
      {isGroundExterior && (
        <spotLight
          position={[0, roomHeight - 0.3 - (win.sillHeight + height / 2), 0.5]}
          target-position={[0, -(win.sillHeight + height / 2), 2]}
          color="#FFF8E7"
          intensity={0.7}
          angle={0.5}
          penumbra={0.7}
          distance={roomHeight + 2}
          castShadow
        />
      )}
    </group>
  )
}

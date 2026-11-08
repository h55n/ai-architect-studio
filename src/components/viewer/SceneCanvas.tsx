'use client'

import { Suspense, useRef, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Html } from '@react-three/drei'
import * as THREE from 'three'
import { HouseModel } from './HouseModel'
import { HoverPrompt } from './HoverPrompt'
import { useViewerStore } from '@/store/viewerStore'
import type { DesignSpec } from '@/types/design.types'

interface SceneCanvasProps {
  design: DesignSpec
  isScratchMode?: boolean
}

// ─── Architectural Lighting ────────────────────────────────────────────────────
function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.32} color="#FDF8E2" />
      <directionalLight
        position={[20, 40, 15]}
        intensity={1.3}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0008}
        shadow-camera-far={100}
      />
      <hemisphereLight args={['#C4C3E3', '#A3B565', 0.45]} />
    </>
  )
}

// ─── X-Ray Section Plane Visual ────────────────────────────────────────────────
function SectionPlane({ design }: { design: DesignSpec }) {
  const { xrayEnabled, xrayClipY } = useViewerStore()
  if (!xrayEnabled) return null

  const allRooms = design.floors.flatMap((f) => f.rooms)
  const totalW = Math.max(...allRooms.map((r) => r.position.x + r.dimensions.width)) + 3
  const totalD = Math.max(...allRooms.map((r) => r.position.z + r.dimensions.depth)) + 3
  const cx = totalW / 2
  const cz = totalD / 2

  return (
    <>
      <mesh position={[cx, xrayClipY, cz]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[totalW, totalD]} />
        <meshBasicMaterial color="#1A56DB" transparent opacity={0.07} side={THREE.DoubleSide} />
      </mesh>
      <Html position={[cx + totalW / 2 + 0.5, xrayClipY, cz]} portal={{ current: document.getElementById('html-root')! }}>
        <div style={{
          fontFamily: 'var(--font-space-mono)',
          fontSize: 9,
          color: 'var(--accent)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}>
          SECTION A–A
        </div>
      </Html>
    </>
  )
}

// ─── Renderer config ──────────────────────────────────────────────────────────
function RendererSetup() {
  const { gl, camera } = useThree()
  const { viewMode } = useViewerStore()
  const orbitRef = useRef<{ enabled: boolean }>(null)

  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping
    gl.toneMappingExposure = 1.1
    gl.localClippingEnabled = true
  }, [gl])

  //  Animate camera for 2D mode
  useEffect(() => {
    const target = viewMode === '2d'
      ? new THREE.Vector3(0, 55, 0.001)
      : new THREE.Vector3(22, 18, 22)
    const start = camera.position.clone()
    let frame = 0

    const animate = () => {
      camera.position.lerp(target, 0.06)
      camera.lookAt(0, 0, 0)
      frame = requestAnimationFrame(animate)
      if (camera.position.distanceTo(target) < 0.05) {
        cancelAnimationFrame(frame)
        camera.position.copy(target)
      }
    }
    animate()
    return () => cancelAnimationFrame(frame)
  }, [viewMode, camera])

  return null
}

// ─── SceneCanvas ─────────────────────────────────────────────────────────────
export function SceneCanvas({ design, isScratchMode }: SceneCanvasProps) {
  const { viewMode } = useViewerStore()

  return (
    <div id="canvas-container" className="absolute inset-0">
      <Canvas
        shadows="soft"
        eventPrefix="client"
        camera={{ fov: 45, position: [22, 18, 22], near: 0.1, far: 300 }}
        gl={{ localClippingEnabled: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.08 }}
        dpr={[1, 1.5]}
        className="r3f-canvas"
        style={{ background: 'var(--viewer-bg)' }}
        aria-label="3D architectural model"
      >
        <RendererSetup />
        <Suspense fallback={null}>
          <SceneLights />
          <HouseModel design={design} isScratchMode={isScratchMode} />
          <HoverPrompt design={design} />
          <SectionPlane design={design} />
          <ContactShadows
            position={[0, -0.02, 0]}
            opacity={0.5}
            scale={30}
            blur={2.5}
            far={6}
            color="#504E76"
          />
          <OrbitControls
            makeDefault
            enableDamping
            dampingFactor={0.04}
            minDistance={3}
            maxDistance={60}
            maxPolarAngle={viewMode === '2d' ? 0.01 : Math.PI / 2 - 0.05}
            enableRotate={viewMode !== '2d'}
            enablePan
            enableZoom
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

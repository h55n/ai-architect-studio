'use client'

import { useMemo, memo } from 'react'
import * as THREE from 'three'
import type { Furniture } from '@/types/design.types'

interface FurniturePieceProps {
  item: Furniture
  roomColor: string
}

// ─── Bed ────────────────────────────────────────────────────────────────────
function BedMesh({ item }: { item: Furniture }) {
  const { x, y, z } = item.position
  const frameGeo = useMemo(() => new THREE.BoxGeometry(2.0, 0.32, 2.1), [])
  const mattressGeo = useMemo(() => new THREE.BoxGeometry(1.88, 0.16, 1.82), [])
  const headboardGeo = useMemo(() => new THREE.BoxGeometry(2.0, 0.65, 0.1), [])
  const pillowGeo = useMemo(() => new THREE.BoxGeometry(0.5, 0.09, 0.4), [])

  const timberMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#8B6914', roughness: 0.7 }), [])
  const creamMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#FDF8E2', roughness: 0.85 }), [])

  return (
    <group position={[x, y, z]} castShadow>
      <mesh geometry={frameGeo} material={timberMat} position={[0, 0.16, 0]} castShadow receiveShadow />
      <mesh geometry={mattressGeo} material={creamMat} position={[0, 0.4, 0]} castShadow />
      <mesh geometry={headboardGeo} material={timberMat} position={[0, 0.645, -0.95]} castShadow />
      <mesh geometry={pillowGeo} material={creamMat} position={[-0.55, 0.53, -0.65]} castShadow />
      <mesh geometry={pillowGeo} material={creamMat} position={[0.55, 0.53, -0.65]} castShadow />
    </group>
  )
}

// ─── Sofa ────────────────────────────────────────────────────────────────────
function SofaMesh({ item, roomColor }: { item: Furniture; roomColor: string }) {
  const { x, y, z } = item.position
  const sofaColor = useMemo(() => {
    const c = new THREE.Color(roomColor)
    c.multiplyScalar(0.85)
    return c
  }, [roomColor])

  const baseGeo = useMemo(() => new THREE.BoxGeometry(1.8, 0.42, 0.8), [])
  const backGeo = useMemo(() => new THREE.BoxGeometry(1.8, 0.55, 0.18), [])
  const armGeo = useMemo(() => new THREE.BoxGeometry(0.16, 0.52, 0.8), [])
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: sofaColor, roughness: 0.95 }), [sofaColor])

  return (
    <group position={[x, y, z]} castShadow>
      <mesh geometry={baseGeo} material={mat} position={[0, 0.21, 0]} castShadow receiveShadow />
      <mesh geometry={backGeo} material={mat} position={[0, 0.635, -0.31]} castShadow />
      <mesh geometry={armGeo} material={mat} position={[-0.82, 0.26, 0]} castShadow />
      <mesh geometry={armGeo} material={mat} position={[0.82, 0.26, 0]} castShadow />
    </group>
  )
}

// ─── Desk ────────────────────────────────────────────────────────────────────
function DeskMesh({ item }: { item: Furniture }) {
  const { x, y, z } = item.position
  const topGeo = useMemo(() => new THREE.BoxGeometry(1.4, 0.05, 0.7), [])
  const legGeo = useMemo(() => new THREE.CylinderGeometry(0.03, 0.03, 0.72, 8), [])
  const monitorGeo = useMemo(() => new THREE.BoxGeometry(0.6, 0.38, 0.04), [])
  const standGeo = useMemo(() => new THREE.BoxGeometry(0.04, 0.3, 0.04), [])

  const timberMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#8B6914', roughness: 0.7 }), [])
  const monitorMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1A1A2E', roughness: 0.3, metalness: 0.6 }), [])

  const legOffset = 0.62
  return (
    <group position={[x, y, z]}>
      <mesh geometry={topGeo} material={timberMat} position={[0, 0.745, 0]} castShadow receiveShadow />
      <mesh geometry={legGeo} material={timberMat} position={[-legOffset, 0.36, -0.3]} castShadow />
      <mesh geometry={legGeo} material={timberMat} position={[legOffset, 0.36, -0.3]} castShadow />
      <mesh geometry={legGeo} material={timberMat} position={[-legOffset, 0.36, 0.3]} castShadow />
      <mesh geometry={legGeo} material={timberMat} position={[legOffset, 0.36, 0.3]} castShadow />
      <mesh geometry={standGeo} material={monitorMat} position={[0, 0.92, -0.25]} castShadow />
      <mesh geometry={monitorGeo} material={monitorMat} position={[0, 1.2, -0.27]} castShadow />
    </group>
  )
}

// ─── Dining table + chairs ────────────────────────────────────────────────────
function DiningMesh({ item }: { item: Furniture }) {
  const { x, y, z } = item.position
  const topGeo = useMemo(() => new THREE.BoxGeometry(1.6, 0.05, 0.9), [])
  const legGeo = useMemo(() => new THREE.CylinderGeometry(0.03, 0.03, 0.72, 8), [])
  const seatGeo = useMemo(() => new THREE.BoxGeometry(0.42, 0.04, 0.42), [])
  const backGeo = useMemo(() => new THREE.BoxGeometry(0.42, 0.48, 0.04), [])
  const chairLegGeo = useMemo(() => new THREE.CylinderGeometry(0.02, 0.02, 0.42, 6), [])

  const tableMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#8B6914', roughness: 0.6 }), [])
  const chairMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#FDF8E2', roughness: 0.9 }), [])

  const chairs = [
    { pos: [-0.62, 0] as [number, number], rot: 0 },
    { pos: [0.62, 0] as [number, number], rot: Math.PI },
    { pos: [0, -0.52] as [number, number], rot: Math.PI / 2 },
    { pos: [0, 0.52] as [number, number], rot: -Math.PI / 2 },
  ]

  return (
    <group position={[x, y, z]}>
      <mesh geometry={topGeo} material={tableMat} position={[0, 0.745, 0]} castShadow receiveShadow />
      {[-0.72, 0.72].map((px, i) =>
        [-0.38, 0.38].map((pz, j) => (
          <mesh key={`leg-${i}-${j}`} geometry={legGeo} material={tableMat} position={[px, 0.36, pz]} castShadow />
        ))
      )}
      {chairs.map(({ pos, rot }, i) => (
        <group key={`chair-${i}`} position={[pos[0], 0, pos[1]]} rotation={[0, rot, 0]}>
          <mesh geometry={seatGeo} material={chairMat} position={[0, 0.44, 0]} castShadow />
          <mesh geometry={backGeo} material={chairMat} position={[0, 0.68, -0.19]} castShadow />
          {[-0.18, 0.18].map((cx, ci) =>
            [-0.16, 0.16].map((cz, cj) => (
              <mesh key={`cl-${ci}-${cj}`} geometry={chairLegGeo} material={chairMat} position={[cx, 0.21, cz]} castShadow />
            ))
          )}
        </group>
      ))}
    </group>
  )
}

// ─── Kitchen Counter ──────────────────────────────────────────────────────────
function KitchenMesh({ item }: { item: Furniture }) {
  const { x, y, z } = item.position
  const bodyGeo = useMemo(() => new THREE.BoxGeometry(2.4, 0.88, 0.58), [])
  const topGeo = useMemo(() => new THREE.BoxGeometry(2.5, 0.04, 0.64), [])
  const upperGeo = useMemo(() => new THREE.BoxGeometry(1.8, 0.58, 0.32), [])
  const sinkGeo = useMemo(() => new THREE.CylinderGeometry(0.18, 0.18, 0.08, 16), [])

  const cabinetMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#E8E8E8', roughness: 0.5 }), [])
  const counterMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#504E76', roughness: 0.3, metalness: 0.2 }), [])
  const sinkMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#9B9BB0', roughness: 0.2, metalness: 0.8 }), [])

  return (
    <group position={[x, y, z]}>
      <mesh geometry={bodyGeo} material={cabinetMat} position={[0, 0.44, 0]} castShadow receiveShadow />
      <mesh geometry={topGeo} material={counterMat} position={[0, 0.9, 0]} castShadow />
      <mesh geometry={upperGeo} material={cabinetMat} position={[0, 1.68, -0.13]} castShadow />
      <mesh geometry={sinkGeo} material={sinkMat} position={[0.7, 0.93, 0]} castShadow />
    </group>
  )
}

// ─── Bathtub ──────────────────────────────────────────────────────────────────
function BathtubMesh({ item }: { item: Furniture }) {
  const { x, y, z } = item.position
  const outerGeo = useMemo(() => new THREE.BoxGeometry(1.7, 0.52, 0.74), [])
  const innerGeo = useMemo(() => new THREE.BoxGeometry(1.52, 0.32, 0.56), [])
  const faucetGeo = useMemo(() => new THREE.CylinderGeometry(0.025, 0.025, 0.28, 8), [])
  const knobGeo = useMemo(() => new THREE.SphereGeometry(0.035, 8, 8), [])

  const tubMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#EEEEF5', roughness: 0.15, metalness: 0.05 }), [])
  const innerMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#C4C3E3', roughness: 0.15, transparent: true, opacity: 0.7 }), [])
  const faucetMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#C0C0C0', roughness: 0.1, metalness: 0.9 }), [])

  return (
    <group position={[x, y, z]}>
      <mesh geometry={outerGeo} material={tubMat} position={[0, 0.26, 0]} castShadow receiveShadow />
      <mesh geometry={innerGeo} material={innerMat} position={[0, 0.38, 0]} />
      <mesh geometry={faucetGeo} material={faucetMat} position={[0.75, 0.62, 0]} castShadow />
      <mesh geometry={knobGeo} material={faucetMat} position={[0.75, 0.76, 0]} castShadow />
    </group>
  )
}

// ─── Toilet ────────────────────────────────────────────────────────────────────
function ToiletMesh({ item }: { item: Furniture }) {
  const { x, y, z } = item.position
  const bowlGeo = useMemo(() => new THREE.CylinderGeometry(0.22, 0.26, 0.36, 16), [])
  const tankGeo = useMemo(() => new THREE.BoxGeometry(0.34, 0.4, 0.17), [])
  const seatGeo = useMemo(() => new THREE.TorusGeometry(0.2, 0.035, 8, 16), [])

  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#F0F0F5', roughness: 0.15, metalness: 0.02 }), [])
  const seatMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#E8E8EE', roughness: 0.2 }), [])

  return (
    <group position={[x, y, z]}>
      <mesh geometry={bowlGeo} material={mat} position={[0, 0.18, 0]} castShadow receiveShadow />
      <mesh geometry={tankGeo} material={mat} position={[0, 0.56, -0.24]} castShadow />
      <mesh geometry={seatGeo} material={seatMat} position={[0, 0.37, 0]} rotation={[Math.PI / 2, 0, 0]} />
    </group>
  )
}

// ─── Wardrobe ─────────────────────────────────────────────────────────────────
function WardrobeMesh({ item }: { item: Furniture }) {
  const { x, y, z } = item.position
  const bodyGeo = useMemo(() => new THREE.BoxGeometry(1.2, 2.1, 0.6), [])
  const doorGeo = useMemo(() => new THREE.BoxGeometry(0.58, 1.9, 0.04), [])
  const handleGeo = useMemo(() => new THREE.CylinderGeometry(0.015, 0.015, 0.12, 6), [])

  const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#D4C5A9', roughness: 0.6 }), [])
  const doorMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#E0D4BC', roughness: 0.4 }), [])
  const handleMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#A0A0A0', metalness: 0.8, roughness: 0.2 }), [])

  return (
    <group position={[x, y, z]}>
      <mesh geometry={bodyGeo} material={bodyMat} position={[0, 1.05, 0]} castShadow receiveShadow />
      <mesh geometry={doorGeo} material={doorMat} position={[-0.3, 1.05, 0.32]} castShadow />
      <mesh geometry={doorGeo} material={doorMat} position={[0.3, 1.05, 0.32]} castShadow />
      <mesh geometry={handleGeo} material={handleMat} position={[-0.06, 1.05, 0.39]} rotation={[0, 0, Math.PI / 2]} castShadow />
      <mesh geometry={handleGeo} material={handleMat} position={[0.06, 1.05, 0.39]} rotation={[0, 0, Math.PI / 2]} castShadow />
    </group>
  )
}

// ─── Plant ────────────────────────────────────────────────────────────────────
function PlantMesh({ item }: { item: Furniture }) {
  const { x, y, z } = item.position
  const potGeo = useMemo(() => new THREE.CylinderGeometry(0.14, 0.1, 0.24, 12), [])
  const stemGeo = useMemo(() => new THREE.CylinderGeometry(0.02, 0.02, 0.35, 6), [])
  const leafGeo = useMemo(() => new THREE.SphereGeometry(0.18, 8, 6), [])

  const potMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#F1642E', roughness: 0.8 }), [])
  const stemMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#5D8A3C', roughness: 0.9 }), [])
  const leafMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#A3B565', roughness: 0.8 }), [])

  return (
    <group position={[x, y, z]}>
      <mesh geometry={potGeo} material={potMat} position={[0, 0.12, 0]} castShadow />
      <mesh geometry={stemGeo} material={stemMat} position={[0, 0.415, 0]} castShadow />
      <mesh geometry={leafGeo} material={leafMat} position={[0, 0.68, 0]} castShadow />
      <mesh geometry={leafGeo} material={leafMat} position={[0.12, 0.62, 0.08]} castShadow />
      <mesh geometry={leafGeo} material={leafMat} position={[-0.1, 0.65, -0.06]} castShadow />
    </group>
  )
}

function LampMesh({ item }: { item: Furniture }) {
  const { x, y, z } = item.position
  const baseGeo = useMemo(() => new THREE.CylinderGeometry(0.12, 0.14, 0.05, 16), [])
  const standGeo = useMemo(() => new THREE.CylinderGeometry(0.02, 0.02, 0.9, 10), [])
  const shadeGeo = useMemo(() => new THREE.CylinderGeometry(0.2, 0.3, 0.3, 16, 1, true), [])
  const matMetal = useMemo(() => new THREE.MeshStandardMaterial({ color: '#9B9BB0', metalness: 0.8, roughness: 0.2 }), [])
  const matShade = useMemo(() => new THREE.MeshStandardMaterial({ color: '#FDF8E2', roughness: 0.8, transparent: true, opacity: 0.9 }), [])

  return (
    <group position={[x, y, z]}>
      <mesh geometry={baseGeo} material={matMetal} position={[0, 0.025, 0]} castShadow />
      <mesh geometry={standGeo} material={matMetal} position={[0, 0.5, 0]} castShadow />
      <mesh geometry={shadeGeo} material={matShade} position={[0, 1, 0]} castShadow />
    </group>
  )
}

function BookshelfMesh({ item }: { item: Furniture }) {
  const { x, y, z } = item.position
  const frameGeo = useMemo(() => new THREE.BoxGeometry(1, 2, 0.32), [])
  const shelfGeo = useMemo(() => new THREE.BoxGeometry(0.9, 0.04, 0.28), [])
  const bookGeo = useMemo(() => new THREE.BoxGeometry(0.08, 0.25, 0.18), [])
  const frameMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#8B6914', roughness: 0.7 }), [])
  const bookMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#504E76', roughness: 0.8 }), [])

  return (
    <group position={[x, y, z]}>
      <mesh geometry={frameGeo} material={frameMat} position={[0, 1, 0]} castShadow receiveShadow />
      {[0.4, 0.9, 1.4].map((sy, i) => (
        <mesh key={`shelf-${i}`} geometry={shelfGeo} material={frameMat} position={[0, sy, 0.02]} castShadow />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={`book-${i}`} geometry={bookGeo} material={bookMat} position={[-0.28 + i * 0.18, 0.56, 0.02]} castShadow />
      ))}
    </group>
  )
}

function TvStandMesh({ item }: { item: Furniture }) {
  const { x, y, z } = item.position
  const standGeo = useMemo(() => new THREE.BoxGeometry(1.6, 0.45, 0.4), [])
  const screenGeo = useMemo(() => new THREE.BoxGeometry(1.1, 0.65, 0.04), [])
  const supportGeo = useMemo(() => new THREE.BoxGeometry(0.08, 0.22, 0.08), [])
  const standMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#504E76', roughness: 0.6 }), [])
  const screenMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#101017', roughness: 0.15, metalness: 0.5 }), [])

  return (
    <group position={[x, y, z]}>
      <mesh geometry={standGeo} material={standMat} position={[0, 0.22, 0]} castShadow receiveShadow />
      <mesh geometry={supportGeo} material={standMat} position={[0, 0.62, -0.08]} castShadow />
      <mesh geometry={screenGeo} material={screenMat} position={[0, 1.02, -0.1]} castShadow />
    </group>
  )
}

function StairMesh({ item }: { item: Furniture }) {
  const { x, y, z } = item.position
  const stepGeo = useMemo(() => new THREE.BoxGeometry(1.2, 0.14, 0.36), [])
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#8B6914', roughness: 0.75 }), [])

  return (
    <group position={[x, y, z]}>
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh key={`step-${i}`} geometry={stepGeo} material={mat} position={[0, 0.07 + i * 0.14, i * 0.32]} castShadow receiveShadow />
      ))}
    </group>
  )
}

// ─── Generic Fallback ─────────────────────────────────────────────────────────
function GenericMesh({ item }: { item: Furniture }) {
  const { x, y, z } = item.position
  const { width, height, depth } = item.dimensions
  const geo = useMemo(() => new THREE.BoxGeometry(width, height, depth), [width, height, depth])
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#A3B565', roughness: 0.85, transparent: true, opacity: 0.8 }), [])
  return (
    <mesh geometry={geo} material={mat} position={[x, y + height / 2, z]} castShadow receiveShadow />
  )
}

// ─── Router ───────────────────────────────────────────────────────────────────
export const FurnitureFactory = memo(function FurnitureFactory({ item, roomColor }: FurniturePieceProps) {
  const t = item.type?.toLowerCase() ?? ''
  if (t.includes('bed')) return <BedMesh item={item} />
  if (t.includes('sofa') || t.includes('couch')) return <SofaMesh item={item} roomColor={roomColor} />
  if (t.includes('desk') || t.includes('table') && t.includes('work')) return <DeskMesh item={item} />
  if (t.includes('dining') || (t.includes('table') && !t.includes('work'))) return <DiningMesh item={item} />
  if (t.includes('kitchen') || t.includes('counter')) return <KitchenMesh item={item} />
  if (t.includes('bath') || t.includes('tub')) return <BathtubMesh item={item} />
  if (t.includes('toilet')) return <ToiletMesh item={item} />
  if (t.includes('wardrobe') || t.includes('closet')) return <WardrobeMesh item={item} />
  if (t.includes('lamp')) return <LampMesh item={item} />
  if (t.includes('bookshelf') || t.includes('book shelf')) return <BookshelfMesh item={item} />
  if (t.includes('tv_stand') || (t.includes('tv') && t.includes('stand'))) return <TvStandMesh item={item} />
  if (t.includes('stair')) return <StairMesh item={item} />
  if (t.includes('plant')) return <PlantMesh item={item} />
  return <GenericMesh item={item} />
})

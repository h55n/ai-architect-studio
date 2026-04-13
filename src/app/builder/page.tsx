'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState, useCallback } from 'react'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { useDroppable } from '@dnd-kit/core'
import { useDesignStore } from '@/store/designStore'
import { useBuilderStore } from '@/store/builderStore'
import { BuilderSidebar } from '@/components/viewer/BuilderSidebar'
import { BuilderToolbar } from '@/components/viewer/BuilderToolbar'
import type { DesignSpec, Room3D } from '@/types/design.types'

const SceneCanvas = dynamic(
  () => import('@/components/viewer/SceneCanvas').then((m) => m.SceneCanvas),
  { ssr: false }
)

// A simple drop zone overlay that accepts elements dropped over the Canvas
function CanvasDropZone({ children }: { children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({
    id: 'canvas-drop-zone',
  })
  return (
    <div ref={setNodeRef} className="absolute inset-0 z-0">
      {children}
    </div>
  )
}

export default function BuilderPage() {
  const { design, setDesign } = useDesignStore()
  const { clearHistory, pushHistory } = useBuilderStore()
  const [isLoaded, setIsLoaded] = useState(false)

  const getApproximateWorldPos = useCallback((evt: MouseEvent | PointerEvent | TouchEvent) => {
    const container = document.getElementById('canvas-container')
    if (!container) return { x: 0, y: 0, z: 0 }

    const rect = container.getBoundingClientRect()
    const clientX = 'touches' in evt ? evt.touches[0]?.clientX ?? rect.left + rect.width / 2 : evt.clientX
    const clientY = 'touches' in evt ? evt.touches[0]?.clientY ?? rect.top + rect.height / 2 : evt.clientY
    const nx = (clientX - rect.left) / rect.width
    const ny = (clientY - rect.top) / rect.height

    const worldX = (nx - 0.5) * 24
    const worldZ = (0.5 - ny) * 24
    return { x: Math.round(worldX), y: 0, z: Math.round(worldZ) }
  }, [])

  const addRoomFromAsset = useCallback((data: any, dropPos: { x: number; y: number; z: number }) => {
    if (!design) return
    pushHistory(design)
    const newRoom: Room3D = {
      id: crypto.randomUUID(),
      name: data.label || data.type.charAt(0).toUpperCase() + data.type.slice(1),
      label: data.label || data.type.charAt(0).toUpperCase() + data.type.slice(1),
      type: data.type,
      position: { x: dropPos.x, y: 0, z: dropPos.z },
      dimensions: data.defaultDimensions || { width: 4, height: 3, depth: 4 },
      shape: 'rect',
      rotation: 0,
      color: '#FDF8E2',
      materialPreset: 'concrete',
      furniture: [],
      windows: [],
      doors: [],
    }

    const newFloors = [...design.floors]
    if (newFloors.length === 0) newFloors.push({ id: crypto.randomUUID(), level: 0, height: 3, rooms: [] })
    newFloors[0].rooms.push(newRoom)
    setDesign({ ...design, version: design.version + 1, floors: newFloors })
  }, [design, pushHistory, setDesign])

  const addFurnitureToNearestRoom = useCallback((data: any, dropPos: { x: number; y: number; z: number }) => {
    if (!design || design.floors.length === 0 || design.floors[0].rooms.length === 0) return
    const floor = design.floors[0]
    const nearest = floor.rooms.reduce((best, room) => {
      const cx = room.position.x + room.dimensions.width / 2
      const cz = room.position.z + room.dimensions.depth / 2
      const dist = (cx - dropPos.x) ** 2 + (cz - dropPos.z) ** 2
      if (!best || dist < best.dist) return { room, dist }
      return best
    }, null as { room: Room3D; dist: number } | null)?.room

    if (!nearest) return
    pushHistory(design)

    const furniture = {
      id: crypto.randomUUID(),
      name: data.label || 'Furniture',
      type: data.furnitureType || data.assetId?.replace(/^furn-/, '') || 'misc',
      position: { x: dropPos.x, y: 0, z: dropPos.z },
      dimensions: { width: 1, height: 1, depth: 1 },
    }

    const newFloors = design.floors.map((f) => ({
      ...f,
      rooms: f.rooms.map((r) =>
        r.id === nearest.id ? { ...r, furniture: [...r.furniture, furniture] } : r
      ),
    }))

    setDesign({ ...design, version: design.version + 1, floors: newFloors })
  }, [design, pushHistory, setDesign])

  const addOpeningToNearestRoom = useCallback((data: any) => {
    if (!design || design.floors.length === 0 || design.floors[0].rooms.length === 0) return
    const targetRoom = design.floors[0].rooms[0]
    pushHistory(design)

    const newFloors = design.floors.map((f) => ({
      ...f,
      rooms: f.rooms.map((r) => {
        if (r.id !== targetRoom.id) return r

        if (data.type === 'door') {
          const door = {
            wall: 'south' as const,
            offsetX: 0.5,
            width: data.width || 0.9,
            connectsTo: '',
            swingDirection: 'inward' as const,
          }
          return { ...r, doors: [...r.doors, door] }
        }

        const windowItem = {
          wall: 'north' as const,
          offsetX: 0.5,
          width: data.width || 1.2,
          height: data.height || 1,
          sillHeight: 0.9,
        }
        return { ...r, windows: [...r.windows, windowItem] }
      }),
    }))

    setDesign({ ...design, version: design.version + 1, floors: newFloors })
  }, [design, pushHistory, setDesign])

  const isRoomType = (type?: string) => {
    return ['bedroom', 'living', 'kitchen', 'bathroom', 'office', 'dining', 'garage', 'hallway'].includes(type || '')
  }

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over, activatorEvent } = event
    if (!over || over.id !== 'canvas-drop-zone') return
    if (!design) return

    const data = active.data.current as {
      assetId: string
      type: string
      label?: string
      furnitureType?: string
      width?: number
      height?: number
      defaultDimensions: any
    } | undefined
    if (!data) return
    if (!activatorEvent) return
    if (!(activatorEvent instanceof MouseEvent || activatorEvent instanceof PointerEvent || activatorEvent instanceof TouchEvent)) return

    const dropPos = getApproximateWorldPos(activatorEvent)
    if (isRoomType(data.type)) {
      addRoomFromAsset(data, dropPos)
      return
    }
    if (data.type === 'furniture') {
      addFurnitureToNearestRoom(data, dropPos)
      return
    }
    if (data.type === 'door' || data.type === 'window') {
      addOpeningToNearestRoom(data)
    }
  }, [design, getApproximateWorldPos, addRoomFromAsset, addFurnitureToNearestRoom, addOpeningToNearestRoom])

  useEffect(() => {
    if (!design || design.architecturalStyle?.name !== 'Custom Builder') {
      const blankDesign: DesignSpec = {
        id: Math.random().toString(36).substring(7),
        version: 1,
        createdAt: new Date().toISOString(),
        architecturalStyle: { name: 'Custom Builder', influences: [], description: 'Manual layout' },
        floors: [{ id: Math.random().toString(36).substring(7), level: 0, height: 3, rooms: [] }],
        totalArea: 0,
        palette: ['#C4C3E3', '#504E76', '#FDF8E2', '#A3B565', '#FCDD9D', '#F1642E'],
        notes: ''
      }
      setDesign(blankDesign)
      clearHistory()
    }
    setIsLoaded(true)
  }, [design, setDesign, clearHistory])

  if (!isLoaded || !design) return null

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <main className="w-screen h-screen bg-bg relative overflow-hidden flex">
        {/* Sidebar */}
        <BuilderSidebar />

        {/* Main Canvas Area */}
        <div className="flex-1 relative ml-[240px]">
          <CanvasDropZone>
            <SceneCanvas design={design} isScratchMode={true} />
          </CanvasDropZone>

          {/* Builder Top Toolbar */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
             <BuilderToolbar />
          </div>

        </div>
      </main>
    </DndContext>
  )
}

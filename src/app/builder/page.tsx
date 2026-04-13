'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { DndContext, DragEndEvent, DefaultDropAnimationSideEffects } from '@dnd-kit/core'
import { useDroppable } from '@dnd-kit/core'
import { useDesignStore } from '@/store/designStore'
import { BuilderSidebar } from '@/components/viewer/BuilderSidebar'
import { BuilderToolbar } from '@/components/viewer/BuilderToolbar'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
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
  const router = useRouter()
  const { design, setDesign } = useDesignStore()
  const [isLoaded, setIsLoaded] = useState(false)

  // Raycaster utility (approximate conversion for dropping from 2D screen to 3D plane)
  const getApproximateWorldPos = (evt: PointerEvent) => {
    // In a full implementation, we'd use useThree() camera inside the canvas and project it out.
    // Here we approximate based on the perspective camera center.
    // We add it to the center of the grid roughly.
    return { x: 0, y: 0, z: 0 } 
  }

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over, activatorEvent } = event
    if (!over || over.id !== 'canvas-drop-zone') return
    if (!design) return

    // Rough conversion
    // If the active item is a room, add it!
    const data = active.data.current as { assetId: string, type: string, defaultDimensions: any } | undefined
    if (data?.type === 'bedroom' || data?.type === 'living' || data?.type === 'kitchen' || data?.type === 'bathroom' || data?.type === 'office' || data?.type === 'dining' || data?.type === 'garage' || data?.type === 'hallway') {
      const newRoom: Room3D = {
        id: crypto.randomUUID(),
        name: data.type.charAt(0).toUpperCase() + data.type.slice(1),
        type: data.type,
        position: { x: (Math.random() - 0.5) * 10, y: 0, z: (Math.random() - 0.5) * 10 }, // We drop randomly near center unless we deeply integrate R3F camera state
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

      setDesign({ ...design, floors: newFloors })
    }
  }, [design, setDesign])

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
    }
    setIsLoaded(true)
  }, [design, setDesign])

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

          <div className="absolute top-6 right-6 z-50">
            <ThemeToggle />
          </div>
        </div>
      </main>
    </DndContext>
  )
}

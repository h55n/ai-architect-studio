import { motion } from 'framer-motion'
import { Undo2, Redo2, Sparkles, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useDesignStore } from '@/store/designStore'
import { useBuilderStore } from '@/store/builderStore'
import { useViewerStore } from '@/store/viewerStore'
import { useArchitectAgent } from '@/hooks/useArchitectAgent'

function CtrlBtn({ icon: Icon, label, onClick, disabled = false }: { icon: any; label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group flex items-center justify-center flex-col gap-1 px-3 py-2 rounded-[var(--radius-sm)] transition-all
        bg-transparent text-text-secondary hover:bg-accent-soft hover:text-accent disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      <Icon size={16} />
      <span className="font-mono text-[9px] tracking-widest uppercase">{label}</span>
    </button>
  )
}

export function BuilderToolbar() {
  const { design, updateDesign } = useDesignStore()
  const { selectedRoomId, setSelectedRoom } = useViewerStore()
  const { pushHistory, undo, redo, past, future } = useBuilderStore()
  const { update } = useArchitectAgent()
  const [isRefining, setIsRefining] = useState(false)

  const handleUndo = () => {
    if (!design) return
    const previous = undo(design)
    if (previous) updateDesign(previous)
  }

  const handleRedo = () => {
    if (!design) return
    const next = redo(design)
    if (next) updateDesign(next)
  }
  
  const handleRefine = async () => {
    if (!design || isRefining) return
    const instruction = window.prompt('Describe how to refine this layout:')
    if (!instruction?.trim()) return
    pushHistory(design)
    setIsRefining(true)
    try {
      await update(design, instruction.trim())
    } finally {
      setIsRefining(false)
    }
  }

  const handleDeleteRoom = () => {
    if (!design || !selectedRoomId) return
    pushHistory(design)
    const newFloors = design.floors.map(f => ({
      ...f,
      rooms: f.rooms.filter(r => r.id !== selectedRoomId)
    }))
    updateDesign({ ...design, version: design.version + 1, floors: newFloors })
    setSelectedRoom(null)
  }

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex flex-col gap-2 pointer-events-none"
    >
      <div className="glass rounded-[var(--radius-md)] p-1.5 flex items-center gap-1 pointer-events-auto">
        <CtrlBtn icon={Undo2} label="Undo" onClick={handleUndo} disabled={past.length === 0} />
        <CtrlBtn icon={Redo2} label="Redo" onClick={handleRedo} disabled={future.length === 0} />
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <CtrlBtn icon={Sparkles} label={isRefining ? 'Refining' : 'Refine'} onClick={handleRefine} disabled={isRefining} />
        
        {selectedRoomId && (
          <>
            <div className="w-px h-6 bg-border mx-1" />
            <CtrlBtn icon={Trash2} label="Del" onClick={handleDeleteRoom} />
          </>
        )}
      </div>
    </motion.div>
  )
}

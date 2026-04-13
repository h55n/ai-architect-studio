import { motion } from 'framer-motion'
import { Undo2, Redo2, Sparkles, Trash2 } from 'lucide-react'
import { useDesignStore } from '@/store/designStore'
import { useViewerStore } from '@/store/viewerStore'

function CtrlBtn({ icon: Icon, label, onClick }: { icon: any; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center justify-center flex-col gap-1 px-3 py-2 rounded-[var(--radius-sm)] transition-all
        bg-transparent text-text-secondary hover:bg-accent-soft hover:text-accent`}
    >
      <Icon size={16} />
      <span className="font-mono text-[9px] tracking-widest uppercase">{label}</span>
    </button>
  )
}

export function BuilderToolbar() {
  const { design, updateDesign } = useDesignStore()
  const { selectedRoomId, setSelectedRoom } = useViewerStore()

  // Simplified stubs, robust undo stack requires a history store module
  const handleUndo = () => console.log('Undo triggered')
  const handleRedo = () => console.log('Redo triggered')
  
  const handleRefine = () => {
    console.log('Sending layout to Mistral API for AI refinement layout pass...')
  }

  const handleDeleteRoom = () => {
    if (!design || !selectedRoomId) return
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
        <CtrlBtn icon={Undo2} label="Undo" onClick={handleUndo} />
        <CtrlBtn icon={Redo2} label="Redo" onClick={handleRedo} />
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <CtrlBtn icon={Sparkles} label="Refine" onClick={handleRefine} />
        
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

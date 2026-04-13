'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useViewerControls } from '@/hooks/useViewerControls'
import { MATERIAL_PRESETS } from '@/lib/materialPresets'
import { Layers, ScanLine, Palette, LayoutGrid, RotateCcw, MessageSquarePlus, Loader2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { useArchitectAgent } from '@/hooks/useArchitectAgent'
import { useDesignStore } from '@/store/designStore'

export function ControlBar() {
  const {
    exploded,
    xrayEnabled,
    xrayClipY,
    materialPreset,
    viewMode,
    toggleExploded,
    toggleXray,
    setXrayClipY,
    cycleMaterial,
    setViewMode,
  } = useViewerControls()

  const preset = MATERIAL_PRESETS[materialPreset]
  const toggle2D = () => setViewMode(viewMode === '2d' ? 'normal' : '2d')

  // Global Add Prompt state
  const [showAdd, setShowAdd] = useState(false)
  const [input, setInput] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const { update } = useArchitectAgent()
  const design = useDesignStore((s) => s.design)

  const handleGlobalAdd = async () => {
    if (!input.trim() || isUpdating || !design) return
    setIsUpdating(true)
    try {
      await update(design, input.trim())
      setInput('')
      setShowAdd(false)
    } catch {
      alert("Update failed. Try again.") // Simple fallback
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      
      {/* Global Add Prompt Popover */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="glass"
            style={{
              padding: '16px 20px',
              borderRadius: 'var(--radius-lg)',
              width: 320,
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}
          >
            <span style={{ fontFamily: 'var(--font-space-mono)', fontSize: 10, color: 'var(--peach)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              What do you want to add?
            </span>
            <input
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleGlobalAdd()
                if (e.key === 'Escape') setShowAdd(false)
              }}
              placeholder='e.g. "add king bed in master"'
              disabled={isUpdating}
              className="quiz-input"
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--border)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-space-grotesk)',
                fontSize: 14,
                outline: 'none',
                paddingBottom: 6,
                opacity: isUpdating ? 0.5 : 1,
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 4 }}>
              <button
                onClick={() => setShowAdd(false)}
                disabled={isUpdating}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleGlobalAdd}
                disabled={!input.trim() || isUpdating}
                style={{
                  background: 'var(--accent)', color: '#FFFFFF', border: 'none', borderRadius: 'var(--radius-md)',
                  padding: '6px 14px', fontSize: 13, fontWeight: 500, cursor: input.trim() && !isUpdating ? 'pointer' : 'not-allowed',
                  opacity: input.trim() && !isUpdating ? 1 : 0.5, display: 'flex', alignItems: 'center', gap: 6
                }}
              >
                {isUpdating ? <Loader2 size={12} className="animate-spin" /> : 'Add →'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        id="viewer-control-bar"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="control-bar"
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <CtrlBtn
          icon={<RotateCcw size={15} strokeWidth={1.5} />}
          label="Orbit"
          active={false}
          onClick={() => {}}
        />

        <Divider />

        <CtrlBtn
          icon={<Layers size={15} strokeWidth={1.5} />}
          label="Explode"
          active={exploded}
          onClick={toggleExploded}
        />

        <Divider />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <CtrlBtn
            icon={<ScanLine size={15} strokeWidth={1.5} />}
            label="X-Ray"
            active={xrayEnabled}
            onClick={toggleXray}
          />
          <AnimatePresence>
            {xrayEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <input
                  type="range"
                  min={0.5} max={10} step={0.1}
                  value={xrayClipY}
                  onChange={(e) => setXrayClipY(parseFloat(e.target.value))}
                  style={{ width: 64, height: 2, accentColor: 'var(--accent)', cursor: 'pointer', display: 'block' }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Divider />

        <CtrlBtn
          icon={<Palette size={15} strokeWidth={1.5} />}
          label={preset.label}
          active={false}
          onClick={cycleMaterial}
        />

        <Divider />

        <CtrlBtn
          icon={<LayoutGrid size={15} strokeWidth={1.5} />}
          label={viewMode === '2d' ? '3D' : '2D'}
          active={viewMode === '2d'}
          onClick={toggle2D}
        />

        <Divider />

        <CtrlBtn
          icon={<MessageSquarePlus size={15} strokeWidth={1.5} />}
          label="Add..."
          active={showAdd}
          onClick={() => setShowAdd(!showAdd)}
        />
      </motion.div>
    </div>
  )
}

function Divider() {
  return <div style={{ width: 1, height: 24, background: 'var(--border)', margin: '0 6px' }} />
}

function CtrlBtn({ icon, label, active, onClick }: { icon: ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`control-btn flex flex-col items-center gap-[3px] ${active ? 'active' : ''}`}>
      {icon}
      <span style={{ letterSpacing: '0.15em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
        {label}
      </span>
    </button>
  )
}

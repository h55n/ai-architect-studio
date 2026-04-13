'use client'

import { useState } from 'react'
import { Html } from '@react-three/drei'
import { useViewerStore } from '@/store/viewerStore'
import { useArchitectAgent } from '@/hooks/useArchitectAgent'
import { Loader2, X } from 'lucide-react'
import type { DesignSpec } from '@/types/design.types'

interface HoverPromptProps {
  design: DesignSpec
}

export function HoverPrompt({ design }: HoverPromptProps) {
  const { hoverPrompt, setHoverPrompt, selectedRoomId } = useViewerStore()
  const { update } = useArchitectAgent()
  const [input, setInput] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!hoverPrompt.visible || !selectedRoomId) return null

  const currentRoom = design.floors
    .flatMap((f) => f.rooms)
    .find((r) => r.id === selectedRoomId)

  const handleSubmit = async () => {
    if (!input.trim() || isUpdating) return
    setIsUpdating(true)
    setError(null)
    try {
      const instruction = `In the ${currentRoom?.name ?? 'room'}: ${input.trim()}`
      await update(design, instruction)
      setHoverPrompt({ visible: false })
      setInput('')
    } catch {
      setError("Update failed. Try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
    if (e.key === 'Escape') {
      setHoverPrompt({ visible: false })
      setError(null)
    }
  }

  return (
    <Html
      position={hoverPrompt.position}
      center
      distanceFactor={10}
      portal={{ current: document.getElementById('html-root')! }}
      style={{ pointerEvents: 'all' }}
      zIndexRange={[100, 0]}
    >
      <div
        style={{
          width: 240,
          borderRadius: 12,
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--shadow-glass)',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontFamily: 'var(--font-space-mono)',
            fontSize: 10,
            color: 'var(--peach)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}>
            {currentRoom?.name ?? 'Room'}
          </span>
          <button
            onClick={() => {
              setHoverPrompt({ visible: false })
              setError(null)
            }}
            style={{
              color: 'var(--text-muted)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 2,
              lineHeight: 1,
            }}
          >
            <X size={10} />
          </button>
        </div>

        {/* Input row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            autoFocus
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              if (error) setError(null)
            }}
            onKeyDown={handleKeyDown}
            placeholder="Add something..."
            disabled={isUpdating}
            className="quiz-input"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid var(--border)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-space-grotesk)',
              fontSize: 13,
              outline: 'none',
              paddingBottom: 4,
              opacity: isUpdating ? 0.5 : 1,
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isUpdating}
            style={{
              background: 'var(--accent)',
              border: 'none',
              borderRadius: 8,
              padding: '5px 10px',
              color: '#FFFFFF', // Keep button text white for contrast on accent
              fontFamily: 'var(--font-space-grotesk)',
              fontSize: 12,
              fontWeight: 500,
              cursor: input.trim() && !isUpdating ? 'pointer' : 'not-allowed',
              opacity: input.trim() && !isUpdating ? 1 : 0.45,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              transition: 'opacity 150ms ease',
              whiteSpace: 'nowrap',
            }}
          >
            {isUpdating ? (
              <Loader2 size={11} className="animate-spin" />
            ) : (
              'Add →'
            )}
          </button>
        </div>

        {error && (
          <span style={{
            fontFamily: 'var(--font-space-mono)',
            fontSize: 9,
            color: 'var(--orange)',
          }}>
            {error}
          </span>
        )}

        {/* Hint */}
        {!isUpdating && !error && (
          <span style={{
            fontFamily: 'var(--font-space-mono)',
            fontSize: 8,
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
          }}>
            ENTER TO SUBMIT · ESC TO CLOSE
          </span>
        )}
      </div>
    </Html>
  )
}

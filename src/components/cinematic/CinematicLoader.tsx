'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { motion, AnimatePresence } from 'framer-motion'
import { BlueprintGrid } from './BlueprintGrid'
import { TypewriterSpecs } from './TypewriterSpecs'
import { WireframeExtrusion } from './WireframeExtrusion'
import type { UserProfile } from '@/types/quiz.types'

interface CinematicLoaderProps {
  profile: UserProfile
  progress: number      // 0–100 from architect agent
  onComplete: () => void
}

type Phase = 'blueprint' | 'specs' | 'wireframe' | 'done'

export function CinematicLoader({ profile, progress, onComplete }: CinematicLoaderProps) {
  const [phase, setPhase] = useState<Phase>('blueprint')
  const [showSkip, setShowSkip] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    // Show skip button after 2s
    const skipTimer = setTimeout(() => setShowSkip(true), 2000)

    // GSAP-orchestrated phase transitions
    const tl = gsap.timeline({
      onComplete: () => {
        if (progress >= 100) onComplete()
      },
    })
    timelineRef.current = tl

    tl.call(() => setPhase('blueprint'))
      .to({}, { duration: 2.5 })
      .call(() => setPhase('specs'))
      .to({}, { duration: 3 })
      .call(() => setPhase('wireframe'))
      .to({}, { duration: 3 })
      .call(() => setPhase('done'))

    return () => {
      clearTimeout(skipTimer)
      tl.kill()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // If AI finishes early AND we're past specs phase, complete
  useEffect(() => {
    if (progress >= 100 && phase === 'done') {
      onComplete()
    }
  }, [progress, phase, onComplete])

  const handleSkip = () => {
    timelineRef.current?.kill()
    if (progress >= 100) {
      onComplete()
    } else {
      setPhase('done')
    }
  }

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 overflow-hidden bg-[#0E0D14]">
      {/* Always-visible blueprint grid */}
      <BlueprintGrid />

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 pt-8">
          <p className="font-mono text-xs text-[var(--color-accent)] tracking-[0.3em] uppercase">
            AI Architect Studio
          </p>
          <AnimatePresence>
            {showSkip && (
              <motion.button
                id="cinematic-skip"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleSkip}
                className="
                  font-mono text-xs text-[var(--color-violet-light)]/60
                  hover:text-[var(--color-violet-light)]
                  transition-colors cursor-pointer
                  tracking-widest uppercase
                "
              >
                Skip →
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Main area */}
        <div className="flex flex-1 items-center justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-5xl px-8">
            {/* Left: Specs */}
            <div className="space-y-8">
              <AnimatePresence mode="wait">
                {(phase === 'specs' || phase === 'wireframe' || phase === 'done') && (
                  <motion.div
                    key="specs"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <p className="font-mono text-[10px] text-[var(--color-accent)] tracking-[0.4em] uppercase mb-4">
                      Design Parameters
                    </p>
                    <TypewriterSpecs profile={profile} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Progress meter */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-mono text-[10px] text-[var(--color-violet-light)]/50 tracking-widest uppercase">
                    Generating
                  </span>
                  <span className="font-mono text-[10px] text-[var(--color-accent)]">
                    {progress}%
                  </span>
                </div>
                <div className="h-px bg-[var(--color-violet-dark)]/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[var(--color-accent)]"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>

            {/* Right: 3D Wireframe */}
            <AnimatePresence>
              {(phase === 'wireframe' || phase === 'done') && (
                <motion.div
                  key="wireframe"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.2 }}
                  className="h-64 lg:h-80"
                >
                  <WireframeExtrusion />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom: phase indicator */}
        <div className="flex items-center justify-center gap-3 pb-8">
          {(['blueprint', 'specs', 'wireframe'] as Phase[]).map((p) => (
            <div
              key={p}
              className={`h-px w-8 transition-all duration-700 ${
                phase === p || (p === 'blueprint' && ['specs', 'wireframe', 'done'].includes(phase))
                  ? 'bg-[var(--color-accent)] w-12'
                  : 'bg-[var(--color-violet-dark)]/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

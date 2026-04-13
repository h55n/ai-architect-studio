'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useDesignStore } from '@/store/designStore'
import { useQuizStore } from '@/store/quizStore'
import { ControlBar } from '@/components/viewer/ControlBar'
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'

// Dynamic import — R3F must not SSR
const SceneCanvas = dynamic(
  () => import('@/components/viewer/SceneCanvas').then((m) => m.SceneCanvas),
  { ssr: false }
)

export default function ViewerPage() {
  const router = useRouter()
  const { design, isGenerating, generationError } = useDesignStore()
  const { profile } = useQuizStore()

  // If no design and no profile, redirect to quiz/home
  useEffect(() => {
    if (!isGenerating && !design && !profile) {
      router.replace('/')
    }
  }, [design, isGenerating, profile, router])

  return (
    <main className="w-screen h-screen bg-bg relative overflow-hidden">
      {/* Loading overlay */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-bg"
          >
            <div className="text-center space-y-4">
              <Loader2 size={40} className="animate-spin text-accent mx-auto" strokeWidth={1.5} />
              <p className="font-heading text-2xl font-light text-text-primary">
                Your architect is designing…
              </p>
              <p className="font-mono text-xs text-text-secondary tracking-widest">
                This may take 10–20 seconds
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error state */}
      {generationError && !design && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-bg gap-4">
          <AlertCircle size={40} className="text-orange" strokeWidth={1.5} />
          <p className="font-heading text-2xl font-light text-text-primary text-center max-w-md">
            {generationError}
          </p>
          <Button variant="glass" size="sm" onClick={() => router.push('/')}>
            <ArrowLeft size={14} />
            Try again
          </Button>
        </div>
      )}

      {/* 3D Canvas */}
      {design && (
        <>
          <SceneCanvas design={design} isScratchMode={false} />

          {/* HUD overlay */}
          <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
            <div className="flex items-start justify-between px-6 pt-6">
              {/* Back button */}
              <Button
                id="viewer-back"
                variant="glass"
                size="sm"
                onClick={() => router.push('/')}
                className="pointer-events-auto"
              >
                <ArrowLeft size={14} />
                Home
              </Button>

              {/* Design info */}
              <div className="glass rounded-[var(--radius-md)] px-4 py-2 text-right mr-16">
                <p className="font-heading text-sm font-light text-text-primary">
                  {design.architecturalStyle.name}
                </p>
                <p className="font-mono text-[10px] text-text-secondary tracking-widest uppercase">
                  AI MODE · v{design.version}
                </p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <ControlBar />

          {/* Mobile fallback */}
          <div className="md:hidden absolute inset-0 z-50 flex items-center justify-center bg-bg/95 px-8">
            <div className="text-center space-y-4">
              <p className="font-heading text-2xl font-light text-text-primary">
                Best on Desktop
              </p>
              <p className="font-body text-sm text-text-secondary">
                The 3D viewer is optimized for desktop. Rotate your device or open on a larger screen.
              </p>
            </div>
          </div>
        </>
      )}
    </main>
  )
}

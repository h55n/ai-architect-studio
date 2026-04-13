import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useQuizStore } from '@/store/quizStore'
import type { UserProfile } from '@/types/quiz.types'

interface CinematicLoaderProps {
  profile: UserProfile
  progress: number // from useArchitectAgent (10 -> 30 -> 100)
  onComplete: () => void
}

const STAGES = [
  { label: 'Reading your preferences...', duration: 2000 },
  { label: 'Choosing architectural style...', duration: 3000 },
  { label: 'Planning room layout...', duration: 4000 },
  { label: 'Placing walls and structure...', duration: 5000 },
  { label: 'Adding windows and doors...', duration: 4000 },
  { label: 'Finishing details...', duration: 3000 },
]

export function CinematicLoader({ profile, progress, onComplete }: CinematicLoaderProps) {
  const { brief } = useQuizStore()
  const [stageIndex, setStageIndex] = useState(0)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (stageIndex < STAGES.length - 1) {
      timer = setTimeout(() => {
        setStageIndex((prev) => prev + 1)
      }, STAGES[stageIndex].duration)
    }
    return () => clearTimeout(timer)
  }, [stageIndex])

  // Complete condition: API is at 100 AND animation reached final stage
  useEffect(() => {
    if (progress === 100 && stageIndex === STAGES.length - 1) {
      const timer = setTimeout(onComplete, 1000)
      return () => clearTimeout(timer)
    }
  }, [progress, stageIndex, onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-bg"
    >
      <div className="max-w-2xl w-full px-8 text-center space-y-12">
        <motion.div
          key="spinner"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Loader2 className="animate-spin text-accent mx-auto" size={48} strokeWidth={1} />
        </motion.div>

        <div className="space-y-4">
          <AnimatePresence mode="wait">
            <motion.h2
              key={stageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="font-heading text-3xl font-light text-text-primary h-12"
            >
              {STAGES[stageIndex].label}
            </motion.h2>
          </AnimatePresence>

          <p className="font-mono text-xs text-text-secondary tracking-widest uppercase">
            Architect Assistant Active
          </p>
        </div>

        {brief && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="glass-card p-8 mt-12 bg-surface backdrop-blur-xl border border-border"
          >
            <h3 className="font-heading text-xl text-accent mb-4">Design Brief: {brief.style}</h3>
            <p className="font-body text-text-secondary leading-relaxed italic mb-6">
              &quot;{brief.concept}&quot;
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {brief.keyFeatures.slice(0, 3).map((feature, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-surface-2 rounded-full text-[10px] uppercase tracking-wider font-mono text-text-secondary border border-border"
                >
                  {feature}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        <div className="w-64 max-w-full h-1 bg-surface-2 rounded-full mx-auto overflow-hidden mt-8">
          <motion.div
            className="h-full bg-accent"
            initial={{ width: '0%' }}
            animate={{
              width: `${Math.min(
                100,
                Math.max(
                  progress,
                  ((stageIndex + 1) / STAGES.length) * 100
                )
              )}%`,
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  )
}

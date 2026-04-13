'use client'

import { motion } from 'framer-motion'

interface ProgressBarProps {
  current: number
  max: number
}

export function ProgressBar({ current, max }: ProgressBarProps) {
  const pct = Math.min((current / max) * 100, 100)

  return (
    <div className="w-full" role="progressbar" aria-valuenow={current} aria-valuemax={max}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-mono text-[var(--text-secondary)] tracking-widest uppercase">
          Question {current} of {max}
        </span>
        <span className="text-xs font-mono text-[var(--color-accent)]">
          {Math.round(pct)}%
        </span>
      </div>
      <div className="h-0.5 w-full bg-[var(--border-color)] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[var(--color-violet-dark)] to-[var(--color-accent)]"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

'use client'

import { motion } from 'framer-motion'

interface QuestionCardProps {
  content: string
  children: React.ReactNode
}

export function QuestionCard({ content, children }: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-[var(--color-accent)] rounded-full" />
          <span className="text-xs font-mono text-[var(--color-accent)] tracking-[0.2em] uppercase">
            Your Space
          </span>
        </div>
        <h2 className="font-heading text-[clamp(1.6rem,3.5vw,2.8rem)] font-light leading-tight text-[var(--text-primary)]">
          {content}
        </h2>
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </motion.div>
  )
}

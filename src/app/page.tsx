'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { QuizShell } from '@/components/quiz/QuizShell'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { BoxSelect, Bot } from 'lucide-react'

export default function HomePage() {
  const [showQuiz, setShowQuiz] = useState(false)
  const router = useRouter()

  if (showQuiz) {
    return (
      <main className="min-h-screen relative overflow-hidden bg-bg">
        <ThemeToggle />
        <QuizShell />
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col px-8 py-16 relative overflow-hidden bg-bg">
      <ThemeToggle />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex justify-between items-center z-10 max-w-5xl mx-auto"
      >
        <div className="font-mono text-xs tracking-widest uppercase text-text-secondary flex items-center gap-3">
          <BoxSelect size={16} className="text-accent" />
          AI Architect Studio
        </div>
      </motion.div>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 mt-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-text-primary text-center max-w-2xl font-heading mb-16 text-[56px] leading-none"
        >
          Design your space.
        </motion.h1>

        <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl justify-center">
          {/* AI Path */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="group flex-1 bg-surface border border-border rounded-xl p-8 hover:bg-surface-2 hover:border-accent hover:-translate-y-1 hover:shadow-card transition-all duration-200 cursor-pointer"
            onClick={() => setShowQuiz(true)}
          >
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-6">
              <Bot size={24} className="text-accent" />
            </div>
            <h3 className="text-2xl text-text-primary mb-3">Build with AI</h3>
            <p className="text-text-secondary font-mono text-sm leading-relaxed mb-8 opacity-80 h-20">
              6 questions.<br />
              AI builds your home from scratch.
            </p>
            <div className="text-text-primary border border-border px-5 py-2.5 rounded-lg bg-transparent font-mono text-xs tracking-wide group-hover:bg-accent group-hover:text-surface group-hover:border-accent transition-all inline-flex items-center gap-2">
              Start Quiz →
            </div>
          </motion.div>

          {/* Builder Path */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="group flex-1 bg-surface border border-border rounded-xl p-8 hover:bg-surface-2 hover:border-accent hover:-translate-y-1 hover:shadow-card transition-all duration-200 cursor-pointer"
            onClick={() => router.push('/builder')}
          >
            <div className="w-12 h-12 flex items-center justify-center mb-6">
              <BoxSelect size={24} className="text-text-primary group-hover:text-accent transition-colors" />
            </div>
            <h3 className="text-2xl text-text-primary mb-3">Build Yourself</h3>
            <p className="text-text-secondary font-mono text-sm leading-relaxed mb-8 opacity-80 h-20">
              Blank canvas.<br />
              Drag walls, rooms, and furniture.
            </p>
            <div className="text-text-primary border border-border px-5 py-2.5 rounded-lg bg-transparent font-mono text-xs tracking-wide group-hover:bg-accent group-hover:text-surface group-hover:border-accent transition-all inline-flex items-center gap-2">
              Open Canvas →
            </div>
          </motion.div>
        </div>

        {/* Recent Designs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 w-full max-w-4xl text-left"
        >
          <div className="font-mono text-[10px] uppercase tracking-widest text-text-muted mb-4">
            Recent Designs
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-16 border border-border border-dashed rounded-lg flex flex-col justify-center px-4 hover:border-accent/50 cursor-pointer transition-colors opacity-50">
              <span className="font-heading text-sm text-text-primary">Blank Layout</span>
              <span className="font-mono text-[9px] text-text-secondary">Custom Builder · v1</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-violet-light/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sage/10 blur-[100px] rounded-full -translate-x-1/4 translate-y-1/4" />
      </div>
    </main>
  )
}

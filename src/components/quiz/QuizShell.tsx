'use client'

import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useQuizAgent } from '@/hooks/useQuizAgent'
import { useQuizStore } from '@/store/quizStore'
import { useArchitectAgent } from '@/hooks/useArchitectAgent'
import { ProgressBar } from './ProgressBar'
import { QuestionCard } from './QuestionCard'
import { FreeTextInput } from './FreeTextInput'
import { MultiChoiceInput } from './MultiChoiceInput'
import { AlertCircle, Loader2 } from 'lucide-react'
import { CinematicLoader } from '@/components/cinematic/CinematicLoader'

export function QuizShell() {
  const router = useRouter()
  const { currentQuestion, questionCount, maxQuestions, isLoading, isComplete, error, sendMessage, start } =
    useQuizAgent()
  const { profile, setBrief } = useQuizStore()
  const { generate, generationProgress, generationError, design } = useArchitectAgent()
  const isCompleteTriggered = useRef(false)

  // Start quiz on mount
  useEffect(() => {
    start()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // On complete, trigger architect agent ONCE
  useEffect(() => {
    if (isComplete && profile && !isCompleteTriggered.current) {
      isCompleteTriggered.current = true
      generate(profile, setBrief)
    }
  }, [isComplete, profile, generate, setBrief])

  if (isComplete && profile) {
    if (generationError) {
      return (
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle size={40} className="text-orange" />
          <p className="font-mono text-sm text-orange">{generationError}</p>
          <button onClick={() => window.location.reload()} className="text-xs uppercase tracking-widest underline text-text-secondary">Try Again</button>
        </div>
      )
    }

    return (
      <CinematicLoader 
        profile={profile}
        progress={generationProgress}
        onComplete={() => router.push('/viewer')}
      />
    )
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-2"
      >
        <p className="text-xs font-mono tracking-[0.3em] text-accent uppercase">
          AI Architect Studio
        </p>
        <h1 className="font-heading text-[clamp(2rem,5vw,3.5rem)] font-light gradient-text">
          Your Space, Designed
        </h1>
        <p className="text-sm text-text-secondary font-body">
          Answer a few questions and watch your dream home come to life.
        </p>
      </motion.div>

      {/* Progress */}
      {questionCount > 0 && (
        <ProgressBar current={questionCount} max={maxQuestions} />
      )}

      {/* Question + Input */}
      <AnimatePresence mode="wait">
        {isLoading && !currentQuestion && (
          <motion.div
            key="initial-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-32"
          >
            <Loader2 className="animate-spin text-accent" size={28} strokeWidth={1.5} />
          </motion.div>
        )}

        {currentQuestion?.type === 'question' && (
          <motion.div key={currentQuestion.content} className="space-y-4">
            <QuestionCard content={currentQuestion.content}>
              {currentQuestion.inputType === 'free_text' ? (
                <FreeTextInput onSubmit={sendMessage} disabled={isLoading} />
              ) : (
                <MultiChoiceInput
                  options={currentQuestion.options}
                  onSubmit={sendMessage}
                  disabled={isLoading}
                />
              )}
            </QuestionCard>
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <Loader2 size={12} className="animate-spin" />
                <span className="font-mono">Thinking…</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] bg-orange/10 border border-orange/30"
        >
          <AlertCircle size={16} className="text-orange flex-shrink-0" />
          <p className="text-sm text-orange">{error}</p>
        </motion.div>
      )}
    </div>
  )
}

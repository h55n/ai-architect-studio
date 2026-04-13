'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface MultiChoiceInputProps {
  options: string[]
  onSubmit: (value: string) => void
  disabled?: boolean
}

export function MultiChoiceInput({ options, onSubmit, disabled = false }: MultiChoiceInputProps) {
  const [selected, setSelected] = useState<string | null>(null)

  const handleSelect = (option: string) => {
    if (disabled) return
    setSelected(option)
  }

  const handleSubmit = () => {
    if (!selected || disabled) return
    onSubmit(selected)
    setSelected(null)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {options.map((option, i) => (
          <motion.button
            key={option}
            id={`quiz-option-${i}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3, ease: 'easeOut' }}
            onClick={() => handleSelect(option)}
            disabled={disabled}
            className={`
              relative
              text-left px-4 py-3
              rounded-[var(--radius-md)]
              border transition-all duration-[var(--transition-fast)]
              font-body text-sm
              cursor-pointer
              ${selected === option
                ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/8 text-[var(--text-primary)]'
                : 'border-[var(--border-color)] bg-transparent text-[var(--text-primary)] hover:border-[var(--color-violet-light)] hover:bg-[var(--color-violet-light)]/5'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            <div className="flex items-center justify-between gap-2">
              <span>{option}</span>
              {selected === option && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-5 h-5 rounded-full bg-[var(--color-accent)] flex items-center justify-center flex-shrink-0"
                >
                  <Check size={10} color="white" />
                </motion.div>
              )}
            </div>
          </motion.button>
        ))}
      </div>
      <div className="flex justify-end">
        <Button
          id="quiz-multi-choice-submit"
          onClick={handleSubmit}
          disabled={!selected || disabled}
          size="sm"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}

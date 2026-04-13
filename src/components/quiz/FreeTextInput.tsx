'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'

interface FreeTextInputProps {
  onSubmit: (value: string) => void
  disabled?: boolean
  placeholder?: string
}

export function FreeTextInput({ onSubmit, disabled = false, placeholder }: FreeTextInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSubmit(trimmed)
    setValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="space-y-3">
      <textarea
        ref={textareaRef}
        id="quiz-free-text-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder || 'Share your thoughts…'}
        rows={3}
        className="
          w-full resize-none
          bg-transparent
          border border-[var(--border-color)]
          rounded-[var(--radius-md)]
          px-4 py-3
          text-base text-[var(--text-primary)]
          placeholder-[var(--text-secondary)]/50
          font-body
          quiz-input
          transition-all duration-[var(--transition-base)]
          focus:outline-none
          disabled:opacity-50
        "
      />
      <div className="flex justify-between items-center">
        <p className="text-xs text-[var(--text-secondary)]">
          Press <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[var(--border-color)]">Enter</kbd> to continue
        </p>
        <Button
          id="quiz-free-text-submit"
          onClick={handleSubmit}
          disabled={!value.trim() || disabled}
          size="sm"
        >
          Continue
          <ArrowRight size={14} />
        </Button>
      </div>
    </div>
  )
}

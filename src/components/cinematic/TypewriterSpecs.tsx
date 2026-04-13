'use client'

import { useEffect, useRef, useState } from 'react'
import type { UserProfile } from '@/types/quiz.types'

interface TypewriterSpecsProps {
  profile: UserProfile
}

// Generate spec lines from profile
function buildSpecLines(profile: UserProfile): string[] {
  return [
    `STYLE     ${profile.preferredStyle.toUpperCase()}`,
    `FLOORS    ${profile.roomRequirements.bedrooms > 3 ? '2' : '1'} FLOORS  ·  ${
      profile.roomRequirements.bedrooms
    } BED  ·  ${profile.roomRequirements.bathrooms} BATH`,
    `CLIMATE   ${profile.climate.toUpperCase()}`,
    `BUDGET    ${profile.budget.toUpperCase()} TIER`,
    `PRIORITY  ${profile.priorities.slice(0, 2).join('  ·  ').toUpperCase()}`,
  ]
}

export function TypewriterSpecs({ profile }: TypewriterSpecsProps) {
  const lines = buildSpecLines(profile)
  const [displayedLines, setDisplayedLines] = useState<string[]>([])
  const [currentLine, setCurrentLine] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (currentLine >= lines.length) return

    intervalRef.current = setInterval(() => {
      setCurrentChar((c) => {
        const next = c + 1
        if (next > lines[currentLine].length) {
          clearInterval(intervalRef.current!)
          setTimeout(() => {
            setDisplayedLines((prev) => [...prev, lines[currentLine]])
            setCurrentLine((l) => l + 1)
            setCurrentChar(0)
          }, 120)
          return c
        }
        return next
      })
    }, 28)

    return () => clearInterval(intervalRef.current!)
  }, [currentLine, lines])

  const activeLine = currentLine < lines.length
    ? lines[currentLine].slice(0, currentChar)
    : ''

  return (
    <div className="space-y-1" aria-label="Design specifications">
      {displayedLines.map((line, i) => (
        <p key={i} className="font-mono text-sm text-[var(--color-violet-light)] tracking-widest">
          {line}
        </p>
      ))}
      {currentLine < lines.length && (
        <p className="font-mono text-sm text-[var(--color-accent)] tracking-widest">
          {activeLine}
          <span className="animate-pulse">█</span>
        </p>
      )}
    </div>
  )
}

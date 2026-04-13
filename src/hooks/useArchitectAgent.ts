'use client'

import { useCallback } from 'react'
import { useDesignStore } from '@/store/designStore'
import type { ArchitectRequest, ArchitectResponse, DesignSpec } from '@/types/design.types'
import type { UserProfile } from '@/types/quiz.types'

export function useArchitectAgent() {
  const {
    design,
    isGenerating,
    generationError,
    generationProgress,
    setDesign,
    setGenerating,
    setGenerationError,
    setGenerationProgress,
  } = useDesignStore()

  const generate = useCallback(async (profile: UserProfile, setBriefCallback: (b: any) => void) => {
    setGenerating(true)
    setGenerationError(null)
    setGenerationProgress(10) // Stage 1 starting

    try {
      // PHASE 1: Plan
      const planRes = await fetch('/api/architect/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      })
      const planData = await planRes.json()
      if (!planRes.ok || !planData.success || !planData.brief) {
        throw new Error(planData.error ?? `Plan API Error ${planRes.status}`)
      }
      setBriefCallback(planData.brief)
      setGenerationProgress(50) // Stage 3 starting

      // PHASE 2: Geometry
      const designRes = await fetch('/api/architect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'CREATE', profile, brief: planData.brief }),
      })
      const designData: ArchitectResponse = await designRes.json()
      
      if (!designRes.ok || !designData.success || !designData.design) {
        throw new Error(designData.error ?? `Geometry API Error ${designRes.status}`)
      }

      setDesign(designData.design)
      setGenerationProgress(100)
      return designData.design
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setGenerationError(`Generation failed: ${message}`)
      return null
    } finally {
      setGenerating(false)
    }
  }, [setDesign, setGenerating, setGenerationError, setGenerationProgress])

  const update = useCallback(async (existingDesign: DesignSpec, instruction: string) => {
    setGenerating(true)
    setGenerationError(null)

    const body: ArchitectRequest = { mode: 'UPDATE', existingDesign, instruction }

    try {
      const res = await fetch('/api/architect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data: ArchitectResponse = await res.json()

      if (!res.ok || !data.success || !data.design) {
        throw new Error(data.error ?? `HTTP ${res.status}`)
      }

      setDesign(data.design)
      return data.design
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setGenerationError(`Design update failed: ${message}`)
      return null
    } finally {
      setGenerating(false)
    }
  }, [setDesign, setGenerating, setGenerationError])

  return {
    design,
    isGenerating,
    generationError,
    generationProgress,
    generate,
    update,
  }
}

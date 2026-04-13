'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DesignSpec } from '@/types/design.types'

interface DesignStore {
  design: DesignSpec | null
  isGenerating: boolean
  generationError: string | null
  generationProgress: number  // 0–100

  // Actions
  setDesign: (design: DesignSpec) => void
  updateDesign: (design: DesignSpec) => void
  setGenerating: (generating: boolean) => void
  setGenerationError: (error: string | null) => void
  setGenerationProgress: (progress: number) => void
  clearDesign: () => void
}

export const useDesignStore = create<DesignStore>()(
  persist(
    (set) => ({
      design: null,
      isGenerating: false,
      generationError: null,
      generationProgress: 0,

      setDesign: (design) =>
        set({ design, isGenerating: false, generationError: null, generationProgress: 100 }),

      updateDesign: (design) =>
        set({ design }),

      setGenerating: (generating) =>
        set({ isGenerating: generating }),

      setGenerationError: (error) =>
        set({ generationError: error, isGenerating: false }),

      setGenerationProgress: (progress) =>
        set({ generationProgress: progress }),

      clearDesign: () =>
        set({ design: null, generationError: null, generationProgress: 0 }),
    }),
    {
      name: 'ai-architect-design',
      partialize: (state) => ({ design: state.design }),
    }
  )
)

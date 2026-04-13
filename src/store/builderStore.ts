'use client'

import { create } from 'zustand'
import type { DesignSpec } from '@/types/design.types'

interface BuilderStore {
  past: DesignSpec[]
  future: DesignSpec[]
  clearHistory: () => void
  pushHistory: (current: DesignSpec) => void
  undo: (current: DesignSpec) => DesignSpec | null
  redo: (current: DesignSpec) => DesignSpec | null
}

export const useBuilderStore = create<BuilderStore>((set) => ({
  past: [],
  future: [],
  clearHistory: () => set({ past: [], future: [] }),
  pushHistory: (current) =>
    set((state) => ({
      past: [...state.past, structuredClone(current)],
      future: [],
    })),
  undo: (current) => {
    let previous: DesignSpec | null = null
    set((state) => {
      if (state.past.length === 0) return state
      previous = state.past[state.past.length - 1]
      return {
        past: state.past.slice(0, -1),
        future: [structuredClone(current), ...state.future],
      }
    })
    return previous
  },
  redo: (current) => {
    let next: DesignSpec | null = null
    set((state) => {
      if (state.future.length === 0) return state
      next = state.future[0]
      return {
        past: [...state.past, structuredClone(current)],
        future: state.future.slice(1),
      }
    })
    return next
  },
}))

'use client'

import { create } from 'zustand'
import type { MaterialPreset } from '@/types/design.types'
import type { ViewMode, HoverPromptState } from '@/types/viewer.types'

interface ViewerStore {
  exploded: boolean
  xrayEnabled: boolean
  xrayClipY: number
  materialPreset: MaterialPreset
  viewMode: ViewMode
  selectedRoomId: string | null
  hoveredRoomId: string | null
  showGrid: boolean
  showLabels: boolean
  hoverPrompt: HoverPromptState

  // Actions
  toggleExploded: () => void
  toggleXray: () => void
  setXrayClipY: (y: number) => void
  setMaterialPreset: (preset: MaterialPreset) => void
  setViewMode: (mode: ViewMode) => void
  setSelectedRoom: (id: string | null) => void
  setHoveredRoom: (id: string | null) => void
  toggleGrid: () => void
  toggleLabels: () => void
  setHoverPrompt: (state: Partial<HoverPromptState>) => void
  resetViewerState: () => void
}

const initialState = {
  exploded: false,
  xrayEnabled: false,
  xrayClipY: 5,
  materialPreset: 'concrete' as MaterialPreset,
  viewMode: 'normal' as ViewMode,
  selectedRoomId: null,
  hoveredRoomId: null,
  showGrid: true,
  showLabels: true,
  hoverPrompt: {
    visible: false,
    roomId: null,
    position: [0, 0, 0] as [number, number, number],
  },
}

export const useViewerStore = create<ViewerStore>((set) => ({
  ...initialState,

  toggleExploded: () =>
    set((state) => ({ exploded: !state.exploded })),

  toggleXray: () =>
    set((state) => ({ xrayEnabled: !state.xrayEnabled })),

  setXrayClipY: (y) =>
    set({ xrayClipY: y }),

  setMaterialPreset: (preset) =>
    set({ materialPreset: preset }),

  setViewMode: (mode) =>
    set({ viewMode: mode }),

  setSelectedRoom: (id) =>
    set({ selectedRoomId: id }),

  setHoveredRoom: (id) =>
    set({ hoveredRoomId: id }),

  toggleGrid: () =>
    set((state) => ({ showGrid: !state.showGrid })),

  toggleLabels: () =>
    set((state) => ({ showLabels: !state.showLabels })),

  setHoverPrompt: (hoverState) =>
    set((state) => ({ hoverPrompt: { ...state.hoverPrompt, ...hoverState } })),

  resetViewerState: () =>
    set(initialState),
}))

'use client'

import { useCallback } from 'react'
import { useViewerStore } from '@/store/viewerStore'
import type { MaterialPreset } from '@/types/design.types'
import { nextMaterialPreset } from '@/lib/materialPresets'

export function useViewerControls() {
  const store = useViewerStore()

  const cycleMaterial = useCallback(() => {
    store.setMaterialPreset(nextMaterialPreset(store.materialPreset))
  }, [store])

  return {
    ...store,
    cycleMaterial,
  }
}

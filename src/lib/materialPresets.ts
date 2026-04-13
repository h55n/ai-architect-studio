import type { MaterialPreset } from '@/types/design.types'

export interface MaterialPresetConfig {
  name: string
  color: string        // hex — used for MeshStandardMaterial color
  roughness: number
  metalness: number
  label: string
  description: string
}

export const MATERIAL_PRESETS: Record<MaterialPreset, MaterialPresetConfig> = {
  concrete: {
    name: 'concrete',
    color: '#9E9E9E',
    roughness: 0.9,
    metalness: 0.0,
    label: 'Concrete',
    description: 'Raw brutalist finish',
  },
  timber: {
    name: 'timber',
    color: '#8B6914',
    roughness: 0.7,
    metalness: 0.0,
    label: 'Timber',
    description: 'Warm wood grain',
  },
  brick: {
    name: 'brick',
    color: '#A63D2F',
    roughness: 0.85,
    metalness: 0.0,
    label: 'Brick',
    description: 'Traditional masonry',
  },
}

export const MATERIAL_PRESET_ORDER: MaterialPreset[] = ['concrete', 'timber', 'brick']

export function nextMaterialPreset(current: MaterialPreset): MaterialPreset {
  const idx = MATERIAL_PRESET_ORDER.indexOf(current)
  return MATERIAL_PRESET_ORDER[(idx + 1) % MATERIAL_PRESET_ORDER.length]
}

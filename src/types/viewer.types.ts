// Viewer state types — all interactive control flags
import type { MaterialPreset } from './design.types'

export type ViewMode = 'normal' | '2d'

export interface ViewerState {
  exploded: boolean
  xrayEnabled: boolean
  xrayClipY: number        // Y position of clip plane (0–10)
  materialPreset: MaterialPreset
  viewMode: ViewMode
  selectedRoomId: string | null
  hoveredRoomId: string | null
  cameraPosition: [number, number, number]
  showGrid: boolean
  showLabels: boolean
}

export interface RoomMeshProps {
  room: import('./design.types').Room3D
  floorLevel: number
  floorHeight: number
  isSelected: boolean
  isHovered: boolean
  materialPreset: MaterialPreset
  exploded: boolean
  xrayEnabled: boolean
  xrayClipY: number
  onHover: (roomId: string | null) => void
  onSelect: (roomId: string) => void
}

export interface HoverPromptState {
  visible: boolean
  roomId: string | null
  position: [number, number, number]
}

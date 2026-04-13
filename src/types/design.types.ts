// DesignSpec — the single source of truth for the 3D scene
// All viewer components derive from this contract.

export type MaterialPreset = 'concrete' | 'timber' | 'brick'

export type RoomColor =
  | '#C4C3E3'
  | '#504E76'
  | '#FDF8E2'
  | '#A3B565'
  | '#FCDD9D'
  | '#F1642E'

export interface Position3D {
  x: number
  y: number
  z: number
}

export interface Dimensions3D {
  width: number   // meters
  height: number  // meters
  depth: number   // meters
}

export interface Furniture {
  id: string
  name: string
  type: string
  position: Position3D
  dimensions: Dimensions3D
}

export interface Window3D {
  wall: 'north' | 'south' | 'east' | 'west'
  offsetX: number    // position along wall (0-1 normalized)
  width: number      // meters
  height: number     // meters  
  sillHeight: number // from floor, typically 0.9
}

export interface Door3D {
  wall: 'north' | 'south' | 'east' | 'west'
  offsetX: number    // position along wall (0-1 normalized)
  width: number      // typically 0.9
  connectsTo: string // room id
  swingDirection: 'inward' | 'outward'
}

export interface Room3D {
  id: string
  name: string
  type: string          // 'bedroom' | 'living' | 'kitchen' | 'bathroom' | 'office' | etc.
  position: Position3D
  dimensions: Dimensions3D
  shape: 'rect' | 'L' | 'T'
  rotation: number
  color: RoomColor
  materialPreset: MaterialPreset
  furniture: Furniture[]
  windows: Window3D[]
  doors: Door3D[]
}

export interface Floor {
  id: string
  level: number         // 0 = ground floor, 1 = first floor, etc.
  height: number        // floor-to-ceiling height in meters
  rooms: Room3D[]
}

export interface ArchitecturalStyle {
  name: string          // e.g. "Japanese-Scandinavian Hybrid"
  influences: string[]  // e.g. ["Machiya", "Nordic Vernacular"]
  description: string
}

export interface DesignSpec {
  id: string
  version: number
  createdAt: string     // ISO timestamp
  architecturalStyle: ArchitecturalStyle
  floors: Floor[]
  totalArea: number     // square meters
  palette: RoomColor[]
  notes: string
}

export interface ArchitectBrief {
  style: string
  concept: string           
  spatialStrategy: string   
  moodBoard: string[]       
  keyFeatures: string[]     
  roomProgram: {
    type: string
    count: number
    sizeTier: 'small' | 'medium' | 'large'
    adjacentTo: string[]
    floor: number
  }[]
}

// API shapes
export interface ArchitectRequest {
  mode: 'CREATE' | 'UPDATE'
  profile?: import('./quiz.types').UserProfile
  brief?: ArchitectBrief
  existingDesign?: DesignSpec
  instruction?: string  // for UPDATE mode
}

export interface ArchitectResponse {
  success: boolean
  brief?: ArchitectBrief
  design?: DesignSpec
  error?: string
  retries?: number
}

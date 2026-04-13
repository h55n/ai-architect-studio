import { z } from 'zod'

const PALETTE_COLORS = ['#C4C3E3', '#504E76', '#FDF8E2', '#A3B565', '#FCDD9D', '#F1642E'] as const

const Position3DSchema = z.object({
  x: z.number().catch(0),
  y: z.number().catch(0),
  z: z.number().catch(0),
})

const Dimensions3DSchema = z.object({
  width: z.number().positive().catch(4),
  height: z.number().positive().catch(3),
  depth: z.number().positive().catch(4),
})

const FurnitureSchema = z.object({
  id: z.string().catch(() => Math.random().toString(36).substring(7)),
  name: z.string().catch('Furniture'),
  type: z.string().catch('misc'),
  position: Position3DSchema,
  dimensions: Dimensions3DSchema,
})

const Window3DSchema = z.object({
  wall: z.enum(['north', 'south', 'east', 'west']).catch('north'),
  offsetX: z.number().catch(0.5),
  width: z.number().catch(1),
  height: z.number().catch(1),
  sillHeight: z.number().catch(0.9),
})

const Door3DSchema = z.object({
  wall: z.enum(['north', 'south', 'east', 'west']).catch('south'),
  offsetX: z.number().catch(0.5),
  width: z.number().catch(0.9),
  connectsTo: z.string().catch(''),
  swingDirection: z.enum(['inward', 'outward']).catch('inward'),
})

const Room3DSchema = z.object({
  id: z.string().catch(() => Math.random().toString(36).substring(7)),
  name: z.string().catch('Room'),
  type: z.string().catch('misc'),
  position: Position3DSchema,
  dimensions: Dimensions3DSchema,
  shape: z.enum(['rect', 'L', 'T']).catch('rect'),
  rotation: z.number().catch(0),
  color: z.enum(PALETTE_COLORS).catch('#C4C3E3'),
  materialPreset: z.enum(['concrete', 'timber', 'brick']).catch('concrete'),
  furniture: z.array(FurnitureSchema).catch([]),
  windows: z.array(Window3DSchema).catch([]),
  doors: z.array(Door3DSchema).catch([]),
})

const FloorSchema = z.object({
  id: z.string().catch(() => Math.random().toString(36).substring(7)),
  level: z.number().int().catch(0),
  height: z.number().positive().catch(3),
  rooms: z.array(Room3DSchema).catch([]),
})

const ArchitecturalStyleSchema = z.object({
  name: z.string().catch('Modern'),
  influences: z.array(z.string()).catch([]),
  description: z.string().catch('Modern Architecture'),
})

export const DesignSpecSchema = z.object({
  id: z.string().catch(() => Math.random().toString(36).substring(7)),
  version: z.number().int().catch(1),
  createdAt: z.string().catch(() => new Date().toISOString()),
  architecturalStyle: ArchitecturalStyleSchema,
  floors: z.array(FloorSchema).catch([]),
  totalArea: z.number().positive().catch(100),
  palette: z.array(z.enum(PALETTE_COLORS)).catch(['#C4C3E3']),
  notes: z.string().catch(''),
})

export type DesignSpecValidated = z.infer<typeof DesignSpecSchema>

export const ArchitectBriefSchema = z.object({
  style: z.string(),
  concept: z.string(),
  spatialStrategy: z.string(),
  moodBoard: z.array(z.string()),
  keyFeatures: z.array(z.string()),
  roomProgram: z.array(z.object({
    type: z.string(),
    count: z.number().int(),
    sizeTier: z.enum(['small', 'medium', 'large']),
    adjacentTo: z.array(z.string()),
    floor: z.number().int(),
  })),
})

export type ArchitectBriefValidated = z.infer<typeof ArchitectBriefSchema>

export function validateArchitectBrief(data: unknown) {
  return ArchitectBriefSchema.safeParse(data)
}

export function validateDesignSpec(data: unknown): DesignSpecValidated {
  return DesignSpecSchema.parse(data)
}

export function safeValidateDesignSpec(data: unknown) {
  return DesignSpecSchema.safeParse(data)
}

import { NextRequest, NextResponse } from 'next/server'
import { Mistral } from '@mistralai/mistralai'
import { safeValidateDesignSpec } from '@/lib/designSchema'
import type { ArchitectRequest } from '@/types/design.types'

const MAX_RETRIES = 3

const ARCHITECT_GEOMETRY_PROMPT = `Technical architect. Convert ArchitectBrief → precise DesignSpec 3D geometry.

STRUCTURAL RULES — follow exactly:
□ Rooms share walls with adjacent rooms (touching, never floating)
□ No overlapping bounding boxes — check before placing each room
□ Every room: min 1 door on shared wall with neighbor
□ Every exterior wall: min 1 window (except bathrooms + closets)
□ Ground floor includes 1 outdoor space (patio/terrace/garden)
□ Varied dimensions: mix 3.5×4, 4×5, 5×6, 6×4 — no uniform sizing
□ floor[1] rooms start at y = floor[0].height (2.8–3.2m typical)
□ Include roof geometry matching style

STYLE GEOMETRY GUIDE:
modernist:     flat roof, 1+ room with windows[] height = room.h (floor-ceil)
japandi:       ceilings 2.6m, engawa porch room, rotation variety
industrial:    mezzanine partial level, 3.5m+ ceilings ground floor
mediterranean: courtyard room (noCeiling: true), arched door markers
craftsman:     steep gable roof, covered porch, bay window living room
scandinavian:  steep roof + dormers, cozy rooms max 4.5×5
brutalist:     floor[1] footprint extends 1.5m beyond floor[0]

REQUIRED per Room3D:
  id, type, label, position{x,y,z}, dimensions{w,h,d},
  color (from palette), material, rotation (default 0),
  windows: Window3D[],
  doors: Door3D[]

Window3D: { wall, offsetX(0-1), width, height, sillHeight }
Door3D:   { wall, offsetX(0-1), width, connectsTo, swingDirection }

Palette: #C4C3E3 #504E76 #FDF8E2 #A3B565 #FCDD9D #F1642E
Distribute colors — no 2 adjacent rooms same color.

JSON only. No markdown. No prose.`

const ARCHITECT_UPDATE_PROMPT = `Technical architect updating existing design constraints. Preserve style exactly. Output JSON only.`

export async function POST(req: NextRequest) {
  try {
    const body: ArchitectRequest = await req.json()
    const { mode, profile, brief, existingDesign, instruction } = body

    console.log('[architect] mode:', body.mode)
    console.log('[architect] profile received:', !!body.profile)
    console.log('[architect] mistral key set:', !!process.env.MISTRAL_API_KEY)

    if (mode === 'CREATE' && (!profile || !brief)) {
      return NextResponse.json({ error: 'CREATE mode requires a profile and a brief' }, { status: 400 })
    }
    if (mode === 'UPDATE' && (!existingDesign || !instruction)) {
      return NextResponse.json({ error: 'UPDATE mode requires existingDesign and instruction' }, { status: 400 })
    }

    const apiKey = process.env.MISTRAL_API_KEY
    if (!apiKey) {
      throw new Error('MISTRAL_API_KEY is not defined in environment variables')
    }
    const client = new Mistral({ apiKey })

    const systemPrompt = mode === 'CREATE' ? ARCHITECT_GEOMETRY_PROMPT : ARCHITECT_UPDATE_PROMPT
    const userContent =
      mode === 'CREATE'
        ? `Generate a DesignSpec for this ArchitectBrief and User Profile:\n\nPROFILE: ${JSON.stringify(profile)}\n\nBRIEF: ${JSON.stringify(brief, null, 2)}`
        : `Instruction: "${instruction}"\n\nExisting DesignSpec:\n${JSON.stringify(existingDesign, null, 2)}`

    let lastError: string = ''
    let retries = 0

    while (retries < MAX_RETRIES) {
      const response = await client.chat.complete({
        model: 'mistral-large-latest',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent },
          ...(lastError ? [{ role: 'user', content: `Last attempt failed with JSON/Zod error: ${lastError}. Fix the output.` }] : []),
        ],
        temperature: mode === 'CREATE' ? 0.2 : 0.2, // very rigid for layout logic
        responseFormat: { type: 'json_object' },
      })

      const rawContent = response.choices?.[0]?.message?.content ?? ''
      const contentStr = typeof rawContent === 'string' ? rawContent.replace(/```json|```/g, '').trim() : ''

      let parsed: unknown
      try {
        parsed = JSON.parse(contentStr)
      } catch {
        lastError = 'Invalid JSON from AI. Did you forget closing brackets or use unescaped characters?'
        retries++
        continue
      }

      const validation = safeValidateDesignSpec(parsed)
      if (!validation.success) {
        lastError = JSON.stringify(validation.error.flatten())
        console.error('[architect] validation failure details:', lastError)
        retries++
        continue
      }

      return NextResponse.json({
        success: true,
        design: validation.data,
        retries,
      })
    }

    return NextResponse.json(
      { success: false, error: `Failed after ${MAX_RETRIES} retries: ${lastError}` },
      { status: 502 }
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ success: false, error: `Architect agent error: ${message}` }, { status: 500 })
  }
}

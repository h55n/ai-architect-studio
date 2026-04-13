import { NextRequest, NextResponse } from 'next/server'
import { Mistral } from '@mistralai/mistralai'
import { validateArchitectBrief } from '@/lib/designSchema'

const MAX_RETRIES = 3

const ARCHITECT_PLAN_PROMPT = `You are a senior architect doing design intent only. No coordinates yet.
Given UserProfile JSON, output ArchitectBrief:
{
  "style": "string",
  "concept": "string",           // 1 sentence design intent
  "spatialStrategy": "string",   // how rooms connect + flow
  "moodBoard": ["string"],       // 3 material/texture descriptors
  "keyFeatures": ["string"],     // 3-5 signature design moves
  "roomProgram": [{
    "type": "string",
    "count": "number",
    "sizeTier": "small" | "medium" | "large",
    "adjacentTo": ["string"],
    "floor": "number"
  }]
}
JSON only. No markdown. No prose.`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { profile } = body

    if (!profile) {
      return NextResponse.json({ error: 'Profile is required' }, { status: 400 })
    }

    const apiKey = process.env.MISTRAL_API_KEY
    if (!apiKey) {
      console.error('[architect] error: MISTRAL_API_KEY missing in environment variables.')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const client = new Mistral({ apiKey })

    const userContent = `UserProfile JSON:\n${JSON.stringify(profile, null, 2)}`
    let retries = 0
    let lastError = ''

    while (retries < MAX_RETRIES) {
      const retryMessage = lastError
        ? [{ role: 'user' as const, content: `Last attempt failed with JSON/Zod error: ${lastError}. Fix the output.` }]
        : []

      const response = await client.chat.complete({
        model: 'mistral-large-latest',
        messages: [
          { role: 'system', content: ARCHITECT_PLAN_PROMPT },
          { role: 'user', content: userContent },
          ...retryMessage,
        ],
        temperature: 0.65,
        responseFormat: { type: 'json_object' },
      })

      const rawContent = response.choices?.[0]?.message?.content ?? ''
      const contentStr = typeof rawContent === 'string' ? rawContent.replace(/```json|```/g, '').trim() : ''

      let parsed: unknown
      try {
        parsed = JSON.parse(contentStr)
      } catch {
        lastError = 'Invalid JSON returned from plan AI'
        retries++
        continue
      }

      const validation = validateArchitectBrief(parsed)
      if (!validation.success) {
        lastError = JSON.stringify(validation.error.flatten())
        console.error('[architect plan] validation failed:', validation.error.flatten())
        retries++
        continue
      }

      return NextResponse.json({ success: true, brief: validation.data, retries })
    }

    return NextResponse.json(
      { success: false, error: `Failed after ${MAX_RETRIES} retries: ${lastError}` },
      { status: 502 }
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[architect plan] fatal error:', message)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

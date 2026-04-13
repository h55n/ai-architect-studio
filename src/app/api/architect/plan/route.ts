import { NextRequest, NextResponse } from 'next/server'
import { Mistral } from '@mistralai/mistralai'
import { validateArchitectBrief } from '@/lib/designSchema'

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

    const response = await client.chat.complete({
      model: 'mistral-large-latest',
      messages: [
        { role: 'system', content: ARCHITECT_PLAN_PROMPT },
        { role: 'user', content: `UserProfile JSON:\n${JSON.stringify(profile, null, 2)}` },
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
      return NextResponse.json({ error: 'Invalid JSON returned from plan AI' }, { status: 500 })
    }

    const validation = validateArchitectBrief(parsed)
    if (!validation.success) {
      console.error('[architect plan] validation failed:', validation.error.flatten())
      return NextResponse.json({ error: 'Invalid brief schema returned', details: validation.error.flatten() }, { status: 500 })
    }

    return NextResponse.json({ success: true, brief: validation.data })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[architect plan] fatal error:', message)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

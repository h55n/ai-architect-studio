import { NextRequest, NextResponse } from 'next/server'
import { Mistral } from '@mistralai/mistralai'
import { QUIZ_SYSTEM_PROMPT } from '@/lib/quizPrompts'
import { safeValidateQuizResponse } from '@/lib/profileSchema'
import type { ChatMessage } from '@/types/quiz.types'

interface QuizRequestBody {
  messages: ChatMessage[]
}

export async function POST(req: NextRequest) {
  try {
    const body: QuizRequestBody = await req.json()
    const { messages } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid request: messages array required' }, { status: 400 })
    }

    const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY ?? '' })

    const response = await client.chat.complete({
      model: 'mistral-small-latest',
      messages: [
        { role: 'system', content: QUIZ_SYSTEM_PROMPT },
        ...messages,
      ],
      temperature: 0.7,
      responseFormat: { type: 'json_object' },
    })

    const rawContent = response.choices?.[0]?.message?.content ?? ''
    const contentStr = typeof rawContent === 'string' ? rawContent : ''

    let parsed: unknown
    try {
      parsed = JSON.parse(contentStr)
    } catch {
      return NextResponse.json(
        { error: 'AI returned invalid JSON', raw: contentStr },
        { status: 502 }
      )
    }

    const validation = safeValidateQuizResponse(parsed)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'AI response failed schema validation', details: validation.error.flatten() },
        { status: 502 }
      )
    }

    return NextResponse.json({ response: validation.data })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: `Quiz agent error: ${message}` }, { status: 500 })
  }
}

'use client'

import { useCallback } from 'react'
import { useQuizStore } from '@/store/quizStore'
import type { ChatMessage, QuizResponse } from '@/types/quiz.types'

export function useQuizAgent() {
  const {
    messages,
    isLoading,
    isComplete,
    error,
    currentQuestion,
    questionCount,
    maxQuestions,
    addMessage,
    setCurrentQuestion,
    incrementQuestion,
    setLoading,
    setComplete,
    setError,
  } = useQuizStore()

  const sendMessage = useCallback(async (userInput: string) => {
    if (isLoading || isComplete) return

    const userMessage: ChatMessage = { role: 'user', content: userInput }
    addMessage(userMessage)
    setLoading(true)
    setError(null)

    const updatedMessages: ChatMessage[] = [...messages, userMessage]

    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      })

      if (!res.ok) {
        const err = await res.json() as { error?: string }
        throw new Error(err.error ?? `HTTP ${res.status}`)
      }

      const data = await res.json() as { response: QuizResponse }
      const { response } = data

      addMessage({ role: 'assistant', content: JSON.stringify(response) })
      incrementQuestion()

      if (response.type === 'question') {
        setCurrentQuestion(response)
      } else if (response.type === 'complete') {
        setCurrentQuestion(null)
        setComplete(response.profile)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(`Failed to get response: ${message}`)
    } finally {
      setLoading(false)
    }
  }, [
    isLoading, isComplete, messages,
    addMessage, setLoading, setError,
    incrementQuestion, setCurrentQuestion, setComplete,
  ])

  // Kick off with the first question
  const start = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [] }),
      })

      if (!res.ok) {
        const err = await res.json() as { error?: string }
        throw new Error(err.error ?? `HTTP ${res.status}`)
      }

      const data = await res.json() as { response: QuizResponse }
      const { response } = data

      addMessage({ role: 'assistant', content: JSON.stringify(response) })
      incrementQuestion()

      if (response.type === 'question') {
        setCurrentQuestion(response)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(`Failed to start quiz: ${message}`)
    } finally {
      setLoading(false)
    }
  }, [addMessage, incrementQuestion, setCurrentQuestion, setLoading, setError])

  return {
    currentQuestion,
    questionCount,
    maxQuestions,
    isLoading,
    isComplete,
    error,
    sendMessage,
    start,
  }
}

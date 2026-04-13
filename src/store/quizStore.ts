'use client'

import { create } from 'zustand'
import type { ChatMessage, UserProfile, QuizResponse } from '@/types/quiz.types'
import type { ArchitectBrief } from '@/types/design.types'

interface QuizStore {
  messages: ChatMessage[]
  currentQuestion: QuizResponse | null
  questionCount: number
  maxQuestions: number
  isLoading: boolean
  isComplete: boolean
  error: string | null
  profile: UserProfile | null
  brief: ArchitectBrief | null

  // Actions
  addMessage: (message: ChatMessage) => void
  setCurrentQuestion: (question: QuizResponse | null) => void
  incrementQuestion: () => void
  setLoading: (loading: boolean) => void
  setComplete: (profile: UserProfile) => void
  setError: (error: string | null) => void
  setBrief: (brief: ArchitectBrief | null) => void
  reset: () => void
}

const initialState = {
  messages: [],
  currentQuestion: null,
  questionCount: 0,
  maxQuestions: 8,
  isLoading: false,
  isComplete: false,
  error: null,
  profile: null,
  brief: null,
}

export const useQuizStore = create<QuizStore>((set) => ({
  ...initialState,

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  setCurrentQuestion: (question) =>
    set({ currentQuestion: question }),

  incrementQuestion: () =>
    set((state) => ({ questionCount: state.questionCount + 1 })),

  setLoading: (loading) =>
    set({ isLoading: loading }),

  setComplete: (profile) =>
    set({ isComplete: true, profile }),

  setError: (error) =>
    set({ error }),

  setBrief: (brief) =>
    set({ brief }),

  reset: () =>
    set(initialState),
}))

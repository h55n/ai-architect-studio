// Quiz question types
export type InputType = 'free_text' | 'multiple_choice'

export interface QuizQuestion {
  type: 'question'
  content: string
  inputType: InputType
  options: string[]
}

export interface QuizComplete {
  type: 'complete'
  profile: UserProfile
}

export type QuizResponse = QuizQuestion | QuizComplete

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

// User Profile — output of the Quiz Agent
export interface UserProfile {
  householdSize: number
  lifestyleKeywords: string[]
  preferredStyle: string
  budget: 'minimal' | 'moderate' | 'premium' | 'luxury'
  climate: string
  priorities: string[]
  roomRequirements: {
    bedrooms: number
    bathrooms: number
    hasOffice: boolean
    hasGarage: boolean
    hasGarden: boolean
    additionalSpaces: string[]
  }
  aestheticNotes: string
}

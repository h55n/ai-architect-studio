import { Mistral } from '@mistralai/mistralai'

if (!process.env.MISTRAL_API_KEY) {
  throw new Error('MISTRAL_API_KEY environment variable is not set')
}

export const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY })

export const QUIZ_MODEL = 'mistral-small-latest'
export const ARCHITECT_MODEL = 'mistral-large-latest'

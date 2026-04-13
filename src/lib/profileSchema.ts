import { z } from 'zod'

export const UserProfileSchema = z.object({
  householdSize: z.number().int().catch(1),
  lifestyleKeywords: z.array(z.string()).catch([]),
  preferredStyle: z.string().catch('Modern'),
  budget: z.enum(['minimal', 'moderate', 'premium', 'luxury']).catch('moderate'),
  climate: z.string().catch('temperate'),
  priorities: z.array(z.string()).catch([]),
  roomRequirements: z.object({
    bedrooms: z.number().int().catch(1),
    bathrooms: z.number().int().catch(1),
    hasOffice: z.boolean().catch(false),
    hasGarage: z.boolean().catch(false),
    hasGarden: z.boolean().catch(false),
    additionalSpaces: z.array(z.string()).catch([]),
  }).catch({
    bedrooms: 1, bathrooms: 1, hasOffice: false, hasGarage: false, hasGarden: false, additionalSpaces: []
  }),
  aestheticNotes: z.string().catch(''),
})

export type UserProfileValidated = z.infer<typeof UserProfileSchema>

export const QuizQuestionSchema = z.object({
  type: z.literal('question'),
  content: z.string().catch('Could you tell me more about your design?'),
  inputType: z.enum(['free_text', 'multiple_choice']).catch('free_text'),
  options: z.array(z.string()).catch([]),
})

export const QuizCompleteSchema = z.object({
  type: z.literal('complete'),
  profile: UserProfileSchema,
})

export const QuizResponseSchema = z.discriminatedUnion('type', [
  QuizQuestionSchema,
  QuizCompleteSchema,
])

export type QuizResponseValidated = z.infer<typeof QuizResponseSchema>

export function validateQuizResponse(data: unknown): QuizResponseValidated {
  return QuizResponseSchema.parse(data)
}

export function safeValidateQuizResponse(data: unknown) {
  return QuizResponseSchema.safeParse(data)
}

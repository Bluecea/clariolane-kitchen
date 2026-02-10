import { z } from 'zod'

export const DifficultySchema = z.enum(['Easy', 'Medium', 'Hard'])
export type Difficulty = z.infer<typeof DifficultySchema>

export const QuestionSchema = z.object({
  id: z.string().uuid(),
  question: z.string().min(1, 'Question text is required'),
  options: z
    .array(z.string().min(1, 'Option cannot be empty'))
    .min(2, 'At least 2 options required'),
  correctIndex: z.number().int().min(0),
})
export type Question = z.infer<typeof QuestionSchema>

export const PassageSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, 'Title is required'),
  text: z.string().min(10, 'Text content must be at least 10 characters'),
  tags: z.array(z.string()),
  difficulty: DifficultySchema,
  questions: z.array(QuestionSchema),
})
export type Passage = z.infer<typeof PassageSchema>

export const ContentTypeSchema = z.object({
  id: z.string().uuid(),
  content: z.string(),
})
export type ContentType = z.infer<typeof ContentTypeSchema>

export const FeedbackUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
})
export type FeedbackUser = z.infer<typeof FeedbackUserSchema>

export const FeedbackSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  category: z.enum(['bug', 'feature', 'general']),
  message: z.string(),
  status: z.enum(['pending', 'reviewed', 'resolved']).default('pending'),
  is_read: z.boolean().default(false),
  created_at: z.string(),
  updated_at: z.string(),
  user: FeedbackUserSchema,
})
export type Feedback = z.infer<typeof FeedbackSchema>

export const FeedbackResponseSchema = z.object({
  data: z.array(FeedbackSchema),
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
})
export type FeedbackResponse = z.infer<typeof FeedbackResponseSchema>

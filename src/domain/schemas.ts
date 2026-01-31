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

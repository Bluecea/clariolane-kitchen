import {
  type UseFieldArrayReturn,
  type UseFormRegister,
  type FieldErrorsImpl,
} from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { type Passage } from '@/domain/schemas'

interface QuestionListProps {
  fieldArrayMethods: UseFieldArrayReturn<Passage, 'questions', 'id'>
  register: UseFormRegister<Passage>
  errors: Partial<FieldErrorsImpl<Passage>>
}

export const QuestionList = ({
  fieldArrayMethods,
  register,
  errors,
}: QuestionListProps) => {
  const { fields, append, remove } = fieldArrayMethods

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold text-slate-800'>Questions</h2>
        <Button
          type='button'
          variant='secondary'
          onClick={() =>
            append({
              id: crypto.randomUUID(),
              question: '',
              options: ['', '', '', ''],
              correctIndex: 0,
            })
          }>
          <Plus className='mr-2 h-4 w-4' />
          Add Question
        </Button>
      </div>

      {fields.map((field, index) => (
        <Card key={field.id} className='p-6 relative group'>
          <button
            type='button'
            onClick={() => remove(index)}
            className='absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100'
            title='Remove Question'>
            <Trash2 className='h-5 w-5' />
          </button>

          <div className='space-y-4'>
            <Input
              label={`Question ${index + 1}`}
              placeholder='Enter the question...'
              error={errors.questions?.[index]?.question?.message}
              {...register(`questions.${index}.question`)}
            />

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {[0, 1, 2, 3].map((optIndex) => (
                <div key={optIndex} className='flex items-center gap-2'>
                  <input
                    type='radio'
                    value={optIndex}
                    {...register(`questions.${index}.correctIndex`, {
                      valueAsNumber: true,
                    })}
                    className='h-4 w-4 text-indigo-600 focus:ring-indigo-500'
                  />
                  <Input
                    placeholder={`Option ${optIndex + 1}`}
                    className='flex-1'
                    error={
                      errors.questions?.[index]?.options?.[optIndex]?.message
                    }
                    {...register(`questions.${index}.options.${optIndex}`)}
                  />
                </div>
              ))}
            </div>
            {errors.questions?.[index]?.correctIndex && (
              <p className='text-sm text-red-500'>
                Please select the correct answer.
              </p>
            )}
          </div>
        </Card>
      ))}

      {fields.length === 0 && (
        <div className='text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200'>
          <p className='text-slate-500'>No questions added yet.</p>
          <Button
            type='button'
            variant='ghost'
            onClick={() =>
              append({
                id: crypto.randomUUID(),
                question: '',
                options: ['', '', '', ''],
                correctIndex: 0,
              })
            }
            className='mt-2'>
            Add your first question
          </Button>
        </div>
      )}
    </div>
  )
}

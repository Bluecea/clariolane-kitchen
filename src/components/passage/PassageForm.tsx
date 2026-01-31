import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2, Save, Wand2 } from 'lucide-react'
import { type Passage, PassageSchema } from '../../domain/schemas'
import { mockTagService } from '../../services/tagService'
import { sanitize } from '../../utils/sanitizer'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Card } from '../ui/Card'

export const PassageForm = () => {
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [validating, setValidating] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Passage>({
    resolver: zodResolver(PassageSchema),
    defaultValues: {
      id: crypto.randomUUID(),
      title: '',
      text: '',
      difficulty: 'Easy',
      tags: [],
      questions: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  })

  const selectedTags = watch('tags')

  useEffect(() => {
    mockTagService.fetchTags().then(setAvailableTags)
  }, [])

  const onSubmit = async (data: Passage) => {
    setValidating(true)
    // Sanitize rich text fields before submission (or during input if preferred)
    const cleanData = {
      ...data,
      title: sanitize(data.title),
      text: sanitize(data.text), // Assuming text might contain HTML from a rich editor
      questions: data.questions.map((q) => ({
        ...q,
        question: sanitize(q.question),
        options: q.options.map((o) => sanitize(o)),
      })),
    }

    console.log('Valid and Clean Data:', cleanData)
    alert('Passage saved successfully! Check console for data.')
    setValidating(false)
  }

  const difficultyOptions = [
    { label: 'Easy', value: 'Easy' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Hard', value: 'Hard' },
  ]

  const handleTagToggle = (tag: string) => {
    const current = selectedTags || []
    if (current.includes(tag)) {
      setValue(
        'tags',
        current.filter((t) => t !== tag),
      )
    } else {
      setValue('tags', [...current, tag])
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='max-w-4xl mx-auto p-6 space-y-8'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight text-slate-900'>
            Create Passage
          </h1>
          <p className='text-slate-500 mt-1'>
            Design a new reading passage and quiz.
          </p>
        </div>
        <Button type='submit' isLoading={isSubmitting || validating}>
          <Save className='mr-2 h-4 w-4' />
          Save Passage
        </Button>
      </div>

      <Card className='p-6 space-y-6'>
        <h2 className='text-xl font-semibold text-slate-800 flex items-center'>
          <Wand2 className='mr-2 h-5 w-5 text-indigo-500' />
          General Info
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <Input
            label='Title'
            id='title'
            placeholder='e.g. The History of Artificial Intelligence'
            error={errors.title?.message}
            {...register('title')}
          />

          <Select
            label='Difficulty'
            id='difficulty'
            options={difficultyOptions}
            error={errors.difficulty?.message}
            {...register('difficulty')}
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-slate-700 mb-2'>
            Tags
          </label>
          <div className='flex flex-wrap gap-2'>
            {availableTags.map((tag) => (
              <button
                key={tag}
                type='button'
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors border ${
                  selectedTags?.includes(tag)
                    ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                }`}>
                {tag}
              </button>
            ))}
          </div>
          {errors.tags && (
            <p className='text-sm text-red-500 mt-1'>{errors.tags.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor='text'
            className='block text-sm font-medium text-slate-700 mb-1'>
            Passage Text
          </label>
          <textarea
            id='text'
            rows={8}
            className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.text
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-slate-300 focus:border-indigo-500'
            }`}
            placeholder='Write your passage here...'
            {...register('text')}
          />
          {errors.text && (
            <p className='text-sm text-red-500 mt-1'>{errors.text.message}</p>
          )}
        </div>
      </Card>

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
    </form>
  )
}

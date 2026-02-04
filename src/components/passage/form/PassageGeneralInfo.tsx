import { useState, useEffect } from 'react'
import { type UseFormReturn } from 'react-hook-form'
import { Wand2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { type Passage } from '@/domain/schemas'
import { mockTagService } from '@/services/tagService'

interface PassageGeneralInfoProps {
  formMethods: UseFormReturn<Passage>
}

export const PassageGeneralInfo = ({
  formMethods,
}: PassageGeneralInfoProps) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = formMethods
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const selectedTags = watch('tags')

  const difficultyOptions = [
    { label: 'Easy', value: 'Easy' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Hard', value: 'Hard' },
  ]

  useEffect(() => {
    mockTagService.fetchTags().then(setAvailableTags)
  }, [])

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
  )
}

import { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type Passage, PassageSchema } from '@/domain/schemas'
import { sanitize } from '@/utils/sanitizer'
import { useCreatePassage, useUpdatePassage } from '@/tanstack'
import { useFetchPassage } from '@/tanstack/queries/fetchPassage'

interface UsePassageFormProps {
  id?: string
  onSuccess: () => void
}

export const usePassageForm = ({ id, onSuccess }: UsePassageFormProps) => {
  const isEditMode = !!id

  const formMethods = useForm<Passage>({
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

  const { reset } = formMethods

  const fieldArrayMethods = useFieldArray({
    control: formMethods.control,
    name: 'questions',
  })

  // Fetch Passage Data if Edit Mode
  const {
    data,
    refetch,
    isLoading: isLoadingData,
  } = useFetchPassage(id!, isEditMode)

  // Initialize form with data
  useEffect(() => {
    if (isEditMode && id) {
      refetch()
      if (data) reset(data)
    }
  }, [id, isEditMode, reset, refetch, data])

  // Mutations
  const createMutation = useCreatePassage(onSuccess)
  const updateMutation = useUpdatePassage(onSuccess)

  const handleTagToggle = (tag: string) => {
    const current = formMethods.watch('tags')
    if (current.includes(tag)) {
      formMethods.setValue(
        'tags',
        current.filter((t) => t !== tag),
        { shouldValidate: true, shouldDirty: true, shouldTouch: true },
      )
    } else {
      const newTags = [...current, tag]
      formMethods.setValue('tags', newTags, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      })
    }
  }

  const onSubmit = async (data: Passage) => {
    const cleanData = {
      ...data,
      title: sanitize(data.title),
      text: sanitize(data.text),
      questions: data.questions.map((q) => ({
        ...q,
        question: sanitize(q.question),
        options: q.options.map((o) => sanitize(o)),
      })),
    }

    if (isEditMode) {
      updateMutation.mutate(cleanData)
    } else {
      createMutation.mutate(cleanData)
    }
  }

  return {
    formMethods,
    fieldArrayMethods,
    onSubmit,
    isLoadingData,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    isEditMode,
    handleTagToggle,
  }
}

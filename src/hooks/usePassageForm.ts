import { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { type Passage, PassageSchema } from '@/domain/schemas'
import { passageService } from '@/services/passageService'
import { sanitize } from '@/utils/sanitizer'

interface UsePassageFormProps {
  id?: string
  onSuccess: () => void
}

export const usePassageForm = ({ id, onSuccess }: UsePassageFormProps) => {
  const isEditMode = !!id
  const queryClient = useQueryClient()

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
  const { isLoading: isLoadingData } = useQuery({
    queryKey: ['passage', id],
    queryFn: () => passageService.getPassage(id!),
    enabled: isEditMode,
    refetchOnWindowFocus: false,
  })

  // Initialize form with data
  useEffect(() => {
    if (isEditMode && id) {
      passageService
        .getPassage(id)
        .then((data) => {
          if (data) reset(data)
        })
        .catch((err) => console.error('Failed to load passage', err))
    }
  }, [id, isEditMode, reset])

  // Mutations
  const createMutation = useMutation({
    mutationFn: passageService.createPassage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passages'] })
      onSuccess()
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: Passage) => passageService.updatePassage(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passages'] })
      onSuccess()
    },
  })

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
  }
}

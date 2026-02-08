import { passageService } from '@/services/passageService'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Passage } from '@/domain/schemas'
import { FetchPassageKey } from '..'

export const useCreatePassage = (onSuccess: () => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Passage) => passageService.createPassage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FetchPassageKey] })
      onSuccess()
    },
  })
}

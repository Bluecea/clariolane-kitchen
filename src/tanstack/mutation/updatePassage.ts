import { passageService } from '@/services/passageService'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Passage } from '@/domain/schemas'
import { FetchPassageKey } from '..'

export const useUpdatePassage = (onSuccess: () => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Passage) => passageService.updatePassage(data.id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [FetchPassageKey] })
      queryClient.invalidateQueries({ queryKey: [FetchPassageKey, data.id] })
      onSuccess()
    },
  })
}

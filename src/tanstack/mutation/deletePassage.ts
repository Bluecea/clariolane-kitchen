import { useMutation, useQueryClient } from '@tanstack/react-query'
import { passageService } from '@/services/passageService'
import { FetchPassageKey } from '@/tanstack'

export const useDeletePassage = (page: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: passageService.deletePassage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FetchPassageKey, page] })
    },
  })
}

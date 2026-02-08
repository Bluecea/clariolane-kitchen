import { passageService } from '@/services/passageService'
import { useQuery } from '@tanstack/react-query'

export const FetchPassageKey = 'passage'

export const useFetchPassage = (id: string, isEditMode: boolean) => {
  return useQuery({
    queryKey: [FetchPassageKey, id],
    queryFn: () => passageService.getPassage(id),
    enabled: !!id && isEditMode,
  })
}

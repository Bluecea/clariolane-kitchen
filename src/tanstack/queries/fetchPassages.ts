import { useQuery } from '@tanstack/react-query'
import { passageService } from '@/services/passageService'

export const FetchPassageKey = 'passages'

export const useFetchPassages = (page: number, limit: number) => {
  return useQuery({
    queryKey: [FetchPassageKey, page],
    queryFn: () => passageService.fetchPassages(page, limit),
  })
}

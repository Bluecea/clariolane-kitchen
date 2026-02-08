import { useQuery } from '@tanstack/react-query'
import { passageService } from '@/services/passageService'

export const FetchContentTypesKey = 'content-types'

export const useFetchContentTypes = () => {
  return useQuery({
    queryKey: [FetchContentTypesKey],
    queryFn: async () => await passageService.getContentTypes(),
    staleTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
}

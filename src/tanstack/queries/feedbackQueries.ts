import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { feedbackService } from '@/services/feedbackService'
import type { Feedback } from '@/domain/schemas'

export const FetchFeedbacksKey = 'feedbacks'

export const useFeedbacks = (
  page: number,
  limit: number,
  status?: Feedback['status'][],
  category?: Feedback['category'][],
  sortBy: 'created_at' | 'status' = 'created_at',
  sortOrder: 'asc' | 'desc' = 'desc',
) => {
  return useQuery({
    queryKey: [
      FetchFeedbacksKey,
      page,
      limit,
      status,
      category,
      sortBy,
      sortOrder,
    ],
    queryFn: () =>
      feedbackService
        .fetchFeedbacks(page, limit, status, category, sortBy, sortOrder)
        .then((res) => {
          return {
            ...res,
            data: res.data.sort((b) => (b.is_read ? 1 : -1)),
          }
        }),
    placeholderData: (previousData) => previousData,
  })
}

export const useUpdateFeedback = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Feedback['status'] }) =>
      feedbackService.updateFeedbackStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FetchFeedbacksKey] })
      if (onSuccess) onSuccess()
    },
  })
}

export const useMarkFeedbackAsRead = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => feedbackService.markFeedbackAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FetchFeedbacksKey] })
      if (onSuccess) onSuccess()
    },
  })
}

export const useFeedback = (id: string) => {
  return useQuery({
    queryKey: [FetchFeedbacksKey, id],
    queryFn: () => feedbackService.fetchFeedbackById(id),
    enabled: !!id,
  })
}

export const useUnreadFeedbackCount = () => {
  return useQuery({
    queryKey: [FetchFeedbacksKey, 'unread-count'],
    queryFn: async () => {
      const response = await feedbackService.fetchFeedbacks(
        1,
        1,
        undefined, // status
        undefined, // category
        undefined, // sortBy
        undefined, // sortOrder
        false, // is_read
      )
      return response.meta.total
    },
  })
}

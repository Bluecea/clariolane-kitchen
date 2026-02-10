import { supabase } from '@/lib/supabase'
import type { Feedback, FeedbackResponse } from '@/domain/schemas'

export const feedbackService = {
  fetchFeedbacks: async (
    page: number,
    limit: number,
    status?: Feedback['status'][],
    category?: Feedback['category'][],
    sortBy: 'created_at' | 'status' = 'created_at',
    sortOrder: 'asc' | 'desc' = 'desc',
    is_read?: boolean,
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder,
    })

    if (status && status.length > 0) {
      status.forEach((s) => params.append('status', s))
    }

    if (category && category.length > 0) {
      category.forEach((c) => params.append('category', c))
    }

    if (typeof is_read === 'boolean') {
      params.append('is_read', is_read.toString())
    }

    const { data, error } = await supabase.functions.invoke(
      `feedback?${params.toString()}`,
      {
        method: 'GET',
      },
    )

    if (error) throw error
    return data as FeedbackResponse
  },

  updateFeedbackStatus: async (id: string, status: Feedback['status']) => {
    const { data, error } = await supabase.functions.invoke('feedback', {
      method: 'PUT',
      body: { id, status },
    })

    if (error) throw error
    return data as Feedback
  },

  markFeedbackAsRead: async (id: string) => {
    const { data, error } = await supabase.functions.invoke('feedback', {
      method: 'PUT',
      body: { id, is_read: true },
    })

    if (error) throw error
    return data as Feedback
  },

  fetchFeedbackById: async (id: string) => {
    const { data, error } = await supabase.functions.invoke(
      `feedback?id=${id}`,
      {
        method: 'GET',
      },
    )

    if (error) throw error
    return data as Feedback
  },
}

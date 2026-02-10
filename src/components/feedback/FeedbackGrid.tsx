import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { Bug, Lightbulb, MessageSquare } from 'lucide-react'
import type { Feedback } from '@/domain/schemas'
import { useUpdateFeedback } from '@/tanstack/queries/feedbackQueries'
import { Card } from '@/components/ui/Card'
import { FeedbackStatusSelect } from './FeedbackStatusSelect'

interface FeedbackGridProps {
  data: Feedback[]
  isLoading: boolean
}

export const FeedbackGrid = ({ data, isLoading }: FeedbackGridProps) => {
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateFeedback()

  if (isLoading) {
    return (
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {[...Array(6)].map((_, i) => (
          <Card key={i} className='h-48 animate-pulse bg-slate-100' />
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className='flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-slate-500'>
        No feedbacks found
      </div>
    )
  }

  const getIcon = (category: Feedback['category']) => {
    switch (category) {
      case 'bug':
        return <Bug className='h-5 w-5 text-red-500' />
      case 'feature':
        return <Lightbulb className='h-5 w-5 text-amber-500' />
      default:
        return <MessageSquare className='h-5 w-5 text-blue-500' />
    }
  }

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {data.map((feedback) => (
        <Card
          key={feedback.id}
          className={`flex flex-col p-5 transition-all hover:shadow-md ${
            !feedback.is_read ? 'ring-2 ring-indigo-500/20' : ''
          }`}>
          <Link to={`/dashboard/feedbacks/${feedback.id}`}>
            <div className='mb-4 flex items-start justify-between'>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50'>
                  {getIcon(feedback.category)}
                </div>
                <div>
                  <p className='font-semibold text-slate-900 hover:text-indigo-600 hover:underline'>
                    {feedback.user.name}
                  </p>
                  <p className='text-xs text-slate-500'>
                    {feedback.user.email}
                  </p>
                </div>
              </div>
              {!feedback.is_read && (
                <span className='inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800'>
                  New
                </span>
              )}
            </div>
          </Link>

          <Link
            className='mb-4 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3'
            to={`/dashboard/feedbacks/${feedback.id}`}>
            <p>{feedback.message}</p>
          </Link>

          <div className='flex items-center justify-between border-t border-slate-100 pt-4'>
            <FeedbackStatusSelect
              status={feedback.status}
              onStatusChange={(status) =>
                updateStatus({
                  id: feedback.id,
                  status,
                })
              }
              disabled={isUpdating}
              className='px-2.5 py-0.5 text-xs'
            />
            <span className='text-xs text-slate-400'>
              {format(new Date(feedback.created_at), 'MMM d, yyyy')}
            </span>
          </div>
        </Card>
      ))}
    </div>
  )
}

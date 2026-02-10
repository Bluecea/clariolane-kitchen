import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  useFeedback,
  useMarkFeedbackAsRead,
  useUpdateFeedback,
} from '@/tanstack/queries/feedbackQueries'
import {
  ArrowLeft,
  Loader2,
  Bug,
  Lightbulb,
  MessageSquare,
  Calendar,
  User,
  Mail,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { FeedbackStatusSelect } from '@/components/feedback/FeedbackStatusSelect'
import { format } from 'date-fns'
import type { Feedback } from '@/domain/schemas'

export const FeedbackDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: feedback, isLoading, error } = useFeedback(id!)
  const { mutate: markAsRead } = useMarkFeedbackAsRead()
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateFeedback()

  useEffect(() => {
    if (feedback && !feedback.is_read) {
      markAsRead(feedback.id)
    }
  }, [feedback, markAsRead])

  if (isLoading) {
    return (
      <div className='flex h-96 items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-indigo-600' />
      </div>
    )
  }

  if (error || !feedback) {
    return (
      <div className='flex flex-col items-center justify-center space-y-4 py-12'>
        <p className='text-slate-500'>Failed to load feedback or not found.</p>
        <Button
          variant='secondary'
          onClick={() => navigate('/dashboard/feedbacks')}>
          Go Back
        </Button>
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
    <div className='mx-auto max-w-6xl space-y-6'>
      <Button
        variant='ghost'
        onClick={() => navigate('/dashboard/feedbacks')}
        className='pl-0 hover:bg-transparent hover:text-indigo-600'>
        <ArrowLeft className='mr-2 h-4 w-4' />
        Back to Feedbacks
      </Button>

      <Card className='overflow-hidden border-none shadow-xs'>
        <div className='border-b border-slate-100 bg-slate-50/50 p-6 sm:px-8'>
          <div className='mb-4 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200'>
                {getIcon(feedback.category)}
              </div>
              <div>
                <h1 className='text-lg font-bold text-slate-900 capitalize'>
                  {feedback.category} Report
                </h1>
                <p className='text-xs text-slate-500'>
                  ID:{' '}
                  <span className='font-mono'>{feedback.id.slice(0, 8)}</span>
                </p>
              </div>
            </div>
            <FeedbackStatusSelect
              status={feedback.status}
              onStatusChange={(status) =>
                updateStatus({ id: feedback.id, status })
              }
              disabled={isUpdating}
              className='px-3 py-1.5 text-sm'
            />
          </div>
        </div>

        <div className='grid gap-8 p-6 sm:px-8 sm:py-8 lg:grid-cols-3'>
          <div className='space-y-6 lg:col-span-2'>
            <div>
              <h3 className='mb-2 text-sm font-semibold text-slate-900'>
                Message
              </h3>
              <div className='rounded-lg bg-slate-50 p-4 text-slate-700'>
                <p className='whitespace-pre-wrap leading-relaxed'>
                  {feedback.message}
                </p>
              </div>
            </div>
          </div>

          <div className='space-y-6'>
            <div>
              <h3 className='mb-3 text-sm font-semibold text-slate-900'>
                User Details
              </h3>
              <div className='rounded-lg border border-slate-100 p-4'>
                <div className='flex flex-col gap-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500'>
                      <User className='h-4 w-4' />
                    </div>
                    <div className='overflow-hidden'>
                      <p className='text-xs text-slate-500 uppercase font-semibold'>
                        Name
                      </p>
                      <p className='truncate text-sm font-medium text-slate-900'>
                        {feedback.user.name}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500'>
                      <Mail className='h-4 w-4' />
                    </div>
                    <div className='overflow-hidden'>
                      <p className='text-xs text-slate-500 uppercase font-semibold'>
                        Email
                      </p>
                      <p className='truncate text-sm font-medium text-slate-900'>
                        {feedback.user.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className='mb-3 text-sm font-semibold text-slate-900'>
                Metadata
              </h3>
              <div className='rounded-lg border border-slate-100 p-4'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500'>
                    <Calendar className='h-4 w-4' />
                  </div>
                  <div>
                    <p className='text-xs text-slate-500 uppercase font-semibold'>
                      Created At
                    </p>
                    <p className='text-sm font-medium text-slate-900'>
                      {format(new Date(feedback.created_at), 'PPP p')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

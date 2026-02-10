import { useState } from 'react'
import { useFeedbacks } from '@/tanstack/queries/feedbackQueries'
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Grid,
  List,
  SortAsc,
  SortDesc,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import type { Feedback } from '@/domain/schemas'
import type { SortingState } from '@tanstack/react-table'
import { FeedbackList } from '@/components/feedback/FeedbackList'
import { FeedbackGrid } from '@/components/feedback/FeedbackGrid'

export const FeedbacksPage = () => {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [view, setView] = useState<'list' | 'grid'>('list')
  const [showFilters, setShowFilters] = useState(false)

  // Filters state
  const [selectedStatus, setSelectedStatus] = useState<Feedback['status'][]>([])
  const [selectedCategory, setSelectedCategory] = useState<
    Feedback['category'][]
  >([])
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'created_at', desc: true },
  ])

  const sortBy = sorting[0]?.id as 'created_at' | 'status' | undefined
  const sortOrder = sorting[0]?.desc ? 'desc' : 'asc'

  const { data: feedbackData, isLoading } = useFeedbacks(
    page,
    limit,
    selectedStatus.length > 0 ? selectedStatus : undefined,
    selectedCategory.length > 0 ? selectedCategory : undefined,
    sortBy || 'created_at',
    sortOrder,
  )

  const toggleStatus = (status: Feedback['status']) => {
    setSelectedStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    )
    setPage(1)
  }

  const toggleCategory = (category: Feedback['category']) => {
    setSelectedCategory((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    )
    setPage(1)
  }

  return (
    <div className='space-y-6 max-w-6xl mx-auto'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <h1 className='text-2xl font-bold text-slate-900'>Feedbacks</h1>
        <div className='flex items-center gap-2'>
          <Button
            variant='secondary'
            onClick={() => setShowFilters(!showFilters)}
            className={`gap-2 ${
              showFilters ||
              selectedStatus.length > 0 ||
              selectedCategory.length > 0
                ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 hover:bg-indigo-100'
                : ''
            }`}>
            <Filter className='h-4 w-4' />
            Filters
            {(selectedStatus.length > 0 || selectedCategory.length > 0) && (
              <span className='ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-medium text-white'>
                {selectedStatus.length + selectedCategory.length}
              </span>
            )}
          </Button>
          <div className='flex items-center rounded-lg border border-slate-200 bg-white p-1'>
            <button
              onClick={() => setView('list')}
              className={`rounded p-1.5 transition-colors ${
                view === 'list'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-500 hover:text-slate-900'
              }`}>
              <List className='h-4 w-4' />
            </button>
            <button
              onClick={() => setView('grid')}
              className={`rounded p-1.5 transition-colors ${
                view === 'grid'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-500 hover:text-slate-900'
              }`}>
              <Grid className='h-4 w-4' />
            </button>
          </div>
        </div>
      </div>

      {showFilters && (
        <Card className='p-4 transition-all animate-in slide-in-from-top-2'>
          <div className='grid gap-6 sm:grid-cols-3'>
            <div>
              <h3 className='mb-3 text-sm font-medium text-slate-900'>
                Status
              </h3>
              <div className='flex flex-wrap gap-2'>
                {['pending', 'reviewed', 'resolved'].map((status) => (
                  <button
                    key={status}
                    onClick={() => toggleStatus(status as Feedback['status'])}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors border ${
                      selectedStatus.includes(status as Feedback['status'])
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className='mb-3 text-sm font-medium text-slate-900'>
                Category
              </h3>
              <div className='flex flex-wrap gap-2'>
                {['bug', 'feature', 'general'].map((category) => (
                  <button
                    key={category}
                    onClick={() =>
                      toggleCategory(category as Feedback['category'])
                    }
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors border ${
                      selectedCategory.includes(
                        category as Feedback['category'],
                      )
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className='mb-3 text-sm font-medium text-slate-900'>
                Sort By Date
              </h3>
              <div className='flex gap-2'>
                <Button
                  variant='secondary'
                  className={`gap-2 text-xs ${
                    sortBy === 'created_at' && sortOrder === 'asc'
                      ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'
                      : ''
                  }`}
                  onClick={() =>
                    setSorting([{ id: 'created_at', desc: false }])
                  }>
                  <SortAsc className='h-3 w-3' /> Oldest First
                </Button>
                <Button
                  variant='secondary'
                  className={`gap-2 text-xs ${
                    sortBy === 'created_at' && sortOrder === 'desc'
                      ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'
                      : ''
                  }`}
                  onClick={() =>
                    setSorting([{ id: 'created_at', desc: true }])
                  }>
                  <SortDesc className='h-3 w-3' /> Newest First
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {view === 'list' ? (
        <Card className='overflow-x-auto shadow-none'>
          <FeedbackList data={feedbackData?.data || []} isLoading={isLoading} />
        </Card>
      ) : (
        <FeedbackGrid data={feedbackData?.data || []} isLoading={isLoading} />
      )}

      {/* Pagination */}
      {feedbackData?.meta && (
        <div className='flex items-center gap-4 px-4 py-3'>
          <div className='text-sm text-slate-700'>
            Page <span className='font-medium'>{page}</span> of{' '}
            <span className='font-medium'>{feedbackData.meta.totalPages}</span>
          </div>
          <div className='flex gap-2'>
            <Button
              variant='secondary'
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}>
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <Button
              variant='secondary'
              onClick={() =>
                setPage((p) => Math.min(feedbackData.meta.totalPages, p + 1))
              }
              disabled={page === feedbackData.meta.totalPages || isLoading}>
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

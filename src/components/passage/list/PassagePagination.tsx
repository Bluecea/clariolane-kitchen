import { ArrowLeft, ArrowRight } from 'lucide-react'

interface PassagePaginationProps {
  page: number
  totalPages: number
  total: number
  pageSize: number
  setPage: (page: number) => void
}

export const PassagePagination = ({
  page,
  totalPages,
  total,
  pageSize,
  setPage,
}: PassagePaginationProps) => {
  if (total === 0) return null

  return (
    <div className='bg-white px-4 py-3 flex items-center justify-between border-t border-slate-200 sm:px-6'>
      <div className='flex flex-wrap gap-3 sm:flex-1 sm:flex sm:items-center sm:justify-between'>
        <div>
          <p className='text-sm text-slate-700'>
            Showing{' '}
            <span className='font-medium'>{(page - 1) * pageSize + 1}</span> to{' '}
            <span className='font-medium'>
              {Math.min(page * pageSize, total)}
            </span>{' '}
            of <span className='font-medium'>{total}</span> results
          </p>
        </div>
        <div>
          <nav
            className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px'
            aria-label='Pagination'>
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className='relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed'>
              <span className='sr-only'>Previous</span>
              <ArrowLeft className='h-5 w-5' />
            </button>
            <button
              disabled
              className='relative inline-flex items-center px-4 py-2 border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50'>
              {page} / {totalPages}
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className='relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed'>
              <span className='sr-only'>Next</span>
              <ArrowRight className='h-5 w-5' />
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}

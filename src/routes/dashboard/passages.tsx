import { Link, useNavigate } from 'react-router-dom'
import { Plus, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { usePassages } from '@/hooks/usePassages'
import { PassageListTable } from '@/components/passage/list/PassageListTable'
import { PassagePagination } from '@/components/passage/list/PassagePagination'

const Passages = () => {
  const pageSize = 10
  const navigate = useNavigate()
  const {
    passages,
    total,
    totalPages,
    page,
    setPage,
    isLoading,
    isError,
    error,
    handleDelete,
    isDeleting,
    deletingId,
  } = usePassages(pageSize)

  if (isLoading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-indigo-600' />
      </div>
    )
  }

  if (isError) {
    return (
      <div className='flex h-64 flex-col items-center justify-center text-red-600'>
        <AlertCircle className='h-8 w-8 mb-2' />
        <p>Error loading passages: {(error as Error).message}</p>
        <Button
          onClick={() => window.location.reload()}
          variant='secondary'
          className='mt-4'>
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-wrap gap-3 items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-slate-900'>Passages</h1>
          <p className='text-sm text-slate-500'>
            Manage reading comprehension passages.
          </p>
        </div>
        <Link to='/dashboard/passage/new'>
          <Button>
            <Plus className='mr-2 h-4 w-4' />
            New Passage
          </Button>
        </Link>
      </div>

      <Card className='overflow-hidden'>
        <PassageListTable
          passages={passages}
          onEdit={(id: string) => navigate(`/dashboard/passage/${id}`)}
          onDelete={handleDelete}
          isDeleting={isDeleting}
          deletingId={deletingId as string}
        />

        <PassagePagination
          page={page}
          totalPages={totalPages}
          total={total}
          pageSize={pageSize}
          setPage={setPage}
        />
      </Card>
    </div>
  )
}

export default Passages

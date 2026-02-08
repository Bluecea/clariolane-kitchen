import { useState } from 'react'
import { useFetchPassages, useDeletePassage } from '@/tanstack'

export const usePassages = (pageSize: number = 10) => {
  const [page, setPage] = useState(1)

  const { data, isLoading, isError, error } = useFetchPassages(page, pageSize)

  const deleteMutation = useDeletePassage(page)

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this passage?')) {
      deleteMutation.mutate(id)
    }
  }

  const passages = data?.data || []
  const meta = data?.meta
  const total = meta?.total || 0
  const totalPages = meta?.totalPages || 1

  return {
    passages,
    total,
    totalPages,
    page,
    setPage,
    isLoading,
    isError,
    error,
    handleDelete,
    isDeleting: deleteMutation.isPending,
    deletingId: deleteMutation.variables,
  }
}

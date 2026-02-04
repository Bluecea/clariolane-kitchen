import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { passageService } from '@/services/passageService'

export const usePassages = (pageSize: number = 10) => {
  const [page, setPage] = useState(1)
  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['passages', page],
    queryFn: () => passageService.fetchPassages(page, pageSize),
  })

  const deleteMutation = useMutation({
    mutationFn: passageService.deletePassage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passages'] })
    },
  })

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

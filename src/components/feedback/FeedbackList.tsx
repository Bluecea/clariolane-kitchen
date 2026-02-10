import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  createColumnHelper,
  type CellContext,
} from '@tanstack/react-table'
import { Loader2, Bug, Lightbulb, MessageSquare } from 'lucide-react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import type { Feedback } from '@/domain/schemas'
import { useUpdateFeedback } from '@/tanstack/queries/feedbackQueries'
import { FeedbackStatusSelect } from './FeedbackStatusSelect'

const columnHelper = createColumnHelper<Feedback>()

interface FeedbackListProps {
  data: Feedback[]
  isLoading: boolean
}

export const FeedbackList = ({ data, isLoading }: FeedbackListProps) => {
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateFeedback()

  const columns = [
    columnHelper.accessor('user', {
      header: 'User',
      cell: (info: CellContext<Feedback, Feedback['user']>) => (
        <Link to={`/dashboard/feedbacks/${info.row.original.id}`}>
          <div className='flex flex-col'>
            <div className='flex items-center gap-2'>
              <span className='font-medium text-slate-900'>
                {info.getValue().name}
              </span>
              {!info.row.original.is_read && (
                <span className='inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800'>
                  New
                </span>
              )}
            </div>
            <span className='text-sm text-slate-500'>
              {info.getValue().email}
            </span>
          </div>
        </Link>
      ),
    }),
    columnHelper.accessor('category', {
      header: 'Category',
      cell: (info: CellContext<Feedback, Feedback['category']>) => {
        const category = info.getValue()
        const icon =
          category === 'bug' ? (
            <Bug className='h-4 w-4 text-red-500' />
          ) : category === 'feature' ? (
            <Lightbulb className='h-4 w-4 text-amber-500' />
          ) : (
            <MessageSquare className='h-4 w-4 text-blue-500' />
          )
        return (
          <Link to={`/dashboard/feedbacks/${info.row.original.id}`}>
            <div className='flex items-center gap-2 capitalize'>
              {icon}
              <span>{category}</span>
            </div>
          </Link>
        )
      },
    }),
    columnHelper.accessor('message', {
      header: 'Message',
      cell: (info: CellContext<Feedback, string>) => (
        <Link
          to={`/dashboard/feedbacks/${info.row.original.id}`}
          className='block max-w-xs truncate text-sm text-slate-600 hover:text-indigo-600 hover:underline'>
          {info.getValue()}
        </Link>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info: CellContext<Feedback, Feedback['status']>) => {
        const status = info.getValue()
        const id = info.row.original.id
        return (
          <FeedbackStatusSelect
            status={status}
            onStatusChange={(newStatus) =>
              updateStatus({
                id,
                status: newStatus,
              })
            }
            onClick={(e) => e.stopPropagation()}
            disabled={isUpdating}
            className='px-1 py-1 text-sm'
          />
        )
      },
    }),
    columnHelper.accessor('created_at', {
      header: 'Date',
      cell: (info: CellContext<Feedback, string>) => (
        <span className='text-sm text-slate-500'>
          {format(new Date(info.getValue()), 'PPP')}
        </span>
      ),
    }),
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className='relative overflow-x-auto'>
      <table className='w-full text-left text-sm text-slate-500'>
        <thead className='bg-slate-50 text-xs uppercase text-slate-700'>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className='px-6 py-3'>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className='h-24 text-center'>
                <Loader2 className='mx-auto h-6 w-6 animate-spin text-slate-500' />
              </td>
            </tr>
          ) : table.getRowModel().rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className='h-24 text-center text-slate-500'>
                No feedbacks found.
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={`last:border-none border-b border-slate-200 transition-colors hover:bg-slate-50 ${
                  !row.original.is_read ? 'bg-indigo-50/30' : ''
                }`}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className='px-6 py-4'>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

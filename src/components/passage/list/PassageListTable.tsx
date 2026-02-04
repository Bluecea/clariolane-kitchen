import { Edit2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { type Passage } from '@/domain/schemas'

interface PassageListTableProps {
  passages: Passage[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  isDeleting: boolean
  deletingId?: string
}

export const PassageListTable = ({
  passages,
  onEdit,
  onDelete,
  isDeleting,
  deletingId,
}: PassageListTableProps) => {
  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full divide-y divide-slate-200'>
        <thead className='bg-slate-50'>
          <tr>
            <th
              scope='col'
              className='px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'>
              Title
            </th>
            <th
              scope='col'
              className='px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'>
              Difficulty
            </th>
            <th
              scope='col'
              className='px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'>
              Tags
            </th>
            <th
              scope='col'
              className='px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider'>
              Actions
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-slate-200'>
          {passages.length === 0 ? (
            <tr>
              <td colSpan={4} className='px-6 py-12 text-center text-slate-500'>
                No passages found. Create one to get started.
              </td>
            </tr>
          ) : (
            passages.map((passage) => (
              <tr
                key={passage.id}
                className='hover:bg-slate-50 transition-colors'>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm font-medium text-slate-900'>
                    {passage.title}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      passage.difficulty === 'Easy'
                        ? 'bg-green-100 text-green-800'
                        : passage.difficulty === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                    {passage.difficulty}
                  </span>
                </td>
                <td className='px-6 py-4'>
                  <div className='flex flex-wrap gap-1'>
                    {passage.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800'>
                        {tag}
                      </span>
                    ))}
                    {(passage.tags?.length || 0) > 3 && (
                      <span className='text-xs text-slate-500 self-center'>
                        +{passage.tags!.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                  <div className='flex justify-end gap-2'>
                    <Button
                      variant='secondary'
                      className='p-2 h-auto'
                      title='Edit'
                      onClick={() => onEdit(passage.id)}>
                      <Edit2 className='h-4 w-4 text-indigo-600' />
                    </Button>
                    <Button
                      variant='secondary'
                      className='p-2 h-auto hover:bg-red-50 hover:border-red-200'
                      title='Delete'
                      onClick={() => onDelete(passage.id)}
                      isLoading={isDeleting && deletingId === passage.id}>
                      <Trash2 className='h-4 w-4 text-red-600' />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

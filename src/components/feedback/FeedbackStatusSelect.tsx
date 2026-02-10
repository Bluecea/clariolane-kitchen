import { type Feedback } from '@/domain/schemas'

interface FeedbackStatusSelectProps {
  status: Feedback['status']
  onStatusChange: (status: Feedback['status']) => void
  disabled?: boolean
  className?: string
  onClick?: (e: React.MouseEvent) => void
}

export const FeedbackStatusSelect = ({
  status,
  onStatusChange,
  disabled,
  className = '',
  onClick,
}: FeedbackStatusSelectProps) => {
  const getStatusColor = (status: Feedback['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
      case 'reviewed':
        return 'bg-blue-50 text-blue-700 ring-blue-700/10'
      case 'resolved':
        return 'bg-green-50 text-green-700 ring-green-600/20'
    }
  }

  return (
    <select
      value={status}
      onChange={(e) => onStatusChange(e.target.value as Feedback['status'])}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full border-0 font-medium ring-1 ring-inset focus:ring-2 focus:ring-indigo-600 ${getStatusColor(
        status,
      )} ${className}`}>
      <option value='pending'>Pending</option>
      <option value='reviewed'>Reviewed</option>
      <option value='resolved'>Resolved</option>
    </select>
  )
}

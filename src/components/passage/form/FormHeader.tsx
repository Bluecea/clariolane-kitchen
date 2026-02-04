import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface FormHeaderProps {
  isEditMode: boolean
  isSubmitting: boolean
  onBack: () => void
}

export const FormHeader = ({
  isEditMode,
  isSubmitting,
  onBack,
}: FormHeaderProps) => {
  return (
    <div className='flex flex-wrap gap-4 items-center justify-between'>
      <div className='flex items-center gap-4'>
        <Button type='button' variant='ghost' onClick={onBack}>
          <ArrowLeft className='h-5 w-5' />
        </Button>
        <div>
          <h1 className='text-3xl font-bold tracking-tight text-slate-900'>
            {isEditMode ? 'Edit Passage' : 'Create Passage'}
          </h1>
          <p className='text-slate-500 mt-1'>
            {isEditMode
              ? 'Update existing passage details.'
              : 'Design a new reading passage and quiz.'}
          </p>
        </div>
      </div>
      <Button type='submit' isLoading={isSubmitting}>
        <Save className='mr-2 h-4 w-4' />
        {isEditMode ? 'Update Passage' : 'Save Passage'}
      </Button>
    </div>
  )
}

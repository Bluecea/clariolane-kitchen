import { useParams, useNavigate } from 'react-router-dom'
import { usePassageForm } from '@/hooks/usePassageForm'
import { Button } from '@/components/ui/Button'
import { Save } from 'lucide-react'
import { FormHeader } from './form/FormHeader'
import { PassageGeneralInfo } from './form/PassageGeneralInfo'
import { QuestionList } from './form/QuestionList'

export const PassageForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const {
    formMethods,
    fieldArrayMethods,
    onSubmit,
    isLoadingData,
    isSubmitting,
    isEditMode,
  } = usePassageForm({
    id,
    onSuccess: () => navigate('/dashboard/passage'),
  })

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = formMethods

  if (isEditMode && isLoadingData) {
    return (
      <div className='p-8 text-center text-slate-500'>
        Loading passage data...
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='max-w-4xl mx-auto p-6 space-y-8'>
      <FormHeader
        isEditMode={isEditMode}
        isSubmitting={isSubmitting}
        onBack={() => navigate('/dashboard/passage')}
      />

      <PassageGeneralInfo formMethods={formMethods} />

      <QuestionList
        fieldArrayMethods={fieldArrayMethods}
        register={register}
        errors={errors}
      />

      <div className='flex md:items-end md:justify-end'>
        <Button
          type='submit'
          className='w-full md:w-auto'
          isLoading={isSubmitting}>
          <Save className='mr-2 h-4 w-4' />
          {isEditMode ? 'Update Passage' : 'Save Passage'}
        </Button>
      </div>
    </form>
  )
}

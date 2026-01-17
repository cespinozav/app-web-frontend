import { FormCalendar, FormInput } from 'components/FormControls'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import useToast from 'hooks/useToast'
import { Button } from 'primereact/button'

const DEFAULT_FIELDS = {
  description: '',
  dates: null
}

function LeasingModal({ isMutating, defaultFields, onSubmitFields }) {
  const toast = useToast()
  const isEditing = Boolean(defaultFields)
  const {
    control,
    handleSubmit,
    reset,
    formState: { dirtyFields }
  } = useForm({
    defaultValues: DEFAULT_FIELDS
  })

  useEffect(() => {
    if (defaultFields) {
      const { startDate, endDate } = defaultFields
      const dates = startDate ? [startDate, endDate] : null
      reset({ ...DEFAULT_FIELDS, ...defaultFields, dates })
    }
  }, [defaultFields])

  const onSubmit = formData => {
    if (defaultFields) {
      const dirtyList = Object.keys(dirtyFields)
      if (dirtyList.length === 0) {
        toast.error('Debe cambiar algún campo')
        return
      }
    }
    const newFormData = { ...formData }
    const [startDate, endDate] = newFormData.dates ?? []
    newFormData.startDate = startDate
    newFormData.endDate = endDate
    onSubmitFields(newFormData)
  }

  const handleError = errors => {
    const messages = Object.values(errors)
      .slice(0, 4)
      .map(e => e.message)
    toast.error(messages)
  }

  return (
    <form className="section" onSubmit={handleSubmit(onSubmit, handleError)}>
      <h2 className="header">{isEditing ? 'Editar' : 'Agregar'} leasing</h2>
      <div className="content">
        <div className="m-row">
          <label htmlFor="description">Descripción:</label>
          <FormInput
            control={control}
            name="description"
            rules={{
              required: 'Descripción no ingresada',
              maxLength: { value: 50, message: 'La descripción supera los 50 caracteres' }
            }}
          />
        </div>
        <div className="m-row">
          <label htmlFor="description">Fecha:</label>
          <FormCalendar
            name="dates"
            control={control}
            calendarProps={{
              selectionMode: 'range',
              dateFormat: 'dd/mm/yy',
              showButtonBar: true
            }}
          />
        </div>
      </div>
      <div className="buttons">
        <Button
          label="Guardar"
          loading={isMutating}
          disabled={isMutating}
          className="button"
          loadingIcon="pi pi-spin pi-spinner"
          iconPos="right"
          type="submit"
        />
      </div>
    </form>
  )
}

export default LeasingModal

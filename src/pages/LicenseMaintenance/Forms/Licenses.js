import { FormCalendar, FormInput } from 'components/FormControls'
import useToast from 'hooks/useToast'
import { Button } from 'primereact/button'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

const DEFAULT_FIELDS = {
  description: '',
  dates: null
}

function LicenseModal({ defaultFields, onSubmitFields, isMutating }) {
  const toast = useToast()
  const {
    control,
    handleSubmit,
    reset,
    formState: { dirtyFields }
  } = useForm({
    defaultValues: DEFAULT_FIELDS
  })
  useEffect(() => {
    const { startDate, endDate } = defaultFields || {}
    reset({
      ...DEFAULT_FIELDS,
      ...defaultFields,
      dates: startDate && endDate ? [new Date(startDate), new Date(endDate)] : null
    })
  }, [defaultFields])

  const onSubmit = formData => {
    const [startDate, endDate] = formData.dates || []
    const formattedData = { ...formData, startDate, endDate }
    if (defaultFields) {
      const dirtyList = Object.keys(dirtyFields)
      if (dirtyList.length === 0) {
        toast.error('Debe cambiar algún campo')
        return
      }
    }
    onSubmitFields(formattedData)
  }
  const isEditing = Boolean(defaultFields)
  const handleError = errors => {
    const messages = Object.values(errors)
      .slice(0, 4)
      .map(e => e.message)
    toast.error(messages)
  }

  return (
    <form className="section" onSubmit={handleSubmit(onSubmit, handleError)}>
      <h2 className="header">{isEditing ? 'Editar' : 'Agregar'} licencia</h2>
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
          <label htmlFor="dates">Vigencia:</label>
          <FormCalendar
            name="dates"
            control={control}
            rules={{
              required: 'Fechas de vigencia no seleccionadas',
              validate: dates => (dates.length === 2 && dates[0] && dates[1]) || 'Vigencia incompleta'
            }}
            calendarProps={{
              selectionMode: 'range',
              readOnlyInput: true,
              dateFormat: 'dd/mm/yy'
              // dateFormat: 'd-M-yy'
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

export default LicenseModal

import { FormInput } from 'components/FormControls'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import useToast from 'hooks/useToast'
import { Button } from 'primereact/button'

const DEFAULT_FIELDS = {
  description: '',
  district: '',
  province: '',
  departament: ''
}

function SeatModal({ defaultFields, onSubmitFields, isMutating }) {
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
    reset({ ...DEFAULT_FIELDS, ...defaultFields })
  }, [defaultFields])

  const onSubmit = formData => {
    if (defaultFields) {
      const dirtyList = Object.keys(dirtyFields)
      if (dirtyList.length === 0) {
        toast.error('Debe cambiar algún campo')
        return
      }
    }
    onSubmitFields(formData)
  }
  const handleError = errors => {
    const messages = Object.values(errors)
      .slice(0, 4)
      .map(e => e.message)
    toast.error(messages)
  }

  return (
    <form className="section" onSubmit={handleSubmit(onSubmit, handleError)}>
      <h2 className="header">{isEditing ? 'Editar' : 'Agregar'} sede</h2>
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
          <label htmlFor="district">Distrito:</label>
          <FormInput
            control={control}
            name="district"
            rules={{
              required: 'Distrito no ingresado',
              maxLength: { value: 50, message: 'El distrito supera los 50 caracteres' }
            }}
          />
        </div>
        <div className="m-row">
          <label htmlFor="province">Provincia:</label>
          <FormInput
            control={control}
            name="province"
            rules={{
              required: 'Provincia no ingresada',
              maxLength: { value: 50, message: 'La provincia supera los 50 caracteres' }
            }}
          />
        </div>
        <div className="m-row">
          <label htmlFor="departament">Departamento:</label>
          <FormInput
            control={control}
            name="departament"
            rules={{
              required: 'Departamento no ingresado',
              maxLength: { value: 50, message: 'El departamento supera los 50 caracteres' }
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

export default SeatModal

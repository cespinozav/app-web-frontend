import { FormInput } from 'components/FormControls'
import useToast from 'hooks/useToast'
import { Button } from 'primereact/button'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

const DEFAULT_FIELDS = {
  description: '',
  userCreated: ''
}

function TypeServiceModal({ defaultFields, onSubmitFields, isMutating }) {
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
    reset({ ...DEFAULT_FIELDS, ...defaultFields })
  }, [defaultFields])

  const isEditing = Boolean(defaultFields)
  const handleError = errors => {
    const messages = Object.values(errors)
      .slice(0, 4)
      .map(e => e.message)
    toast.error(messages)
  }

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
  return (
    <form className="section" onSubmit={handleSubmit(onSubmit, handleError)}>
      <h2 className="header">{isEditing ? 'Editar' : 'Agregar'} tipo de móvil</h2>
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

export default TypeServiceModal

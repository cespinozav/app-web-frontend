import { FormInput } from 'components/FormControls'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import useToast from 'hooks/useToast'
import { Button } from 'primereact/button'

const DEFAULT_FIELDS = {
  description: ''
}

function TypesModal({ isMutating, defaultFields, onSubmitFields }) {
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
      reset({ ...DEFAULT_FIELDS, ...defaultFields })
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
      <h2 className="header">{isEditing ? 'Editar' : 'Agregar'} tipo de activo</h2>
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

export default TypesModal

import FormInput from 'components/FormControls'
import { Button } from 'primereact/button'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import useToast from 'hooks/useToast'

const DEFAULT_FIELDS = {
  description: '',
  userCreated: ''
}

function CategoriaServiceForm({ defaultFields, onSubmitFields, isMutating }) {
  const toast = useToast()
  const {
    control,
    handleSubmit,
    reset,
    formState: { dirtyFields }
  } = useForm({
    defaultValues: DEFAULT_FIELDS
  })
  const formRef = useRef(null)
  useEffect(() => {
    reset({ ...DEFAULT_FIELDS, ...defaultFields })
  }, [defaultFields])

  const handleError = formErrors => {
    const messages = Object.values(formErrors)
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
    <form ref={formRef} onSubmit={handleSubmit(onSubmit, handleError)}>
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
            className="p-inputtext p-component"
            autoComplete="off"
          />
        </div>
      </div>
      <div className="buttons">
        <Button
          aria-label="Guardar"
          label="Guardar"
          loading={isMutating}
          disabled={isMutating}
          className="button p-button p-component"
          loadingIcon="pi pi-spin pi-spinner"
          iconPos="right"
          type="submit"
        />
      </div>
    </form>
  )
}

export default CategoriaServiceForm

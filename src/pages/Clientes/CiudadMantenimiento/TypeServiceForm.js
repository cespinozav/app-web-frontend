import { FormInput } from 'components/FormControls'
import { Button } from 'primereact/button'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import useToast from 'hooks/useToast'

const DEFAULT_FIELDS = {
  description: '',
  userCreated: ''
}

function CiudadClienteServiceForm({ defaultFields, onSubmitFields, isMutating, onClose }) {
  const toast = useToast()
  const {
    control,
    handleSubmit,
    reset,
    formState: { dirtyFields, errors }
  } = useForm({
    defaultValues: DEFAULT_FIELDS
  })
  const formRef = useRef(null)
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
          />
        </div>
      </div>
      <div className="footer" style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Button
          label="Guardar"
          type="submit"
          loading={isMutating}
          className="add"
          style={{ minWidth: 120 }}
        />
        <Button label="Cancelar" type="button" className="p-button-secondary" onClick={onClose} />
      </div>
    </form>
  )
}

export default CiudadClienteServiceForm

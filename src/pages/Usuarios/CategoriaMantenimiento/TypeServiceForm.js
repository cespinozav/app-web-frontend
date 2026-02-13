import FormInput from 'components/FormControls'
import { Button } from 'primereact/button'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import useToast from 'hooks/useToast'
import { useMutation } from 'hooks/useRequest'

const DEFAULT_FIELDS = {
  description: '',
  userCreated: ''
}

function CategoriaUsuarioServiceForm({ defaultFields, onClose, service }) {
  const isEditing = Boolean(defaultFields)
  const { mutate, isLoading } = useMutation(service.id, isEditing ? service.put : service.post)
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
  }, [defaultFields, reset])

  const handleError = formErrors => {
    const messages = Object.values(formErrors)
      .slice(0, 4)
      .map(e => e.message)
    toast.error(messages)
  }

  const onSubmit = async formData => {
    if (defaultFields) {
      const dirtyList = Object.keys(dirtyFields)
      if (dirtyList.length === 0) {
        toast.error('Debe cambiar algún campo')
        return
      }
    }
    // Al crear, solo enviar { description }
    const payload = isEditing
      ? { id: defaultFields.id, description: formData.description }
      : { description: formData.description }
    mutate(payload, {
      onSuccess: () => {
        onClose()
        toast.success(isEditing ? 'Categoría editada con éxito' : 'Categoría agregada con éxito')
      },
      onError: err => {
        if (err?.result?.description && Array.isArray(err.result.description)) {
          toast.error(err.result.description[0])
          return
        }
        if (err?.status === 401 || (err?.message && String(err.message).includes('401'))) {
          window.location.href = '/login'
          return
        }
        const strMessage = String(err)
        if (strMessage.includes('already exists')) {
          toast.error('La categoría ya existe')
        } else {
          toast.error(err?.message || err)
        }
      }
    })
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
          label={isEditing ? 'Editar categoría' : 'Agregar categoría'}
          type="submit"
          loading={isLoading}
          className="add"
          style={{ minWidth: 120 }}
        />
        <Button label="Cancelar" type="button" className="p-button-secondary" onClick={onClose} />
      </div>
    </form>
  )
}
export default CategoriaUsuarioServiceForm

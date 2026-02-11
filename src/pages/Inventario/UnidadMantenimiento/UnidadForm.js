import FormInput from 'components/FormControls'
import { Button } from 'primereact/button'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import useToast from 'hooks/useToast'

const DEFAULT_FIELDS = {
  description: '',
  reference: '',
  state: 'activo'
}

function UnidadForm({ defaultFields, onClose, onSubmitFields, isMutating }) {
  const toast = useToast()
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    register
  } = useForm({
    defaultValues: DEFAULT_FIELDS
  })
  const formRef = useRef(null)
  useEffect(() => {
    reset({ ...DEFAULT_FIELDS, ...defaultFields })
  }, [defaultFields])

  const isEditing = Boolean(defaultFields && defaultFields.id)
  const handleError = formErrors => {
    const messages = Object.values(formErrors)
      .slice(0, 4)
      .map(e => e.message)
    toast.error(messages)
  }

  const onSubmit = formData => {
    if (isEditing) {
      // Comparar los valores actuales con los iniciales
      const initial = { ...DEFAULT_FIELDS, ...defaultFields }
      const changed = Object.keys(formData).some(
        key => String(formData[key]) !== String(initial[key])
      )
      if (!changed) {
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
        <div className="m-row">
          <label htmlFor="reference">Referencia:</label>
          <FormInput
            control={control}
            name="reference"
            rules={{
              required: 'Referencia no ingresada',
              maxLength: { value: 10, message: 'La referencia supera los 10 caracteres' }
            }}
            className="p-inputtext p-component"
          />
        </div>
        <div className="m-row">
          <label htmlFor="state">Estado:</label>
          <select
            name="state"
            {...register('state')}
            onChange={e => setValue('state', e.target.value)}
            className="p-inputtext p-component"
            required
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
      </div>
      <div className="form-actions">
        <Button type="button" label="Cancelar" onClick={onClose} className="p-button-text" />
        <Button type="submit" label="Guardar" loading={isMutating} />
      </div>
    </form>
  )
}

export default UnidadForm

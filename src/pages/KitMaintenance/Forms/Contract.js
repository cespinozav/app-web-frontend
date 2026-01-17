import { FormDropdown, FormInput } from 'components/FormControls'
import { useQuery } from 'hooks/useRequest'
import useToast from 'hooks/useToast'
import { Button } from 'primereact/button'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { KitService } from 'services'

const DEFAULT_FIELDS = {
  code: '',
  operatorId: '',
  dates: null,
  description: '',
  userCreated: ''
}

function ContractModal({ defaultFields, onSubmitFields, isMutating }) {
  const toast = useToast()
  const {
    control,
    handleSubmit,
    reset,
    formState: { dirtyFields }
  } = useForm({
    defaultValues: DEFAULT_FIELDS
  })
  const { data, isLoading } = useQuery([KitService.operators.id], KitService.operators.get)
  const operators =
    data?.map(d => ({
      label: d.description,
      value: d.id
    })) || []

  useEffect(() => {
    if (operators.length > 0 && defaultFields) {
      const { startDate, endDate } = defaultFields
      const dates = [startDate ? new Date(startDate) : null, endDate ? new Date(endDate) : null]
      reset({ ...DEFAULT_FIELDS, ...defaultFields, dates })
    }
  }, [defaultFields, data])

  const handleError = errors => {
    const messages = Object.values(errors)
      .slice(0, 4)
      .map(e => e.message)
    toast.error(messages)
  }
  const isEditing = Boolean(defaultFields)
  const onSubmit = formData => {
    if (defaultFields) {
      const dirtyList = Object.keys(dirtyFields)
      if (dirtyList.length === 0) {
        toast.error('Debe cambiar algún campo')
        return
      }
    }
    const [startDate, endDate] = formData?.dates || []
    onSubmitFields({ ...formData, startDate, endDate })
  }
  return (
    <form className="section" onSubmit={handleSubmit(onSubmit, handleError)}>
      <h2 className="header">{isEditing ? 'Editar' : 'Agregar'} Nro de contrato</h2>
      <div className="content">
        <div className="m-row">
          <label htmlFor="code">Cod. Contrato:</label>
          <FormInput
            control={control}
            name="code"
            rules={{
              required: 'Cod. Contrato no ingresado',
              maxLength: { value: 50, message: 'El cód. de contrato supera los 50 caracteres' }
            }}
          />
        </div>
        <div className="m-row">
          <label htmlFor="operatorId">Operador:</label>
          <FormDropdown
            name="operatorId"
            control={control}
            options={operators}
            optionLabel="label"
            rules={{
              required: 'Operador no seleccionado'
            }}
          />
        </div>
        <div className="m-row">
          <label htmlFor="description">Descripción:</label>
          <FormInput
            control={control}
            name="description"
            rules={{
              required: 'Descripción no ingresada',
              maxLength: { value: 100, message: 'La descripción supera los 100 caracteres' }
            }}
          />
        </div>
      </div>
      <div className="buttons">
        <Button
          label="Guardar"
          loading={isMutating || isLoading}
          disabled={isMutating || isLoading}
          className="button"
          loadingIcon="pi pi-spin pi-spinner"
          iconPos="right"
          type="submit"
        />
      </div>
    </form>
  )
}

export default ContractModal

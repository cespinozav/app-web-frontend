import { FormDropdown, FormInput, FormInputNumber } from 'components/FormControls'
import { useQuery } from 'hooks/useRequest'
import useToast from 'hooks/useToast'
import { Button } from 'primereact/button'
import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { KitService } from 'services'
import { CURRENCY } from 'utils/constants'
import { formatNumber } from 'utils/numbers'

const DEFAULT_FIELDS = {
  description: '',
  operatorId: '',
  currency: '',
  cost: 0,
  userCreated: ''
}
const IGV = 0.18

function TotalAmount({ control }) {
  const cost = useWatch({ control, name: 'cost' })
  const currency = useWatch({ control, name: 'currency' })
  const currencyObj = CURRENCY.find(c => c.value === currency) || { label: '' }
  const totalCost = formatNumber((1 + IGV) * cost)
  return <div>{`${currencyObj.label} ${totalCost}`}</div>
}

function AdditionalModal({ defaultFields, onSubmitFields, isMutating }) {
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
    if (operators.length > 0) {
      reset({ ...DEFAULT_FIELDS, ...defaultFields })
    }
  }, [defaultFields, data])

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
      <h2 className="header">Edición de registro</h2>
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
          <label htmlFor="currency">Moneda:</label>
          <FormDropdown
            name="currency"
            control={control}
            options={CURRENCY}
            optionLabel="label"
            rules={{
              required: 'Moneda no seleccionada'
            }}
          />
        </div>
        <div className="m-row">
          <label htmlFor="cost">Costo sin IGV:</label>
          <FormInputNumber
            control={control}
            name="cost"
            mode="decimal"
            maxFractionDigits={2}
            // mode="currency"
            // currency="USD"
            rules={{
              required: 'Costo no ingresado',
              min: { value: 0, message: 'El costo debe ser mayor a 0' },
              max: { value: 1000000, message: 'El costo debe ser menor a 10000000 unidades' }
              // validate: v => v > 0 || 'El costo debe ser mayor a 0'
            }}
          />
        </div>
        <div className="simple-row">
          <label htmlFor="amount">Tarifa mensual con IGV:</label>
          <TotalAmount control={control} />
        </div>
      </div>
      <div className="buttons">
        <Button
          label="Guardar"
          loading={isLoading || isMutating}
          disabled={isLoading || isMutating}
          className="button"
          loadingIcon="pi pi-spin pi-spinner"
          icon="pi pi-save"
          iconPos="right"
          type="submit"
        />
      </div>
    </form>
  )
}

export default AdditionalModal

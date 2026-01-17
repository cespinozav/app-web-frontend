import { useQueries } from '@tanstack/react-query'
import { FormDropdown, FormInput, FormInputNumber } from 'components/FormControls'
import useToast from 'hooks/useToast'
import { Button } from 'primereact/button'
import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { KitService } from 'services'
import { CURRENCY } from 'utils/constants'
// import { multiFetch } from 'utils/network'
import { formatNumber } from 'utils/numbers'

const DEFAULT_FIELDS = {
  description: '',
  typeServiceId: '',
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

function usePlansInfo() {
  const [operatorsQuery, typesQuery] = useQueries({
    queries: [
      { queryKey: [KitService.operators.id], queryFn: KitService.operators.get },
      { queryKey: [KitService.typeService.id], queryFn: KitService.typeService.get }
    ]
  })
  const operators = operatorsQuery.data?.map(d => ({ value: d.id, label: d.description })) || []
  const typeServices = typesQuery.data?.map(d => ({ value: d.id, label: d.description })) || []
  return {
    data: [operators, typeServices],
    // isLoading: Boolean(operatorsQuery.isLoading || typesQuery.isLoading),
    isSuccess: Boolean(operatorsQuery.isSuccess && typesQuery.isSuccess)
  }
}

function PlansModal({ defaultFields, onSubmitFields, isMutating }) {
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
  const { data, isSuccess } = usePlansInfo()
  const [operators, typeServices] = data

  useEffect(() => {
    if (defaultFields && isSuccess) {
      reset({ ...DEFAULT_FIELDS, ...defaultFields })
    }
  }, [defaultFields, isSuccess])

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
      <h2 className="header">{isEditing ? 'Editar' : 'Agregar'} plan</h2>
      <div className="content">
        <div className="m-row">
          <label htmlFor="typeServiceId">Tipo:</label>
          <FormDropdown
            name="typeServiceId"
            control={control}
            options={typeServices}
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
            // locale="en-US"
            maxFractionDigits={2}
            rules={{
              required: 'Costo no ingresado',
              min: { value: 0, message: 'El costo debe ser mayor a 0' },
              max: { value: 1000000, message: 'El costo debe ser menor a 10000000 unidades' }
              // validate: {
              //   minVal: v => v > 0 || 'El costo debe ser mayor a 0',
              //   maxVal: v => v < 150 || 'El costo debe ser menor a 150'
              // }
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
          loading={isMutating || !isSuccess}
          disabled={isMutating || !isSuccess}
          className="button"
          loadingIcon="pi pi-spin pi-spinner"
          iconPos="right"
          type="submit"
        />
      </div>
    </form>
  )
}

export default PlansModal

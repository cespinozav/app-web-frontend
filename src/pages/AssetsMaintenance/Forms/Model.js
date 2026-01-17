import { FormDropdown, FormInput, FormInputNumber } from 'components/FormControls'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { AssetService } from 'services'
import useToast from 'hooks/useToast'
import { useQuery } from 'hooks/useRequest'
import { Button } from 'primereact/button'
import { CURRENCY } from 'utils/constants'

const DEFAULT_FIELDS = {
  brand: '',
  currency: '',
  cost: 0,
  description: ''
}

function ModelModal({ defaultFields, onSubmitFields, isMutating }) {
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
  const { data, isLoading } = useQuery([AssetService.brand.id], AssetService.brand.get)
  const brands =
    data?.map(l => ({
      label: l.description,
      value: l.id
    })) || []

  useEffect(() => {
    if (brands.length > 0 && defaultFields) {
      reset({ ...DEFAULT_FIELDS, ...defaultFields, brand: defaultFields.brandId })
    }
  }, [defaultFields, data])

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
      <h2 className="header">{isEditing ? 'Editar' : 'Agregar'} modelo de activo</h2>
      <div className="content">
        <div className="m-row">
          <label htmlFor="brand">Marca:</label>
          <FormDropdown
            name="brand"
            control={control}
            options={brands}
            optionLabel="label"
            rules={{
              required: 'Marca no seleccionada'
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
          <label htmlFor="cost">Costo:</label>
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

export default ModelModal

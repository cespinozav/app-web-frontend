import { FormDropdown, FormInput, FormInputNumber } from 'components/FormControls'
import { Button } from 'primereact/button'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { KitService } from 'services'
import useToast from 'hooks/useToast'
import { useQuery } from 'hooks/useRequest'
import { CURRENCY } from 'utils/constants'

const DEFAULT_FIELDS = {
  brandId: '',
  description: ''
}

function ModelModal({ defaultFields, onSubmitFields, isMutating }) {
  const toast = useToast()
  const {
    control,
    handleSubmit,
    reset,
    formState: { dirtyFields }
  } = useForm({
    defaultValues: DEFAULT_FIELDS
  })
  const { data, isLoading } = useQuery([KitService.brands.id], KitService.brands.get)
  const brands =
    data?.map(d => ({
      label: d.description,
      value: d.id
    })) || []

  useEffect(() => {
    if (brands.length > 0) {
      reset({ ...DEFAULT_FIELDS, ...defaultFields })
    }
  }, [defaultFields, data])
  const isEditing = Boolean(defaultFields)

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
      <h2 className="header">{isEditing ? 'Editar' : 'Agregar'} Modelo</h2>
      <div className="content">
        <div className="m-row">
          <label htmlFor="brandId">Marca:</label>
          <FormDropdown
            name="brandId"
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
            maxFractionDigits={3}
            rules={{
              required: 'Costo no ingresado',
              min: { value: 0, message: 'El costo debe ser mayor a 0' },
              max: { value: 100000, message: 'El costo debe ser menor a 100000 unidades' }
            }}
          />
        </div>

      </div>
      <div className="buttons">
        <Button
          label="Guardar"
          disabled={isLoading || isMutating}
          loading={isLoading || isMutating}
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

export default ModelModal

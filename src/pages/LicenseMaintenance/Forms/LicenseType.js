import { FormDropdown, FormInput, FormInputNumber } from 'components/FormControls'
import { Button } from 'primereact/button'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { LicenseService } from 'services'
import { CURRENCY } from 'utils/constants'
import useToast from 'hooks/useToast'
import { useQuery } from 'hooks/useRequest'

const DEFAULT_FIELDS = {
  licenseId: '',
  description: '',
  amount: 0,
  currency: CURRENCY[0].value,
  quantity: ''
}

function LicenseTypesModal({ defaultFields, onSubmitFields, isMutating }) {
  const toast = useToast()
  const {
    control,
    handleSubmit,
    reset,
    formState: { dirtyFields }
  } = useForm({
    defaultValues: DEFAULT_FIELDS
  })
  const { data, isLoading } = useQuery([LicenseService.licenses.id], LicenseService.licenses.get)
  const licenses =
    data?.map(l => ({
      label: l.description,
      value: l.id
    })) || []

  useEffect(() => {
    if (licenses.length > 0) {
      reset({ ...DEFAULT_FIELDS, ...defaultFields })
    }
  }, [defaultFields, data])
  const isEditing = Boolean(defaultFields)

  const onSubmit = formData => {
    const formattedData = {
      ...formData,
      license: formData.licenseId
    }
    if (defaultFields) {
      const dirtyList = Object.keys(dirtyFields)
      if (dirtyList.length === 0) {
        toast.error('Debe cambiar algún campo')
        return
      }
    }
    onSubmitFields(formattedData)
  }

  const handleError = errors => {
    const messages = Object.values(errors)
      .slice(0, 4)
      .map(e => e.message)
    toast.error(messages)
  }

  return (
    <form className="section" onSubmit={handleSubmit(onSubmit, handleError)}>
      <h2 className="header">{isEditing ? 'Editar' : 'Agregar'} tipo de licencia</h2>
      <div className="content">
        <div className="m-row">
          <label htmlFor="license">Licencia:</label>
          <FormDropdown
            name="licenseId"
            control={control}
            options={licenses}
            optionLabel="label"
            rules={{
              required: 'Licencia no seleccionada'
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
          <label htmlFor="amount">Costo:</label>
          <FormInputNumber
            control={control}
            name="amount"
            mode="decimal"
            maxFractionDigits={2}
            rules={{
              required: 'Costo no ingresado',
              min: { value: -1, message: 'El costo debe ser como mínimo 0' },
              validate: val => parseInt(val, 10) < 1000 || 'El costo debe ser menor a 1000 unidades'
            }}
          />
        </div>
        <div className="m-row">
          <label htmlFor="quantity">Cantidad:</label>
          <FormInputNumber
            control={control}
            name="quantity"
            rules={{
              min: {
                value: 1,
                message: 'La cantidad mínima es 1'
              },
              required: 'Cantidad no ingresada'
            }}
          />
        </div>
      </div>
      <div className="buttons">
        <Button
          label="Guardar"
          loading={isLoading || isMutating}
          disabled={isLoading || isMutating}
          className="button"
          loadingIcon="pi pi-spin pi-spinner"
          iconPos="right"
          type="submit"
        />
      </div>
    </form>
  )
}

export default LicenseTypesModal

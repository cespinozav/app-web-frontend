import { FormDropdown, FormInput } from 'components/FormControls'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { AssetService } from 'services'
import useToast from 'hooks/useToast'
import { Button } from 'primereact/button'
import { useQuery } from 'hooks/useRequest'

const DEFAULT_FIELDS = {
  type: '',
  description: ''
}

function GenericSpecModal(title) {
  return function SpecModal({ defaultFields, isMutating, onSubmitFields }) {
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

    const { data, isLoading } = useQuery([AssetService.typeAsset.id], AssetService.typeAsset.get)
    const types = data?.map(l => ({
      label: l.description,
      value: l.id
    }))

    useEffect(() => {
      if (types.length > 0 && defaultFields) {
        reset({ ...DEFAULT_FIELDS, ...defaultFields, type: defaultFields.typeId })
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
        <h2 className="header">
          {isEditing ? 'Editar' : 'Agregar'} {title}
        </h2>
        <div className="content">
          <div className="m-row">
            <label htmlFor="type">Tipo de activo:</label>
            <FormDropdown
              name="type"
              control={control}
              options={types}
              optionLabel="label"
              rules={{
                required: 'Tipo de activo no seleccionado'
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
}

export default GenericSpecModal

import { FILE_FORMATS, LICENSE_BINNACLE } from 'utils/constants'
import { FormAutoComplete, FormDropdown, FormFileDrop, FormInput, FormTextArea } from 'components/FormControls'
import { useForm } from 'react-hook-form'
import { LicenseService, PersonService } from 'services'
import { useQuery } from 'hooks/useRequest'
import { Button } from 'primereact/button'
import { useEffect } from 'react'
import useToast from 'hooks/useToast'

const DEFAULT_FIELDS = {
  classification: '',
  authorizer: null,
  method: '',
  reference: '',
  comment: '',
  documents: []
}

function ConfirmEditForm({
  onSubmitFields,
  handleError,
  submitFields,
  keepSubmitFields,
  disabled,
  defaultFields,
  saveDefault
}) {
  const { data } = useQuery([LicenseService.classifications.id], LicenseService.classifications.get)
  const classification =
    data?.map(c => ({
      value: c.id,
      label: c.description
    })) || []
  const { control, setValue, handleSubmit, getValues } = useForm({
    defaultValues: { ...DEFAULT_FIELDS, ...defaultFields, ...submitFields }
  })

  useEffect(() => {
    if (defaultFields && saveDefault) {
      const personId = defaultFields?.authorizer?.personId
      saveDefault({ ...defaultFields, authorizer: personId })
    }
    return () => {
      const formData = getValues()
      keepSubmitFields(formData)
    }
  }, [])
  const toast = useToast()
  const onUpload = async file =>
    LicenseService.uploadFile.post(file).then(res => {
      toast.success('Archivo subido!')
      return res
    })
  const onSubmit = formData => {
    const personId = formData?.authorizer?.personId
    if (personId) {
      onSubmitFields({ ...formData, authorizer: personId })
    } else {
      setValue('authorizer', null)
      handleError({ error: { message: 'Debe seleccionar un autorizador del autocompletado' } })
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit, handleError)}>
      <div className="section">
        <div className="content">
          <div className="simple-row">
            <label htmlFor="classification">Clasificación:</label>
            <FormDropdown
              name="classification"
              control={control}
              options={classification}
              optionLabel="label"
              rules={{
                required: 'Clasificación no seleccionada'
              }}
            />
          </div>
          <div className="simple-row">
            <label htmlFor="authorizer">Autorización:</label>
            <FormAutoComplete
              request={name => PersonService.filters({ name })}
              rules={{
                required: 'Autorizador no ingresado'
              }}
              field="name"
              name="authorizer"
              control={control}
            />
          </div>
          <div className="simple-row">
            <label htmlFor="method">Medio:</label>
            <FormDropdown
              name="method"
              control={control}
              options={LICENSE_BINNACLE.METHODS}
              optionLabel="label"
              rules={{
                required: 'Método no seleccionado'
              }}
            />
          </div>
          <div className="simple-row">
            <label htmlFor="reference">Referencia:</label>
            <FormInput control={control} name="reference" rules={{ required: 'Referencia no ingresada' }} />
          </div>
          <div className="simple-row">
            <label htmlFor="comment">Comentario:</label>
            <FormTextArea control={control} name="comment" rules={{ required: 'Comentario no ingresado' }} />
          </div>
          <div className="simple-row">
            <label htmlFor="documents">Documento:</label>
            <FormFileDrop
              control={control}
              name="documents"
              formats={[FILE_FORMATS.IMAGE, FILE_FORMATS.PDF]}
              onUpload={onUpload}
              onError={errMessage => toast.error(errMessage)}
            />
          </div>
        </div>
      </div>
      <div className="buttons">
        <Button
          label="Guardar"
          loading={disabled}
          disabled={disabled}
          className="button"
          loadingIcon="pi pi-spin pi-spinner"
          iconPos="right"
          icon="pi pi-save"
          type="submit"
        />
      </div>
    </form>
  )
}

export default ConfirmEditForm

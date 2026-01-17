import { useForm } from 'react-hook-form'
import { FormFileDrop } from 'components/FormControls'
import { Button } from 'primereact/button'

export default function FileLoadForm({ onSubmitFields, handleError, isMutating, submitFields }) {
  const { control, handleSubmit } = useForm({ defaultValues: { document: submitFields ? submitFields.document : [] } })
  const onLoad = formData => {
    onSubmitFields(formData)
  }
  return (
    <form onSubmit={handleSubmit(onLoad, handleError)}>
      <div className="section">
        <div className="content">
          <div className="simple-row">
            <label htmlFor="document">Documento:</label>
            <FormFileDrop
              message="Seleccionar archivo"
              control={control}
              maxFiles={1}
              formats={['.csv']}
              name="document"
              rules={{ required: 'Debe elegir un archivo' }}
            />
          </div>
        </div>
      </div>
      <div className="buttons">
        <Button
          label="Validar"
          loading={isMutating}
          disabled={isMutating}
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

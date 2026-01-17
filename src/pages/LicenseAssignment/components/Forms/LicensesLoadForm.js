import { FormDropdown } from 'components/FormControls'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { useForm } from 'react-hook-form'
import { LICENSE_LOAD_MODE } from 'utils/constants'

export default function LicensesLoadForm({ onSubmitFields, validatedData, isMutating, handleError }) {
  const { control, handleSubmit } = useForm({ defaultValues: { mode: '' } })
  const onLoad = formData => {
    onSubmitFields(formData)
  }
  return (
    <>
      <DataTable
        className="dialog-table"
        value={validatedData}
        responsiveLayout="stack"
        breakpoint="760px"
        dataKey="id"
      >
        <Column field="numRow" header="Fila:"></Column>
        <Column field="completeName" header="Nombre:"></Column>
        <Column field="licensesNames" header="Licencias:"></Column>
        <Column field="country" header="País:"></Column>
        <Column field="observation" header="Observación:"></Column>
      </DataTable>
      <form onSubmit={handleSubmit(onLoad, handleError)}>
        <div className="section">
          <div className="content">
            <div className="simple-row">
              <label htmlFor="mode">Tipo de carga:</label>
              <FormDropdown
                name="mode"
                options={LICENSE_LOAD_MODE}
                control={control}
                rules={{ required: 'Tipo de carga no seleccionada' }}
              />
            </div>
          </div>
        </div>
        <div className="buttons">
          <Button
            label="Cargar"
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
    </>
  )
}

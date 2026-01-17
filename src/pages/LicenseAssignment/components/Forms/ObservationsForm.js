import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'

export default function ObservationsForm({ validatedData, onClose }) {
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
        <Column field="licensesNames" header="Licencias:"></Column>
        <Column field="country" header="País:"></Column>
        <Column field="observation" header="Observación:"></Column>
      </DataTable>
      <div className="buttons">
        <button className="button" onClick={onClose}>
          Aceptar
        </button>
      </div>
    </>
  )
}

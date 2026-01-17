import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Paginator } from 'primereact/paginator'
import { Skeleton } from 'primereact/skeleton'
import { useState } from 'react'
import FILES from 'assets/img/icons/files.svg'
import { capitalize } from 'utils/misc'
import { AddRegisterModal } from '../Modals'
import DeleteAssignmentsModal from '../Modals/DeleteAssignmentsModal'

const VIEW = {
  NONE: 'NONE',
  ADD: 'ADD',
  DELETE: 'DELETE'
}

export default function AssetList({ assignments, isLoading, onDetails, updateAssignment, pageHandling }) {
  const { firstRow, rowCount, onPageChange } = pageHandling
  const [selected, setSelected] = useState(null)
  const [showModal, setShowModal] = useState(VIEW.NONE)
  const data = assignments.map(assignment => ({
    ...assignment,
    id: assignment.id,
    ceco: assignment.cecoCode,
    name: assignment.names
      ? `${capitalize(assignment.lastnameP)} ${capitalize(assignment.lastnameM)}, ${capitalize(assignment.names)}`
      : '-',
    userStatus: assignment.userState,
    assetType: assignment.assetType.label,
    index: assignment.index
  }))
  const assignmentsIds = assignments.map(a => a.id)
  const assigmentsToDelete = selected?.filter(d => assignmentsIds.includes(d.id))
  const enableDelete = assigmentsToDelete?.length > 0
  const onCloseModal = () => setShowModal(VIEW.NONE)
  return (
    <div className="kit-list license">
      <AddRegisterModal isVisible={showModal === VIEW.ADD} onClose={onCloseModal} />
      <DeleteAssignmentsModal
        assignmentRows={assigmentsToDelete}
        onClose={onCloseModal}
        updateAssignment={updateAssignment}
        isVisible={showModal === VIEW.DELETE}
      />
      <div>
        <div className="header title">
          <div>LISTADO GENERAL</div>
          <div className="buttons">
            <button
              onClick={() => setShowModal(VIEW.DELETE)}
              disabled={!enableDelete}
              className={enableDelete ? 'delete' : 'disabled'}
            >
              <span>Eliminar</span>
              <i className="pi pi-trash"></i>
            </button>
            <button onClick={() => setShowModal(VIEW.ADD)} className="add">
              Agregar +
            </button>
          </div>
        </div>
        {isLoading && Array.from({ length: 10 }).map((_, key) => <Skeleton className="table" key={key}></Skeleton>)}
        {!isLoading &&
          (assignments.length === 0 ? (
            <div className="empty">
              <img src={FILES} alt="files" />
              <span>Realiza la búsqueda de un registro.</span>
            </div>
          ) : (
            <>
              <DataTable
                className="table"
                value={data}
                responsiveLayout="stack"
                breakpoint="760px"
                dataKey="id"
                selection={selected}
                onSelectionChange={e => setSelected(e.value)}
              >
                <Column selectionMode="multiple" headerStyle={{ width: '3em' }}></Column>
                <Column field="name" header="NOMBRE:"></Column>
                <Column field="ceco" header="CECO:"></Column>
                <Column field="cecoDesc" header="DESCRIPCIÓN DE CECO:"></Column>
                <Column field="assetType" header="TIPO DE ACTIVO:"></Column>
                <Column field="assetCode" header="COD. EQUIPO:"></Column>
                <Column
                  header="ESTADO DE USUARIO:"
                  alignHeader="center"
                  body={row => {
                    const { label, classname } = row.userStatus
                    return <div className={`status ${classname}`}>{label}</div>
                  }}
                ></Column>
                <Column
                  header="ESTADO DE ACTIVO:"
                  alignHeader="center"
                  body={row => {
                    const { label, classname } = row.status
                    return <div className={`status ${classname}`}>{label}</div>
                  }}
                ></Column>
                <Column
                  header="ACCIÓN:"
                  headerClassName="action"
                  body={rowData => (
                    <div className="actions">
                      <Button icon="pi pi-eye" iconPos="right" onClick={() => onDetails(rowData.id)} />
                    </div>
                  )}
                ></Column>
              </DataTable>
              <Paginator
                first={firstRow}
                rows={10}
                onPageChange={onPageChange}
                // onPageChange={e => setFirstRow(e.first)}
                totalRecords={rowCount}
              ></Paginator>
            </>
          ))}
      </div>
    </div>
  )
}

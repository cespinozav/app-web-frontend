import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Paginator } from 'primereact/paginator'
import { Skeleton } from 'primereact/skeleton'
import { useState } from 'react'
import FILES from 'assets/img/icons/files.svg'
import { capitalize } from 'utils/misc'
// import FileDropArea from 'components/FileUpload/FileDropArea'
import { AddRegisterModal } from '../Modals'
import MassiveLoadModal from '../Modals/MassiveLoadModal'
import DeleteAssignmentsModal from '../Modals/DeleteAssignmentsModal'

const VIEWS = {
  NONE: 1,
  ADD: 2,
  UPLOAD: 3,
  DELETE: 4
}

export default function LicenseList({ assignments, isLoading, onDetails, pageHandling, updateAssignment }) {
  const { firstRow, rowCount, onPageChange } = pageHandling
  const [selected, setSelected] = useState(null)
  const [view, setView] = useState(VIEWS.NONE)
  const data = assignments.map(assignment => {
    const licenseNamesStr = assignment.licenses.map(l => l.name).join(' - ')
    const typeLicenseNamesStr = assignment.licenses.map(l => l.types.map(t => t.name).join(',')).join(' - ')
    // console.log(assignment.licenses)
    return {
      ...assignment,
      id: assignment.id,
      ceco: assignment.cecoCode,
      user: assignment.userRed || '-',
      name: assignment.names
        ? `${capitalize(assignment.lastnameP)} ${capitalize(assignment.lastnameM)}, ${capitalize(assignment.names)}`
        : '-',
      email: assignment.email || '-',
      userStatus: assignment.userState,
      license: licenseNamesStr,
      typeLicense: typeLicenseNamesStr,
    }
  })
  const assignmentsIds = assignments.map(a => a.id)
  const assigmentsToDelete = selected?.filter(d => assignmentsIds.includes(d.id))
  const enableDelete = assigmentsToDelete?.length > 0
  const onCloseModal = () => setView(VIEWS.NONE)
  return (
    <div className="kit-list license">
      <AddRegisterModal isVisible={view === VIEWS.ADD} onClose={onCloseModal} />
      <MassiveLoadModal isVisible={view === VIEWS.UPLOAD} onClose={onCloseModal} />
      <DeleteAssignmentsModal
        assignmentRows={assigmentsToDelete}
        onClose={onCloseModal}
        updateAssignment={updateAssignment}
        isVisible={view === VIEWS.DELETE}
      />
      <div>
        <div className="header title">
          <div>LISTADO GENERAL</div>
          <div className="buttons">
            <button
              onClick={() => setView(VIEWS.DELETE)}
              disabled={!enableDelete}
              className={enableDelete ? 'delete' : 'disabled'}
            >
              <span>Eliminar</span>
              <i className="pi pi-trash"></i>
            </button>

            <button onClick={() => setView(VIEWS.UPLOAD)} className="upload">
              <span>Carga Masiva</span>
              <i className="pi pi-upload"></i>
            </button>
            <button onClick={() => setView(VIEWS.ADD)} className="add">
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
                <Column field="user" header="USUARIO:"></Column>
                <Column field="name" header="NOMBRE:"></Column>
                <Column field="email" header="CORREO:" align="center"></Column>
                <Column field="ceco" header="CECO:"></Column>
                <Column field="country" header="PAÍS:"></Column>
                <Column field="cecoDesc" header="DESCRIPCIÓN DE CECO:"></Column>
                <Column field="typeLicense" header="TIPO LICENCIA:"></Column>
                <Column
                  header="ESTADO DE USUARIO:"
                  alignHeader="center"
                  body={row => {
                    const { label, classname } = row.userStatus
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

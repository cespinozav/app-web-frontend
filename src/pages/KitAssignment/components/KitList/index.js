import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Paginator } from 'primereact/paginator'
import { Skeleton } from 'primereact/skeleton'
import { useState } from 'react'
import FILES from 'assets/img/icons/files.svg'
import { capitalize } from 'utils/misc'
import { getContract, getServicesCost } from 'pages/KitAssignment/utils'
import { AddRegisterModal } from '../Modals'
import DeleteAssignmentsModal from '../Modals/DeleteAssignmentsModal'

const VIEW = {
  NONE: 'NONE',
  ADD: 'ADD',
  DELETE: 'DELETE'
}

export default function KitList({
  assignments,
  isLoading,
  onDetails,
  pageHandling,
  updateAssignment
}) {
  const { firstRow, rowCount, onPageChange } = pageHandling
  const [selected, setSelected] = useState(null)
  const [showModal, setShowModal] = useState(VIEW.NONE)
  const data = assignments.map(assignment => {
    const name = assignment.names
      ? `${capitalize(assignment.lastnameP)} ${capitalize(
          assignment.lastnameM
        )}, ${capitalize(assignment.names)}`
      : '-'
    const isHolder = assignment.assignType.value === 'T'
    const assignTo = isHolder ? name : assignment.assignTo
    return {
      ...assignment,
      id: assignment.id,
      ceco: assignment.cecoCode,
      name,
      assignTo,
      userStatus: assignment.userState,
      additional1: assignment?.additional1?.serviceNum ?? '-',
      additional2: assignment?.additional2?.serviceNum ?? '-',
      plan: assignment.plan.serviceNum,
      totalCost: getServicesCost(assignment),
      holder: isHolder ? 'SI' : 'NO'
    }
  })
  const assignmentsIds = assignments.map(a => a.id)
  const assigmentsToDelete = selected?.filter(d =>
    assignmentsIds.includes(d.id)
  )
  const enableDelete = assigmentsToDelete?.length > 0
  const onCloseModal = () => setShowModal(VIEW.NONE)
  return (
    <div className="kit-list license">
      <AddRegisterModal
        isVisible={showModal === VIEW.ADD}
        onClose={onCloseModal}
      />
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
        {isLoading &&
          Array.from({ length: 10 }).map((_, key) => (
            <Skeleton className="table" key={key}></Skeleton>
          ))}
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
                <Column
                  selectionMode="multiple"
                  headerStyle={{ width: '3em' }}
                ></Column>
                <Column field="phone" header="NÚMERO:"></Column>
                <Column
                  header="ESTADO DE LINEA:"
                  alignHeader="center"
                  body={row => {
                    const { label, classname } = row.lineStatus
                    return <div className={`status ${classname}`}>{label}</div>
                  }}
                ></Column>
                <Column
                  header="ESTADO DE EQUIPO:"
                  alignHeader="center"
                  body={row => {
                    const { label, classname } = row.kitStatus
                    return <div className={`status ${classname}`}>{label}</div>
                  }}
                ></Column>
                <Column
                  header="RESPONSABLE:"
                  alignHeader="center"
                  body={row => {
                    const { classname, value } = row.userStatus
                    const styleName =
                      value === 'C' ? `responsible ${classname}` : 'responsible'
                    return <div className={styleName}>{row.name}</div>
                  }}
                ></Column>
                <Column field="holder" header="TITULAR:"></Column>
                <Column field="assignTo" header="ASIGNADO A:"></Column>
                <Column field="operatorName" header="OPERADOR:"></Column>
                <Column field="typeServiceName" header="TIPO:"></Column>
                <Column field="cecoDesc" header="DESCRIPCIÓN DE CECO:"></Column>
                <Column field="plan" header="PLAN:"></Column>
                <Column field="additional1" header="SSAA 01:"></Column>
                <Column field="additional2" header="SSAA 02:"></Column>
                <Column field="totalCost" header="TARIFA MENSUAL:"></Column>
                <Column
                  header="ESTADO DE CONTRATO:"
                  alignHeader="center"
                  body={row => {
                    const contract = getContract(row)
                    return (
                      <div className={contract.classname}>
                        <div>{contract.label}</div>
                        <div>{contract.subLabel}</div>
                      </div>
                    )
                  }}
                ></Column>
                <Column
                  header="ACCIÓN:"
                  headerClassName="action"
                  body={rowData => (
                    <div className="actions">
                      <Button
                        icon="pi pi-eye"
                        iconPos="right"
                        onClick={() => onDetails(rowData.id)}
                      />
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

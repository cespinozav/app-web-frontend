import { Button } from 'primereact/button'
import { Checkbox } from 'primereact/checkbox'
import { Skeleton } from 'primereact/skeleton'
import { useState } from 'react'
import { capitalize } from 'utils/misc'
import { ResponsibleEditModal } from '../Modals'

const ResponsibleDetails = ({ assignment, updateAssignment, isLoading }) => {
  const { userState, assignType } = assignment || {}
  const isHolder = assignType.value === 'T'
  const name = assignment.names
    ? `${capitalize(assignment.lastnameP)} ${capitalize(assignment.lastnameM)}, ${capitalize(assignment.names)}`
    : '-'
  const [showModal, setShowModal] = useState(false)
  return (
    <div className="details responsible">
      <ResponsibleEditModal
        onClose={() => setShowModal(false)}
        isVisible={showModal}
        defaultFields={assignment}
        updateAssignment={updateAssignment}
      />
      <div className="fields primary">
        <div className="field">
          <div>NOMBRE RESPONSABLE:</div>
          {!isLoading ? <div>{name}</div> : <Skeleton></Skeleton>}
        </div>
        <div className="field">
          <div>DNI:</div>
          {!isLoading ? <div>{assignment.dni || '-'}</div> : <Skeleton></Skeleton>}
        </div>
        <div className="field">
          <div>EMPRESA:</div>
          {!isLoading ? <div>{assignment.company || '-'}</div> : <Skeleton></Skeleton>}
        </div>
        <div className="field">
          <div className="actions">ACCION:</div>
          {!isLoading && (
            <div className="actions">
              <Button
                icon="pi pi-pencil"
                iconPos="right"
                onClick={() => {
                  setShowModal(true)
                }}
              />
            </div>
          )}
        </div>
      </div>
      <div className="fields">
        <div className="field">
          <div>CARGO:</div>
          {!isLoading ? <div>{assignment?.job?.trim() || '-'}</div> : <Skeleton></Skeleton>}
        </div>
        <div className="field">
          <div>UNIDAD:</div>
          {!isLoading ? <div>{assignment.unitNum || '-'}</div> : <Skeleton></Skeleton>}
        </div>
        <div className="field">
          <div>GERENCIA:</div>
          {!isLoading ? <div>{assignment.areaNum || '-'}</div> : <Skeleton></Skeleton>}
        </div>
        <div className="field">
          <div>CECO:</div>
          {!isLoading ? <div>{assignment.cecoCode || '-'}</div> : <Skeleton></Skeleton>}
        </div>
        <div className="field">
          <div>DESCRIPCIÓN DEL CECO:</div>
          {!isLoading ? <div>{assignment.cecoDesc || '-'}</div> : <Skeleton></Skeleton>}
        </div>
        {/* <div className="field">
          <div>USUARIO:</div>
          <div>{assignment.userRed || '-'}</div>
        </div> */}
        <div className="field">
          <div>CORREO ELECTRÓNICO:</div>
          {!isLoading ? <div>{assignment.email || '-'}</div> : <Skeleton></Skeleton>}
        </div>
        <div className="field">
          <div>TITULAR:</div>
          <Checkbox
            className="check"
            inputId="assigned"
            // onChange={changeCheckbox}
            checked={isHolder}
            disabled={true}
            // disabled={mode === MODES.READ || !assignment.names}
          ></Checkbox>
        </div>
        {/* <div className="field">
          <div>CUENTA:</div>
          <div className={assignType.classname}>{assignType.label}</div>
        </div> */}
        <div className="field">
          <div>ASIGNADO A:</div>
          {!isLoading ? <div>{isHolder ? name : assignment.assignTo}</div> : <Skeleton></Skeleton>}
        </div>
        <div className="field">
          <div>ESTADO DE USUARIO:</div>
          {!isLoading ? (
            <div className={`status ${userState.classname}`}>{userState.label}</div>
          ) : (
            <Skeleton></Skeleton>
          )}
        </div>
      </div>
    </div>
  )
}
export default ResponsibleDetails

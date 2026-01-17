import { useState } from 'react'
import { Button } from 'primereact/button'
import { Skeleton } from 'primereact/skeleton'
import { DeleteRegisterModal } from 'components/Modals'
import { AssetService } from 'services'
import { EditRegisterModal } from '../Modals'

const MODAL_VIEW = {
  NONE: 'NONE',
  EDIT: 'EDIT',
  DELETE: 'DELETE'
}

export default function AssetDetails({ assignment, updateAssignment, isLoading }) {
  const [showModal, setShowModal] = useState(MODAL_VIEW.NONE)
  const onModalClose = () => {
    setShowModal(MODAL_VIEW.NONE)
  }
  return (
    <>
      <div className="header title detail">ACTIVO ASIGNADO</div>
      <div className="details asset">
        <EditRegisterModal
          onClose={onModalClose}
          isVisible={showModal === MODAL_VIEW.EDIT}
          defaultFields={assignment}
          updateAssignment={updateAssignment}
        />
        <DeleteRegisterModal
          onClose={onModalClose}
          isVisible={showModal === MODAL_VIEW.DELETE}
          onDelete={() => AssetService.assignments.delete({ id: assignment.id }).then(() => updateAssignment())}
        />
        <div className="fields primary">
          <div className="field">
            <div>EQUIPO:</div>
            {!isLoading ? <div>{assignment.assetCode || '-'}</div> : <Skeleton></Skeleton>}
          </div>
          <div className="field">
            <div>ACTIVO:</div>
            {!isLoading ? <div>{assignment.assetType.label || '-'}</div> : <Skeleton></Skeleton>}
          </div>
          <div className="field">
            <div>MARCA:</div>
            {!isLoading ? <div>{assignment.brand.label || '-'}</div> : <Skeleton></Skeleton>}
          </div>
          <div className="field">
            <div>SERIE:</div>
            {!isLoading ? <div>{assignment.serialNum || '-'}</div> : <Skeleton></Skeleton>}
          </div>

          <div className="field">
            <div>COD. LEASING:</div>
            {!isLoading ? <div>{assignment.leasing.label || '-'}</div> : <Skeleton></Skeleton>}
          </div>
          <div className="field">
            <div>ESTADO DE ACTIVO:</div>
            {!isLoading ? (
              <div className={`status ${assignment.status.classname}`}>{assignment.status.label}</div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
          <div className="field">
            <div>SITUACION:</div>
            {!isLoading ? (
              <div className={assignment.situation.classname}>{assignment.situation.label}</div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
          <div className="field">
            <div className="actions">ACCIÓN:</div>
            {!isLoading ? (
              <div className="actions">
                <Button
                  icon="pi pi-pencil"
                  iconPos="right"
                  onClick={() => {
                    setShowModal(MODAL_VIEW.EDIT)
                  }}
                />
                <Button
                  icon="pi pi-trash"
                  iconPos="right"
                  onClick={() => {
                    setShowModal(MODAL_VIEW.DELETE)
                  }}
                />
              </div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

import { useState } from 'react'
import { Button } from 'primereact/button'
import { formatDate, getMonthsTillNow } from 'utils/dates'
import { Skeleton } from 'primereact/skeleton'
import { getContract, getServicesCost } from 'pages/KitAssignment/utils'
import { DeleteRegisterModal } from 'components/Modals'
import { KitService } from 'services'
import { PlanModal, EditRegisterModal } from '../Modals'

const MODAL_VIEW = {
  NONE: 'NONE',
  PLANS: 'PLANS',
  EDIT: 'EDIT',
  DELETE: 'DELETE'
}

export default function DeviceDetails({ assignment, updateAssignment, isLoading }) {
  const [showModal, setShowModal] = useState(MODAL_VIEW.NONE)
  const { startDate, endDate } = assignment || {}
  const monthDiff = endDate && getMonthsTillNow(endDate)
  const contract = assignment && getContract(assignment)
  const totalCost = getServicesCost(assignment)
  const onClose = () => {
    setShowModal(MODAL_VIEW.NONE)
  }
  return (
    <>
      <div className="header title">EQUIPO ASIGNADO</div>
      <div className="details kit">
        <PlanModal
          isVisible={showModal === MODAL_VIEW.PLANS}
          assignment={assignment}
          totalCost={totalCost}
          onClose={onClose}
        />
        {assignment && (
          <EditRegisterModal
            onClose={onClose}
            isVisible={showModal === MODAL_VIEW.EDIT}
            defaultFields={assignment}
            updateAssignment={updateAssignment}
          />
        )}
        {assignment && (
          <DeleteRegisterModal
            onClose={onClose}
            isVisible={showModal === MODAL_VIEW.DELETE}
            onDelete={() => KitService.assignments.delete({ id: assignment.id }).then(() => updateAssignment())}
          />
        )}
        <div className="fields primary">
          <div className="field">
            <div>NÚMERO:</div>
            {!isLoading ? <div>{assignment.phone || '-'}</div> : <Skeleton></Skeleton>}
          </div>
          <div className="field">
            <div>OPERADOR:</div>
            {!isLoading ? <div>{assignment.operatorName || '-'}</div> : <Skeleton></Skeleton>}
          </div>
          <div className="field">
            <div>NRO. DE CONTRATO:</div>
            {!isLoading ? <div>{assignment.contract.code}</div> : <Skeleton></Skeleton>}
          </div>
          <div className="field">
            <div>TIPO:</div>
            {!isLoading ? <div>{assignment.typeServiceName}</div> : <Skeleton></Skeleton>}
          </div>
          <div className="field">
            <div>MARCA:</div>
            {!isLoading ? <div>{assignment.brandName}</div> : <Skeleton></Skeleton>}
          </div>
          <div className="field">
            <div>MODELO:</div>
            {!isLoading ? <div>{assignment.modelName || '-'}</div> : <Skeleton></Skeleton>}
          </div>
          <div className="field">
            <div>IMEI:</div>
            {!isLoading ? <div>{assignment.imei || '-'}</div> : <Skeleton></Skeleton>}
          </div>
          <div className="field">
            <div>SIMCARD:</div>
            {!isLoading ? <div>{assignment.simcard}</div> : <Skeleton></Skeleton>}
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
        <div className="fields">
          <div className="field">
            <div>SEDE:</div>
            {!isLoading ? <div>{assignment.seatName || '-'}</div> : <Skeleton></Skeleton>}
          </div>
          <div className="field">
            <div>OBSERVACIÓN:</div>
            {!isLoading ? <div>{assignment.observation || '-'}</div> : <Skeleton></Skeleton>}
          </div>
          <div className="field">
            <div>PLAN A PAGAR:</div>
            {!isLoading ? (
              <div className="amount">
                <div>{totalCost}</div>
                <button className="icon-button" onClick={() => setShowModal(MODAL_VIEW.PLANS)}>
                  <i className="pi pi-align-right"></i>
                </button>
              </div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
          {assignment?.additional1 && (
            <div className="field">
              <div>SERVICIO ADICIONAL 1:</div>
              <div>{assignment.additional1.serviceNum || '-'}</div>
            </div>
          )}
          {assignment?.additional2 && (
            <div className="field">
              <div>SERVICIO ADICIONAL 2:</div>
              <div>{assignment.additional2.serviceNum || '-'}</div>
            </div>
          )}
          <div className="field">
            <div>ADENDA:</div>
            {!isLoading ? (
              <div className="addendum">
                <i className="pi pi-calendar"></i>
                <div>
                  {startDate ? `${formatDate(startDate)} - ${endDate ? formatDate(endDate) : ''}` : 'Indefinido'}
                </div>
              </div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
          <div className="field">
            <div>+ DÍAS:</div>
            {!isLoading ? (
              <div className="days">
                <div>{monthDiff > 0 ? Math.floor(monthDiff) : 0}</div>
                <div>{endDate ? formatDate(endDate) : '-'}</div>
              </div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
          <div className="field">
            <div>CONTRATO:</div>
            {!isLoading ? (
              <div className={contract.classname}>
                <div>{contract.label}</div>
                <div>{contract.subLabel}</div>
              </div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
          <div className="field">
            <div>ESTADO DE EQUIPO:</div>
            {!isLoading ? (
              <div className={`status ${assignment.kitStatus?.classname}`}>{assignment.kitStatus?.label}</div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
          <div className="field">
            <div>ESTADO DE LÍNEA:</div>
            {!isLoading ? (
              <div className={`status ${assignment.lineStatus?.classname}`}>{assignment.lineStatus?.label}</div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

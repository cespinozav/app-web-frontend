import { useState } from 'react'
import { getContract, getServicesCost } from 'pages/KitAssignment/utils'
import { Checkbox } from 'primereact/checkbox'
import { Dialog } from 'primereact/dialog'
import { Skeleton } from 'primereact/skeleton'
import { formatDate, getMonthsTillNow } from 'utils/dates'
import { capitalize } from 'utils/misc'
import { PlanModal} from '../Modals'

const MODAL_VIEW = {
  NONE: 'NONE',
  PLANS: 'PLANS'
}
function BinnacleDetailModal({ onClose, isVisible, assignment }) {
  const [showModal, setShowModal] = useState(MODAL_VIEW.NONE)
  const { startDate, endDate, userState, assignType } = assignment || {}
  const isHolder = assignType?.value === 'T'
  const name = assignment?.names
    ? `${capitalize(assignment.lastnameP)} ${capitalize(
        assignment.lastnameM
      )}, ${capitalize(assignment.names)}`
    : '-'
  const monthDiff = endDate && getMonthsTillNow(endDate)
  const contract = assignment && getContract(assignment)
  const totalCost = getServicesCost(assignment)
  const onClosePlan = () => {
    setShowModal(MODAL_VIEW.NONE)
  }

  return (
    <Dialog
      className="dialog details"
      visible={isVisible}
      draggable={false}
      modal
      onHide={onClose}
    >
      <div className="header">
        <h2>Detalle de bitácora {assignment?.id}</h2>
      </div>
      <div className="responsible">
      <PlanModal
          isVisible={showModal === MODAL_VIEW.PLANS}
          assignment={assignment}
          totalCost={totalCost}
          onClose={onClosePlan}
        />

        <h3>RESPONSABLE</h3>
        <div className="fields">
          <div className="field">
            <div>NOMBRE RESPONSABLE:</div>
            {assignment ? <div>{name}</div> : <Skeleton></Skeleton>}
          </div>
          <div className="field">
            <div>DNI:</div>
            {assignment ? (
              <div>{assignment.dni || '-'}</div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
          <div className="field">
            <div>EMPRESA:</div>
            {assignment ? (
              <div>{assignment.company || '-'}</div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
          <div className="field">
            <div>CARGO:</div>
            {assignment ? (
              <div>{assignment?.job?.trim() || '-'}</div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
          <div className="field">
            <div>UNIDAD:</div>
            {assignment ? (
              <div>{assignment.unitNum || '-'}</div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
          <div className="field">
            <div>GERENCIA:</div>
            {assignment ? (
              <div>{assignment.areaNum || '-'}</div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
          <div className="field">
            <div>CECO:</div>
            {assignment ? (
              <div>{assignment.cecoCode || '-'}</div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
          <div className="field">
            <div>DESCRIPCIÓN DEL CECO:</div>
            {assignment ? (
              <div>{assignment.cecoDesc || '-'}</div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
          <div className="field">
            <div>CORREO ELECTRÓNICO:</div>
            {assignment ? (
              <div>{assignment.email || '-'}</div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
          <div className="field">
            <div>TITULAR:</div>
            <Checkbox
              className="check"
              inputId="assigned"
              checked={isHolder}
              disabled={true}
            ></Checkbox>
          </div>
          <div className="field">
            <div>ASIGNADO A:</div>
            {assignment ? (
              <div>{isHolder ? name : assignment.assignTo}</div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
          <div className="field">
            <div>ESTADO DE USUARIO:</div>
            {assignment ? (
              <div className={`status ${userState.classname}`}>
                {userState.label}
              </div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
        </div>
      </div>
      <div className="device">
        <h3>EQUIPO ASIGNADO</h3>
        <div className="fields">
          <div className="field">
            <div>NÚMERO:</div>
            {assignment ? (
              <div>{assignment.phone || '-'}</div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
          <div className="field">
            <div>OPERADOR:</div>
            {assignment ? (
              <div>{assignment.operatorName || '-'}</div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
          <div className="field">
            <div>NRO. DE CONTRATO:</div>
            {assignment ? (
              <div>{assignment.contract.code}</div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
          <div className="field">
            <div>TIPO:</div>
            {assignment ? (
              <div>{assignment.typeServiceName}</div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
          <div className="field">
            <div>MARCA:</div>
            {assignment ? (
              <div>{assignment.brandName}</div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
          <div className="field">
            <div>MODELO:</div>
            {assignment ? (
              <div>{assignment.modelName || '-'}</div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
          <div className="field">
            <div>IMEI:</div>
            {assignment ? (
              <div>{assignment.imei || '-'}</div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
          <div className="field">
            <div>SIMCARD:</div>
            {assignment ? (
              <div>{assignment.simcard}</div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
          {/* </div>
      <div className="fields"> */}
          <div className="field">
            <div>SEDE:</div>
            {assignment ? (
              <div>{assignment.seatName || '-'}</div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
          <div className="field">
            <div>OBSERVACIÓN:</div>
            {assignment ? (
              <div>{assignment.observation || '-'}</div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
          <div className="field">
            <div>PLAN A PAGAR:</div>
            {assignment ? (
              <div className="amount">
                <div>{totalCost + " "}
                <button className="icon-button" onClick={() => setShowModal(MODAL_VIEW.PLANS)}>
                  <i className="pi pi-align-right"></i>
                </button>
                </div>
              </div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
          {/* <div className="field">
            <div>DIAS POR BLOQUEO:</div>
            {assignment ? (
              <div className="amount">
                <div>{assignment.lineBlockDays}</div>
              </div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
          <div className="field">
            <div>DIAS POR SUSPENSION:</div>
            {assignment ? (
              <div className="amount">
                <div>{assignment.lineSuspendDays}</div>
              </div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div> */}
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
            {assignment ? (
              <div className="addendum">
                <i className="pi pi-calendar"></i>
                <div>
                  {startDate
                    ? `${formatDate(startDate)} - ${
                        endDate ? formatDate(endDate) : ''
                      }`
                    : 'Indefinido'}
                </div>
              </div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
          <div className="field">
            <div>+ DÍAS:</div>
            {assignment ? (
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
            {assignment ? (
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
            {assignment ? (
              <div className={`status ${assignment.kitStatus?.classname}`}>
                {assignment.kitStatus?.label}
              </div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
          <div className="field">
            <div>ESTADO DE LÍNEA:</div>
            {assignment ? (
              <div className={`status ${assignment.lineStatus?.classname}`}>
                {assignment.lineStatus?.label}
              </div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
        </div>
        <div className="device">
          <h3>MONTOS</h3>
          <div className="fields">
            <div className="field">
              <div>EQUIPO:</div>
              <div>{assignment?.kitAmount || '-'}</div>
            </div>
            <div className="field">
              <div>PENALIDAD:</div>
              <div>{assignment?.penaltyAmount || '-'}</div>
            </div>
            <div className="field">
              <div>RENTA BÁSICA:</div>
              <div>{assignment?.basicIncomeAmount || '-'}</div>
            </div>
            <div className="field">
              <div>SSAA:</div>
              <div>{assignment?.ssaaAmount || '-'}</div>
            </div>
            <div className="field">
              <div>OTROS:</div>
              <div>{assignment?.othersAmount || '-'}</div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default BinnacleDetailModal

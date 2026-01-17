import { getLicense, getTotalAmount } from 'pages/LicenseAssignment/utils'
import { Checkbox } from 'primereact/checkbox'
import { Dialog } from 'primereact/dialog'
import { Skeleton } from 'primereact/skeleton'
import { formatDate, getMonthsTillNow } from 'utils/dates'
import { capitalize } from 'utils/misc'
import { formatNumber } from 'utils/numbers'

function BinnacleDetailModal({ onClose, isVisible, assignment }) {
  const { startDate, endDate, userState, assignType } = assignment || {}
  const licenseInfo = getLicense(startDate, endDate)
  const licenses = assignment?.licenses.map(({ name, id, types }) => {
    const amount = getTotalAmount(types)
    const { currency } = types[0]
    return { name, id, amount, currency, types }
  })
  const licensesTypes = licenses?.map(license => license.types.map(({ id, name }) => ({ id, name }))).flat() || []
  // const isHolder = assignType?.value === 'T'
  const userNames = assignment?.names
    ? `${capitalize(assignment.lastnameP)} ${capitalize(assignment.lastnameM)}, ${capitalize(assignment.names)}`
    : '-'
  // const monthDiff = endDate && getMonthsTillNow(endDate)
  // const contract = assignment && getContract(assignment)
  // const totalCost = getServicesCost(assignment)
  return (
    <Dialog className="dialog license-details" visible={isVisible} draggable={false} modal onHide={onClose}>
      <div className="header">
        <h2>Detalle de bitácora {assignment?.id}</h2>
      </div>
      <div className="responsible">
        <h3>RESPONSABLE</h3>
        <div className="fields">
          <div className="field">
            <div>NOMBRE RESPONSABLE:</div>
            {assignment ? <div>{userNames}</div> : <Skeleton></Skeleton>}
          </div>
          <div className="field">
            <div>DNI:</div>
            {assignment ? <div>{assignment.dni || '-'}</div> : <Skeleton></Skeleton>}
          </div>
          <div className="field">
            <div>EMPRESA:</div>
            {assignment ? <div>{assignment.company || '-'}</div> : <Skeleton></Skeleton>}
          </div>
          <div className="field">
            <div>CARGO:</div>
            {assignment ? <div>{assignment?.job?.trim() || '-'}</div> : <Skeleton></Skeleton>}
          </div>
          <div className="field">
            <div>UNIDAD:</div>
            {assignment ? <div>{assignment.unitNum || '-'}</div> : <Skeleton></Skeleton>}
          </div>
          <div className="field">
            <div>GERENCIA:</div>
            {assignment ? <div>{assignment.areaNum || '-'}</div> : <Skeleton></Skeleton>}
          </div>
          <div className="field">
            <div>CECO:</div>
            {assignment ? <div>{assignment.cecoCode || '-'}</div> : <Skeleton></Skeleton>}
          </div>
          <div className="field">
            <div>DESCRIPCIÓN DEL CECO:</div>
            {assignment ? <div>{assignment.cecoDesc || '-'}</div> : <Skeleton></Skeleton>}
          </div>
          <div className="field">
            <div>USUARIO:</div>
            {assignment ? <div>{assignment.userRed || '-'}</div> : <Skeleton></Skeleton>}
          </div>
          {/* <div className="field">
            <div>TITULAR:</div>
            <Checkbox className="check" inputId="assigned" checked={isHolder} disabled={true}></Checkbox>
          </div> */}
          <div className="field">
            <div>CORREO ELECTRÓNICO:</div>
            {assignment ? <div>{assignment.email || '-'}</div> : <Skeleton></Skeleton>}
          </div>
          <div className="field">
            <div>CUENTA:</div>
            {assignment ? (
              <div className={`${assignType.classname} status`}>{assignType.label}</div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
          <div className="field">
            <div>ESTADO DE USUARIO:</div>
            {assignment ? (
              <div className={`${userState.classname} status`}>{userState.label}</div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
        </div>
      </div>
      <div className="license">
        <h3>LICENCIA(S) ASIGNADA(S)</h3>
        <div className="fields">
          <div className="field">
            <div>LICENCIA{assignment?.licenses.length > 1 ? 'S' : ''}:</div>
            {assignment ? (
              <div className="licenses">
                <div>{licenses.map(license => license.name).join(' - ') || '-'}</div>
                {/* <button className="icon-button" onClick={() => setShowModal(MODAL_VIEW.LICENSE)}>
                  <i className="pi pi-align-right"></i>
                </button> */}
              </div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
          <div className="field">
            <div>COSTO:</div>
            {assignment ? (
              <div>{licenses.map(license => `${license.currency} ${formatNumber(license.amount)}`).join(' + ')}</div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
          <div className="field">
            <div>OBSERVACIÓN:</div>
            {assignment ? <div>{assignment.observation || '-'}</div> : <Skeleton></Skeleton>}
          </div>
          <div className="field">
            <div>VIGENCIA:</div>
            {assignment ? (
              <div className="addendum">
                <i className="pi pi-calendar"></i>
                <div>{!startDate || !endDate ? 'Indefinido' : `${formatDate(startDate)} - ${formatDate(endDate)}`}</div>
              </div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
          <div className="field">
            <div>ESTADO DE LICENCIA:</div>
            {assignment ? (
              <div className={`${licenseInfo.classname} status`}>
                <div>{licenseInfo.label}</div>
                <div>{licenseInfo.subLabel}</div>
              </div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
          <div className="field">
            <div>TIPOS DE LICENCIA{assignment?.licenses.length > 1 ? 'S' : ''}:</div>
            {assignment ? (
              <div>
                {licensesTypes.map(({ name }) => name).join('-')}
                {/* {licensesTypes.map(({ id, name }) => (
                  <div key={`${id}-type`} className="types">
                    {name}
                  </div>
                ))} */}
              </div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default BinnacleDetailModal

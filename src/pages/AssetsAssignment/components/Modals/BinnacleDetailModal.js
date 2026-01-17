import { Checkbox } from 'primereact/checkbox'
import { Dialog } from 'primereact/dialog'
import { Skeleton } from 'primereact/skeleton'
import { capitalize } from 'utils/misc'

function BinnacleDetailModal({ onClose, isVisible, assignment }) {
  const { userState, assignType } = assignment || {}
  const isHolder = assignType?.value === 'T'
  const name = assignment?.names
    ? `${capitalize(assignment.lastnameP)} ${capitalize(assignment.lastnameM)}, ${capitalize(assignment.names)}`
    : '-'
  return (
    <Dialog className="dialog details" visible={isVisible} draggable={false} modal onHide={onClose}>
      <div className="header">
        <h2>Detalle de bitácora {assignment?.id}</h2>
      </div>
      <div className="responsible">
        <h3>RESPONSABLE</h3>
        <div className="fields">
          <div className="field">
            <div>NOMBRE RESPONSABLE:</div>
            {assignment ? <div>{name}</div> : <Skeleton></Skeleton>}
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
            <div>CORREO ELECTRÓNICO:</div>
            {assignment ? <div>{assignment.email || '-'}</div> : <Skeleton></Skeleton>}
          </div>
          <div className="field">
            <div>TITULAR:</div>
            <Checkbox className="check" inputId="assigned" checked={isHolder} disabled={true}></Checkbox>
          </div>
          <div className="field">
            <div>ASIGNADO A:</div>
            {assignment ? <div>{isHolder ? name : assignment.assignTo}</div> : <Skeleton></Skeleton>}
          </div>
          <div className="field">
            <div>ESTADO DE USUARIO:</div>
            {assignment ? (
              <div className={`status ${userState.classname}`}>{userState.label}</div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
        </div>
      </div>
      <div className="asset">
        <h3>ACTIVO ASIGNADO</h3>
        <div className="fields">
          <div className="field">
            <div>EQUIPO:</div>
            {assignment ? <div>{assignment.assetCode || '-'}</div> : <Skeleton></Skeleton>}
          </div>
          <div className="field">
            <div>ACTIVO:</div>
            {assignment ? <div>{assignment.assetType.label || '-'}</div> : <Skeleton></Skeleton>}
          </div>
          <div className="field">
            <div>MARCA:</div>
            {assignment ? <div>{assignment.brand.label || '-'}</div> : <Skeleton></Skeleton>}
          </div>
          <div className="field">
            <div>SERIE:</div>
            {assignment ? <div>{assignment.serialNum || '-'}</div> : <Skeleton></Skeleton>}
          </div>
          <div className="field">
            <div>COD. LEASING:</div>
            {assignment ? <div>{assignment.leasing.label || '-'}</div> : <Skeleton></Skeleton>}
          </div>
          <div className="field">
            <div>ESTADO DE ACTIVO:</div>
            {assignment ? (
              <div className={`status ${assignment.status.classname}`}>{assignment.status.label}</div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
          <div className="field">
            <div>SITUACION:</div>
            {assignment ? (
              <div className={assignment.situation.classname}>{assignment.situation.label}</div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
          {assignment?.operatingSystem && (
            <div className="field">
              <div>SO:</div>
              <div>{assignment.operatingSystem.label || '-'}</div>
            </div>
          )}
          {assignment?.domain && (
            <div className="field">
              <div>DOMINIO:</div>
              <div>{assignment.domain.label || '-'}</div>
            </div>
          )}
          {assignment?.processor && (
            <div className="field">
              <div>PROCESADOR:</div>
              <div>{assignment.processor.label || '-'}</div>
            </div>
          )}
          {assignment?.memory && (
            <div className="field">
              <div>MEMORIA:</div>
              <div>{assignment.memory.label || '-'}</div>
            </div>
          )}
          {assignment?.diskDrive && (
            <div className="field">
              <div>DISCO:</div>
              <div>{assignment.diskDrive.label || '-'}</div>
            </div>
          )}
          {assignment?.inches && (
            <div className="field">
              <div>PULGADAS:</div>
              <div>{assignment.inches.label || '-'}</div>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  )
}

export default BinnacleDetailModal

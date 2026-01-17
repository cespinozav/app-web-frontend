import { capitalize } from 'utils/misc'

const ResponsibleDetails = ({ assignment }) => {
  const { userState, assignType } = assignment
  return (
    <>
      <div className="details responsible">
        <div className="fields primary">
          <div className="field">
            <div>NOMBRE RESPONSABLE:</div>
            <div>
              {assignment.names
                ? `${capitalize(assignment.lastnameP)} ${capitalize(assignment.lastnameM)}, ${capitalize(
                    assignment.names
                  )}`
                : '-'}
            </div>
          </div>
          <div className="field">
            <div>DNI:</div>
            <div>{assignment.dni || '-'}</div>
          </div>
          <div className="field">
            <div>EMPRESA:</div>
            <div>{assignment.company || '-'}</div>
          </div>
          <div className="field">
            <div>PAÍS:</div>
            <div>{assignment?.country || '-'}</div>
          </div>
        </div>
        <div className="fields">
          <div className="field">
            <div>CARGO:</div>
            <div>{assignment?.job?.trim() || '-'}</div>
          </div>
          <div className="field">
            <div>UNIDAD:</div>
            <div>{assignment.unitNum || '-'}</div>
          </div>
          <div className="field">
            <div>GERENCIA:</div>
            <div>{assignment.areaNum || '-'}</div>
          </div>
          <div className="field">
            <div>CECO:</div>
            <div>{assignment.cecoCode || '-'}</div>
          </div>
          <div className="field">
            <div>DESCRIPCIÓN DEL CECO:</div>
            <div>{assignment.cecoDesc || '-'}</div>
          </div>
          <div className="field">
            <div>USUARIO:</div>
            <div>{assignment.userRed || '-'}</div>
          </div>
          <div className="field">
            <div>CORREO ELECTRÓNICO:</div>
            <div>{assignment.email || '-'}</div>
          </div>
          <div className="field">
            <div>CUENTA:</div>
            <div className={assignType.classname}>{assignType.label}</div>
          </div>
          <div className="field">
            <div>ESTADO DE USUARIO:</div>
            <div className={userState.classname}>{userState.label}</div>
          </div>
        </div>
      </div>
    </>
  )
}
export default ResponsibleDetails

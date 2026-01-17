import { useState } from 'react'
import { formatNumber } from 'utils/numbers'
import { Button } from 'primereact/button'
import { formatDate } from 'utils/dates'
import { Skeleton } from 'primereact/skeleton'
import { getLicense, getTotalAmount } from 'pages/LicenseAssignment/utils'
import { DeleteRegisterModal } from 'components/Modals'
import { LicenseService } from 'services'
import { EditRegisterModal, LicenseTypeModal } from '../Modals'

const MODAL_VIEW = {
  NONE: 'NONE',
  LICENSE: 'LICENSE',
  EDIT: 'EDIT',
  DELETE: 'DELETE'
}

export default function LicenseDetails({
  assignment,
  updateAssignment,
  isLoading
}) {
  const [showModal, setShowModal] = useState(MODAL_VIEW.NONE)
  const { startDate, endDate } = assignment
  const licenseInfo = getLicense(startDate, endDate)
  const licenses = assignment.licenses.map(({ name, id, types }) => {
    const amount = getTotalAmount(types)
    const { currency } = types[0]
    return { name, id, amount, currency, types }
  })
  const onModalClose = () => {
    setShowModal(MODAL_VIEW.NONE)
  }
  return (
    <>
      <div className="header title">LICENCIA ASIGNADA</div>
      <div className="details license">
        <EditRegisterModal
          onClose={onModalClose}
          isVisible={showModal === MODAL_VIEW.EDIT}
          defaultFields={assignment}
          updateAssignment={updateAssignment}
        />
        <DeleteRegisterModal
          onClose={onModalClose}
          isVisible={showModal === MODAL_VIEW.DELETE}
          onDelete={() =>
            LicenseService.assignments
              .delete({ id: assignment.id })
              .then(() => updateAssignment())
          }
        />
        <LicenseTypeModal
          isVisible={showModal === MODAL_VIEW.LICENSE}
          licenseData={licenses}
          onClose={onModalClose}
        />
        <div className="fields primary">
          <div className="field">
            <div>LICENCIA{assignment?.licenses.length > 1 ? 'S' : ''}:</div>
            {!isLoading ? (
              <div className="licenses">
                <div>
                  {assignment.licenses
                    .map(license => license.name)
                    .join(' - ') || '-'}
                </div>
                <button
                  className="icon-button"
                  onClick={() => setShowModal(MODAL_VIEW.LICENSE)}
                >
                  <i className="pi pi-align-right"></i>
                </button>
              </div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
          <div className="field">
            <div>COSTO:</div>
            {!isLoading ? (
              <div>
                {licenses
                  .map(
                    license =>
                      `${license.currency} ${formatNumber(license.amount)}`
                  )
                  .join(' + ')}
              </div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
          <div className="field">
            <div>OBSERVACIÓN:</div>
            {!isLoading ? (
              <div>{assignment.observation || '-'}</div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
          <div className="field">
            <div>VIGENCIA:</div>
            {!isLoading ? (
              <div className="addendum">
                <i className="pi pi-calendar"></i>
                <div>
                  {!startDate || !endDate
                    ? 'Indefinido'
                    : `${formatDate(startDate)} - ${formatDate(endDate)}`}
                </div>
              </div>
            ) : (
              <Skeleton></Skeleton>
            )}
          </div>
          <div className="field">
            <div>ESTADO DE LICENCIA:</div>
            {!isLoading ? (
              <div className={licenseInfo.classname}>
                <div>{licenseInfo.label}</div>
                <div>{licenseInfo.subLabel}</div>
              </div>
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

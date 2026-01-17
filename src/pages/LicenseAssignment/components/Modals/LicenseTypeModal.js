import { Dialog } from 'primereact/dialog'
import { formatNumber } from 'utils/numbers'

function LicenseModal({ onClose, isVisible, licenseData }) {
  return (
    <Dialog className="dialog licenses-dialog" draggable={false} visible={isVisible} modal onHide={onClose}>
      <div className="section">
        <h2 className="header">Detalle de licencia{licenseData?.length > 1 ? 's' : ''}:</h2>
        <div className="content">
          {licenseData.map(license => (
            <div className="license" key={license.id}>
              <h3>{license.name}</h3>
              <div className="options">
                {license?.types?.map((lt, index) => (
                  <div className="simple-row" key={index}>
                    <div>{lt.name}</div>
                    <div>{`${lt.currency} ${formatNumber(lt.amount)}`}</div>
                  </div>
                ))}
              </div>
              <div className="simple-row">
                <span>Tarifa mensual:</span>
                <div>{`${license?.currency} ${formatNumber(license?.amount)}`}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Dialog>
  )
}

export default LicenseModal

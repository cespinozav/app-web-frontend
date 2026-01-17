import { Dialog } from 'primereact/dialog'
import { formatNumber } from 'utils/numbers'

const DEFAULT_SERVICE = {
  serviceNum: '-',
  currency: '',
  cost: 0
}

function PlanModal({ onClose, isVisible, assignment, totalCost }) {
  const { plan, additional1, additional2, lineBlockDays, lineSuspendDays } = assignment
  const additionalService1 = additional1 || DEFAULT_SERVICE
  const additionalService2 = additional2 || DEFAULT_SERVICE
  return (
    <Dialog className="dialog plan-dialog" visible={isVisible} draggable={false} modal onHide={onClose}>
      <div className="section">
        <h2 className="header">Detalle del plan:</h2>
        <div className="content">
          <div className="options">
            <div className="row">
              <label htmlFor="plan">Plan contratado:</label>
              <div>
                <div id="plan">{plan.serviceNum}</div>
                <div className="amount">{`${plan.currency} ${formatNumber(plan.cost)}`}</div>
              </div>
            </div>
            <div className="row">
              <label htmlFor="additional1">Servicio Adicional 1:</label>
              <div>
                <div id="additional1">{additionalService1.serviceNum}</div>
                <div className="amount">{`${additionalService1.currency} ${formatNumber(
                  additionalService1.cost
                )}`}</div>
              </div>
            </div>
            <div className="row">
              <label htmlFor="additional2">Servicio Adicional 2:</label>
              <div>
                <div id="additional2">{additionalService2.serviceNum}</div>
                <div className="amount">{`${additionalService2.currency} ${formatNumber(
                  additionalService2.cost
                )}`}</div>
              </div>
            </div>
          </div>
          <div className="simple-row">
            <label htmlFor="total-amount">Total mensual sin IGV:</label>
            <div id="total-amount" className="amount">
              {totalCost}
            </div>
          </div>
        </div>
      </div>
      <div className="section">
        <h2 className="header">Consideración de días:</h2>
        <div className="content">
          <div className="options">
            <div className="simple-row">
              <label htmlFor="locked-days">Días x bloqueo de línea:</label>
              <div id="locked-days">{lineBlockDays}</div>
            </div>
            <div className="simple-row">
              <label htmlFor="suspension-days">Días x suspensión de línea:</label>
              <div id="suspension-days">{lineSuspendDays}</div>
            </div>
          </div>
          <div className="simple-row">
            <label htmlFor="total-days">Total de días adicionales:</label>
            <div id="total-days">{lineSuspendDays + lineBlockDays}</div>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default PlanModal

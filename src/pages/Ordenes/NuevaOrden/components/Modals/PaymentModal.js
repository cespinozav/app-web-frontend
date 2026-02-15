
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'


export default function PaymentModal({
  visible,
  onHide,
  summary,
  toCurrency,
  paymentMethod,
  setPaymentMethod,
  paymentMethods,
  operationNumber,
  setOperationNumber,
  isSaving,
  onConfirm,
  fechaEntregaEstimada
}) {
  // Eliminada lógica de efectivo

  return (
    <Dialog
      visible={visible}
      style={{ width: 560, maxWidth: '95vw' }}
      modal
      onHide={onHide}
      header="Procesar Pago"
      className="payment-modal"
    >
      <div className="payment-modal-content">
        <section className="payment-card">
          <h5 className="payment-card-title">Resumen</h5>
          <div className="payment-summary-row">
            <span>Subtotal</span>
            <strong>{toCurrency(summary.subtotal)}</strong>
          </div>
          <div className="payment-summary-row">
            <span>Descuento</span>
            <strong>{toCurrency(summary.discount)}</strong>
          </div>
          <div className="payment-summary-total">
            <span>Total a Pagar</span>
            <strong>{toCurrency(summary.total)}</strong>
          </div>

        </section>
        <section className="payment-card">
          <h5 className="payment-card-title">Método de Pago</h5>
          <div className="mb-3">
            <Dropdown
              inputId="metodo_pago"
              value={paymentMethod}
              options={paymentMethods}
              onChange={e => setPaymentMethod(e.value)}
              style={{ width: '100%' }}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="numero_operacion" className="form-label">
              Número de Operación
            </label>
            <input
              id="numero_operacion"
              type="text"
              className="p-inputtext p-component"
              style={{ width: '100%' }}
              value={operationNumber}
              onChange={e => setOperationNumber(e.target.value)}
            />
          </div>
          {fechaEntregaEstimada && (
            <section className="payment-card delivery-estimate-card">
              <div className="delivery-estimate-header">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#007185" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/><circle cx="5.5" cy="18.5" r="1.5"/><circle cx="18.5" cy="18.5" r="1.5"/></svg>
                <div>
                  <div className="delivery-estimate-title">Entrega estimada</div>
                  <div className="delivery-estimate-date">{fechaEntregaEstimada}</div>
                </div>
              </div>
            </section>
          )}
        </section>

        <div className="payment-actions">
          <Button label="Cancelar" className="p-button-secondary" onClick={onHide} />
          <Button
            label={fechaEntregaEstimada ? 'Confirmar Venta' : 'Calculando fecha...'}
            className="p-button-primary"
            loading={isSaving}
            disabled={isSaving || !fechaEntregaEstimada}
            onClick={onConfirm}
          />
        </div>
      </div>
    </Dialog>
  )
}

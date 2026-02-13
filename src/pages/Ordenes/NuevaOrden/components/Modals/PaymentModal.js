import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { InputNumber } from 'primereact/inputnumber'

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
  receivedAmount,
  setReceivedAmount,
  changeForCustomer,
  isSaving,
  onConfirm
}) {
  const isCashPayment = paymentMethod === 'efectivo'

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
            {/* <label htmlFor='metodo_pago' className='form-label'>Método de Pago</label> */}
            <Dropdown
              inputId="metodo_pago"
              value={paymentMethod}
              options={paymentMethods}
              onChange={e => setPaymentMethod(e.value)}
              style={{ width: '100%' }}
            />
          </div>

          {!isCashPayment && (
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
          )}

          {isCashPayment && (
            <>
              <div className="mb-3">
                <label htmlFor="monto_recibido" className="form-label">
                  Monto Recibido
                </label>
                <InputNumber
                  inputId="monto_recibido"
                  value={receivedAmount}
                  min={0}
                  minFractionDigits={2}
                  maxFractionDigits={2}
                  onValueChange={e => setReceivedAmount(e.value)}
                  style={{ width: '100%' }}
                />
              </div>
              <div className="payment-change-row">
                <span>Cambio</span>
                <strong>{toCurrency(changeForCustomer)}</strong>
              </div>
            </>
          )}
        </section>

        <div className="payment-actions">
          <Button label="Cancelar" className="p-button-secondary" onClick={onHide} />
          <Button
            label="Confirmar Venta"
            className="p-button-primary"
            loading={isSaving}
            disabled={isSaving}
            onClick={onConfirm}
          />
        </div>
      </div>
    </Dialog>
  )
}

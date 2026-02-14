import { useMemo } from 'react'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import EstadoBadge from 'components/styles/EstadoBadge'
import { formatProductDetail } from './GeneralProductsSummaryModal'

const actionLabels = {
  confirmado: 'Confirmar Órdenes',
  'en camino': 'Enviar Órdenes'
}

const targetStateLabels = {
  confirmado: 'Confirmado',
  'en camino': 'En camino'
}

export default function BulkStatusChangeModal({
  visible,
  onHide,
  selectedOrders,
  targetState,
  onConfirm,
  isLoading,
  executionResult
}) {
  const actionLabel = actionLabels[targetState] || 'Actualizar seleccionados'
  const targetStateLabel = targetStateLabels[targetState] || targetState || '-'
  const productsSummary = useMemo(() => {
    const summaryMap = selectedOrders.reduce((accumulator, order) => {
      const details = order?.details || []

      details.forEach(detail => {
        const quantity = Number(detail?.cantidad ?? detail?.quantity ?? 0)
        if (!quantity) return

        const product = formatProductDetail(detail)
        const existing = accumulator.get(product.key)

        if (existing) {
          existing.totalQuantity += quantity
        } else {
          accumulator.set(product.key, {
            ...product,
            totalQuantity: quantity
          })
        }
      })

      return accumulator
    }, new Map())

    return Array.from(summaryMap.values()).sort((a, b) => b.totalQuantity - a.totalQuantity)
  }, [selectedOrders])
  const totalRequestedUnits = useMemo(
    () => productsSummary.reduce((accumulator, product) => accumulator + Number(product.totalQuantity || 0), 0),
    [productsSummary]
  )
  const formatFailedItemLabel = item => {
    const rawId = item?.orderId
    if (typeof rawId === 'number') return `Pedido #${rawId}`
    if (typeof rawId === 'string' && /^\d+$/.test(rawId)) return `Pedido #${rawId}`
    if (rawId && rawId !== '-') return `Campo ${rawId}`
    return 'Validación general'
  }

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={actionLabel}
      style={{ width: '980px', maxWidth: '96vw' }}
      modal
    >
      <div className="order-detail-modal">
        <section className="order-detail-card order-detail-summary">
          <div className="order-detail-summary-row">
            <span>Pedidos a actualizar</span>
            <strong>{selectedOrders.length}</strong>
          </div>
          <div className="order-detail-summary-row">
            <span>Nuevo estado</span>
            <strong>{targetStateLabel}</strong>
          </div>
          <div className="order-detail-summary-row">
            <span>Total de unidades solicitadas</span>
            <strong>{totalRequestedUnits}</strong>
          </div>
        </section>

        <section className="order-detail-card">
          <h4>Pedidos seleccionados</h4>
          <div className="order-detail-table-wrap">
            <table className="p-datatable table order-detail-table">
              <thead>
                <tr>
                  <th>Cod. Orden</th>
                  <th>Cliente</th>
                  <th>Sede</th>
                  <th>Estado actual</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center' }}>
                      No hay pedidos seleccionados
                    </td>
                  </tr>
                ) : (
                  selectedOrders.map(order => (
                    <tr key={order.id}>
                      <td>{order.code || '-'}</td>
                      <td>{order.client || '-'}</td>
                      <td>{order.site || '-'}</td>
                      <td>
                        <EstadoBadge estado={order.state} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="order-detail-card">
          <h4>Detalle general de productos</h4>
          <div className="order-detail-table-wrap">
            <table className="p-datatable table order-detail-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Unidad</th>
                  <th>Cantidad Total</th>
                </tr>
              </thead>
              <tbody>
                {productsSummary.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center' }}>
                      No hay productos en los pedidos seleccionados
                    </td>
                  </tr>
                ) : (
                  productsSummary.map(product => (
                    <tr key={product.key}>
                      <td>{product.name || '-'}</td>
                      <td>{product.category || 'Sin categoría'}</td>
                      <td>
                        {product.unitDescription || 'Sin unidad'}
                        {product.unitReference ? ` (${product.unitReference})` : ''}
                      </td>
                      <td>{product.totalQuantity}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {executionResult && (
          <section className="order-detail-card bulk-result-card">
            <h4>Resultado del cambio masivo</h4>
            <div className="order-detail-summary-row">
              <span>Procesados</span>
              <strong>{executionResult.processed}</strong>
            </div>
            <div className="order-detail-summary-row">
              <span>Exitosos</span>
              <strong>{executionResult.successCount}</strong>
            </div>
            <div className="order-detail-summary-row">
              <span>Fallidos</span>
              <strong>{executionResult.failedCount}</strong>
            </div>

            {executionResult.failedItems.length > 0 && (
              <div className="bulk-result-errors">
                {executionResult.failedItems.map(item => (
                  <p key={`${item.orderId}-${item.message}`}>
                    {formatFailedItemLabel(item)}: {item.message}
                  </p>
                ))}
              </div>
            )}
          </section>
        )}

        <div className="payment-actions">
          <Button
            type="button"
            label="Cancelar"
            className="p-button-secondary p-button-outlined"
            onClick={onHide}
            disabled={isLoading}
          />
          <Button
            type="button"
            label={actionLabel}
            className="p-button-success"
            onClick={onConfirm}
            loading={isLoading}
            disabled={selectedOrders.length === 0 || isLoading}
          />
        </div>
      </div>
    </Dialog>
  )
}

import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import EstadoBadge from 'components/styles/EstadoBadge'
import { formatDate, formatDateMin } from 'utils/dates'
import { openGoogleMapsByCoordinates } from 'components/Maps/maps'
// import { formatDate } from 'utils/dates' // Removed unused import
export default function OrderDetailModal({ visible, onHide, selectedOrder, formatCurrency }) {
  const selectedOrderDetails = selectedOrder?.details || []
  const shippingSteps = ['pendiente', 'confirmado', 'en camino', 'entregado']
  const normalizedOrderState = String(selectedOrder?.state || '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
  const currentStepIndex = shippingSteps.findIndex(step => step === normalizedOrderState)
  const siteAddress =
    selectedOrder?.site_address ||
    selectedOrder?.raw?.sede_info?.adress ||
    selectedOrder?.raw?.sede_info?.address ||
    '-'
  const siteLat = selectedOrder?.site_lat || selectedOrder?.raw?.sede_info?.lat || ''
  const siteLong = selectedOrder?.site_long || selectedOrder?.raw?.sede_info?.long || ''

  const openSiteInMaps = () => {
    openGoogleMapsByCoordinates(siteLat, siteLong)
  }

  const formatProductDetail = detail => {
    const productInfo = detail?.producto_info || detail?.product_info || detail?.producto || detail?.product || {}
    const name =
      productInfo?.nombre ||
      productInfo?.description ||
      productInfo?.name ||
      `Producto ${productInfo?.id || detail?.producto || ''}`.trim()
    const category =
      productInfo?.category_name ||
      productInfo?.categoria_nombre ||
      productInfo?.categoria ||
      productInfo?.category?.name ||
      productInfo?.category ||
      'Sin categoría'
    const unitDescription =
      productInfo?.unit?.description ||
      productInfo?.unidad?.description ||
      productInfo?.unidad_info?.description ||
      productInfo?.unidad_nombre ||
      productInfo?.unit_name ||
      productInfo?.unit ||
      productInfo?.unidad ||
      'Sin unidad'
    const unitReference =
      productInfo?.unit?.reference ||
      productInfo?.unidad?.reference ||
      productInfo?.unidad_info?.reference ||
      productInfo?.referencia ||
      productInfo?.unit_reference ||
      ''

    return `${name || '-'} - ${category || 'Sin categoría'} - ${unitDescription || 'Sin unidad'}${
      unitReference ? ` (${unitReference})` : ''
    }`
  }

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={'Detalle de Orden'}
      style={{ width: '900px', maxWidth: '95vw' }}
      modal
    >
      {selectedOrder && (
        <div className="order-detail-modal">
          <div className="order-detail-head">
            <div className="order-detail-head-item">
              <span>Orden</span>
              <strong>{selectedOrder.code || '-'}</strong>
            </div>
            <div className="order-detail-head-item">
              <span>Fecha Orden</span>
              <strong>{formatDateMin(selectedOrder.raw?.fecha_orden || selectedOrder.fecha_orden || selectedOrder.date || '-')}</strong>
            </div>
            <div className="order-detail-head-item">
              <span>Entrega Estimada</span>
              <strong>{selectedOrder.raw?.fecha_entrega_estimada || selectedOrder.fecha_entrega_estimada ? formatDate(selectedOrder.raw?.fecha_entrega_estimada || selectedOrder.fecha_entrega_estimada) : '-'}</strong>
            </div>
          </div>

          <div className="order-detail-grid">
            <section className="order-detail-card">
              <h4>Información de Cliente</h4>
              <div className="order-detail-info">
                <div className="order-detail-field">
                  <span>Cliente</span>
                  <strong>{selectedOrder.client || '-'}</strong>
                </div>
                <div className="order-detail-field">
                  <span>Sede</span>
                  <strong>{selectedOrder.site || '-'}</strong>
                </div>
                <div className="order-detail-field">
                  <span>Dirección de Sede</span>
                  <strong>{siteAddress || '-'}</strong>
                </div>
                <div className="order-detail-field">
                  <span>Ubicación</span>
                  <div className="actions">
                    <Button
                      icon="pi pi-map-marker"
                      className="p-button p-component p-button-icon-only"
                      style={{ background: 'transparent', color: '#007bff' }}
                      title="Ver ubicación en Google Maps"
                      aria-label="Ver ubicación en Google Maps"
                      onClick={openSiteInMaps}
                      disabled={!(siteLat && siteLong)}
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="order-detail-card order-detail-summary">
              <h4>Pago</h4>
              <div className="order-detail-summary-row">
                <span>Subtotal</span>
                <strong>{formatCurrency(selectedOrder.subtotal)}</strong>
              </div>
              <div className="order-detail-summary-row">
                <span>Descuento</span>
                <strong>{formatCurrency(selectedOrder.discount)}</strong>
              </div>
              <div className="order-detail-summary-row order-detail-summary-total">
                <span>Total General</span>
                <strong>{formatCurrency(selectedOrder.total)}</strong>
              </div>
              <div className="order-detail-summary-row">
                <span>Método de Pago</span>
                <strong>{selectedOrder.payment_method || '-'}</strong>
              </div>
            </section>
          </div>

          <section className="order-detail-card">
            <h4>Productos</h4>
            <div className="order-detail-table-wrap">
              <table className="p-datatable table order-detail-table">
                <thead>
                  <tr>
                    <th>Cantidad</th>
                    <th>Producto</th>
                    <th>Subtotal</th>
                    <th>Descuento</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrderDetails.map((detail, idx) => (
                    <tr key={idx}>
                      <td>{detail.quantity}</td>
                      <td>{detail.name || detail.product_name || '-'}</td>
                      <td>{formatCurrency(detail.subtotal)}</td>
                      <td>{formatCurrency(detail.descuento_unitario ?? detail.discount)}</td>
                      <td>{formatCurrency(detail.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="order-detail-shipping order-detail-card">
            <h4>Envío</h4>
            <div className="order-detail-field">
              <span>Estado del envío</span>
            </div>
            <div className="order-shipping-progress" role="list" aria-label="Progreso de envío">
              {shippingSteps.map((step, index) => {
                const isCompleted = currentStepIndex >= 0 && index < currentStepIndex
                const isCurrent = currentStepIndex === index
                let statusClass = 'is-pending'
                if (isCurrent) {
                  statusClass = 'is-current'
                } else if (isCompleted) {
                  statusClass = 'is-completed'
                }
                const stepLabel = step.charAt(0).toUpperCase() + step.slice(1)
                // Si es el paso actual, mostrar solo el EstadoBadge como label
                return (
                  <div className={`order-shipping-step ${statusClass}`} key={step} role="listitem">
                    <span className="order-shipping-step-dot" />
                    <span className="order-shipping-step-label">
                      {isCurrent ? <EstadoBadge estado={selectedOrder.state} /> : stepLabel}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </Dialog>
  )
}

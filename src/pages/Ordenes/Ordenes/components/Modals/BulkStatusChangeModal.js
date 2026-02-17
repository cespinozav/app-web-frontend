import { getSimpleRowNumber } from 'utils/table'
import { useMemo, useEffect, useState } from 'react'
import OrdersSummaryService from 'services/OrdersSummary'
import OrderProductsDetailService from 'services/OrderProductsDetail'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import EstadoBadge from 'components/styles/EstadoBadge'
import { QRCodeSVG } from 'qrcode.react'


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
  const [productsSummary, setProductsSummary] = useState([])
  const [isSummaryLoading, setIsSummaryLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('general') // 'general' | 'detalle'
  const [productsDetail, setProductsDetail] = useState([])
  const [isDetailLoading, setIsDetailLoading] = useState(false)
    useEffect(() => {
      if (activeTab !== 'detalle' || !visible || !selectedOrders.length) {
        setProductsDetail([])
        return
      }
      setIsDetailLoading(true)
      const codigos_orden = selectedOrders.map(order => order.code)
      OrderProductsDetailService.getProductsDetail(codigos_orden)
        .then(res => {
          let productos = Array.isArray(res)
            ? res
            : (res && Array.isArray(res.result))
              ? res.result
              : []
          setProductsDetail(productos)
        })
        .catch(() => setProductsDetail([]))
        .finally(() => setIsDetailLoading(false))
    }, [activeTab, visible, selectedOrders])
  useEffect(() => {
    if (!visible || !selectedOrders.length || !targetState) {
      setProductsSummary([])
      return
    }
    setIsSummaryLoading(true)
    const codigos_orden = selectedOrders.map(order => order.code)
    const state = targetState === 'confirmado' ? 'pendiente' : 'confirmado'
    OrdersSummaryService.getProductsSummary({ codigos_orden, state })
      .then(res => {
        console.log('Respuesta productos resumen:', res)
        // Si el backend responde con { status, result }, usar result
        let productos = Array.isArray(res)
          ? res
          : (res && Array.isArray(res.result))
            ? res.result
            : []
        setProductsSummary(
          productos.map(prod => ({
            key: prod.producto_id || prod.nombre,
            name: prod.nombre,
            category: prod.categoria,
            unitDescription: prod.unidad_referencia,
            totalQuantity: prod.cantidad_total
          }))
        )
      })
      .catch((e) => {
        console.error('Error productos resumen:', e)
        setProductsSummary([])
      })
      .finally(() => setIsSummaryLoading(false))
  }, [visible, selectedOrders, targetState])

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
        <div className="modal-division-tabs" style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <div
            className={`modal-division-tab${activeTab === 'general' ? ' active' : ''}`}
            style={{ padding: '8px 24px', borderRadius: '8px 8px 0 0', background: activeTab === 'general' ? '#f5f5f5' : '#fafafa', border: '1px solid #e0e0e0', borderBottom: 'none', fontWeight: activeTab === 'general' ? 600 : 400, color: activeTab === 'general' ? '#222' : '#888', cursor: 'pointer' }}
            onClick={() => setActiveTab('general')}
          >
            Detalle general de productos
          </div>
          <div
            className={`modal-division-tab${activeTab === 'detalle' ? ' active' : ''}`}
            style={{ padding: '8px 24px', borderRadius: '8px 8px 0 0', background: activeTab === 'detalle' ? '#f5f5f5' : '#fafafa', border: '1px solid #e0e0e0', borderBottom: 'none', fontWeight: activeTab === 'detalle' ? 600 : 400, color: activeTab === 'detalle' ? '#222' : '#888', cursor: 'pointer' }}
            onClick={() => setActiveTab('detalle')}
          >
            Detalle de Productos Ordenados
          </div>
        </div>
        {activeTab === 'general' && (
          <>
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
              <h4>Detalle general de productos</h4>
              <div className="order-detail-table-wrap">
                <table className="p-datatable table order-detail-table">
                  <thead>
                    <tr>
                      <th>Nro</th>
                      <th>Producto</th>
                      <th>Categoría</th>
                      <th>Unidad</th>
                      <th>Cantidad Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isSummaryLoading ? (
                      <tr><td colSpan={5}><span>Cargando productos...</span></td></tr>
                    ) : productsSummary.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center' }}>
                          No hay productos para mostrar
                        </td>
                      </tr>
                    ) : (
                      productsSummary.map((product, idx) => (
                        <tr key={product.key || idx}>
                          <td>{idx + 1}</td>
                          <td>{product.name}</td>
                          <td>{product.category}</td>
                          <td>{product.unitDescription}</td>
                          <td>{product.totalQuantity}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
        {activeTab === 'detalle' && (
          <section className="order-detail-card">
            <h4>Detalle de Productos Ordenados</h4>
            {isDetailLoading ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#aaa' }}>Cargando productos ordenados...</div>
            ) : productsDetail.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#aaa' }}>No hay productos ordenados para mostrar.</div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
                {productsDetail.map((prod, idx) => (
                  <div
                    key={prod.codigo || idx}
                    style={{
                      flex: '1 1 30%',
                      minWidth: '340px',
                      maxWidth: '420px',
                      background: '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '16px',
                      boxShadow: '0 2px 12px #0002',
                      padding: '22px 20px 18px 20px',
                      marginBottom: '18px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'stretch',
                      position: 'relative',
                      transition: 'box-shadow 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                      <div style={{ marginRight: 18 }}>
                        <QRCodeSVG value={prod.codigo} size={60} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '1.15em', color: '#222', marginBottom: 2 }}>{prod.producto}</div>
                        <div style={{ color: '#666', fontSize: 13 }}>{prod.categoria} &bull; {prod.unidad_referencia}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 18px', marginBottom: 10 }}>
                      <div style={{ color: '#888', fontSize: 13 }}>
                        <b>Código:</b> <span style={{ color: '#222' }}>{prod.codigo}</span>
                      </div>
                      <div style={{ color: '#888', fontSize: 13 }}>
                        <b>Estado:</b> <span style={{ color: prod.estado === 'confirmado' ? '#388e3c' : prod.estado === 'pendiente' ? '#f57c00' : '#222' }}>{prod.estado}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 18px', marginBottom: 10 }}>
                      <div style={{ color: '#888', fontSize: 13 }}><b>Cliente:</b> <span style={{ color: '#222' }}>{prod.cliente}</span></div>
                      <div style={{ color: '#888', fontSize: 13 }}><b>Sede:</b> <span style={{ color: '#222' }}>{prod.sede}</span></div>
                      <div style={{ color: '#888', fontSize: 13 }}><b>Ciudad:</b> <span style={{ color: '#222' }}>{prod.ciudad}</span></div>
                    </div>
                    <div style={{ color: '#888', fontSize: 13, marginBottom: 10 }}><b>Dirección:</b> <span style={{ color: '#222' }}>{prod.direccion}</span></div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 18px', fontSize: 13 }}>
                      <div style={{ color: '#888' }}><b>Fecha Orden:</b> <span style={{ color: '#222' }}>{prod.fecha_orden}</span></div>
                      <div style={{ color: '#888' }}><b>Entrega Estimada:</b> <span style={{ color: '#222' }}>{prod.fecha_entrega_estimada}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
        
        <section className="order-detail-card">
          <h4>Pedidos seleccionados</h4>
          <div className="order-detail-table-wrap">
            <table className="p-datatable table order-detail-table">
              <thead>
                <tr>
                  <th>Nro</th>
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
                  selectedOrders.map((order, idx) => (
                    <tr key={order.id}>
                      <td>{idx + 1}</td>
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

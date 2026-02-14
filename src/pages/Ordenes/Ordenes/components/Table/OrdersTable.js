import { useEffect, useRef } from 'react'
import { Skeleton } from 'primereact/skeleton'
import { Button } from 'primereact/button'
import EstadoBadge from 'components/styles/EstadoBadge'

export default function OrdersTable({
  orders,
  isFetching,
  pageSize,
  formatDate,
  formatCurrency,
  onOpenDetail,
  selectedOrderIds,
  onToggleOrder,
  onToggleSelectPage
}) {
  const selectAllRef = useRef(null)
  const selectedInPage = orders.filter(order => selectedOrderIds.includes(order.id)).length
  const allInPageSelected = orders.length > 0 && selectedInPage === orders.length
  const partiallySelected = selectedInPage > 0 && !allInPageSelected

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = partiallySelected
    }
  }, [partiallySelected])

  return (
    <div className="tabla-ordenes">
      {isFetching ? (
        Array.from({ length: pageSize }).map((_, index) => <Skeleton className="table" key={index} />)
      ) : (
        <table className="p-datatable table">
          <thead>
            <tr>
              <th style={{ width: 42 }}>
                <input
                  ref={selectAllRef}
                  type="checkbox"
                  checked={allInPageSelected}
                  onChange={e => onToggleSelectPage(e.target.checked)}
                  aria-label="Seleccionar pedidos de la página actual"
                />
              </th>
              <th>Fecha</th>
              <th>Cod. Orden</th>
              <th>Cliente</th>
              <th>Sede</th>
              <th>Total</th>
              <th>Método de Pago</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center' }}>
                  No hay órdenes registradas
                </td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedOrderIds.includes(order.id)}
                      onChange={e => onToggleOrder(order, e.target.checked)}
                      aria-label={`Seleccionar orden ${order.code || order.id}`}
                    />
                  </td>
                  <td>{formatDate(order.date)}</td>
                  <td>{order.code || '-'}</td>
                  <td>{order.client}</td>
                  <td>{order.site}</td>
                  <td>{formatCurrency(order.total)}</td>
                  <td>{order.payment_method || '-'}</td>
                  <td>
                    <EstadoBadge estado={order.state} />
                  </td>
                  <td>
                    <div className="actions">
                      <Button
                        icon="pi pi-eye"
                        className="p-button p-component p-button-icon-only"
                        aria-label="Ver Orden"
                        onClick={() => onOpenDetail(order)}
                        tooltip="Ver detalle"
                        tooltipOptions={{ position: 'top' }}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}

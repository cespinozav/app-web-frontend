import { Skeleton } from 'primereact/skeleton'
import { Button } from 'primereact/button'
import EstadoBadge from 'components/styles/EstadoBadge'

export default function OrdersTable({ orders, isFetching, pageSize, formatDate, formatCurrency, onOpenDetail }) {
  return (
    <div className="tabla-ordenes">
      {isFetching ? (
        Array.from({ length: pageSize }).map((_, index) => <Skeleton className="table" key={index} />)
      ) : (
        <table className="p-datatable table">
          <thead>
            <tr>
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
                <td colSpan={8} style={{ textAlign: 'center' }}>
                  No hay órdenes registradas
                </td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.id}>
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

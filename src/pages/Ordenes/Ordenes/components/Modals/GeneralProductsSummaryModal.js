import { Dialog } from 'primereact/dialog'
import { Skeleton } from 'primereact/skeleton'

const formatProductDetail = detail => {
  const productInfo = detail?.producto_info || detail?.product_info || detail?.producto || detail?.product || {}
  const name =
    productInfo?.nombre ||
    productInfo?.description ||
    productInfo?.name ||
    detail?.producto_nombre ||
    detail?.product_name ||
    `Producto ${productInfo?.id || detail?.producto || detail?.product || ''}`.trim()
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

  return {
    key: `${name}|${category}|${unitDescription}|${unitReference}`,
    name,
    category,
    unitDescription,
    unitReference
  }
}

export default function GeneralProductsSummaryModal({ visible, onHide, productsSummary, totalOrders, isLoading }) {
  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={'Detalle general de productos'}
      style={{ width: '980px', maxWidth: '96vw' }}
      modal
    >
      <div className="order-detail-modal">
        <section className="order-detail-card order-detail-summary">
          <div className="order-detail-summary-row">
            <span>Órdenes consideradas</span>
            <strong>{totalOrders}</strong>
          </div>
          <div className="order-detail-summary-row">
            <span>Productos consolidados</span>
            <strong>{productsSummary.length}</strong>
          </div>
        </section>

        <section className="order-detail-card">
          <h4>Productos ordenados por cantidad total solicitada</h4>
          <div className="order-detail-table-wrap">
            {isLoading ? (
              <div className="general-products-loading">
                {Array.from({ length: 8 }).map((_, index) => (
                  <Skeleton key={index} className="table" height="38px" />
                ))}
              </div>
            ) : (
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
                        No hay productos para los filtros seleccionados
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
            )}
          </div>
        </section>
      </div>
    </Dialog>
  )
}

export { formatProductDetail }

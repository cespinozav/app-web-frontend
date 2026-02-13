import { AutoComplete } from 'primereact/autocomplete'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import CartTable from '../Table/CartTable'

export default function OrderForm({
  productQuery,
  setProductQuery,
  productSuggestions,
  searchProducts,
  addProductToCart,
  cart,
  toCurrency,
  updateCartItem,
  removeProduct,
  clients,
  selectedClient,
  setSelectedClient,
  sites,
  selectedSite,
  setSelectedSite,
  summary,
  onOpenPayment
}) {
  const totalItems = cart.reduce((acc, item) => acc + Number(item.quantity || 0), 0)

  return (
    <div className="order-form-page orden-grid">
      <div className="orden-card order-form-main">
        <div className="order-section-header">
          <div>
            <h4 className="orden-form-title">Generar Orden</h4>
            <p className="order-form-subtitle">Agrega productos al carrito y confirma la orden.</p>
          </div>
          <div className="order-kpis">
            <div className="order-kpi-item">
              <span>Líneas</span>
              <strong>{cart.length}</strong>
            </div>
            <div className="order-kpi-item">
              <span>Items</span>
              <strong>{totalItems}</strong>
            </div>
          </div>
        </div>

        <section className="order-block">
          <div className="mb-3 search-wrapper">
            <label htmlFor="buscar_producto" className="form-label">Buscar Producto</label>
            <AutoComplete
              inputId="buscar_producto"
              value={productQuery}
              suggestions={productSuggestions}
              completeMethod={searchProducts}
              field="description"
              placeholder="Escribe para buscar..."
              className="product-search"
              onChange={e => setProductQuery(e.value)}
              onSelect={e => addProductToCart(e.value)}
              minLength={2}
              delay={400}
            />
          </div>
        </section>

        <section className="order-block">
          <div className="order-block-header">
            <h5><i className="pi pi-shopping-cart" /> Carrito</h5>
            <span className="order-chip">{cart.length} productos</span>
          </div>

          <CartTable
            cart={cart}
            toCurrency={toCurrency}
            updateCartItem={updateCartItem}
            removeProduct={removeProduct}
          />
        </section>
      </div>

      <div className="orden-card order-form-side">
        <div className="order-section-header compact">
          <h4 className="orden-form-title">Resumen de Venta</h4>
        </div>

        <section className="order-block">
          <div className="mb-3">
            <label htmlFor="id_cliente" className="form-label">Cliente</label>
            <Dropdown
              inputId="id_cliente"
              value={selectedClient}
              options={clients}
              optionLabel="label"
              optionValue="value"
              onChange={e => setSelectedClient(e.value)}
              placeholder="Seleccione un cliente"
              style={{ width: '100%' }}
              filter
            />
          </div>

          <div className="mb-3">
            <label htmlFor="id_sede" className="form-label">Sede</label>
            <Dropdown
              inputId="id_sede"
              value={selectedSite}
              options={sites}
              optionLabel="label"
              optionValue="value"
              onChange={e => setSelectedSite(e.value)}
              placeholder={selectedClient ? 'Seleccione una sede' : 'Seleccione un cliente primero'}
              disabled={!selectedClient}
              style={{ width: '100%' }}
              filter
            />
          </div>
        </section>

        <section className="order-block order-totals-block">
          <div className="mb-2">
            <div className="summary-row">
              <small>Subtotal:</small>
              <small>{toCurrency(summary.subtotal)}</small>
            </div>
            <div className="summary-row">
              <small>Descuento:</small>
              <small>{toCurrency(summary.discount)}</small>
            </div>
            <hr className="my-2" />
            <div className="total-row">
              <strong>TOTAL:</strong>
              <strong>{toCurrency(summary.total)}</strong>
            </div>
          </div>

          <div className="orden-actions">
            <Button
              className="p-button-info"
              label="Generar Orden"
              icon="pi pi-file-pdf"
              iconPos="left"
              disabled={cart.length === 0 || !selectedClient || !selectedSite}
              onClick={onOpenPayment}
            />
          </div>
        </section>
      </div>
    </div>
  )
}

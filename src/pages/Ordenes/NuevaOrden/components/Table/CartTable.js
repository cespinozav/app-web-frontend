import { InputNumber } from 'primereact/inputnumber'
import { Button } from 'primereact/button'

export default function CartTable({ cart, toCurrency, updateCartItem, removeProduct }) {
  return (
    <div className="cart-table-wrap">
      <table className="cart-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Desc. (S/)</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {cart.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center' }}>No hay productos en el carrito</td>
            </tr>
          ) : (
            cart.map(item => {
              const subtotal = Math.max((Number(item.price) - Number(item.discount)) * Number(item.quantity), 0)

              return (
                <tr key={item.id}>
                  <td>{item.description}</td>
                  <td>{toCurrency(item.price)}</td>
                  <td>
                    <InputNumber
                      value={item.discount}
                      min={0}
                      max={item.price}
                      minFractionDigits={2}
                      maxFractionDigits={2}
                      mode="decimal"
                      onValueChange={e => updateCartItem(item.id, { discount: Number(e.value || 0) })}
                      inputStyle={{ width: 90 }}
                    />
                  </td>
                  <td>
                    <InputNumber
                      value={item.quantity}
                      min={1}
                      mode="decimal"
                      useGrouping={false}
                      onValueChange={e => updateCartItem(item.id, { quantity: Number(e.value || 1) })}
                      inputStyle={{ width: 90 }}
                    />
                  </td>
                  <td>{toCurrency(subtotal)}</td>
                  <td>
                    <Button
                      icon="pi pi-trash"
                      className="p-button-danger p-button-sm"
                      onClick={() => removeProduct(item.id)}
                      aria-label="Eliminar producto"
                    />
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}

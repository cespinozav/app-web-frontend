import React from 'react';
import getS3Url from 'utils/s3';
// ...existing code...
import { Button } from 'primereact/button';
import styles from './CartTable.module.scss';
import CartStepper from './CartStepper';

export default function CartTable({ cart, toCurrency, onQuantityChange, removeProduct }) {
  console.log('CartTable cart:', cart);
  if (!cart || cart.length === 0) {
    return <div className={styles['cart-empty']}>No hay productos en el carrito</div>;
  }

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity > 0) {
      onQuantityChange(id, { quantity: newQuantity });
    }
  };

  // Helper para obtener la imagen del producto
  const getProductImage = (item) => {
    const url = getS3Url(item.imagen);
    return url || 'https://via.placeholder.com/220x220?text=Sin+Imagen';
  };

  return (
    <div className={styles['cart-list-container']}>
      {cart.map(item => (
        <div className={styles['cart-grouped-card']} key={item.id}>
          <div className={styles['cart-card-header']}>
            <input type="checkbox" checked readOnly style={{ marginRight: 8 }} />
            <span className={styles['cart-card-title']}>Producto seleccionado</span>
          </div>
          <div className={styles['cart-card-content']}>
            <img
              className={styles['cart-card-image']}
              src={getProductImage(item)}
              alt={item.nombre}
            />
            <div className={styles['cart-card-details']}>
                <div className={styles['cart-card-main-row']}>
                  <div className={styles['cart-card-main-left']}>
                    <div className={styles['cart-card-product-title']}>{item.nombre}</div>
                    <div className={styles['cart-card-product-meta']}>
                      {item.categoria}
                      {item.unidad || item.referencia ? (
                        <>
                          {item.categoria ? ' \u00b7 ' : ''}
                          {item.unidad}
                          {item.referencia ? ` (${item.referencia})` : ''}
                        </>
                      ) : null}
                      <div style={{ fontSize: '0.93em', color: (item.estadoProducto || item.estado) === 'disponible' ? '#00a650' : '#d32f2f', fontWeight: 500, marginTop: 2 }}>
                        {(item.estadoProducto || item.estado) === 'disponible' ? 'Disponible' : 'No disponible'}
                      </div>
                    </div>
                    <div className={styles['cart-card-quantity-row']}>
                      <CartStepper
                        value={item.quantity}
                        min={1}
                        onChange={val => handleQuantityChange(item.id, val)}
                      />
                    </div>
                  </div>
                  <div className={styles['cart-card-price-remove-align']}>
                    <span className={styles['cart-card-price']}>{toCurrency(item.price)}</span>
                    <Button
                      icon="pi pi-trash"
                      className={styles['cart-card-remove']}
                      severity="danger"
                      size="small"
                      style={{ fontSize: '1rem', width: 26, height: 26, color: '#d32f2f' }}
                      onClick={() => removeProduct(item.id)}
                      aria-label="Eliminar producto"
                    />
                  </div>
                </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import CarritoService from 'services/Carrito';
import CartTable from '../components/Table/NuevoCarritoTable';

export default function StepCarrito({ onNext }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    CarritoService.get().then(res => {
      setCart(
        res.results.map(item => ({
          id: item.productDetailId,
          nombre: item.nombre,
          price: item.precioUnitario,
          discount: item.descuento || 0,
          quantity: item.cantidad,
        }))
      );
      setLoading(false);
    });
  }, []);

  const toCurrency = value => `S/ ${Number(value || 0).toFixed(2)}`;

  // Disable update/remove for now (backend integration pending)
  const updateCartItem = () => {};
  const removeProduct = () => {};

  return (
    <div>
      <h2>Carrito</h2>
      {loading ? (
        <div>Cargando...</div>
      ) : (
        <CartTable
          cart={cart}
          toCurrency={toCurrency}
          updateCartItem={updateCartItem}
          removeProduct={removeProduct}
        />
      )}
      <button onClick={onNext} disabled={!cart.length || loading}>Continuar</button>
    </div>
  );
}

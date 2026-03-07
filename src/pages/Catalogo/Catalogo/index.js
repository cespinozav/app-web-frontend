import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style.scss';
import ProductoService from 'services/Producto';


import DetalleModal from './components/DetalleModal';
import { useCatalogoCart } from './context/CartContext';
import Filters from './components/Filters';
import CatalogoGrid from './components/CatalogoGrid';

export default function Catalogo() {
  const [categoria, setCategoria] = useState('');
  const [precioMin, setPrecioMin] = useState();
  const [precioMax, setPrecioMax] = useState();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const { cart, addToCart } = useCatalogoCart();
  const [detalleVisible, setDetalleVisible] = useState(false);
  const [productoDetalle, setProductoDetalle] = useState(null);

  useEffect(() => {
    setLoading(true);
    const params = {
      page: 1,
      page_size: 40,
      cat: categoria,
    };
    ProductoService.get(params).then(res => {
      let filtered = res.results;
      if (precioMin != null) filtered = filtered.filter(p => Number(p.precio) >= precioMin);
      if (precioMax != null) filtered = filtered.filter(p => Number(p.precio) <= precioMax);
      setProductos(filtered);
    }).finally(() => setLoading(false));
  }, [categoria, precioMin, precioMax]);

  const navigate = useNavigate();
  const handleShowDetalle = producto => {
    setProductoDetalle(producto);
    setDetalleVisible(true);
  };
  const handleAddToCartFromModal = (producto, cantidad) => {
    // Llama a addToCart una sola vez con la cantidad seleccionada
    addToCart({ ...producto, quantity: cantidad });
    setDetalleVisible(false);
  };
  return (
    <div className="catalogo-container">
      <div className="catalogo-header">
        <h1>Catálogo de Productos</h1>
        <div className="acciones" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontWeight: 600, fontSize: 16 }}>
            <i className="pi pi-shopping-cart" style={{ fontSize: 20, marginRight: 6 }} />
            Carrito: {cart.length} producto{cart.length !== 1 ? 's' : ''}
          </span>
          <button
            className="go-to-cart-btn"
            style={{ padding: '6px 16px', fontWeight: 600, borderRadius: 6, background: '#f7b500', color: '#222', border: 'none', cursor: 'pointer' }}
            onClick={() => navigate('/catalogo/carrito')}
          >
            Ver carrito
          </button>
        </div>
      </div>
      <Filters
        categoria={categoria}
        setCategoria={setCategoria}
        precioMin={precioMin}
        setPrecioMin={setPrecioMin}
        precioMax={precioMax}
        setPrecioMax={setPrecioMax}
      />
      <CatalogoGrid productos={productos} loading={loading} addToCart={addToCart} onShowDetalle={handleShowDetalle} />
      <DetalleModal
        visible={detalleVisible}
        onHide={() => setDetalleVisible(false)}
        producto={productoDetalle}
        onAddToCart={handleAddToCartFromModal}
      />
    </div>
  );
}

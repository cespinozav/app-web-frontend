import React from 'react';

export default function CatalogoGrid({ productos, loading, onShowDetalle }) {
  if (loading) {
    return <div className="catalogo-loading">Cargando productos...</div>;
  }
  if (!productos.length) {
    return <div className="catalogo-empty">No se encontraron productos.</div>;
  }
  return (
    <div className="catalogo-grid">
      {productos.map(producto => (
        <div className="catalogo-card" key={producto.id}>
          <div
            className="catalogo-img-wrap"
            role="button"
            tabIndex={0}
            onClick={() => onShowDetalle(producto)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                onShowDetalle(producto);
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            <img src={producto.imagen || producto.imagen_url || 'https://via.placeholder.com/220x220?text=Sin+Imagen'} alt={producto.nombre} />
          </div>
          <div className="catalogo-info">
            <h2>{producto.nombre}</h2>
            <div className="catalogo-precio">
              {producto.stock === 0
                ? <span className="agotado">Agotado</span>
                : <>S/ {Number(producto.precio).toFixed(2)}</>
              }
            </div>
            {producto.categoria_nombre && (
              <span className="catalogo-categoria">{producto.categoria_nombre}</span>
            )}
            <button
              className="add add-cart-btn"
              style={{ marginTop: 16, width: '100%' }}
              onClick={() => onShowDetalle(producto)}
              disabled={producto.stock === 0}
            >
              <i className="pi pi-shopping-cart" style={{ marginRight: 8 }} />Agregar al carrito
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

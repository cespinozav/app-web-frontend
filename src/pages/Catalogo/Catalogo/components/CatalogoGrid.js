import React from 'react';
import getS3Url from 'utils/s3';

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
            <img src={getS3Url(producto.imagen) || 'https://via.placeholder.com/220x220?text=Sin+Imagen'} alt={producto.nombre} />
          </div>
          <div className="catalogo-info">
            <h2>{producto.nombre}</h2>
            <div className="catalogo-precio">
              <span className={producto.estado === 'disponible' ? 'disponible' : 'agotado'}>
                {producto.estado === 'disponible' ? 'Disponible' : 'No disponible'}
              </span>
              <br />
              {producto.estado === 'disponible' && producto.precio
                ? <>
                    S/ {Number(producto.precio).toFixed(2)}
                    {producto.unidad && producto.unidad.unidad ? <span style={{ marginLeft: 8, color: '#888', fontSize: 14 }}>{producto.unidad.unidad}</span> : null}
                  </>
                : null}
            </div>
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

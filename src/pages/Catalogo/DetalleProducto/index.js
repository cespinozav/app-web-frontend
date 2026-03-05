import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { tipoMoneda } from 'utils/constants';
import './style.scss';

const DetalleProducto = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [unidades, setUnidades] = useState([]);
  const [unidadSeleccionada, setUnidadSeleccionada] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Consultar solo ProductoDetalleService con product_id
    import('services/ProductoDetalle').then(mod => {
      if (mod && mod.default && typeof mod.default.get === 'function') {
        mod.default.get({ productId: id }).then(unidadesApi => {
          let productoFinal = null;
          if (unidadesApi.length > 0) {
            const unidad = unidadesApi[0];
            productoFinal = {
              id: unidad.product,
              nombre: unidad.product_name,
              precio: unidad.price,
              marca: unidad.marca || '',
              descripcion: unidad.descripcion || '',
              imagen: unidad.imagen_url || '',
            };
          }
          setProducto(productoFinal);
          setUnidades(unidadesApi);
          setUnidadSeleccionada(unidadesApi[0] || null);
        }).finally(() => setLoading(false));
      } else {
        setProducto(null);
        setUnidades([]);
        setUnidadSeleccionada(null);
        setLoading(false);
      }
    });
  }, [id]);

  if (loading) return <div className="detalle-producto__loading">Cargando...</div>;
  if (!producto) return <div className="detalle-producto__error">Producto no encontrado</div>;

  return (
    <main className="detalle-producto__main" role="main">
      <div className="detalle-producto__container">
        {/* Galería de imágenes */}
        <div className="detalle-producto__gallery" aria-label="Galería de fotos">
          <img
            src={
              producto.imagen || producto.imagen_url || producto.imagenUrl ||
              'https://http2.mlstatic.com/D_NQ_NP_773186-MPE77808536056_072024-O.webp'
            }
            alt={producto.nombre}
            className="detalle-producto__image"
            onError={e => {
              // Si ya intentó con la imagen principal y la de MercadoLibre, usa otra de internet
              if (e.target.src.includes('mlstatic.com')) {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=410&q=80';
              } else if (e.target.src.includes('unsplash.com')) {
                e.target.onerror = null;
                e.target.src = 'https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&w=410';
              } else {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/410x500?text=Sin+imagen';
              }
            }}
            style={{ borderRadius: 12, boxShadow: '0 2px 12px #0001', maxWidth: 410, maxHeight: 500 }}
          />
        </div>
        {/* Info principal */}
        <div className="detalle-producto__info" style={{ maxWidth: 340, marginLeft: 32 }}>
          <div className="detalle-producto__header">
            <span className="detalle-producto__subtitle" style={{ color: '#00a650', fontWeight: 600, fontSize: 14 }}>Nuevo</span>
            <h1 className="detalle-producto__title" style={{ fontSize: 32, fontWeight: 700, margin: '8px 0' }}>{producto.nombre}</h1>
            {producto.marca && <div className="detalle-producto__brand" style={{ color: '#666', fontSize: 16 }}>{producto.marca}</div>}
          </div>
          <div className="detalle-producto__price" style={{ fontSize: 36, fontWeight: 700, margin: '16px 0', color: '#333', display: 'flex', alignItems: 'center' }}>
            S/&nbsp;{unidadSeleccionada ? unidadSeleccionada.precio || unidadSeleccionada.price : producto.precio}
          </div>
          <div className="detalle-producto__desc" style={{ color: '#444', fontSize: 16, marginBottom: 16 }}>{producto.descripcion}</div>
          <div className="detalle-producto__units" style={{ marginBottom: 12, display: 'flex', alignItems: 'center' }}>
            <span style={{ fontWeight: 500, marginRight: 8 }}>Unidad:</span>
            <Dropdown
              value={unidadSeleccionada}
              options={unidades}
              onChange={e => setUnidadSeleccionada(e.value)}
              optionLabel="unit_reference"
              placeholder="Selecciona unidad"
              className="detalle-producto__dropdown"
              style={{ minWidth: 200, marginRight: 12 }}
            />
          </div>
          <div
            className="detalle-producto__quantity"
            style={{
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 8,
              width: '100%',
              maxWidth: 340,
              boxSizing: 'border-box'
            }}
          >
            <span style={{ fontWeight: 500, minWidth: 70 }}>Cantidad:</span>
            <div style={{ width: '50%' }}>
              <InputNumber
                value={cantidad}
                min={1}
                max={unidadSeleccionada?.stock || 99}
                onValueChange={e => setCantidad(e.value)}
                showButtons
                buttonLayout="horizontal"
                decrementButtonClassName="p-button-secondary"
                incrementButtonClassName="p-button-secondary"
                className="detalle-producto__inputnumber"
                style={{ width: '100%', minWidth: 85, maxWidth: 170 }}
              />
            </div>
          </div>
          <button className="detalle-producto__buy-btn" style={{ background: '#3483fa', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 6, padding: '12px 0', width: '100%', marginBottom: 16, cursor: 'pointer' }}>Comprar ahora</button>
          {/* Características principales */}
          {unidadSeleccionada && (
            <div className="detalle-producto__features" style={{ marginTop: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Características principales</h2>
              <ul style={{ paddingLeft: 18, color: '#222', fontSize: 15 }}>
                <li><b>Unidad:</b> {unidadSeleccionada.unit_reference}</li>
                <li><b>Precio:</b> {tipoMoneda} {unidadSeleccionada.precio || unidadSeleccionada.price}</li>
                <li><b>Estado:</b> {unidadSeleccionada.state}</li>
                {/* Agrega más características si están disponibles */}
              </ul>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default DetalleProducto;

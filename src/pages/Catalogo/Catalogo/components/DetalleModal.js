import React, { useEffect, useState } from 'react';
import getS3Url from 'utils/s3';
// Solo para catálogo: importar el nuevo servicio
import CatalogoProductoDetalleService from 'services/CatalogoProductoDetalle';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { tipoMoneda } from 'utils/constants';
import CarritoService from 'services/Carrito';

export default function DetalleModal({ visible, onHide, producto }) {
  // Galería de imágenes: soporta array o string
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [detalle, setDetalle] = useState(null);
  const [unidades, setUnidades] = useState([]);
  const [unidadSeleccionada, setUnidadSeleccionada] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(false);
  const [agregando, setAgregando] = useState(false);

  useEffect(() => {
    if (!producto) return;
    setLoading(true);
    setCantidad(1);
    setSelectedIdx(0);
    // Para catálogo, usar el nuevo servicio
    CatalogoProductoDetalleService.get({ productId: producto.id })
      .then(detalleApi => {
        if (detalleApi) {
          setDetalle(detalleApi);
          // Usar el array de unidades del endpoint
          setUnidades(detalleApi.unidades || []);
          setUnidadSeleccionada((detalleApi.unidades && detalleApi.unidades[0]) || null);
        } else {
          setDetalle(producto);
          setUnidades([]);
          setUnidadSeleccionada(null);
        }
      })
      .finally(() => setLoading(false));
  }, [producto]);

  if (!producto) return null;

  const handleAgregarCarrito = async () => {
    if (!unidadSeleccionada) return;
    setAgregando(true);
    try {
      await CarritoService.create({
        producto: unidadSeleccionada.id_product_detail,
        cantidad
      });
      onHide();
    } catch (e) {
      alert('No se pudo agregar al carrito');
    } finally {
      setAgregando(false);
    }
  };

  return (
    <Dialog
      header={detalle?.nombre || producto.nombre}
      visible={visible}
      style={{
        width: '950px',
        maxWidth: '98vw',
        minWidth: '340px',
        borderRadius: 16,
        padding: 0
      }}
      onHide={onHide}
      modal
      className="detalle-modal-responsive"
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: 32 }}>Cargando...</div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 32,
            width: '100%',
            flexWrap: 'wrap',
            minHeight: 320,
            boxSizing: 'border-box'
          }}
        >
          {/* Miniaturas verticales */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', minWidth: 70 }}>
            {Array.isArray(detalle?.imagenes) && detalle.imagenes.length > 0
              ? detalle.imagenes.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedIdx(idx)}
                    style={{
                      border: selectedIdx === idx ? '2px solid #1976d2' : '1px solid #eee',
                      borderRadius: 8,
                      padding: 0,
                      background: selectedIdx === idx ? '#f0f7ff' : '#fff',
                      cursor: 'pointer',
                      outline: 'none',
                      boxShadow: selectedIdx === idx ? '0 0 0 2px #90caf9' : 'none',
                      width: 56,
                      height: 56,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 2
                    }}
                  >
                    <img
                      src={getS3Url(img.image_path || img.imagen || img.url || img)}
                      alt={`thumb-${idx}`}
                      style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6 }}
                    />
                  </button>
                ))
              : null}
          </div>
          {/* Imagen principal grande */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 220, minWidth: 320 }}>
            <figure style={{ margin: 0, position: 'relative', width: 320, height: 320, background: '#fafbfc', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <img
                src={
                  Array.isArray(detalle?.imagenes) && detalle.imagenes.length > 0
                    ? getS3Url(
                        detalle.imagenes[selectedIdx]?.image_path ||
                        detalle.imagenes[selectedIdx]?.imagen ||
                        detalle.imagenes[selectedIdx]?.url ||
                        detalle.imagenes[selectedIdx]
                      )
                    : detalle?.imagen || detalle?.imagen_url || detalle?.imagenUrl || 'https://via.placeholder.com/220x220?text=Sin+Imagen'
                }
                alt={detalle?.nombre || producto.nombre}
                style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 12 }}
              />
            </figure>
          </div>
          <div style={{ width: '100%', minWidth: 320, maxWidth: 420 }}>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{detalle?.nombre || producto.nombre}</div>
            {detalle?.estado && (
              <div style={{
                fontWeight: 600,
                fontSize: 15,
                marginBottom: 14,
                color: detalle.estado.toLowerCase() === 'disponible' ? '#00a650' : '#e53935',
                letterSpacing: 0.2
              }}>
                {detalle.estado.toLowerCase() === 'disponible' ? 'Disponible' : 'No disponible'}
              </div>
            )}
            {detalle?.marca && <div style={{ color: '#666', fontSize: 16, marginBottom: 6 }}>{detalle.marca}</div>}
            <div style={{ color: '#00a650', fontWeight: 800, fontSize: 22, marginBottom: 18 }}>
              {tipoMoneda} {unidadSeleccionada ? unidadSeleccionada.precio || unidadSeleccionada.price : detalle?.precio || producto.precio}
            </div>
            {unidades.length > 0 && (
              <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center' }}>
                <span style={{ fontWeight: 500, marginRight: 8 }}>Unidad:</span>
                <Dropdown
                  value={unidadSeleccionada}
                  options={unidades}
                  onChange={e => setUnidadSeleccionada(e.value)}
                  optionLabel="unidad"
                  placeholder="Selecciona unidad"
                  style={{ minWidth: 180, marginRight: 12 }}
                />
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <span>Cantidad:</span>
              <InputNumber
                value={cantidad}
                min={1}
                max={unidadSeleccionada?.stock || detalle?.stock || 99}
                onValueChange={e => setCantidad(e.value)}
                style={{ width: 120 }}
                inputStyle={{ width: 120 }}
              />
            </div>
            <button
              className="add add-cart-btn"
              style={{
                width: 260,
                padding: '10px 0',
                fontWeight: 700,
                fontSize: 17,
                borderRadius: 8,
                background: '#f7b500',
                color: '#222',
                border: 'none',
                cursor: 'pointer',
                marginBottom: 8,
                marginTop: 0,
                transition: 'background 0.2s',
                display: 'inline-block'
              }}
              onClick={handleAgregarCarrito}
              disabled={unidadSeleccionada?.stock === 0 || detalle?.stock === 0 || agregando}
            >
              <i className="pi pi-shopping-cart" style={{ marginRight: 8 }} />{agregando ? 'Agregando...' : 'Agregar al carrito'}
            </button>
            {unidadSeleccionada && (
              <div style={{ marginTop: 18 }}>
                {/* ...otros detalles de unidad... */}
              </div>
            )}
          </div>
        </div>
      )}
    </Dialog>
  );
}

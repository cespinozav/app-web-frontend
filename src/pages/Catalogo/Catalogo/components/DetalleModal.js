import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { tipoMoneda } from 'utils/constants';
import CarritoService from 'services/Carrito';

export default function DetalleModal({ visible, onHide, producto }) {
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
    import('services/ProductoDetalle').then(mod => {
      if (mod && mod.default && typeof mod.default.get === 'function') {
        mod.default.get({ productId: producto.id }).then(unidadesApi => {
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
          setDetalle(productoFinal || producto);
          setUnidades(unidadesApi);
          setUnidadSeleccionada(unidadesApi[0] || null);
        }).finally(() => setLoading(false));
      } else {
        setDetalle(producto);
        setUnidades([]);
        setUnidadSeleccionada(null);
        setLoading(false);
      }
    });
  }, [producto]);

  if (!producto) return null;

  const handleAgregarCarrito = async () => {
    if (!unidadSeleccionada) return;
    setAgregando(true);
    try {
      await CarritoService.create({
        producto: unidadSeleccionada.id_product_detail || unidadSeleccionada.id,
        cantidad,
        precio_unitario: String(unidadSeleccionada.precio || unidadSeleccionada.price || detalle?.precio || producto.precio),
        descuento: '0.00'
      });
      onHide();
    } catch (e) {
      // Aquí podrías mostrar un toast de error si tienes uno
      alert('No se pudo agregar al carrito');
    } finally {
      setAgregando(false);
    }
  };

  return (
    <Dialog header={detalle?.nombre || producto.nombre} visible={visible} style={{ width: '540px' }} onHide={onHide} modal>
      {loading ? (
        <div style={{ textAlign: 'center', padding: 32 }}>Cargando...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
          <img
            src={
              detalle?.imagen || detalle?.imagen_url || detalle?.imagenUrl ||
              'https://via.placeholder.com/220x220?text=Sin+Imagen'
            }
            alt={detalle?.nombre || producto.nombre}
            style={{ width: 220, height: 220, objectFit: 'contain', borderRadius: 12, background: '#f4f6fa', boxShadow: '0 2px 12px #0001' }}
          />
          <div style={{ width: '100%' }}>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{detalle?.nombre || producto.nombre}</div>
            {detalle?.marca && <div style={{ color: '#666', fontSize: 16, marginBottom: 6 }}>{detalle.marca}</div>}
            <div style={{ color: '#00a650', fontWeight: 800, fontSize: 22, marginBottom: 8 }}>
              {tipoMoneda} {unidadSeleccionada ? unidadSeleccionada.precio || unidadSeleccionada.price : detalle?.precio || producto.precio}
            </div>
            <div style={{ color: '#444', fontSize: 15, marginBottom: 12 }}>{detalle?.descripcion || producto.descripcion || '-'}</div>
            {unidades.length > 0 && (
              <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center' }}>
                <span style={{ fontWeight: 500, marginRight: 8 }}>Unidad:</span>
                <Dropdown
                  value={unidadSeleccionada}
                  options={unidades}
                  onChange={e => setUnidadSeleccionada(e.value)}
                  optionLabel="unit_reference"
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
              />
            </div>
            <button
              className="add add-cart-btn"
              style={{ width: '100%', padding: '10px 0', fontWeight: 700, fontSize: 17, borderRadius: 8, background: '#f7b500', color: '#222', border: 'none', cursor: 'pointer' }}
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

import React, { useMemo, useEffect, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { SUB_ROUTES } from 'routing/routes';
import useToast from 'hooks/useToast';
import ClienteService from 'services/Cliente';
import SedesClienteService from 'services/SedesCliente';
import calcularFechaEntrega from 'services/CalcularFechaEntrega';
import GeneralOrdersService from 'services/GeneralOrders';
import { formatDateMin } from 'utils/dates';
import CarritoService from 'services/Carrito';
// import { makeRequest } from 'utils/api';
import CartTable from 'components/Cart/CartTable';
import PaymentModal from 'components/Cart/PaymentModal';

const paymentMethods = [
  { label: 'Yape', value: 'yape' },
  { label: 'Plin', value: 'plin' },
  { label: 'Transferencia', value: 'transferencia' },
  { label: 'Tarjeta de Crédito', value: 'tarjeta_credito' },
  { label: 'Tarjeta de Débito', value: 'tarjeta_debito' }
];

export default function NuevoCarritoForm() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('yape');
  const [operationNumber, setOperationNumber] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [fechaEntregaEstimada, setFechaEntregaEstimada] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();
  const toCurrency = value => `S/ ${Number(value || 0).toFixed(2)}`;
  const [clients, setClients] = useState([]);
  const [sites, setSites] = useState([]);

  useEffect(() => {
    setLoading(true);
    CarritoService.get().then(res => {
      setCart(
        res.results.map(item => ({
          id: item.id_carrito_producto,
          id_carrito_producto: item.id_carrito_producto,
          productDetailId: item.productDetailId,
          nombre: item.nombre,
          price: item.precio,
          quantity: item.cantidad,
          categoria: item.categoria,
          unidad: item.unidad,
          referencia: item.referencia,
          estado: item.estado,
          estadoProducto: item.estadoProducto || item.estado || undefined,
          imagen: item.imagen
        }))
      );
      setLoading(false);
    });
  }, []);

  // Actualiza la cantidad localmente (puedes agregar integración backend si lo deseas)
  const updateCartItem = async (id, changes) => {
    setCart(prev => prev.map(item =>
      item.id === id ? { ...item, ...changes } : item
    ));
    if (typeof changes.quantity === 'number') {
      try {
        const item = cart.find(i => i.id === id);
        const productoId = item?.productDetailId || item?.producto || item?.id_producto;
        await CarritoService.put(id, changes.quantity, productoId);
      } catch (e) {
        // Si falla, podrías revertir el cambio local o mostrar un error
      }
    }
  };
  const removeProduct = async (id) => {
    try {
      await CarritoService.delete(id);
      setCart(prev => prev.filter(item => item.id !== id));
      toast.success('Producto eliminado del carrito.');
    } catch (e) {
      toast.error('No se pudo eliminar el producto del carrito.');
    }
  };

  const clearForm = () => {
    setSelectedClient(null);
    setSelectedSite(null);
    setOperationNumber('');
    setPaymentMethod('yape');
    setFechaEntregaEstimada(null);
  };

  const handleOpenPaymentModal = async () => {
    try {
      const data = await calcularFechaEntrega();
      setFechaEntregaEstimada(data?.result?.fecha_entrega_estimada || null);
    } catch (e) {
      setFechaEntregaEstimada(null);
    }
    setShowPaymentModal(true);
  };

  const handleCreateOrder = async () => {
    if (!selectedClient) {
      toast.error('Debe seleccionar un cliente');
      return;
    }
    if (!selectedSite) {
      toast.error('Debe seleccionar una sede');
      return;
    }
    if (cart.length === 0) {
      toast.error('Debe agregar al menos un producto al carrito');
      return;
    }
    setIsSaving(true);
    try {
      let fechaEntrega = fechaEntregaEstimada;
      if (!fechaEntrega) {
        try {
          const data = await calcularFechaEntrega();
          fechaEntrega = data?.result?.fecha_entrega_estimada || null;
        } catch (e) {
          fechaEntrega = null;
        }
      }
      const productos = cart.map(item => ({
        producto: item.productDetailId || item.id,
        cantidad: Number(item.quantity),
        precio_unitario: Number(item.price),
        descuento: Number(item.discount || 0)
      }));
      let fechaEntregaFinal = fechaEntrega;
      if (fechaEntrega) {
        if (/^\d{4}-\d{2}-\d{2}$/.test(fechaEntrega)) {
          const [yyyy, mm, dd] = fechaEntrega.split('-');
          fechaEntregaFinal = `${dd}-${mm}-${yyyy}`;
        } else if (/^\d{2}-\d{2}-\d{4}$/.test(fechaEntrega)) {
          fechaEntregaFinal = fechaEntrega;
        }
      } else {
        fechaEntregaFinal = null;
      }
      const now = new Date();
      const fechaOrden = formatDateMin(now).replaceAll('/', '-');
      const payload = {
        sede: selectedSite,
        fecha_entrega_estimada: fechaEntregaFinal,
        fecha_orden: fechaOrden,
        productos
      };
      await GeneralOrdersService.create(payload);
      toast.success('Orden registrada correctamente');
      setShowPaymentModal(false);
      clearForm();
      navigate(SUB_ROUTES.CATALOG.MAIN);
    } catch (error) {
      toast.error(error?.message || 'No se pudo registrar la orden');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    ClienteService.get({ page: 1, page_size: 100, state: 'activo' })
      .then(response => {
        setClients((response?.results || []).map(client => ({
          label: client.nombre,
          value: client.id,
          raw: client
        })));
      })
      .catch(() => setClients([]));
  }, []);

  useEffect(() => {
    if (!selectedClient) {
      setSites([]);
      setSelectedSite(null);
      return;
    }
    SedesClienteService.get({ id_client: selectedClient, page: 1, page_size: 100 })
      .then(response => {
        setSites((response?.results || []).map(site => ({
          label: site.nombre || site.description || `Sede ${site.id}`,
          value: site.id,
          raw: site
        })));
      })
      .catch(() => setSites([]));
  }, [selectedClient]);

  const summary = useMemo(() => {
    const subtotal = cart.reduce((acc, item) => acc + Number(item.price) * Number(item.quantity), 0);
    const discount = cart.reduce((acc, item) => acc + Number(item.discount || 0) * Number(item.quantity), 0);
    const total = Math.max(subtotal - discount, 0);
    return { subtotal, discount, total };
  }, [cart]);

  return (
    <div className="order-form-page orden-grid">
      <section className="order-block">
        {loading ? (
          <div>Cargando...</div>
        ) : (
          <CartTable
            cart={cart}
            toCurrency={toCurrency}
            onQuantityChange={updateCartItem}
            removeProduct={removeProduct}
          />
        )}
      </section>
      <div className="orden-card order-form-side">
        <div className="order-section-header compact">
          <h4 className="orden-form-title">Resumen de Carrito</h4>
        </div>
        <section className="order-block">
          <div className="mb-3">
            <label htmlFor="id_cliente" className="form-label">
              Cliente
            </label>
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
            <label htmlFor="id_sede" className="form-label">
              Sede
            </label>
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
          <hr className="my-2" />
          <div className="orden-actions">
            <Button
              className="p-button-info"
              label="Continuar Compra"
              icon="pi pi-shopping-cart"
              iconPos="left"
              disabled={cart.length === 0 || !selectedClient || !selectedSite}
              onClick={handleOpenPaymentModal}
            />
          </div>
        </section>
        <PaymentModal
          visible={showPaymentModal}
          onHide={() => setShowPaymentModal(false)}
          summary={summary}
          toCurrency={toCurrency}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          paymentMethods={paymentMethods}
          operationNumber={operationNumber}
          setOperationNumber={setOperationNumber}
          isSaving={isSaving}
          onConfirm={handleCreateOrder}
          fechaEntregaEstimada={fechaEntregaEstimada}
        />
      </div>
    </div>
  );
}

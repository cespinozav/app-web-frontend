import { tipoMoneda } from 'utils/constants';
import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
// ...existing code...
import { Skeleton } from 'primereact/skeleton';
import useToast from 'hooks/useToast';
import EstadoBadge from 'components/styles/EstadoBadge';
import ProductoDetalleService from 'services/ProductoDetalle';
import ProductDetailForm from './ProductDetailForm';

const PAGE_SIZE = 10;

export default function ProductDetailModal({ visible, onHide, product }) {
  const [details, setDetails] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [rowData, setRowData] = useState(null);
  const toast = useToast();

  useEffect(() => {
    if (visible && product?.id) {
      setIsFetching(true);
      ProductoDetalleService.get({ productId: product.id })
        .then(res => {
          setDetails(Array.isArray(res) ? res : []);
        })
        .catch(() => {
          toast.error('Error al cargar detalles del producto');
          setDetails([]);
        })
        .finally(() => setIsFetching(false));
    }
  }, [visible, product?.id, showForm]);

  const handleAdd = () => {
    setRowData(null);
    setShowForm(true);
  };

  const handleEdit = detail => {
    setRowData({
      ...detail,
      unit: detail.unit,
      state: detail.state // keep as 'activo' or 'inactivo'
    });
    setShowForm(true);
  };

  const onSubmitFields = async (formData, resetForm) => {
    setIsMutating(true);
    try {
      if (rowData && rowData.id_product_detail) {
        // Editar detalle existente
        await ProductoDetalleService.put({
          idProductDetail: rowData.id_product_detail,
          product: product.id,
          price: formData.price,
          unit: formData.unit
        });
        toast.success('Detalle editado con éxito');
      } else {
        // Crear nuevo detalle
        await ProductoDetalleService.post({
          product: product.id,
          price: formData.price,
          unit: formData.unit
        });
        toast.success('Detalle agregado con éxito');
      }
      setShowForm(false);
      if (resetForm) resetForm();
    } catch (e) {
      toast.error('Error al guardar detalle');
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <Dialog
      className="dialog product-detail-dialog maintenance"
      draggable={false}
      visible={visible}
      modal
      onHide={onHide}
      header={<span style={{ fontWeight: 600, fontSize: '1.2rem' }}>Detalles de producto - {product?.nombre}</span>}
      closable={true}
      style={{ minWidth: 700 }}
    >
      <div className="product-detail-list maintenance">
        {isFetching ? (
          Array.from({ length: PAGE_SIZE }).map((_, key) => <Skeleton className="table" key={key}></Skeleton>)
        ) : (
          <>
            <Dialog
              className="dialog product-detail-form-dialog maintenance"
              draggable={false}
              visible={showForm}
              modal
              onHide={() => setShowForm(false)}
              header={<span style={{ fontWeight: 600, fontSize: '1.2rem' }}>{rowData ? 'Editar detalle de producto' : 'Agregar detalle de producto'}</span>}
              closable={true}
            >
              <ProductDetailForm
                onSubmitFields={onSubmitFields}
                isMutating={isMutating}
                defaultValues={rowData}
                productId={product?.id}
                onCancel={() => setShowForm(false)}
              />
            </Dialog>
            <table className="p-datatable table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Producto</th>
                  <th>Unidad</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {details.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center' }}>
                      No hay detalles
                    </td>
                  </tr>
                ) : (
                  details.map(detail => (
                    <tr key={detail.id_product_detail}>
                      <td>{detail.id_product_detail}</td>
                      <td>{detail.product_name || '-'}</td>
                      <td>{detail.unit_reference || detail.unit || '-'}</td>
                      <td>{typeof detail.price !== 'undefined' ? `${tipoMoneda} ${detail.price}` : '-'}</td>
                      <td><EstadoBadge estado={detail.state} /></td>
                      <td>
                        <Button
                          icon="pi pi-pencil"
                          className="p-button p-button-rounded p-button-text p-button-plain p-button-icon-only"
                          style={{ color: '#495057', border: '1px solid #ced4da', background: 'transparent' }}
                          onClick={() => handleEdit(detail)}
                          aria-label="Editar"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="paginate">
              <div className="buttons">
                <button onClick={handleAdd} className="add" type="button">
                  Agregar +
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
}

import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import useToast from 'hooks/useToast';
import SedesClienteService from 'services/SedesCliente';
import SedeForm from '../Forms/SedeForm';

const PAGE_SIZE = 10;

export default function SedesModal({ visible, onHide, cliente }) {
  const [sedes, setSedes] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [page] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [rowData, setRowData] = useState(null);
  const toast = useToast();

  useEffect(() => {
    if (visible && cliente?.id) {
      setIsFetching(true);
      SedesClienteService.get({ id_client: cliente.id, page, page_size: PAGE_SIZE })
        .then(res => {
          setSedes(res.results);
        })
        .finally(() => setIsFetching(false));
    }
  }, [visible, cliente, page, showForm]);

  const handleEdit = sede => {
    setRowData(sede);
    setShowForm(true);
  };
  const handleAdd = () => {
    setRowData(null);
    setShowForm(true);
  };

  const onSubmitFields = async (formData, resetForm) => {
    setIsMutating(true);
    try {
      if (rowData && rowData.id) {
        // Editar sede existente
        await SedesClienteService.update(rowData.id, { ...formData, id_client: cliente.id });
        toast.success('Sede editada con éxito');
      } else {
        // Crear nueva sede
        await SedesClienteService.create({ ...formData, id_client: cliente.id });
        toast.success('Sede agregada con éxito');
      }
      setShowForm(false);
      if (resetForm) resetForm();
    } catch (e) {
      toast.error(e.message || 'Error al guardar sede');
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <Dialog
      className="dialog sedes-dialog maintenance"
      draggable={false}
      visible={visible}
      modal
      onHide={onHide}
      header={<span style={{ fontWeight: 600, fontSize: '1.2rem' }}>Sedes de {cliente?.nombre || ''}</span>}
      closable={true}
      style={{ minWidth: 700 }}
    >
      <div className="kit-list maintenance">
        {isFetching ? (
          Array.from({ length: PAGE_SIZE }).map((_, key) => <Skeleton className="table" key={key}></Skeleton>)
        ) : (
          <>
            <Dialog
              className="dialog sedes-dialog maintenance"
              draggable={false}
              visible={showForm}
              modal
              onHide={() => setShowForm(false)}
              header={<span style={{ fontWeight: 600, fontSize: '1.2rem' }}>{rowData ? 'Editar sede' : 'Agregar sede'}</span>}
              closable={true}
            >
              <SedeForm
                onSubmitFields={onSubmitFields}
                isMutating={isMutating}
                defaultValues={rowData}
                toast={toast}
              />
            </Dialog>
            <table className="p-datatable table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Sede</th>
                  <th>Estado</th>
                  <th>Ciudad</th>
                  <th>Dirección</th>
                  <th>Latitud</th>
                  {/* <th>Longitud</th>
                  <th>Acción</th> */}
                </tr>
              </thead>
              <tbody>
                {sedes.length === 0 ? (
                  <tr><td colSpan={9} style={{ textAlign: 'center' }}>No hay resultados</td></tr>
                ) : (
                  sedes.map(sede => (
                    <tr key={sede.id}>
                      <td>{sede.id}</td>
                      <td>{sede.name_client}</td>
                      <td>{sede.nombre}</td>
                      <td>{sede.state}</td>
                      <td>{sede.name_country}</td>
                      <td>{sede.adress}</td>
                      {/* <td>{sede.lat}</td>
                      <td>{sede.long}</td> */}
                      <td>
                        <div className="actions" style={{ display: 'flex', gap: 8 }}>
                          <Button icon="pi pi-pencil" className="p-button p-component p-button-icon-only" style={{ background: 'transparent' }} onClick={() => handleEdit(sede)} />
                          <Button
                            icon="pi pi-map-marker"
                            className="p-button p-component p-button-icon-only"
                            style={{ background: 'transparent', color: '#007bff' }}
                            title="Ver ubicación en Google Maps"
                            onClick={() => {
                              if (sede.lat && sede.long) {
                                const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(sede.lat)},${encodeURIComponent(sede.long)}`;
                                window.open(url, '_blank');
                              }
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="paginate">
              <div className="buttons">
                <button
                  onClick={handleAdd}
                  className="add"
                >
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

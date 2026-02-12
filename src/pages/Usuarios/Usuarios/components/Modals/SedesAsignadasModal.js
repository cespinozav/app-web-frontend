import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import useToast from 'hooks/useToast';
import PersonaSedeClienteService from 'services/PersonaSedeCliente';
import EstadoBadge from 'components/styles/EstadoBadge';
import AsignacionSedeForm from '../Forms/AsignacionSedeForm';

const PAGE_SIZE = 10;

export default function SedesAsignadasModal({ visible, onHide, usuario }) {
  const [sedes, setSedes] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [page] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [rowData, setRowData] = useState(null);
  const toast = useToast();

  useEffect(() => {
    if (visible && usuario?.id) {
      setIsFetching(true);
      PersonaSedeClienteService.get({ person: usuario.id, page, page_size: PAGE_SIZE })
        .then(res => {
          setSedes(res.results);
        })
        .catch(() => {
          toast.error('Error al cargar las sedes asignadas');
          setSedes([]);
        })
        .finally(() => setIsFetching(false));
    }
  }, [visible, usuario, page, showForm]);

  const handleAdd = () => {
    setRowData(null);
    setShowForm(true);
  };

  const handleEdit = (sede) => {
    setRowData(sede);
    setShowForm(true);
  };

  const onSubmitFields = async (formData, resetForm) => {
    setIsMutating(true);
    try {
      if (rowData && rowData.id) {
        // Editar asignación existente
        await PersonaSedeClienteService.update(rowData.id, {
          person: usuario.id,
          sede_cliente: formData.sede_cliente,
          rol: formData.rol,
          state: formData.state
        });
        toast.success('Asignación editada con éxito');
      } else {
        // Crear nueva asignación
        await PersonaSedeClienteService.create({ 
          person: usuario.id,
          sede_cliente: formData.sede_cliente, 
          rol: formData.rol,
          state: formData.state 
        });
        toast.success('Asignación agregada con éxito');
      }
      setShowForm(false);
      if (resetForm) resetForm();
    } catch (e) {
      // Manejar mensajes de validación del API
      if (e?.result?.detail && Array.isArray(e.result.detail)) {
        // Mostrar todos los mensajes de validación
        e.result.detail.forEach(msg => toast.error(msg));
      } else if (e?.detail && Array.isArray(e.detail)) {
        e.detail.forEach(msg => toast.error(msg));
      } else if (e?.message) {
        toast.error(e.message);
      } else {
        toast.error('Error al guardar asignación');
      }
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <Dialog
      className="dialog sedes-asignadas-dialog maintenance"
      draggable={false}
      visible={visible}
      modal
      onHide={onHide}
      header={
        <span style={{ fontWeight: 600, fontSize: '1.2rem' }}>
          Sedes asignadas - {usuario?.nombres} {usuario?.apellidoPaterno}
        </span>
      }
      closable={true}
      style={{ minWidth: 900 }}
    >
      <div className="kit-list maintenance">
        {isFetching ? (
          Array.from({ length: PAGE_SIZE }).map((_, key) => <Skeleton className="table" key={key}></Skeleton>)
        ) : (
          <>
            <Dialog
              className="dialog sedes-asignacion-dialog maintenance"
              draggable={false}
              visible={showForm}
              modal
              onHide={() => setShowForm(false)}
              header={<span style={{ fontWeight: 600, fontSize: '1.2rem' }}>{rowData ? 'Editar asignación de sede' : 'Agregar asignación de sede'}</span>}
              closable={true}
            >
              <AsignacionSedeForm
                onSubmitFields={onSubmitFields}
                isMutating={isMutating}
                defaultValues={rowData}
                toast={toast}
                usuario={usuario}
              />
            </Dialog>
            <table className="p-datatable table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Persona</th>
                  <th>Cliente</th>
                  <th>Sede</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Fecha Asignación</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {sedes.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center' }}>
                      No hay sedes asignadas
                    </td>
                  </tr>
                ) : (
                  sedes.map(sede => (
                    <tr key={sede.id}>
                      <td>{sede.id}</td>
                      <td>{sede.person_name || '-'}</td>
                      <td>{sede.cliente_name || '-'}</td>
                      <td>{sede.sede_cliente_name || '-'}</td>
                      <td>{sede.rol_name || '-'}</td>
                      <td><EstadoBadge estado={sede.state} /></td>
                      <td>
                        {sede.date_joined 
                          ? new Date(sede.date_joined).toLocaleDateString('es-PE', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : '-'}
                      </td>
                      <td>
                        <div className="actions">
                          <Button
                            icon="pi pi-pencil"
                            className="p-button p-component p-button-icon-only"
                            style={{ background: 'transparent' }}
                            onClick={() => handleEdit(sede)}
                            aria-label="Editar"
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

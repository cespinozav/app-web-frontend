import React, { useState } from 'react';
import CategoriaClienteService from 'services/CategoriaCliente';
import { Dialog } from 'primereact/dialog';
import SedesModal from './components/Modals/SedesModal';
import { useForm, Controller } from 'react-hook-form';
import useToast from 'hooks/useToast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import ClienteService from 'services/Cliente';
import { Paginator } from 'primereact/paginator';
import { useQuery } from 'hooks/useRequest';
import { Skeleton } from 'primereact/skeleton';
import '../style.scss';

const PAGE_SIZE = 10;

const estados = [
  { label: 'Todos', value: '' },
  { label: 'Activo', value: 1 },
  { label: 'Inactivo', value: 0 }
];

export default function MantenimientoClientes() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [state, setState] = useState(1); // Por defecto, mostrar solo activos
  const { data, isFetching, refetch } = useQuery([
    'clientes', page, search, state
  ], () => {
    let params = { page, page_size: PAGE_SIZE, search };
    if (state !== '') {
      if (Number(state) === 1) params.state = 'activo';
      else if (Number(state) === 0) params.state = 'inactivo';
    }
    return ClienteService.get(params);
  });
  const clientes = data?.results || [];
  const totalRecords = data?.count || 0;

  // Modal de agregar/editar cliente
  const [showAdd, setShowAdd] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [showSedes, setShowSedes] = useState(false);
  const toast = useToast();

  // Lógica para guardar cliente (faltante en el return principal)
  const onSubmitFields = async (formData, resetForm) => {
    setIsMutating(true);
    try {
      const categoria = formData.categoria;
      if (rowData && rowData.id) {
        await ClienteService.put({
          id: rowData.id,
          nombre: formData.nombre,
          abrev: formData.abreviatura,
          cod_ruc: formData.ruc,
          categoria,
          state: formData.active === 1 ? 'activo' : 'inactivo',
          user_created: 1 // Ajustar según usuario actual
        });
        setShowAdd(false);
        setRowData(null);
        resetForm && resetForm();
        toast.success('Cliente editado con éxito');
        refetch();
      } else {
        await ClienteService.post({
          nombre: formData.nombre,
          abrev: formData.abreviatura,
          cod_ruc: formData.ruc,
          categoria,
          state: formData.active === 1 ? 'activo' : 'inactivo',
          user_created: 1 // Ajustar según usuario actual
        });
        setShowAdd(false);
        resetForm && resetForm();
        toast.success('Cliente agregado con éxito');
        refetch();
      }
    } catch (e) {
      if (e?.result?.nombre && Array.isArray(e.result.nombre)) {
        toast.error(e.result.nombre[0]);
        return;
      }
      if (e?.status === 401 || (e?.message && String(e.message).includes('401'))) {
        window.location.href = '/login';
        return;
      }
      toast.error(e.message || 'Error al guardar cliente');
    } finally {
      setIsMutating(false);
    }
  };

  function ClienteModalForm({ onClose, onSubmitFields, isMutating, defaultValues }) {
    const { control, handleSubmit, reset, formState: { errors } } = useForm({
      defaultValues: defaultValues || { nombre: '', abreviatura: '', categoria: null, ruc: '', active: 1 }
    });
    const [categorias, setCategorias] = React.useState([]);
    const [loadingCategorias, setLoadingCategorias] = React.useState(false);
    React.useEffect(() => {
      setLoadingCategorias(true);
      CategoriaClienteService.get({ page: 1, page_size: 100 })
        .then(res => {
          setCategorias(res.results.map(cat => ({ label: cat.description || cat.nombre || cat.label, value: cat.id })));
        })
        .catch(() => setCategorias([]))
        .finally(() => setLoadingCategorias(false));
    }, []);
    React.useEffect(() => {
      if (defaultValues) {
        reset(defaultValues);
      } else {
        reset({ nombre: '', abreviatura: '', categoria: null, ruc: '', active: 1 });
      }
    }, [defaultValues, reset]);
    const handleError = errors => {
      const messages = Object.values(errors)
        .slice(0, 4)
        .map(e => e.message);
      toast.error(messages);
    };
    const onSubmit = data => onSubmitFields(data, reset);
    return (
      <form onSubmit={handleSubmit(onSubmit, handleError)}>
        <div className="content">
          <div className="m-row">
            <label htmlFor="nombre">Nombre del cliente:</label>
            <Controller
              name="nombre"
              control={control}
              rules={{ required: 'Nombre requerido', maxLength: { value: 50, message: 'Máx 50 caracteres' } }}
              render={({ field }) => (
                <InputText {...field} autoComplete="off" className="p-inputtext p-component" />
              )}
            />
            {errors.nombre && <div className="error-message">{errors.nombre.message}</div>}
          </div>
          <div className="m-row">
            <label htmlFor="abreviatura">Abreviatura:</label>
            <Controller
              name="abreviatura"
              control={control}
              rules={{ required: 'Abreviatura requerida', maxLength: { value: 10, message: 'Máx 10 caracteres' } }}
              render={({ field }) => (
                <InputText {...field} autoComplete="off" className="p-inputtext p-component" />
              )}
            />
            {errors.abreviatura && <div className="error-message">{errors.abreviatura.message}</div>}
          </div>
          <div className="m-row">
            <label htmlFor="categoria">Categoría:</label>
            <Controller
              name="categoria"
              control={control}
              rules={{ required: 'Seleccione una categoría' }}
              render={({ field }) => (
                <Dropdown {...field} options={categorias} placeholder={loadingCategorias ? 'Cargando...' : 'Seleccione'} loading={loadingCategorias} style={{ minWidth: 160 }} />
              )}
            />
            {errors.categoria && <div className="error-message">{errors.categoria.message}</div>}
          </div>
          <div className="m-row">
            <label htmlFor="ruc">RUC:</label>
            <Controller
              name="ruc"
              control={control}
              rules={{ required: 'RUC requerido', maxLength: { value: 15, message: 'Máx 15 caracteres' } }}
              render={({ field }) => (
                <InputText {...field} autoComplete="off" className="p-inputtext p-component" />
              )}
            />
            {errors.ruc && <div className="error-message">{errors.ruc.message}</div>}
          </div>
          <div className="m-row">
            <label htmlFor="active">Estado:</label>
            <Controller
              name="active"
              control={control}
              rules={{ required: 'Seleccione estado' }}
              render={({ field }) => (
                <Dropdown {...field} options={estados.slice(1)} placeholder="Seleccione" style={{ minWidth: 160 }} />
              )}
            />
            {errors.active && <div className="error-message">{errors.active.message}</div>}
          </div>
        </div>
        <div className="buttons">
          <Button
            loading={isMutating}
            disabled={isMutating}
            className="button p-button p-component"
            loadingIcon="pi pi-spin pi-spinner"
            iconPos="right"
            type="submit"
            label="Guardar"
          />
        </div>
      </form>
    );
  }
  // Return principal restaurado con el listado y los modales
  return (
    <div className="clientes-listado">
      <div className="header-clientes">
        <h2>LISTADO DE CLIENTES</h2>
        <div className="acciones">
          <button
            className="add"
            onClick={() => setShowAdd(true)}
          >
            Agregar +
          </button>
        </div>
      </div>
      <div className="filtros-clientes">
        <div className="filtro-item" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText placeholder="Nombre cliente" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </span>
        </div>
        <div className="filtro-item" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ minWidth: 60 }}>Estado</label>
          <Dropdown value={state} options={estados} onChange={e => { setState(e.value); setPage(1); }} placeholder="Estado" style={{ minWidth: 160 }} />
        </div>
      </div>
      <div className="tabla-clientes">
        {isFetching ? (
          Array.from({ length: PAGE_SIZE }).map((_, i) => <Skeleton className="table" key={i} />)
        ) : (
          <table className="p-datatable table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Abreviatura</th>
                <th>Categoría</th>
                <th>RUC</th>
                <th>Estado</th>
                <th>Usuario creado</th>
                <th>Fecha creada</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {clientes.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center' }}>No hay resultados</td></tr>
              ) : (
                clientes.map(cli => (
                  <tr key={cli.id}>
                    <td>{cli.id}</td>
                    <td>{cli.nombre}</td>
                    <td>{cli.abreviatura}</td>
                    <td>{cli.categoria || '-'}</td>
                    <td>{cli.ruc}</td>
                    <td>{cli.active}</td>
                    <td>{cli.usuario_creado || '-'}</td>
                    <td>{cli.fecha_creada ? cli.fecha_creada : '-'}</td>
                    <td>
                      <div className="actions">
                        <Button
                          icon="pi pi-pencil"
                          className="p-button p-component p-button-icon-only"
                          style={{ background: 'transparent' }}
                          onClick={() => { setRowData(cli); setShowAdd(true); }}
                          aria-label="Editar"
                        />
                        <Button
                          icon="pi pi-map-marker"
                          className="p-button p-component p-button-icon-only"
                          style={{ background: 'transparent', marginLeft: 8 }}
                          onClick={() => { setRowData(cli); setShowSedes(true); }}
                          aria-label="Sedes"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
      <Dialog
        className="dialog clientes-dialog maintenance"
        draggable={false}
        visible={showAdd}
        modal
        onHide={() => { setShowAdd(false); setRowData(null); }}
        header={<span style={{ fontWeight: 600, fontSize: '1.2rem' }}>{rowData ? 'Editar cliente' : 'Agregar cliente'}</span>}
        closable={true}
      >
        <ClienteModalForm
          onClose={() => { setShowAdd(false); setRowData(null); }}
          onSubmitFields={onSubmitFields}
          isMutating={isMutating}
          defaultValues={rowData ? {
            nombre: rowData.nombre || '',
            abreviatura: rowData.abreviatura || '',
            categoria: rowData.categoria_id || null,
            ruc: rowData.ruc || '',
            active: rowData.active === 'inactivo' ? 0 : 1
          } : undefined}
        />
      </Dialog>
      {/* Modal de Sedes */}
      <SedesModal visible={showSedes} onHide={() => setShowSedes(false)} cliente={rowData} />
      <div className="paginate">
        <Paginator
          first={(page - 1) * PAGE_SIZE}
          rows={PAGE_SIZE}
          onPageChange={e => setPage(Math.floor(e.first / PAGE_SIZE) + 1)}
          totalRecords={totalRecords}
        />
      </div>
    </div>
  );
}


import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import FormAutoComplete from 'components/FormControls/FormAutoComplete';
import SedesClienteService from 'services/SedesCliente';
import RolesService from 'services/Roles';
import { Button } from 'primereact/button';

const estados = [
  { label: 'Activo', value: 'activo' },
  { label: 'Inactivo', value: 'inactivo' }
];

function AsignacionSedeForm({ defaultValues, onSubmitFields, toast, isMutating, usuario }) {
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: defaultValues || {
      sede_cliente: null,
      rol: null,
      state: 'activo',
    }
  });

  useEffect(() => {
    if (defaultValues) {
      // Preparar sede_cliente para el autocomplete
      let sedeCliente = defaultValues.sede_cliente;
      if (typeof sedeCliente === 'number' && defaultValues.sede_cliente_name) {
        sedeCliente = {
          id: defaultValues.sede_cliente,
          nombre: defaultValues.sede_cliente_name,
          description: defaultValues.sede_cliente_name
        };
      }
      reset({
        sede_cliente: sedeCliente,
        rol: defaultValues.rol,
        state: defaultValues.state || 'activo'
      });
    } else {
      reset({
        sede_cliente: null,
        rol: null,
        state: 'activo'
      });
    }
  }, [defaultValues, reset]);

  useEffect(() => {
    setLoadingRoles(true);
    RolesService.get({ page: 1, page_size: 100 })
      .then(res => {
        const rolesData = res.result?.results || res.results || [];
        setRoles(rolesData.map(r => ({ 
          label: r.description || r.nombre || r.label, 
          value: r.id 
        })));
      })
      .catch(() => setRoles([]))
      .finally(() => setLoadingRoles(false));
  }, []);

  const handleError = formErrors => {
    const messages = Object.values(formErrors)
      .slice(0, 4)
      .map(e => e.message);
    if (toast) toast.error(messages);
  };

  const onSubmit = data => {
    // Si sede_cliente es un objeto, extrae el id
    const payload = { ...data };
    if (payload.sede_cliente && typeof payload.sede_cliente === 'object' && 'id' in payload.sede_cliente) {
      payload.sede_cliente = payload.sede_cliente.id;
    }
    onSubmitFields(payload, reset);
  };

  const clienteNombre = usuario?.cliente?.nombre || usuario?.cliente?.description || '-';
  const clienteId = usuario?.cliente?.id || usuario?.cliente?.value || null;

  return (
    <form onSubmit={handleSubmit(onSubmit, handleError)}>
      <div className="content" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="m-row">
          <label htmlFor="cliente">Cliente:</label>
          <InputText 
            value={clienteNombre}
            disabled 
            className="p-inputtext p-component" 
            style={{ backgroundColor: '#f5f5f5' }}
          />
        </div>

        <div className="m-row">
          <label htmlFor="sede_cliente">Sede:</label>
          <FormAutoComplete
            name="sede_cliente"
            control={control}
            rules={{ required: 'Sede requerida' }}
            placeholder="Buscar sede del cliente"
            request={async (search) => {
              if (!clienteId) return [];
              if (typeof search !== 'string' || search.length < 2) {
                // Si no hay búsqueda, traer todas las sedes del cliente
                const res = await SedesClienteService.get({ id_client: clienteId, page: 1, page_size: 50 });
                // Transformar resultados para agregar campo description
                return (res.results || []).map(s => ({
                  ...s,
                  description: s.nombre || s.description
                }));
              }
              const res = await SedesClienteService.get({ id_client: clienteId, page: 1, page_size: 50 });
              const results = res.results || [];
              // Filtrar localmente por el nombre de la sede y agregar description
              return results
                .filter(s => s.nombre && s.nombre.toLowerCase().includes(search.toLowerCase()))
                .map(s => ({
                  ...s,
                  description: s.nombre || s.description
                }));
            }}
            minLength={0}
            style={{ minWidth: 160 }}
          />
          {errors.sede_cliente && <div className="error-message">{errors.sede_cliente.message}</div>}
        </div>

        <div className="m-row">
          <label htmlFor="rol">Rol:</label>
          <Controller
            name="rol"
            control={control}
            rules={{ required: 'Seleccione un rol' }}
            render={({ field }) => (
              <Dropdown 
                {...field} 
                options={roles} 
                placeholder={loadingRoles ? 'Cargando...' : 'Seleccione'} 
                loading={loadingRoles}
                style={{ minWidth: 160 }} 
              />
            )}
          />
          {errors.rol && <div className="error-message">{errors.rol.message}</div>}
        </div>

        <div className="m-row">
          <label htmlFor="state">Estado:</label>
          <Controller
            name="state"
            control={control}
            rules={{ required: 'Seleccione estado' }}
            render={({ field }) => (
              <Dropdown {...field} options={estados} placeholder="Seleccione" style={{ minWidth: 160 }} />
            )}
          />
          {errors.state && <div className="error-message">{errors.state.message}</div>}
        </div>
      </div>

      <div className="buttons" style={{ marginTop: 24 }}>
        <Button
          aria-label="Guardar"
          label="Guardar"
          loading={isMutating}
          disabled={isMutating}
          className="button p-button p-component"
          loadingIcon="pi pi-spin pi-spinner"
          iconPos="right"
          type="submit"
        />
      </div>
    </form>
  );
}

export default AsignacionSedeForm;

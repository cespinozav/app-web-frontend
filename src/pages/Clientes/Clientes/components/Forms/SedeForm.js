import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import FormAutoComplete from 'components/FormControls/FormAutoComplete';
import CiudadClienteService from 'services/CiudadCliente';
import { Button } from 'primereact/button';

const estados = [
  { label: 'Activo', value: 'activo' },
  { label: 'Inactivo', value: 'inactivo' }
];

function SedeForm({ defaultValues, onSubmitFields, toast, isMutating }) {
  // Adaptar el valor inicial de ciudad para el autocomplete
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: defaultValues
      ? {
          ...defaultValues,
          id_country:
            typeof defaultValues.id_country === 'number' && defaultValues.name_country
              ? { id: defaultValues.id_country, description: defaultValues.name_country, nombre: defaultValues.name_country }
              : defaultValues.id_country || null
        }
      : {
          nombre: '',
          adress: '',
          id_country: null,
          lat: '',
          long: '',
          state: 'activo',
        }
  });
  const handleError = formErrors => {
    const messages = Object.values(formErrors)
      .slice(0, 4)
      .map(e => e.message);
    if (toast) toast.error(messages);
  };
  const onSubmit = data => {
    // Si id_country es un objeto, extrae el id
    const payload = { ...data };
    if (payload.id_country && typeof payload.id_country === 'object' && 'id' in payload.id_country) {
      payload.id_country = payload.id_country.id;
    }
    onSubmitFields(payload, reset);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit, handleError)}>
      <div className="content sede-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      <div>
        <div className="m-row">
          <label htmlFor="nombre">Nombre de la sede:</label>
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
          <label htmlFor="id_country">Ciudad:</label>
          <FormAutoComplete
            name="id_country"
            control={control}
            rules={{ required: 'Ciudad requerida' }}
            placeholder="Buscar ciudad"
            request={async (search) => {
              if (typeof search !== 'string' || search.length < 2) return [];
              const res = await CiudadClienteService.get({ search, page_size: 10 });
              return res.results;
            }}
            minLength={2}
            style={{ minWidth: 160 }}
          />
          {errors.id_country && <div className="error-message">{errors.id_country.message}</div>}
        </div>
        <div className="m-row">
          <label htmlFor="lat">Latitud:</label>
          <Controller
          name="lat"
          control={control}
          rules={{ required: 'Latitud requerida' }}
          render={({ field }) => (
            <InputText {...field} autoComplete="off" className="p-inputtext p-component" />
          )}
          />
          {errors.lat && <div className="error-message">{errors.lat.message}</div>}
        </div>
      </div>
      <div>
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
        <div className="m-row">
          <label htmlFor="adress">Dirección:</label>
          <Controller
          name="adress"
          control={control}
          rules={{ required: 'Dirección requerida', maxLength: { value: 100, message: 'Máx 100 caracteres' } }}
          render={({ field }) => (
            <InputText {...field} autoComplete="off" className="p-inputtext p-component" />
          )}
          />
          {errors.adress && <div className="error-message">{errors.adress.message}</div>}
        </div>
        <div className="m-row">
          <label htmlFor="long">Longitud:</label>
          <Controller
          name="long"
          control={control}
          rules={{ required: 'Longitud requerida' }}
          render={({ field }) => (
            <InputText {...field} autoComplete="off" className="p-inputtext p-component" />
          )}
          />
          {errors.long && <div className="error-message">{errors.long.message}</div>}
        </div>
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
export default SedeForm;

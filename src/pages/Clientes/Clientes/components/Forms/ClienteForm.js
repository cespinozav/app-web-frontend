import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

const estados = [
  { label: 'Activo', value: 1 },
  { label: 'Inactivo', value: 0 }
];

export default function ClienteForm({ onSubmitFields, isMutating, defaultValues, toast }) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: defaultValues || { nombre: '', abreviatura: '', ruc: '', active: 1 }
  });
  React.useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    } else {
      reset({ nombre: '', abreviatura: '', ruc: '', active: 1 });
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
              <Dropdown {...field} options={estados} placeholder="Seleccione" style={{ minWidth: 160 }} />
            )}
          />
          {errors.active && <div className="error-message">{errors.active.message}</div>}
        </div>
      </div>
      <div className="buttons">
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

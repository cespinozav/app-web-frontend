import React from 'react';
import CountryService from 'services/Country';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

const estados = [
  { label: 'Activo', value: 'activo' },
  { label: 'Inactivo', value: 'inactivo' }
];

function SedeForm({ defaultValues, onSubmitFields, toast, isMutating }) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: defaultValues || {
      nombre: '',
      adress: '',
      id_country: '',
      lat: '',
      long: '',
      state: 'activo',
    }
  });
  const [countries, setCountries] = React.useState([]);
  const [loadingCountries, setLoadingCountries] = React.useState(false);
  React.useEffect(() => {
    setLoadingCountries(true);
    CountryService.get().then(res => {
      setCountries(res.results.map(c => ({ label: c.nombre, value: c.id })));
    }).finally(() => setLoadingCountries(false));
  }, []);
  React.useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    } else {
      reset({ nombre: '', adress: '', id_country: '', lat: '', long: '', state: 'activo' });
    }
  }, [defaultValues, reset]);
  const handleError = errors => {
    const messages = Object.values(errors)
      .slice(0, 4)
      .map(e => e.message);
    toast && toast.error(messages);
  };
  const onSubmit = data => onSubmitFields(data, reset);
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
                <Controller
                name="id_country"
                control={control}
                rules={{ required: 'Ciudad requerida' }}
                render={({ field }) => (
                    <Dropdown {...field} options={countries} loading={loadingCountries} placeholder="Seleccione ciudad" style={{ minWidth: 160 }} />
                )}
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

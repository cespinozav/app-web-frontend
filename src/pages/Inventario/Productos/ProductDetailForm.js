import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import UnitService from 'services/Unit';

export default function ProductDetailForm({ onSubmitFields, isMutating, defaultValues, productId }) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: defaultValues || { price: '', unit: '', state: 1 }
  });
  const [units, setUnits] = useState([]);
  const [unitsLoading, setUnitsLoading] = useState(false);

  useEffect(() => {
    setUnitsLoading(true);
    UnitService.get({ page: 1, page_size: 100 })
      .then(res => {
        setUnits(
          Array.isArray(res.results)
            ? res.results.map(u => ({
                label: u.reference ? `${u.description} (${u.reference})` : u.description,
                value: u.id
              }))
            : []
        );
      })
      .finally(() => setUnitsLoading(false));
  }, []);

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    } else {
      reset({ price: '', unit: '', state: 1 });
    }
  }, [defaultValues, reset]);

  const onSubmit = data => {
    onSubmitFields({ ...data, product: productId }, reset);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="content">
        <div className="m-row">
          <label htmlFor="unit">Unidad:</label>
          <Controller
            name="unit"
            control={control}
            rules={{ required: 'Unidad requerida' }}
            render={({ field }) => (
              <Dropdown
                {...field}
                options={units}
                placeholder="Seleccione unidad"
                style={{ minWidth: 160 }}
                disabled={unitsLoading}
              />
            )}
          />
          {errors.unit && <div className="error-message">{errors.unit.message}</div>}
        </div>
        <div className="m-row">
          <label htmlFor="price">Precio:</label>
          <Controller
            name="price"
            control={control}
            rules={{ required: 'Precio requerido', pattern: { value: /^\d+(\.\d{1,2})?$/, message: 'Formato: 0.00' } }}
            render={({ field }) => (
              <InputText {...field} autoComplete="off" className="p-inputtext p-component" placeholder="0.00" />
            )}
          />
          {errors.price && <div className="error-message">{errors.price.message}</div>}
        </div>
        {/* Campo estado eliminado por requerimiento */}
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
        {/* Botón Cancelar eliminado por requerimiento */}
      </div>
    </form>
  );
}

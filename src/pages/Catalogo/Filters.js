import React, { useEffect, useState } from 'react';
import CategoriaService from 'services/Categoria';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';

const CURRENCY_CODE = 'PEN';

export default function CatalogoFilters({ categoria, setCategoria, precioMin, setPrecioMin, precioMax, setPrecioMax }) {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    CategoriaService.get({ page_size: 100 }).then(res => {
      setCategorias([
        { label: 'Todas', value: '' },
        ...res.results.map(c => ({ label: c.nombre || c.description || c.label, value: c.id }))
      ]);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="catalogo-filters">
      <div className="filter-item">
        <label htmlFor="catalogo-categoria">Categoría</label>
        <Dropdown inputId="catalogo-categoria" value={categoria} options={categorias} onChange={e => setCategoria(e.value)} placeholder="Todas" loading={loading} />
      </div>
      <div className="filter-item">
        <label htmlFor="catalogo-precio-min">Precio mínimo</label>
        <InputNumber inputId="catalogo-precio-min" value={precioMin} onValueChange={e => setPrecioMin(e.value)} mode="currency" currency={CURRENCY_CODE} min={0} max={precioMax || undefined} locale="es-PE" />
      </div>
      <div className="filter-item">
        <label htmlFor="catalogo-precio-max">Precio máximo</label>
        <InputNumber inputId="catalogo-precio-max" value={precioMax} onValueChange={e => setPrecioMax(e.value)} mode="currency" currency={CURRENCY_CODE} min={precioMin || 0} locale="es-PE" />
      </div>
    </div>
  );
}

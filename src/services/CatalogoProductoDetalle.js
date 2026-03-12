import { makeRequest } from 'utils/api';
import { getBearer } from 'utils/auth';

const ENDPOINT = '/catalogo-producto-detalle';

const CatalogoProductoDetalleService = {
  get: ({ productId }) =>
    makeRequest(`${ENDPOINT}/`, {
      params: { product_id: productId },
      headers: localStorage.getItem('accessToken') ? { Authorization: getBearer() } : undefined
    })
      .then(res => res.json())
      .then(res => {
        if (res && res.status && res.result && Array.isArray(res.result.results)) {
          const producto = res.result.results[0];
          const imagenes = res.result.imagenes || {};
          const imagenesArray = Object.values(imagenes);
          const unidades = Array.isArray(res.result.unidades) ? res.result.unidades : [];
          return {
            ...producto,
            imagenes: imagenesArray,
            unidades,
            unidad: unidades[0] || {}, // unidad seleccionada por defecto
          };
        }
        return null;
      }),
};

export default CatalogoProductoDetalleService;

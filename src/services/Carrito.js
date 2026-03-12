import { makeRequest } from 'utils/api';
import { getBearer } from 'utils/auth';

const ENDPOINT = '/carrito-productos';

const CarritoService = {
  get: ({ page = 1, pageSize = 100 } = {}) =>
    makeRequest(`${ENDPOINT}`, {
      params: { page, page_size: pageSize },
      headers: localStorage.getItem('accessToken') ? { Authorization: getBearer() } : undefined
    })
      .then(res => res.json())
      .then(res => {
        let results = [];
        if (Array.isArray(res)) {
          results = res;
        } else if (Array.isArray(res.result)) {
          results = res.result;
        }
        return {
          results: results.map(item => ({
            id: item.id_carrito_producto,
            id_carrito_producto: item.id_carrito_producto,
            productDetailId: item.producto?.id,
            nombre: item.producto?.nombre,
            categoria: item.producto?.categoria,
            estado: item.producto?.estado,
            cantidad: item.cantidad,
            precio: item.producto?.precio,
            estadoRegistro: item.estado,
            unidad: item.producto?.unidad,
            referencia: item.producto?.referencia,
            imagen: item.producto?.imagen || (item.producto && item.producto.image) || ''
          })),
          count: results.length
        }
      }),
  create: (body) => makeRequest(`${ENDPOINT}/create`, {
    method: 'POST',
    body,
    headers: localStorage.getItem('accessToken') ? { Authorization: getBearer() } : undefined
  }),
  put: (pk, cantidad, producto) => {
    const token = localStorage.getItem('accessToken');
    return makeRequest(`${ENDPOINT}/${pk}/`, {
      method: 'PUT',
      body: { cantidad, producto },
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });
  },
  delete: (id) => {
    const token = localStorage.getItem('accessToken');
    return makeRequest(`${ENDPOINT}/delete/${id}/`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });
  },
};

export default CarritoService;

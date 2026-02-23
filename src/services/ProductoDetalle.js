import { makeRequest } from 'utils/api';
import { getBearer } from 'utils/auth';

const ENDPOINT = '/producto-detalle';

const ProductoDetalleService = {
  get: ({ productId }) =>
    makeRequest(`${ENDPOINT}/`, {
      params: { product_id: productId },
      headers: localStorage.getItem('accessToken') ? { Authorization: getBearer() } : undefined
    })
      .then(res => res.json())
      .then(res => {
        if (res && res.result && Array.isArray(res.result.results)) {
          return res.result.results;
        }
        return [];
      }),

  post: ({ product, price, unit, state }) =>
    makeRequest(`${ENDPOINT}/create/`, {
      method: 'POST',
      body: { product, price, unit, state },
      headers: localStorage.getItem('accessToken') ? { Authorization: getBearer() } : undefined
    }),

  put: ({ idProductDetail, product, price, unit, state }) =>
    makeRequest(`${ENDPOINT}/${idProductDetail}/`, {
      method: 'PUT',
      body: { product, price, unit, state },
      headers: localStorage.getItem('accessToken') ? { Authorization: getBearer() } : undefined
    }),
};

export default ProductoDetalleService;

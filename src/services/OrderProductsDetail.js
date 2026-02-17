import { makeRequest } from 'utils/api';

const OrderProductsDetailService = {
  getProductsDetail: async (ordenes = []) => {
    return makeRequest('/ordenes/productos-detalle', {
      method: 'POST',
      body: { ordenes },
      headers: localStorage.getItem('accessToken') ? { Authorization: require('utils/auth').getBearer() } : undefined
    }).then(res => res.json());
  }
};

export default OrderProductsDetailService;

import { makeRequest } from 'utils/api'

const ENDPOINT = '/ordenes/productos-resumen/'

const OrdersSummaryService = {
  getProductsSummary: async ({ codigos_orden, state }) => {
    return makeRequest(ENDPOINT, {
      method: 'POST',
      body: { codigos_orden, state },
      headers: localStorage.getItem('accessToken') ? { Authorization: require('utils/auth').getBearer() } : undefined
    }).then(res => res.json())
  }
}

export default OrdersSummaryService

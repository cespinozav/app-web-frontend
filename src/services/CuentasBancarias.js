import { makeRequest } from '../utils/api'
import { getBearer } from '../utils/auth'

const ENDPOINT = '/cuentas-bancarias'

const CuentasBancariasService = {
  get: ({ page = 1, page_size = 100, search = '' } = {}) =>
    makeRequest(`${ENDPOINT}`, {
      params: { page, page_size, search },
      headers: localStorage.getItem('accessToken') ? { Authorization: getBearer() } : undefined
    })
      .then(res => res.json())
      .then(res => {
        if (res && res.result && Array.isArray(res.result.results)) {
          return res.result.results
        }
        return []
      }),
  post: ({ alias, entidad_bancaria, tipo_cuenta, moneda, cc, cci }) =>
    makeRequest(`${ENDPOINT}/create`, {
      method: 'POST',
      body: { alias, entidad_bancaria, tipo_cuenta, moneda, cc, cci },
      headers: localStorage.getItem('accessToken') ? { Authorization: getBearer() } : undefined
    }),
}

export default CuentasBancariasService

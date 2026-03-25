import { makeRequest } from '../utils/api'
import { getBearer } from '../utils/auth'

const ENDPOINT = '/tipos-cuenta-bancaria'

const TiposCuentaBancariaService = {
  get: ({ page = 1, page_size = 100, search = '' } = {}) =>
    makeRequest(`${ENDPOINT}`, {
      params: { page, page_size, search },
      headers: localStorage.getItem('accessToken') ? { Authorization: getBearer() } : undefined
    })
      .then(res => res.json()),
}

export default TiposCuentaBancariaService

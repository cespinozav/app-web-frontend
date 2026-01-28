import { makeRequest } from 'utils/api'

const ENDPOINT = '/categorias-cliente'

const CategoriaClienteService = {
  get: ({ page = 1, page_size = 10 } = {}) =>
    makeRequest(`${ENDPOINT}?page=${page}&page_size=${page_size}`, {
      headers: localStorage.getItem('accessToken') ? { Authorization: require('utils/auth').getBearer() } : undefined
    })
      .then(res => res.json())
      .then(res => {
        const result = res.result || {};
        return {
          results: Array.isArray(result.results) ? result.results : [],
          count: typeof result.count === 'number' ? result.count : 0
        };
      }),
  post: ({ description, user_created }) =>
    makeRequest(`${ENDPOINT}/create`, {
      method: 'POST',
      body: { description, user_created },
      headers: localStorage.getItem('accessToken') ? { Authorization: require('utils/auth').getBearer() } : undefined
    }),
  put: ({ id, description }) => makeRequest(`${ENDPOINT}/${id}`, { method: 'PUT', body: { description } }),
  delete: ({ id }) => makeRequest(`${ENDPOINT}/${id}/delete`, {
    method: 'DELETE',
    headers: localStorage.getItem('accessToken') ? { Authorization: require('utils/auth').getBearer() } : undefined
  })
}

export default CategoriaClienteService

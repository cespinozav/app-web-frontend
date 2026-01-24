import { makeRequest } from 'utils/api'

const ENDPOINT = '/categorias'

const CategoriaService = {
  get: () => makeRequest(ENDPOINT, {
    headers: localStorage.getItem('accessToken') ? { Authorization: require('utils/auth').getBearer() } : undefined
  })
    .then(res => res.json())
    .then(res => {
      // Si la respuesta es paginada (Django Rest Framework)
      if (Array.isArray(res.result)) return res.result
      if (Array.isArray(res.results)) return res.results
      if (Array.isArray(res.result?.results)) return res.result.results
      // Si la respuesta es un solo objeto
      if (res.result && typeof res.result === 'object') return [res.result]
      return []
    }),
  post: ({ description, user_created }) =>
    makeRequest(`${ENDPOINT}/create`, {
      method: 'POST',
      body: { description, user_created },
      headers: localStorage.getItem('accessToken') ? { Authorization: require('utils/auth').getBearer() } : undefined
    }),
  put: ({ id, description }) => makeRequest(`${ENDPOINT}/${id}`, { method: 'PUT', body: { description } }),
  delete: ({ id }) => makeRequest(`${ENDPOINT}/${id}/delete`, { method: 'DELETE' })
}

export default CategoriaService

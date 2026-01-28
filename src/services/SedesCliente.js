import { makeRequest } from 'utils/api'

const ENDPOINT = '/sedes_cliente'

const SedesClienteService = {
  get: ({ id_client, page = 1, page_size = 10 } = {}) =>
    makeRequest(`${ENDPOINT}/?id_client=${id_client}&page=${page}&page_size=${page_size}`, {
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
  create: (data) =>
    makeRequest(`${ENDPOINT}/create`, {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('accessToken') ? { Authorization: require('utils/auth').getBearer() } : {})
      }
    })
      .then(res => res.json()),
  update: (id, data) =>
    makeRequest(`${ENDPOINT}/${id}`, {
      method: 'PUT',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('accessToken') ? { Authorization: require('utils/auth').getBearer() } : {})
      }
    })
      .then(res => res.json()),
}

export default SedesClienteService

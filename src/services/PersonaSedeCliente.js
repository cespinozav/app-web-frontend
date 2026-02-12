/* eslint-disable camelcase, global-require */
import { makeRequest } from 'utils/api'

const ENDPOINT = '/personas-sede-cliente'

const PersonaSedeClienteService = {
  get: ({ person, page = 1, page_size = 10 } = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: page_size.toString()
    });
    
    if (person) {
      params.append('person', person);
    }
    
    return makeRequest(`${ENDPOINT}/?${params.toString()}`, {
      headers: localStorage.getItem('accessToken') ? { Authorization: require('utils/auth').getBearer() } : undefined
    })
      .then(res => res.json())
      .then(res => {
        // El endpoint devuelve los datos dentro de result
        const result = res.result || res;
        return {
          results: Array.isArray(result.results) ? result.results : [],
          count: typeof result.count === 'number' ? result.count : 0,
          next: result.next || null,
          previous: result.previous || null
        };
      });
  },
  create: (data) =>
    makeRequest(`${ENDPOINT}/create/`, {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('accessToken') ? { Authorization: require('utils/auth').getBearer() } : {})
      }
    })
      .then(res => res.json()),
  update: (id, data) =>
    makeRequest(`${ENDPOINT}/${id}/`, {
      method: 'PUT',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('accessToken') ? { Authorization: require('utils/auth').getBearer() } : {})
      }
    })
      .then(res => res.json()),
  delete: (id) =>
    makeRequest(`${ENDPOINT}/${id}/`, {
      method: 'DELETE',
      headers: localStorage.getItem('accessToken') ? { Authorization: require('utils/auth').getBearer() } : undefined
    })
      .then(res => res.json())
}

export default PersonaSedeClienteService

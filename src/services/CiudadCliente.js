import { makeRequest } from 'utils/api'

const ENDPOINT = '/countries'

const CiudadClienteService = {
  get: ({ page = 1, page_size = 10, search = '' } = {}) => {
    const cleanPage = typeof page === 'string' ? page.replace(/\/+$/, '') : page;
    const cleanPageSize = typeof page_size === 'string' ? page_size.replace(/\/+$/, '') : page_size;
    const cleanSearch = typeof search === 'string' ? search.replace(/\/+$/, '') : search;
    let url = `${ENDPOINT}?page=${cleanPage}&page_size=${cleanPageSize}`;
    if (cleanSearch) url += `&search=${encodeURIComponent(cleanSearch)}`;
    return makeRequest(url, {
      headers: localStorage.getItem('accessToken') ? { Authorization: require('utils/auth').getBearer() } : undefined
    })
      .then(res => res.json())
      .then(res => {
        const result = res.result || {};
        return {
          results: Array.isArray(result.results)
            ? result.results.map(item => ({
                id: item.id,
                description: item.description ?? item.nombre ?? '',
                user_created: item.user_created || '',
                date_created: item.date_created || '',
                ...item
              }))
            : [],
          count: typeof result.count === 'number' ? result.count : 0
        };
      });
  },
  post: ({ description }) =>
    makeRequest(`${ENDPOINT}/create`, {
      method: 'POST',
      body: { nombre: description },
      headers: localStorage.getItem('accessToken') ? { Authorization: require('utils/auth').getBearer() } : undefined
    }),
  put: ({ id, description }) => makeRequest(`${ENDPOINT}/${id}`, { method: 'PUT', body: { nombre: description } }),
  delete: ({ id }) => makeRequest(`${ENDPOINT}/${id}/delete`, {
    method: 'DELETE',
    headers: localStorage.getItem('accessToken') ? { Authorization: require('utils/auth').getBearer() } : undefined
  })
}

export default CiudadClienteService

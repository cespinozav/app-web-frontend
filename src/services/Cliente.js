/* eslint-disable camelcase, global-require */
import { makeRequest } from 'utils/api'

const ENDPOINT = '/clientes'

const ClienteService = {
  get: ({ page = 1, page_size = 10, search = '', state = '' } = {}) =>
    makeRequest(`${ENDPOINT}`, {
      params: { page, page_size, search, state },
      headers: localStorage.getItem('accessToken') ? { Authorization: require('utils/auth').getBearer() } : undefined
    })
      .then(res => res.json())
      .then(res => {
        const result = res.result || {};
        const results = Array.isArray(result.results)
          ? result.results.map(cli => ({
              id: cli.id,
              nombre: cli.nombre,
              abreviatura: cli.abrev,
              ruc: cli.cod_ruc,
              categoria: cli.categoria, // nombre de la categoría
              categoria_id: cli.categoria_id, // id de la categoría
              active: cli.state, // ahora es 'state' ("activo"/"inactivo")
              usuario_creado: cli.user_created,
              fecha_creada: cli.date_created
            }))
          : [];
        return {
          results,
          count: typeof result.count === 'number' ? result.count : 0
        };
      }),
  post: ({ nombre, abrev, cod_ruc, categoria, state, user_created }) =>
    makeRequest(`${ENDPOINT}/create`, {
      method: 'POST',
      body: { nombre, abrev, cod_ruc, categoria, state, user_created },
      headers: localStorage.getItem('accessToken') ? { Authorization: require('utils/auth').getBearer() } : undefined
    }),
  put: ({ id, nombre, abrev, cod_ruc, categoria, state, user_created }) =>
    makeRequest(`${ENDPOINT}/${id}`, {
      method: 'PUT',
      body: { nombre, abrev, cod_ruc, categoria, state, user_created },
      headers: localStorage.getItem('accessToken') ? { Authorization: require('utils/auth').getBearer() } : undefined
    })
}

export default ClienteService

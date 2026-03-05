/* eslint-disable camelcase, global-require, prefer-destructuring */
import { makeRequest } from 'utils/api'
import { getBearer } from 'utils/auth'

const ENDPOINT = '/productos'

const ProductoService = {
    getProductoDetalle: async (id) => {
      // Obtener producto base
      const producto = await makeRequest(`${ENDPOINT}/${id}`, {
        headers: localStorage.getItem('accessToken') ? { Authorization: getBearer() } : undefined
      }).then(res => res.json());
      // Obtener unidades desde ProductoDetalleService
      let unidades = [];
      try {
        const mod = await import('./ProductoDetalle');
        if (mod && mod.default && typeof mod.default.get === 'function') {
          unidades = await mod.default.get({ productId: id });
        }
      } catch (e) {
        // Si falla, dejar unidades vacío
      }
      return { producto, unidades };
    },
  get: ({ page = 1, page_size = 10, search = '', cat = '', state = '' } = {}) =>
    makeRequest(`${ENDPOINT}`, {
      params: { page, page_size, search, cat, state },
      headers: localStorage.getItem('accessToken') ? { Authorization: require('utils/auth').getBearer() } : undefined
    })
      .then(res => res.json())
      .then(res => {
        const result = res.result || {}
        // Mapear productos para asegurar categoria_nombre
        const results = Array.isArray(result.results)
          ? result.results.map(prod => {
              // Adaptar category_name
              let category_name = prod.category_name
              if (!category_name) {
                if (prod.categoria && typeof prod.categoria === 'object') {
                  category_name = prod.categoria.nombre || prod.categoria.label || '-'
                } else if (prod.categoria_nombre) {
                  category_name = prod.categoria_nombre
                } else {
                  category_name = '-'
                }
              }
                return {
                  ...prod,
                  category_name
                }
            })
          : []
        return {
          results,
          count: typeof result.count === 'number' ? result.count : 0
        }
      }),
  post: ({ nombre, categoria_id, state }) =>
    makeRequest(`${ENDPOINT}/create`, {
      method: 'POST',
      body: { nombre, categoria_id, state },
      headers: localStorage.getItem('accessToken') ? { Authorization: getBearer() } : undefined
    }),

  put: ({ id, nombre, categoria_id, state }) =>
    makeRequest(`${ENDPOINT}/${id}`, {
      method: 'PATCH',
      body: { nombre, categoria_id, state },
      headers: localStorage.getItem('accessToken') ? { Authorization: getBearer() } : undefined
    })
}

export default ProductoService

/* eslint-disable camelcase, global-require, prefer-destructuring */
import { makeRequest } from 'utils/api'

const ENDPOINT = '/productos'

const ProductoService = {
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
              // Adaptar unidad para mostrar descripción y referencia
              let unit_id = ''
              let unit_description = ''
              let unit_reference = ''
              if (prod.unit && typeof prod.unit === 'object') {
                unit_id = prod.unit.id
                unit_description = prod.unit.description
                unit_reference = prod.unit.reference
              }
              return {
                ...prod,
                category_name,
                unit_id,
                unit_description,
                unit_reference
              }
            })
          : []
        return {
          results,
          count: typeof result.count === 'number' ? result.count : 0
        }
      }),
  post: ({ nombre, cat, price, unit_id, state }) =>
    makeRequest(`${ENDPOINT}/create`, {
      method: 'POST',
      body: { nombre, cat, price, unit_id, state },
      headers: localStorage.getItem('accessToken') ? { Authorization: require('utils/auth').getBearer() } : undefined
    }),

  put: ({ id, nombre, cat, price, unit_id, state }) =>
    makeRequest(`${ENDPOINT}/${id}`, {
      method: 'PUT',
      body: { nombre, cat, price, unit_id, state },
      headers: localStorage.getItem('accessToken') ? { Authorization: require('utils/auth').getBearer() } : undefined
    })
}

export default ProductoService

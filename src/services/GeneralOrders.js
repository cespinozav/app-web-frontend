/* eslint-disable camelcase, global-require */
import { API, makeRequest } from 'utils/api'
import { getBearer } from 'utils/auth'

const ENDPOINT = '/ordenes-generales'

const parseResponse = response => {
  const result = response?.result || response || {}
  let source = []
  if (Array.isArray(result.results)) {
    source = result.results
  } else if (Array.isArray(result)) {
    source = result
  }

  const getOrderDetails = order => {
    if (Array.isArray(order.detalles_info)) {
      return order.detalles_info
    }
    if (Array.isArray(order.detalles)) {
      return order.detalles
    }
    return []
  }

  return {
    results: source.map(order => ({
      id: order.id,
      code: order.cod_orden || order.code || '-',
      date: order.fecha_orden || order.fecha || order.date || order.date_created || order.created_at || null,
      client:
        order.sede_info?.cliente_nombre ||
        order.sede_info?.name_client ||
        order.client_name ||
        order.cliente_nombre ||
        order.cliente?.nombre ||
        order.cliente ||
        '-',
      site: order.sede_info?.nombre || order.site_name || order.sede_nombre || order.sede?.nombre || order.sede || '-',
      site_address:
        order.sede_info?.adress || order.sede_info?.address || order.sede_adress || order.sede_address || '-',
      site_lat: order.sede_info?.lat || order.sede?.lat || '',
      site_long: order.sede_info?.long || order.sede?.long || '',
      subtotal: Number(order.subtotal ?? 0),
      discount: Number(order.descuento ?? order.discount ?? 0),
      total: Number(order.total ?? order.total_amount ?? order.monto_total ?? 0),
      payment_method:
        order.payment_method ||
        order.metodo_pago ||
        order.metodo_pago_info?.nombre ||
        order.metodo_pago_info?.description ||
        '-',
      details: getOrderDetails(order),
      state: String(order.state || order.estado || '-').toLowerCase(),
      raw: order
    })),
    count: typeof result.count === 'number' ? result.count : source.length
  }
}

const GeneralOrdersService = {
  get: ({ page = 1, page_size = 10, search = '', state = '', date_ini = '', date_fin = '' } = {}) =>
    makeRequest(`${ENDPOINT}`, {
      params: { page, page_size, search, state, date_ini, date_fin },
      headers: localStorage.getItem('accessToken') ? { Authorization: require('utils/auth').getBearer() } : undefined
    })
      .then(res => res.json())
      .then(parseResponse),

  exportExcel: async ({ search = '', state = '', date_ini = '', date_fin = '' } = {}) => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (state) params.set('state', state)
    if (date_ini) params.set('date_ini', date_ini)
    if (date_fin) params.set('date_fin', date_fin)

    const queryString = params.toString()
    const url = `${API}/ordenes-generales/reporte-excel/${queryString ? `?${queryString}` : ''}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: getBearer()
      }
    })

    if (!response.ok) {
      let message = 'No se pudo exportar el reporte de órdenes'
      try {
        const errorData = await response.json()
        message = errorData?.message || errorData?.detail || message
      } catch (_e) {
        // mantener mensaje por defecto si no hay json
      }
      throw new Error(message)
    }

    return response.blob()
  },

  getAllByFilters: async ({ search = '', state = '', date_ini = '', date_fin = '' } = {}) => {
    const pageSize = 100
    const fetchPage = async (page = 1, accumulated = []) => {
      const response = await makeRequest(`${ENDPOINT}`, {
        params: {
          page,
          page_size: pageSize,
          search,
          state,
          date_ini,
          date_fin
        },
        headers: localStorage.getItem('accessToken') ? { Authorization: require('utils/auth').getBearer() } : undefined
      })
      const parsed = parseResponse(await response.json())
      const batch = parsed?.results || []
      const totalCount = parsed?.count || 0
      const nextAccumulated = accumulated.concat(batch)

      if (batch.length === 0) {
        return nextAccumulated
      }

      if (nextAccumulated.length >= totalCount) {
        return nextAccumulated
      }

      return fetchPage(page + 1, nextAccumulated)
    }

    return fetchPage()
  },

  bulkChangeStatus: ({ ordenes = [], estado } = {}) =>
    makeRequest('/ordenes-generales/cambio-estado-masivo', {
      method: 'POST',
      body: { ordenes, estado },
      headers: localStorage.getItem('accessToken') ? { Authorization: require('utils/auth').getBearer() } : undefined
    }).then(res => res.json()),

  create: payload =>
    makeRequest('/ordenes/create', {
      method: 'POST',
      body: payload,
      headers: localStorage.getItem('accessToken') ? { Authorization: require('utils/auth').getBearer() } : undefined
    })
}

export default GeneralOrdersService

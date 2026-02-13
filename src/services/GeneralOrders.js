/* eslint-disable camelcase, global-require */
import { makeRequest } from 'utils/api'

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
      site:
        order.sede_info?.nombre ||
        order.site_name ||
        order.sede_nombre ||
        order.sede?.nombre ||
        order.sede ||
        '-',
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
  get: ({ page = 1, page_size = 10, search = '', state = '' } = {}) =>
    makeRequest(`${ENDPOINT}`, {
      params: { page, page_size, search, state },
      headers: localStorage.getItem('accessToken') ? { Authorization: require('utils/auth').getBearer() } : undefined
    })
      .then(res => res.json())
      .then(parseResponse),

  create: payload =>
    makeRequest('/ordenes/create', {
      method: 'POST',
      body: payload,
      headers: localStorage.getItem('accessToken') ? { Authorization: require('utils/auth').getBearer() } : undefined
    })
}

export default GeneralOrdersService

/* Servicio para consultar el detalle de una orden por código */
import { makeRequest } from 'utils/api'

const OrderDetailService = {
  getByCode: async codigo_orden => {
    const headers = localStorage.getItem('accessToken') ? { Authorization: require('utils/auth').getBearer() } : undefined
    const response = await makeRequest('/ordenes/detalle', {
      params: { codigo_orden },
      headers
    })
    const data = await response.json()
    const result = data?.result || {}
    return {
      code: result.codigo_orden,
      date: result.fecha_orden,
      estimated_delivery: result.fecha_entrega_estimada,
      client: result.nombre_cliente,
      site: result.nombre_sede,
      site_address: result.direccion_sede,
      site_lat: result.lat,
      site_long: result.long,
      subtotal: result.subtotal,
      discount: result.descuento,
      total: result.total_general,
      details: (result.productos || []).map(p => ({
        code: p.product_code,
        name: p.product_name,
        quantity: p.quantity,
        precio_unitario: p.unit_price,
        descuento_unitario: p.discount,
        subtotal: p.subtotal,
        total: p.total,
        tracking_code: p.tracking_code,
        tracking_state: p.tracking_state
      })),
      shipping_state: result.estado_envio,
      state: result.estado_envio,
      raw: result
    }
  }
}

export default OrderDetailService

import React, { useMemo, useState } from 'react'
import { Dropdown } from 'primereact/dropdown'
import { Skeleton } from 'primereact/skeleton'
import { useQuery } from 'hooks/useRequest'
import GeneralOrdersService from 'services/GeneralOrders'
import EstadoBadge from 'components/styles/EstadoBadge'
import { formatDate } from 'utils/dates'
import './style.scss'

const PAGE_SIZE = 200
const PERIODS = {
  TODAY: 'today',
  LAST_7: 'last_7',
  LAST_30: 'last_30'
}

const toCurrency = value => `S/ ${Number(value || 0).toFixed(2)}`

const toApiDate = date => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getDateRangeByPeriod = period => {
  const now = new Date()
  const endDate = new Date(now)
  const startDate = new Date(now)

  if (period === PERIODS.LAST_7) {
    startDate.setDate(now.getDate() - 6)
  }

  if (period === PERIODS.LAST_30) {
    startDate.setDate(now.getDate() - 29)
  }

  return {
    date_ini: toApiDate(startDate),
    date_fin: toApiDate(endDate)
  }
}

const getOrderTimestamp = dateValue => {
  if (!dateValue) return null
  const timestamp = new Date(dateValue).getTime()
  return Number.isNaN(timestamp) ? null : timestamp
}

const isSameDay = (left, right) => {
  if (!left || !right) return false
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  )
}

const normalizeState = state =>
  String(state || '')
    .trim()
    .toLowerCase()

const isPendingState = state => {
  const normalized = normalizeState(state)
  return normalized.includes('pendiente') || normalized.includes('pending')
}

const getAgingRange = minutes => {
  if (minutes <= 15) return '0-15 min'
  if (minutes <= 30) return '15-30 min'
  if (minutes <= 60) return '30-60 min'
  return '+60 min'
}

const getAgingClass = minutes => {
  if (minutes <= 15) return 'is-fresh'
  if (minutes <= 30) return 'is-warning'
  if (minutes <= 60) return 'is-alert'
  return 'is-critical'
}

const parseDetailQuantity = detail => Number(detail?.cantidad ?? detail?.quantity ?? 1)

const parseDetailRevenue = detail => {
  const subtotal = Number(detail?.subtotal ?? detail?.total)
  if (!Number.isNaN(subtotal)) return subtotal
  const price = Number(detail?.precio ?? detail?.price ?? 0)
  return parseDetailQuantity(detail) * (Number.isNaN(price) ? 0 : price)
}

const parseDetailName = detail => {
  const productInfo = detail?.producto_info || detail?.product_info || detail?.producto || detail?.product || {}
  return (
    productInfo?.nombre ||
    productInfo?.description ||
    detail?.producto_nombre ||
    detail?.product_name ||
    detail?.description ||
    `Producto ${detail?.producto || detail?.product || detail?.id || ''}`.trim()
  )
}

export default function Dashboard() {
  const [period, setPeriod] = useState(PERIODS.TODAY)
  const [selectedClient, setSelectedClient] = useState('')
  const dateRange = useMemo(() => getDateRangeByPeriod(period), [period])

  const { data, isFetching } = useQuery(['dashboard-orders', period], () =>
    GeneralOrdersService.get({
      page: 1,
      page_size: PAGE_SIZE,
      state: '',
      date_ini: dateRange.date_ini,
      date_fin: dateRange.date_fin
    })
  )

  const orders = useMemo(() => data?.results || [], [data])
  const clientOptions = useMemo(() => {
    const names = Array.from(new Set(orders.map(order => order?.client).filter(Boolean)))
      .sort((left, right) => left.localeCompare(right, 'es'))
      .map(client => ({ label: client, value: client }))

    return [{ label: 'Todos los clientes', value: '' }, ...names]
  }, [orders])

  const filteredOrders = useMemo(() => {
    if (!selectedClient) return orders
    return orders.filter(order => order?.client === selectedClient)
  }, [orders, selectedClient])

  const stats = useMemo(() => {
    const now = new Date()
    const pendingOrders = []
    const productsMap = new Map()

    let totalRevenue = 0
    let revenueToday = 0
    let ordersToday = 0
    let confirmedOrders = 0
    let pendingAmount = 0

    filteredOrders.forEach(order => {
      const orderTotal = Number(order?.total || 0)
      totalRevenue += orderTotal

      const orderTimestamp = getOrderTimestamp(order?.date)
      const orderDate = orderTimestamp ? new Date(orderTimestamp) : null
      if (orderDate && isSameDay(orderDate, now)) {
        ordersToday += 1
        revenueToday += orderTotal
      }

      if (normalizeState(order?.state) === 'confirmado') {
        confirmedOrders += 1
      }

      if (isPendingState(order?.state)) {
        pendingAmount += orderTotal
        const ageMinutes = orderTimestamp ? Math.max(0, Math.floor((Date.now() - orderTimestamp) / 60000)) : 0
        pendingOrders.push({
          id: order.id,
          code: order.code,
          client: order.client,
          site: order.site,
          date: order.date,
          total: orderTotal,
          ageMinutes,
          agingRange: getAgingRange(ageMinutes)
        })
      }

      const details = Array.isArray(order?.details) ? order.details : []
      details.forEach(detail => {
        const key = parseDetailName(detail)
        const qty = parseDetailQuantity(detail)
        const revenue = parseDetailRevenue(detail)
        const existing = productsMap.get(key) || { product: key, units: 0, revenue: 0, lines: 0 }
        existing.units += Number.isNaN(qty) ? 0 : qty
        existing.revenue += Number.isNaN(revenue) ? 0 : revenue
        existing.lines += 1
        productsMap.set(key, existing)
      })
    })

    const productsRank = Array.from(productsMap.values())
      .sort((left, right) => right.units - left.units)
      .slice(0, 8)

    const ordersByState = filteredOrders.reduce((acc, order) => {
      const state = normalizeState(order?.state) || 'sin estado'
      acc[state] = (acc[state] || 0) + 1
      return acc
    }, {})

    const stateRows = Object.entries(ordersByState)
      .map(([state, count]) => ({
        state,
        count,
        percent: filteredOrders.length ? Math.round((count / filteredOrders.length) * 100) : 0
      }))
      .sort((left, right) => right.count - left.count)

    return {
      totalOrders: filteredOrders.length,
      pendingToConfirm: pendingOrders.length,
      confirmedOrders,
      ordersToday,
      revenueToday,
      pendingAmount,
      avgTicket: filteredOrders.length ? totalRevenue / filteredOrders.length : 0,
      pendingOrders: pendingOrders.sort((left, right) => right.ageMinutes - left.ageMinutes).slice(0, 8),
      productsRank,
      stateRows
    }
  }, [filteredOrders])

  const kpis = [
    {
      label: 'Pendientes por confirmar',
      value: stats.pendingToConfirm,
      hint: 'Prioridad operativa',
      icon: 'pi pi-clock',
      tone: 'pending'
    },
    {
      label: 'Órdenes Confirmadas',
      value: stats.confirmedOrders,
      hint: 'Estado confirmado',
      icon: 'pi pi-shopping-bag',
      tone: 'confirmed'
    },
    {
      label: 'Total órdenes analizadas',
      value: stats.totalOrders,
      hint: 'Base de análisis',
      icon: 'pi pi-chart-bar'
    },
    {
      label: 'Monto pendiente',
      value: toCurrency(stats.pendingAmount),
      hint: 'Pendiente de confirmar',
      icon: 'pi pi-wallet'
    },
    {
      label: 'Ventas del día',
      value: toCurrency(stats.revenueToday),
      hint: 'Ingresos actuales',
      icon: 'pi pi-dollar'
    },
    {
      label: 'Ticket promedio',
      value: toCurrency(stats.avgTicket),
      hint: 'Valor medio por orden',
      icon: 'pi pi-calculator'
    }
  ]

  const renderPendingRows = () => {
    if (isFetching) {
      return Array.from({ length: 4 }).map((_, index) => (
        <tr key={`pending-skeleton-${index}`}>
          <td colSpan={6}>
            <Skeleton height="1.2rem" />
          </td>
        </tr>
      ))
    }

    if (stats.pendingOrders.length === 0) {
      return (
        <tr>
          <td colSpan={6} className="dashboard-empty">
            No hay órdenes pendientes por confirmar.
          </td>
        </tr>
      )
    }

    return stats.pendingOrders.map(order => (
      <tr key={order.id}>
        <td>{order.code || '-'}</td>
        <td>{order.client || '-'}</td>
        <td>{order.site || '-'}</td>
        <td>{formatDate(order.date)}</td>
        <td>
          <span className={`dashboard-aging ${getAgingClass(order.ageMinutes)}`}>{order.agingRange}</span>
        </td>
        <td>{toCurrency(order.total)}</td>
      </tr>
    ))
  }

  const renderStateRows = () => {
    if (isFetching) {
      return Array.from({ length: 4 }).map((_, index) => (
        <tr key={`state-skeleton-${index}`}>
          <td colSpan={3}>
            <Skeleton height="1.2rem" />
          </td>
        </tr>
      ))
    }

    if (stats.stateRows.length === 0) {
      return (
        <tr>
          <td colSpan={3} className="dashboard-empty">
            Sin datos de estados.
          </td>
        </tr>
      )
    }

    return stats.stateRows.map(row => (
      <tr key={row.state}>
        <td>
          <EstadoBadge estado={row.state} />
        </td>
        <td>{row.count}</td>
        <td>
          <div className="dashboard-progress-cell">
            <span>{row.percent}%</span>
            <div className="dashboard-progress-track">
              <div className="dashboard-progress-fill" style={{ width: `${row.percent}%` }} />
            </div>
          </div>
        </td>
      </tr>
    ))
  }

  const renderTopProductsRows = () => {
    if (isFetching) {
      return Array.from({ length: 6 }).map((_, index) => (
        <tr key={`product-skeleton-${index}`}>
          <td colSpan={4}>
            <Skeleton height="1.2rem" />
          </td>
        </tr>
      ))
    }

    if (stats.productsRank.length === 0) {
      return (
        <tr>
          <td colSpan={4} className="dashboard-empty">
            No hay datos de productos ordenados.
          </td>
        </tr>
      )
    }

    return stats.productsRank.map(item => (
      <tr key={item.product}>
        <td>
          <span className="dashboard-product-name">{item.product}</span>
        </td>
        <td>{item.units}</td>
        <td>{toCurrency(item.revenue)}</td>
        <td>{item.lines}</td>
      </tr>
    ))
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-head">
        <div>
          <span className="dashboard-eyebrow">Ecommerce · Operaciones</span>
          <h2>Dashboard de Órdenes</h2>
          <p>Vista ejecutiva y operativa para confirmar pendientes, monitorear estados y entender demanda.</p>
        </div>
        <div className="dashboard-head-meta">
          <div className="dashboard-periods" role="group" aria-label="Rango de tiempo">
            <button className={period === PERIODS.TODAY ? 'is-active' : ''} onClick={() => setPeriod(PERIODS.TODAY)}>
              Hoy
            </button>
            <button className={period === PERIODS.LAST_7 ? 'is-active' : ''} onClick={() => setPeriod(PERIODS.LAST_7)}>
              7 días
            </button>
            <button
              className={period === PERIODS.LAST_30 ? 'is-active' : ''}
              onClick={() => setPeriod(PERIODS.LAST_30)}
            >
              30 días
            </button>
          </div>
          <div className="dashboard-client-filter">
            <Dropdown
              value={selectedClient}
              options={clientOptions}
              onChange={e => setSelectedClient(e.value)}
              optionLabel="label"
              optionValue="value"
              placeholder="Cliente"
              appendTo="self"
            />
          </div>
        </div>
      </header>

      <section className="dashboard-kpis">
        {kpis.map(item => (
          <article
            className={`dashboard-card dashboard-kpi${item.tone ? ` is-${item.tone}` : ''}`}
            key={item.label}
          >
            <div className="dashboard-kpi-top">
              <span>{item.label}</span>
              <i className={item.icon} />
            </div>
            {isFetching ? <Skeleton width="8rem" height="1.5rem" /> : <strong>{item.value}</strong>}
            <small>{item.hint}</small>
          </article>
        ))}
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card dashboard-priority-card">
          <div className="dashboard-section-head">
            <h3>Pendientes por confirmar</h3>
            <small>Priorizado por antigüedad</small>
          </div>
          <div className="dashboard-table-wrap">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Orden</th>
                  <th>Cliente</th>
                  <th>Sede</th>
                  <th>Fecha</th>
                  <th>Aging</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>{renderPendingRows()}</tbody>
            </table>
          </div>
        </article>

        <article className="dashboard-card">
          <div className="dashboard-section-head">
            <h3>Estados de órdenes</h3>
            <small>Distribución actual</small>
          </div>
          <div className="dashboard-table-wrap">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Estado</th>
                  <th>Cantidad</th>
                  <th>%</th>
                </tr>
              </thead>
              <tbody>{renderStateRows()}</tbody>
            </table>
          </div>
        </article>
      </section>

      <section className="dashboard-card">
        <div className="dashboard-section-head">
          <h3>Productos más ordenados</h3>
          <small>Top por unidades</small>
        </div>
        <div className="dashboard-table-wrap">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Unidades</th>
                <th>Importe</th>
                <th>Líneas</th>
              </tr>
            </thead>
            <tbody>{renderTopProductsRows()}</tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

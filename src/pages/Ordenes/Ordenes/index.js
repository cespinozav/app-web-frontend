import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Paginator } from 'primereact/paginator'
import { useQuery } from 'hooks/useRequest'
import { SUB_ROUTES } from 'routing/routes'
import GeneralOrdersService from 'services/GeneralOrders'
import OrdersFiltersForm from './components/Forms/OrdersFiltersForm'
import OrdersTable from './components/Table/OrdersTable'
import OrderDetailModal from './components/Modals/OrderDetailModal'
import '../style.scss'

const PAGE_SIZE = 10

const stateOptions = [
  { label: 'Todos', value: '' },
  { label: 'Pendiente', value: 'pendiente' },
  { label: 'Confirmado', value: 'confirmado' },
  { label: 'En camino', value: 'en camino' },
  { label: 'Entregado', value: 'entregado' }
]

const formatDate = value => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('es-PE')
}

const formatCurrency = value => `S/ ${Number(value || 0).toFixed(2)}`

export default function Ordenes() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [state, setState] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const { data, isFetching } = useQuery(['general-orders', page, search, state], () =>
    GeneralOrdersService.get({ page, page_size: PAGE_SIZE, search, state })
  )

  const orders = data?.results || []
  const totalRecords = data?.count || 0

  return (
    <>
      <hr style={{ border: 'none', borderBottom: '1.5px solid #ecebeb', margin: '16px 0' }} />
      <div className="ordenes-listado">
        <div className="header-ordenes">
          <h2>LISTADO DE ÓRDENES</h2>
          <div className="acciones">
            <button className="add" onClick={() => navigate(SUB_ROUTES.ORDERS.CREATE)}>
              Agregar Orden +
            </button>
          </div>
        </div>

        <OrdersFiltersForm
          search={search}
          setSearch={setSearch}
          setPage={setPage}
          state={state}
          setState={setState}
          stateOptions={stateOptions}
        />

        <OrdersTable
          orders={orders}
          isFetching={isFetching}
          pageSize={PAGE_SIZE}
          formatDate={formatDate}
          formatCurrency={formatCurrency}
          onOpenDetail={order => {
            setSelectedOrder(order)
            setShowDetailModal(true)
          }}
        />

        <div className="paginate">
          <Paginator
            first={(page - 1) * PAGE_SIZE}
            rows={PAGE_SIZE}
            onPageChange={e => setPage(Math.floor(e.first / PAGE_SIZE) + 1)}
            totalRecords={totalRecords}
          />
        </div>
      </div>

      <OrderDetailModal
        visible={showDetailModal}
        onHide={() => {
          setShowDetailModal(false)
          setSelectedOrder(null)
        }}
        selectedOrder={selectedOrder}
        formatDate={formatDate}
        formatCurrency={formatCurrency}
      />
    </>
  )
}

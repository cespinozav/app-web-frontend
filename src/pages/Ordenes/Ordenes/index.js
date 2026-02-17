import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Paginator } from 'primereact/paginator'
import { Button } from 'primereact/button'
import { useQuery } from 'hooks/useRequest'
import useToast from 'hooks/useToast'
import { formatDate } from 'utils/dates'
import { SUB_ROUTES } from 'routing/routes'
import GeneralOrdersService from 'services/GeneralOrders'
import OrderDetailService from 'services/OrderDetail'
import OrdersFiltersForm from './components/Forms/OrdersFiltersForm'
import OrdersTable from './components/Table/OrdersTable'
import OrderDetailModal from './components/Modals/OrderDetailModal'
import BulkStatusChangeModal from './components/Modals/BulkStatusChangeModal'
import BulkConfirmDialog from './components/Modals/BulkConfirmDialog'
import '../style.scss'

const PAGE_SIZE = 10

const stateOptions = [
  { label: 'Todos', value: '' },
  { label: 'Pendiente', value: 'pendiente' },
  { label: 'Confirmado', value: 'confirmado' },
  { label: 'En camino', value: 'en camino' },
  { label: 'Entregado', value: 'entregado' }
]

const formatCurrency = value => `S/ ${Number(value || 0).toFixed(2)}`
const normalizeState = value => String(value || '').trim().toLowerCase()

export default function Ordenes() {
  const navigate = useNavigate()
  const toast = useToast()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [state, setState] = useState('')
  const [dateIni, setDateIni] = useState('')
  const [dateFin, setDateFin] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedOrderIds, setSelectedOrderIds] = useState([])
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [bulkTargetState, setBulkTargetState] = useState('')
  const [bulkCandidateOrders, setBulkCandidateOrders] = useState([])
  const [isBulkChangeLoading, setIsBulkChangeLoading] = useState(false)
  const [bulkExecutionResult, setBulkExecutionResult] = useState(null)
  const [showBulkConfirm, setShowBulkConfirm] = useState(false)
  const [pendingBulkAction, setPendingBulkAction] = useState(null)

  const { data, isFetching, refetch } = useQuery(
    ['general-orders', page, search, state, dateIni, dateFin],
    () =>
      GeneralOrdersService.get({
        page,
        page_size: PAGE_SIZE,
        search,
        state,
        date_ini: dateIni,
        date_fin: dateFin
      })
  )

  const orders = data?.results || []
  const totalRecords = data?.count || 0
  // selectedOrders global: todas las órdenes seleccionadas en todas las páginas
  const selectedOrders = useMemo(() => {
    if (!data?.allResults) return orders.filter(order => selectedOrderIds.includes(order.id))
    // Si el backend provee allResults (todas las órdenes), usarlo
    return data.allResults.filter(order => selectedOrderIds.includes(order.id))
  }, [orders, selectedOrderIds, data])
  const selectedCount = selectedOrderIds.length
  const selectedPendingCount = selectedOrders.filter(order => normalizeState(order.state) === 'pendiente').length
  const selectedConfirmedCount = selectedOrders.filter(order => normalizeState(order.state) === 'confirmado').length



  const handleExport = async () => {
    if (isExporting) return
    setIsExporting(true)

    try {
      const blob = await GeneralOrdersService.exportExcel({
        search,
        state,
        date_ini: dateIni,
        date_fin: dateFin
      })

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')

      link.href = url
      link.download = `reporte_ordenes_${timestamp}.xls`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      toast.error(error?.message || 'No se pudo exportar el reporte de órdenes')
    } finally {
      setIsExporting(false)
    }
  }

  const handleToggleOrderSelection = (order, checked) => {
    setSelectedOrderIds(previous => {
      if (checked) {
        if (previous.includes(order.id)) return previous
        return [...previous, order.id]
      }
      return previous.filter(id => id !== order.id)
    })
  }

  const handleToggleCurrentPageSelection = checked => {
    setSelectedOrderIds(prev => {
      const pageIds = orders.map(order => order.id)
      if (checked) {
        // Agrega los ids de la página actual a la selección global (sin duplicados)
        return Array.from(new Set([...prev, ...pageIds]))
      } else {
        // Quita los ids de la página actual de la selección global
        return prev.filter(id => !pageIds.includes(id))
      }
    })
  }

  const handleOpenBulkModal = async targetState => {
    const originState = targetState === 'confirmado' ? 'pendiente' : 'confirmado'
    // Obtener todas las órdenes seleccionadas (de todas las páginas)
    let allSelectedOrders = []
    try {
      allSelectedOrders = await GeneralOrdersService.getAllByFilters({ search, state, date_ini: dateIni, date_fin: dateFin })
    } catch (e) {
      toast.error('No se pudieron obtener todas las órdenes seleccionadas')
      return
    }
    // Filtrar solo las seleccionadas
    const selectedFullOrders = allSelectedOrders.filter(order => selectedOrderIds.includes(order.id))
    const candidates = selectedFullOrders.filter(order => normalizeState(order.state) === originState)

    if (candidates.length === 0) {
      toast.warn(`No hay pedidos seleccionados en estado ${originState} para cambiar a ${targetState}`)
      return
    }

    const excluded = selectedFullOrders.length - candidates.length
    if (excluded > 0) {
      toast.warn(`Se excluyeron ${excluded} pedido(s) por no cumplir la transición de estado`)
    }

    setBulkTargetState(targetState)
    setBulkCandidateOrders(candidates)
    setBulkExecutionResult(null)
    setShowBulkModal(true)
  }

  const parseBulkExecutionResult = (response, fallbackOrderIds = []) => {
    const wasSuccessful = response?.status === true;
    const processed = fallbackOrderIds.length;
    if (wasSuccessful) {
      const updatedCount = Number(response?.result?.ordenes_actualizadas ?? 0);
      const failedCount = Math.max(processed - updatedCount, 0);
      let customMessage = '';
      if (updatedCount > 0) {
        customMessage = `Se ${fallbackOrderIds.length === 1 ? (bulkTargetState === 'confirmado' ? 'confirmó' : 'envió') : (bulkTargetState === 'confirmado' ? 'confirmaron' : 'enviaron')} ${updatedCount} orden${updatedCount === 1 ? '' : 'es'} ${bulkTargetState === 'confirmado' ? 'correctamente' : 'correctamente'}`;
      } else {
        customMessage = 'No se actualizaron órdenes.';
      }
      return {
        processed,
        successCount: updatedCount,
        failedCount,
        failedItems: [],
        message: customMessage
      };
    }
    const errors = response?.errors || {};
    const failedItems = Object.entries(errors).flatMap(([field, messages]) => {
      const safeMessages = Array.isArray(messages) ? messages : [String(messages || response?.message || 'Error de validación')];
      return safeMessages.map(message => ({ orderId: field, message }));
    });
    return {
      processed,
      successCount: 0,
      failedCount: processed,
      failedItems: failedItems.length > 0 ? failedItems : [{ orderId: '-', message: response?.message || 'Error de validación.' }],
      message: response?.message || 'Error de validación.'
    };
  }

  const handleBulkStatusChange = async () => {
    if (isBulkChangeLoading || bulkCandidateOrders.length === 0 || !bulkTargetState) return
    setShowBulkConfirm(true)
    setPendingBulkAction(() => async () => {
      setIsBulkChangeLoading(true)
      try {
        const orderCodes = bulkCandidateOrders.map(order => order.code);
        const response = await GeneralOrdersService.bulkChangeStatus({
          ordenes: orderCodes,
          estado: bulkTargetState
        });
        const result = parseBulkExecutionResult(response, orderCodes);
        setBulkExecutionResult(result);

        if (result.failedCount > 0) {
          toast.warn(
            `${result.message || 'Actualización con observaciones.'} Actualizados: ${result.successCount}. Fallidos: ${result.failedCount}.`
          );
        } else {
          toast.success(result.message || `Se actualizaron ${result.successCount} pedido(s) correctamente`);
          setShowBulkModal(false);
        }

        if (result.successCount > 0) {
          setShowBulkModal(false);
        }
        setSelectedOrderIds([]);
        await refetch();
      } catch (error) {
        toast.error(error?.message || error?.detail || 'No se pudo realizar el cambio masivo de estado');
      } finally {
        setIsBulkChangeLoading(false);
        setShowBulkConfirm(false);
        setPendingBulkAction(null);
      }
    })
  }

  const handleConfirmBulkAction = async () => {
    if (pendingBulkAction) {
      setShowBulkConfirm(false)
      await pendingBulkAction()
    }
  }

  const handleCancelBulkAction = () => {
    setShowBulkConfirm(false)
    setPendingBulkAction(null)
  }

  const handleCloseBulkModal = () => {
    if (isBulkChangeLoading) return
    setShowBulkModal(false)
    setBulkTargetState('')
    setBulkCandidateOrders([])
    setBulkExecutionResult(null)
  }

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
          dateIni={dateIni}
          setDateIni={setDateIni}
          dateFin={dateFin}
          setDateFin={setDateFin}
          onExport={handleExport}
          isExporting={isExporting}
        />

        {selectedCount > 0 && (
          <div className="bulk-actions-bar">
            <span>{selectedCount} pedido(s) seleccionado(s) en esta página</span>
            <div className="bulk-actions-buttons">
              <Button
                type="button"
                label={`Confirmar Órdenes (${selectedPendingCount})`}
                className="p-button-success"
                onClick={() => handleOpenBulkModal('confirmado')}
                disabled={selectedPendingCount === 0}
              />
              <Button
                type="button"
                label={`Enviar Órdenes (${selectedConfirmedCount})`}
                className="p-button-info"
                onClick={() => handleOpenBulkModal('en camino')}
                disabled={selectedConfirmedCount === 0}
              />
              <Button
                type="button"
                label="Limpiar selección"
                className="p-button-secondary p-button-outlined"
                onClick={() => setSelectedOrderIds([])}
              />
            </div>
          </div>
        )}

        <OrdersTable
          orders={orders}
          isFetching={isFetching}
          pageSize={PAGE_SIZE}
          formatDate={formatDate}
          formatCurrency={formatCurrency}
          selectedOrderIds={selectedOrderIds}
          onToggleOrder={handleToggleOrderSelection}
          onToggleSelectPage={handleToggleCurrentPageSelection}
          onOpenDetail={async order => {
            try {
              const detail = await OrderDetailService.getByCode(order.code)
              setSelectedOrder(detail)
              setShowDetailModal(true)
            } catch (e) {
              toast.error('No se pudo cargar el detalle de la orden')
            }
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

      <BulkStatusChangeModal
        visible={showBulkModal}
        onHide={handleCloseBulkModal}
        selectedOrders={bulkCandidateOrders}
        targetState={bulkTargetState}
        onConfirm={handleBulkStatusChange}
        isLoading={isBulkChangeLoading}
        executionResult={bulkExecutionResult}
      />

      <BulkConfirmDialog
        visible={showBulkConfirm}
        onHide={handleCancelBulkAction}
        onConfirm={handleConfirmBulkAction}
        count={bulkCandidateOrders.length}
        actionLabel={bulkTargetState === 'confirmado' ? 'confirmar' : 'enviar'}
        loading={isBulkChangeLoading}
      />
    </>
  )
}

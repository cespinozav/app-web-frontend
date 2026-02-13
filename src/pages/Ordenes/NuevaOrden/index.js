import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ClienteService from 'services/Cliente'
import GeneralOrdersService from 'services/GeneralOrders'
import ProductoService from 'services/Producto'
import SedesClienteService from 'services/SedesCliente'
import useToast from 'hooks/useToast'
import { SUB_ROUTES } from 'routing/routes'
import OrderForm from './components/Forms/OrderForm'
import PaymentModal from './components/Modals/PaymentModal'
import '../style.scss'

const paymentMethods = [
  { label: 'Efectivo', value: 'efectivo' },
  { label: 'Yape', value: 'yape' },
  { label: 'Plin', value: 'plin' },
  { label: 'Transferencia', value: 'transferencia' },
  { label: 'Tarjeta de Crédito', value: 'tarjeta_credito' },
  { label: 'Tarjeta de Débito', value: 'tarjeta_debito' }
]

const toCurrency = value => `S/ ${Number(value || 0).toFixed(2)}`
const toAmountString = value => Number(value || 0).toFixed(2)

export default function NuevaOrden() {
  const navigate = useNavigate()
  const toast = useToast()
  const [clients, setClients] = useState([])
  const [sites, setSites] = useState([])
  const [selectedClient, setSelectedClient] = useState(null)
  const [selectedSite, setSelectedSite] = useState(null)
  const [productQuery, setProductQuery] = useState('')
  const [productSuggestions, setProductSuggestions] = useState([])
  const [cart, setCart] = useState([])
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('efectivo')
  const [operationNumber, setOperationNumber] = useState('')
  const [receivedAmount, setReceivedAmount] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    ClienteService.get({ page: 1, page_size: 100, state: 'activo' })
      .then(response => {
        const options = (response?.results || []).map(client => ({
          label: client.nombre,
          value: client.id,
          raw: client
        }))
        setClients(options)
      })
      .catch(() => {
        setClients([])
      })
  }, [])

  useEffect(() => {
    if (!selectedClient) {
      setSites([])
      setSelectedSite(null)
      return
    }

    SedesClienteService.get({ id_client: selectedClient, page: 1, page_size: 100 })
      .then(response => {
        const options = (response?.results || []).map(site => ({
          label: site.nombre || site.description || `Sede ${site.id}`,
          value: site.id,
          raw: site
        }))
        setSites(options)
      })
      .catch(() => {
        setSites([])
      })
  }, [selectedClient])

  const searchProducts = event => {
    ProductoService.get({ page: 1, page_size: 8, search: event.query, state: 'activo' })
      .then(response => {
        const options = (response?.results || []).map(product => ({
          id: product.id,
          code: product.codigo || product.code || product.sku || '',
          //   name: product.nombre || product.description || `Producto ${product.id}`,
          description: `${product.nombre || product.description || `Producto ${product.id}`} - ${
            product.category_name || 'Sin categoría'
          } - ${product.unit?.description || 'Sin unidad'}${
            product.unit?.reference ? ` (${product.unit.reference})` : ''
          }`,
          price: Number(product.price || 0)
        }))
        setProductSuggestions(options)
      })
      .catch(() => setProductSuggestions([]))
  }

  const addProductToCart = product => {
    setProductQuery('')
    setProductSuggestions([])

    setCart(currentCart => {
      const existing = currentCart.find(item => item.id === product.id)
      if (existing) {
        return currentCart.map(item => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }

      return [
        ...currentCart,
        {
          id: product.id,
          description: product.description,
          price: Number(product.price || 0),
          discount: 0,
          quantity: 1
        }
      ]
    })
  }

  const removeProduct = productId => {
    setCart(currentCart => currentCart.filter(item => item.id !== productId))
  }

  const updateCartItem = (productId, patch) => {
    setCart(currentCart => currentCart.map(item => (item.id === productId ? { ...item, ...patch } : item)))
  }

  const summary = useMemo(() => {
    const subtotal = cart.reduce((acc, item) => acc + Number(item.price) * Number(item.quantity), 0)
    const discount = cart.reduce((acc, item) => acc + Number(item.discount) * Number(item.quantity), 0)
    const total = Math.max(subtotal - discount, 0)
    return { subtotal, discount, total }
  }, [cart])

  const changeForCustomer = useMemo(() => {
    const amount = Number(receivedAmount || 0)
    if (paymentMethod !== 'efectivo') return 0
    return Math.max(amount - summary.total, 0)
  }, [paymentMethod, receivedAmount, summary.total])

  const clearForm = () => {
    setSelectedClient(null)
    setSelectedSite(null)
    setProductQuery('')
    setCart([])
    setPaymentMethod('efectivo')
    setOperationNumber('')
    setReceivedAmount(null)
  }

  const handleCreateOrder = async () => {
    if (!selectedClient) {
      toast.error('Debe seleccionar un cliente')
      return
    }

    if (!selectedSite) {
      toast.error('Debe seleccionar una sede')
      return
    }

    if (cart.length === 0) {
      toast.error('Debe agregar al menos un producto al carrito')
      return
    }

    if (paymentMethod === 'efectivo' && Number(receivedAmount || 0) < summary.total) {
      toast.error('El monto recibido no cubre el total de la orden')
      return
    }

    setIsSaving(true)
    try {
      const detalles = cart.map(item => {
        const quantity = Number(item.quantity)
        const unitPrice = Number(item.price)
        const unitDiscount = Number(item.discount)
        const discountPercentage = unitPrice > 0 ? (unitDiscount * 100) / unitPrice : 0
        const itemSubtotal = Math.max((unitPrice - unitDiscount) * quantity, 0)

        return {
          producto: item.id,
          cantidad: quantity,
          precio_unitario: toAmountString(unitPrice),
          descuento_unitario: toAmountString(unitDiscount),
          descuento_porcentaje: toAmountString(discountPercentage),
          subtotal: toAmountString(itemSubtotal)
        }
      })

      await GeneralOrdersService.create({
        sede: selectedSite,
        subtotal: toAmountString(summary.subtotal),
        descuento: toAmountString(summary.discount),
        total: toAmountString(summary.total),
        estado: 'pendiente',
        detalles
      })

      toast.success('Orden registrada correctamente')
      setShowPaymentModal(false)
      clearForm()
      navigate(SUB_ROUTES.ORDERS.MAIN)
    } catch (error) {
      toast.error(error?.message || 'No se pudo registrar la orden')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <hr style={{ border: 'none', borderBottom: '1.5px solid #ecebeb', margin: '16px 0' }} />
      <OrderForm
        productQuery={productQuery}
        setProductQuery={setProductQuery}
        productSuggestions={productSuggestions}
        searchProducts={searchProducts}
        addProductToCart={addProductToCart}
        cart={cart}
        toCurrency={toCurrency}
        updateCartItem={updateCartItem}
        removeProduct={removeProduct}
        clients={clients}
        selectedClient={selectedClient}
        setSelectedClient={setSelectedClient}
        sites={sites}
        selectedSite={selectedSite}
        setSelectedSite={setSelectedSite}
        summary={summary}
        onOpenPayment={() => setShowPaymentModal(true)}
      />

      <PaymentModal
        visible={showPaymentModal}
        onHide={() => setShowPaymentModal(false)}
        summary={summary}
        toCurrency={toCurrency}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        paymentMethods={paymentMethods}
        operationNumber={operationNumber}
        setOperationNumber={setOperationNumber}
        receivedAmount={receivedAmount}
        setReceivedAmount={setReceivedAmount}
        changeForCustomer={changeForCustomer}
        isSaving={isSaving}
        onConfirm={handleCreateOrder}
      />
    </>
  )
}

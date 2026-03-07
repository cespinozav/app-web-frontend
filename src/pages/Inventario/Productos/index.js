import EstadoBadge from 'components/styles/EstadoBadge'
import React, { useState, useMemo } from 'react'
import { Dialog } from 'primereact/dialog'
import { Skeleton } from 'primereact/skeleton'
import { useForm, Controller } from 'react-hook-form'
import useToast from 'hooks/useToast'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Paginator } from 'primereact/paginator'
import { useQuery } from 'hooks/useRequest'
import CategoriaService from 'services/Categoria'
import ProductoService from 'services/Producto'
import ProductDetailModal from './ProductDetailModal'
import './style.scss'

function normalizeState(state) {
  if (!state) return 'activo'
  const s = String(state).toLowerCase()
  if (s === 'activo' || s === 'inactivo') return s
  return 'activo'
}

// Variable global para el tipo de moneda
// export const tipoMoneda = 'S/'

const PAGE_SIZE = 10

export default function Productos() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('')
  // ...existing code...
  const [categorias, setCategorias] = useState([{ label: 'Todas', value: '' }])
  const [catLoading, setCatLoading] = useState(false)

  // const categorias = [...] // Eliminado: ahora se usa el estado categorias
  const categoriasSinTodas = categorias.filter(c => c.value !== '')
  // ...existing code...

  // Cargar categorías al montar
  React.useEffect(() => {
    setCatLoading(true)
    CategoriaService.get({ page: 1, page_size: 100 })
      .then(res => {
        const cats = Array.isArray(res.results)
          ? res.results.map(c => ({ label: c.nombre || c.description || c.label, value: c.id }))
          : []
        setCategorias([{ label: 'Todas', value: '' }, ...cats])
      })
      .finally(() => setCatLoading(false))
  }, [])

  const { data, isFetching, refetch } = useQuery(['productos', page, search, cat], () => {
    const params = { page, page_size: PAGE_SIZE, search, cat }
    return ProductoService.get(params)
  })
  const productos = data?.results || []
  console.log(productos);
  const totalRecords = data?.count || 0

  // Modal de agregar/editar producto
  const [showAdd, setShowAdd] = useState(false)
  const [isMutating, setIsMutating] = useState(false)
  const [rowData, setRowData] = useState(null)
  const [showDetail, setShowDetail] = useState(false)
  const [detailProductId, setDetailProductId] = useState(null)
  const detailProduct = useMemo(() => {
    if (!detailProductId) return null;
    return productos?.find(p => p.id === detailProductId) || null;
  }, [detailProductId, productos]);
  const toast = useToast()
  // Formulario separado como en categoría
  function ProductModalForm({ onSubmitFields: onSubmitFieldsHandler, isMutating: isMutatingProp, defaultValues }) {
    const {
      control,
      handleSubmit,
      reset,
      formState: { errors }
    } = useForm({
      defaultValues: defaultValues || { nombre: '', cat: '', state: 'activo' }
    })
    // ...existing code...
    // Cargar datos al editar
    React.useEffect(() => {
      if (defaultValues) {
        reset(defaultValues)
      } else {
        reset({ nombre: '', cat: '', state: 'activo' })
      }
    }, [defaultValues, reset])

    // Unidad ya no se usa
    const handleError = formErrors => {
      // Mostrar solo los primeros 4 errores, como en mantenimiento
      const messages = Object.values(formErrors)
        .slice(0, 4)
        .map(e => e.message)
      toast.error(messages)
    }
    const onSubmit = formData => onSubmitFieldsHandler(formData, reset)
    return (
      <form onSubmit={handleSubmit(onSubmit, handleError)}>
        <div className="content">
          <div className="m-row">
            <label htmlFor="nombre">Nombre del producto:</label>
            <Controller
              name="nombre"
              control={control}
              rules={{ required: 'Nombre requerido', maxLength: { value: 50, message: 'Máx 50 caracteres' } }}
              render={({ field }) => <InputText {...field} autoComplete="off" className="p-inputtext p-component" />}
            />
            {errors.nombre && <div className="error-message">{errors.nombre.message}</div>}
          </div>
          {/* Campos de precio y unidad eliminados */}
          <div className="m-row">
            <label htmlFor="cat">Categoría:</label>
            <Controller
              name="cat"
              control={control}
              rules={{ required: 'Seleccione una categoría' }}
              render={({ field }) => (
                <Dropdown
                  {...field}
                  value={field.value || ''}
                  options={categoriasSinTodas}
                  placeholder="Seleccione categoría"
                  style={{ minWidth: 160 }}
                  disabled={catLoading}
                  onChange={e => field.onChange(e.value)}
                />
              )}
            />
            {errors.cat && <div className="error-message">{errors.cat.message}</div>}
          </div>
          <div className="m-row">
            <label htmlFor="state">Estado:</label>
            <Controller
              name="state"
              control={control}
              rules={{ required: 'Seleccione estado' }}
              render={({ field }) => (
                <Dropdown
                  {...field}
                  options={[
                    { label: 'Activo', value: 'activo' },
                    { label: 'Inactivo', value: 'inactivo' }
                  ]}
                  placeholder="Seleccione estado"
                  style={{ minWidth: 160 }}
                />
              )}
            />
            {errors.state && <div className="error-message">{errors.state.message}</div>}
          </div>
        </div>
        <div className="buttons">
          <Button
            aria-label="Guardar"
            label="Guardar"
            loading={isMutatingProp}
            disabled={isMutatingProp}
            className="button p-button p-component"
            loadingIcon="pi pi-spin pi-spinner"
            iconPos="right"
            type="submit"
          />
        </div>
      </form>
    )
  }

  // Lógica de submit igual a ModalForm de categoría
  const onSubmitFields = async (formData, resetForm) => {
    setIsMutating(true)
    try {
      const categoriaIdValue = formData.cat || '';
      // Si rowData existe, es edición
      if (rowData && rowData.id) {
        await ProductoService.put({
          id: rowData.id,
          nombre: formData.nombre,
          categoria_id: categoriaIdValue,
          state: formData.state
        })
        setShowAdd(false)
        setRowData(null)
        if (resetForm) resetForm()
        toast.success('Producto editado con éxito')
        refetch()
      } else {
        await ProductoService.post({
          nombre: formData.nombre,
          categoria_id: categoriaIdValue,
          state: formData.state
        })
        setShowAdd(false)
        if (resetForm) resetForm()
        toast.success('Producto agregado con éxito')
        refetch()
      }
    } catch (e) {
      if (e?.result?.nombre && Array.isArray(e.result.nombre)) {
        toast.error(e.result.nombre[0])
        return
      }
      if (e?.status === 401 || (e?.message && String(e.message).includes('401'))) {
        window.location.href = '/login'
        return
      }
      toast.error(e.message || 'Error al guardar producto')
    } finally {
      setIsMutating(false)
    }
  }

  return (
    <>
      <hr style={{ border: 'none', borderBottom: '1.5px solid #ecebeb', margin: '16px 0' }} />
      <div className="productos-listado">
        <div className="header-productos">
          <h2>LISTADO GENERAL</h2>
          <div className="acciones">
            <button className="add" onClick={() => setShowAdd(true)}>
              Agregar +
            </button>
          </div>
        </div>
        <div className="filtros-productos">
          <div className="filtro-item" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* <label style={{ minWidth: 90 }}>Nombre producto</label> */}
            <span className="p-input-icon-left">
              <i className="pi pi-search" />
              <InputText
                placeholder="Nombre producto"
                value={search}
                onChange={e => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
              />
            </span>
          </div>
          <div className="filtro-item" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label htmlFor="categoria-filter" style={{ minWidth: 70 }}>
              Categoría
            </label>
            <Dropdown
              id="categoria-filter"
              value={cat}
              options={categorias}
              onChange={e => {
                setCat(e.value)
                setPage(1)
              }}
              placeholder="Categoría"
              style={{ minWidth: 160 }}
              disabled={catLoading}
            />
          </div>
          {/* Estado filter removed */}
        </div>
        <div className="tabla-productos">
          {isFetching ? (
            Array.from({ length: PAGE_SIZE }).map((_, i) => <Skeleton className="table" key={i} />)
          ) : (
            <table className="p-datatable table">
              <thead>
                <tr>
                  <th>Nro</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {productos.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center' }}>
                        No hay resultados
                      </td>
                    </tr>
                ) : (
                  productos.map((prod, idx) => (
                    <tr key={prod.id ?? `row-${idx}`}>
                        <td>{(page - 1) * PAGE_SIZE + idx + 1}</td>
                        <td>{prod.nombre || prod.description}</td>
                        <td>{prod.categoria || '-'}</td>
                        <td>
                          <EstadoBadge estado={prod.state} />
                        </td>
                        <td>
                          <div className="actions">
                            <Button
                              icon="pi pi-pencil"
                              className="p-button p-component p-button-icon-only"
                              style={{ background: 'transparent' }}
                              onClick={() => {
                                setRowData(prod)
                                setShowAdd(true)
                              }}
                              aria-label="Editar"
                            />
                            <Button
                              icon="pi pi-info-circle"
                              className="p-button p-component p-button-icon-only"
                              style={{ background: 'transparent', marginLeft: 8 }}
                              onClick={() => {
                                setDetailProductId(prod.id)
                                setShowDetail(true)
                              }}
                              aria-label="Detalles"
                            />
                          </div>
                          <ProductDetailModal
                            visible={showDetail}
                            onHide={() => setShowDetail(false)}
                            product={detailProduct}
                          />
                        </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
        <Dialog
          className="dialog licenses-dialog maintenance"
          draggable={false}
          visible={showAdd}
          modal
          onHide={() => {
            setShowAdd(false)
            setRowData(null)
          }}
          header={
            <span style={{ fontWeight: 600, fontSize: '1.2rem' }}>
              {rowData ? 'Editar producto' : 'Agregar producto'}
            </span>
          }
          closable={true}
        >
          <ProductModalForm
            onClose={() => {
              setShowAdd(false)
              setRowData(null)
            }}
            onSubmitFields={onSubmitFields}
            isMutating={isMutating}
            defaultValues={
              rowData
                ? {
                    nombre: rowData.nombre || '',
                    cat: rowData.categoria_id || rowData.cat || rowData.categoria || '',
                    state: normalizeState(rowData.state)
                  }
                : undefined
            }
          />
        </Dialog>
        <div className="paginate">
          <Paginator
            first={(page - 1) * PAGE_SIZE}
            rows={PAGE_SIZE}
            onPageChange={e => setPage(Math.floor(e.first / PAGE_SIZE) + 1)}
            totalRecords={totalRecords}
          />
        </div>
      </div>
    </>
  )
}

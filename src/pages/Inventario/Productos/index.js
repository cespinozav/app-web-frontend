import React, { useState } from 'react'
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
import UnitService from 'services/Unit'
import EstadoBadge from 'components/styles/EstadoBadge'
import './style.scss'

// Variable global para el tipo de moneda
export const tipoMoneda = 'S/'

const PAGE_SIZE = 10

export default function Productos() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('')
  const [state, setState] = useState('activo') // Por defecto, mostrar solo activos
  const [categorias, setCategorias] = useState([{ label: 'Todas', value: '' }])
  const [catLoading, setCatLoading] = useState(false)

  // const categorias = [...] // Eliminado: ahora se usa el estado categorias
  const categoriasSinTodas = categorias.filter(c => c.value !== '')
  const estados = [
    { label: 'Todos', value: '' },
    { label: 'Activo', value: 'activo' },
    { label: 'Inactivo', value: 'inactivo' }
  ]

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

  const { data, isFetching, refetch } = useQuery(['productos', page, search, cat, state], () => {
    const params = { page, page_size: PAGE_SIZE, search, cat }
    if (state !== '') params.state = state
    return ProductoService.get(params)
  })
  const productos = data?.results || []
  const totalRecords = data?.count || 0

  // Modal de agregar/editar producto
  const [showAdd, setShowAdd] = useState(false)
  const [isMutating, setIsMutating] = useState(false)
  const [rowData, setRowData] = useState(null)
  const toast = useToast()
  // Formulario separado como en categoría
  function ProductModalForm({ onSubmitFields: onSubmitFieldsHandler, isMutating: isMutatingProp, defaultValues }) {
    const {
      control,
      handleSubmit,
      reset,
      formState: { errors }
    } = useForm({
      defaultValues: defaultValues || { nombre: '', cat: '', price: '', unit: '', active: 0 }
    })
    const [units, setUnits] = React.useState([])
    const [unitsLoading, setUnitsLoading] = React.useState(false)
    // Cargar datos al editar
    React.useEffect(() => {
      if (defaultValues) {
        reset(defaultValues)
      } else {
        reset({ nombre: '', cat: '', price: '', unit: '', active: 0 })
      }
    }, [defaultValues, reset])

    React.useEffect(() => {
      setUnitsLoading(true)
      UnitService.get({ page: 1, page_size: 100 })
        .then(res => {
          setUnits(
            Array.isArray(res.results)
              ? res.results.map(u => ({
                  label: u.reference ? `${u.description} (${u.reference})` : u.description,
                  value: u.id
                }))
              : []
          )
        })
        .finally(() => setUnitsLoading(false))
    }, [])
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
          <div className="m-row">
            <label htmlFor="price">Precio:</label>
            <Controller
              name="price"
              control={control}
              rules={{
                required: 'Precio requerido',
                pattern: { value: /^\d+(\.\d{1,2})?$/, message: 'Formato: 0.00' }
              }}
              render={({ field }) => (
                <InputText {...field} autoComplete="off" className="p-inputtext p-component" placeholder="0.00" />
              )}
            />
            {errors.price && <div className="error-message">{errors.price.message}</div>}
          </div>
          <div className="m-row">
            <label htmlFor="unit">Unidad:</label>
            <Controller
              name="unit"
              control={control}
              rules={{ required: 'Unidad requerida' }}
              render={({ field }) => (
                <Dropdown
                  {...field}
                  options={units}
                  placeholder="Seleccione unidad"
                  style={{ minWidth: 160 }}
                  disabled={unitsLoading}
                />
              )}
            />
            {errors.unit && <div className="error-message">{errors.unit.message}</div>}
          </div>
          <div className="m-row">
            <label htmlFor="cat">Categoría:</label>
            <Controller
              name="cat"
              control={control}
              rules={{ required: 'Seleccione una categoría' }}
              render={({ field }) => (
                <Dropdown
                  {...field}
                  options={categoriasSinTodas}
                  placeholder="Seleccione categoría"
                  style={{ minWidth: 160 }}
                  disabled={catLoading}
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
                  placeholder="Seleccione"
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
      let catValue = formData.cat
      if (catValue && typeof catValue === 'object') {
        catValue = catValue.value || catValue.id || ''
      }
      let unitId = formData.unit
      if (unitId && typeof unitId === 'object') {
        unitId = unitId.value || unitId.id || ''
      }
      // Si rowData existe, es edición
      if (rowData && rowData.id) {
        await ProductoService.put({
          id: rowData.id,
          nombre: formData.nombre,
          cat: catValue,
          price: formData.price,
          unit_id: unitId,
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
          cat: catValue,
          price: formData.price,
          unit_id: unitId,
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
          <div className="filtro-item" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label htmlFor="estado-filter" style={{ minWidth: 60 }}>
              Estado
            </label>
            <Dropdown
              id="estado-filter"
              value={state}
              options={estados}
              onChange={e => {
                setState(e.value)
                setPage(1)
              }}
              placeholder="Estado"
              style={{ minWidth: 160 }}
            />
          </div>
        </div>
        <div className="tabla-productos">
          {isFetching ? (
            Array.from({ length: PAGE_SIZE }).map((_, i) => <Skeleton className="table" key={i} />)
          ) : (
            <table className="p-datatable table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Unidad</th>
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
                  productos.map(prod => (
                    <tr key={prod.id}>
                      <td>{prod.id}</td>
                      <td>{prod.nombre || prod.description}</td>
                      <td>{prod.category_name || '-'}</td>
                      <td>
                        {typeof prod.price !== 'undefined' ? `${tipoMoneda} ${Number(prod.price).toFixed(2)}` : '-'}
                      </td>
                      <td>
                        {prod.unit_description
                          ? `${prod.unit_description}${prod.unit_reference ? ` (${prod.unit_reference})` : ''}`
                          : '-'}
                      </td>
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
                        </div>
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
                    cat: rowData.cat || rowData.categoria || rowData.categoria_id || '',
                    price: rowData.price || '',
                    unit: rowData.unit_id || (rowData.unit && rowData.unit.id) || '',
                    state: rowData.state || 'activo'
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

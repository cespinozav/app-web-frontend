import React, { useState } from 'react'
import { Dialog } from 'primereact/dialog'
import { Skeleton } from 'primereact/skeleton'
import { useForm, Controller } from 'react-hook-form'
import useToast from 'hooks/useToast'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import AutoCompleteStyled from 'components/AutoComplete'
import buscarClientesAutocomplete from 'utils/autocompleteCliente'
import { Paginator } from 'primereact/paginator'
import { useQuery } from 'hooks/useRequest'
import CategoriaUsuarioService from 'services/CategoriaUsuario'
import UsuariosService from 'services/Usuarios'
import { formatDate } from 'utils/dates'
import SedesAsignadasModal from './components/Modals/SedesAsignadasModal'
import './style.scss'

const PAGE_SIZE = 10

export default function Usuarios() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [categoria, setCategoria] = useState('')
  const { data: categoriasData } = useQuery(['categorias-usuario'], () =>
    CategoriaUsuarioService.get({ page_size: 100 })
  )
  const categorias = categoriasData?.results || []
  const { data, isFetching, refetch } = useQuery(['usuarios', page, search, categoria], () =>
    UsuariosService.get({ page, page_size: PAGE_SIZE, search, categoria })
  )
  const usuarios = data?.results || []
  const totalRecords = data?.count || 0
  const [showAdd, setShowAdd] = useState(false)
  const [isMutating, setIsMutating] = useState(false)
  const [rowData, setRowData] = useState(null)
  const [showSedesAsignadas, setShowSedesAsignadas] = useState(false)
  const toast = useToast()

  // Lógica para guardar usuario (placeholder)
  const onSubmitFields = async formData => {
    setIsMutating(true)
    try {
      setShowAdd(false)
      setRowData(null)
      if (rowData && rowData.id) {
        await UsuariosService.put({
          id: rowData.id,
          dni: formData.dni,
          apellidoPaterno: formData.apellidoPaterno,
          apellidoMaterno: formData.apellidoMaterno,
          nombres: formData.nombres,
          categoria: formData.categoria,
          correo: formData.correo,
          cliente: formData.cliente,
          telefono: formData.telefono
        })
        toast.success('Usuario actualizado con éxito')
      } else {
        await UsuariosService.post({
          dni: formData.dni,
          apellidoPaterno: formData.apellidoPaterno,
          apellidoMaterno: formData.apellidoMaterno,
          nombres: formData.nombres,
          categoria: formData.categoria,
          correo: formData.correo,
          cliente: formData.cliente,
          telefono: formData.telefono
        })
        toast.success('Usuario creado con éxito')
      }
      refetch()
    } catch (err) {
      toast.error('Error al guardar el usuario')
    } finally {
      setIsMutating(false)
    }
  }

  function UsuarioModalForm({ onSubmitFields: onSubmitFieldsHandler, isMutating: isMutatingProp, defaultValues }) {
    const {
      control,
      handleSubmit,
      reset,
      formState: { errors }
    } = useForm({
      defaultValues: defaultValues || {
        nombres: '',
        dni: '',
        correo: '',
        telefono: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        categoria: '',
        cliente: null
      }
    })
    React.useEffect(() => {
      if (defaultValues) {
        let cliente = defaultValues.cliente || null
        if (cliente && !cliente.description && cliente.nombre) {
          cliente = { ...cliente, description: cliente.nombre }
        }
        reset({ ...defaultValues, cliente, telefono: defaultValues.telefono || '' })
      } else {
        reset({
          nombres: '',
          dni: '',
          correo: '',
          telefono: '',
          apellidoPaterno: '',
          apellidoMaterno: '',
          categoria: '',
          cliente: null
        })
      }
    }, [defaultValues, reset])
    const handleError = formErrors => {
      const messages = Object.values(formErrors)
        .slice(0, 4)
        .map(e => e.message)
      toast.error(messages)
    }
    const onSubmit = formData => onSubmitFieldsHandler(formData, reset)
    return (
      <form onSubmit={handleSubmit(onSubmit, handleError)}>
        <div className="content" style={{ display: 'flex', gap: 24 }}>
          <div className="column-form" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="m-row">
              <label htmlFor="dni">DNI:</label>
              <Controller
                name="dni"
                control={control}
                rules={{ required: 'DNI requerido', maxLength: { value: 15, message: 'Máx 15 caracteres' } }}
                render={({ field }) => <InputText {...field} autoComplete="off" className="p-inputtext p-component" />}
              />
              {errors.dni && <div className="error-message">{errors.dni.message}</div>}
            </div>
            <div className="m-row">
              <label htmlFor="correo">Correo:</label>
              <Controller
                name="correo"
                control={control}
                rules={{
                  required: 'Correo requerido',
                  pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: 'Correo inválido' }
                }}
                render={({ field }) => <InputText {...field} autoComplete="off" className="p-inputtext p-component" />}
              />
              {errors.correo && <div className="error-message">{errors.correo.message}</div>}
            </div>
            <div className="m-row">
              <label htmlFor="telefono">Teléfono:</label>
              <Controller
                name="telefono"
                control={control}
                rules={{
                  required: 'Teléfono requerido',
                  pattern: { value: /^\+?\d{7,15}$/, message: 'Teléfono inválido' }
                }}
                render={({ field }) => (
                  <InputText
                    {...field}
                    autoComplete="off"
                    className="p-inputtext p-component"
                    placeholder="Ej: +51912345678"
                  />
                )}
              />
              {errors.telefono && <div className="error-message">{errors.telefono.message}</div>}
            </div>
            <div className="m-row">
              <label htmlFor="categoria">Categoría:</label>
              <Controller
                name="categoria"
                control={control}
                rules={{ required: 'Seleccione categoría' }}
                render={({ field }) => (
                  <Dropdown
                    {...field}
                    options={categorias.map(c => ({ label: c.description, value: c.id }))}
                    placeholder="Seleccione"
                    style={{ minWidth: 160 }}
                  />
                )}
              />
              {errors.categoria && <div className="error-message">{errors.categoria.message}</div>}
            </div>
          </div>
          <div className="column-form" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="m-row">
              <label htmlFor="nombres">Nombres:</label>
              <Controller
                name="nombres"
                control={control}
                rules={{ required: 'Nombres requeridos', maxLength: { value: 50, message: 'Máx 50 caracteres' } }}
                render={({ field }) => <InputText {...field} autoComplete="off" className="p-inputtext p-component" />}
              />
              {errors.nombres && <div className="error-message">{errors.nombres.message}</div>}
            </div>
            <div className="m-row">
              <label htmlFor="apellidoPaterno">Apellido Paterno:</label>
              <Controller
                name="apellidoPaterno"
                control={control}
                rules={{
                  required: 'Apellido paterno requerido',
                  maxLength: { value: 50, message: 'Máx 50 caracteres' }
                }}
                render={({ field }) => <InputText {...field} autoComplete="off" className="p-inputtext p-component" />}
              />
              {errors.apellidoPaterno && <div className="error-message">{errors.apellidoPaterno.message}</div>}
            </div>
            <div className="m-row">
              <label htmlFor="apellidoMaterno">Apellido Materno:</label>
              <Controller
                name="apellidoMaterno"
                control={control}
                rules={{
                  required: 'Apellido materno requerido',
                  maxLength: { value: 50, message: 'Máx 50 caracteres' }
                }}
                render={({ field }) => <InputText {...field} autoComplete="off" className="p-inputtext p-component" />}
              />
              {errors.apellidoMaterno && <div className="error-message">{errors.apellidoMaterno.message}</div>}
            </div>
            <div className="m-row">
              <label htmlFor="cliente">Cliente:</label>
              <Controller
                name="cliente"
                control={control}
                rules={{ required: 'Seleccione cliente' }}
                render={({ field }) => (
                  <AutoCompleteStyled
                    {...field}
                    request={buscarClientesAutocomplete}
                    value={field.value}
                    setValue={field.onChange}
                    name="cliente"
                    minLength={2}
                    placeholder="Buscar cliente..."
                    style={{ width: '100%' }}
                  />
                )}
              />
              {errors.cliente && <div className="error-message">{errors.cliente.message}</div>}
            </div>
          </div>
        </div>
        <div className="buttons">
          <Button
            loading={isMutatingProp}
            disabled={isMutatingProp}
            className="button p-button p-component"
            loadingIcon="pi pi-spin pi-spinner"
            iconPos="right"
            type="submit"
            label="Guardar"
          />
        </div>
      </form>
    )
  }

  return (
    <>
      <hr style={{ border: 'none', borderBottom: '1.5px solid #ecebeb', margin: '16px 0' }} />
      <div className="usuarios-listado">
        <div className="header-clientes">
          <h2>LISTADO DE USUARIOS</h2>
          <div className="acciones">
            <button className="add" onClick={() => setShowAdd(true)}>
              Agregar +
            </button>
          </div>
        </div>
        <div className="filtros-clientes">
          <div className="filtro-item" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="p-input-icon-left">
              <i className="pi pi-search" />
              <InputText
                placeholder="Nombre usuario"
                value={search}
                onChange={e => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
              />
            </span>
          </div>
          <div className="filtro-item" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label htmlFor="categoria-filter" style={{ minWidth: 60 }}>
              Categoría
            </label>
            <Dropdown
              id="categoria-filter"
              value={categoria}
              options={[{ label: 'Todas', value: '' }, ...categorias.map(c => ({ label: c.description, value: c.id }))]}
              onChange={e => {
                setCategoria(e.value)
                setPage(1)
              }}
              placeholder="Categoría"
              style={{ minWidth: 160 }}
            />
          </div>
        </div>
        <div className="tabla-clientes">
          {isFetching ? (
            Array.from({ length: PAGE_SIZE }).map((_, i) => <Skeleton className="table" key={i} />)
          ) : (
            <table className="p-datatable table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>DNI</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Nombres</th>
                  <th>Apellido Paterno</th>
                  <th>Apellido Materno</th>
                  <th>Categoría</th>
                  <th>Cliente</th>
                  <th>Usuario creado</th>
                  <th>Fecha creada</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center' }}>
                      No hay resultados
                    </td>
                  </tr>
                ) : (
                  usuarios.map(usuario => (
                    <tr key={usuario.id}>
                      <td>{usuario.id}</td>
                      <td>{usuario.dni}</td>
                      <td>{usuario.correo}</td>
                      <td>{usuario.telefono || '-'}</td>
                      <td>{usuario.nombres}</td>
                      <td>{usuario.apellidoPaterno}</td>
                      <td>{usuario.apellidoMaterno}</td>
                      <td>{usuario.categoria?.description || '-'}</td>
                      <td>{usuario.cliente?.description || '-'}</td>
                      <td>{usuario.usuarioCreado}</td>
                      <td>{formatDate(usuario.fechaCreada)}</td>
                      <td>
                        <div className="actions">
                          <Button
                            icon="pi pi-pencil"
                            className="p-button p-component p-button-icon-only"
                            style={{ background: 'transparent' }}
                            onClick={() => {
                              setRowData(usuario)
                              setShowAdd(true)
                            }}
                            aria-label="Editar"
                          />
                          <Button
                            icon="pi pi-map-marker"
                            className="p-button p-component p-button-icon-only"
                            style={{ background: 'transparent', marginLeft: 8 }}
                            onClick={() => {
                              setRowData(usuario)
                              setShowSedesAsignadas(true)
                            }}
                            aria-label="Sedes Asignadas"
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
          className="dialog usuarios-dialog maintenance"
          draggable={false}
          visible={showAdd}
          modal
          onHide={() => {
            setShowAdd(false)
            setRowData(null)
          }}
          header={
            <span style={{ fontWeight: 600, fontSize: '1.2rem' }}>
              {rowData ? 'Editar usuario' : 'Agregar usuario'}
            </span>
          }
          closable={true}
        >
          <UsuarioModalForm
            onClose={() => {
              setShowAdd(false)
              setRowData(null)
            }}
            onSubmitFields={onSubmitFields}
            isMutating={isMutating}
            defaultValues={
              rowData
                ? {
                    dni: rowData.dni || '',
                    correo: rowData.correo || '',
                    nombres: rowData.nombres || '',
                    apellidoPaterno: rowData.apellidoPaterno || '',
                    apellidoMaterno: rowData.apellidoMaterno || '',
                    categoria: rowData.categoria && rowData.categoria.id ? rowData.categoria.id : '',
                    cliente: rowData.cliente || null,
                    telefono: rowData.telefono || ''
                  }
                : undefined
            }
          />
        </Dialog>
        {/* Modal de Sedes Asignadas */}
        <SedesAsignadasModal
          visible={showSedesAsignadas}
          onHide={() => setShowSedesAsignadas(false)}
          usuario={rowData}
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
    </>
  )
}

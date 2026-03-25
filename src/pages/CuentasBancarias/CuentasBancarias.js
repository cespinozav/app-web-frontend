import React, { useEffect, useState } from 'react'
import useToast from 'hooks/useToast'
import CuentaBancariaModal from './components/Modals/CuentaBancariaModal';
import CuentasBancariasTable from './components/Tables/CuentasBancariasTable';
import BancoService from '../../services/Bancos'
import TiposCuentaBancariaService from '../../services/TiposCuentaBancaria'
import CuentasBancariasService from '../../services/CuentasBancarias'
import { Button } from 'primereact/button'
import EstadoBadge from 'components/styles/EstadoBadge'
import './style.scss'

const PAGE_SIZE = 10;

function CuentasBancarias() {
    const [bancosLoading, setBancosLoading] = useState(false)
    const [cuentas, setCuentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [estado, setEstado] = useState('');
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 10

    // Modal
    const [showAdd, setShowAdd] = useState(false)
    const [showView, setShowView] = useState(false)
    const [viewCuenta, setViewCuenta] = useState(null)
    const [bancos, setBancos] = useState([])
    const [tiposCuenta, setTiposCuenta] = useState([])
    const [form, setForm] = useState({
      banco: null,
      tipoCuenta: null,
      moneda: 'SOL',
      cc: '',
      cci: '',
      alias: ''
    })

    // Actualizar alias automáticamente al seleccionar banco o cc
    useEffect(() => {
      if (showAdd) {
        let bancoNombre = '';
        if (form.banco && bancos.length > 0) {
          const bancoObj = bancos.find(b => b.id === form.banco);
          if (bancoObj) bancoNombre = bancoObj.descripcion;
        }
        let cc4 = form.cc && form.cc.length >= 4 ? form.cc.slice(-4) : '';
        if (bancoNombre && cc4) {
          const nuevoAlias = `${bancoNombre} ****${cc4}`;
          if (form.alias !== nuevoAlias) {
            setForm(f => ({ ...f, alias: nuevoAlias }));
          }
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.banco, form.cc, showAdd, bancos]);
    const [formErrors, setFormErrors] = useState({})
    const toast = useToast()

    useEffect(() => {
      CuentasBancariasService.get()
        .then(data => {
          setCuentas(Array.isArray(data) ? data : (data.results || []))
        })
        .finally(() => setLoading(false))
    }, [])

    // Cargar bancos y tipos de cuenta solo al abrir el modal
    useEffect(() => {
      if (showAdd) {
        setBancosLoading(true)
        BancoService.get().then(data => {
          window.console.log('RESPUESTA BANCO SERVICE:', data)
          if (data && data.result && Array.isArray(data.result.results)) {
            setBancos(data.result.results)
          } else {
            setBancos([])
          }
        }).finally(() => setBancosLoading(false))
        TiposCuentaBancariaService.get().then(data => {
          window.console.log('RESPUESTA TIPOS CUENTA SERVICE:', data)
          if (data && data.result && Array.isArray(data.result.results)) {
            setTiposCuenta(data.result.results)
          } else {
            setTiposCuenta([])
          }
        }).catch(() => setTiposCuenta([]))
      }
    }, [showAdd])

    if (loading) return <div>Cargando...</div>

    // Filtros simulados
    const estados = [
      { label: 'Todos', value: '' },
      { label: 'Pendiente', value: 'Pendiente' },
      { label: 'Confirmado', value: 'Confirmado' }
    ]

    // Paginación simulada
    const cuentasFiltradas = cuentas.filter(c =>
      (!search || c.alias.toLowerCase().includes(search.toLowerCase()) || c.entidad_bancaria.toLowerCase().includes(search.toLowerCase())) &&
      (!estado || c.estado === estado)
    )
    const totalRecords = cuentasFiltradas.length
    const cuentasPage = cuentasFiltradas.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    console.log('BANCOS PARA DROPDOWN:', bancos)

  // Validación simple
  const validateForm = () => {
    const errors = {}
    if (!form.banco) errors.banco = 'Selecciona un banco'
    if (!form.tipoCuenta) errors.tipoCuenta = 'Selecciona tipo de cuenta'
    if (!form.moneda) errors.moneda = 'Selecciona moneda'
    if (!form.cc || form.cc.length < 10) errors.cc = 'Ingresa mínimo 10 números'
    if (!form.cci || form.cci.length < 20) errors.cci = 'Ingresa mínimo 20 números'
    if (!form.alias) errors.alias = 'Ingresa un alias'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAddCuenta = async () => {
    if (!validateForm()) return
    try {
      const body = {
        alias: form.alias,
        entidad_bancaria: form.banco,
        tipo_cuenta: form.tipoCuenta,
        moneda: form.moneda,
        cc: form.cc,
        cci: form.cci
      }
      await CuentasBancariasService.post(body)
      // Refrescar listado
      const cuentasActualizadas = await CuentasBancariasService.get()
      setCuentas(Array.isArray(cuentasActualizadas) ? cuentasActualizadas : (cuentasActualizadas.results || []))
      toast.success('Cuenta bancaria agregada con éxito')
      setShowAdd(false)
      setForm({ banco: null, tipoCuenta: null, moneda: 'SOL', cc: '', cci: '', alias: '' })
      setFormErrors({})
    } catch (error) {
      // Mostrar mensaje de error del backend en toast rojo
      let msg = error?.message || error?.result?.message || 'Error al guardar cuenta bancaria'
      toast.error(msg)
      // Si quieres mantener el modal abierto para corregir, no cierres el modal ni limpies el form
    }
  }

  return (
    <div className="ordenes-listado">
      <div className="header-ordenes">
        <h2>LISTADO DE CUENTAS BANCARIAS</h2>
        <div className="acciones">
          <button className="add" onClick={() => setShowAdd(true)}>Agregar Cuenta +</button>
        </div>
      </div>
      <CuentaBancariaModal
        visible={showAdd}
        onHide={() => setShowAdd(false)}
        form={form}
        formErrors={formErrors}
        bancos={bancos}
        tiposCuenta={tiposCuenta}
        bancosLoading={bancosLoading}
        onChange={setForm}
        onSubmit={handleAddCuenta}
        readOnly={false}
      />
      <CuentaBancariaModal
        visible={showView}
        onHide={() => setShowView(false)}
        form={viewCuenta || {}}
        formErrors={{}}
        bancos={bancos}
        tiposCuenta={tiposCuenta}
        bancosLoading={false}
        onChange={() => {}}
        onSubmit={() => {}}
        readOnly={true}
      />
      <div className="filtros-ordenes">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <input
            placeholder="Buscar por alias o banco"
            className="p-inputtext p-component"
            value={search}
            onChange={e => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label htmlFor="estado-filter" style={{ minWidth: 60 }}>Estado</label>
          <select
            id="estado-filter"
            className="p-inputtext p-component"
            style={{ minWidth: 180 }}
            value={estado}
            onChange={e => {
              setEstado(e.target.value)
              setPage(1)
            }}
          >
            {estados.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
      <CuentasBancariasTable
        cuentas={cuentasPage}
        onView={async cuenta => {
          // Cargar bancos y tipos de cuenta si no están cargados
          let bancosList = bancos;
          let tiposList = tiposCuenta;
          if (!bancos || bancos.length === 0) {
            const bancosResp = await BancoService.get();
            bancosList = bancosResp && bancosResp.result && Array.isArray(bancosResp.result.results) ? bancosResp.result.results : [];
            setBancos(bancosList);
          }
          if (!tiposCuenta || tiposCuenta.length === 0) {
            const tiposResp = await TiposCuentaBancariaService.get();
            tiposList = tiposResp && tiposResp.result && Array.isArray(tiposResp.result.results) ? tiposResp.result.results : [];
            setTiposCuenta(tiposList);
          }
          // Buscar el id del banco y tipo de cuenta según el nombre
          let bancoId = cuenta.entidad_bancaria;
          if (bancosList && bancosList.length > 0) {
            const bancoObj = bancosList.find(b => b.descripcion === cuenta.entidad_bancaria_desc || b.id === cuenta.entidad_bancaria);
            if (bancoObj) bancoId = bancoObj.id;
          }
          let tipoCuentaId = cuenta.tipo_cuenta;
          if (tiposList && tiposList.length > 0) {
            const tipoObj = tiposList.find(t => t.descripcion === cuenta.tipo_cuenta_desc || t.id === cuenta.tipo_cuenta);
            if (tipoObj) tipoCuentaId = tipoObj.id;
          }
          setViewCuenta({
            ...cuenta,
            banco: bancoId,
            tipoCuenta: tipoCuentaId,
          });
          setShowView(true);
        }}
      />
      <div className="paginate">
        <div className="p-paginator p-component">
          <button type="button" className="p-paginator-first p-paginator-element p-link" disabled={page === 1} onClick={() => setPage(1)} aria-label="First Page">
            <span className="p-paginator-icon pi pi-angle-double-left"></span>
          </button>
          <button type="button" className="p-paginator-prev p-paginator-element p-link" disabled={page === 1} onClick={() => setPage(page - 1)} aria-label="Previous Page">
            <span className="p-paginator-icon pi pi-angle-left"></span>
          </button>
          <span className="p-paginator-pages">
            <button type="button" className="p-paginator-page p-paginator-element p-link p-paginator-page-start p-paginator-page-end p-highlight" aria-label={`Page ${page}`}>{page}</button>
          </span>
          <button type="button" className="p-paginator-next p-paginator-element p-link" disabled={page * PAGE_SIZE >= totalRecords} onClick={() => setPage(page + 1)} aria-label="Next Page">
            <span className="p-paginator-icon pi pi-angle-right"></span>
          </button>
          <button type="button" className="p-paginator-last p-paginator-element p-link" disabled={page * PAGE_SIZE >= totalRecords} onClick={() => setPage(Math.ceil(totalRecords / PAGE_SIZE))} aria-label="Last Page">
            <span className="p-paginator-icon pi pi-angle-double-right"></span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CuentasBancarias

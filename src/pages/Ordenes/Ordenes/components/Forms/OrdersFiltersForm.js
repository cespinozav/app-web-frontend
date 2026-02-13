import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'

export default function OrdersFiltersForm({
  search,
  setSearch,
  setPage,
  state,
  setState,
  stateOptions,
  dateIni,
  setDateIni,
  dateFin,
  setDateFin
}) {
  return (
    <div className="filtros-ordenes">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          placeholder="Buscar por cliente o sede"
          value={search}
          onChange={e => {
            setSearch(e.target.value)
            setPage(1)
          }}
        />
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <label htmlFor="date-ini-filter" style={{ minWidth: 90 }}>
          Fecha inicio
        </label>
        <InputText
          id="date-ini-filter"
          type="date"
          value={dateIni}
          onChange={e => {
            setDateIni(e.target.value)
            setPage(1)
          }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <label htmlFor="date-fin-filter" style={{ minWidth: 70 }}>
          Fecha fin
        </label>
        <InputText
          id="date-fin-filter"
          type="date"
          value={dateFin}
          min={dateIni || undefined}
          onChange={e => {
            setDateFin(e.target.value)
            setPage(1)
          }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <label htmlFor="estado-filter" style={{ minWidth: 60 }}>
          Estado
        </label>
        <Dropdown
          id="estado-filter"
          value={state}
          options={stateOptions}
          onChange={e => {
            setState(e.value)
            setPage(1)
          }}
          placeholder="Estado"
          style={{ minWidth: 180 }}
        />
      </div>
    </div>
  )
}

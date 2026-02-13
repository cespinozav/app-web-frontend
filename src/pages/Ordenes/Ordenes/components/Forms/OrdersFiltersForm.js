import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'

export default function OrdersFiltersForm({ search, setSearch, setPage, state, setState, stateOptions }) {
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

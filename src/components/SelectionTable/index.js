import { Checkbox } from 'primereact/checkbox'

function SelectionTable({ data, emptyMessage, onSelectionChange, selected, className, name }) {
  const rows = data.value
  const onChange = e => {
    let auxSelected = [...selected]
    if (e.checked) {
      auxSelected.push(e.value)
    } else {
      auxSelected = auxSelected.filter(a => a.id !== e.value.id)
    }
    onSelectionChange(auxSelected)
  }
  return (
    <div className={`table-selection ${className || ''}`}>
      <div className="titles">
        <Checkbox
          name={name}
          onChange={e => onSelectionChange(e.checked ? rows : [])}
          checked={selected.length === rows.length}
        />
        {data.schema.map((s, idx) => (
          <div key={`t-${idx}`}>{s.header}</div>
        ))}
      </div>
      <div className="body">
        {rows.length > 0 ? (
          rows.map(row => (
            <div className="rows" key={row.id}>
              <Checkbox name={name} value={row} onChange={onChange} checked={selected.some(s => s.id === row.id)} />
              {data.schema.map((s, idx) => (
                <div key={`${row.id}-${idx}`}>{row[s.field]}</div>
              ))}
            </div>
          ))
        ) : (
          <div>{emptyMessage || 'No hay resultados'}</div>
        )}
      </div>
    </div>
  )
}

export default SelectionTable

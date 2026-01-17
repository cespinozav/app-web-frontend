import { Dropdown } from 'primereact/dropdown'
import { useController } from 'react-hook-form'

export default function FormDropdown({ control, name, rules, options, emptyMessage, onSelect }) {
  const {
    field,
    fieldState: { error }
  } = useController({
    name,
    control,
    rules
  })
  return (
    <Dropdown
      id={field.name}
      value={field.value}
      options={[{ value: '', label: 'Seleccione' }, ...options]}
      onChange={e => {
        const { value } = e
        if (onSelect) {
          onSelect(value)
        }
        field.onChange(value)
      }}
      emptyMessage={emptyMessage || 'No hay resultados'}
      className={`dropdown ${error ? 'p-invalid' : ''}`}
    />
  )
}

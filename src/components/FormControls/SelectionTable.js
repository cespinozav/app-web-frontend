import SelectionTable from 'components/SelectionTable'
import { useController } from 'react-hook-form'

function FormSelectionTable({ name, control, rules, onSelect, ...selectionProps }) {
  const { field, fieldState } = useController({
    name,
    control,
    rules
  })
  const onSelectionChange = selections => {
    if (onSelect) {
      onSelect(selections)
    }
    field.onChange(selections)
  }
  return (
    <SelectionTable
      {...selectionProps}
      name={name}
      className={fieldState.error ? 'p-invalid' : ''}
      onSelectionChange={onSelectionChange}
      selected={field.value}
    />
  )
}

export default FormSelectionTable

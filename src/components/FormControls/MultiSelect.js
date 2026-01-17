import { useController } from 'react-hook-form'
import MultiSelect from '../MultiSelect'

export default function MultiSelectStyled({ name, control, rules, options, ...props }) {
  const { field, fieldState } = useController({
    name,
    control,
    rules
  })
  const onChange = value => {
    if (props.onSelection) {
      const curr = value?.target?.value || value
      props.onSelection(curr)
    }
    field.onChange(value)
  }
  return (
    <MultiSelect
      {...props}
      options={options}
      className={`multiselect ${fieldState.error ? 'p-invalid' : ''}`}
      inputId={name}
      value={field.value}
      onChange={e => onChange(e.value)}
    />
  )
}

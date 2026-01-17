import { useController } from 'react-hook-form'
import { classNames } from 'primereact/utils'
import { Checkbox } from 'primereact/checkbox'

export default function FormCheckbox({ rules, name, control, ...props }) {
  const { field, fieldState } = useController({
    name,
    control,
    rules
  })
  return (
    <Checkbox
      {...props}
      inputId={field.name}
      onChange={e => field.onChange(e.checked)}
      checked={field.value}
      className={classNames({ 'p-invalid': fieldState.error })}
    />
  )
}

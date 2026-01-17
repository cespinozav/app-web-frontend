import { InputNumber } from 'primereact/inputnumber'
import { classNames } from 'primereact/utils'
import { useController } from 'react-hook-form'

export default function FormInputNumber({ control, name, rules, ...inputProps }) {
  const { field, fieldState } = useController({
    name,
    control,
    rules
  })
  return (
    <InputNumber
      locale="en-US"
      {...inputProps}
      id={field.name}
      value={field.value}
      onBlur={field.onBlur}
      onValueChange={e => field.onChange(e.value)}
      className={classNames({ 'p-invalid': fieldState.error })}
    />
  )
}

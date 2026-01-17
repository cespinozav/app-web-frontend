import { InputText } from 'primereact/inputtext'
import { classNames } from 'primereact/utils'
import { useController } from 'react-hook-form'

export default function FormInput({ control, name, rules, ...inputProps }) {
  const { field, fieldState } = useController({
    name,
    control,
    rules
  })
  return (
    <InputText
      {...inputProps}
      id={field.name}
      {...field}
      autoComplete="off"
      className={classNames({ 'p-invalid': fieldState.error })}
    />
  )
}

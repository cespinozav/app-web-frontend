import { InputTextarea } from 'primereact/inputtextarea'
import { classNames } from 'primereact/utils'
import { useController } from 'react-hook-form'

export default function FormInput({ control, name, rules, ...inputProps }) {
  const { field, fieldState } = useController({
    name,
    control,
    rules
  })
  return (
    <InputTextarea
      {...inputProps}
      id={field.name}
      {...field}
      className={classNames({ 'p-invalid': fieldState.error })}
    />
  )
}

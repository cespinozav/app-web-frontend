import { useController } from 'react-hook-form'
import { classNames } from 'primereact/utils'
import AutoComplete from '../AutoComplete'

export default function FormAutoComplete({ request, rules, name, control, ...props }) {
  const { field, fieldState } = useController({
    name,
    control,
    rules
  })
  return (
    <AutoComplete
      {...props}
      request={request}
      name={field.name}
      value={field.value}
      setValue={field.onChange}
      className={classNames({ 'p-invalid': fieldState.error })}
    />
  )
}

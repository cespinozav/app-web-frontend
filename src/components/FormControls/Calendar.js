import { Calendar } from 'primereact/calendar'
import { classNames } from 'primereact/utils'
import { useController } from 'react-hook-form'

export default function FormCalendar({ control, name, rules, onSelections, calendarProps }) {
  const { field, fieldState } = useController({
    name,
    control,
    rules
  })
  const onChange = value => {
    if (onSelections) {
      onSelections(value)
    }
    field.onChange(value)
  }
  return (
    <Calendar
      {...calendarProps}
      id={field.name}
      value={field.value}
      onChange={e => onChange(e.value)}
      className={classNames({ 'p-invalid': fieldState.error })}
    />
  )
}

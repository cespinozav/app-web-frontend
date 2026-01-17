import { useWatch } from 'react-hook-form'
import { FormDropdown, FormInputNumber } from 'components/FormControls'
import { useEffect, useMemo } from 'react'
import { KIT_STATUS, KIT_STATUSES, LINE_STATUS, LINE_STATUSES } from 'utils/constants'

export function ConditionalDropDown({ options, control, name, filterField, resetField, ...props }) {
  const filterFieldVal = useWatch({ control, name: filterField })
  const filteredOptions = options.filter(a => a[filterField] === filterFieldVal) || []
  useEffect(() => {
    if (filteredOptions.length === 0) {
      resetField(name)
    }
  }, [filteredOptions.length])
  return <FormDropdown {...props} name={name} control={control} options={filteredOptions} />
}

export function LineStatusDropdown({ control, setValue }) {
  const kitStatus = useWatch({ control, name: 'kitStatus' })
  const lineStatusesOptions = useMemo(
    () => (kitStatus === KIT_STATUS.CANCELED.value ? [LINE_STATUS.CANCELED] : LINE_STATUSES),
    [kitStatus]
  )

  return (
    <FormDropdown
      name="lineStatus"
      control={control}
      onSelect={value => {
        if (value === LINE_STATUS.CANCELED.value) {
          setValue('kitStatus', LINE_STATUS.CANCELED.value)
        }
      }}
      rules={{ required: 'Estado de linea no seleccionado' }}
      options={lineStatusesOptions}
    />
  )
}

export function KitStatusDropdown({ control, setValue }) {
  const lineStatus = useWatch({ control, name: 'lineStatus' })
  return (
    <FormDropdown
      name="kitStatus"
      control={control}
      onSelect={value => {
        if (value === KIT_STATUS.CANCELED.value) {
          setValue('lineStatus', LINE_STATUS.CANCELED.value)
        } else if (lineStatus === LINE_STATUS.CANCELED.value) {
          setValue('lineStatus', '')
        }
      }}
      rules={{ required: 'Estado de equipo no seleccionado' }}
      options={KIT_STATUSES}
    />
  )
}

export function AdditionalServiceDropDown({ control, name, options, resetField, ...props }) {
  const otherFieldName = name === 'additional1' ? 'additional2' : 'additional1'
  const operatorId = useWatch({ control, name: 'operatorId' })
  const otherFieldValue = useWatch({ control, name: otherFieldName })
  const filteredAdditionals = options.filter(a => a.operatorId === operatorId && a.value !== otherFieldValue) ?? []
  useEffect(() => {
    if (filteredAdditionals.length === 0) {
      resetField(name)
    }
  }, [filteredAdditionals.length])
  return <FormDropdown {...props} name={name} control={control} options={filteredAdditionals} />
}

export function DConditionalDropDown({ options, control, name, field1, field2, resetField, ...props }) {
  const fieldVal1 = useWatch({ control, name: field1 })
  const fieldVal2 = useWatch({ control, name: field2 })
  const filteredOptions = options.filter(a => a[field1] === fieldVal1 && a[field2] === fieldVal2) || []
  useEffect(() => {
    if (filteredOptions.length === 0) {
      resetField(name)
    }
  }, [filteredOptions.length])
  return <FormDropdown {...props} name={name} control={control} options={filteredOptions} />
}

export function LineStatusDays({ control }) {
  const lineStatus = useWatch({ control, name: 'lineStatus' })
  let header = ''
  if (lineStatus === 'S') {
    header = 'suspensión'
  } else if (lineStatus === 'B') {
    header = 'bloqueo'
  }
  const title = `Días x ${header} de línea:`
  return (
    header && (
      <>
        <label htmlFor="lineStatusDays">{title}</label>
        <FormInputNumber
          name="lineStatusDays"
          control={control}
          rules={{
            max: {
              value: 62,
              message: `Máx. ${header} de 62 días`
            },
            min: { value: 1, message: `Mín. ${header} es de 1 día` }
          }}
        />
      </>
    )
  )
}

import { useForm, useWatch } from 'react-hook-form'
import { FormCalendar, FormInput, FormMultiSelect, FormSelectionTable } from 'components/FormControls'
import { useEffect, useRef, useState } from 'react'
import { formatNumber } from 'utils/numbers'
import { Skeleton } from 'primereact/skeleton'
import { LicenseService } from 'services'
import useToast from 'hooks/useToast'
import { useQueries } from '@tanstack/react-query'
import { Checkbox } from 'primereact/checkbox'

const DEFAULT_FIELDS = {
  userRed: '',
  licenseTypes: [],
  licenses: [],
  observation: '',
  dates: null
}

function calcTotalAmount(selections) {
  return selections.map(s => parseFloat(s.amount)).reduce((acc, curr) => acc + curr, 0)
}

function getTotalAmount(selections) {
  const groupByCurrency = {}
  selections.forEach(({ currency, ...s }) => {
    if (!groupByCurrency[currency]) {
      groupByCurrency[currency] = []
    }
    groupByCurrency[currency].push(s)
  })
  const totalAmounts = Object.entries(groupByCurrency).map(([currency, selectionByCurr]) => {
    const totalAmountByCurr = calcTotalAmount(selectionByCurr)
    return `${currency} ${formatNumber(totalAmountByCurr)}`
  })
  return totalAmounts.join(' + ') || 0
}

function TotalAmount({ control, licenseTypesName, filteredLicenseTypes }) {
  const filteredIds = filteredLicenseTypes.map(fl => fl.value)
  const licenseTypes = useWatch({ control, name: licenseTypesName }).filter(lt => filteredIds.includes(lt.id))
  const totalAmount = getTotalAmount(licenseTypes)
  return <div className="amount">{totalAmount}</div>
}

function formatSubmitData(formData, isNullPeriod) {
  const newFormData = { ...formData }
  newFormData.licenseTypes = newFormData.licenseTypes.filter(lt => newFormData.licenses.includes(lt.licenseId))
  newFormData.dates = (!isNullPeriod && formData.dates) || []
  const [startDate, endDate] = newFormData.dates
  delete newFormData.dates
  return { ...newFormData, startDate, endDate }
}

function useLicenseAssignmentInfo(personId) {
  const toast = useToast()
  const [typesQuery, assignmentsQuery] = useQueries({
    queries: [
      {
        queryKey: [LicenseService.typeLicense.id],
        queryFn: LicenseService.typeLicense.get,
        // staleTime: Infinity,
        onError: err => (err ? toast.error(String(err)) : toast.error(err))
      },
      {
        queryKey: [LicenseService.assignments.id, { personId }],
        queryFn: ({ signal }) => LicenseService.assignments.get({ signal, personId }),
        // staleTime: Infinity,
        onError: err => (err ? toast.error(String(err)) : toast.error(err))
      }
    ]
  })
  const groupByLicenseId = {}
  const licenseTypes = []
  typesQuery.data?.forEach(({ licenseId, licenseName, ...item }) => {
    if (!groupByLicenseId[licenseId]) {
      groupByLicenseId[licenseId] = { label: licenseName, value: licenseId }
    }
    licenseTypes.push({
      value: item.id,
      label: item.description,
      amount: item.amount,
      currency: item.currencyName,
      licenseId,
      id: item.id
    })
  })
  const assignmentRows = assignmentsQuery?.data?.data || []
  const prevAssignment = assignmentRows?.length > 0 ? assignmentRows[0] : null
  return {
    data: { licenses: Object.values(groupByLicenseId), licenseTypes, prevAssignment },
    isLoading: Boolean(typesQuery.isFetching || assignmentsQuery.isFetching),
    isSuccess: Boolean(typesQuery.isFetched && assignmentsQuery.isFetched)
  }
}

function parseDefaultFields(defaultFields) {
  if (!defaultFields) return DEFAULT_FIELDS
  const { userRed, observation, startDate, endDate } = defaultFields
  const assignedLicenses = defaultFields.licenses.map(l => l.id)
  const assignedTypes = defaultFields.licenses
    .map(al =>
      al.types.map(t => ({
        label: t.name,
        value: t.id,
        currency: t.currency,
        id: t.id,
        licenseId: al.id,
        amount: t.amount
      }))
    )
    .flat()
  const defaultValues = {
    userRed,
    licenseTypes: assignedTypes,
    licenses: assignedLicenses,
    observation,
    dates: startDate && endDate ? [new Date(startDate), new Date(endDate)] : null
  }
  return defaultValues
}

function parseSubmitFields(submitFields) {
  if (!submitFields) return null
  const { startDate, endDate } = submitFields
  const prevFields = {}
  Object.keys(DEFAULT_FIELDS).forEach(key => {
    prevFields[key] = submitFields[key] || DEFAULT_FIELDS[key]
  })
  prevFields.dates = startDate && endDate ? [new Date(startDate), new Date(endDate)] : null
  return prevFields
}

function getAssignedTypes(licenseTypes, { licenses }) {
  return licenseTypes.filter(lt => licenses.includes(lt.licenseId))
}

export default function AssignmentForm({
  onSubmitFields,
  handleError,
  defaultFields,
  submitFields,
  isEditing,
  saveDefault
}) {
  const prevAssignmentRef = useRef(null)
  const newDefault = useRef(parseDefaultFields({ ...DEFAULT_FIELDS, ...defaultFields }))
  const [options, setOptions] = useState({
    licenses: [],
    licenseTypes: [],
    filteredLicenseTypes: []
  })
  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: DEFAULT_FIELDS
  })
  const [isNullPeriod, setIsNullPeriod] = useState(false)

  const { isLoading, data, isSuccess } = useLicenseAssignmentInfo(defaultFields.personId)
  useEffect(() => {
    if (!isSuccess) return
    const { licenses, licenseTypes, prevAssignment } = data
    const isNewUser = !isEditing && !prevAssignment
    if (!isNewUser) {
      prevAssignmentRef.current = prevAssignment
      newDefault.current = parseDefaultFields(prevAssignment)
    }
    const defaultValues = parseSubmitFields(submitFields) || { ...newDefault.current }
    if (!defaultValues.dates && (!isNewUser || submitFields?.licenses)) {
      setIsNullPeriod(true)
      defaultValues.dates = 1
    } else {
      setIsNullPeriod(false)
    }
    if (saveDefault) {
      saveDefault(formatSubmitData(newDefault.current))
    }
    const filteredLicenseTypes = getAssignedTypes(licenseTypes, defaultValues)
    setOptions({ ...options, licenses, licenseTypes, filteredLicenseTypes })
    reset(defaultValues)
  }, [isLoading])

  function onSubmit(formData) {
    const newFormData = formatSubmitData(formData, isNullPeriod)
    onSubmitFields({ ...newFormData, prevFields: prevAssignmentRef.current })
    reset(newDefault.current)
  }
  return (
    <form onSubmit={handleSubmit(onSubmit, handleError)}>
      <div className="section">
        <div className="content">
          <div className="simple-row">
            <label htmlFor="userRed">Usuario:</label>
            <FormInput name="userRed" control={control} disabled={true} />
          </div>
          <div className="simple-row">
            <label htmlFor="licenses">Licencia:</label>
            <div style={{ padding: 0 }}>
              <FormMultiSelect
                name="licenses"
                options={options.licenses}
                style={{ width: '14rem' }}
                onSelection={selection => {
                  const filteredLicenseTypes =
                    selection?.map(s => options.licenseTypes.filter(lt => lt.licenseId === s)).flat() || []
                  setOptions(o => ({ ...o, filteredLicenseTypes }))
                }}
                control={control}
                rules={{
                  required: 'Licencia no seleccionada'
                }}
              />
            </div>
          </div>
          {!isLoading ? (
            <FormSelectionTable
              control={control}
              name="licenseTypes"
              rules={{
                validate: list => (list.length === 0 ? 'Tipos de licencia no seleccionada' : null)
              }}
              data={{
                value: options.filteredLicenseTypes,
                schema: [
                  { field: 'label', header: 'Tipo' },
                  { field: 'amount', header: 'Valor de venta' },
                  { field: 'currency', header: 'Moneda' }
                ]
              }}
            />
          ) : (
            <div className="table-row">
              {Array.from({ length: 3 }).map((_, key) => (
                <Skeleton key={key}></Skeleton>
              ))}
            </div>
          )}
          <div className="simple-row">
            <label htmlFor="type">Total:</label>
            <TotalAmount
              licenseTypesName="licenseTypes"
              control={control}
              filteredLicenseTypes={options.filteredLicenseTypes}
            />
          </div>
          <div className="simple-row">
            <label htmlFor="isNullPeriod">Periodo indefinido:</label>
            <div>
              <Checkbox
                id="isNullPeriod"
                checked={isNullPeriod}
                onChange={e => {
                  const { checked } = e
                  if (checked) {
                    setValue('dates', 1)
                  } else {
                    setValue('dates', null)
                  }
                  setIsNullPeriod(checked)
                }}
              />
            </div>
          </div>
          <div className="simple-row">
            <label htmlFor="dates">Vigencia:</label>
            <FormCalendar
              name="dates"
              control={control}
              rules={{
                required: 'Fechas de vigencia no seleccionadas'
              }}
              calendarProps={{
                selectionMode: 'range',
                readOnlyInput: true,
                // dateFormat: 'd-M-yy',
                dateFormat: 'dd/mm/yy',
                disabled: isNullPeriod
              }}
            />
          </div>
          <div className="simple-row">
            <label htmlFor="observation">Observacion:</label>
            <FormInput
              control={control}
              name="observation"
              rules={{
                required: 'Observación no ingresada',
                maxLength: { value: 500, message: 'Observacion debe tener 500 caracteres como máximo' }
              }}
            />
          </div>
        </div>
      </div>
      <div className="buttons">
        <button type="submit" className="button" disabled={isLoading}>
          Guardar
        </button>
      </div>
    </form>
  )
}

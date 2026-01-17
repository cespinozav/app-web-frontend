import { Button } from 'primereact/button'
import { EMAIL_TYPES, USER_STATUS } from 'utils/constants'
import { useForm, useWatch } from 'react-hook-form'
import {
  FormCalendar,
  FormAutoComplete,
  FormMultiSelect,
  FormDropdown,
  FormInput,
} from 'components/FormControls'
import { useUrlParams } from 'hooks/useUrlParams'
import { formatSearchDate, parseToDate } from 'utils/dates'
import { useEffect, useState } from 'react'
import { LicenseService } from 'services'
import useToast from 'hooks/useToast'
import { useQuery } from 'hooks/useRequest'
import { ERROR_TAGS } from 'utils/exceptions'

export const DEFAULT_FIELDS = {
  userRed: '',
  email: '',
  licenseType: '',
  license: '',
  dates: null,
  ceco: '',
  cecoDesc: '',
  emailType: '',
  userState: '',
}

export function parseSearch(search) {
  const data = { ...search }
  data.dates = data.fromDate
    ? [data.fromDate, data.toDate].map((d) => (d ? parseToDate(d, '-') : null))
    : DEFAULT_FIELDS.dates
  delete data.fromDate
  delete data.toDate
  return { ...DEFAULT_FIELDS, ...data }
}

function formatSearch(formData) {
  const newFormData = { ...formData }
  if (formData.dates && formData.dates.length > 0) {
    newFormData.fromDate = formatSearchDate(formData.dates[0])
    if (formData.dates[1]) {
      newFormData.toDate = formatSearchDate(formData.dates[1])
    }
  }
  delete newFormData.dates
  return newFormData
}

export default function SearchForm({
  isLoading,
  searchLicenses,
  clearLicenses,
}) {
  const [searchParams, setSearchParams] = useUrlParams({
    ...DEFAULT_FIELDS,
    fromDate: '',
    toDate: '',
  })
  const toast = useToast()
  const { control, handleSubmit, reset, setValue, getValues } = useForm({
    defaultValues: DEFAULT_FIELDS,
  })
  const [options, setOptions] = useState({
    licenses: [],
    licenseTypes: [],
    filteredLicenseTypes: [],
  })
  const { data } = useQuery(
    [LicenseService.typeLicense.id],
    LicenseService.typeLicense.get,
  )
  useEffect(() => {
    if (data) {
      const licenses = []
      const licenseTypes = []
      data.forEach((item) => {
        licenseTypes.push({
          value: String(item.id),
          label: item.description,
          license: item.licenseId,
        })
        if (licenses.findIndex((lc) => lc.value === item.licenseId) < 0) {
          licenses.push({ value: item.licenseId, label: item.licenseName })
        }
      })
      setOptions((o) => ({
        ...o,
        licenses,
        licenseTypes,
        filteredLicenseTypes: licenseTypes,
      }))
      reset(parseSearch(searchParams))
    }
  }, [data])

  const licensesVal = useWatch({ control, name: 'license' })
  useEffect(() => {
    const filteredLicenses = options.licenseTypes.filter(
      (lt) => licensesVal === '' || lt.license === licensesVal,
    )
    setOptions((o) => ({ ...o, filteredLicenses }))
    setValue(
      'licenseType',
      licensesVal ? filteredLicenses.map((lt) => lt.value) : [],
    )
  }, [licensesVal, options.licenseTypes])

  const [isReporting, setIsReporting] = useState(false)
  function onDownload() {
    const formData = getValues()
    const newFormData = formatSearch(formData)
    if (newFormData) {
      newFormData.excel = true
      setIsReporting(true)
      LicenseService.assignments
        .get(newFormData)
        .catch((err) => {
          if (err?.name === ERROR_TAGS.VOID_REPORT.TAG) {
            toast.warn(err.message)
          } else {
            toast.error(String(err))
          }
        })
        .finally(() => {
          setIsReporting(false)
        })
    }
  }

  function onSubmit(formData) {
    const newFormData = formatSearch(formData)
    if (newFormData) {
      setSearchParams(newFormData)
      searchLicenses(newFormData)
    }
  }
  function handleError(errors) {
    const messages = Object.values(errors)
      .slice(0, 4)
      .map((e) => e.message)
    toast.error(messages)
  }
  return (
    <form className="form" onSubmit={handleSubmit(onSubmit, handleError)}>
      <div className="form-group">
        <div>
          <label htmlFor="userRed">Usuario:</label>
          <FormAutoComplete
            request={LicenseService.filters.usernet}
            minLength={1}
            name="userRed"
            control={control}
          />
        </div>
        <div>
          <label htmlFor="email">Correo:</label>
          <FormAutoComplete
            request={LicenseService.filters.mail}
            name="email"
            control={control}
          />
        </div>
        <div>
          <label htmlFor="license">Licencia:</label>
          <FormDropdown
            name="license"
            control={control}
            options={options.licenses}
          />
        </div>
        <div>
          <label htmlFor="licenseType">Tipo de Licencia:</label>
          <FormMultiSelect
            name="licenseType"
            options={options.filteredLicenses}
            style={{ width: '18rem' }}
            control={control}
          />
        </div>
        <div>
          <label htmlFor="dates">Periodo:</label>
          <FormCalendar
            name="dates"
            control={control}
            calendarProps={{
              selectionMode: 'range',
              readOnlyInput: true,
              dateFormat: 'dd/mm/yy'
            }}
          />
        </div>
        <div>
          <label htmlFor="userState">Estado Usuario:</label>
          <FormMultiSelect
            name="userState"
            options={USER_STATUS}
            style={{ width: '18rem' }}
            control={control}
          />
        </div>
        <div className="action">
          <Button
            icon="pi pi-filter-slash"
            className="icon-button"
            onClick={(e) => {
              e.preventDefault()
              setSearchParams({})
              reset(DEFAULT_FIELDS)
              clearLicenses()
            }}
          />
        </div>
        <div className="action">
          <Button
            icon="pi pi-download"
            type="button"
            className="icon-button"
            loading={isReporting}
            onClick={onDownload}
          />
        </div>
      </div>
      <div className="form-group">
        <div>
          <label htmlFor="ceco">CeCo:</label>
          <FormInput control={control} name="ceco" />
        </div>
        <div>
          <label htmlFor="cecoDesc">Desc. CeCo:</label>
          <FormInput control={control} name="cecoDesc" />
        </div>
        <div>
          <label htmlFor="emailType">Tipo de correo:</label>
          <FormDropdown
            name="emailType"
            control={control}
            options={EMAIL_TYPES}
          />
        </div>
        <div className="primary-button">
          <Button
            label="Buscar"
            loading={isLoading}
            className="search"
            loadingIcon="pi pi-spin pi-spinner"
            icon="pi pi-search"
            iconPos="right"
            type="submit"
          />
        </div>
      </div>
    </form>
  )
}

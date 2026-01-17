import { FormCalendar, FormDropdown, FormInput, FormMultiSelect } from 'components/FormControls'
import { useQuery } from 'hooks/useRequest'
import useToast from 'hooks/useToast'
import { Button } from 'primereact/button'
import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { LicenseService } from 'services'
import { formatSearchDate } from 'utils/dates'
import { ERROR_TAGS } from 'utils/exceptions'

export const DEFAULT_FIELDS = {
  licenseType: '',
  license: '',
  dates: null,
  ceco: '',
  cecoDesc: ''
}

export default function AssignmentReport() {
  const [isSearching, setIsSearching] = useState(false)
  const toast = useToast()
  const { control, handleSubmit, reset, setValue } = useForm({ defaultValues: DEFAULT_FIELDS })
  // const { data: leasingData, isLoading: leasingLoading } = useQuery([LicenseService.leasing.id], LicenseService.leasing.get)
  // const leasings = leasingData?.map(d => ({ label: d.description, value: d.id })) || []
  // const { data: assetData, isLoading: assetLoading } = useQuery([LicenseService.typeAsset.id], LicenseService.typeAsset.get)
  // const activeTypes = assetData?.map(d => ({ label: d.description, value: d.id })) || []
  const [options, setOptions] = useState({
    licenses: [],
    licenseTypes: [],
    filteredLicenseTypes: []
  })
  const { data, isLoading } = useQuery([LicenseService.typeLicense.id], LicenseService.typeLicense.get)
  useEffect(() => {
    if (data) {
      const licenses = []
      const licenseTypes = []
      data.forEach(item => {
        licenseTypes.push({
          value: String(item.id),
          label: item.description,
          license: item.licenseId
        })
        if (licenses.findIndex(lc => lc.value === item.licenseId) < 0) {
          licenses.push({ value: item.licenseId, label: item.licenseName })
        }
      })
      setOptions(o => ({ ...o, licenses, licenseTypes, filteredLicenseTypes: licenseTypes }))
    }
  }, [data])

  const licensesVal = useWatch({ control, name: 'license' })
  useEffect(() => {
    const filteredLicenses = options.licenseTypes.filter(lt => licensesVal === '' || lt.license === licensesVal)
    setOptions(o => ({ ...o, filteredLicenses }))
    setValue('licenseType', licensesVal ? filteredLicenses.map(lt => lt.value) : [])
  }, [licensesVal, options.licenseTypes])


  const handleError = err => {
    toast.error(String(err))
  }
  const onSubmit = formData => {
    setIsSearching(true)
    const newData = { ...formData }
    if (newData.dates && newData.dates.length > 0) {
      newData.fromDate = formatSearchDate(newData.dates[0])
      if (formData.dates[1]) {
        newData.toDate = formatSearchDate(newData.dates[1])
      }
    }
    delete newData.dates
    newData.excel = true
    LicenseService.assignments
      .get(newData)
      .catch(err => {
        if (err?.name === ERROR_TAGS.VOID_REPORT.TAG) {
          toast.warn(err.message)
        } else {
          toast.error(String(err))
        }
      })
      .finally(() => {
        setIsSearching(false)
      })
  }
  return (
    <form className="form search" onSubmit={handleSubmit(onSubmit, handleError)}>
      <div className="form-group">
        <div>
          <label htmlFor="license">Licencia:</label>
          <FormDropdown name="license" control={control} options={options.licenses} />
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
          <label htmlFor="dates">Rango de fechas:</label>
          <FormCalendar
            name="dates"
            control={control}
            // rules={{
            //   required: 'Fechas de vigencia no seleccionadas',
            //   validate: dates => (dates.length === 2 && dates[0] && dates[1]) || 'Vigencia incompleta'
            // }}
            calendarProps={{
              selectionMode: 'range',
              readOnlyInput: true,
              dateFormat: 'dd/mm/yy',
              showButtonBar: true
            }}
          />
        </div>
        <div>
          <label htmlFor="ceco">CeCo:</label>
          <FormInput control={control} name="ceco" />
        </div>
        <div>
          <label htmlFor="cecoDesc">Desc. CeCo:</label>
          <FormInput control={control} name="cecoDesc" />
        </div>
        <div className="action">
          <Button
            icon="pi pi-filter-slash"
            className="icon-button"
            onClick={e => {
              e.preventDefault()
              reset(DEFAULT_FIELDS)
            }}
          />
        </div>
        <div className="primary-button">
          <Button
            label="Generar reporte"
            loading={isSearching || isLoading}
            disabled={isSearching || isLoading}
            iconPos="right"
            icon="pi pi-list"
            className="search"
            loadingIcon="pi pi-spin pi-spinner"
            type="submit"
          />
        </div>
      </div>
    </form>
  )
}

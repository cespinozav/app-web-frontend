import { FormCalendar, FormInput, FormMultiSelect } from 'components/FormControls'
import { useQuery } from 'hooks/useRequest'
import useToast from 'hooks/useToast'
import { Button } from 'primereact/button'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { AssetService } from 'services'
import { formatSearchDate } from 'utils/dates'
import { ERROR_TAGS } from 'utils/exceptions'

export const DEFAULT_FIELDS = {
  leasingId: null,
  dates: null,
  ceco: '',
  cecoDesc: '',
  assetType: []
}

export default function AssignmentReport() {
  const [isSearching, setIsSearching] = useState(false)
  const toast = useToast()
  const { control, handleSubmit, reset } = useForm({ defaultValues: DEFAULT_FIELDS })
  const { data: leasingData, isLoading: leasingLoading } = useQuery([AssetService.leasing.id], AssetService.leasing.get)
  const leasings = leasingData?.map(d => ({ label: d.description, value: d.id })) || []
  const { data: assetData, isLoading: assetLoading } = useQuery([AssetService.typeAsset.id], AssetService.typeAsset.get)
  const activeTypes = assetData?.map(d => ({ label: d.description, value: d.id })) || []

  const handleError = err => {
    toast.error(String(err))
  }
  const onSubmit = formData => {
    setIsSearching(true)
    const data = { ...formData }
    if (data.dates && data.dates.length > 0) {
      data.fromDate = formatSearchDate(data.dates[0])
      if (formData.dates[1]) {
        data.toDate = formatSearchDate(data.dates[1])
      }
    }
    delete data.dates
    data.excel = true
    AssetService.assignments
      .get(data)
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
          <label htmlFor="leasingId">Leasing ID:</label>
          <FormMultiSelect name="leasingId" options={leasings} style={{ width: '18rem' }} control={control} />
        </div>
        <div>
          <label htmlFor="assetType">Tipo de activo:</label>
          <FormMultiSelect name="assetType" options={activeTypes} style={{ width: '18rem' }} control={control} />
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
            loading={isSearching || leasingLoading || assetLoading}
            disabled={isSearching || leasingLoading || assetLoading}
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

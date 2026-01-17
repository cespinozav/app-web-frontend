import { FormCalendar, FormMultiSelect } from 'components/FormControls'
import { useQuery } from 'hooks/useRequest'
import useToast from 'hooks/useToast'
import { Button } from 'primereact/button'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { AssetService } from 'services'
import { formatSearchDate } from 'utils/dates'
import { ERROR_TAGS } from 'utils/exceptions'

const DEFAULT_FIELDS = {
  dates: null,
  classification: ''
}

export default function BinnacleReport() {
  const [isSearching, setIsSearching] = useState(false)
  const toast = useToast()
  const { control, handleSubmit, reset } = useForm({ defaultValues: DEFAULT_FIELDS })
  const { data: classificationData, isLoading } = useQuery(
    [AssetService.classifications.id],
    AssetService.classifications.get
  )
  const classification = classificationData?.map(d => ({ label: d.description, value: d.id })) || []

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
    AssetService.binnacle
      .report(data)
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
          <label htmlFor="classification">Clasificación:</label>
          <FormMultiSelect
            name="classification"
            control={control}
            options={classification}
            style={{ width: '14rem' }}
            // rules={{
            //   required: 'Clasificación no seleccionada'
            // }}
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

import { FormCalendar, FormDropdown, FormInput, FormMultiSelect } from 'components/FormControls'
import useToast from 'hooks/useToast'
import {
  ContractMultiSelect,
  ModelMultiSelect,
  PlanMultiSelect
} from 'pages/KitAssignment/components/SearchForm/FormComponents'
import { useKitAssignmentInfo } from 'pages/KitAssignment/components/SearchForm/hooks'
import { Button } from 'primereact/button'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { KitService } from 'services'
import { ACCOUNT_TYPES, CONTRACT_STATUS, KIT_STATUSES, LINE_STATUSES, USER_STATUS } from 'utils/constants'
import { formatSearchDate } from 'utils/dates'
import { ERROR_TAGS } from 'utils/exceptions'

const DEFAULT_FIELDS = {
  dates: null,
  phone: '',
  dni: '',
  name: '',
  accountType: [],
  kitState: [],
  lineState: [],
  contractState: [],
  userState: [],
  type: '',
  operator: [],
  contractNumber: [],
  brand: [],
  model: [],
  imei: '',
  simcard: '',
  plan: '',
  additional1: [],
  additional2: [],
  seat: [],
  job: '',
  unit: '',
  management: '',
  business: '',
  ceco: '',
  cecoDescription: ''
}

export default function AssignmentReport() {
  const [isSearching, setIsSearching] = useState(false)
  const toast = useToast()
  const handleError = err => {
    toast.error(String(err))
  }

  const { control, handleSubmit, reset, setValue, getValues } = useForm({ defaultValues: DEFAULT_FIELDS })
  const { options, isSuccess } = useKitAssignmentInfo({ onError: handleError })

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
    KitService.assignments
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
          <label htmlFor="kitState">Estado de Equipo:</label>
          <FormMultiSelect name="kitState" options={KIT_STATUSES} style={{ width: '14rem' }} control={control} />
        </div>
        <div>
          <label htmlFor="lineState">Estado de Línea:</label>
          <FormMultiSelect name="lineState" options={LINE_STATUSES} style={{ width: '14rem' }} control={control} />
        </div>
        <div>
          <label htmlFor="contractState">Estado de contrato:</label>
          <FormMultiSelect
            name="contractState"
            options={CONTRACT_STATUS}
            style={{ width: '14rem' }}
            control={control}
          />
        </div>
        <div>
          <label htmlFor="userState">Estado de usuario:</label>
          <FormMultiSelect name="userState" options={USER_STATUS} style={{ width: '14rem' }} control={control} />
        </div>
        <div>
          <label htmlFor="type">Tipo:</label>
          <FormMultiSelect name="type" options={options.types} style={{ width: '15rem' }} control={control} />
        </div>
        <div>
          <label htmlFor="accountType">Tipo de cuenta:</label>
          <FormMultiSelect name="accountType" options={ACCOUNT_TYPES} style={{ width: '15rem' }} control={control} />
        </div>
        <div>
          <label htmlFor="operator">Operador:</label>
          <FormMultiSelect name="operator" options={options.operators} style={{ width: '16rem' }} control={control} />
        </div>
        <div>
          <label htmlFor="contractNumber">Nro Contrato:</label>
          <ContractMultiSelect
            control={control}
            options={options.contracts}
            setValue={setValue}
            getValues={getValues}
          />
        </div>
        <div>
          <label htmlFor="brand">Marca:</label>
          <FormMultiSelect name="brand" options={options.brands} style={{ width: '16rem' }} control={control} />
        </div>
        <div>
          <label htmlFor="model">Modelo:</label>
          <ModelMultiSelect control={control} options={options.models} setValue={setValue} getValues={getValues} />
        </div>
        <div>
          <label htmlFor="plan">Plan:</label>
          <PlanMultiSelect control={control} options={options.plans} setValue={setValue} getValues={getValues} />
          {/* <FormMultiSelect
            name="plan"
            options={options.filteredPlans}
            style={{ width: '16rem' }}
            control={control}
          /> */}
        </div>
        <div>
          <label htmlFor="additional1">Ser. Adicional 1:</label>
          <FormMultiSelect
            name="additional1"
            options={options.additionals}
            style={{ width: '16rem' }}
            control={control}
          />
        </div>
        <div>
          <label htmlFor="additional2">Ser. Adicional 2:</label>
          <FormMultiSelect
            name="additional2"
            options={options.additionals}
            style={{ width: '16rem' }}
            control={control}
          />
        </div>
        <div>
          <label htmlFor="seat">Sede:</label>
          <FormMultiSelect name="seat" options={options.seats} style={{ width: '16rem' }} control={control} />
        </div>
        <div>
          <label htmlFor="job">Cargo:</label>
          <FormInput name="job" control={control} />
        </div>
        <div>
          <label htmlFor="unit">Unidad:</label>
          <FormDropdown name="unit" options={options.units} style={{ width: '16rem' }} control={control} />
        </div>
        <div>
          <label htmlFor="management">Gerencia:</label>
          <FormInput control={control} name="management" />
        </div>
        <div>
          <label htmlFor="dates">Rango de fechas:</label>
          <FormCalendar
            name="dates"
            control={control}
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
          <label htmlFor="cecoDescription">Desc. CeCo:</label>
          <FormInput control={control} name="cecoDescription" />
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
            loading={isSearching || !isSuccess}
            disabled={isSearching || !isSuccess}
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

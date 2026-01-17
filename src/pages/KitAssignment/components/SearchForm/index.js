import { Button } from 'primereact/button'
import {
  ACCOUNT_TYPES,
  CONTRACT_STATUS,
  KIT_STATUSES,
  LINE_STATUSES,
  USER_STATUS,
} from 'utils/constants'
import { useForm } from 'react-hook-form'
import {
  FormCalendar,
  FormAutoComplete,
  FormMultiSelect,
  FormInput,
  FormDropdown,
} from 'components/FormControls'
import { useUrlParams } from 'hooks/useUrlParams'
import { formatSearchDate, parseToDate } from 'utils/dates'
import { Accordion, AccordionTab } from 'primereact/accordion'
import { useEffect, useRef, useState } from 'react'
import useToast from 'hooks/useToast'
import { KitService, PersonService } from 'services'
import { ERROR_TAGS } from 'utils/exceptions'
import {
  ContractMultiSelect,
  ModelMultiSelect,
  PlanMultiSelect,
} from './FormComponents'
import { useKitAssignmentInfo } from './hooks'

const DEFAULT_FIELDS = {
  phone: '',
  dni: '',
  name: '',
  assignTo: '',
  accountType: [],
  kitState: [],
  lineState: [],
  contractState: [],
  userState: [],
  type: '',
  dates: null,
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
  cecoDescription: '',
}

function parseSearch(search) {
  const data = { ...search }
  data.dates = data.fromDate
    ? [data.fromDate, data.toDate].map((d) => (d ? parseToDate(d, '-') : null))
    : DEFAULT_FIELDS.dates
  delete data.fromDate
  delete data.toDate
  data.contractNumber = data?.contractNumber?.map((c) => parseInt(c, 10)) || []
  data.operator = data?.operator?.map((c) => parseInt(c, 10)) || []
  data.brand = data?.brand?.map((c) => parseInt(c, 10)) || []
  data.model = data?.model?.map((c) => parseInt(c, 10)) || []
  data.seat = data?.seat?.map((c) => parseInt(c, 10)) || []
  data.additional1 = data?.additional1?.map((c) => parseInt(c, 10)) || []
  data.additional2 = data?.additional2?.map((c) => parseInt(c, 10)) || []
  return { ...DEFAULT_FIELDS, ...data }
}

export default function SearchForm({ isLoading, searchKits, clearKits }) {
  const [searchParams, setSearchParams] = useUrlParams({
    ...DEFAULT_FIELDS,
    fromDate: '',
    toDate: '',
  })
  const toast = useToast()
  const resetParamsRef = useRef(null)
  const { control, handleSubmit, reset, setValue, getValues } = useForm({
    defaultValues: DEFAULT_FIELDS,
  })
  const { options, isSuccess } = useKitAssignmentInfo({
    onError: (err) => toast.error(err),
  })

  useEffect(() => {
    if (isSuccess) {
      const params = parseSearch(searchParams)
      const { model, contractNumber, ...values } = params
      resetParamsRef.current = { model, contractNumber }
      reset(values)
    }
  }, [isSuccess])

  useEffect(() => {
    if (resetParamsRef.current) {
      setValue('model', resetParamsRef.current.model)
      setValue('contractNumber', resetParamsRef.current.contractNumber)
    }
  }, [resetParamsRef.current])

  function formatSearch(formData, applyClear = true) {
    if (!formData.personId && (formData.dni || formData.name)) {
      if (applyClear) {
        clearKits()
      }
      toast.warn('Debes seleccionar DNI o nombre de la lista')
      return null
    }

    const data = { ...formData }
    if (data.personId && !data.dni && !data.name) {
      delete data.personId
    }

    if (formData.dates && formData.dates.length > 0) {
      data.fromDate = formatSearchDate(formData.dates[0])
      if (formData.dates[1]) {
        data.toDate = formatSearchDate(formData.dates[1])
      }
    }
    delete data.dates
    if (typeof formData.dni !== 'string') {
      data.dni = formData.dni.dni
    }
    delete data.name
    return data
  }

  function onSubmit(formData) {
    const formattedData = formatSearch(formData)
    if (formattedData) {
      setSearchParams(formattedData)
      searchKits(formattedData)
    }
  }

  const [isReporting, setIsReporting] = useState(false)
  function onDownload() {
    const formData = getValues()
    const formattedData = formatSearch(formData, false)
    if (formattedData) {
      formattedData.excel = true
      setIsReporting(true)
      KitService.assignments
        .get(formattedData)
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
  function handleError(errors) {
    const messages = Object.values(errors)
      .slice(0, 4)
      .map((e) => e.message)
    toast.error(messages)
  }
  const [activeIndex, setActiveIndex] = useState(null)
  const showAdditionalFilters = () => {
    setActiveIndex(activeIndex === 0 ? null : 0)
  }
  return (
    <form
      className="form search"
      onSubmit={handleSubmit(onSubmit, handleError)}
    >
      <div className="form-group">
        <div>
          <label htmlFor="phone">Número:</label>
          <FormAutoComplete
            request={KitService.filters.number}
            name="phone"
            control={control}
          />
        </div>
        <div>
          <label htmlFor="dni">DNI:</label>
          <FormAutoComplete
            request={(info) =>
              PersonService.filters({ dni: info, activeOnly: false }).then(
                (rows) => {
                  if (rows.length > 0) {
                    return rows
                  }
                  setValue('name', '')
                  setValue('personId', '')
                  return rows
                },
              )
            }
            name="dni"
            onSelect={(e) => {
              const { name, personId } = e.value
              setValue('name', name)
              setValue('personId', personId)
            }}
            minLength={3}
            field="dni"
            control={control}
          />
        </div>
        <div>
          <label htmlFor="name">Nombre:</label>
          <FormAutoComplete
            request={(info) =>
              PersonService.filters({ name: info, activeOnly: false }).then(
                (rows) => {
                  if (rows.length > 0) {
                    return rows
                  }
                  setValue('dni', '')
                  setValue('personId', '')
                  return rows
                },
              )
            }
            name="name"
            field="name"
            minLength={3}
            control={control}
            onSelect={(e) => {
              const { dni, personId } = e.value
              setValue('dni', dni)
              setValue('personId', personId)
            }}
          />
        </div>
        <div>
          <label htmlFor="assignTo">Asignado a:</label>
          <FormInput control={control} name="assignTo" />
        </div>
        <div>
          <label htmlFor="accountType">Tipo de cuenta:</label>
          <FormMultiSelect
            name="accountType"
            options={ACCOUNT_TYPES}
            style={{ width: '15rem' }}
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
              clearKits(0)
            }}
          />
        </div>
        <div className="action">
          <Button
            icon="pi pi-download"
            className="icon-button"
            type="button"
            loading={isReporting}
            onClick={onDownload}
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
      <div className="form-group">
        <div>
          <label htmlFor="kitState">Estado de Equipo:</label>
          <FormMultiSelect
            name="kitState"
            options={KIT_STATUSES}
            style={{ width: '14rem' }}
            control={control}
          />
        </div>
        <div>
          <label htmlFor="lineState">Estado de Línea:</label>
          <FormMultiSelect
            name="lineState"
            options={LINE_STATUSES}
            style={{ width: '14rem' }}
            control={control}
          />
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
          <FormMultiSelect
            name="userState"
            options={USER_STATUS}
            style={{ width: '14rem' }}
            control={control}
          />
        </div>
        <div>
          <label htmlFor="type">Tipo:</label>
          <FormMultiSelect
            name="type"
            options={options.types}
            style={{ width: '15rem' }}
            control={control}
          />
        </div>
        <div className="action">
          <button
            type="button"
            className="more"
            onClick={showAdditionalFilters}
          >
            <i className="pi pi-ellipsis-v"></i>
            {activeIndex === 0 ? 'Menos' : 'Más'}
          </button>
        </div>
        <div>
          <label htmlFor="period">Fecha:</label>
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
      </div>
      <Accordion
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
      >
        <AccordionTab>
          <div className="form-group">
            <div>
              <label htmlFor="operator">Operador:</label>
              <FormMultiSelect
                name="operator"
                options={options.operators}
                style={{ width: '16rem' }}
                control={control}
              />
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
              <FormMultiSelect
                name="brand"
                options={options.brands}
                style={{ width: '16rem' }}
                control={control}
              />
            </div>
            <div>
              <label htmlFor="model">Modelo:</label>
              <ModelMultiSelect
                control={control}
                options={options.models}
                setValue={setValue}
                getValues={getValues}
              />
            </div>
            <div>
              <label htmlFor="imei">Imei:</label>
              <FormInput control={control} name="imei" />
            </div>
            <div>
              <label htmlFor="simcard">Sim Card:</label>
              <FormInput control={control} name="simcard" />
            </div>
            <div>
              <label htmlFor="plan">Plan:</label>
              <PlanMultiSelect
                control={control}
                options={options.plans}
                setValue={setValue}
                getValues={getValues}
              />
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
              <FormMultiSelect
                name="seat"
                options={options.seats}
                style={{ width: '16rem' }}
                control={control}
              />
            </div>
            <div>
              <label htmlFor="job">Cargo:</label>
              <FormInput name="job" control={control} />
            </div>
            <div>
              <label htmlFor="unit">Unidad:</label>
              {/* <FormInput control={control} name="unit" /> */}
              <FormDropdown
                name="unit"
                options={options.units}
                style={{ width: '16rem' }}
                control={control}
              />
              {/* <FormAutoComplete request={KitService.filters.unit} name="unit" control={control} /> */}
            </div>
            <div>
              <label htmlFor="management">Gerencia:</label>
              <FormInput control={control} name="management" />
            </div>
            <div>
              <label htmlFor="ceco">CeCo:</label>
              <FormInput control={control} name="ceco" />
            </div>
            <div>
              <label htmlFor="cecoDescription">Desc. CeCo:</label>
              <FormInput control={control} name="cecoDescription" />
            </div>
          </div>
        </AccordionTab>
      </Accordion>
    </form>
  )
}

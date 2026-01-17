import { useForm } from 'react-hook-form'
import { FormCalendar, FormDropdown, FormInput } from 'components/FormControls'
import { useEffect, useState } from 'react'
import { getDatesRange } from 'utils/dates'
import { KitService } from 'services'
import { multiFetch } from 'utils/network'
import { useQueryClient } from '@tanstack/react-query'
import { DEFAULT_CONTRACT, getContract } from 'pages/KitAssignment/utils'
import LoadingScreen from 'components/LoadingScreen'
import {
  AdditionalServiceDropDown,
  ConditionalDropDown,
  DConditionalDropDown,
  KitStatusDropdown,
  LineStatusDropdown
} from './FormComponents'

const DEFAULT_FIELDS = {
  phone: '',
  operatorId: '',
  contractNum: '',
  typeServiceId: '',
  brandId: '',
  modelId: '',
  dates: null,
  imei: '',
  simcard: '',
  seatId: '',
  planId: '',
  additional1: '',
  additional2: '',
  observation: '',
  contractType: '',
  kitStatus: '',
  lineStatus: ''
}

async function validateContract(contracts, formData, assignmentId) {
  const { phone } = formData
  const { data } = await KitService.assignments.get({ phone })
  const isValid = data.filter(({ id }) => id !== assignmentId).length === 0
  if (!isValid) {
    return 'El número ya se encuentra asignado'
  }
  return ''
}

function getDefaultValues(defaultFields) {
  if (!defaultFields) return DEFAULT_FIELDS
  const prevFields = {}
  Object.keys(DEFAULT_FIELDS).forEach(key => {
    prevFields[key] = defaultFields[key] || DEFAULT_FIELDS[key]
  })
  const { startDate, endDate } = defaultFields
  prevFields.dates = startDate ? [startDate, endDate] : null
  return prevFields
}

function formatSubmitData(formData, options) {
  const newFormData = { ...formData }
  newFormData.modelId =
    options.models.find(m => m.value === formData.modelId && m.brandId === formData.brandId)?.value ||
    DEFAULT_FIELDS.modelId
  newFormData.planId =
    options.plans.find(
      p =>
        p.value === formData.planId &&
        p.operatorId === formData.operatorId &&
        p.typeServiceId === formData.typeServiceId
    )?.value || DEFAULT_FIELDS.planId
  newFormData.additional1 =
    options.additionalServices.find(a => a.value === formData.additional1 && a.operatorId === formData.operatorId)
      ?.value || DEFAULT_FIELDS.additional1
  newFormData.additional2 =
    options.additionalServices.find(
      a => a.value === formData.additional2 && a.value !== formData.additional1 && a.operatorId === formData.operatorId
    )?.value || DEFAULT_FIELDS.additional2

  const dates = newFormData.dates || []
  const [startDate, endDate] = dates
  delete newFormData.dates
  return { ...newFormData, startDate, endDate }
}

export function useKitAssignmentInfo({ onError }) {
  const QUERIES = [
    KitService.operators,
    KitService.contract,
    KitService.models,
    KitService.plans,
    KitService.typeService,
    KitService.additionalService,
    KitService.seats
  ]
  const queryClient = useQueryClient()
  const [data, setData] = useState({
    operators: [],
    types: [],
    brands: [],
    contractNums: [],
    plans: [],
    seats: [],
    models: [],
    additionalServices: [],
    isSuccess: false
  })
  useEffect(() => {
    const controller = new AbortController()
    multiFetch(
      QUERIES.map(
        query => () =>
          queryClient.fetchQuery([query.id], () => query.get({ signal: controller.signal }), { staleTime: Infinity })
      )
    )
      .then(res => {
        const [operatorsData, contractsData, modelsData, plansData, typesData, additionalsData, seatsData] = res
        const operators = operatorsData?.map(operator => ({ value: operator.id, label: operator.description })) || []
        const contractNums =
          contractsData?.map(r => ({
            label: r.code,
            value: r.id,
            operatorId: r.operatorId,
            dateRange: getDatesRange(r)
          })) || []
        const plans =
          plansData?.map(r => ({
            label: r.description,
            value: r.id,
            operatorId: r.operatorId,
            typeServiceId: r.typeServiceId
          })) || []
        const types = typesData?.map(d => ({ label: d.description, value: d.id })) || []
        const additionalServices =
          additionalsData?.map(p => ({ label: p.description, value: p.id, operatorId: p.operatorId })) || []
        const seats = seatsData.map(r => ({ label: r.description, value: r.id })) || []

        const groupByBrand = {}
        const models = []
        modelsData.forEach(({ brandId, brandName, ...model }) => {
          if (!groupByBrand[brandId]) {
            groupByBrand[brandId] = { value: brandId, label: brandName }
          }
          models.push({ value: model.id, label: model.description, brandId })
        })
        const brands = Object.values(groupByBrand)
        setData({ operators, contractNums, brands, models, plans, types, additionalServices, seats, isSuccess: true })
      })
      .catch(onError)
    return () => {
      controller.abort()
    }
  }, [])
  const { isSuccess, ...options } = data
  return { options, isSuccess }
}

export default function AssignmentForm({ onSubmitFields, handleError, defaultFields, submitFields, saveDefault }) {
  const { control, handleSubmit, reset, resetField, setValue } = useForm({
    defaultValues: DEFAULT_FIELDS
  })
  const [contract, setContract] = useState(DEFAULT_CONTRACT)
  const updateContract = dates => {
    const [startDate, endDate] = dates || []
    setContract(getContract({ startDate, endDate }))
  }
  const { options, isSuccess } = useKitAssignmentInfo({ onError: e => handleError({ error: { message: e } }) })
  useEffect(() => {
    if (isSuccess) {
      const defaultValues = getDefaultValues(submitFields || defaultFields)
      if (defaultValues) {
        updateContract(defaultValues?.dates)
        reset(defaultValues)
      }
      if (defaultFields && saveDefault) {
        const oldFormData = formatSubmitData(getDefaultValues(defaultFields), options)
        saveDefault(oldFormData)
      }
    }
  }, [isSuccess])

  async function onSubmit(formData) {
    const contractErrorMessage = await validateContract(options.contractNums, formData, defaultFields?.id)
    if (contractErrorMessage) {
      handleError({ error: { message: contractErrorMessage } })
      return
    }
    const newFormData = formatSubmitData(formData, options)
    onSubmitFields(newFormData)
    reset()
  }
  return (
    <form onSubmit={handleSubmit(onSubmit, handleError)}>
      {!isSuccess ? (
        <LoadingScreen normalSize={true} />
      ) : (
        <>
          <div className="section">
            <div className="content">
              <div className="simple-row">
                <label htmlFor="phone">Número:</label>
                <FormInput
                  control={control}
                  name="phone"
                  disabled={!!defaultFields}
                  rules={{
                    required: 'Número requerido',
                    minLength: { value: 9, message: 'El número debe tener 9 digitos como mínimo' },
                    maxLength: { value: 11, message: 'El número debe tener 11 digitos como máximo' },
                    pattern: { value: /^\d+$/, message: 'El número no es válido' }
                  }}
                />
              </div>
              <div className="simple-row">
                <label htmlFor="operatorId">Operador:</label>
                <FormDropdown
                  name="operatorId"
                  control={control}
                  options={options.operators}
                  rules={{
                    required: 'Operador no seleccionado'
                  }}
                />
              </div>
              <div className="simple-row">
                <label htmlFor="contractNum">Nro Contrato:</label>
                <ConditionalDropDown
                  options={options.contractNums}
                  control={control}
                  name="contractNum"
                  filterField="operatorId"
                  rules={{
                    required: 'Contrato no seleccionado'
                  }}
                  resetField={resetField}
                />
              </div>
              <div className="simple-row">
                <label htmlFor="typeServiceId">Tipo:</label>
                <FormDropdown
                  name="typeServiceId"
                  control={control}
                  options={options.types}
                  rules={{
                    required: 'Tipo no seleccionado'
                  }}
                />
              </div>
              <div className="simple-row">
                <label htmlFor="brandId">Marca:</label>
                <FormDropdown
                  name="brandId"
                  control={control}
                  options={options.brands}
                  rules={{
                    required: 'Marca no seleccionada'
                  }}
                />
              </div>
              <div className="simple-row">
                <label htmlFor="modelId">Modelo:</label>
                <ConditionalDropDown
                  name="modelId"
                  control={control}
                  options={options.models}
                  rules={{
                    required: 'Modelo no seleccionado'
                  }}
                  filterField="brandId"
                  resetField={resetField}
                />
              </div>
              <div className="simple-row">
                <label htmlFor="dates">Fecha de contrato:</label>
                <FormCalendar
                  name="dates"
                  control={control}
                  onSelections={updateContract}
                  rules={{
                    required: 'Fechas de contrato no seleccionadas'
                  }}
                  calendarProps={{
                    selectionMode: 'range',
                    dateFormat: 'dd/mm/yy'
                    // readOnlyInput: true
                  }}
                />
              </div>
            </div>
            <div className="content">
              <div className="simple-row">
                <label htmlFor="imei">IMEI - DECO:</label>
                <FormInput
                  control={control}
                  name="imei"
                  rules={{
                    required: 'IMEI no ingresado',
                    maxLength: { value: 25, message: 'IMEI debe tener 25 caracteres como máximo' }
                  }}
                />
              </div>
              <div className="simple-row">
                <label htmlFor="simcard">SIM - Tarjeta:</label>
                <FormInput
                  name="simcard"
                  control={control}
                  rules={{
                    required: 'SIM no ingresado',
                    maxLength: { value: 25, message: 'SIM debe tener 25 caracteres como máximo' }
                  }}
                />
              </div>
              <div className="simple-row">
                <label htmlFor="seatId">Sede:</label>
                <FormDropdown
                  name="seatId"
                  control={control}
                  rules={{ required: 'Sede no seleccionada' }}
                  options={options.seats}
                />
              </div>
              <div className="simple-row">
                <label htmlFor="planId">Plan:</label>
                <DConditionalDropDown
                  name="planId"
                  control={control}
                  options={options.plans}
                  field1="operatorId"
                  field2="typeServiceId"
                  rules={{ required: 'Plan no seleccionado' }}
                  resetField={resetField}
                />
              </div>
              <div className="simple-row">
                <label htmlFor="additional1">Servicio Adicional 1:</label>
                <AdditionalServiceDropDown
                  name="additional1"
                  control={control}
                  options={options.additionalServices}
                  resetField={resetField}
                />
              </div>
              <div className="simple-row">
                <label htmlFor="additional2">Servicio Adicional 2:</label>
                <AdditionalServiceDropDown
                  name="additional2"
                  control={control}
                  options={options.additionalServices}
                  resetField={resetField}
                />
              </div>
              <div className="simple-row">
                <label htmlFor="observation">Observación:</label>
                <FormInput
                  name="observation"
                  control={control}
                  rules={{ maxLength: { value: 100, message: 'Observación debe tener 100 digitos como máximo' } }}
                />
              </div>
            </div>
            <div className="content details">
              <div className="row">
                <label htmlFor="contractType">Contrato:</label>
                <div className={contract.classname}>
                  <div>{contract.label}</div>
                  <div>{contract.subLabel}</div>
                </div>
              </div>
              <div className="row">
                <label htmlFor="kitStatus">Estado de equipo:</label>
                <KitStatusDropdown control={control} setValue={setValue} />
              </div>
              <div className="row">
                <label htmlFor="lineStatus">Estado de línea:</label>
                <LineStatusDropdown control={control} setValue={setValue} />
              </div>
            </div>
          </div>
          <div className="buttons">
            <button type="submit" className="button">
              Guardar
            </button>
          </div>
        </>
      )}
    </form>
  )
}

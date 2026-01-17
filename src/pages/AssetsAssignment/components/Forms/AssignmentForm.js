import { useForm } from 'react-hook-form'
import { FormCalendar, FormCheckbox, FormDropdown, FormInput } from 'components/FormControls'
import { useEffect, useRef, useState } from 'react'
import { AssetService } from 'services'
import { ASSETS } from 'utils/constants'
import { multiFetch } from 'utils/network'
import { useQueryClient } from '@tanstack/react-query'

const DEFAULT_FIELDS = {
  assetCode: '',
  brand: '',
  dates: null,
  description: '',
  disk: null,
  domain: null,
  inches: null,
  ip: '',
  leasingId: '',
  mac: '',
  memory: null,
  model: '',
  observation: '',
  operatingSystem: null,
  permission: false,
  processor: null,
  seat: '',
  serialNum: '',
  situation: '',
  status: '',
  type: ''
}

function getAdditionalInputs({ selectedType, options, filteredOptions }) {
  const newFilteredOptions = {
    operatingSystem: [],
    processor: [],
    memory: [],
    disk: [],
    domain: [],
    inches: []
  }
  const extraInputs = []
  if (selectedType) {
    Object.keys(filteredOptions).forEach(fieldName => {
      const fieldOptions = options[fieldName]
      const filteredOption = fieldOptions.filter(f => f.typeId === selectedType)
      if (filteredOption.length > 0) {
        extraInputs.push(fieldName)
        newFilteredOptions[fieldName] = filteredOption
      }
    })
  }
  return [newFilteredOptions, extraInputs.length > 0 ? [...extraInputs, 'ip', 'mac'] : []]
}

export function useAssetAssignmentInfo({ onError }) {
  const QUERIES = [
    AssetService.typeAsset,
    AssetService.model,
    AssetService.leasing,
    AssetService.seats,
    AssetService.operatingSystem,
    AssetService.domain,
    AssetService.processor,
    AssetService.memory,
    AssetService.disk,
    AssetService.inches
  ]
  const queryClient = useQueryClient()
  const [data, setData] = useState(null)
  useEffect(() => {
    const controller = new AbortController()
    multiFetch(
      QUERIES.map(
        query => () =>
          queryClient.fetchQuery([query.id], () => query.get({ signal: controller.signal }), { staleTime: Infinity })
      )
    )
      .then(res => {
        const [
          typesData,
          modelsData,
          leasingData,
          seatsData,
          operatingSystemData,
          domainData,
          processorData,
          memoryData,
          diskData,
          inchesData
        ] = res
        const types = typesData.map(r => ({ value: r.id, label: r.description }))

        const brandsObj = {}
        modelsData.forEach(({ brandId, brandName, id, description }) => {
          if (!brandsObj[brandId]) {
            brandsObj[brandId] = { name: brandName, models: [] }
          }
          brandsObj[brandId].models.push({ value: id, label: description })
        })
        const brands = Object.keys(brandsObj).map(key => {
          const brand = brandsObj[key]
          return { label: brand.name, value: key, models: brand.models }
        })
        const leasings = leasingData.map(r => ({ value: r.id, label: r.description, typeId: r.typeId }))
        const seats = seatsData.map(r => ({ value: r.id, label: r.description }))
        const operatingSystem = operatingSystemData.map(r => ({ value: r.id, label: r.description, typeId: r.typeId }))
        const domain = domainData.map(r => ({ value: r.id, label: r.description, typeId: r.typeId }))
        const processor = processorData.map(r => ({ value: r.id, label: r.description, typeId: r.typeId }))
        const memory = memoryData.map(r => ({ value: r.id, label: r.description, typeId: r.typeId }))
        const disk = diskData.map(r => ({ value: r.id, label: r.description, typeId: r.typeId }))
        const inches = inchesData.map(r => ({ value: r.id, label: r.description, typeId: r.typeId }))
        setData({
          types,
          brands,
          leasings,
          seats,
          domain,
          operatingSystem,
          processor,
          memory,
          disk,
          inches
        })
      })
      .catch(onError)
    return () => {
      controller.abort()
    }
  }, [])
  return data
}

function getDefaultValues(defaultFields) {
  if (!defaultFields) return DEFAULT_FIELDS
  const prevFields = {}
  Object.keys(DEFAULT_FIELDS).forEach(key => {
    prevFields[key] = defaultFields[key] || DEFAULT_FIELDS[key]
  })
  const { startDate, endDate } = defaultFields
  prevFields.dates =
    !startDate && !endDate ? null : [startDate ? new Date(startDate) : null, endDate ? new Date(endDate) : null]
  prevFields.permission = defaultFields.exitPermit
  return prevFields
}

function formatSubmitData(formData, filteredOptions, additionalInputs) {
  const newFormData = { ...formData }
  Object.keys(filteredOptions)
    .filter(fieldname => !additionalInputs.includes(fieldname))
    .forEach(fieldname => {
      newFormData[fieldname] = DEFAULT_FIELDS[fieldname]
    })
  const dates = newFormData.dates || []
  const [startDate, endDate] = dates
  delete newFormData.dates
  return { ...newFormData, startDate, endDate, exitPermit: formData.permission }
}

export default function AssignmentForm({ onSubmitFields, handleError, defaultFields, submitFields, saveDefault }) {
  const newDefault = useRef(getDefaultValues(defaultFields))
  const [additionalInputs, setAdditionalInputs] = useState([])
  const [options, setOptions] = useState({
    types: [],
    brands: [],
    models: [],
    leasings: [],
    seats: [],
    operatingSystem: [],
    processor: [],
    memory: [],
    disk: [],
    inches: []
  })
  const [filteredOptions, setFilteredOptions] = useState({
    operatingSystem: [],
    processor: [],
    memory: [],
    domain: [],
    disk: [],
    inches: []
  })
  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: DEFAULT_FIELDS
  })
  const data = useAssetAssignmentInfo({ onError: err => handleError({ error: { message: err } }) })

  useEffect(() => {
    if (data) {
      const newOptions = {
        ...options,
        ...data
      }
      const defaultValues = getDefaultValues(submitFields || defaultFields)
      if (defaultValues) {
        const [newFilteredOptions, extraInputs] = getAdditionalInputs({
          selectedType: defaultValues.type,
          options: newOptions,
          filteredOptions
        })
        const models = data?.brands?.find(b => b.value === defaultValues.brand)?.models || []
        setOptions({ ...newOptions, models })
        setFilteredOptions(newFilteredOptions)
        setAdditionalInputs(extraInputs)
        reset(defaultValues)
      } else {
        setOptions(newOptions)
      }
    }
  }, [data])

  function onSubmit(formData) {
    const newFormData = formatSubmitData(formData, filteredOptions, additionalInputs)
    if (defaultFields && saveDefault) {
      const oldFormData = formatSubmitData(newDefault.current, filteredOptions, additionalInputs)
      saveDefault(oldFormData)
    }
    onSubmitFields(newFormData)
    reset(newDefault.current)
  }
  return (
    <form onSubmit={handleSubmit(onSubmit, handleError)}>
      <div className="section">
        <div className="content">
          <div className="simple-row">
            <label htmlFor="assetCode">Equipo:</label>
            <FormInput
              name="assetCode"
              control={control}
              rules={{
                required: 'Equipo no ingresado',
                maxLength: { value: 25, message: 'Equipo puede tener 25 caracteres como máximo' }
              }}
            />
          </div>
          <div className="simple-row">
            <label htmlFor="type">Tipo:</label>
            <FormDropdown
              name="type"
              control={control}
              options={options.types}
              onSelect={type => {
                const selectedType = options.types.find(t => t.value === type)?.value
                const [newFilteredOptions, extraInputs] = getAdditionalInputs({
                  selectedType,
                  options,
                  filteredOptions
                })
                setFilteredOptions(newFilteredOptions)
                setAdditionalInputs(extraInputs)
              }}
              rules={{
                required: 'Tipo no seleccionado'
                // validate: validateRepeatedLicense
              }}
            />
          </div>
          <div className="simple-row">
            <label htmlFor="brand">Marca:</label>
            <FormDropdown
              name="brand"
              control={control}
              options={options.brands}
              onSelect={brandId => {
                const models = options.brands.find(b => b.value === brandId)?.models || []
                setOptions(o => ({ ...o, models }))
                setValue('model', DEFAULT_FIELDS.model)
              }}
              rules={{
                required: 'Marca no seleccionada'
                // validate: validateRepeatedLicense
              }}
            />
          </div>
          <div className="simple-row">
            <label htmlFor="model">Modelo:</label>
            <FormDropdown
              name="model"
              control={control}
              options={options.models}
              // onSelect={onSelectLicense}
              rules={{
                required: 'Modelo no seleccionado'
                // validate: validateRepeatedLicense
              }}
            />
          </div>
          <div className="simple-row">
            <label htmlFor="leasingId">Leasing ID:</label>
            <FormDropdown
              name="leasingId"
              control={control}
              options={options.leasings}
              // onSelect={onSelectLicense}
              rules={{
                required: 'Leasing ID no seleccionado'
                // validate: validateRepeatedLicense
              }}
            />
          </div>
          <div className="simple-row">
            <label htmlFor="status">Estado:</label>
            <FormDropdown
              name="status"
              control={control}
              options={ASSETS.STATUS}
              // onSelect={onSelectLicense}
              rules={{
                required: 'Estado no seleccionada'
              }}
            />
          </div>
          <div className="simple-row">
            <label htmlFor="situation">Situación:</label>
            <FormDropdown
              name="situation"
              control={control}
              options={ASSETS.SITUATION}
              // onSelect={onSelectLicense}
              rules={{
                required: 'Situación no seleccionada'
              }}
            />
          </div>
          <div className="simple-row">
            <label htmlFor="dates">Fecha:</label>
            <FormCalendar
              name="dates"
              control={control}
              // rules={{
              //   required: 'Fechas de vigencia no seleccionadas'
              // }}
              calendarProps={{
                selectionMode: 'range',
                readOnlyInput: true,
                dateFormat: 'dd/mm/yy',
                showButtonBar: true
                // dateFormat: 'd-M-yy'
              }}
            />
          </div>
          <div className="simple-row">
            <label htmlFor="seat">Sede:</label>
            <FormDropdown
              name="seat"
              control={control}
              options={options.seats}
              // onSelect={onSelectLicense}
              rules={{
                required: 'Sede no seleccionada'
              }}
            />
          </div>
          <div className="simple-row permission">
            <label htmlFor="permission">Permiso de salida:</label>
            <div>
              <FormCheckbox name="permission" control={control} />
            </div>
          </div>
        </div>
        <div className="content">
          <div className="simple-row">
            <label htmlFor="serialNum">Nro. de serie:</label>
            <FormInput
              control={control}
              name="serialNum"
              rules={{
                required: 'Nro de serie no ingresado',
                maxLength: { value: 50, message: 'Nro. de serie debe tener 50 caracteres como máximo' }
              }}
            />
          </div>
          {additionalInputs.map(fieldname => {
            const field = ASSETS.OPTIONS[fieldname]
            return (
              <div className="simple-row" key={fieldname}>
                <label htmlFor={fieldname}>{field.label}:</label>
                {field.select ? (
                  <FormDropdown
                    name={fieldname}
                    control={control}
                    options={filteredOptions[fieldname] || []}
                    rules={field.rules}
                  />
                ) : (
                  <FormInput control={control} name={fieldname} rules={field.rules} />
                )}
              </div>
            )
          })}
          <div className="simple-row">
            <label htmlFor="description">Descripción:</label>
            <FormInput
              control={control}
              name="description"
              rules={{
                maxLength: { value: 500, message: 'Descripción debe tener 500 caracteres como máximo' }
              }}
            />
          </div>
          <div className="simple-row">
            <label htmlFor="observation">Observacion:</label>
            <FormInput
              control={control}
              name="observation"
              rules={{
                maxLength: { value: 50, message: 'Observacion debe tener 50 caracteres como máximo' }
              }}
            />
          </div>
        </div>
      </div>
      <div className="buttons">
        <button type="submit" className="button" disabled={!data}>
          Guardar
        </button>
      </div>
    </form>
  )
}

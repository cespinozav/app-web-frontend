import { useWatch } from 'react-hook-form'
import { FormMultiSelect } from 'components/FormControls'
import { useEffect, useState } from 'react'

export function PlanMultiSelect({ options, control, setValue, getValues }) {
  const operatorIds = useWatch({ control, name: 'operator' })
  const typeIds = useWatch({ control, name: 'type' })
  const [filteredOptions, setFilteredOptions] = useState([])
  useEffect(() => {
    const planIds = getValues('plan')
    const newFilteredOptions = options.filter(o => operatorIds.includes(o.operator) || typeIds.includes(o.type))
    const filteredPlans = newFilteredOptions.filter(fOpt => planIds.includes(fOpt.value)).map(c => c.value)
    const hasChanged = filteredPlans.length !== planIds.length || filteredPlans.some(p => !planIds.includes(p))
    setFilteredOptions(newFilteredOptions)
    if (hasChanged) {
      setValue('plan', filteredPlans)
    }
  }, [setValue, operatorIds, typeIds])
  return <FormMultiSelect name="plan" options={filteredOptions} style={{ width: '16rem' }} control={control} />
}

export function ContractMultiSelect({ options, control, setValue, getValues }) {
  const operatorIds = useWatch({ control, name: 'operator' })
  const [filteredOptions, setFilteredOptions] = useState([])
  useEffect(() => {
    const contractIds = getValues('contractNumber')
    const newFilteredOptions = operatorIds.length > 0 ? options.filter(o => operatorIds.includes(o.operator)) : []
    const filteredContracts = newFilteredOptions.filter(fOpt => contractIds.includes(fOpt.value)).map(c => c.value)
    const hasChanged =
      filteredContracts.length !== contractIds.length || filteredContracts.some(m => !contractIds.includes(m))
    setFilteredOptions(newFilteredOptions)
    if (hasChanged) {
      setValue('contractNumber', filteredContracts)
    }
  }, [setValue, operatorIds])
  return (
    <FormMultiSelect name="contractNumber" options={filteredOptions} style={{ width: '16rem' }} control={control} />
  )
}

export function ModelMultiSelect({ options, control, setValue, getValues }) {
  const brandIds = useWatch({ control, name: 'brand' })
  const [filteredOptions, setFilteredOptions] = useState([])
  useEffect(() => {
    const modelIds = getValues('model')
    const newFilteredOptions = brandIds.length > 0 ? options.filter(o => brandIds.includes(o.brandId)) : []
    const filteredModels = newFilteredOptions.filter(fOpt => modelIds.includes(fOpt.value)).map(m => m.value)
    const hasChanged = filteredModels.length !== modelIds.length || filteredModels.some(m => !modelIds.includes(m))
    setFilteredOptions(newFilteredOptions)
    if (hasChanged) {
      setValue('model', filteredModels)
    }
  }, [setValue, brandIds])
  return <FormMultiSelect name="model" options={filteredOptions} style={{ width: '16rem' }} control={control} />
}

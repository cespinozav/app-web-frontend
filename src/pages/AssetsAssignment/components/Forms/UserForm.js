import { useForm } from 'react-hook-form'
import { FormAutoComplete, FormInput } from 'components/FormControls'
import { useRef, useState } from 'react'
import { PersonService } from 'services'
import { DNI_RULES, EMAIL_RULES } from 'utils/validations'
import { Checkbox } from 'primereact/checkbox'

const DEFAULT_FIELDS = {
  dni: '',
  name: '',
  ceco: '',
  job: '',
  cecoDesc: '',
  assignTo: '',
  isHolder: false,
  email: '',
  personId: ''
}

function getDefaultValues(defaultFields) {
  if (!defaultFields) return DEFAULT_FIELDS
  const values = {}
  Object.keys(DEFAULT_FIELDS).forEach(field => {
    values[field] = defaultFields[field] || DEFAULT_FIELDS[field]
  })
  return values
}

export default function UserForm({ onSubmitFields, handleError, defaultFields, submitFields, saveDefault }) {
  const defaultValues = submitFields || defaultFields
  const { control, handleSubmit, reset, setValue, getValues } = useForm({
    defaultValues: getDefaultValues(defaultValues)
  })
  const [isHolder, setIsHolder] = useState(defaultValues?.assignType === 'T')
  const [isLoading, setIsLoading] = useState(false)
  const newDefault = useRef(getDefaultValues(defaultFields))

  function onSubmit(formData) {
    const newFormData = { ...formData }
    newFormData.assignType = isHolder ? 'T' : 'G'
    onSubmitFields(newFormData)
    if (defaultFields && saveDefault) {
      newDefault.current.assignType = defaultFields.assignType ? 'T' : 'G'
      saveDefault({ ...newDefault.current, assignType: defaultValues?.assignType })
    }
    reset(newDefault.current)
  }
  const setUserExtraData = ({ dni, name, personId }) => {
    setIsLoading(true)
    PersonService.responsible({ dni }).then(r => {
      setValue('ceco', r.ceco)
      setValue('cecoDesc', r.cecoDesc)
      setValue('job', r.job)
      setValue('name', name)
      setValue('dni', dni)
      setValue('personId', personId)
      if (isHolder) {
        setValue('assignTo', name)
      }
      setIsLoading(false)
    })
  }
  return (
    <>
      <form className="section" onSubmit={handleSubmit(onSubmit, handleError)}>
        <div className="content">
          <div className="simple-row">
            <label htmlFor="name">Nombre:</label>
            <FormAutoComplete
              request={name => PersonService.filters({ name })}
              rules={{
                required: 'Nombre no ingresado',
                minLength: { value: 3, message: 'El nombre debe tener 3 caractéres como mínimo' }
              }}
              name="name"
              field="name"
              onSelect={e => setUserExtraData(e.value)}
              control={control}
            />
          </div>
          <div className="simple-row">
            <label htmlFor="dni">DNI:</label>
            <FormAutoComplete
              request={dni => PersonService.filters({ dni })}
              rules={{
                required: 'DNI no ingresado',
                ...DNI_RULES
              }}
              field="dni"
              name="dni"
              onSelect={e => setUserExtraData(e.value)}
              control={control}
            />
          </div>
          <div className="simple-row">
            <label htmlFor="job">Cargo:</label>
            <FormInput
              control={control}
              name="job"
              // rules={{
              //   required: 'Cargo no ingresado',
              //   minLength: { value: 3, message: 'El cargo debe tener 3 caractéres como mínimo' }
              // }}
              disabled={true}
            />
          </div>
          <div className="simple-row">
            <label htmlFor="ceco">CeCo:</label>
            <FormInput control={control} name="ceco" rules={{ required: 'CeCo no ingresado' }} disabled={true} />
          </div>
          <div className="simple-row">
            <label htmlFor="cecoDesc">Desc. CeCo:</label>
            <FormInput
              control={control}
              name="cecoDesc"
              rules={{ required: 'Desc. CeCo no ingresado' }}
              disabled={true}
            />
          </div>
          <div className="simple-row">
            <label htmlFor="isHolder">Titular:</label>
            <div>
              <Checkbox
                checked={isHolder}
                disabled={isLoading}
                onChange={e => {
                  setIsHolder(e.checked)
                  let userName = ''
                  if (!isHolder) {
                    userName = getValues('name')
                  }
                  setValue('assignTo', userName)
                }}
              />
            </div>
          </div>
          <div className="simple-row">
            <label htmlFor="assignTo">Asignado a:</label>
            <FormAutoComplete
              request={name => PersonService.filters({ name }).then(res => res.map(r => r.name))}
              disabled={isHolder}
              rules={{
                required: 'Nombre no ingresado',
                minLength: { value: 3, message: 'El nombre debe tener 3 caractéres como mínimo' }
              }}
              name="assignTo"
              // field="name"
              control={control}
            />
          </div>
          <div className="simple-row">
            <label htmlFor="email">Correo:</label>
            <FormInput
              name="email"
              control={control}
              rules={{
                ...EMAIL_RULES
              }}
            />
          </div>
          <div className="buttons">
            <button type="submit" className="button" disabled={isLoading}>
              Siguiente
            </button>
          </div>
        </div>
      </form>
    </>
  )
}

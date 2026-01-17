import { useForm } from 'react-hook-form'
import { FormAutoComplete, FormInput } from 'components/FormControls'
import { useRef, useState } from 'react'
import { PersonService } from 'services'
import { EMAIL_RULES } from 'utils/validations'

const DEFAULT_FIELDS = {
  dni: '',
  name: '',
  ceco: '',
  job: '',
  cecoDesc: '',
  personId: '',
  userRed: '',
  email: ''
}

function getDefaultValues(defaultFields) {
  if (!defaultFields) return DEFAULT_FIELDS
  const values = {}
  Object.keys(DEFAULT_FIELDS).forEach(field => {
    values[field] = defaultFields[field] || DEFAULT_FIELDS[field]
  })
  return values
}

export default function UserForm({ onSubmitFields, handleError, defaultFields, submitFields }) {
  const defaultValues = submitFields || defaultFields
  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: getDefaultValues(defaultValues)
  })

  const newDefault = useRef(getDefaultValues(defaultFields))
  const [isLoading, setIsLoading] = useState(false)

  function onSubmit(formData) {
    onSubmitFields(formData)
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
                pattern: { value: /\d{8}/, message: 'DNI no válido' }
              }}
              field="dni"
              name="dni"
              onSelect={e => setUserExtraData(e.value)}
              control={control}
            />
          </div>
          <div className="simple-row">
            <label htmlFor="job">Cargo:</label>
            <FormInput control={control} name="job" disabled={true} />
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
            <label htmlFor="userRed">Usuario:</label>
            <FormInput control={control} name="userRed" rules={{ required: 'Usuario ingresado' }} />
          </div>
          <div className="simple-row">
            <label htmlFor="email">Correo:</label>
            <FormInput control={control} name="email" rules={{ ...EMAIL_RULES, required: 'Correo no ingresado' }} />
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

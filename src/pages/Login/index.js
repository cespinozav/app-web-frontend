import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
// import LOADING from 'assets/img/loading.svg'
import TALMALOGO from 'assets/img/zprime_logo_W.svg'
import { UserContext } from 'context'
import useToast from 'hooks/useToast'
import { hasToken, authenticate } from 'utils/auth'
import { useForm } from 'react-hook-form'
import { Button } from 'primereact/button'

const DEFAULT_FIELDS = { user: '', password: '' }

const Login = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [, setUserinfo] = useContext(UserContext)

  const { register, handleSubmit } = useForm({ defaultValues: DEFAULT_FIELDS })

  useEffect(() => {
    if (hasToken()) {
      navigate('/')
    }
    // Si no hay token, no hacer nada, mostrar login
  }, [])

  const toast = useToast()
  const onLogin = async formData => {
    setIsLoading(true)
    try {
      const data = await authenticate(formData)
      setUserinfo(data)
      navigate('/')
    } catch (e) {
      let message = 'Hubo un error al iniciar sesión'
      if ('message' in e) message = e.message
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleError = err => {
    const messages = Object.values(err).map(e => e.message)
    toast.error(messages)
  }

  return (
    <div className="login">
      <div className="container">
        <div className="logo">
          <img src={TALMALOGO} alt="logo" />
        </div>
        <form className="form-login" onSubmit={handleSubmit(onLogin, handleError)}>
          <div>
            <h1>Bienvenido</h1>
          </div>
          <div className="form-data">
            <label htmlFor="user">Usuario de red</label>
            <input
              id="user"
              {...register('user', {
                required: 'Usuario no ingresado',
                minLength: { value: 4, message: 'El Usuario debe tener 4 caractéres como mínimo' }
              })}
            />
          </div>
          <div className="form-data">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              {...register('password', {
                required: 'Contraseña no ingresada',
                minLength: { value: 5, message: 'La contraseña debe tener 5 caractéres como mínimo' }
              })}
            />
          </div>
          <div>
            <Button
              label="Iniciar sesión"
              loading={isLoading}
              disabled={isLoading}
              className="button"
              loadingIcon="pi pi-spin pi-spinner"
              iconPos="right"
              icon="pi pi-sign-in"
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  )
}
export default Login

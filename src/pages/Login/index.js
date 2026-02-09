import NewPassword from './NewPassword'
import { useState, useEffect, useContext } from 'react'
import { Dialog } from 'primereact/dialog'
import ResetPasswordService from 'services/ResetPassword'
import { useNavigate } from 'react-router-dom'
// import LOADING from 'assets/img/loading.svg'
import TALMALOGO from 'assets/img/zprime_logo_W.svg'
import { UserContext } from 'context'
import useToast from 'hooks/useToast'
import { hasToken, authenticate } from 'utils/auth'
import { useForm } from 'react-hook-form'

import ResetPasswordForm from './ResetPasswordForm'
import { Button } from 'primereact/button'

const DEFAULT_FIELDS = { username: '', password: '' }

const Login = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)
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
            <label htmlFor="username">Usuario</label>
            <input
              id="username"
              {...register('username', {
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ width: '100%' }}>
              <Button
                label="Iniciar sesión"
                loading={isLoading}
                disabled={isLoading}
                className="button"
                loadingIcon="pi pi-spin pi-spinner"
                iconPos="right"
                icon="pi pi-sign-in"
                type="submit"
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ width: '100%', marginTop: 12, textAlign: 'center' }}>
              <Button
                label="¿Olvidaste tu contraseña?"
                className="p-button-link"
                onClick={e => {
                  e.preventDefault();
                  setShowResetModal(true);
                }}
                style={{ background: '#f8d7da', color: '#721c24', fontWeight: 600, fontSize: '0.85rem', padding: '4px 12px', borderRadius: 4 }}
              />
            </div>
          </div>
        </form>
        <Dialog
          visible={showResetModal}
          modal
          header="Recuperar contraseña"
          onHide={() => { setShowResetModal(false); setResetSent(false); }}
          closable={true}
        >
          {!resetSent ? (
            <ResetPasswordForm
              loading={resetLoading}
              onSend={async data => {
                setResetLoading(true);
                try {
                  await ResetPasswordService.requestReset(data);
                  setResetSent(true);
                  toast.success('Se ha enviado el enlace de recuperación a tu correo o usuario');
                } catch (e) {
                  toast.error('No se pudo enviar el enlace');
                } finally {
                  setResetLoading(false);
                }
              }}
            />
          ) : (
            <div style={{ padding: '16px 0', textAlign: 'center' }}>
              <p>Revisa tu correo para continuar el proceso de recuperación.</p>
            </div>
          )}
        </Dialog>
      </div>
    </div>
  )
}
export default Login

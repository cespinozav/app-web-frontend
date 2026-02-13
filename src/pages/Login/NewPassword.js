import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ResetPasswordService from 'services/ResetPassword'
import { Button } from 'primereact/button'
import useToast from 'hooks/useToast'

export default function NewPassword() {
  const { uid, token } = useParams()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await ResetPasswordService.confirmReset({ uid, token, new_password: password })
      toast.success('Contraseña actualizada correctamente')
      navigate('/login')
    } catch (err) {
      // Display the specific error message from backend if available
      const errorMessage = err?.result?.error || 'No se pudo actualizar la contraseña'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="new-password-container">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2>Ingresa tu nueva contraseña</h2>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Nueva contraseña"
          required
        />
        <Button label="Actualizar contraseña" loading={loading} type="submit" />
      </form>
    </div>
  )
}

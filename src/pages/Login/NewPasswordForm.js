import { useState } from 'react'
import { Button } from 'primereact/button'

export default function NewPasswordForm({ loading, onSubmit }) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        if (password && password === confirm) onSubmit(password)
      }}
      style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      <label htmlFor="new-password">Nueva contraseña</label>
      <input
        id="new-password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Ingresa tu nueva contraseña"
        required
      />
      <label htmlFor="confirm-password">Confirmar contraseña</label>
      <input
        id="confirm-password"
        type="password"
        value={confirm}
        onChange={e => setConfirm(e.target.value)}
        placeholder="Confirma tu nueva contraseña"
        required
      />
      <Button
        label="Actualizar contraseña"
        loading={loading}
        disabled={loading || !password || password !== confirm}
        type="submit"
      />
    </form>
  )
}

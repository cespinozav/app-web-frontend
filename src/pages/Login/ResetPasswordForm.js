import { useState } from 'react';
import { Button } from 'primereact/button';

export default function ResetPasswordForm({ loading, onSend }) {
  const [value, setValue] = useState('');
  const [type, setType] = useState('email');
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        if (value) {
          if (type === 'email') onSend({ email: value });
          else onSend({ username: value });
        }
      }}
      style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      <div style={{ display: 'flex', gap: 8 }}>
        <Button
          label="Correo"
          type="button"
          className={type === 'email' ? 'p-button-success' : 'p-button-outlined'}
          onClick={() => setType('email')}
          style={{ fontSize: '0.85rem', padding: '4px 12px' }}
        />
        <Button
          label="Usuario"
          type="button"
          className={type === 'username' ? 'p-button-success' : 'p-button-outlined'}
          onClick={() => setType('username')}
          style={{ fontSize: '0.85rem', padding: '4px 12px' }}
        />
      </div>
      <label htmlFor="reset-value">{type === 'email' ? 'Correo electrónico' : 'Usuario'}</label>
      <input
        id="reset-value"
        type={type === 'email' ? 'email' : 'text'}
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={type === 'email' ? 'Ingresa tu correo electrónico' : 'Ingresa tu usuario'}
        style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
      />
      <Button
        label="Enviar enlace"
        type="submit"
        loading={loading}
        disabled={loading || !value}
        className="button"
        icon="pi pi-envelope"
      />
    </form>
  );
}

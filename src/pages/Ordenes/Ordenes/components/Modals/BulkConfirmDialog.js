

import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'

// Ejemplo de icono por defecto (advertencia)
import { AiOutlineExclamationCircle } from 'react-icons/ai'

/**
 * ConfirmDialog - Diálogo de confirmación genérico y reutilizable.
 * Inspirado en patrones de Notion, Slack, PrimeReact y apps SaaS modernas.
 * Props:
 *   visible: boolean
 *   onHide: () => void
 *   onConfirm: () => void
 *   title: string (título del diálogo)
 *   message: string | ReactNode (mensaje principal)
 *   confirmLabel: string (texto del botón confirmar)
 *   cancelLabel: string (texto del botón cancelar)
 *   loading: boolean (estado de carga en botón confirmar)
 *   icon: ReactNode (icono principal, opcional)
 *   iconColor: string (color del icono, opcional)
 *   confirmColor: string (color del botón confirmar, opcional)
 */
export default function ConfirmDialog({
  visible,
  onHide,
  onConfirm,
  title = '¿Estás seguro?',
  message = 'Por favor, confirma que deseas continuar.',
  confirmLabel = 'Sí, continuar',
  cancelLabel = 'Cancelar',
  loading = false,
  icon,
  iconColor = '#f59e42',
  confirmColor = 'p-button-success',
}) {
  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0 4px 0' }}>
          {icon || <AiOutlineExclamationCircle size={24} color={iconColor} style={{ flexShrink: 0 }} />}
          <span style={{ fontWeight: 700, fontSize: 18, color: iconColor, letterSpacing: 0.2 }}>{title}</span>
        </div>
      }
      style={{ width: '400px', maxWidth: '96vw' }}
      modal
      footer={
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, padding: '6px 0 0 0' }}>
          <Button
            label={cancelLabel}
            className="p-button-secondary p-button-outlined"
            onClick={onHide}
            disabled={loading}
          />
          <Button
            label={confirmLabel}
            className={confirmColor}
            onClick={onConfirm}
            loading={loading}
            style={{ minWidth: 110, fontWeight: 600 }}
          />
        </div>
      }
    >
      <div style={{ textAlign: 'center', padding: '10px 4px 0 4px' }}>
        <div style={{ fontSize: '1.08rem', color: '#23272f', fontWeight: 500, marginBottom: 8, lineHeight: 1.45 }}>
          {message}
        </div>
        <div style={{ borderTop: '1.5px solid #ecebeb', margin: '12px 0 0 0' }} />
        <div style={{ color: '#8a929a', fontSize: 13, margin: '10px 0 0 0', fontStyle: 'italic' }}>
          Si tienes dudas, revisa la información antes de confirmar.
        </div>
      </div>
    </Dialog>
  )
}

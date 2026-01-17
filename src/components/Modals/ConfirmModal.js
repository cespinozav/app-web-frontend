import { Dialog } from 'primereact/dialog'

export default function ConfirmModal({ onClose, onAccept, isVisible, children, acceptLabel, cancelLabel, disabled }) {
  return (
    <Dialog className="dialog confirm" visible={isVisible} draggable={false} modal onHide={onClose}>
      <div>{children}</div>
      <div className="buttons confirm">
        <button className="button" onClick={onAccept} disabled={disabled}>
          {acceptLabel || 'Aceptar'}
        </button>
        <button className="button" onClick={onClose} disabled={disabled}>
          {cancelLabel || 'Cancelar'}
        </button>
      </div>
    </Dialog>
  )
}

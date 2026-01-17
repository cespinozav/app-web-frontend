import { Dialog } from 'primereact/dialog';

export default function AcceptModal({ onClose, isVisible, children, acceptLabel }) {
  return (
    <Dialog className="dialog confirm" draggable={false} visible={isVisible} modal onHide={onClose}>
      <p>{children}</p>
      <div className="buttons">
        <button className="button" onClick={onClose}>
          {acceptLabel || 'Aceptar'}
        </button>
      </div>
    </Dialog>
  );
}

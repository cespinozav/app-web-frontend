import { Dialog } from 'primereact/dialog'

export default function ModalForm({ isVisible, onClose, defaultFields, serviceKey, service, FormComponent }) {
  const close = () => {
    onClose()
  }
  return (
    <Dialog className="dialog licenses-dialog maintenance" draggable={false} visible={isVisible} modal onHide={close}>
      <FormComponent defaultFields={defaultFields} onClose={onClose} service={service} />
    </Dialog>
  )
}

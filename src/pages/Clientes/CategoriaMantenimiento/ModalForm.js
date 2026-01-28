
import { Dialog } from 'primereact/dialog'

export default function ModalForm({ isVisible, onClose, defaultFields, service, FormComponent }) {
  const isEditing = Boolean(defaultFields)
  const headerTitle = isEditing ? 'Editar categoría' : 'Agregar categoría'
  return (
    <Dialog
      className="dialog licenses-dialog maintenance"
      draggable={false}
      visible={isVisible}
      modal
      onHide={onClose}
      header={headerTitle}
      closable={true}
    >
      {FormComponent && (
        <FormComponent
          onClose={onClose}
          defaultFields={defaultFields}
          service={service}
        />
      )}
    </Dialog>
  )
}

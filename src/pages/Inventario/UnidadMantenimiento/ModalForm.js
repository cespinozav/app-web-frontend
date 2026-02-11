import { Dialog } from 'primereact/dialog'
import { useMutation } from 'hooks/useRequest'
import useToast from 'hooks/useToast'

export default function ModalForm({ isVisible, onClose, FormComponent, defaultFields, service }) {
  const isEditing = Boolean(defaultFields && defaultFields.id)
  const { mutate, isLoading } = useMutation(service.id, isEditing ? service.put : service.post)
  const toast = useToast()
  const onSubmitFields = async formData => {
    const payload = { ...formData };
    if (isEditing && defaultFields?.id) {
      payload.id = defaultFields.id;
    }
    mutate(
      payload,
      {
        onSuccess: () => {
          onClose()
          toast.success(isEditing ? 'Unidad editada con éxito' : 'Unidad agregada con éxito')
        },
        onError: err => {
          if (err?.result?.description && Array.isArray(err.result.description)) {
            toast.error(err.result.description[0])
            return
          }
          if (err?.status === 401 || (err?.message && String(err.message).includes('401'))) {
            window.location.href = '/login'
            return
          }
          const strMessage = String(err)
          if (strMessage.includes('already exists')) {
            toast.error('La unidad ya existe')
          } else {
            toast.error(err?.message || err)
          }
        }
      }
    )
  }
  const headerTitle = isEditing ? 'Editar unidad' : 'Agregar unidad'
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
          onSubmitFields={onSubmitFields}
          isMutating={isLoading}
        />
      )}
    </Dialog>
  )
}

import { Dialog } from 'primereact/dialog'
import { useMutation } from 'hooks/useRequest'
import useToast from 'hooks/useToast'

export default function ModalForm({ isVisible, onClose, FormComponent, defaultFields, service }) {
  const isEditing = Boolean(defaultFields)
  const { mutate, isLoading } = useMutation(service.id, isEditing ? service.put : service.post)
  const toast = useToast()
  const onSubmitFields = async formData => {
    const payload = {
      ...formData,
      userCreated: formData.userCreated || 'admin'
    };
    if (isEditing && defaultFields?.id) {
      payload.id = defaultFields.id;
    }
    mutate(
      payload,
      {
        onSuccess: () => {
          onClose()
          toast.success(isEditing ? 'Categoría editada con éxito' : 'Categoría agregada con éxito')
        },
        onError: err => {
          // Si la API responde con un campo description duplicado
          if (err?.result?.description && Array.isArray(err.result.description)) {
            toast.error(err.result.description[0])
            return
          }
          // Si la respuesta es 401, refrescar y redirigir al login
          if (err?.status === 401 || (err?.message && String(err.message).includes('401'))) {
            window.location.href = '/login'
            return
          }
          const strMessage = String(err)
          if (strMessage.includes('already exists')) {
            toast.error('La categoría ya existe')
          } else {
            toast.error(err?.message || err)
          }
        }
      }
    )
  }
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
          onSubmitFields={onSubmitFields}
          isMutating={isLoading}
        />
      )}
    </Dialog>
  )
}

import { UserContext } from 'context'
import { useMutation } from 'hooks/useRequest'
import useToast from 'hooks/useToast'
import { Dialog } from 'primereact/dialog'
import { useContext } from 'react'

function ModalForm({ isVisible, onClose, FormComponent, defaultFields, service }) {
  const isEditing = Boolean(defaultFields)
  const { mutate, isLoading } = useMutation(service.id, isEditing ? service.put : service.post)
  const [userInfo] = useContext(UserContext)
  const toast = useToast()
  const onSubmitFields = async formData => {
    const adminUser = userInfo.user
    const userCreated = isEditing ? formData.userCreated : adminUser
    mutate(
      { ...formData, userCreated },
      {
        onSuccess: () => {
          onClose()
          toast.success(isEditing ? `Registro ${defaultFields.id} editado con éxito` : 'Registro agregado con éxito')
        },
        onError: err => {
          const strMessage = String(err)
          if (strMessage.includes('already exists')) {
            toast.error('El registro ya existe')
          } else {
            toast.error(err)
          }
        }
      }
    )
  }
  return (
    <Dialog
      className="dialog licenses-dialog maintenance"
      draggable={false}
      visible={isVisible}
      modal
      onHide={() => {
        if (!isLoading) {
          onClose()
        }
      }}
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

export default ModalForm

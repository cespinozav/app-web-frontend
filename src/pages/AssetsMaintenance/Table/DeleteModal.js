import { ConfirmModal } from 'components/Modals'
import { useMutation } from 'hooks/useRequest'
import useToast from 'hooks/useToast'

function DeleteModal({ onClose, isVisible, service, rowId, postDelete }) {
  const toast = useToast()
  const { mutate, isLoading: isDeleting } = useMutation(service.id, service.delete)
  return (
    <ConfirmModal
      onClose={() => {
        if (!isDeleting) {
          onClose()
        }
      }}
      onAccept={() => {
        mutate(
          { id: rowId },
          {
            onSuccess: () => {
              postDelete()
              toast.success(`Registro ${rowId ?? ''} eliminado con éxito`)
            },
            onError: err => toast.error(err)
          }
        )
      }}
      disabled={isDeleting}
      isVisible={isVisible}
      acceptLabel="Eliminar"
    >
      <p>¿Desea eliminar el registro {rowId ?? ''}?</p>
    </ConfirmModal>
  )
}

export default DeleteModal

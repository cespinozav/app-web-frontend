import useToast from 'hooks/useToast'
import { useState } from 'react'
import ConfirmModal from './ConfirmModal'

function DeleteRegisterModal({ onClose, isVisible, onDelete, message }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const toast = useToast()
  return (
    <ConfirmModal
      onClose={() => {
        if (!isDeleting) {
          onClose()
        }
      }}
      onAccept={async () => {
        setIsDeleting(true)
        try {
          await onDelete()
          toast.success('Asignación eliminada con éxito')
          onClose()
        } catch (err) {
          toast.error(err)
        } finally {
          setIsDeleting(false)
        }
      }}
      disabled={isDeleting}
      isVisible={isVisible}
      acceptLabel="Eliminar"
    >
      <p>{message ?? '¿Desea eliminar la asignación?'}</p>
    </ConfirmModal>
  )
}

export default DeleteRegisterModal

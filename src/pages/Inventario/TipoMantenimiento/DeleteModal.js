import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { useMutation } from 'hooks/useRequest'
import useToast from 'hooks/useToast'

import { useEffect, useRef } from 'react'

export default function DeleteModal({ onClose, isVisible, service, rowId, postDelete }) {
  const toast = useToast()
  const { mutate, isLoading: isDeleting } = useMutation(service.id, service.delete)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  const handleDelete = () => {
    mutate(
      { id: rowId },
      {
        onSuccess: () => {
          if (isMounted.current) {
            postDelete()
            toast.success(`Registro ${rowId ?? ''} eliminado con éxito`)
          }
        },
        onError: err => {
          if (isMounted.current) toast.error(err)
        }
      }
    )
  }
  return (
    <Dialog className="dialog licenses-dialog maintenance" draggable={false} visible={isVisible} modal onHide={onClose}>
      <div style={{ padding: 24 }}>
        <h3>¿Desea eliminar la categoría {rowId ?? ''}?</h3>
        <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
          <Button label="Eliminar" onClick={handleDelete} disabled={isDeleting} className="p-button-danger" />
          <Button label="Cancelar" onClick={onClose} disabled={isDeleting} />
        </div>
      </div>
    </Dialog>
  )
}

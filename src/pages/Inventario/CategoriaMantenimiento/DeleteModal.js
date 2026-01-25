import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { useMutation } from 'hooks/useRequest'
import useToast from 'hooks/useToast'

import { useEffect, useRef } from 'react'

export default function DeleteModal({ onClose, isVisible, service, rowId, rowName, postDelete }) {
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
            toast.success(`Categoría "${rowName ?? ''}" eliminada con éxito`)
          }
        },
        onError: err => {
          if (isMounted.current) {
            // Si la respuesta es 401, refrescar y redirigir al login
            if (err?.status === 401 || (err?.message && String(err.message).includes('401'))) {
              window.location.href = '/login'
              return
            }
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
      onHide={onClose}
      header={<span style={{ fontWeight: 600, fontSize: '1.2rem' }}>Eliminar categoría</span>}
      closable={true}
    >
      <div style={{ padding: '8px 24px 24px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: '1rem', marginBottom: 8 }}>
            ¿Desea eliminar la categoría "{rowName ?? ''}"?
          </div>
        </div>
        <div className="buttons">
          <Button label="Eliminar" onClick={handleDelete} disabled={isDeleting} className="p-button-danger" />
          <Button label="Cancelar" onClick={onClose} disabled={isDeleting} />
        </div>
      </div>
    </Dialog>
  )
}

import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { useMutation } from 'hooks/useRequest'
import useToast from 'hooks/useToast'
import { useEffect, useRef } from 'react'

export default function DeleteModal({ onClose, isVisible, service, rowData, postDelete }) {
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
      rowData.id,
      {
        onSuccess: () => {
          if (isMounted.current) {
            postDelete()
            toast.success(`Categoría "${rowData?.description ?? ''}" eliminada con éxito`)
          }
        },
        onError: err => {
          if (isMounted.current) {
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
    <Dialog visible={!!isVisible} onHide={onClose} header="Eliminar categoría" modal footer={
      <>
        <Button label="Cancelar" onClick={onClose} className="p-button-text" />
        <Button label="Eliminar" icon="pi pi-trash" onClick={handleDelete} loading={isDeleting} className="p-button-danger" />
      </>
    }>
      <p>¿Está seguro que desea eliminar la categoría <b>{rowData?.description}</b>?</p>
    </Dialog>
  )
}

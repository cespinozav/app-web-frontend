import { Dialog } from 'primereact/dialog'
import { AssetService } from 'services'
import useToast from 'hooks/useToast'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { useState } from 'react'
import { Button } from 'primereact/button'
import { ConfirmModal } from 'components/Modals'
import useCache from 'hooks/useCache'

const VIEWS = {
  CONFIRM: 1,
  RESULT: 2
}

function DeleteAssignmentsModal({ onClose, assignmentRows, updateAssignment, isVisible }) {
  const cache = useCache()
  const [view, setView] = useState(VIEWS.CONFIRM)
  const [isDeleting, setIsDeleting] = useState(false)
  const toast = useToast()

  const deleteAssignments = async () => {
    setIsDeleting(true)
    try {
      const results = await Promise.allSettled(
        assignmentRows.map(row => AssetService.assignments.delete({ id: row.id }))
      )
      const newDeletionResults = results.map((result, index) => {
        const deleteResult = result.reason ?? 'Exitosa'
        const row = assignmentRows[index]
        return {
          ...row,
          deleteResult
        }
      })
      cache.update({ deletionResults: newDeletionResults })
      setView(VIEWS.RESULT)
      await updateAssignment()
    } catch (e) {
      toast.error(String(e))
    } finally {
      setIsDeleting(false)
    }
  }
  return view === VIEWS.CONFIRM ? (
    <ConfirmModal
      onClose={() => {
        if (!isDeleting) {
          onClose()
        }
      }}
      onAccept={deleteAssignments}
      isVisible={isVisible}
      acceptLabel="Eliminar"
      disabled={isDeleting}
    >
      <p>¿Desea eliminar {assignmentRows?.length} asignaciones?</p>
    </ConfirmModal>
  ) : (
    <Dialog
      className="dialog add-license-dialog confirm"
      visible={isVisible}
      modal
      draggable={false}
      onHide={onClose}
      transitionOptions={{
        onExited: () => {
          setView(VIEWS.CONFIRM)
        }
      }}
    >
      <DataTable
        className="dialog-table"
        value={cache.get()?.deletionResults || []}
        responsiveLayout="stack"
        breakpoint="760px"
        dataKey="id"
      >
        <Column field="name" header="NOMBRE:"></Column>
        <Column field="assetType" header="TIPO DE ACTIVO:"></Column>
        <Column field="assetCode" header="COD. EQUIPO:"></Column>
        <Column field="deleteResult" header="ELIMINACIÓN:"></Column>
      </DataTable>
      <div className="buttons">
        <Button
          label="Aceptar"
          onClick={onClose}
          loading={isDeleting}
          disabled={isDeleting}
          className="button"
          loadingIcon="pi pi-spin pi-spinner"
          iconPos="right"
          icon="pi pi-thrash"
          type="submit"
        />
      </div>
    </Dialog>
  )
}

export default DeleteAssignmentsModal

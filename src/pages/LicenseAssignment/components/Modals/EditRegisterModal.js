import { Dialog } from 'primereact/dialog'
import { useContext, useRef, useState } from 'react'
import Steps from 'components/Steps'
import { AcceptModal } from 'components/Modals'
import { LicenseService } from 'services'
import useToast from 'hooks/useToast'
import { UserContext } from 'context'
import { getDefaultBinnacle } from 'hooks/useBinnacleForm'
import useCache from 'hooks/useCache'
import { ERRORS_MSG } from 'utils/exceptions'
import { AssignmentForm, ConfirmEditForm } from '../Forms'

const VIEWS = {
  ASSIGN: 1,
  MODIFICATION: 2,
  ACCEPT: 3
}

function EditRegisterModal({ onClose, isVisible, defaultFields, updateAssignment }) {
  const defaultBinnacleFields = getDefaultBinnacle(defaultFields)
  const newFormCache = useCache()
  const oldFormCache = useCache()
  const [isMutating, setIsMutating] = useState(false)
  const dialogClosedRef = useRef(false)
  const [userInfo] = useContext(UserContext)
  const [view, setView] = useState(VIEWS.ASSIGN)
  const toast = useToast()
  const onStepClick = index => {
    if (index === 0) {
      setView(VIEWS.ASSIGN)
    }
  }
  const header = (
    <div>
      <Steps
        activeIndex={view === VIEWS.ASSIGN ? 0 : 1}
        labels={['Editar licencia', 'Confirmar modificación']}
        onStepClick={onStepClick}
      />
    </div>
  )
  const updateFields = formData => {
    newFormCache.update(formData)
    setView(VIEWS.MODIFICATION)
  }
  const registerData = async formData => {
    newFormCache.update(formData)
    const { prevFields, ...newData } = newFormCache.get()
    const didChange = JSON.stringify(oldFormCache.get()) !== JSON.stringify(newData)
    if (!didChange) {
      toast.error(ERRORS_MSG.NO_CHANGED_VALUE)
      return
    }
    const editionData = { ...defaultFields, ...newData }
    setIsMutating(true)
    try {
      const adminUser = userInfo.user
      await LicenseService.assignments.put({
        ...editionData,
        adminUser,
        assignType: editionData.assignType.value
      })
      updateAssignment()
      setView(VIEWS.ACCEPT)
    } catch (e) {
      toast.error(String(e))
    } finally {
      setIsMutating(false)
    }
  }
  const handleError = errors => {
    const messages = Object.values(errors)
      .slice(0, 4)
      .map(e => e.message)
    toast.error(messages)
  }
  return view === VIEWS.ACCEPT ? (
    <AcceptModal
      onClose={() => {
        newFormCache.clear()
        onClose()
        setView(VIEWS.ASSIGN)
      }}
      isVisible={isVisible}
      acceptLabel="Entendido"
    >
      Registro guardado con éxito
    </AcceptModal>
  ) : (
    <Dialog
      className="dialog add-license-dialog"
      visible={isVisible}
      modal
      draggable={false}
      onHide={() => {
        if (!isMutating) {
          onClose()
        }
      }}
      header={header}
      transitionOptions={{
        onExited: () => {
          dialogClosedRef.current = true
          newFormCache.clear()
          setView(VIEWS.ASSIGN)
        },
        onEntered: () => {
          dialogClosedRef.current = false
        }
      }}
    >
      {view === VIEWS.ASSIGN && (
        <AssignmentForm
          onSubmitFields={updateFields}
          handleError={handleError}
          submitFields={newFormCache.get()}
          saveDefault={formData => oldFormCache.update(formData)}
          defaultFields={defaultFields}
          isEditing={true}
        />
      )}
      {view === VIEWS.MODIFICATION && (
        <ConfirmEditForm
          onSubmitFields={registerData}
          handleError={handleError}
          submitFields={newFormCache.get()}
          disabled={isMutating}
          defaultFields={defaultBinnacleFields}
          saveDefault={formData => oldFormCache.update(formData)}
          keepSubmitFields={formData => {
            if (!dialogClosedRef.current) {
              newFormCache.update(formData)
            }
          }}
        />
      )}
    </Dialog>
  )
}

export default EditRegisterModal

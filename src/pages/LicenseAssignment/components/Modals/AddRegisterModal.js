import { Dialog } from 'primereact/dialog'
import { useContext, useRef, useState } from 'react'
import Steps from 'components/Steps'
import { LicenseService } from 'services'
import useToast from 'hooks/useToast'
import { UserContext } from 'context'
import useCache from 'hooks/useCache'
import { AssignmentForm, ConfirmEditForm, UserForm } from '../Forms'

const VIEWS = {
  RESPONSIBLE: 0,
  ASSIGN: 1,
  ACCEPT: 2
}

function AddRegisterModal({ onClose, isVisible }) {
  const newFormCache = useCache()
  const [isMutating, setIsMutating] = useState(false)
  const dialogClosedRef = useRef(false)
  const [userInfo] = useContext(UserContext)
  const toast = useToast()
  const [stepIndex, setStepIndex] = useState(VIEWS.RESPONSIBLE)

  const onStepClick = index => {
    if (index < stepIndex) {
      setStepIndex(index)
    }
  }

  const header = (
    <div>
      <Steps
        activeIndex={stepIndex}
        labels={['Asignar Responsable', 'Asignar licencia', 'Confirmar']}
        onStepClick={onStepClick}
      />
    </div>
  )

  const registerData = async formData => {
    const addedData = { ...newFormCache.get(), ...formData }
    setIsMutating(true)
    const { prevFields } = addedData
    try {
      const adminUser = userInfo.user
      if (!prevFields) {
        await LicenseService.assignments.post({ ...addedData, adminUser: userInfo.user })
      } else {
        await LicenseService.assignments.put({
          ...prevFields,
          ...addedData,
          adminUser,
          assignType: prevFields.assignType.value
        })
      }
      toast.success('Asignación creada con éxito')
      onClose()
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

  return (
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
          setStepIndex(VIEWS.RESPONSIBLE)
          newFormCache.clear()
        },
        onEntered: () => {
          dialogClosedRef.current = false
        }
      }}
    >
      {stepIndex === VIEWS.RESPONSIBLE && (
        <UserForm
          onSubmitFields={formData => {
            newFormCache.update(formData)
            setStepIndex(VIEWS.ASSIGN)
          }}
          handleError={handleError}
          submitFields={newFormCache.get()}
        />
      )}
      {stepIndex === VIEWS.ASSIGN && (
        <AssignmentForm
          onSubmitFields={formData => {
            newFormCache.update(formData)
            setStepIndex(VIEWS.ACCEPT)
          }}
          defaultFields={{ personId: newFormCache.get()?.personId }}
          handleError={handleError}
          submitFields={newFormCache.get()}
        />
      )}
      {stepIndex === VIEWS.ACCEPT && (
        <ConfirmEditForm
          onSubmitFields={registerData}
          handleError={handleError}
          submitFields={newFormCache.get()}
          disabled={isMutating}
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

export default AddRegisterModal

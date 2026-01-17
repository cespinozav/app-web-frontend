import { Dialog } from 'primereact/dialog'
import { useContext, useRef, useState } from 'react'
import Steps from 'components/Steps'
import { AssetService } from 'services'
import useToast from 'hooks/useToast'
import { UserContext } from 'context'
import { AssignmentForm, ConfirmEditForm, UserForm } from '../Forms'

const VIEWS = {
  RESPONSIBLE: 0,
  ASSIGN: 1,
  ACCEPT: 2
}

function AddRegisterModal({ onClose, isVisible }) {
  const formDataRef = useRef({ user: null, assign: null, binnacle: null })
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
        labels={['Asignar Responsable', 'Asignar activo', 'Confirmar']}
        onStepClick={onStepClick}
      />
    </div>
  )
  const registerData = async formData => {
    const addedData = { ...formDataRef.current.user, ...formDataRef.current.assign, ...formData }
    setIsMutating(true)
    try {
      const adminUser = userInfo.user
      await AssetService.assignments.post({ ...addedData, adminUser })
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
          formDataRef.current = { user: null, assign: null, binnacle: null }
        },
        onEntered: () => {
          dialogClosedRef.current = false
        }
      }}
    >
      {stepIndex === VIEWS.RESPONSIBLE && (
        <UserForm
          onSubmitFields={formData => {
            formDataRef.current.user = formData
            setStepIndex(VIEWS.ASSIGN)
          }}
          handleError={handleError}
          submitFields={formDataRef.current.user}
        />
      )}
      {stepIndex === VIEWS.ASSIGN && (
        <AssignmentForm
          onSubmitFields={formData => {
            formDataRef.current.assign = formData
            setStepIndex(VIEWS.ACCEPT)
          }}
          handleError={handleError}
          submitFields={formDataRef.current.assign}
        />
      )}
      {stepIndex === VIEWS.ACCEPT && (
        <ConfirmEditForm
          onSubmitFields={registerData}
          handleError={handleError}
          submitFields={formDataRef.current.binnacle}
          disabled={isMutating}
          keepSubmitFields={formData => {
            if (!dialogClosedRef.current) {
              formDataRef.current.binnacle = formData
            }
          }}
        />
      )}
    </Dialog>
  )
}

export default AddRegisterModal

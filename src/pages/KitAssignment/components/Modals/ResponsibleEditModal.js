import { Dialog } from 'primereact/dialog'
import { useContext, useRef, useState } from 'react'
import Steps from 'components/Steps'
import { AcceptModal } from 'components/Modals'
import { KitService } from 'services'
import useToast from 'hooks/useToast'
import { UserContext } from 'context'
import { capitalize } from 'utils/misc'
import useCache from 'hooks/useCache'
import { ERRORS_MSG } from 'utils/exceptions'
import { getDefaultBinnacle } from 'hooks/useBinnacleForm'
import { ConfirmEditForm, UserForm } from '../Forms'

const VIEWS = {
  ASSIGN: 1,
  MODIFICATION: 2,
  ACCEPT: 3
}

function getDefaultValues(defaultFields) {
  const { assignType, names, lastnameP, lastnameM, dni, cecoCode, cecoDesc, job, personId, assignTo, email } =
    defaultFields
  const name = `${capitalize(lastnameP)} ${capitalize(lastnameM)}, ${capitalize(names)} `
  const assignTypeVal = assignType.value
  return {
    dni,
    name,
    ceco: cecoCode,
    job,
    cecoDesc,
    assignType: assignTypeVal,
    assignTo: assignTypeVal === 'T' ? name : assignTo,
    email,
    personId
  }
}

function ResponsibleEditModal({ onClose, isVisible, defaultFields, updateAssignment }) {
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
        labels={['Editar Responsable', 'Confirmar modificación']}
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
    const newData = newFormCache.get()
    const didChange = JSON.stringify(oldFormCache.get()) !== JSON.stringify(newData)
    if (!didChange) {
      toast.error(ERRORS_MSG.NO_CHANGED_VALUE)
      return
    }
    setIsMutating(true)
    try {
      const editionData = {
        ...defaultFields,
        ...newData,
        id: defaultFields.id,
        contractNum: defaultFields.contract.id,
        planId: defaultFields.plan.id,
        additional1: defaultFields?.additional1?.id,
        additional2: defaultFields?.additional2?.id,
        kitStatus: defaultFields.kitStatus?.value,
        lineStatus: defaultFields.lineStatus?.value
      }
      const adminUser = userInfo.user
      await KitService.assignments.put({
        ...editionData,
        adminUser
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
      className="dialog add-kit-dialog"
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
        <UserForm
          onSubmitFields={updateFields}
          handleError={handleError}
          defaultFields={getDefaultValues(defaultFields)}
          submitFields={newFormCache.get()}
          saveDefault={formData => oldFormCache.update(formData)}
        />
      )}
      {view === VIEWS.MODIFICATION && (
        <ConfirmEditForm
          onSubmitFields={registerData}
          handleError={handleError}
          submitFields={newFormCache.get()}
          defaultFields={defaultBinnacleFields}
          saveDefault={formData => oldFormCache.update(formData)}
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

export default ResponsibleEditModal

import { Dialog } from 'primereact/dialog'
import { useContext, useRef, useState } from 'react'
import Steps from 'components/Steps'
import { AcceptModal } from 'components/Modals'
import { AssetService } from 'services'
import useToast from 'hooks/useToast'
import { UserContext } from 'context'
import { ERRORS_MSG } from 'utils/exceptions'
import useCache from 'hooks/useCache'
import { getDefaultBinnacle } from 'hooks/useBinnacleForm'
import { AssignmentForm, ConfirmEditForm } from '../Forms'

const VIEWS = {
  ASSIGN: 1,
  MODIFICATION: 2,
  ACCEPT: 3
}

function getDefaultValues(defaultFields) {
  return {
    ...defaultFields,
    // assetCode: defaultFields.assetCode,
    brand: String(defaultFields.brand.value),
    // description: defaultFields.description,
    disk: defaultFields.diskDrive?.value,
    domain: defaultFields.domain?.value,
    // endDate: defaultFields.endDate,
    inches: defaultFields.inches?.value,
    // ip: defaultFields.ip,
    leasingId: defaultFields.leasing.value,
    mac: defaultFields.mac,
    memory: defaultFields.memory?.value,
    model: defaultFields.model.value,
    // observation: defaultFields.observation,
    operatingSystem: defaultFields.operatingSystem?.value,
    // permission: defaultFields.exitPermit,
    processor: defaultFields.processor?.value,
    seat: defaultFields.seat.value,
    // serialNum: defaultFields.serialNum,
    situation: defaultFields.situation.value,
    startDate: defaultFields.startDate,
    status: defaultFields.status.value,
    type: defaultFields.assetType.value
  }
}

function EditRegisterModal({ onClose, isVisible, defaultFields, updateAssignment }) {
  const defaultAssignFields = getDefaultValues(defaultFields)
  const defaultBinnacleFields = getDefaultBinnacle(defaultFields)

  const newFormCache = useCache()
  const oldFormCache = useCache()
  const dialogClosedRef = useRef(false)
  const [userInfo] = useContext(UserContext)
  const [view, setView] = useState(VIEWS.ASSIGN)
  const [isMutating, setIsMutating] = useState(false)
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
        labels={['Editar activo', 'Confirmar modificación']}
        onStepClick={onStepClick}
      />
    </div>
  )
  const updateFields = newFormData => {
    newFormCache.update(newFormData)
    setView(VIEWS.MODIFICATION)
  }
  const registerData = async newFormData => {
    newFormCache.update(newFormData)
    const newData = newFormCache.get()
    const didChange = JSON.stringify(oldFormCache.get()) !== JSON.stringify(newData)
    if (!didChange) {
      toast.error(ERRORS_MSG.NO_CHANGED_VALUE)
      return
    }
    setIsMutating(true)
    try {
      const adminUser = userInfo.user
      await AssetService.assignments.put({
        ...defaultFields,
        ...newData,
        adminUser,
        assignType: defaultFields.assignType.value
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
          defaultFields={defaultAssignFields}
          saveDefault={formData => oldFormCache.update(formData)}
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

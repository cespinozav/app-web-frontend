import { Dialog } from 'primereact/dialog'
import { useContext, useState } from 'react'
import useToast from 'hooks/useToast'
import { UserContext } from 'context'
import Steps from 'components/Steps'
import { LicenseService } from 'services'
import useCache from 'hooks/useCache'
import { FileLoadForm, LicensesLoadForm, ObservationsForm } from '../Forms'

const VIEWS = {
  LOAD: 0,
  POST: 1,
  OBSERVATIONS: 2,
}

function MassiveLoadModal({ onClose, isVisible }) {
  const [isMutating, setIsMutating] = useState(false)
  const newFormCache = useCache()
  const resultsCache = useCache()

  const [userInfo] = useContext(UserContext)
  const [stepIndex, setStepIndex] = useState(VIEWS.LOAD)
  const toast = useToast()
  const onStepClick = (index) => {
    if (index < stepIndex && !isMutating) {
      setStepIndex(index)
    }
  }
  const header = (
    <div>
      <Steps
        activeIndex={stepIndex}
        labels={['Carga de archivo', 'Carga de licencias']}
        onStepClick={onStepClick}
      />
    </div>
  )

  const onValidate = (formData) => {
    newFormCache.update(formData)
    setIsMutating(true)
    LicenseService.massiveLoad
      .validate({ document: formData.document[0] })
      .then((res) => {
        newFormCache.update({ validation: res })
        setStepIndex(VIEWS.POST)
      })
      .catch((err) => {
        toast.error(String(err))
      })
      .finally(() => {
        setIsMutating(false)
      })
  }
  const onLoad = (formData) => {
    setIsMutating(true)
    const rows = newFormCache.get().validation
    LicenseService.massiveLoad
      .load({ rows, userCreated: userInfo.user, mode: formData.mode })
      .then((result) => {
        resultsCache.update({ result })
        setStepIndex(VIEWS.OBSERVATIONS)
      })
      .catch((err) => {
        toast.error(String(err))
      })
      .finally(() => {
        setStepIndex(VIEWS.OBSERVATIONS)
        setIsMutating(false)
      })
  }
  const handleError = (errors) => {
    if (typeof errors === 'object') {
      const messages = Object.values(errors)
        .slice(0, 4)
        .map((e) => e.message)
      toast.error(messages)
    } else {
      toast.error(errors)
    }
  }
  return stepIndex === VIEWS.OBSERVATIONS ? (
    <Dialog
      className="dialog add-license-dialog confirm"
      visible={isVisible}
      modal
      draggable={false}
      onHide={() => {
        onClose()
      }}
      header={<h2>Resultado de carga masiva</h2>}
      transitionOptions={{
        onExited: () => {
          newFormCache.clear()
          resultsCache.clear()
          setStepIndex(VIEWS.LOAD)
        },
      }}
    >
      <ObservationsForm
        validatedData={resultsCache.get().result}
        onClose={onClose}
      />
    </Dialog>
  ) : (
    <Dialog
      className="dialog add-license-dialog massive"
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
          newFormCache.clear()
          setStepIndex(VIEWS.LOAD)
        },
      }}
    >
      {stepIndex === VIEWS.LOAD && (
        <FileLoadForm
          onSubmitFields={onValidate}
          submitFields={newFormCache.get()}
          isMutating={isMutating}
          handleError={handleError}
        />
      )}
      {stepIndex === VIEWS.POST && (
        <LicensesLoadForm
          validatedData={newFormCache.get().validation}
          onSubmitFields={onLoad}
          isMutating={isMutating}
          handleError={handleError}
        />
      )}
    </Dialog>
  )
}

export default MassiveLoadModal
